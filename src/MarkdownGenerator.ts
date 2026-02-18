
import { RouteEntry } from '@arikajs/router';

export class MarkdownGenerator {
    public generate(routes: RouteEntry[], appName: string): string {
        let markdown = `# API Documentation: ${appName}\n\n`;
        markdown += `Generated on ${new Date().toLocaleDateString()}\n\n`;

        const groups = this.groupByPrefix(routes);

        for (const [group, groupRoutes] of Object.entries(groups)) {
            markdown += `## ${group}\n\n`;
            markdown += `| Method | Path | Name | Middleware |\n`;
            markdown += `| :--- | :--- | :--- | :--- |\n`;

            groupRoutes.forEach(route => {
                const middleware = route.middleware.map(m => typeof m === 'string' ? m : m.name || 'Closure').join(', ') || '-';
                markdown += `| **${route.method}** | \`${route.path}\` | ${route.name || '-'} | ${middleware} |\n`;
            });

            markdown += `\n`;
        }

        return markdown;
    }

    private groupByPrefix(routes: RouteEntry[]): Record<string, RouteEntry[]> {
        const groups: Record<string, RouteEntry[]> = {};
        routes.forEach(route => {
            const group = route.prefix || 'General';
            if (!groups[group]) groups[group] = [];
            groups[group].push(route);
        });
        return groups;
    }
}
