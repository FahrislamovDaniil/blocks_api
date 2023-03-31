import { Body, Controller, Delete, Get, Param, Put, UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/auth/admin.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

/**
 * Контроллер пользователя
 */
@Controller('api/user')
export class UserController {
    /**
     * Внедрение зависимости для сервиса пользователей
     * @param userService - Сервис пользователей
     */
    constructor(private userService: UserService) {}

    /**
     * GET Endpoint для получения списка всех пользователей. Доступен авторизованным пользователям (AuthGuard)
     * @returns Список всех пользователей
     */
    @Get()
    @UseGuards(AuthGuard)
    async getAll() {
        return await this.userService.getAll();
    }

    /**
     * GET Endpoint для получения пользователя по id. Доступен авторизованным пользователям (AuthGuard)
     * @param id - Идентификатор пользователя
     * @returns Пользователь с заданным id
     */
    @Get('/:id')
    @UseGuards(AuthGuard)
    async getById(@Param('id') id: number) {
        return await this.userService.getById(id);
    }

    /**
     * PUT Endpoint для редактирования пользователя. Доступен пользователям с ролью администратор (AdminGuard)
     * @param dto - Data Transfer Object для редактирования пользователя
     * @returns Результат редактирования
     */
    @Put('/update')
    @UseGuards(AdminGuard)
    async updateUser(@Body() dto: UpdateUserDto) {
        return await this.userService.updateUser(dto);
    }

    /**
     * PUT Endpoint для назначения пользователю роли администратора. Доступен пользователям с ролью администратор (AdminGuard)
     * @param id - Идентификатор пользователя
     * @returns Результат редактирования
     */
    @Put('/admin_role/:id')
    @UseGuards(AdminGuard)
    async swapToAdmin(@Param('id') id: number) {
        return await this.userService.swapToAdmin(id);
    }

    /**
     * PUT Endpoint для назначения пользователю роли пользователя. Доступен пользователям с ролью администратор (AdminGuard)
     * @param id - Идентификатор пользователя
     * @returns Результат редактирования
     */
    @Put('/user_role/:id')
    @UseGuards(AdminGuard)
    async swapToUser(@Param('id') id: number) {
        return await this.userService.swapToUser(id);
    }

    /**
     * DELETE Endpoint для удаления пользователя. Доступен пользователям с ролью администратор (AdminGuard)
     * @param id - Идентификатор пользователя
     * @returns Результат удаления
     */
    @Delete('/:id')
    @UseGuards(AdminGuard)
    async deleteUser(@Param('id') id: number) {
        return await this.userService.deleteUser(id);
    }
}