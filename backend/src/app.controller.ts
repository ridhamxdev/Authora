import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { EmailService } from './email/email.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly emailService: EmailService,
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test-email')
  async testEmail(@Query('to') to: string) {
    if (!to) return 'Please provide ?to=email@example.com';
    try {
      await this.emailService.sendOtp(to, '123456'); // Using sendOtp as a generic test
      return `Email sent to ${to}`;
    } catch (error: any) { // Type as any for now to access message safely
      return `Failed to send email: ${error.message}`;
    }
  }
}
