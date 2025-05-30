import { IsNotEmpty, IsString } from 'class-validator';

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
  typeContrat: string;

  @IsString()
  @IsNotEmpty()
  lieu: string;

  @IsString()
  @IsNotEmpty()
  salaire: string;
}
