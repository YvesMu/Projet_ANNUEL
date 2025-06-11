export interface JwtPayload {
  id: number;
  email: string;
  role: 'particulier' | 'professionnel';
}
