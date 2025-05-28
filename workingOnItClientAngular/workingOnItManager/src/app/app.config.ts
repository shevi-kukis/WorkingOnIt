import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { authInterceptor } from '../core/interceptors/auth.interceptor';
import { provideMaterialDesignComponents } from './material.providers';



export const appConfig: ApplicationConfig = {
  providers: [ provideRouter(routes), provideClientHydration(),   provideHttpClient(
    withInterceptors([
      authInterceptor // חיבור האינטרספטור
    ])
  ), provideAnimations(),  provideMaterialDesignComponents()]
};
