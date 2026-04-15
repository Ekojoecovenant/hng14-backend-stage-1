export interface Profile {
  id: string;
  name: string;
  gender: string | null;
  gender_probability: number | null;
  sample_size: number | null;
  age: number | null;
  age_group: string | null;
  country_id: string | null;
  country_probability: number | null;
  created_at: string;
}

export interface ApiResponses {
  genderize: {
    name: string;
    gender: string | null;
    probability: number;
    count: number;
  };
  agify: {
    name: string;
    age: number | null;
    count: number;
  };
  nationalize: {
    name: string;
    country: Array<{
      country_id: string;
      probability: number;
    }>;
  };
}

export type AgeGroup = 'child' | 'teenager' | 'adult' | 'senior';

export interface ApiError {
  status: 'error';
  message: string;
}
