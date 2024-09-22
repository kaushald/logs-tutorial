import { Controller, Get, Query, Logger } from '@nestjs/common';
import { BookingService } from './booking.service';

@Controller('booking')
export class BookingController {
  private readonly logger = new Logger(BookingController.name);

  constructor(private readonly bookingService: BookingService) {}

  @Get('create')
  createBooking(@Query('destination') destination: string) {
    try {
      return this.bookingService.createBooking(destination);
    } catch (error) {
      this.logger.error(`Booking failed: ${error.message}`, error.stack);
      throw error;
    }
  }
}
