import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { LostPetsService } from './lost-pets.service';
import { CACHE_KEY_LOST_PETS_ACTIVE } from '../common/cache-keys';
import { CreateLostPetDto } from './dto/create-lost-pet.dto';

@Controller('lost-pets')
export class LostPetsController {
  constructor(private readonly lostPetsService: LostPetsService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheKey(CACHE_KEY_LOST_PETS_ACTIVE)
  @CacheTTL(60_000)
  findAllActive() {
    return this.lostPetsService.findAllActive();
  }

  @Post()
  create(@Body() dto: CreateLostPetDto) {
    return this.lostPetsService.create(dto);
  }
}
