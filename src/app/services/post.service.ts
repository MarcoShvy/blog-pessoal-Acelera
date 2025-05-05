import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Post } from '../models/post.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  
  private apiUrl = 'http://localhost:8080/api/postagens/';

  token = localStorage.getItem('token')
  headers = new HttpHeaders({
    'Authorization': `Bearer ${this.token}`
  });

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  getPostById(id: number): Observable<Post> {
    return this.http.get<any>(`${this.apiUrl}${id}`).pipe(
      map(post => ({
        id: post.id,
        titulo: post.titulo,
        texto: post.texto,
        data: new Date(post.dataCriacao),
        usuario: {
          id: 0,
          nome: post.nomeAutor || 'Anônimo'
        },
        tema: {
          id: 0,
          descricao: post.nomeTema || 'Tema indefinido'
        }
      }))
    );
  }
  

  createPost(postData: any): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, postData, {
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}`,
      }
    });
  }

  updatePost(id: number, post: Post): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}${id}`, post);
  }

  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}`);
  }

  getPostagensFiltradas(autorId?: number, intervalo?: string): Observable<Post[]> {
    let params = new HttpParams();
    if (autorId) params = params.set('autor', autorId.toString());
    if (intervalo) params = params.set('data', intervalo);
  
    return this.http.get<Post[]>(`${this.apiUrl}/filtro`, { params });
  }

  getPostsByUser(userId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}filtro?autor${userId}`);
  }

}