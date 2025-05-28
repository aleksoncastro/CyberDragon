import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Endereco } from '../models/endereco.model';

@Injectable({
  providedIn: 'root'
})
export class EnderecoService {
  private baseUrl: string = 'http://localhost:8080/enderecos';

  constructor(private httpClient: HttpClient) { }

  findAll(): Observable<Endereco[]> {
    return this.httpClient.get<Endereco[]>(this.baseUrl);
  }

  findById(id: number): Observable<Endereco> {
    return this.httpClient.get<Endereco>(`${this.baseUrl}/${id}`);
  }

  findByCep(cep: string): Observable<Endereco> {
    return this.httpClient.get<Endereco>(`${this.baseUrl}/search/cep/${cep}`);
  }

  findByCliente(idCliente: number): Observable<Endereco[]> {
    return this.httpClient.get<Endereco[]>(`${this.baseUrl}/search/${idCliente}`);
  }

  insert(endereco: Endereco): Observable<Endereco> {
    return this.httpClient.post<Endereco>(this.baseUrl, endereco);
  }

  update(id: number, endereco: Endereco): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}/${id}`, endereco);
  }

  delete(id: number): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}/${id}`);
  }
}
