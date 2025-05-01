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
    this.authService.getUserLoggedInStatus().subscribe(status => {
      const token = this.authService.getDecodedToken();
      console.log('Token decodificado:', token);
      this.isLoggedIn = status;
      this.nomeUsuario = token?.usuario || '';
      console.log(this.nomeUsuario)
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
