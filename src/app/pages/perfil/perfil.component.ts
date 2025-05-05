import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';
import { Post } from 'src/app/models/post.model';
import { Usuario } from 'src/app/models/usuarios.model';
import { EditarPostComponent } from 'src/app/components/posts/editar-post/editar-post.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  usuario: Usuario | null = null;
  postsUsuario: Post[] = [];

  constructor(private authService: AuthService, private postService: PostService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.usuario = this.authService.getCurrentUser();
    if (this.usuario) {
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

  abrirDialogoEdicao(post: Post): void {
    const dialogRef = this.dialog.open(EditarPostComponent, {
      width: '600px',
      data: { ...post }
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        this.atualizarPost(resultado);
      }
    });
  }

  atualizarPost(postAtualizado: Post): void {
    this.postService.updatePostagem(postAtualizado.id!, postAtualizado).subscribe({
      next: (post) => {
        
        const index = this.postsUsuario.findIndex(p => p.id === post.id);
        if (index !== -1) {
          this.postsUsuario[index] = post;
        }
      },
      error: (erro) => {
        console.error('Erro ao atualizar post:', erro);
        
      }
    });
  }
}
