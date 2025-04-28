import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto {
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
