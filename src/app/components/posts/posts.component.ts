import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post.model';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
})
export class PostsComponent implements OnInit {
  posts: Post[] = [];
  postForm: FormGroup;

  constructor(private service: PostService, private fb: FormBuilder) {
    this.postForm = this.fb.group({
      titulo: [''],
      conteudo: [''],
      autor: [''],
      data: [new Date()]
    });
  }

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts() {
    this.service.getAllPosts().subscribe(res => this.posts = res);
  }

  savePost() {
    const post = this.postForm.value;
    this.service.createPost(post).subscribe(() => {
      this.loadPosts();
      this.postForm.reset();
    });
  }

  deletePost(id: number) {
    this.service.deletePost(id).subscribe(() => this.loadPosts());
  }
}