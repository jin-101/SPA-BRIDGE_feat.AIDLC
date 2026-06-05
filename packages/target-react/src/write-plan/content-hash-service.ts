import { createHash } from 'node:crypto';

export class ContentHashService {
  hash(pathValue: string, content: string): string {
    return createHash('sha256').update(`${pathValue}\0${content}`).digest('hex');
  }
}
