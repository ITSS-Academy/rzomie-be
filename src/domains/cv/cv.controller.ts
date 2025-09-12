import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  Put,
  Res,
  Delete,
} from '@nestjs/common';
import { CvService } from './cv.service';

@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @Post('/gen-theme')
  genTheme(@Body() data: any) {
    console.log(data.data.id)
    // Make sure to pass through any ID property for screenshot generation
    return this.cvService.renderCvHtml(data.data.data, data.data.id, data.data.cvTheme);
  }

  @Post('/export-pdf')
async exportPdf(@Body() data: any, @Res() res: any) {
  try {
    const pdfBuffer = await this.cvService.exportCvToPdf(data.html);
    
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=cv.pdf');
    
    return res.send(pdfBuffer);
  } catch (error) {
    console.error('Error in exportPdf:', error);
    return res.status(500).json({ error: error.message });
  }
}

@Post('/create')
  create(@Body() createCvDto: any, @Req() req: any) {
    return this.cvService.createNewCv(createCvDto.cvTheme, createCvDto.cvName, req.user.uid);
  }

  @Get('/get-all-cv-data')
  getAllCvData(@Req() req: any) {
    return this.cvService.getAllCvData(req.user.uid);
  }

  @Get('/get-default-cvs')
  getDefaultCvs() {
    return this.cvService.getBaseCvs();
  }

  @Get('/get-themes')
  getThemes() {
    return this.cvService.getAllBaseCvs();
  }

  @Get(':id')
  getById(@Param('id') id: number, @Req() req: any) {
    return this.cvService.getById(id, req.user.uid);
  }


  @Put(':id')
  update(@Param('id') id: number, @Body() updateCvDto: any, @Req() req: any) {
    return this.cvService.update(id, updateCvDto, req.user.uid);
  }


  @Delete(':id')
  delete(@Param('id') id: number, @Req() req: any) {
    return this.cvService.remove(id, req.user.uid);
  }
}
