import health from "@/app/routes/health.js";
import Route from "@/core/domains/http/router/Route.js";

/**
 * Health routes
 */
export default Route.group(router => {
    router.get('/health', health)
})
