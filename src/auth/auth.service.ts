import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException, UnauthorizedException } from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt/dist';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/user/user.entity';

/**
 * Сервис аутентификации
 */
@Injectable()
export class AuthService {
    /**
     * Внедрение зависимостей сервиса пользователей и JWT сервиса
     * @param userService - Сервис пользователей
     * @param jwtService - JWT сервис
     */
    constructor(private userService: UserService, private jwtService: JwtService) {}

    /**
     * Функция создания пользователя в базе данных для авторизации
     * @param dto - Data Transfer Object для создания пользователя
     * @returns JWT для созданного пользователя
     */
    async registration(dto: CreateUserDto) {
        const candidate = await this.userService.getByLogin(dto.login);
        if (candidate) {
            throw new HttpException('User with this login is already exists', HttpStatus.BAD_REQUEST);
        }

        const hashedPassword = await bcrypt.hash(dto.password, 5);
        const user = await this.userService.createUser({ ...dto, password: hashedPassword });
        return await this.generateToken(user);
    }

    /**
     * Функция для аутентификации пользователя
     * @param dto - Data Transfer Object для аутентификации пользователя
     * @returns JWT аутентифицированного пользователя
     */
    async login(dto: CreateUserDto) {
        const user = await this.validateUser(dto);
        return await this.generateToken(user);
    }

    /**
     * Функция генерации JWT
     * @param user - Пользователь, для которого будет сгенерирован JWT
     * @returns JWT для данного пользователя
     */
    private async generateToken(user: User) {
        const payload = {
            id: user.id,
            login: user.login,
            role: user.role
        };

        return { token: this.jwtService.sign(payload) };
    }
    
    /**
     * Функция валидации пользователя
     * @param dto - Data Transfer Object для валидации пользователя
     * @returns Валидированного пользователя
     */
    async validateUser(dto: CreateUserDto) {
        const candidate = await this.userService.getByLogin(dto.login);

        if(candidate && await bcrypt.compare(dto.password, candidate.password)) {
            return candidate;
        }
        throw new UnauthorizedException({ message: 'Incorrect user name or password' });
    }
}