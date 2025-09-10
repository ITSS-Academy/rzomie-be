import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';

import Handlebars from 'handlebars';
import puppeteer from 'puppeteer';
import { loadThemeConfig, loadThemeHtml } from 'src/utils/theme-loader';
import { SupabaseService } from 'src/shared/supabase/supabase.service';
import { registerHandlebarsHelpers } from 'src/utils/handlebars-helpers';
import { log } from 'console';

@Injectable()
export class CvService {
  constructor(private readonly supabaseService: SupabaseService) {
    registerHandlebarsHelpers();
  }

  async renderCvHtml(createCvDto: any): Promise<string> {
    let theme!: any;
    let html!: any;

    const template = await loadThemeHtml('black-white');
    const compiled = Handlebars.compile(template);

    if (!createCvDto.theme) {
      theme = await loadThemeConfig('black-white');
      html = compiled({
        ...createCvDto,
        theme,
      });
    } else {
      html = compiled({
        ...createCvDto,
        theme: createCvDto.theme,
      });
    }

    // Render HTML to string using Puppeteer (headless browser)
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    // Lấy lại HTML đã render (có thể đã apply CSS, JS...)
    const renderedHtml = await page.content();
    await browser.close();
    return JSON.stringify(renderedHtml);
  }

  async getById(id: number, userId: string) {
    const { data, error } = await this.supabaseService.supabase
      .from('cv-data')
      .select('*')
      .eq('id', id)
      .eq('userId', userId)
      .single();

    if (error) {
      throw new HttpException(
        `Error fetching CV with ID ${id}: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return data;
  }

  async getAllCvData(userId: string) {
    const { data, error } = await this.supabaseService.supabase
      .from('cv-data')
      .select('id, cvName, cvTheme, create_date, update_time')
      .eq('userId', userId);
    if (error) {
      throw new HttpException(
        `Error fetching CV with ID ${userId}: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return data;
  }

  async update(id: number, updateCvDto: any, userId: string) {
    const findCv = await this.getById(id, userId);
    const newCvData = { ...findCv.cvData, ...updateCvDto };
    if (!findCv) {
      throw new HttpException(`CV with ID ${id} not found`, HttpStatus.BAD_REQUEST);
    }
    const { data, error } = await this.supabaseService.supabase
      .from('cv-data')
      .update({cvData: newCvData})
      .eq('id', id)
      .eq('userId', userId)
    if (error) {
      throw new HttpException(
        `Error updating CV with ID ${id}: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return data;
  }
}
