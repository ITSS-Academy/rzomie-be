import { Module } from '@nestjs/common';
import { CvService } from './cv.service';
import { CvController } from './cv.controller';
import { CvThemeModule } from '../cv-theme/cv-theme.module';

@Module({
  imports: [CvThemeModule],
  controllers: [CvController],
  providers: [CvService],
})
export class CvModule {}
