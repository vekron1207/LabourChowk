const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create({ phone, password, role, language = 'hi' }) {
    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (phone, password_hash, role, language)
       VALUES ($1, $2, $3, $4)
       RETURNING id, phone, role, name, language, location_lat, location_lng, created_at`,
      [phone, passwordHash, role, language]
    );

    return result.rows[0];
  }

  static async findByPhone(phone) {
    const result = await pool.query(
      'SELECT * FROM users WHERE phone = $1',
      [phone]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT id, phone, role, name, language, location_lat, location_lng, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async update(id, updates) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updates).forEach(key => {
      if (['name', 'language', 'location_lat', 'location_lng'].includes(key)) {
        fields.push(`${key} = $${paramCount}`);
        values.push(updates[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      return await User.findById(id);
    }

    values.push(id);
    const query = `
      UPDATE users
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING id, phone, role, name, language, location_lat, location_lng, created_at
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async verifyPassword(password, passwordHash) {
    return await bcrypt.compare(password, passwordHash);
  }
}

module.exports = User;
