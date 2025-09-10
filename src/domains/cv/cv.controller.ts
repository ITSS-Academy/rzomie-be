import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Put,
} from '@nestjs/common';
import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';

@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @Post('/gen-theme')
  genTheme(@Body() data: any) {
    return this.cvService.renderCvHtml(data.data);
  }

  @Get('/get-all-cv-data')
  getAllCvData(@Req() req: any) {
    return this.cvService.getAllCvData(req.user.uid);
  }

  @Get(':id')
  getById(@Param('id') id: number, @Req() req: any) {
    return this.cvService.getById(id, req.user.uid);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateCvDto: any, @Req() req: any) {
    return this.cvService.update(id, updateCvDto, req.user.uid);
  }

  
}
