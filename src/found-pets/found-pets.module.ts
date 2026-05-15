import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LostPet } from '../lost-pets/lost-pet.entity';
import { MailModule } from '../mail/mail.module';
import { FoundPet } from './found-pet.entity';
import { FoundPetsController } from './found-pets.controller';
import { FoundPetsService } from './found-pets.service';

@Module({
  imports: [TypeOrmModule.forFeature([FoundPet, LostPet]), MailModule],
  controllers: [FoundPetsController],
  providers: [FoundPetsService],
})
export class FoundPetsModule {}
