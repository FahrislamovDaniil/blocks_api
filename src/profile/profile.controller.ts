import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { Delete } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { AdminGuard } from 'src/auth/admin.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileService } from './profile.service';

/**
 * Контроллер профиля
 */
@Controller('api/profile')
export class ProfileController {
    /**
     * Внедрение зависимостей сервиса профиля и сервиса аутентификации
     * @param profileService - Сервис профиля
     * @param authService - Сервис аутентификации
     */
    constructor(private profileService: ProfileService, private authService: AuthService) {}

    /**
     * GET Endpoint для получения списка всех профилей. Доступен авторизованным пользователям (AuthGuard)
     * @returns Список всех профилей
     */
    @Get()
    @UseGuards(AuthGuard)
    async getAll() {
        return await this.profileService.getAll();
    }

    /**
     * GET Endpoint для получения профиля по id. Доступен авторизованным пользователям (AuthGuard)
     * @param id - Идентификатор профиля
     * @returns Профиль с заданным id
     */
    @Get('/:id')
    @UseGuards(AuthGuard)
    async getById(@Param('id') id: number) {
        return await this.profileService.getById(id);
    }

    /**
     * POST Endpoint для создания нового пользователя и профиля
     * @param dto - Data Transfer Object для создания нового пользователя и профиля
     * @returns JWT и созданная сущность профиля
     */
    @Post('/register')
    async register(@Body() dto: CreateProfileDto) {
        const token = await this.authService.registration(dto.user);
        return { ...token, profile: await this.profileService.createProfile(dto) };
    }

    /**
     * PUT Endpoint для редактирования профиля. Доступен пользователям с ролью администратор (AdminGuard)
     * @param dto - Data Transfer Object для редактирования профиля
     * @returns Результат редактирования
     */
    @Put()
    @UseGuards(AdminGuard)
    async updateProfile(@Body() dto: UpdateProfileDto) {
        return await this.profileService.updateProfile(dto);
    }

    /**
     * DELETE Endpoint для удаления профиля. Доступен пользователям с ролью администратор (AdminGuard)
     * @param id - Идентификатор профиля
     * @returns Результат удаления
     */
    @Delete('/:id')
    @UseGuards(AdminGuard)
    async deleteProfile(@Param('id') id: number) {
        return await this.profileService.deleteProfile(id);
    }
}