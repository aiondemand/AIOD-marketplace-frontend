import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NAVIGATION_URL } from '../../../shared/constants/external-links';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  constructor(private http: HttpClient) {}

  getNavigation(): Observable<any[]> {
    return this.http.get<any[]>(NAVIGATION_URL);
  }
}
