import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { Post } from 'src/app/models/post.model';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  totalPosts: number = 0;
  latestPosts: Post[] = [];
  postsByAuthor: { [key: string]: number } = {};
  chart: any;

  constructor(private postService: PostService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.postService.getAllPosts().subscribe(posts => {
      this.totalPosts = posts.length;
      this.latestPosts = this.getLatestPosts(posts, 5);
      this.postsByAuthor = this.groupPostsByAuthor(posts);
      this.createChart();
    });
  }

  getLatestPosts(posts: Post[], count: number): Post[] {
    return [...posts]
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
      .slice(0, count);
  }

  groupPostsByAuthor(posts: Post[]): { [key: string]: number } {
    return posts.reduce((acc: { [key: string]: number }, post) => {
      acc[post.usuario.nome] = (acc[post.usuario.nome] || 0) + 1;
      return acc;
    }, {});
  }

  createChart(): void {
    const ctx = document.getElementById('postsChart') as HTMLCanvasElement;
    
    if (this.chart) {
      this.chart.destroy();
    }

    const authors = Object.keys(this.postsByAuthor);
    const counts = authors.map(author => this.postsByAuthor[author]);

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: authors,
        datasets: [{
          label: 'Postagens por Autor',
          data: counts,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });
  }
}