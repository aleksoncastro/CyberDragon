import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lote } from '../models/lote.model';  
import { PaginacaoDTO } from '../models/paginacao-dto';

@Injectable({
  providedIn: 'root'
})
export class LoteService {
  private baseUrl: string = 'http://localhost:8080/lotes';

  constructor(private httpClient: HttpClient) { }

  findAll(page?: number, pageSize?: number): Observable<Lote[]> {
      let params = new HttpParams();
      if (page !== undefined && pageSize !== undefined) {
        params = params.set('page', page.toString()).set('page_size', pageSize.toString());
      }
    
      return this.httpClient.get<Lote[]>(this.baseUrl + '/page', { params });
    }
    
    getPaginacao(page: number, pageSize: number): Observable<PaginacaoDTO> {
      let params = new HttpParams()
        .set('page', page.toString())
        .set('page_size', pageSize.toString());
    
      return this.httpClient.get<PaginacaoDTO>(this.baseUrl, { params });
    }

  findByPlacasEmLotes(idPlacaDeVideo: number): Observable<Lote[]> {
    return this.httpClient.get<Lote[]>(`${this.baseUrl}/placa/${idPlacaDeVideo}`);
  }  

  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

  findById(id: string): Observable<Lote> {
    return this.httpClient.get<Lote>(`${this.baseUrl}/${id}`);
  }

  insert(lote: Lote): Observable<Lote> {
    return this.httpClient.post<Lote>(this.baseUrl, lote);
  }

  update(lote: Lote): Observable<Lote> {
    return this.httpClient.put<Lote>(`${this.baseUrl}/${lote.id}`, lote);
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
  }
}
