import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';
import { Post } from 'src/app/models/post.model';
import { Usuario } from 'src/app/models/usuarios.model';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  usuario: Usuario | null = null;
  postsUsuario: Post[] = [];

  constructor(private authService: AuthService, private postService: PostService) {}

  ngOnInit(): void {
    this.usuario = this.authService.getCurrentUser();
    if (this.usuario && this.usuario.id) {
      this.postService.getPostsByUser(this.usuario.id).subscribe(posts => {
        this.postsUsuario = posts;
      });
    }
  }

  editarPost(id: number) {
    console.log('Editar', id);
    // Ex: this.router.navigate(['/editar', id]);
  }

  excluirPost(id: number) {
    this.postService.deletePost(id).subscribe(() => {
      this.postsUsuario = this.postsUsuario.filter(p => p.id !== id);
    });
  }
}
