import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { AlterarSenhaComponent } from '../components/usuario/alterar-senha/alterar-senha.component';
import { SenhaPatchRequestDTO } from '../models/senha-patch-request-dto.model';
import { UsernamePatchRequestDTO } from '../models/username-patch-request-dto.model';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private baseUrl: string = 'http://localhost:8080/usuarios/clientes';
  private imageBaseUrl: string = 'http://localhost:8080/usuarios';
  private padraoUrl: string = 'http://localhost:8080/usuarios';

  constructor(private httpClient: HttpClient) { }

  insertUsuarioCliente(usuario: Usuario): Observable<Usuario> {
    return this.httpClient.post<Usuario>(this.baseUrl, usuario);
  }

  getImagemUrl(nomeImagem: string): string {
    return `${this.imageBaseUrl}/image/download/${nomeImagem}`;
  }

  deleteImage(idUsuario: number, nomeImagem: string): Observable<any> {
    return this.httpClient.patch<Usuario>(
      `${this.imageBaseUrl}/image/delete/${nomeImagem}/usuario/${idUsuario}`,
      null
    );
  }

  findByMe(): Observable<Usuario> {
      return this.httpClient.get<Usuario>(`${this.padraoUrl}/me`);
    }

  uploadImage(id: number, nomeImagem: string, imagem: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('id', id.toString());
    formData.append('nomeImagem', imagem.name);
    formData.append('imagem', imagem, imagem.name);

    return this.httpClient.patch<Usuario>(`${this.imageBaseUrl}/image/upload`, formData);
  }

  updateSenha(dto: SenhaPatchRequestDTO): Observable<any> {
    return this.httpClient.patch(`${this.padraoUrl}/update/senha`, dto);
  }

  updateUsername(dto: UsernamePatchRequestDTO): Observable<any> {
    return this.httpClient.patch(`${this.padraoUrl}/update/username`, dto);
  }

  
  



}
