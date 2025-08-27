import { promises as fs } from 'fs';
import { join } from 'path';

export async function loadThemeHtml(themeName: string): Promise<string> {
  const filePath = join(process.cwd(), 'src/themes', themeName, 'template.html');
  return fs.readFile(filePath, 'utf8');
}

export async function loadThemeConfig(themeName: string): Promise<any> {
  const filePath = join(process.cwd(), 'src/themes', themeName, 'config.json');
  const content = await fs.readFile(filePath, 'utf8');
  return JSON.parse(content);
}