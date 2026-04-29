import path from 'path';
import dotenv from 'dotenv';

// Canonical .env location: always resolve to `congress/.env`.
// In dev:  __dirname = congress/server/src            -> ../../.env = congress/.env
// In prod: __dirname = /app/server/dist (container)   -> ../../.env = /app/.env (volume-mounted)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import express from 'express';
import cors from 'cors';
import billsRouter from './routes/bills';
import keywordsRouter from './routes/keywords';

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '10mb' }));

app.use('/api/bills', billsRouter);
app.use('/api/keywords', keywordsRouter);

if (process.env.NODE_ENV === 'production') {
  const distPath = path.resolve(__dirname, '../../dist');
  app.use(express.static(distPath));
  app.get(/^(?!\/api\/).*/, (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

const PORT = Number(process.env.PORT) || 4568;
app.listen(PORT, () => {
  console.log(`congress api listening on :${PORT}`);
});
