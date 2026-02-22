
import { RouteEntry } from '@arikajs/router';
import { DocDriver } from './Drivers/DocDriver';

export class PostmanGenerator implements DocDriver {
    public getExtension(): string { return 'json'; }
    public getFilename(): string { return 'postman_collection.json'; }
    public generate(routes: RouteEntry[], appName: string): any {
        return {
            info: {
                name: appName,
                _postman_id: Math.random().toString(36).substring(7),
                description: `API Collection for ${appName}`,
                schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
            },
            item: this.formatRoutes(routes),
            variable: [
                {
                    key: "base_url",
                    value: "http://localhost:3000",
                    type: "string"
                }
            ]
        };
    }

    private formatRoutes(routes: RouteEntry[]): any[] {
        // Group routes by prefix/module
        const groups: Record<string, any[]> = {};

        routes.forEach(route => {
            const groupName = route.prefix || 'General';
            if (!groups[groupName]) {
                groups[groupName] = [];
            }

            groups[groupName].push({
                name: route.name || route.path,
                request: {
                    method: route.method,
                    header: [
                        {
                            key: "Content-Type",
                            value: "application/json"
                        },
                        {
                            key: "Accept",
                            value: "application/json"
                        }
                    ],
                    url: {
                        raw: "{{base_url}}" + route.path,
                        host: ["{{base_url}}"],
                        path: route.path.split('/').filter(p => p !== '')
                    }
                },
                response: []
            });
        });

        return Object.keys(groups).map(name => ({
            name: name.charAt(0).toUpperCase() + name.slice(1).replace('/', ''),
            item: groups[name]
        }));
    }
}
