import { Injectable } from '@nestjs/common';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';

import Handlebars from 'handlebars';
import puppeteer from 'puppeteer';
import { loadThemeConfig, loadThemeHtml } from 'src/utils/theme-loader';
import { SupabaseService } from 'src/shared/supabase/supabase.service';
import { registerHandlebarsHelpers } from 'src/utils/handlebars-helpers';

@Injectable()
export class CvService {

  
  constructor(private readonly supabaseService: SupabaseService){
    registerHandlebarsHelpers();
  }


  async renderCvHtml(createCvDto: any): Promise<string> {
    let theme!:any
    let html!: any
    console.log(createCvDto);

    const template = await loadThemeHtml('black-white');
    const compiled = Handlebars.compile(template);
    
    if(!createCvDto.theme){
      theme = await loadThemeConfig('black-white');
      html = compiled({
        ...createCvDto,
        theme
      })
    } else {
      html = compiled({
        ...createCvDto,
        theme: createCvDto.theme
      })
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
}
