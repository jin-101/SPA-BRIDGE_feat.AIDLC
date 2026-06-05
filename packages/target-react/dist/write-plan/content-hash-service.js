import { createHash } from 'node:crypto';
export class ContentHashService {
    hash(pathValue, content) {
        return createHash('sha256').update(`${pathValue}\0${content}`).digest('hex');
    }
}
//# sourceMappingURL=content-hash-service.js.map