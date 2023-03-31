import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileManagerService } from 'src/file_manager/file_manager.service';
import { Repository } from 'typeorm';
import { TextBlockDto } from './dto/text_block.dto';
import { UpdateTextBlockDto } from './dto/update-text_block.dto';
import { TextBlock } from './text_block.entity';

/**
 * Сервис текстового блока
 */
@Injectable()
export class TextBlockService {
    /**
     * Внедрение зависимостей для репозитория текстовых блоков и сервиса файлового менеджера
     * @param textBlockRepo - Репозиторий текстовых блоков
     * @param fileService - Сервис файлового менеджера
     */
    constructor(@InjectRepository(TextBlock) private textBlockRepo: Repository<TextBlock>,
        private fileService: FileManagerService) {}

    /**
     * Функция для получения списка всех текстовых блоков
     * @returns Список всех текстовых блоков
     */
    async getAll() {
        return await this.textBlockRepo.find();
    }

    /**
     * Функция для получения текстового блока по id
     * @param id - Идентификатор текстового блока
     * @returns Текстовый блок с заданным id
     */
    async getById(id: number) {
        const block = await this.textBlockRepo.findOne({
            where: {
                id: id
            }
        })

        if (block) {
            return block;
        }

        throw new HttpException('Text block by this id was not found', HttpStatus.NOT_FOUND)
    }

    /**
     * Функция для получения текстового блока по имени
     * @param name - Имя текстового блока
     * @returns Текстовый блок с заданным именем
     */
    async getByName(name: string) {
        return await this.textBlockRepo.findOne({
            where: {
                name: name
            }
        })
    }

    /**
     * Функция для получения текстового блока по группе
     * @param group - Группа текстового блока для поиска
     * @returns Текстовые блоки с заданной группой
     */
    async getAllByGroup(group: string) {
        return await this.textBlockRepo.find({
            where: {
                group: group
            }
        })
    }

    /**
     * Функция для создания нового текстового блока
     * @param dto - Data Transfer Object для создания нового текстового блока
     * @param image - Файл картинки для создаваемого текстового блока
     * @returns Созданный текстовый блок
     */
    async createBlock(dto: TextBlockDto, image: any) {
        if (await this.getByName(dto.name)) {
            throw new HttpException('Text block with this name is already exists', HttpStatus.BAD_REQUEST);
        }

        const file = await this.fileService.createFile({ essenceTable: null, essenceId: null }, image);
        const block = await this.textBlockRepo.save({ ...dto, image: file.path });
        await this.fileService.updateFile({ id: file.id, essenceTable: 'text_block', essenceId: block.id });
        return block;
    }

    /**
     * Функция для редактирования текстового блока
     * @param dto - Data Transfer Object для редактирования нового текстового блока
     * @param image (необязательный) Новый файл картинки для текстового блока
     * @returns Результат редактирования
     */
    async updateBlock(dto: UpdateTextBlockDto, image?: any) {
        const block = await this.getById(dto.id);

        if (dto.name != block.name && await this.getByName(dto.name)) {
            throw new HttpException('Text block with this name is already exists', HttpStatus.BAD_REQUEST);
        }

        if (image) {
            const file = await this.fileService.getByEssence('text_block', block.id);
            await this.fileService.updateFile({ id: file.id, essenceTable: null, essenceId: null });

            const newFile = await this.fileService.createFile({ essenceTable: null, essenceId: null }, image);
            block.name = dto.name;
            block.title = dto.title;
            block.text = dto.text;
            block.group = dto.group;
            block.image = newFile.path;
            const newBlock = await this.textBlockRepo.save(block);
            await this.fileService.updateFile({ id: newFile.id, essenceTable: 'text_block', essenceId: block.id });
            return newBlock;
        } else {
            block.name = dto.name;
            block.title = dto.title;
            block.text = dto.text;
            block.group = dto.group;
            return await this.textBlockRepo.save(block);
        }
    }

    /**
     * Функция для удаления текстового блока
     * @param id - Идентификатор текстового блока
     * @returns Результат удаления
     */
    async deleteBlock(id: number) {
        const file = await this.fileService.getByEssence('text_block', id);
        await this.fileService.updateFile({ id: file.id, essenceTable: null, essenceId: null });
        return await this.textBlockRepo.delete(id);
    }
}