import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, LessThan, Repository } from 'typeorm';
import { FileDB } from './file.entity';
import * as fs from 'fs';
import * as uuid from 'uuid';
import * as path from 'path';
import { FileDto } from './dto/file.dto';
import { UpdateFileDto } from './dto/update-file.dto';

/**
 * Сервис файлового менеджера
 */
@Injectable()
export class FileManagerService {
    /**
     * Внедрение зависимости репозитория файлов
     * @param fileRepo - Репозиторий файлов
     */
    constructor(@InjectRepository(FileDB) private fileRepo: Repository<FileDB>) {}

    /**
     * Функция для получения списка всех файлов
     * @returns Список всех файлов
     */
    async getAll() {
        return await this.fileRepo.find();
    }

    /**
     * Функция для получения файла по id
     * @param id Идентификатор файла
     * @returns Файл с заданным id
     */
    async getById(id: number) {
        const file = await this.fileRepo.findOne({
            where: {
                id: id
            }
        });

        if (file) {
            return file;
        }

        throw new HttpException('File by this id was not found', HttpStatus.NOT_FOUND);
    }

    /**
     * Функция для получения файла по использующей его сущности
     * @param table - Название использующей таблицы
     * @param id - Идентификатор использующей сущности
     * @returns Искомый файл
     */
    async getByEssence(table: string, id: number) {
        return await this.fileRepo.findOne({
            where: {
                essenceTable: table,
                essenceId: id
            }
        })
    }

    /**
     * Функция для загрузки файла на диск
     * @param file - Загружаемый файл
     * @returns Полный путь до загруженного файла
     */
    async uploadFile(file: any) {
        try {
            const fileName = uuid.v4() + '.jpg';
            const filePath = path.resolve(__dirname, '..', '..', 'static');
            
            if(!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, { recursive: true });
            }
            fs.writeFileSync(path.join(filePath, fileName), file.buffer);
            return path.join(filePath, fileName);
        } catch(e) {
            throw new HttpException('An error occurred while writing a file', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Функция для загрузки и создания сущности файла
     * @param dto - Data Transfer Object для создания сущности файла
     * @param file - Загружаемый файл
     * @returns Созданная сущность файла
     */
    async createFile(dto: FileDto, file: any) {
        const path = await this.uploadFile(file);
        return await this.fileRepo.save({ ...dto, path: path });
    }

    /**
     * Функция для редактирования сущности файла
     * @param dto - Data Transfer Object для редактирования сущности файла
     * @returns Результат редактирования
     */
    async updateFile(dto: UpdateFileDto) {
        const file = await this.getById(dto.id);

        return await this.fileRepo.save({ ...file, essenceTable: dto.essenceTable, essenceId: dto.essenceId });
    }

    /**
     * Функция для удаления неиспользуемых файлов
     * @returns Результат удаления
     */
    async сlearUnused() {
        const unusedFiles = await this.fileRepo.find({
            where: {
                createdAt: LessThan(new Date(Date.now() - 60 * 60 * 1000)),
                essenceId: IsNull(),
                essenceTable: IsNull()
            }
        });

        unusedFiles.forEach(async file => {
            await this.fileRepo.delete(file.id);
            fs.rmSync(file.path);
        });

        return { deleted: unusedFiles.length }
    }
}