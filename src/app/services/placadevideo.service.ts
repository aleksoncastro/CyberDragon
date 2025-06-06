import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlacaDeVideo } from '../models/placadevideo.model';
import { PaginacaoDTO } from '../models/paginacao-dto';

@Injectable({
  providedIn: 'root'
})
export class PlacaDeVideoService {
  private baseUrl: string = 'http://localhost:8080/placasdevideo';

  constructor(private httpClient: HttpClient) { }

  findAll(page?: number, pageSize?: number): Observable<PlacaDeVideo[]> {
    let params = new HttpParams();
    if (page !== undefined && pageSize !== undefined) {
      params = params.set('page', page.toString()).set('page_size', pageSize.toString());
    }

    return this.httpClient.get<PlacaDeVideo[]>(this.baseUrl + '/page', { params });
  }

  getPaginacao(page: number, pageSize: number): Observable<PaginacaoDTO> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());

    return this.httpClient.get<PaginacaoDTO>(this.baseUrl, { params });
  }


  getImagemUrl(nomeImagem: string): string {
    return `${this.baseUrl}/image/download/${nomeImagem}`;
  }

  deleteImage(idPlaca: number, nomeImagem: string): Observable<any> {
    return this.httpClient.patch<PlacaDeVideo>(
      `${this.baseUrl}/image/delete/${nomeImagem}/placa/${idPlaca}`,
      null
    );
  }

  uploadImage(id: number, nomeImagem: string, imagem: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('id', id.toString());
    formData.append('nomeImagem', imagem.name);
    formData.append('imagem', imagem, imagem.name);

    return this.httpClient.patch<PlacaDeVideo>(`${this.baseUrl}/image/upload`, formData);
  }


  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

  findById(id: number): Observable<PlacaDeVideo> {
    return this.httpClient.get<PlacaDeVideo>(`${this.baseUrl}/${id}`);
  }

  insert(placadevideo: PlacaDeVideo): Observable<PlacaDeVideo> {
    return this.httpClient.post<PlacaDeVideo>(this.baseUrl, placadevideo);
  }

  update(placadevideo: PlacaDeVideo): Observable<any> {
    return this.httpClient.put<PlacaDeVideo>(`${this.baseUrl}/${placadevideo.id}`, placadevideo);
  }

  delete(placadevideo: PlacaDeVideo): Observable<any> {
    return this.httpClient.delete<PlacaDeVideo>(`${this.baseUrl}/${placadevideo.id}`);
  }

  findByUltimosLancamentos(prefixo1: string, prefixo2: string, valor1: string, valor2: string): Observable<PlacaDeVideo[]> {
    const url = `${this.baseUrl}/search/lancamentos/${prefixo1}/${prefixo2}/${valor1}/${valor2}`;
    return this.httpClient.get<PlacaDeVideo[]>(url);
  }

  findByFiltros(filtro: any, page: number = 0, pageSize: number = 20): Observable<PlacaDeVideo[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());

    return this.httpClient.post<PlacaDeVideo[]>(`${this.baseUrl}/filtro`, filtro, { params });
  }

  findByTexto(texto: string, page: number = 0, pageSize: number = 10): Observable<PlacaDeVideo[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.httpClient.get<PlacaDeVideo[]>(`${this.baseUrl}/search/texto/${texto}`, { params });
  }

  searchPlacas(
    texto: string,
    filtro: any,
    page: number = 0,
    pageSize: number = 10
  ): Observable<PlacaDeVideo[]> {
    let params = new HttpParams()
      .set('q', texto)
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    // Adiciona os campos do filtro como parâmetros
    for (const key in filtro) {
      if (filtro[key] !== null && filtro[key] !== undefined) {
        params = params.set(key, filtro[key]);
      }
    }

    return this.httpClient.get<PlacaDeVideo[]>(`${this.baseUrl}/search`, { params });
  }
}
