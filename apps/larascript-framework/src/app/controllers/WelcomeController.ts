import Controller from "@/core/domains/http/base/Controller.js";
import HttpContext from "@/core/domains/http/context/HttpContext.js";

class WelcomeController extends Controller {

    async invoke(context: HttpContext) {
        this.render('welcome', {
            title: 'Welcome to Larascript Framework',
            requestId: context.getRequest().id,
        })
    }

}

export default WelcomeController;
