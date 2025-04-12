import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Municipio } from '../models/municipio.model';

@Injectable({
  providedIn: 'root'
})
export class MunicipioService {
  private baseUrl: string = 'http://localhost:8080/municipios';

  constructor(private httpClient: HttpClient) { }

  findAll(page?: number, pageSize?: number): Observable<Municipio[]> {
    let params = new HttpParams();

    if (page !== undefined && pageSize !== undefined) {
      params = params.set('page', page.toString())
        .set('page_size', pageSize.toString());
    }

    return this.httpClient.get<Municipio[]>(this.baseUrl, { params });
  }

  findById(id: string): Observable<Municipio> {
    return this.httpClient.get<Municipio>(`${this.baseUrl}/${id}`);
  }

  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

  insert(municipio: Municipio): Observable<Municipio> {
    const data = {
      nome: municipio.nome,
      idEstado: municipio.estado.id
    };
    return this.httpClient.post<Municipio>(this.baseUrl, data);
  }

  update(municipio: Municipio): Observable<Municipio> {
    const data = {
      nome: municipio.nome,
      idEstado: municipio.estado.id
    };
    return this.httpClient.put<Municipio>(`${this.baseUrl}/${municipio.id}`, data);
  }

  delete(municipio: Municipio): Observable<any> {
    return this.httpClient.delete<Municipio>(`${this.baseUrl}/${municipio.id}`);
  }
}
