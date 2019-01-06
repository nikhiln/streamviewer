import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SocialLoginModule, AuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';

import { RouteReusableStrategy } from './route-reusable-strategy';
import { AuthenticationService } from './authentication/authentication.service';
import { AuthenticationGuard } from './authentication/authentication.guard';
import { I18nService } from './i18n.service';
import { HttpService } from './http/http.service';
import { ApiInterceptor } from './http/api.interceptor';
import { ErrorHandlerInterceptor } from './http/error-handler.interceptor';

import { environment } from '@env/environment';

let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider(environment.googleDeveloperKey)
  }
]);

export function provideConfig() {
  return config;
}

@NgModule({
  imports: [CommonModule, HttpClientModule, TranslateModule, RouterModule, SocialLoginModule],
  providers: [
    AuthenticationService,
    AuthenticationGuard,
    I18nService,
    ApiInterceptor,
    ErrorHandlerInterceptor,
    {
      provide: HttpClient,
      useClass: HttpService
    },
    {
      provide: RouteReuseStrategy,
      useClass: RouteReusableStrategy
    },
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    // Import guard
    if (parentModule) {
      throw new Error(`${parentModule} has already been loaded. Import Core module in the AppModule only.`);
    }
  }
}
