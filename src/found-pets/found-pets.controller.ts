import {
  Body,
  Controller,
  Get,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import {
  CacheInterceptor,
  CacheKey,
  CacheTTL,
} from '@nestjs/cache-manager';
import { CACHE_KEY_FOUND_PETS_LIST } from '../common/cache-keys';
import { CreateFoundPetDto } from './dto/create-found-pet.dto';
import { FoundPetsService } from './found-pets.service';

@Controller('found-pets')
export class FoundPetsController {
  constructor(private readonly foundPetsService: FoundPetsService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheKey(CACHE_KEY_FOUND_PETS_LIST)
  @CacheTTL(60_000)
  findAll() {
    return this.foundPetsService.findAll();
  }

  @Post()
  create(@Body() dto: CreateFoundPetDto) {
    return this.foundPetsService.create(dto);
  }
}
