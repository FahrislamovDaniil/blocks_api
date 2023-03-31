import { Module } from '@nestjs/common';
import { TextBlockService } from './text_block.service';
import { TextBlockController } from './text_block.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { FileManagerModule } from 'src/file_manager/file_manager.module';
import { TextBlock } from './text_block.entity';

/**
 * Модуль текстового блока
 */
@Module({
  providers: [TextBlockService],
  controllers: [TextBlockController],
  imports: [TypeOrmModule.forFeature([TextBlock]), UserModule, AuthModule, FileManagerModule]
})
export class TextBlockModule {}
