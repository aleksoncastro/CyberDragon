import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioServiceFuncionario {
  private baseUrl: string = 'http://localhost:8080/usuarios/funcionarios';

  constructor(private httpClient: HttpClient) { }

  insertUsuarioFuncionario(usuario : Usuario): Observable<Usuario>{
    return this.httpClient.post<Usuario>(this.baseUrl, usuario);
  }
}
