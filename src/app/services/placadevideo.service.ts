import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlacaDeVideo } from '../models/placadevideo.model';
import { PaginacaoDTO } from '../models/paginacao-dto';

@Injectable({
  providedIn: 'root'
})
export class PlacaDeVideoService {
  private baseUrl: string = 'http://localhost:8080/placasdevideo';

  constructor(private httpClient: HttpClient) { }

  findAll(page?: number, pageSize?: number): Observable<PlacaDeVideo[]> {
    let params = new HttpParams();
    if (page !== undefined && pageSize !== undefined) {
      params = params.set('page', page.toString()).set('page_size', pageSize.toString());
    }
  
    return this.httpClient.get<PlacaDeVideo[]>(this.baseUrl + '/page', { params });
  }
  
  getPaginacao(page: number, pageSize: number): Observable<PaginacaoDTO> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());
  
    return this.httpClient.get<PaginacaoDTO>(this.baseUrl, { params });
  }
  

  getImagemUrl(nome: string): string {
    if (nome.startsWith('http')) return nome;
    return `http://localhost:8080${nome.startsWith('/') ? '' : '/'}${nome}`;
  }

  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

  findById(id: number): Observable<PlacaDeVideo> {
    return this.httpClient.get<PlacaDeVideo>(`${this.baseUrl}/${id}`);
  }

  insert(placadevideo: PlacaDeVideo): Observable<PlacaDeVideo> {
    return this.httpClient.post<PlacaDeVideo>(this.baseUrl, placadevideo);
  }

  update(placadevideo: PlacaDeVideo): Observable<any> {
    return this.httpClient.put<PlacaDeVideo>(`${this.baseUrl}/${placadevideo.id}`, placadevideo);
  }

  delete(placadevideo: PlacaDeVideo): Observable<any> {
    return this.httpClient.delete<PlacaDeVideo>(`${this.baseUrl}/${placadevideo.id}`);
  }

  findByUltimosLancamentos(prefixo1: string, prefixo2: string, valor1: string, valor2: string): Observable<PlacaDeVideo[]> {
    const url = `${this.baseUrl}/search/lancamentos/${prefixo1}/${prefixo2}/${valor1}/${valor2}`;
    return this.httpClient.get<PlacaDeVideo[]>(url);
  }
}
