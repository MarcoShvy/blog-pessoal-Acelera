import { Component, OnInit } from '@angular/core';
import { PostService } from '../../../services/post.service';
import { AuthService } from '../../../services/auth.service';
import { TemaService } from '../../../services/tema.service';
import { Router } from '@angular/router';
import { Post } from '../../../models/post.model';
import { Tema } from '../../../models/tema.model'

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {
  post: Partial<Post> = {
    titulo: '',
    texto: '',
    tema: undefined
  };
  temas: Tema[] = [];
  isLoading = false;

  constructor(
    private postService: PostService,
    private authService: AuthService,
    private temaService: TemaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarTemas();
  }

  carregarTemas(): void {
    this.temaService.getAll().subscribe({
      next: (temas) => this.temas = temas,
      error: (err) => console.error('Erro ao carregar temas', err)
    });
  }

  onSubmit(): void {
    this.isLoading = true;
    const usuario = this.authService.getCurrentUser();

    const postData = {
      titulo: this.post.titulo,
      texto: this.post.texto,
      usuarioId: usuario?.id,
      temaId: this.post.tema?.id
    };

  
    this.postService.createPost(postData).subscribe({
      next: (newPost) => {
        this.router.navigate(['/posts', newPost.id]);
      },
      error: (err) => {
        console.error('Erro ao criar post:', err);
        this.isLoading = false;
      }
    });
  }
}