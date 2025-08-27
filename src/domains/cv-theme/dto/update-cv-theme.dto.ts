import { PartialType } from '@nestjs/mapped-types';
import { CreateCvThemeDto } from './create-cv-theme.dto';

export class UpdateCvThemeDto extends PartialType(CreateCvThemeDto) {}
