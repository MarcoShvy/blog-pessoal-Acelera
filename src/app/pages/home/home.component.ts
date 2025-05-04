import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { Post } from 'src/app/models/post.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  posts: Post[] = [];
  filteredPosts: Post[] = [];
  searchTerm: string = '';

  constructor(private postService: PostService) { }

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.postService.getAllPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
        this.filteredPosts = [...posts];
      },
      error: (err) => console.error('Error loading posts', err)
    });
  }

  deletePost(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta postagem?')) {
      this.postService.deletePost(id).subscribe({
        next: () => {
          this.posts = this.posts.filter(post => post.id !== id);
          this.filteredPosts = this.filteredPosts.filter(post => post.id !== id);
        },
        error: (err) => console.error('Error deleting post', err)
      });
    }
  }

  filterPosts(): void {
    if (!this.searchTerm) {
      this.filteredPosts = [...this.posts];
      return;
    }
    
    this.filteredPosts = this.posts.filter(post => 
      post.titulo.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      post.autor.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      post.conteudo.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
