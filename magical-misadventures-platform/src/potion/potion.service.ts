import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class PotionService {
  brewPotion(ingredients: string) {
    if (
      ingredients.toLowerCase().includes('boomslang-skin') &&
      Math.random() < 0.1
    ) {
      throw new BadRequestException(
        'Brewing Error: The cauldron melted! Try again.',
      );
    }

    if (ingredients.toLowerCase().includes('bicorn-horn')) {
      const sleepTime = Math.floor(Math.random() * 1000) + 4000;
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, sleepTime);
    }

    return {
      message: 'Potion brewed successfully! Drink with caution.',
    };
  }
}
