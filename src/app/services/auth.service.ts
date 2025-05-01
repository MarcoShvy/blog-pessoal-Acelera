import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/';
  private userLoggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());

  constructor(private http: HttpClient) {}

  login(credentials: { usuario: string; senha: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}usuarios/login`, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        this.userLoggedIn.next(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.userLoggedIn.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserLoggedInStatus(): Observable<boolean> {
    return this.userLoggedIn.asObservable();
  }

  getDecodedToken(): any {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      console.error('Erro ao decodificar o token:', e);
      return null;
    }
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}usuarios`, data);
  }
}