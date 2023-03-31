import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './profile.entity';

/**
 * Сервис профиля
 */
@Injectable()
export class ProfileService {
    /**
     * Внедрение зависимостей для репозитория профиля и сервиса пользователя
     * @param profileRepo - Репозиторий профиля
     * @param userService  - Сервис пользователя
     */
    constructor(@InjectRepository(Profile) private profileRepo: Repository<Profile>,
        private userService: UserService) {}

    /**
     * Функция для получения списка всех профилей
     * @returns Список всех профилей
     */
    async getAll() {
        return await this.profileRepo.find({
            relations: {
                user: true
            }
        });
    }

    /**
     * Функция для получения профиля по id
     * @param id - Идентификатор профиля
     * @returns Профиль с заданным id
     */
    async getById(id: number) {
        const user = await this.profileRepo.findOne({
            relations: {
                user: true
            },

            where: {
                id: id
            }
        });

        if(user) {
            return user;
        }

        throw new HttpException('Profile by this id was not found', HttpStatus.NOT_FOUND);
    }

    /**
     * Функция для создания нового профиля
     * @param dto - Data Transfer Object для создания нового профиля
     * @returns Созданная сущность профиля
     */
    async createProfile(dto: CreateProfileDto) {
        const user = await this.userService.getByLogin(dto.user.login);
        if (user)  {
            return await this.profileRepo.save({ ...dto, user: user });
        }

        throw new HttpException('User by this id was not found', HttpStatus.NOT_FOUND);
    }

    /**
     * Функция для редактирования профиля
     * @param dto - Data Transfer Object для редактирования профиля
     * @returns Результат редактирования
     */
    async updateProfile(dto: UpdateProfileDto) {
        const profile = await this.getById(dto.id);
        const user = await this.userService.getById(dto.user);
        if (profile && user) {
            return await this.profileRepo.save({ ...dto, user: user });
        }

        throw new HttpException('Profile or User by this id was not found', HttpStatus.NOT_FOUND);
    }

    /**
     * Функция для удаления профиля
     * @param id - Идентификатор профиля
     * @returns Результат удаления
     */
    async deleteProfile(id: number) {
        return await this.profileRepo.delete(id);
    }
}