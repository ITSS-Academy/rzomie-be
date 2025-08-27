import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CvThemeService } from './cv-theme.service';
import { CreateCvThemeDto } from './dto/create-cv-theme.dto';
import { UpdateCvThemeDto } from './dto/update-cv-theme.dto';

@Controller('cv-theme')
export class CvThemeController {
  constructor(private readonly cvThemeService: CvThemeService) {}

  @Post()
  create(@Body() createCvThemeDto: CreateCvThemeDto) {
    return this.cvThemeService.create(createCvThemeDto);
  }

  @Get()
  findAll() {
    return this.cvThemeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cvThemeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCvThemeDto: UpdateCvThemeDto) {
    return this.cvThemeService.update(+id, updateCvThemeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cvThemeService.remove(+id);
  }
}
