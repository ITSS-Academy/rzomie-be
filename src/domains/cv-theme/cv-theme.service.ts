import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCvThemeDto } from './dto/create-cv-theme.dto';
import { UpdateCvThemeDto } from './dto/update-cv-theme.dto';
import { SupabaseService } from 'src/shared/supabase/supabase.service';

@Injectable()
export class CvThemeService {
  
  constructor(private readonly supabaseService: SupabaseService){

  }

  create(createCvThemeDto: CreateCvThemeDto) {
    return 'This action adds a new cvTheme';
  }

  findAll() {
    return `This action returns all cvTheme`;
  }

  async findOne(id: number) {
    const { data, error } = await this.supabaseService.supabase.from('cv-themes').select('*').eq('id', id).single();
    if(error) {
      throw new HttpException("CV Theme not found", HttpStatus.BAD_REQUEST);
    }
    return data
  }

  update(id: number, updateCvThemeDto: UpdateCvThemeDto) {
    return `This action updates a #${id} cvTheme`;
  }

  remove(id: number) {
    return `This action removes a #${id} cvTheme`;
  }
}
