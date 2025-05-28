import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cartao } from '../models/cartao.model';

@Injectable({
  providedIn: 'root'
})
export class CartaoService {
  private baseUrl: string = 'http://localhost:8080/cartoes';

  constructor(private httpClient: HttpClient) { }

  findAll(): Observable<Cartao[]> {
    return this.httpClient.get<Cartao[]>(this.baseUrl);
  }

  findById(id: number): Observable<Cartao> {
    return this.httpClient.get<Cartao>(`${this.baseUrl}/${id}`);
  }

  findByTitular(titular: string): Observable<Cartao[]> {
    return this.httpClient.get<Cartao[]>(`${this.baseUrl}/search/${titular}`);
  }

  insert(cartao: Cartao): Observable<Cartao> {
    return this.httpClient.post<Cartao>(this.baseUrl, cartao);
  }

  update(id: number, cartao: Cartao): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}/${id}`, cartao);
  }

  delete(id: number): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}/${id}`);
  }
}
