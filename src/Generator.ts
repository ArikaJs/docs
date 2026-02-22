
import { RouteRegistry } from '@arikajs/router';
import { PostmanGenerator } from './PostmanGenerator';
import { MarkdownGenerator } from './MarkdownGenerator';
import { HtmlGenerator } from './HtmlGenerator';
import { OpenApiGenerator } from './OpenApiGenerator';
import fs from 'fs';
import path from 'path';
import { DocDriver } from './Drivers/DocDriver';

export class DocumentationGenerator {
    protected drivers: DocDriver[] = [];

    constructor() {
        this.drivers = [
            new PostmanGenerator(),
            new MarkdownGenerator(),
            new HtmlGenerator(),
            new OpenApiGenerator()
        ];
    }

    /**
     * Generate all documentation formats.
     */
    public generateAll(appName: string, outputDir: string, options: { filterPrefix?: string } = {}): void {
        let routes = RouteRegistry.getInstance().getRoutes();

        // Filter routes if prefix filter is provided
        if (options.filterPrefix) {
            routes = routes.filter(route =>
                route.path.startsWith(options.filterPrefix!) ||
                (route.prefix && route.prefix.startsWith(options.filterPrefix!))
            );
        }

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        for (const driver of this.drivers) {
            const content = driver.generate(routes, appName);
            const filename = driver.getFilename(appName);
            const outputPath = path.join(outputDir, filename);

            const outputContent = typeof content === 'string'
                ? content
                : JSON.stringify(content, null, 2);

            fs.writeFileSync(outputPath, outputContent);
        }

        // Always generate Postman Environment if Postman driver is present
        this.generateEnvironment(appName, outputDir);
    }

    protected generateEnvironment(appName: string, outputDir: string): void {
        const envJson = {
            name: `${appName} Env`,
            values: [
                { key: "base_url", value: "http://localhost:3000", enabled: true }
            ]
        };
        fs.writeFileSync(path.join(outputDir, 'postman_environment.json'), JSON.stringify(envJson, null, 2));
    }

    public addDriver(driver: DocDriver): this {
        this.drivers.push(driver);
        return this;
    }
}
