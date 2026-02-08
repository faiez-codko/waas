const db = require('./src/db');

async function fix() {
  await db.init();
  await db.pool.query("UPDATE posts SET status='Published' WHERE status IS NULL OR status='Draft'");
  console.log('Updated posts to Published');
}

fix().catch(console.error);
