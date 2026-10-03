import pg from 'pg';
const { Client } = pg;

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'inventario_db_cooperativa',
  password: 'admin',
  port: 5432,
});

async function seed() {
  await client.connect();
  console.log('Connected to DB');

  const queries = [
    `INSERT INTO users (id, email, "passwordHash", "fullName", role) VALUES (gen_random_uuid(), 'admin@cooperativa.com', 'admin', 'Administrador Principal', 'ADMIN') ON CONFLICT (email) DO NOTHING;`,
    `INSERT INTO users (id, email, "passwordHash", "fullName", role) VALUES (gen_random_uuid(), 'almacen@cooperativa.com', 'almacen', 'Juan Pérez (Almacenero)', 'ALMACENERO') ON CONFLICT (email) DO NOTHING;`,
    `INSERT INTO users (id, email, "passwordHash", "fullName", role) VALUES (gen_random_uuid(), 'secretaria@cooperativa.com', 'secre', 'Maria Lopez (Secretaria)', 'SECRETARIA') ON CONFLICT (email) DO NOTHING;`
  ];

  for (const q of queries) {
    await client.query(q);
  }

  console.log('Seeded successfully!');
  await client.end();
}

seed().catch(console.error);
