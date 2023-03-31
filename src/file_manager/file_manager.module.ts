import { Module } from '@nestjs/common';
import { FileManagerService } from './file_manager.service';
import { FileManagerController } from './file_manager.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileDB } from './file.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

/**
 * Модуль файлового менеджера
 */
@Module({
  providers: [FileManagerService],
  controllers: [FileManagerController],
  imports: [TypeOrmModule.forFeature([FileDB]), UserModule, AuthModule],
  exports: [FileManagerService]
})
export class FileManagerModule {}