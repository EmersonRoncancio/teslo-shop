import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { RegisterUser } from './dto/registerUser-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  logger: any;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async registerUsers(registerDto: RegisterUser) {
    try {
      const user = this.userRepository.create(registerDto);
      await this.userRepository.save(user);

      return user;
    } catch (error) {
      this.HandleError(error);
    }
  }

  private HandleError(error: any) {
    this.logger.error(error);
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    throw new InternalServerErrorException('Internal Server Error');
  }
}
