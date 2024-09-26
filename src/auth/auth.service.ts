import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/registerUser-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { LoginUserDto } from './dto/loginUser-auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async registerUsers(registerDto: RegisterUserDto) {
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

  async loginUsers(loginDto: LoginUserDto) {
    const user = await this.userRepository.findOneBy({ email: loginDto.email });
    if (!user) throw new UnauthorizedException();

    const validatePassword = bcrypt.compareSync(
      loginDto.password,
      user.password,
    );
    if (!validatePassword) throw new UnauthorizedException();

    const payload = { username: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  private HandleError(error: any) {
    this.logger.error(error);
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    throw new InternalServerErrorException('Internal Server Error');
  }
}
