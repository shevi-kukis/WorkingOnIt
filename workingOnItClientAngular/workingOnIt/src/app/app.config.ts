import { type ApplicationConfig, importProvidersFrom } from "@angular/core"
import { provideRouter } from "@angular/router"
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async"
import { provideHttpClient, withInterceptors } from "@angular/common/http"
import { MatSnackBarModule } from "@angular/material/snack-bar"
import { routes } from "./app.routes"
import { authInterceptor } from "../core/interceptors/auth.interceptor"

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom(MatSnackBarModule),
  ],
}
