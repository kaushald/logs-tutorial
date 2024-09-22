import { Controller, Get, Query, Logger } from '@nestjs/common';
import { ArtifactService } from './artifact.service';

@Controller('artifact')
export class ArtifactController {
  private readonly logger = new Logger(ArtifactController.name);

  constructor(private readonly artifactService: ArtifactService) {}

  @Get('checkout')
  checkoutArtifact(
    @Query('artifact') artifact: string,
    @Query('wizardLevel') wizardLevel: string,
  ) {
    try {
      return this.artifactService.checkoutArtifact(artifact, wizardLevel);
    } catch (error) {
      this.logger.warn(`Checkout failed: ${error.message}`);
      throw error;
    }
  }
}
