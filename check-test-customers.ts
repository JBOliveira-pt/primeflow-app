import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

(async () => {
  try {
    const result = await sql`
      SELECT id, name, email, image_url FROM customers 
      WHERE name IN ('Hector Simpson', 'Steven Tey', 'Emil L') 
      ORDER BY name
    `;
    
    console.log('Test customers in database:');
    result.forEach(customer => {
      console.log(`- ${customer.name}: ${customer.image_url}`);
    });
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await sql.end();
  }
})();
