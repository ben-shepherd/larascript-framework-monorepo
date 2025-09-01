import health from '@src/app/routes/health';
import Route from '@src/core/domains/http/router/Route';

/**
 * Health routes
 */
export default Route.group(router => {
    router.get('/health', health)
})
