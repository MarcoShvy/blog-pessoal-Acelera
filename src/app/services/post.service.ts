import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Post } from '../models/post.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  
  private apiUrl = 'http://localhost:8080/api/postagens';

  constructor(private http: HttpClient) {}

  getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  getPostById(id: number): Observable<Post> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(post => ({
        id: post.id,
        titulo: post.titulo,
        texto: post.texto,
        data: new Date(post.dataCriacao),
        usuario: {
          id: 0, // valor fictício já que a API não retorna
          nome: post.nomeAutor || 'Anônimo'
        },
        tema: {
          id: 0, // valor fictício também
          descricao: post.nomeTema || 'Tema indefinido'
        }
      }))
    );
  }
  

  createPost(post: Post): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, post);
  }

  updatePost(id: number, post: Post): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/${id}`, post);
  }

  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getPostagensFiltradas(autorId?: number, intervalo?: string): Observable<Post[]> {
    let params = new HttpParams();
    if (autorId) params = params.set('autor', autorId.toString());
    if (intervalo) params = params.set('data', intervalo);
  
    return this.http.get<Post[]>(`${this.apiUrl}/filtro`, { params });
  }
  

}
