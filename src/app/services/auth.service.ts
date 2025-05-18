import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private baseURL: string = 'http://localhost:8080/auth';
  private tokenKey = 'jwt_token';
  private usuarioLogadoKey = 'usuario_logado';
  private usuarioLogadoSubject = new BehaviorSubject<Usuario | null>(null);

  constructor(private http: HttpClient, 
              private localStorageService: LocalStorageService, 
              private jwtHelper: JwtHelperService) {

    this.initUsuarioLogado();

  }

  private initUsuarioLogado() {
  const usuario = this.localStorageService.getItem(this.usuarioLogadoKey);
  if (usuario) {
    // usuario já é um objeto, não precisa parsear de novo
    this.setUsuarioLogado(usuario);
    this.usuarioLogadoSubject.next(usuario);
  }
}

  loginADM(username: string, senha: string): Observable<any> {
  const params = { username, senha };

  return this.http.post(`${this.baseURL}/admin`, params, { observe: 'response' }).pipe(
    tap((res: any) => {
      console.log("Headers:", res.headers);
      console.log("Body:", res.body);

      const authToken = res.headers.get('Authorization') ?? '';
      if (authToken) {
        this.setToken(authToken);
        const usuarioLogado = res.body;
        if (usuarioLogado) {
          this.setUsuarioLogado(usuarioLogado);
          this.usuarioLogadoSubject.next(usuarioLogado);
        }
      }
    })
  );
}

loginCliente(username: string, senha: string): Observable<any> {
  const params = { username, senha };

  return this.http.post(`${this.baseURL}/cliente`, params, { observe: 'response' }).pipe(
    tap((res: any) => {
      console.log("Headers (cliente):", res.headers);
      console.log("Body (cliente):", res.body);

      const authToken = res.headers.get('Authorization') ?? '';
      if (authToken) {
        this.setToken(authToken);
        const usuarioLogado = res.body;
        if (usuarioLogado) {
          this.setUsuarioLogado(usuarioLogado);
          this.usuarioLogadoSubject.next(usuarioLogado);
        }
      }
    })
  );
}

  setUsuarioLogado(usuario: Usuario): void {
    this.localStorageService.setItem(this.usuarioLogadoKey, usuario);
  }

  setToken(token: string): void {
    this.localStorageService.setItem(this.tokenKey, token);
  }

  getUsuarioLogado() {
    return this.usuarioLogadoSubject.asObservable();
  }

  getToken(): string | null {
    return this.localStorageService.getItem(this.tokenKey);
  }

  removeToken(): void {
    this.localStorageService.removeItem(this.tokenKey);
  }

  removeUsuarioLogado(): void {
    this.localStorageService.removeItem(this.usuarioLogadoKey);
    this.usuarioLogadoSubject.next(null);
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) {
      return true;
    }

    try {
      return this.jwtHelper.isTokenExpired(token);
    } catch (error) {
      console.error("Token inválido", error);
      return true;
    }

  }

}