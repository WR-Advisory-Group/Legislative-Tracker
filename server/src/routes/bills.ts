import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { query } from '../db';
import type { Bill, BillsSearchResponse, FilterOptions } from '../types';

const router = Router();

const SORT_WHITELIST = new Set(['dateFiled', 'no', 'title', 'legislativeStatusDate']);

const SORT_COL_MAP: Record<string, string> = {
  dateFiled: 'b.dateFiled',
  no: 'b.no',
  title: 'b.title',
  legislativeStatusDate: 'b.legislativeStatusDate',
};

const SELECT_COLS =
  'b.id, b.type, b.no, b.title, b.longTitle, b.dateFiled, ' +
  'COALESCE(a.name, b.author) AS author, b.coAuthor, ' +
  'b.primaryCommittee, b.secondaryCommittee, b.legislativeStatus, ' +
  'b.legislativeStatusDate, b.pdfUrl, b.congress, b.permalink, b.monitor';

const FROM_CLAUSE = 'FROM bills b LEFT JOIN authors a ON b.author = a.code';

const searchQuerySchema = z.object({
  q: z.string().default(''),
  congress: z.string().optional(),
  type: z.string().optional(),
  author: z.string().optional(),
  primary_committee: z.string().optional(),
  legislative_status: z.string().optional(),
  monitor: z.enum(['0', '1']).optional(),
  sort_by: z.string().default('dateFiled'),
  sort_order: z.string().default('DESC'),
  page: z.coerce.number().int().min(1).default(1),
  per_page: z.coerce.number().int().min(1).max(200).default(50),
});

router.get('/search', async (req: Request, res: Response) => {
  const parsed = searchQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ detail: parsed.error.flatten() });
  }
  const {
    q,
    congress,
    type,
    monitor,
    author,
    primary_committee,
    legislative_status,
    page,
    per_page,
  } = parsed.data;

  const sort_by = SORT_COL_MAP[SORT_WHITELIST.has(parsed.data.sort_by) ? parsed.data.sort_by : 'dateFiled'];
  const sort_order = parsed.data.sort_order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  const conditions: string[] = [];
  const params: unknown[] = [];

  if (q) {
    conditions.push('(no REGEXP ? OR title REGEXP ? OR longTitle REGEXP ?)');
    params.push(q, q, q);
  }
  if (congress) {
    conditions.push('congress = ?');
    params.push(congress);
  }
  if (type) {
    conditions.push('type = ?');
    params.push(type);
  }
  if (monitor !== undefined) {
    conditions.push('b.monitor = ?');
    params.push(Number(monitor));
  }
  if (author) {
    conditions.push('(b.author LIKE ? OR a.name LIKE ? OR b.sponsor_name LIKE ?)');
    params.push(`%${author}%`, `%${author}%`, `%${author}%`);
  }
  if (primary_committee) {
    conditions.push('primaryCommittee = ?');
    params.push(primary_committee);
  }
  if (legislative_status) {
    conditions.push('legislativeStatus = ?');
    params.push(legislative_status);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  try {
    const countRows = await query<{ total: number }>(
      `SELECT COUNT(*) AS total ${FROM_CLAUSE} ${whereClause}`,
      params,
    );
    const total = Number(countRows[0]?.total ?? 0);

    const offset = (page - 1) * per_page;
    const dataSql =
      `SELECT ${SELECT_COLS} ${FROM_CLAUSE} ${whereClause} ` +
      `ORDER BY ${sort_by} ${sort_order} ` +
      `LIMIT ? OFFSET ?`;
    const rows = await query<Bill>(dataSql, [...params, per_page, offset]);

    const body: BillsSearchResponse = {
      data: rows,
      pagination: {
        page,
        per_page,
        total,
        total_pages: Math.max(1, Math.ceil(total / per_page)),
      },
    };
    return res.json(body);
  } catch (e: any) {
    console.error('[bills/search] error:', e);
    return res.status(500).json({ detail: String(e?.message ?? e) });
  }
});

router.get('/filter-options', async (_req: Request, res: Response) => {
  const distinct = async (col: string): Promise<string[]> => {
    const rows = await query<Record<string, string>>(
      `SELECT DISTINCT \`${col}\` FROM bills ` +
        `WHERE \`${col}\` IS NOT NULL AND \`${col}\` != '' ` +
        `ORDER BY \`${col}\``,
    );
    return rows.map((r) => r[col]);
  };

  try {
    const congresses = await distinct('congress');
    const types = await distinct('type');
    const primary_committees = await distinct('primaryCommittee');
    const legislative_statuses = await distinct('legislativeStatus');

    const authorRows = await query<{ name: string }>(
      'SELECT DISTINCT COALESCE(a.name, b.author) AS name ' +
        'FROM bills b LEFT JOIN authors a ON b.author = a.code ' +
        "WHERE b.author IS NOT NULL AND b.author != '' " +
        'UNION ' +
        'SELECT DISTINCT sponsor_name AS name FROM bills ' +
        "WHERE sponsor_name IS NOT NULL AND sponsor_name != '' " +
        'ORDER BY name',
    );
    const authors = authorRows.map((r) => r.name);

    const body: FilterOptions = {
      congresses,
      types,
      primary_committees,
      legislative_statuses,
      authors,
    };
    return res.json(body);
  } catch (e: any) {
    console.error('[bills/filter-options] error:', e);
    return res.status(500).json({ detail: String(e?.message ?? e) });
  }
});

const monitorBodySchema = z.object({
  monitor: z.union([z.literal(0), z.literal(1)]),
});

router.patch('/:id/monitor', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'invalid id' });
  }
  const parsed = monitorBodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.message });
  }
  try {
    await query('UPDATE bills SET monitor = ? WHERE id = ?', [parsed.data.monitor, id]);
    return res.status(204).end();
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
});

export default router;
