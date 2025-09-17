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

export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
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
        sendAccessToken: false,
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
    Title,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(iconRegistry: MatIconRegistry) {
    iconRegistry.setDefaultFontSetClass('material-symbols-outlined');
  }
}
