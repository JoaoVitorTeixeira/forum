import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import UserReadDto from './dto/user-read.dto';
import UserRegisterDto from './dto/user-register.dto';
import User from './users.entity';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
@UseInterceptors(ClassSerializerInterceptor)
export default class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @ApiCreatedResponse({
    description: 'The user has been created',
    type: UserReadDto,
  })
  async register(@Body() user: UserRegisterDto): Promise<User> {
    return this.usersService.register(user);
  }
}