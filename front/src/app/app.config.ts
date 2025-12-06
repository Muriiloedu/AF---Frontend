import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
// IMPORTANTE: Adicione este import
import { provideHttpClient, withFetch  } from '@angular/common/http'; 

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()), // <--- Adiciona a funcionalidade HTTP globalmente
    provideRouter(routes)
  ]
};
function provideZoneChangeDetection(arg0: { eventCoalescing: boolean; }): import("@angular/core").Provider | import("@angular/core").EnvironmentProviders {
  throw new Error('Function not implemented.');
}

