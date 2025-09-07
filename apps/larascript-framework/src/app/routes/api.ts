import WelcomeController from "@/app/controllers/WelcomeController.js"
import Route from "@/core/domains/http/router/Route.js"

export default Route.group(router => {

    router.get('/', WelcomeController)
    
})
