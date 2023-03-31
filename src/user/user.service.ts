import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './role';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

/**
 * Сервис пользователя
 */
@Injectable()
export class UserService {
    /**
     * Внедрение зависимости для репозитория пользователя
     * @param userRepo - Репозиторий пользователя
     */
    constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

    /**
     * Функция для получения списка всех пользователей
     * @returns Список всех пользователей
     */
    async getAll() {
        return await this.userRepo.find();
    }

    /**
     * Функция для получения пользователя по id
     * @param id - Идентификатор пользователя
     * @returns Пользователь с заданным id
     */
    async getById(id: number) {
        const user = await this.userRepo.findOne({
            where: {
                id: id
            }
        });

        if (user) {
            return user;
        }

        throw new HttpException('User by this id was not found', HttpStatus.NOT_FOUND);
    }

    /**
     * Функция для получения пользователя по логину
     * @param login - Логин пользователя
     * @returns Пользователь с заданным логином
     */
    async getByLogin(login: string) {
        return await this.userRepo.findOneBy({
            login: login
        });
    }

    /**
     * Функция для создания пользователя
     * @param dto - Data Transfer Object для создания пользователя
     * @returns Созданного пользователя
     */
    async createUser(dto: CreateUserDto) {
        return await this.userRepo.save({ ...dto, role: Role.ROLE_USER });
    }

    /**
     * Функция для редактирования пользователя
     * @param dto - Data Transfer Object для редактирования пользователя
     * @returns Результат редактирования
     */
    async updateUser(dto: UpdateUserDto) {
        const user = await this.getById(dto.id);
        if (user.login != dto.login && await this.getByLogin(dto.login)) {
            throw new HttpException('User by this login is already exists', HttpStatus.BAD_REQUEST);
        }

        user.login = dto.login;
        user.password = await bcrypt.hash(dto.password, 5);

        return await this.userRepo.save(user);
    }

    /**
     * Функция для назначения пользователю роли администратора
     * @param id - Идентификатор пользователя
     * @returns Результат редактирования
     */
    async swapToAdmin(id: number) {
        return await this.userRepo.save({ ...await this.getById(id), role: Role.ROLE_ADMIN });
    }

    /**
     * Функция для назначения пользователю роли пользователя
     * @param id - Идентификатор пользователя
     * @returns Результат редактирования
     */
    async swapToUser(id: number) {
        return await this.userRepo.save({ ...await this.getById(id), role: Role.ROLE_USER });
    }

    /**
     * Функция для удаления пользователя
     * @param id - Идентификатор пользователя
     * @returns Результат удаления
     */
    async deleteUser(id: number) {
        return await this.userRepo.delete(id);
    }
}