import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private localNavigation = [
    {
      id: 292,
      title: 'Resources',
      url: 'https://mylibrary.aiod.eu',
      parent: 0,
    },
    {
      title: 'AI Catalogue',
      url: 'https://mylibrary.aiod.eu',
      description:
        'A tool for searching, selecting and bookmarking assets and educational resources to be used with other services.',
      parent: 292,
    },
    {
      title: 'Communication Materials',
      description:
        'These materials are designed to support all stakeholders in promoting and communicating the AIoD brand effectively.',
      url: 'https://aiod.eu/ai-on-demand-communication-and-dissemination-materials/',
      parent: 292,
    },
    {
      title: 'SDKs and APIs',
      description:
        'Here you can find the REST API documentation of the AIoD Metadata Catalogue.',
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
    {
      title: 'All Tools',
      url: 'https://aiod.eu/tools',
      description:
        'Discover powerful tools to build, test, and share AI solutions.',
      parent: 282,
    },
    {
      title: 'RAIL',
      url: 'https://rail.aiod.eu',
      description:
        'RAIL is a tool that allows AI practitioners to explore and use AI assets directly in the AI-on-Demand platform.',
      parent: 282,
    },
    {
      title: 'RoboCompass',
      url: 'https://robocompass.aiod.eu/',
      description:
        'An innovative tool designed to assess the non-technological aspects of responsible robotics.',
      parent: 282,
    },
    {
      title: 'AI Builder',
      url: 'https://aiexp.ai4europe.eu/#/home',
      parent: 282,
      description:
        'An open source platform for the development, training, sharing and deployment of AI models.',
      highlight: true,
    },

    {
      id: 293,
      title: 'Community',
      url: 'https://aiod.eu/media-hub',
      parent: 0,
    },
    {
      title: 'Media Hub',
      url: 'https://aiod.eu/media-hub',
      description:
        'Stay up-to-date with the latest news, events, and press releases on AI research and innovation across Europe.',
      parent: 293,
    },
    {
      title: 'Forums',
      url: 'https://aiod.eu/forums/',
      description:
        'Join discussions, ask questions, and share insights with the community on AI-related topics.',
      parent: 293,
    },
    {
      title: 'Pool of Experts',
      url: 'https://aiod.eu/ai-experts/',
      description:
        'Discover a network of AI experts, researchers, and industry professionals available for collaboration and advice.',
      parent: 293,
    },
    {
      title: 'Success Stories',
      url: 'https://aiod.eu/success-stories/',
      description:
        'Discover how artificial intelligence is transforming businesses and research areas.',
      parent: 293,
    },
    {
      title: 'EU Projects',
      url: 'https://aiod.eu/project/',
      description:
        'Browse European Union-funded AI projects, their objectives, outcomes, and opportunities for involvement.',
      parent: 293,
    },
    {
      title: 'EU Organisations',
      url: 'https://aiod.eu',
      description:
        'Find information about key EU organisations, research centers, and institutions working on AI initiatives.',
      parent: 293,
    },
  ];

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  getNavigation(): Observable<any[]> {
    if (!environment.production) {
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
