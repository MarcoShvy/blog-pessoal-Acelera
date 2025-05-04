import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-criar-post-button',
  templateUrl: './criar-post-button.component.html',
  styleUrls: ['./criar-post-button.component.scss']
})
export class CriarPostButtonComponent {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  criarPost() {
    this.router.navigate(['/create']);
    }
  }
