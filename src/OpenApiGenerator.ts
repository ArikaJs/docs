
import { RouteEntry } from '@arikajs/router';

export class OpenApiGenerator {
    public generate(routes: RouteEntry[], appName: string): any {
        return {
            openapi: "3.0.0",
            info: {
                title: appName,
                description: `API Specification for ${appName}`,
                version: "1.0.0"
            },
            paths: this.formatPaths(routes),
            components: {
                schemas: {},
                securitySchemes: {
                    bearerAuth: {
                        type: "http",
                        scheme: "bearer",
                        bearerFormat: "JWT"
                    }
                }
            }
        };
    }

    private formatPaths(routes: RouteEntry[]): any {
        const paths: any = {};

        routes.forEach(route => {
            const path = route.path.replace(/:([a-zA-Z0-9_]+)|\{([a-zA-Z0-9_]+)\}/g, '{$1$2}');

            if (!paths[path]) {
                paths[path] = {};
            }

            paths[path][route.method.toLowerCase()] = {
                summary: route.name || `Endpoint for ${path}`,
                tags: [route.prefix || 'General'],
                parameters: this.extractParameters(route),
                responses: {
                    "200": {
                        description: "Successful response",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object"
                                }
                            }
                        }
                    }
                }
            };
        });

        return paths;
    }

    private extractParameters(route: RouteEntry): any[] {
        return route.paramKeys.map(key => ({
            name: key,
            in: "path",
            required: true,
            schema: {
                type: "string"
            }
        }));
    }
}
