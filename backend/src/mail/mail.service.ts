import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private config: ConfigService,
  ) {}

  async sendMail(email: string, name: string, subject: string, token: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: subject,
      template: './email',
      context: {
        name: name,
        token: token,
        url: this.config.get('ACCOUNT_CONFIRMATION_URL'),
      },
    });
  }
}
