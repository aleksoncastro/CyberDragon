import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pedido } from '../models/pedido.model';
import { Observable } from 'rxjs';
import { PaginacaoDTO } from '../models/paginacao-dto';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private readonly baseUrl = 'http://localhost:8080/pedidos-adm'; // ajuste a URL conforme seu ambiente

  constructor(private http: HttpClient) {}

  findAll(): Observable<Pedido[]> {
        return this.http.get<Pedido[]>(`${this.baseUrl}/all`);
      }
  

  findById(id: number): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.baseUrl}/${id}`);
  }

  findByUsername(username: string, page: number = 0, pageSize: number = 100): Observable<Pedido[]> {
    const params = new HttpParams()
      .set('page', page)
      .set('page_size', pageSize);
    return this.http.get<Pedido[]>(`${this.baseUrl}/username/${username}`, { params });
  }

  findByItem(id: number): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.baseUrl}/search/item/${id}`);
  }

  findByStatus(idStatus: number): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.baseUrl}/search/status/${idStatus}`);
  }

  changeStatus(idPedido: number, status: { id: number }): Observable<Pedido> {
    return this.http.patch<Pedido>(`${this.baseUrl}/${idPedido}/status-pedido/${status.id}`, {});
  }

  cancelarPedido(id: number): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}`, {});
  }

  total(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/count`);
  }

  totalPorNome(nome: string): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/nome/${nome}/count`);
  }

  findPage(page: number = 0, pageSize: number = 20): Observable<any[]> {
    const params = new HttpParams()
      .set('page', page)
      .set('page_size', pageSize);
    return this.http.get<any[]>(`${this.baseUrl}/page`, { params });
  }
}
