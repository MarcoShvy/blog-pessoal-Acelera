import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/';

  constructor(private http: HttpClient) {}

  login(credentials: { usuario: string; senha: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}usuarios/login`, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}usuarios`, data);
  }
}