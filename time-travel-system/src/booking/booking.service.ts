import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class BookingService {
  createBooking(destination: string) {
    // Simulate a booking issue based on destination
    if (destination.toLowerCase() === 'chamber-of-secrets') {
      throw new ForbiddenException(
        'Access Denied: Basilisk Protection Spell in Effect!',
      );
    }

    if (destination.toLowerCase() === 'triwizard-tournament') {
      throw new BadRequestException(
        'Dangerous Time Travel: Triwizard Tournament is too risky!',
      );
    }

    // Simulate successful booking
    return {
      message: `Booking to ${destination} created successfully! Pack your invisibility cloak!`,
    };
  }
}
