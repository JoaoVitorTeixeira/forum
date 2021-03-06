import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import UserRegisterDto from './dto/user-register.dto';
import User from './entity/users.entity';

/**
 * All possible user identifiers types (id, email)
 */
type UserIdentificationType = string | number;
@Injectable()
export class UsersService {
  constructor(
    private eventEmitter: EventEmitter2,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  /**
   * Register a new user
   * @param user The user to create in the database
   * @returns The created user
   */
  async register(user: UserRegisterDto): Promise<User> {
    const { address, ...userWithoutAddress } = user;
    const newUser = await this.userRepository
      .create({ ...userWithoutAddress })
      .save();

    this.eventEmitter.emit('user.created', {
      user: newUser,
      address: user.address,
    });

    return newUser;
  }

  /**
   * Try to find a user by id or email
   * @param identifier The user identifier: id or email
   * @returns The user if found, null otherwise
   */
  async findOne(identifier: UserIdentificationType): Promise<User> {
    if (isNaN(Number(identifier))) {
      return await this.userRepository.findOne({
        where: { email: identifier as string },
        relations: ['address'],
      });
    }

    return await this.userRepository.findOne({
      where: { id: identifier as number },
      relations: ['address'],
    });
  }
}
