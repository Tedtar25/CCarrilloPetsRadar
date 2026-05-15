import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Point } from 'geojson';
import { Repository } from 'typeorm';
import { LostPet } from './lost-pet.entity';
import { pointToLatLng } from '../common/geo.utils';
import { CreateLostPetDto } from './dto/create-lost-pet.dto';

@Injectable()
export class LostPetsService {
  constructor(
    @InjectRepository(LostPet)
    private readonly lostPetRepository: Repository<LostPet>,
  ) {}

  async findAllActive(): Promise<
    Array<{
      id: string;
      name: string;
      is_active: boolean;
      location: ReturnType<typeof pointToLatLng>;
      created_at: Date;
    }>
  > {
    const rows = await this.lostPetRepository.find({
      where: { is_active: true },
      order: { created_at: 'DESC' },
    });

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      is_active: row.is_active,
      location: pointToLatLng(row.location),
      created_at: row.created_at,
    }));
  }

  async create(dto: CreateLostPetDto) {
    const location: Point = {
      type: 'Point',
      coordinates: [dto.longitude, dto.latitude],
    };

    const entity = this.lostPetRepository.create({
      name: dto.name,
      is_active: true,
      location,
    });

    await this.lostPetRepository.save(entity);

    return {
      id: entity.id,
      name: entity.name,
      is_active: entity.is_active,
      location: pointToLatLng(entity.location),
      created_at: entity.created_at,
    };
  }
}
