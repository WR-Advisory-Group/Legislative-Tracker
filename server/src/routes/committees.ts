import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { query } from '../db';
import type { Committee, CommitteesSearchResponse } from '../types';

const router = Router();

const BILL_NO_REGEX = /^[SH]BN[\s-]?\d+$/i;

function normalizeBillNo(raw: string): string {
  // Trimmed input is already known to match BILL_NO_REGEX. Force canonical form: "SBN-1234" / "HBN-1234".
  const compact = raw.replace(/\s+/g, '').toUpperCase();
  // compact is now either "SBN1234" or "SBN-1234" (dashes preserved). Re-insert single dash.
  return compact.replace(/^([SH]BN)-?(\d+)$/, '$1-$2');
}

const searchQuerySchema = z.object({
  q: z.string().default(''),
  monitor: z.enum(['0', '1']).optional(),
});

router.get('/search', async (req: Request, res: Response) => {
  const parsed = searchQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ detail: parsed.error.flatten() });
  }
  const { monitor } = parsed.data;
  const q = parsed.data.q.trim();

  const conditions: string[] = [];
  const params: unknown[] = [];

  try {
    if (q && BILL_NO_REGEX.test(q)) {
      // Bill-no path: resolve bill -> candidate committee strings -> match against committees table.
      const billNo = normalizeBillNo(q);
      const billRows = await query<{ primaryCommittee: string | null; secondaryCommittee: string | null }>(
        'SELECT primaryCommittee, secondaryCommittee FROM bills WHERE no = ? LIMIT 1',
        [billNo],
      );
      const candidates: string[] = [];
      if (billRows.length > 0) {
        const { primaryCommittee, secondaryCommittee } = billRows[0];
        if (primaryCommittee) candidates.push(primaryCommittee.trim());
        if (secondaryCommittee) {
          for (const part of secondaryCommittee.split(',')) {
            const trimmed = part.trim();
            if (trimmed) candidates.push(trimmed);
          }
        }
      }
      const dedup = Array.from(new Set(candidates.filter(Boolean)));

      if (dedup.length === 0) {
        const body: CommitteesSearchResponse = { data: [] };
        return res.json(body);
      }

      // Substring-match in either direction for any candidate.
      const orParts = dedup
        .map(() => '(name LIKE CONCAT(\'%\', ?, \'%\') OR ? LIKE CONCAT(\'%\', name, \'%\'))')
        .join(' OR ');
      conditions.push(`(${orParts})`);
      for (const c of dedup) {
        params.push(c, c);
      }
    } else if (q) {
      // Code/name path: substring match on either column.
      conditions.push('(code LIKE ? OR name LIKE ?)');
      params.push(`%${q}%`, `%${q}%`);
    }

    if (monitor !== undefined) {
      conditions.push('monitor = ?');
      params.push(Number(monitor));
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const sql = `SELECT code, name, monitor FROM committees ${whereClause} ORDER BY name ASC`;
    const rows = await query<Committee>(sql, params);

    const body: CommitteesSearchResponse = { data: rows };
    return res.json(body);
  } catch (e: any) {
    console.error('[committees/search] error:', e);
    return res.status(500).json({ detail: String(e?.message ?? e) });
  }
});

const monitorBodySchema = z.object({
  monitor: z.union([z.literal(0), z.literal(1)]),
});

router.patch('/:code/monitor', async (req: Request, res: Response) => {
  const code = String(req.params.code ?? '');
  if (!code || code.length > 20) {
    return res.status(400).json({ error: 'invalid code' });
  }
  const parsed = monitorBodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.message });
  }
  try {
    await query('UPDATE committees SET monitor = ? WHERE code = ?', [parsed.data.monitor, code]);
    return res.status(204).end();
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

export default router;
