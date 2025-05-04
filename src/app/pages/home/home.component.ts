import { Component } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post.model';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  posts: Post[] = [];
  filteredPosts: Post[] = [];
  pageSize = 5;
  currentPage = 0;
  paginatedPosts: Post[] = [];
  
  // Filtros
  timeFilter: string = 'all';
  searchQuery: string = '';

  constructor(private postService: PostService, private router: Router) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.postService.getAllPosts().subscribe(posts => {
      this.posts = posts;
      this.filteredPosts = [...posts];
    });
  }

  applyFilters(): void {
    this.filteredPosts = this.posts.filter(post => {
      // Filtro de tempo
      const postDate = new Date(post.data);
      const now = new Date();
      
      if (this.timeFilter === 'today') {
        return postDate.toDateString() === now.toDateString();
      } else if (this.timeFilter === 'week') {
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        return postDate >= weekAgo;
      } else if (this.timeFilter === 'month') {
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
        return postDate >= monthAgo;
      } else if (this.timeFilter === 'year') {
        const yearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
        return postDate >= yearAgo;
      }
      
      return true;
    }).filter(post => {
      if (!this.searchQuery) return true;
      return (
        post.titulo.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        post.usuario.nome.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        post.texto.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    });

    this.currentPage = 0;
    this.updatePaginatedPosts();
  }

  navigateToPost(postId: number): void {
    this.router.navigate(['/posts', postId]);
  }


updatePaginatedPosts(): void {
  const start = this.currentPage * this.pageSize;
  this.paginatedPosts = this.filteredPosts.slice(start, start + this.pageSize);
}

onPageChange(event: PageEvent): void {
  this.currentPage = event.pageIndex;
  this.pageSize = event.pageSize;
  this.updatePaginatedPosts();
}

}