import db from './dist/models/Database.js';

async function testConnection() {
  try {
    console.log('Testing database connection...');
    const result = await db.query('SELECT NOW() as current_time');
    console.log('✅ Database connection successful!');
    console.log('Current time:', result.rows[0].current_time);
    
    // Test creating the database
    try {
      await db.query('CREATE DATABASE handie_db');
      console.log('✅ Database handie_db created successfully!');
    } catch (error) {
      if (error.code === '42P04') {
        console.log('ℹ️  Database handie_db already exists');
      } else {
        console.error('❌ Error creating database:', error.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  } finally {
    await db.close();
  }
}

testConnection();
