import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(UserRepository) private userRepository: UserRepository) {}

    async signUp(authCredentialsDto: AuthCredentialsDto) {
        return this.userRepository.signUp(authCredentialsDto);
    }

    async signIn(authCredentialsDto: AuthCredentialsDto) {
        const user = await this.userRepository.validateUserPassword(authCredentialsDto);
        if (!user) {
            throw new UnauthorizedException()
        }

        return user;
    }
}
