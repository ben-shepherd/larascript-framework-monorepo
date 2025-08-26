export const postgresDown = () => {
    const { execSync } = require('child_process');
    try {
        // Change directory to project root and run the command
        execSync('pnpm run db:postgres:down', {
            stdio: 'inherit',
            cwd: process.cwd(),
        });
    } catch (error) {
        console.error('Failed to start Postgres with pnpm db:postgres:up');
        throw error;
    }
}