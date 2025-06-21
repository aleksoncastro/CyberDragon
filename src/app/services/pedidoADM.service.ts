
import { Injectable } from '@angular/core';
import { Pedido } from '../models/pedido.model';
import { Observable } from 'rxjs';
import { PaginacaoDTO } from '../models/paginacao-dto';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PedidoADMService {

  private readonly baseUrl = 'http://localhost:8080/pedidos'; // ajuste a URL conforme seu ambiente

  constructor(private httpClient: HttpClient) { }

  findAll(page?: number, pageSize?: number): Observable<Pedido[]> {
    let params = new HttpParams();
    if (page !== undefined && pageSize !== undefined) {
      params = params.set('page', page.toString()).set('page_size', pageSize.toString());
    }

    return this.httpClient.get<Pedido[]>(this.baseUrl + '/page', { params });
  }

  getPaginacao(page: number, pageSize: number): Observable<PaginacaoDTO> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());

    return this.httpClient.get<PaginacaoDTO>(this.baseUrl, { params });
  }


  findById(id: number): Observable<Pedido> {
    return this.httpClient.get<Pedido>(`${this.baseUrl}/${id}`);
  }

  findByUsername(): Observable<Pedido[]> {
    return this.httpClient.get<Pedido[]>(`${this.baseUrl}`);
  }

  findByItem(id: number): Observable<Pedido[]> {
    return this.httpClient.get<Pedido[]>(`${this.baseUrl}/search/item/${id}`);
  }

  findByStatus(idStatus: number): Observable<Pedido[]> {
    return this.httpClient.get<Pedido[]>(`${this.baseUrl}/search/status/${idStatus}`);
  }

  changeStatus(idPedido: number, id: number): Observable<Pedido> {
    return this.httpClient.patch<Pedido>(`${this.baseUrl}/${idPedido}/status-pedido/${id}`, {});
  }

  cancelarPedido(id: number): Observable<void> {
    return this.httpClient.patch<void>(`${this.baseUrl}/${id}`, {});
  }

  total(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

  totalPorNome(nome: string): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/nome/${nome}/count`);
  }

  findPage(page: number = 0, pageSize: number = 20): Observable<any[]> {
    const params = new HttpParams()
      .set('page', page)
      .set('page_size', pageSize);
    return this.httpClient.get<any[]>(`${this.baseUrl}/page`, { params });
  }
}
