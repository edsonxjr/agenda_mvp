// 1. Importe 'express' E também os tipos 'Request' e 'Response'
// CORRETO:
import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// 2. Use os tipos que importamos
app.get('/', (req: Request, res: Response) => {
  return res.json({ message: 'API da Agenda está rodando!' });
});

app.listen(port, () => {
  console.log(`🚀 Servidor backend rodando na porta ${port}`);
});