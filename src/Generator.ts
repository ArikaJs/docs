
import { RouteRegistry } from '@arikajs/router';
import { PostmanGenerator } from './PostmanGenerator';
import { MarkdownGenerator } from './MarkdownGenerator';
import { HtmlGenerator } from './HtmlGenerator';
import { OpenApiGenerator } from './OpenApiGenerator';
import fs from 'fs';
import path from 'path';

export class DocumentationGenerator {
    protected postman: PostmanGenerator;
    protected markdown: MarkdownGenerator;
    protected html: HtmlGenerator;
    protected openApi: OpenApiGenerator;

    constructor() {
        this.postman = new PostmanGenerator();
        this.markdown = new MarkdownGenerator();
        this.html = new HtmlGenerator();
        this.openApi = new OpenApiGenerator();
    }

    public generateAll(appName: string, outputDir: string): void {
        const routes = RouteRegistry.getInstance().getRoutes();

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Postman
        const postmanJson = this.postman.generate(routes, appName);
        fs.writeFileSync(path.join(outputDir, 'postman_collection.json'), JSON.stringify(postmanJson, null, 2));

        // Environment
        const envJson = {
            name: `${appName} Env`,
            values: [
                { key: "base_url", value: "http://localhost:3000", enabled: true }
            ]
        };
        fs.writeFileSync(path.join(outputDir, 'postman_environment.json'), JSON.stringify(envJson, null, 2));

        // Markdown
        const md = this.markdown.generate(routes, appName);
        fs.writeFileSync(path.join(outputDir, 'DOCS.md'), md);

        // HTML
        const html = this.html.generate(routes, appName);
        fs.writeFileSync(path.join(outputDir, 'api_docs.html'), html);

        // OpenAPI
        const openApiJson = this.openApi.generate(routes, appName);
        fs.writeFileSync(path.join(outputDir, 'openapi.json'), JSON.stringify(openApiJson, null, 2));
    }
}
