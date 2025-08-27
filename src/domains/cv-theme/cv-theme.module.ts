import { Module } from '@nestjs/common';
import { CvThemeService } from './cv-theme.service';
import { CvThemeController } from './cv-theme.controller';

@Module({
  controllers: [CvThemeController],
  providers: [CvThemeService],
  exports: [CvThemeService],
})
export class CvThemeModule {}
