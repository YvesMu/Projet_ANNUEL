export interface JwtPayload {
  id: number;
  email: string;
  role: 'particulier' | 'professionnel';
  prenom: string;
  nom: string;
  domaine?: string;
}
