const postgres = require('postgres');

(async () => {
  const sql = postgres(process.env.POSTGRES_URL, { ssl: 'require' });
  
  try {
    const result = await sql`
      SELECT id, name, email, image_url FROM customers 
      WHERE name IN ('Hector Simpson', 'Steven Tey', 'Emil L') 
      ORDER BY name
    `;
    
    console.log('Test customers in database:');
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await sql.end();
  }
})();
