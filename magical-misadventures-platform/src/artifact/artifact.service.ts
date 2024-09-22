import { Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class ArtifactService {
  checkoutArtifact(artifact: string, wizardLevel: string) {
    if (artifact.toLowerCase() === 'elder-wand,' && wizardLevel === '1') {
      throw new ForbiddenException(
        'Elder Wand refuses to be wielded by a beginner!',
      );
    }

    if (artifact.toLowerCase() === "sorcerer's-stone" && Math.random() < 0.3) {
      throw new ForbiddenException(
        "The Sorcerer's Stone has vanished. Try again later!",
      );
    }

    return {
      message: `${artifact} checked out successfully! Use it wisely.`,
    };
  }
}
