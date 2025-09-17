import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private localNavigation = [
    {
      id: 292,
      title: 'Resources',
      url: 'https://mylibrary.aiod.eu',
      parent: 0,
    },
    { title: 'AI Catalogue', url: 'https://mylibrary.aiod.eu', parent: 292 },
    {
      title: 'Communication Materials',
      url: 'https://aiod.eu/ai-on-demand-communication-and-dissemination-materials/',
      parent: 292,
    },
    {
      title: 'SDKs and APIs',
      url: 'https://aiod.eu/metadata-catalogue-rest-api/',
      parent: 292,
    },

    {
      id: 282,
      title: 'Tools',
      url: 'https://aiod.eu/tools/',
      parent: 0,
      extraButton: { url: 'https://aiod.eu/tools', text: 'Technical support' },
    },
    { title: 'All Tools', url: 'https://aiod.eu/tools', parent: 282 },
    { title: 'RAIL', url: 'https://rail.aiod.eu', parent: 282 },
    { title: 'RoboCompass', url: 'https://robocompass.aiod.eu/', parent: 282 },
    {
      title: 'AI Builder',
      url: 'https://aiexp.ai4europe.eu/#/home',
      parent: 282,
      highlight: true,
    },

    {
      id: 293,
      title: 'Community',
      url: 'https://aiod.eu/media-hub',
      parent: 0,
    },
    { title: 'Media Hub', url: 'https://aiod.eu/media-hub', parent: 293 },
    { title: 'Forums', url: 'https://aiod.eu/forums/', parent: 293 },
    {
      title: 'Pool of Experts',
      url: 'https://aiod.eu/ai-experts/',
      parent: 293,
    },
    {
      title: 'Success Stories',
      url: 'https://aiod.eu/success-stories/',
      parent: 293,
    },
    { title: 'EU Projects', url: 'https://aiod.eu/project/', parent: 293 },
    { title: 'EU Organisations', url: 'https://aiod.eu', parent: 293 },
  ];

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  getNavigation(): Observable<any[]> {
    // Local fallback for development
    if (
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'
    ) {
      return of(this.localNavigation);
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
    });
    return this.http.get<any[]>('https://aiod.eu/wp-json/aiod/v1/navigation', {
      headers,
    });
  }
}
