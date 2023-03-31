import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminGuard } from 'src/auth/admin.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { TextBlockDto } from './dto/text_block.dto';
import { UpdateTextBlockDto } from './dto/update-text_block.dto';
import { TextBlockService } from './text_block.service';

/**
 * Контроллер текстового блока
 */
@Controller('api/block')
export class TextBlockController {
    /**
     * Внедрение зависимости для сервиса текстового блока
     * @param textBlockService - Сервис текстового блока
     */
    constructor(private textBlockService: TextBlockService) {}

    /**
     * GET Endpoint для получения списка всех текстовых блоков. Доступен авторизованным пользователям (AuthGuard)
     * @returns Список всех текстовых блоков
     */
    @Get()
    @UseGuards(AuthGuard)
    async getAll() {
        return await this.textBlockService.getAll();
    }

    /**
     * GET Endpoint для получения текстового блока по id. Доступен авторизованным пользователям (AuthGuard)
     * @param id - Идентификатор текстового блока
     * @returns Текстовый блок с заданным id
     */
    @Get('/:id')
    @UseGuards(AuthGuard)
    async getById(@Param('id') id: number) {
        return await this.textBlockService.getById(id);
    }

    /**
     * GET Endpoint для получения текстового блока по группе. Доступен авторизованным пользователям (AuthGuard)
     * @param group - Группа текстового блока для поиска
     * @returns Текстовые блоки с заданной группой
     */
    @Get('/group/:group')
    @UseGuards(AuthGuard)
    async getAllByGroup(@Param('group') group: string) {
        return await this.textBlockService.getAllByGroup(group);
    }

    /**
     * POST Endpoint для создания нового текстового блока. Доступен пользователям с ролью администратор (AdminGuard)
     * @param dto - Data Transfer Object для создания нового текстового блока
     * @param image - Файл картинки для создаваемого текстового блока
     * @returns Созданный текстовый блок
     */
    @Post()
    @UseGuards(AdminGuard)
    @UseInterceptors(FileInterceptor('image'))
    async createBlock(@Body() dto: TextBlockDto, @UploadedFile() image: any) {
        return await this.textBlockService.createBlock(dto, image);
    }

    /**
     * PUT Endpoint для редактирования текстового блока. Доступен пользователям с ролью администратор (AdminGuard)
     * @param dto - Data Transfer Object для редактирования нового текстового блока
     * @param image - (необязательный) Новый файл картинки для текстового блока
     * @returns Результат редактирования
     */
    @Put()
    @UseGuards(AdminGuard)
    @UseInterceptors(FileInterceptor('image'))
    async updateBlock(@Body() dto: UpdateTextBlockDto, @UploadedFile() image?: any) {
        if (image) {
            return await this.textBlockService.updateBlock(dto, image);
        }

        return await this.textBlockService.updateBlock(dto);
    }

    /**
     * DELETE Endpoint для удаления текстового блока. Доступен пользователям с ролью администратор (AdminGuard)
     * @param id - Идентификатор текстового блока
     * @returns Результат удаления
     */
    @Delete('/:id')
    @UseGuards(AdminGuard)
    async deleteBlock(@Param('id') id: number) {
        return await this.textBlockService.deleteBlock(id);
    }
}