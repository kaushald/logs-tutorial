import { Module } from '@nestjs/common';
import { PotionController } from './potion.controller';
import { PotionService } from './potion.service';

@Module({
  controllers: [PotionController],
  providers: [PotionService],
})
export class PotionModule {}
