import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Municipio } from '../models/municipio.model';

@Injectable({
  providedIn: 'root'
})
export class MunicipioService {
  private baseUrl: string = 'http://localhost:8080/municipios';

  constructor(private httpClient: HttpClient) {}

  findAll(): Observable<Municipio[]> {
    return this.httpClient.get<Municipio[]>(this.baseUrl);
  }

  findById(id: string): Observable<Municipio> {
    return this.httpClient.get<Municipio>(`${this.baseUrl}/${id}`);
  }

  insert(municipio: Municipio): Observable<Municipio> {
    return this.httpClient.post<Municipio>(this.baseUrl, municipio);
  }

  update(municipio: Municipio): Observable<any> {
    return this.httpClient.put<Municipio>(`${this.baseUrl}/${municipio.id}`, municipio);
  }

  delete(municipio: Municipio): Observable<any> {
    return this.httpClient.delete<Municipio>(`${this.baseUrl}/${municipio.id}`);
  }
}

