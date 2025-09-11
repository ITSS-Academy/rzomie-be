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

    const template = await loadThemeHtml('pastel-green');
    const compiled = Handlebars.compile(template);

    if (!createCvDto.theme) {
      theme = await loadThemeConfig('pastel-green');
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
    
    // Capture screenshot of the first page if cvId is provided
    if (createCvDto.id) {
      try {
        // Set viewport to A4 size for consistent screenshot
        await page.setViewport({
          width: 794, // A4 width in pixels at 96 DPI
          height: 1123, // A4 height in pixels at 96 DPI
          deviceScaleFactor: 2, // Higher resolution for better quality
        });
        
        // Capture screenshot
        const screenshot = await page.screenshot({ 
          type: 'jpeg',
          quality: 90,
          fullPage: false // Only capture the viewport (first page)
        });
        
        // Upload to Supabase Storage
        const fileName = `cv-thumbnails/${createCvDto.id}.jpg`;
        const { data: uploadData, error: uploadError } = await this.supabaseService.supabase
          .storage
          .from('cv-images')
          .upload(fileName, screenshot, {
            contentType: 'image/jpeg',
            upsert: true
          });
          
        if (uploadError) {
          console.error('Error uploading CV screenshot:', uploadError);
        } else {
          // Get public URL for the uploaded image
          const { data: urlData } = this.supabaseService.supabase
            .storage
            .from('cv-images')
            .getPublicUrl(fileName);
            
          // Update the CV record with the thumbnail URL
          await this.supabaseService.supabase
            .from('cv-data')
            .update({ 
              thumbnailUrl: urlData.publicUrl,
              update_time: new Date().toISOString()
            })
            .eq('id', createCvDto.id);
        }
      } catch (error) {
        // Log error but don't interrupt the main CV rendering process
        console.error('Error generating CV thumbnail:', error);
      }
    }
    
    // Lấy lại HTML đã render (có thể đã apply CSS, JS...)
    const renderedHtml = await page.content();
    await browser.close();
    return JSON.stringify(renderedHtml);
  }

  async exportCvToPdf(cvHtml: any) {
    const html = cvHtml
    // Render HTML to PDF using Puppeteer
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();
    return pdfBuffer;
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

  async getBaseCvs() {
    const { data, error } = await this.supabaseService.supabase
      .from('base-theme')
      .select('*');
    if (error) {
      throw new HttpException(
        `Error fetching base CVs: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return data;
  }
}
