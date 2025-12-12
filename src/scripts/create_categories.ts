import db from '../database/index';

async function up() {
  console.log('⏳ Criando tabela de categorias...');

  try {
    const hasTable = await db.schema.hasTable('categories');
    
    if (!hasTable) {
      await db.schema.createTable('categories', (table) => {
        table.increments('id').primary(); 
        table.string('name').notNullable(); 
      });
      console.log('✅ Tabela categories criada!');


      await db('categories').insert([
        { name: 'Outros' },    
        { name: 'Trabalho' },  
        { name: 'Família' },   
        { name: 'Amigos' }     
      ]);
      console.log('✅ Categorias padrões inseridas!');
    } else {
      console.log('⚠️ Tabela categories já existe.');
    }

    const hasColumn = await db.schema.hasColumn('contacts', 'category_id');

    if (!hasColumn) {
      await db.schema.alterTable('contacts', (table) => {
        table.integer('category_id')
          .unsigned() 
          .references('id') 
          .inTable('categories') 
          .onDelete('SET NULL'); 
      });
      console.log('✅ Coluna category_id (Foreign Key) criada em contacts!');
    } else {
      console.log('⚠️ Coluna category_id já existe em contacts.');
    }

  } catch (error) {
    console.error('❌ Erro na migração:', error);
  } finally {
    await db.destroy();
  }
}

up();