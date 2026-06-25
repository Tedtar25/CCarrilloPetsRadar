import { IsLatitude, IsLongitude, IsString } from 'class-validator';

export class CreateLostPetDto {
  @IsString()
  name: string;

  @IsLatitude()
  latitude: number;

  @IsLongitude()
  longitude: number;
}
