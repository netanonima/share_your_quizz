import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password';
import * as argon2 from 'argon2';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'users/entities/user.entity';
import { MoreThan, Repository } from 'typeorm';
import { MailService } from 'mail/mail.service';
import { ForgotPasswordRetrieveDto } from 'users/dto/forgot-password-retrieve.dto';
import * as moment from "moment";
import { ConfigService } from '@nestjs/config';
import { ConfirmAccountDto } from 'users/dto/confirm-account.dto';

@Injectable()
export class UsersService {
  config = new ConfigService();
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly mailService: MailService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = new User();

    user.username = createUserDto.username;
    user.password = await this.hashPassword(createUserDto.password);
    user.email = createUserDto.email;
    user.confirmation_token = Math.random().toString(36).slice(2);
    user.confirm_before = moment()
      .add(this.config.get('HOURS_FOR_ACCOUNT_CONFIRMATION'), 'hours')
      .toDate();

    if(this.config.get('EMAIL_HOST')=='' || this.config.get('EMAIL_USER')=='' || this.config.get('EMAIL_PASSWORD')=='' || this.config.get('ACCOUNT_CONFIRMATION_URL')==''){
      try{
        return await this.userRepository.save(user);
      } catch (error) {
        throw new BadRequestException('Failed to create user.');
      }
    }else{
      try {
        await this.mailService.sendMail(
            user.email,
            user.username,
            "'Share your quizz' account confirmation",
            user.confirmation_token,
            'account-confirmation',
        );

        return await this.userRepository.save(user);
      } catch (error) {
        throw new BadRequestException('Failed to create user.');
      }
    }
  }

  async confirmAccount(confirmAccountDto: ConfirmAccountDto) {
    const currentTime = moment().toDate();

    const user = await this.userRepository.findOne({
      where: {
        username: confirmAccountDto.username,
        confirmation_token: confirmAccountDto.confirmation_token,
        confirm_before: MoreThan(currentTime),
        account_confirmed_on: null,
      },
    });

    if (!user) {
      throw new NotFoundException(
        `User with username ${confirmAccountDto.username} and this token not found, the delay is passed or this account was already confirmed.`,
      );
    }

    user.account_confirmed_on = currentTime;
    user.confirmation_token = null;
    user.confirm_before = null;

    try {
      return await this.userRepository.save(user);
    } catch (error) {
      throw new BadRequestException('Failed to confirm account.');
    }
  }

  async forgotPasswordRetrieve(
    forgotPasswordRetrieveDto: ForgotPasswordRetrieveDto,
  ) {
    const user = await this.userRepository.findOne({
      where: {
        email: forgotPasswordRetrieveDto.email,
      },
    });

    if (!user) {
      throw new NotFoundException(
        `User with e-mail ${forgotPasswordRetrieveDto.email} not found.`,
      );
    }

    user.confirmation_token = Math.random().toString(36).slice(2);
    user.confirm_before = moment()
      .add(this.config.get('MINUTES_FOR_PASSWORD_RESET'), 'minutes')
      .toDate();

    try {
      await this.mailService.sendMail(
        user.email,
        user.username,
        "'Share your quizz' password reset",
        user.confirmation_token,
        'password-reset',
      );
      return await this.userRepository.save(user);
    } catch (error) {
      throw new BadRequestException('Failed to update password.');
    }
  }
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const currentTime = moment().toDate();

    const user = await this.userRepository.findOne({
      where: {
        username: forgotPasswordDto.username,
        confirmation_token: forgotPasswordDto.confirmation_token,
        confirm_before: MoreThan(currentTime),
      },
    });

    if (!user) {
      throw new NotFoundException(
        `User with username ${forgotPasswordDto.username} and this token not found or the delay is passed.`,
      );
    }

    if(user.account_confirmed_on === null){
        throw new NotFoundException(
            `User with username ${forgotPasswordDto.username} is not confirmed.`,
        );
    }

    user.password = await this.hashPassword(forgotPasswordDto.password);
    if (user.account_confirmed_on === null) {
      user.confirmation_token = Math.random().toString(36).slice(2);
      user.confirm_before = moment()
        .add(this.config.get('HOURS_FOR_ACCOUNT_CONFIRMATION'), 'hours')
        .toDate();
    } else {
      user.confirmation_token = null;
      user.confirm_before = null;
    }

    try {
      return await this.userRepository.save(user);
    } catch (error) {
      throw new BadRequestException('Failed to update password.');
    }
  }
  private async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password);
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.findOneByUsername(username);
    if (user && (await argon2.verify(user.password, password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async comparePassword(
    enteredPassword: string,
    storedPasswordHash: string,
  ): Promise<boolean> {
    try {
      return await argon2.verify(storedPasswordHash, enteredPassword);
    } catch (err) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findOneByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    Object.assign(user, updateUserDto);

    return this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.userRepository.remove(user);
  }
}
