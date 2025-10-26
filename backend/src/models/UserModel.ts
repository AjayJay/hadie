import db from './Database';
import { User, UserRole, OnboardingData } from '../types';

export class UserModel {
  // Create a new user
  static async create(userData: {
    name: string;
    email: string;
    password_hash: string;
    phone: string;
    role: UserRole;
  }): Promise<User> {
    const query = `
      INSERT INTO users (id, name, email, password_hash, phone, role, onboarding_completed, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    
    const id = this.generateId();
    const now = new Date().toISOString();
    
    const result = await db.query(query, [
      id,
      userData.name,
      userData.email,
      userData.password_hash,
      userData.phone,
      userData.role,
      false,
      now,
      now
    ]);

    return this.mapRowToUser(result.rows[0]);
  }

  // Find user by email
  static async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await db.query(query, [email]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return this.mapRowToUser(result.rows[0]);
  }

  // Find user by ID
  static async findById(id: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await db.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return this.mapRowToUser(result.rows[0]);
  }

  // Update user onboarding data
  static async updateOnboardingData(id: string, onboardingData: OnboardingData): Promise<User> {
    const query = `
      UPDATE users 
      SET onboarding_data = $1, onboarding_completed = $2, updated_at = $3
      WHERE id = $4
      RETURNING *
    `;
    
    const result = await db.query(query, [
      JSON.stringify(onboardingData),
      onboardingData.currentStep === 'completion',
      new Date().toISOString(),
      id
    ]);

    return this.mapRowToUser(result.rows[0]);
  }

  // Update user profile
  static async updateProfile(id: string, updates: Partial<User>): Promise<User> {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id') {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    fields.push(`updated_at = $${paramCount}`);
    values.push(new Date().toISOString());
    paramCount++;

    values.push(id);

    const query = `
      UPDATE users 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await db.query(query, values);
    return this.mapRowToUser(result.rows[0]);
  }

  // Delete user
  static async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM users WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rowCount > 0;
  }

  // Get all users with pagination
  static async findAll(page: number = 1, limit: number = 10, role?: UserRole): Promise<{
    users: User[];
    total: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM users';
    let countQuery = 'SELECT COUNT(*) FROM users';
    const params: any[] = [];

    if (role) {
      query += ' WHERE role = $1';
      countQuery += ' WHERE role = $1';
      params.push(role);
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const [usersResult, countResult] = await Promise.all([
      db.query(query, params),
      db.query(countQuery, role ? [role] : [])
    ]);

    const total = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(total / limit);

    return {
      users: usersResult.rows.map((row: any) => this.mapRowToUser(row)),
      total,
      totalPages
    };
  }

  // Helper method to map database row to User object
  private static mapRowToUser(row: any): User {
    return {
      id: row.id,
      name: row.name || '',
      email: row.email,
      phone: row.phone,
      role: row.role,
      onboardingCompleted: row.onboarding_completed,
      onboardingData: row.onboarding_data ? JSON.parse(row.onboarding_data) : undefined,
      serviceCategoryId: row.service_category_id,
      experience: row.experience,
      isVerified: row.is_verified,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  // Generate unique ID
  private static generateId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
