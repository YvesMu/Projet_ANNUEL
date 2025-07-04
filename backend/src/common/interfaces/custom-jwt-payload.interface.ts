export interface CustomJwtPayload {
  id: number;
  email: string;
  role: 'particulier' | 'professionnel';
  prenom: string;
  nom: string;
  domaine: string;
}
