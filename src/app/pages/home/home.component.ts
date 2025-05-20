import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post.model';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  posts: Post[] = [];
  filteredPosts: Post[] = [];
  paginatedPosts: Post[] = [];
  
  isLoading = true;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions = [5, 10, 20];
  
  
  timeFilter: string = 'all';
  searchQuery: string = '';

  constructor(private postService: PostService, private router: Router) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.postService.getAllPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => console.error('Erro ao carregar posts:', err)
    });
  }

  applyFilters(): void {
    
    let filtered = this.posts;
    
    if (this.timeFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter(post => {
        const postDate = new Date(post.data);
        
        switch(this.timeFilter) {
          case 'today':
            return postDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date();
            weekAgo.setDate(now.getDate() - 7);
            return postDate >= weekAgo;
          case 'month':
            const monthAgo = new Date();
            monthAgo.setMonth(now.getMonth() - 1);
            return postDate >= monthAgo;
          case 'year':
            const yearAgo = new Date();
            yearAgo.setFullYear(now.getFullYear() - 1);
            return postDate >= yearAgo;
          default:
            return true;
        }
      });
    }
    
    
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(post => 
        post.titulo.toLowerCase().includes(query) ||
        (post.usuario?.nome?.toLowerCase()?.includes(query) ?? false) ||
        post.texto.toLowerCase().includes(query)
      );
    }
    
    this.filteredPosts = filtered;
    this.currentPage = 0;
    this.updatePaginatedPosts();
  }

  updatePaginatedPosts(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedPosts = this.filteredPosts.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedPosts();
  }

  navigateToPost(postId: number): void {
    this.router.navigate(['/posts', postId]);
  }
}