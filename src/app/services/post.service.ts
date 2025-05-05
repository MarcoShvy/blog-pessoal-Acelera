import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Post } from '../models/post.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Usuario } from '../models/usuarios.model';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  
  private apiUrl = 'https://blog-pessoal-ve28.onrender.com/api/postagens/';

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

  updatePostagem(id: number, postagem: any): Observable<any> {
    return this.http.put(`${this.apiUrl}${id}`, postagem);
  }

  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}`);
  }

  getPostagensFiltradas(autorId?: number, intervalo?: string): Observable<Post[]> {
    let params = new HttpParams();
    if (autorId) params = params.set('autor', autorId.toString());
    if (intervalo) params = params.set('data', intervalo);
  
    return this.http.get<Post[]>(`${this.apiUrl}filtro`, { params });
  }

  getPostsByUser(userId: number): Observable<Post[]> {
    console.log(userId)
    return this.http.get<Post[]>(`${this.apiUrl}filtro?autor=${userId}`);
  }

  getAuthors(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`https://blog-pessoal-ve28.onrender.com/api/usuarios`);
  }
}