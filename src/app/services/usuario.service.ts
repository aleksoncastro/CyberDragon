import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private baseUrl: string = 'http://localhost:8080/usuarios/clientes';
  private imageBaseUrl: string = 'http://localhost:8080/usuarios';

  constructor(private httpClient: HttpClient) { }

  insertUsuarioCliente(usuario : Usuario): Observable<Usuario>{
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
  
    uploadImage(id: number, nomeImagem: string, imagem: File): Observable<any> {
      const formData: FormData = new FormData();
      formData.append('id', id.toString());
      formData.append('nomeImagem', imagem.name);
      formData.append('imagem', imagem, imagem.name);
      
      return this.httpClient.patch<Usuario>(`${this.imageBaseUrl}/image/upload`, formData);
    }
}
