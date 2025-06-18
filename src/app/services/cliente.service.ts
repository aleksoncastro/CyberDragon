import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente.model';
import { Endereco } from '../models/endereco.model';
import { TelefoneCliente } from '../models/telefone-cliente.model';
import { Cartao } from '../models/cartao.model';
import { PageResponse } from '../interfaces/pageresponse';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private baseUrl = 'http://localhost:8080/clientes';

  constructor(private httpClient: HttpClient) { }

  findAll(page?: number, pageSize?: number): Observable<PageResponse<Cliente>> {
    let params: any = {};
    if (page !== undefined && pageSize !== undefined) {
      params = { page: page.toString(), page_size: pageSize.toString() };
    }
    return this.httpClient.get<PageResponse<Cliente>>(this.baseUrl, { params });
  }

  findById(id: string): Observable<Cliente> {
    return this.httpClient.get<Cliente>(`${this.baseUrl}/${id}`);
  }

  findByMe(): Observable<Cliente> {
    return this.httpClient.get<Cliente>(`${this.baseUrl}/me`);
  }

  findByIdUsuario( id: number): Observable<Cliente> {
    return this.httpClient.get<Cliente>(`${this.baseUrl}/usuario/${id}`);
  }

  insert(cliente: Cliente): Observable<Cliente> {
    return this.httpClient.post<Cliente>(this.baseUrl, cliente);
  }

  update(clienteId: number, enderecoId: number, telefoneId: number, cliente: Cliente): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}/${clienteId}/endereco/${enderecoId}/telefone/${telefoneId}`, cliente);
  }

  delete(id: number): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}/${id}`);
  }

  addEndereco(clienteId: number, endereco: Endereco): Observable<Endereco> {
    return this.httpClient.post<Endereco>(`${this.baseUrl}/${clienteId}/enderecos`, endereco);
  }

  addTelefone(clienteId: number, telefone: TelefoneCliente): Observable<TelefoneCliente> {
    return this.httpClient.post<TelefoneCliente>(`${this.baseUrl}/${clienteId}/telefones`, telefone);
  }

  addCartao(clienteId: number, cartao: Cartao): Observable<Cartao> {
    return this.httpClient.post<Cartao>(`${this.baseUrl}/${clienteId}/cartoes`, cartao);
  }

  getListaDesejos(username: string): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/desejos?username=${username}`);
  }

  adicionarProdutoListaDesejo(username: string, idProduto: number): Observable<any> {
    return this.httpClient.patch<any>(`${this.baseUrl}/desejos/adicionar/${username}/${idProduto}`, {});
  }

  removerProdutoListaDesejo(username: string, idProduto: number): Observable<any> {
    return this.httpClient.patch<any>(`${this.baseUrl}/desejos/remover/${username}/${idProduto}`, {});
  }
}
