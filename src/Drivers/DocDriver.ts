
import { RouteEntry } from '@arikajs/router';

export interface DocDriver {
    generate(routes: RouteEntry[], appName: string): any;
    getExtension(): string;
    getFilename(appName: string): string;
}
