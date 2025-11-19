import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

const { base, endpoints } = environment.api;

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  constructor(protected http: HttpClient) {}

  public getPerson(id?: any): Observable<any[]> {
    return this.http.get<any[]>(
      `${base}${endpoints.prefixApiAssets}${endpoints.persons}/${id}`,
    );
  }
}
