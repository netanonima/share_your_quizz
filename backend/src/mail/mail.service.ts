import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private config: ConfigService,
  ) {}

  async sendMail(
    email: string,
    name: string,
    subject: string,
    token: string,
    template: string,
  ) {
    await this.mailerService.sendMail({
      to: email,
      subject: subject,
      template: './' + template,
      context: {
        name: name,
        token: token,
        account_confirmation_url: this.config.get('FRONTEND_URL')+'/confirm-account',
        password_reset_url: this.config.get('FRONTEND_URL')+'/reset-password',
      },
    });
  }
}
