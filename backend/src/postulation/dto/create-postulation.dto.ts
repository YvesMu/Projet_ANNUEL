import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePostulationDto {
  @IsNumber()
  @IsNotEmpty()
  offreId: number;
}
