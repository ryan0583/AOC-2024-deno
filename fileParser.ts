import fs from 'node:fs';
import path from 'node:path';

export const read = (directory: string, filename: string) => {
  const filePath = path.join(directory, filename);
  return fs.readFileSync(filePath, 'utf-8');
}

export const readLines = (directory: string, filename: string) => 
  read(directory, filename).split(/\r?\n/);
