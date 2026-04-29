import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { pool, query } from '../db';

const router = Router();

interface KeywordRow { keyword: string; group: string; }
interface KeywordGroup { label: string; keywords: string[]; }

function groupRows(rows: KeywordRow[]): KeywordGroup[] {
  const map = new Map<string, string[]>();
  for (const r of rows) {
    if (!map.has(r.group)) map.set(r.group, []);
    map.get(r.group)!.push(r.keyword);
  }
  return Array.from(map.entries()).map(([label, keywords]) => ({ label, keywords }));
}

async function fetchGrouped(): Promise<KeywordGroup[]> {
  const rows = await query<KeywordRow>(
    'SELECT keyword, `group` AS `group` FROM keywords ORDER BY `group` ASC, keyword ASC',
  );
  return groupRows(rows);
}

router.get('/', async (_req: Request, res: Response) => {
  try {
    const groups = await fetchGrouped();
    res.json({ groups });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

const replaceSchema = z.object({
  keywords: z
    .array(
      z.object({
        keyword: z.string(),
        group: z.string().optional().default(''),
      }),
    )
    .max(50000),
});

function normalize(input: { keyword: string; group?: string }[]): KeywordRow[] {
  const seen = new Set<string>();
  const out: KeywordRow[] = [];
  for (const raw of input) {
    const keyword = (raw.keyword ?? '').trim();
    if (!keyword) continue;
    let group = (raw.group ?? '').trim();
    if (!group) group = 'general';
    if (keyword.length > 255 || group.length > 255) continue;
    const key = `${keyword.toLowerCase()}|${group.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ keyword, group });
  }
  return out;
}

router.post('/replace', async (req: Request, res: Response) => {
  const parsed = replaceSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.message });
  }

  const rows = normalize(parsed.data.keywords);

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query('TRUNCATE TABLE keywords');
    if (rows.length > 0) {
      const values = rows.map(r => [r.keyword, r.group]);
      for (let i = 0; i < values.length; i += 1000) {
        const chunk = values.slice(i, i + 1000);
        await conn.query('INSERT INTO keywords (keyword, `group`) VALUES ?', [chunk]);
      }
    }
    await conn.commit();
  } catch (e: any) {
    try { await conn.rollback(); } catch { /* TRUNCATE auto-commits; rollback may be a no-op */ }
    conn.release();
    return res.status(500).json({ error: e.message });
  }
  conn.release();

  try {
    const groups = await fetchGrouped();
    res.json({ inserted: rows.length, groups });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
