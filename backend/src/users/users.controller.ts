import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { ForgotPasswordDto } from 'users/dto/forgot-password';
import { ForgotPasswordRetrieveDto } from 'users/dto/forgot-password-retrieve.dto';
import { ConfirmAccountDto } from 'users/dto/confirm-account.dto';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('confirm-account')
  confirmAccount(@Body() confirmAccountDto: ConfirmAccountDto) {
    return this.usersService.confirmAccount(confirmAccountDto);
  }

  @Post('forgot-password-retrieve')
  forgotPasswordRetrieve(
    @Body() forgotPasswordRetrieveDto: ForgotPasswordRetrieveDto,
  ) {
    return this.usersService.forgotPasswordRetrieve(forgotPasswordRetrieveDto);
  }

  @Post('forgot-password')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.usersService.forgotPassword(forgotPasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
