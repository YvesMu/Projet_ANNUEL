export interface CustomJwtPayload {
  id: number;
  email: string;
  role: 'particulier' | 'professionnel';
}
