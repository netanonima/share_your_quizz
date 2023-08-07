import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as argon2 from 'argon2';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'users/entities/user.entity';
import { Repository } from 'typeorm';
import { MailService } from 'mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly mailService: MailService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = new User();

    user.username = createUserDto.username;
    user.password = await this.hashPassword(createUserDto.password);
    user.email = createUserDto.email;

    try {
      return await this.userRepository.save(user);
    } catch (error) {
      throw new BadRequestException('Failed to create user.');
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
    await this.mailService.sendMail(
      'altordj@gmail.com',
      'testName',
      'blabla bla',
      'sdfsdafsafddf',
    );
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

    // Update user data
    Object.assign(user, updateUserDto);

    // Save updated user
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
