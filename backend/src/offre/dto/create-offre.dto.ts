import { IsNotEmpty, IsOptional, IsString, IsArray } from 'class-validator';

export class CreateOffreDto {
  @IsString()
  @IsNotEmpty()
  titre: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  domaine: string;

  @IsString()
  @IsNotEmpty()
  typeContrat: string; // CDI, CDD, Stage, Alternance...

  @IsString()
  @IsNotEmpty()
  lieu: string;

  @IsString()
  @IsNotEmpty()
  salaire: string; // on pourra améliorer avec une valeur numérique + unité

  // ✅ Nouveaux champs :
  @IsString()
  @IsOptional()
  experience: string; // Ex: "2 ans minimum"

  @IsString()
  @IsOptional()
  niveauEtude: string; // Ex: "Bac+5"

  @IsString()
  @IsOptional()
  horaires: string; // Ex: "35h / semaine"

  @IsArray()
  @IsOptional()
  avantages: string[]; // Ex: ["Tickets restaurant", "Télétravail"]

  @IsArray()
  @IsOptional()
  competences: string[]; // Ex: ["Node.js", "React", "PostgreSQL"]

  @IsString()
  @IsOptional()
  dateDebut: string; // Ex: "01/09/2025"
}
