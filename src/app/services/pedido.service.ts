import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnderecoEntrega, Pedido } from '../models/pedido.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private readonly baseUrl = '/api/pedidos';

  constructor(private http: HttpClient) { }

  findByUsername(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.baseUrl}/search/username`);
  }

  findItensPedidoByIdPedido(idPedido: number): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.baseUrl}/search/itemPedido/${idPedido}`);
  }

  create(pedido: any): Observable<Pedido> {
    return this.http.post<Pedido>(this.baseUrl, pedido);
  }

 
  editEnderecoEntrega(idPedido: number, endereco: EnderecoEntrega): Observable<EnderecoEntrega> {
    return this.http.patch<EnderecoEntrega>(`${this.baseUrl}/${idPedido}`, endereco);
  }

  registrarPagamentoBoleto(idPedido: number, idBoleto: number): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${idPedido}/pagamento/${idBoleto}`, {});
  }

  registrarPagamentoPix(idPedido: number, idPix: number): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${idPedido}/pagamento/${idPix}`, {});
  }
}
