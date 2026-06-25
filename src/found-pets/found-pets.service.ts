import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { getRepositoryToken } from '@nestjs/typeorm';
import type { Cache } from 'cache-manager';
import type { Point } from 'geojson';
import { Repository } from 'typeorm';
import { CACHE_KEY_FOUND_PETS_LIST } from '../common/cache-keys';
import { pointToLatLng } from '../common/geo.utils';
import { MailService } from '../mail/mail.service';
import { CreateFoundPetDto } from './dto/create-found-pet.dto';
import { FoundPet } from './found-pet.entity';
import { LostPet } from '../lost-pets/lost-pet.entity';

@Injectable()
export class FoundPetsService {
  constructor(
    @Inject(getRepositoryToken(FoundPet))
    private readonly foundPetRepository: Repository<FoundPet>,
    @Inject(getRepositoryToken(LostPet))
    private readonly lostPetRepository: Repository<LostPet>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly mailService: MailService,
  ) {}

  async findAll(): Promise<
    Array<{
      id: string;
      notes: string | null;
      location: ReturnType<typeof pointToLatLng>;
      found_at: Date;
    }>
  > {
    const rows = await this.foundPetRepository.find({
      order: { found_at: 'DESC' },
    });

    return rows.map((row) => ({
      id: row.id,
      notes: row.notes,
      location: pointToLatLng(row.location),
      found_at: row.found_at,
    }));
  }

  async create(dto: CreateFoundPetDto) {
    const location: Point = {
      type: 'Point',
      coordinates: [dto.longitude, dto.latitude],
    };

    const entity = this.foundPetRepository.create({
      location,
      notes: dto.notes ?? null,
    });

    await this.foundPetRepository.save(entity);

    const nearbyLostPets = await this.lostPetRepository
      .createQueryBuilder('lp')
      .where('lp.is_active = :active', { active: true })
      .andWhere(
        `ST_DWithin(
          lp.location::geography,
          ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography,
          500
        )`,
        { lng: dto.longitude, lat: dto.latitude },
      )
      .getMany();

    if (nearbyLostPets.length > 0) {
      await this.mailService.sendNearbyLostPetsEmail({
        foundPetId: entity.id,
        foundPetNotes: entity.notes,
        foundLatitude: dto.latitude,
        foundLongitude: dto.longitude,
        nearbyLostPets: nearbyLostPets.map((lp) => {
          const latLng = pointToLatLng(lp.location);

          return {
            id: lp.id,
            name: lp.name,
            latitude: latLng?.latitude ?? 0,
            longitude: latLng?.longitude ?? 0,
          };
        }),
      });
    }

    await this.cacheManager.del(CACHE_KEY_FOUND_PETS_LIST);

    return {
      id: entity.id,
      notes: entity.notes,
      location: pointToLatLng(entity.location),
      found_at: entity.found_at,
      nearbyLostPets: nearbyLostPets.map((lp) => ({
        id: lp.id,
        name: lp.name,
        is_active: lp.is_active,
        location: pointToLatLng(lp.location),
        created_at: lp.created_at,
      })),
    };
  }
}
