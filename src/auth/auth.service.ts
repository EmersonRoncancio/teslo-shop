import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { RegisterUser } from './dto/registerUser-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async registerUsers(registerDto: RegisterUser) {
    try {
      const { password: passw, ...restUserData } = registerDto;
      const salt = bcrypt.genSaltSync();
      const user = this.userRepository.create({
        password: bcrypt.hashSync(passw, salt),
        ...restUserData,
      });
      await this.userRepository.save(user);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, roles, isActive, ...restUser } = user;

      return restUser;
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
