import { IsNumber, IsString } from 'class-validator';

export class CreateLostPetDto {
  @IsString()
  name: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}
