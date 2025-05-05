import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit{
  isLoggedIn = false;
  nomeUsuario: string = '';

  constructor(private authService: AuthService) {}

  

  ngOnInit(): void {
    const usuarioStr = localStorage.getItem('Usuario');

    this.authService.getUserLoggedInStatus().subscribe(status => {
      this.isLoggedIn = status;
      const usuarioStr = localStorage.getItem('Usuario');
    if (usuarioStr) {
      try {
        const usuarioObj = JSON.parse(usuarioStr);
        this.nomeUsuario = usuarioObj.usuario || 'Usuário';
      } catch (error) {
        console.error('Erro ao fazer parse do usuário:', error);
      }
    }
      
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
