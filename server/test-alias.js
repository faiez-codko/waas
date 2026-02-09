
const db = require('./src/db');

async function testAlias() {
  await db.init();
  const res = await db.pool.query('SELECT COUNT(*) as cnt FROM sessions');
  console.log('Result:', res.rows[0]);
  console.log('Keys:', Object.keys(res.rows[0]));
  console.log('Value of cnt:', res.rows[0].cnt);
}

testAlias();
