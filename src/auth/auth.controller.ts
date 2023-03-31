import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';

/**
 * Контроллер аутентификации
 */
@Controller('api/auth')
export class AuthController {
    /**
     * Внедрение зависимости для сервиса аутентификации
     */
    constructor(private authService: AuthService) {}

    /**
     * POST Endpoint для аутентификации существующего пользователя
     * @param dto - Data Transfer Object для аутентификации пользователя
     * @returns JWT аутентифицированного пользователя
     */
    @Post()
    async login(@Body() dto: CreateUserDto) {
        return await this.authService.login(dto);
    }
}