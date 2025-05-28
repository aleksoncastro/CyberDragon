import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TelefoneCliente } from '../models/telefone-cliente.model';

@Injectable({
  providedIn: 'root'
})
export class TelefoneClienteService {
  private baseUrl: string = 'http://localhost:8080/telefonesclientes';

  constructor(private httpClient: HttpClient) { }

  findAll(): Observable<TelefoneCliente[]> {
    return this.httpClient.get<TelefoneCliente[]>(this.baseUrl);
  }

  findById(id: number): Observable<TelefoneCliente> {
    return this.httpClient.get<TelefoneCliente>(`${this.baseUrl}/${id}`);
  }

  findByNumero(numero: string): Observable<TelefoneCliente> {
    return this.httpClient.get<TelefoneCliente>(`${this.baseUrl}/search/numero/${numero}`);
  }

  findByCliente(idCliente: number): Observable<TelefoneCliente[]> {
    return this.httpClient.get<TelefoneCliente[]>(`${this.baseUrl}/search/${idCliente}`);
  }

  insert(idCliente: number, telefone: TelefoneCliente): Observable<TelefoneCliente> {
    return this.httpClient.post<TelefoneCliente>(`${this.baseUrl}/${idCliente}`, telefone);
  }

  update(id: number, telefone: TelefoneCliente): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}/${id}`, telefone);
  }

  delete(id: number): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}/${id}`);
  }
}
