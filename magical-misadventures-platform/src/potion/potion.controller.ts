import { Controller, Get, Query, Logger } from '@nestjs/common';
import { PotionService } from './potion.service';

@Controller('potion')
export class PotionController {
  private readonly logger = new Logger(PotionController.name);

  constructor(private readonly potionService: PotionService) {}

  @Get('brew')
  brewPotion(@Query('ingredients') ingredients: string) {
    try {
      return this.potionService.brewPotion(ingredients);
    } catch (error) {
      this.logger.error(`Potion brewing failed: ${error.message}`, error.stack);
      throw error;
    }
  }
}
