import { Request, Response } from 'express';
import { pool } from '../config/database';
import { apiService } from '../services/api.service';

export class ProfileController {
  async createProfile(req: Request, res: Response) {
    try {
      const { name } = req.body;

      if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({
          status: 'error',
          message: 'Name is required and must be a non-empty string',
        });
      }

      const cleanName = name.toLowerCase().trim();

      // Check if profile already exists (Idempotency)
      const existing = await pool.query('SELECT * FROM profiles WHERE name = $1', [cleanName]);

      if (existing.rows.length > 0) {
        return res.status(200).json({
          status: 'success',
          message: 'Profile already exists',
          data: existing.rows[0],
        });
      }

      // Fetch from APIs + classify
      const profileData = await apiService.fetchAndProcessName(cleanName);

      // Save to database
      const result = await pool.query(
        `INSERT INTO profiles 
         (name, gender, gender_probability, sample_size, age, age_group, country_id, country_probability)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
         RETURNING *`,
        [
          profileData.name,
          profileData.gender,
          profileData.gender_probability,
          profileData.sample_size,
          profileData.age,
          profileData.age_group,
          profileData.country_id,
          profileData.country_probability,
        ]
      );

      res.status(201).json({
        status: 'success',
        data: result.rows[0],
      });
    } catch (error: any) {
      if (
        error.message.includes('Genderize') ||
        error.message.includes('Agify') ||
        error.message.includes('Nationalize')
      ) {
        return res.status(502).json({
          status: 'error',
          message: error.message,
        });
      }

      console.error(error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
      });
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await pool.query('SELECT * FROM profiles WHERE id = $1', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          status: 'error',
          message: 'Profile not found',
        });
      }

      res.json({
        status: 'success',
        data: result.rows[0],
      });
    } catch (error: any) {
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
      });
    }
  }

  async getAllProfiles(req: Request, res: Response) {
    try {
      const { gender, country_id, age_group } = req.query;

      let query = 'SELECT id, name, gender, age, age_group, country_id FROM profiles WHERE 1=1';
      const params: any[] = [];
      let paramsCount = 1;

      if (gender) {
        query += ` AND gender = $${paramsCount}`;
        params.push((gender as string).toLowerCase());
        paramsCount++;
      }

      if (country_id) {
        query += ` AND country_id = $${paramsCount}`;
        params.push((country_id as string).toLowerCase());
        paramsCount++;
      }

      if (age_group) {
        query += ` AND age_group = $${paramsCount}`;
        params.push((age_group as string).toLowerCase());
        paramsCount++;
      }

      query += ' ORDER BY created_at DESC';

      const result = await pool.query(query, params);

      res.json({
        status: 'success',
        count: result.rows.length,
        data: result.rows,
      });
    } catch (error: any) {
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
      });
    }
  }

  async deleteProfile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM profiles WHERE id = $1 RETURNING id', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          status: 'error',
          message: 'Profile not found',
        });
      }

      res.status(204).send();
    } catch {
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
      });
    }
  }
}

export const profileController = new ProfileController();
