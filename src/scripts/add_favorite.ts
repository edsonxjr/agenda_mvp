import db from '../database/index';

async function addFavoriteColumn() {
    console.log(' ⏳ Verificando banco de dados...');
    
    try {
        const exists = await db.schema.hasColumn('contacts', 'is_favorite'); 

        if (exists) {
            console.log('⚠️ A coluna is_favorite JÁ existe. Nada a fazer.')
        } else {
            await db.schema.alterTable('contacts', (table) =>{
                table.boolean('is_favorite').defaultTo(false)
            });
            console.log('✅ Sucesso! Coluna is_favorite criada.')
        }
    } catch (error) {
    console.error('❌ Deu erro:', error);
  } finally {
    // 4. Importante: Encerra a conexão e o processo, senão o terminal trava
    await db.destroy();
    process.exit();
  }
}

addFavoriteColumn();
