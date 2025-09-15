import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { OAuthModule } from 'angular-oauth2-oidc';

import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';
import { SidenavComponent } from './layout/sidenav/sidenav.component';
import { HttpClientModule } from '@angular/common/http';
import { TopNavbarComponent } from './layout/top-navbar/top-navbar.component';
import { SharedModule } from './shared/shared.module';

import { MarkdownModule, MarkedOptions, MarkedRenderer } from 'ngx-markdown';
import { CoreModule } from './core/core.module';
import { environment } from '@environments/environment';
import { MatIconRegistry } from '@angular/material/icon';
import { HttpErrorInterceptor } from './core/interceptors/http-error.interceptor';
import { AppConfigService } from './core/services/app-config/app-config.service';
import { SpinnerModule } from './shared/components/spinner/spinner.module';
import { FooterComponent } from './layout/footer/footer.component';
import { AuthService } from '@app/core/services/auth/auth.service';

export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function initKeycloak(authService: AuthService) {
  return () => {
    if (environment.develop) {
      // For local/staging, use mock token
      const mockToken = `eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIxSWd6NVI2a3A2Znp4NkItcERDZmFQNXFHWVZaTjJPZHZ6RXVxaThMZklBIn0.eyJleHAiOjE3NTc5Mzk4NDEsImlhdCI6MTc1NzkzOTU0MSwiYXV0aF90aW1lIjoxNzU3OTM5NTQxLCJqdGkiOiIyMzVlYjg2Zi0zYTlmLTRkZGItOTBhMy0wOTMxZWVmZDk5ZDciLCJpc3MiOiJodHRwczovL2F1dGguYWlvZC5ldS9haW9kLWF1dGgvcmVhbG1zL2Fpb2QiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiZDJmMjcwMDUtMzAxOC00NzAyLThmNzgtYWFhMmY1NmU3NDdkIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoibWFya2V0cGxhY2UiLCJub25jZSI6IldXZExkbFJoVTIxcVdrUTRMVFJMYmtONGMySjVmblExYVRKeGRHRmFia1oyV0hob2EwZDFia1ZsUWxsMyIsInNlc3Npb25fc3RhdGUiOiJmNTFmMjc4Ny01NjZiLTRiZGEtOWVkMy04ZGJkZmUxYzVlYWIiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbIioiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iLCJkZWZhdWx0LXJvbGVzLWFpb2QiXX0sInNjb3BlIjoib3BlbmlkIG1pY3JvcHJvZmlsZS1qd3QgcHJvZmlsZSBlbWFpbCIsInNpZCI6ImY1MWYyNzg3LTU2NmItNGJkYS05ZWQzLThkYmRmZTFjNWVhYiIsInVwbiI6Imp0b3J0b2xhIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJKdWxpw6FuIFTDs3J0b2xhIExhaGlndWVyYSIsImdyb3VwcyI6WyJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIiwiZGVmYXVsdC1yb2xlcy1haW9kIl0sInByZWZlcnJlZF91c2VybmFtZSI6Imp0b3J0b2xhIiwiZ2l2ZW5fbmFtZSI6Ikp1bGnDoW4iLCJmYW1pbHlfbmFtZSI6IlTDs3J0b2xhIExhaGlndWVyYSIsImVtYWlsIjoianVsaWFudG9ydG9sYTFAZ21haWwuY29tIn0.XvE5NrEZ2JUDoB81PxF5KgqpJFnbWjFDpj_XykNDCEHb6okrUIlTiQbqqpyA8c3xIHvMq5WfNwEINTkZdcE753wDQ5j3zYmN0iXNwHl7nGZiwR9rir7TmT_9n8qUJCJdd7-aRlKATBqzltsjrY58vH41ZfR51pE9d_8fYe7iPsIvKz6Zwx2iEirp1LeTWZZw3zonQCEu8SdfGOSWcp2JYVtBNpZlKuMLDmcjRXnENysIhcN29Dm_cWupNzLzjrViRwb3XzQGyXEX00nQJI2rT3Du590FudSkE-l9HKwgs1LPu5KAoewKAX_LwVLBNjYe-g3pvCF7sCRTRXmbYSQcGA`;
      authService.setMockToken(mockToken);
      return Promise.resolve();
    } else {
      return authService.init();
    }
  };
}

const { base } = environment.api;

const renderer = new MarkedRenderer();

renderer.paragraph = (text: string) => {
  if (text.startsWith('&lt;img')) {
    const div = document.createElement('div');
    div.innerHTML = text.trim();
    if (div.firstChild?.textContent != null) {
      return div.firstChild.textContent;
    } else {
      return '';
    }
  } else {
    return '<p>' + text + '</p>';
  }
};

renderer.link = (href, title, text) => {
  if (text.endsWith('/&gt;')) {
    return text;
  } else {
    return '<a href="' + href + '" title="' + title + '">' + text + '</a>';
  }
};

@NgModule({
  declarations: [
    AppComponent,
    ContentLayoutComponent,
    SidenavComponent,
    TopNavbarComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    SpinnerModule,
    OAuthModule.forRoot({
      resourceServer: {
        allowedUrls: [base],
        sendAccessToken: true,
      },
    }),
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      useDefaultLang: true,
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    BrowserAnimationsModule,
    SharedModule,
    CoreModule,
    MarkdownModule.forRoot({
      markedOptions: {
        provide: MarkedOptions,
        useValue: {
          renderer: renderer,
          gfm: true,
          breaks: false,
          sanitize: false,
        },
      },
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [AppConfigService],
      useFactory: (appConfigService: AppConfigService) => {
        return () => {
          return appConfigService.loadAppConfig();
        };
      },
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initKeycloak,
      deps: [AuthService],
      multi: true,
    },
    Title,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(iconRegistry: MatIconRegistry) {
    iconRegistry.setDefaultFontSetClass('material-symbols-outlined');
  }
}
