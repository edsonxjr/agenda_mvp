import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import knex from './database/index';
import multer from 'multer';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Extensão do tipo Request para incluir o ID do usuário logado
interface AuthRequest extends Request {
  userId?: number;
}

const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = 'minha_chave_super_secreta_do_edson';

// --- CONFIGURAÇÃO DO MULTER (Upload de Fotos) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });
app.use('/uploads', express.static('uploads'));

// --- MIDDLEWARE DE PROTEÇÃO ---
const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Token não fornecido.' });

  const [, token] = authHeader.split(' ');
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido.' });
  }
};

// --- ROTAS DE AUTENTICAÇÃO ---

// Registro com foto de perfil
app.post('/api/auth/register', upload.single('photo'), async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await knex('users').where({ email }).first();
    if (userExists) return res.status(409).json({ message: 'E-mail já cadastrado.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const photo_path = req.file ? req.file.path : null;

    await knex('users').insert({
      name,
      email,
      password: hashedPassword,
      photo_path
    });

    return res.status(201).json({ message: 'Usuário criado com sucesso!' });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao registrar usuário.' });
  }
});

// Login devolvendo o link da foto
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await knex('users').where({ email }).first();

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });

    return res.json({
      token,
      name: user.name,
      photo_path: user.photo_path
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erro no login.' });
  }
});

// --- ROTAS DE CONTATOS (Privadas) ---

app.get('/api/contacts', authMiddleware, async (req: AuthRequest, res: Response) => {
  const contacts = await knex('contacts')
    .leftJoin('categories', 'contacts.category_id', 'categories.id')
    .select('contacts.*', 'categories.name as category_name')
    .where('contacts.user_id', req.userId);
  return res.json(contacts);
});

app.post('/api/contacts', authMiddleware, upload.single('photo'), async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, phone, is_favorite, category_id } = req.body;
    const photo_path = req.file ? req.file.path : null;

    await knex('contacts').insert({
      name, email, phone,
      is_favorite: is_favorite === 'true' || is_favorite === true,
      category_id: (category_id && category_id !== 'null') ? Number(category_id) : null,
      photo_path,
      user_id: req.userId
    });

    return res.status(201).json({ message: 'Contato criado!' });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao criar contato.' });
  }
});

// Rota PUT com correção para o bug de favoritos
app.put('/api/contacts/:id', authMiddleware, upload.single('photo'), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, phone, is_favorite, category_id } = req.body;

    const updateData: any = {
      name,
      email,
      phone,
      is_favorite: is_favorite === 'true' || is_favorite === true,
      category_id: (category_id && category_id !== 'null') ? Number(category_id) : null
    };

    if (req.file) updateData.photo_path = req.file.path;

    const updated = await knex('contacts')
      .where({ id, user_id: req.userId })
      .update(updateData);

    if (!updated) return res.status(404).json({ message: 'Contato não encontrado.' });
    return res.json({ message: 'Atualizado com sucesso!' });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao atualizar.' });
  }
});

app.delete('/api/contacts/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  await knex('contacts').where({ id: req.params.id, user_id: req.userId }).del();
  return res.status(204).send();
});

app.get('/api/stats', authMiddleware, async (req: AuthRequest, res: Response) => {
  const stats = await knex('contacts')
    .leftJoin('categories', 'contacts.category_id', 'categories.id')
    .select('categories.name as category')
    .count('contacts.id as total')
    .where('contacts.user_id', req.userId)
    .groupBy('categories.name');
  return res.json(stats);
});

app.get('/api/categories', async (req, res) => {
  const cats = await knex('categories').select('*');
  return res.json(cats);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));