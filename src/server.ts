import express, { Request, Response } from 'express';
import cors from 'cors';
import { z } from 'zod';
import knex from './database/index'; // Verifique se o caminho está certo no seu projeto
import multer from 'multer'; // <--- NOVO
import path from 'path';     // <--- NOVO

const app = express();

app.use(express.json());
app.use(cors());

// --- CONFIGURAÇÃO DO MULTER (UPLOAD DE FOTOS) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Salva na pasta uploads
  },
  filename: (req, file, cb) => {
    // Gera nome único: data + numero aleatorio + extensao (.jpg)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// --- LIBERAR ACESSO ÀS FOTOS ---
app.use('/uploads', express.static('uploads'));

// --- SCHEMAS DE VALIDAÇÃO (ZOD) ---

// Ajustei is_favorite para aceitar string "true"/"false" do formulário
const contactSchema = z.object({
  name: z.string().trim().min(3, 'O nome deve ter pelo menos 3 letras'),
  email: z.string().trim().toLowerCase().email('Formato de e-mail inválido'),
  phone: z.string().trim().regex(/^\d{10,11}$/, 'O telefone deve ter 10 ou 11 números'),
  // O formulário envia "true" ou "false" como texto, então usamos coerce ou transform
  is_favorite: z.preprocess((val) => val === 'true' || val === true, z.boolean()).optional(),
  category_id: z.coerce.number().optional().nullable()
});

const idSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID inválido').transform(Number)
});

// --- ROTAS ---

app.get('/', (req: Request, res: Response) => {
  return res.json({ message: 'API da Agenda está rodando!' });
});

// Listar Categorias
app.get('/api/categories', async (req: Request, res: Response) => {
  const categories = await knex('categories').select('*');
  return res.json(categories);
});

// Listar Contatos
app.get('/api/contacts', async (req: Request, res: Response) => {
  const contacts = await knex('contacts')
    .leftJoin('categories', 'contacts.category_id', 'categories.id')
    .select('contacts.*', 'categories.name as category_name');
  return res.json(contacts);
});

// ROTA [POST] - Criar novo (COM FOTO)
// upload.single('photo') intercepta o arquivo antes da gente
app.post('/api/contacts', upload.single('photo'), async (request: Request, response: Response) => {
  try {
    // 1. Validação Zod
    const data = contactSchema.parse(request.body);
    const { name, email, phone, is_favorite, category_id } = data;

    // 2. Integridade
    const emailExists = await knex('contacts').where('email', email).first();
    if (emailExists) return response.status(409).json({ message: 'E-mail já cadastrado.' });

    const phoneExists = await knex('contacts').where('phone', phone).first();
    if (phoneExists) return response.status(409).json({ message: 'Telefone já cadastrado.' });

    // 3. Pega o caminho da foto (se enviada)
    const photo_path = request.file ? request.file.path : null;

    // 4. Salva no banco
    await knex('contacts').insert({
      name, email, phone, is_favorite, category_id, photo_path
    });

    return response.status(201).json({ message: 'Contato criado com sucesso!' });

  } catch (error: any) {
    if (error instanceof z.ZodError) return response.status(400).json({ message: error.issues[0].message });
    console.log(error);
    return response.status(500).json({ message: 'Erro ao cadastrar.' });
  }
});

// ROTA [PUT] - Atualizar (COM FOTO)
app.put('/api/contacts/:id', upload.single('photo'), async (request: Request, response: Response) => {
  try {
    const { id } = idSchema.parse(request.params);
    const data = contactSchema.parse(request.body);
    const { name, email, phone, is_favorite, category_id } = data;

    // Verifica duplicidade (excluindo o próprio ID)
    const emailExists = await knex('contacts').where('email', email).whereNot('id', id).first();
    if (emailExists) return response.status(409).json({ message: 'E-mail em uso.' });

    const phoneExists = await knex('contacts').where('phone', phone).whereNot('id', id).first();
    if (phoneExists) return response.status(409).json({ message: 'Telefone em uso.' });

    // Prepara objeto de atualização
    const updateData: any = { name, email, phone, is_favorite, category_id };

    // Só atualiza a foto se o usuário enviou uma nova
    if (request.file) {
      updateData.photo_path = request.file.path;
    }

    await knex('contacts').where('id', id).update(updateData);

    return response.json({ message: 'Contato atualizado!' });

  } catch (error: any) {
    if (error instanceof z.ZodError) return response.status(400).json({ message: error.issues[0].message });
    console.log(error);
    return response.status(500).json({ message: 'Erro ao atualizar.' });
  }
});

// ROTA [DELETE]
app.delete('/api/contacts/:id', async (request: Request, response: Response) => {
  try {
    const { id } = idSchema.parse(request.params);
    await knex('contacts').where('id', id).del();
    return response.status(204).send();
  } catch (error: any) {
    return response.status(500).json({ message: 'Erro ao deletar.' });
  }
});

// ROTA [GET ÚNICO]
app.get('/api/contacts/:id', async (request: Request, response: Response) => {
  try {
    const { id } = idSchema.parse(request.params);
    const contact = await knex('contacts').where('id', id).first();
    if (!contact) return response.status(404).json({ message: 'Contato não encontrado' });
    return response.json(contact);
  } catch (error: any) {
    return response.status(500).json({ message: 'Erro ao buscar.' });
  }
});

// ROTA DASHBOARD
app.get('/api/stats', async (req: Request, res: Response) => {
  try {
    const stats = await knex('contacts')
      .leftJoin('categories', 'contacts.category_id', 'categories.id')
      .select('categories.name as category')
      .count('contacts.id as total')
      .groupBy('categories.name');
    return res.json(stats);
  } catch (error) {
    return res.status(500).json({ message: 'Erro nas estatísticas' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend rodando na porta ${PORT} com Uploads ativados!`);
}); 