import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  prenom: string;

  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  role: 'particulier' | 'professionnel';

  @IsString()
  @IsNotEmpty()
  typeOffre: string;

  @IsString()
  @IsNotEmpty()
  domaine: string;
}
