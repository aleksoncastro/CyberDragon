import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Funcionario } from '../models/funcionario';


@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {
  private baseUrl: string = 'http://localhost:8080/funcionarios';

  constructor(private httpClient: HttpClient) {
  }

  findAll(page?:number, pageSize?:number): Observable<Funcionario[]> {
      let params={};
  
      if (page !== undefined && pageSize !== undefined) {
        params = {
          page: page.toString(),
          page_size: pageSize.toString()
        }
      }
  
      console.log(this.baseUrl);
      console.log({params});
  
      return this.httpClient.get<Funcionario[]>(this.baseUrl, {params});
  
    }
  
    count(): Observable<number> {
      return this.httpClient.get<number>(`${this.baseUrl}/count`);
    }

  findById(id: string): Observable<Funcionario> {
    return this.httpClient.get<Funcionario>(`${this.baseUrl}/${id}`);
  }

  insert(funcionario: Funcionario): Observable<Funcionario> {
    return this.httpClient.post<Funcionario>(this.baseUrl, funcionario);
  }

  update(funcionario: Funcionario): Observable<any> {
    return this.httpClient.put<Funcionario>(`${this.baseUrl}/${funcionario.id}`, funcionario);
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
  }

}
