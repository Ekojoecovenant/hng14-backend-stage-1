import axios from 'axios';
import { AgeGroup, Profile } from '../types';

const GENDERIZE_URL = 'https://api.genderize.io';
const AGIFY_URL = 'https://api.agify.io';
const NATIONALIZE_URL = 'https://api.nationalize.io';

export class ApiService {
  private async fetchWithError<T>(url: string, apiName: string): Promise<T> {
    try {
      const response = await axios.get(url, { timeout: 5000 });
      return response.data;
    } catch (error) {
      throw new Error(`${apiName} API request failed`);
    }
  }

  private getAgeGroup(age: number | null): AgeGroup {
    if (age === null) return 'adult';
    if (age <= 12) return 'child';
    if (age <= 19) return 'teenager';
    if (age <= 59) return 'adult';
    return 'senior';
  }

  async fetchAndProcessName(name: string): Promise<Profile> {
    const lowerName = name.toLowerCase().trim();

    // genderize call
    const genderData = await this.fetchWithError<{
      name: string;
      gender: string | null;
      probability: number;
      count: number;
    }>(`${GENDERIZE_URL}?name=${lowerName}`, 'Genderize');

    if (!genderData.gender || genderData.count === 0) {
      throw new Error('Genderize returned an invalid response');
    }

    // agify caller
    const ageData = await this.fetchWithError<{
      name: string;
      age: number | null;
      count: number;
    }>(`${AGIFY_URL}?name=${lowerName}`, 'Agify');

    if (ageData.age == null) {
      throw new Error('Agify returned an invalid response');
    }

    // nationalize
    const nationalData = await this.fetchWithError<{
      name: string;
      country: Array<{ country_id: string; probability: number }>;
    }>(`${NATIONALIZE_URL}?name=${lowerName}`, 'Nationalize');

    if (!nationalData.country || nationalData.country.length === 0) {
      throw new Error('Nationalize returned an invalid response');
    }

    // top contry
    const topCountry = nationalData.country.reduce((prev, current) =>
      prev.probability > current.probability ? prev : current
    );

    const ageGroup = this.getAgeGroup(ageData.age);

    return {
      id: '',
      name: lowerName,
      gender: genderData.gender,
      gender_probability: Number(genderData.probability.toFixed(4)),
      sample_size: genderData.count,
      age: ageData.age,
      age_group: ageGroup,
      country_id: topCountry.country_id,
      country_probability: Number(topCountry.probability.toFixed(4)),
      created_at: new Date().toISOString(),
    };
  }
}

export const apiService = new ApiService();
