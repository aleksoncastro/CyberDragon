import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlacaDeVideo } from '../models/placadevideo.model';

@Injectable({
  providedIn: 'root'
})
export class PlacaDeVideoService {
  private baseUrl: string = 'http://localhost:8080/placasdevideo';

  constructor(private httpClient: HttpClient) { 
  }

  findAll(page?:number, pageSize?:number): Observable<PlacaDeVideo[]> {
    let params={};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        page_size: pageSize.toString()
      }
    }

    console.log(this.baseUrl);
    console.log({params});

    return this.httpClient.get<PlacaDeVideo[]>(this.baseUrl, {params});

  }

  getImagemUrl(nome: string): string {
    const url = `http://localhost:8080/placasdevideo/imagens/placasdevideo/${nome}`;
    console.log("Gerando URL da imagem:", url);
    return url;

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

}