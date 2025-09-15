import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  constructor(private http: HttpClient) {}

  getNavigation(): Observable<any[]> {
    return this.http.get<any[]>('https://aiod.eu/wp-json/aiod/v1/navigation');
  }
}
