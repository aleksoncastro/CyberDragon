import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Estado } from '../models/estado.model';
import { PageResponse } from '../interfaces/pageresponse';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {
  private baseUrl: string = 'http://localhost:8080/estados';

  constructor(private httpClient: HttpClient) { 
  }

  findAll(page?: number, pageSize?: number): Observable<PageResponse<Estado>> {
    let params: any = {};
  
    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        page_size: pageSize.toString()
      };
    }
     // console.log(this.baseUrl);
    //  console.log({params});

    return this.httpClient.get<PageResponse<Estado>>(`${this.baseUrl}`, { params });
  }
  
  count(): Observable<number>{
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

  findById(id: string): Observable<Estado> {
    return this.httpClient.get<Estado>(`${this.baseUrl}/${id}`);
  }

  insert(estado: Estado): Observable<Estado> {
    return this.httpClient.post<Estado>(this.baseUrl, estado);
  }

  update(estado: Estado): Observable<any> {
    return this.httpClient.put<Estado>(`${this.baseUrl}/${estado.id}`, estado);
  }

  delete(estado: Estado): Observable<any> {
    return this.httpClient.delete<Estado>(`${this.baseUrl}/${estado.id}`);
  }

}