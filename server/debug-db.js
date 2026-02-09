
const db = require('./src/db');

async function debug() {
  await db.init();
  
  console.log('--- Users ---');
  const users = await db.pool.query('SELECT id, email, name FROM users');
  console.log(users.rows);

  console.log('\n--- Plans ---');
  const plans = await db.pool.query('SELECT * FROM plans');
  console.log(plans.rows);

  console.log('\n--- Subscriptions ---');
  const subs = await db.pool.query('SELECT * FROM subscriptions');
  console.log(subs.rows);

  console.log('\n--- Sessions ---');
  const sessions = await db.pool.query('SELECT id, user_id, status FROM sessions');
  console.log(sessions.rows);

  const usersToCheck = await db.pool.query("SELECT * FROM users WHERE email='user@waas.local'");
  if (usersToCheck.rows.length > 0) {
      const userId = usersToCheck.rows[0].id;
      console.log(`\n--- Check Limit for User ${userId} (${usersToCheck.rows[0].email}) ---`);

      
      const sub = await db.pool.query('SELECT s.id,s.plan_id,p.max_sessions FROM subscriptions s LEFT JOIN plans p ON p.id=s.plan_id WHERE s.user_id=$1 ORDER BY s.period_start DESC LIMIT 1',[userId]);
      console.log('Subscription found:', sub.rows);
      
      if (sub.rows && sub.rows.length){
        const p = sub.rows[0];
        console.log('Plan max_sessions:', p.max_sessions, typeof p.max_sessions);
        
        const used = await db.pool.query('SELECT COUNT(*) as cnt FROM sessions WHERE user_id=$1',[userId]);
        console.log('Used sessions count raw:', used.rows);
        const cnt = used.rows && used.rows[0] ? used.rows[0].cnt : 0;
        console.log('Used sessions count:', cnt, typeof cnt);
        
        if (p.max_sessions) {
            console.log(`Check: ${cnt} < ${p.max_sessions} is ${cnt < p.max_sessions}`);
            console.log(`Check: ${cnt} >= ${p.max_sessions} is ${cnt >= p.max_sessions}`);
        } else {
            console.log('p.max_sessions is falsy, check skipped (unlimited)');
        }
      } else {
          console.log('No subscription found, unlimited.');
      }
  }
}

debug();
