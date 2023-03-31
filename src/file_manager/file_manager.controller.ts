import { Controller, Delete, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminGuard } from 'src/auth/admin.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileManagerService } from './file_manager.service';

/**
 * Контроллер файлового менеджера
 */
@Controller('api/file')
export class FileManagerController {
    /**
     * Внедрение зависимости для сервиса файлового менеджера
     * @param fileService - Сервис файлового менеджера
     */
    constructor(private fileService: FileManagerService) {}

    /**
     * GET Endpoint для получения списка всех файлов. Доступен авторизованным пользователям (AuthGuard)
     * @returns Список всех файлов
     */
    @Get()
    @UseGuards(AuthGuard)
    async getAll() {
        return await this.fileService.getAll();
    }

    /**
     * GET Endpoint для получения файла по id. Доступен авторизованным пользователям (AuthGuard)
     * @param id - Идентификатор файла
     * @returns Файл с заданным id
     */
    @Get('/:id')
    @UseGuards(AuthGuard)
    async getById(@Param('id') id: number) {
        return await this.fileService.getById(id);
    }

    /**
     * POST Endpoint для загрузки и создания сущности файла. Доступен авторизованным пользователям (AuthGuard)
     * @param file - Файл для загрузки
     * @returns Сущность созданного файла
     */
    @Post()
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    async createFile(@UploadedFile() file: any) {
        return await this.fileService.createFile({ essenceTable: null, essenceId: null }, file);
    }

    /**
     * DELETE Endpoint для удаления неиспользуемых файлов. Доступен пользователям с ролью администратор (AdminGuard)
     * @returns Результат удаления
     */
    @Delete()
    @UseGuards(AdminGuard)
    async clearUnused() {
        return await this.fileService.сlearUnused();
    }
}