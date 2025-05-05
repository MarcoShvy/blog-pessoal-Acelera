import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject, of } from 'rxjs';
import { Usuario } from '../models/usuarios.model'
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/';
  private userLoggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser = this.currentUserSubject

  constructor(private http: HttpClient) {
    this.loadInitialUser();
  }

  private loadInitialUser(): void {
    const user = localStorage.getItem('Usuario');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  setCurrentUser(user: Usuario): void {
    localStorage.setItem('Usuario', JSON.stringify(user));
    this.currentUserSubject.next(user);
    
    // Para debug - use subscribe para ver o valor atual
    this.currentUser.subscribe(current => {
      console.log('Usuário atual (dentro do subscribe):', current);
    });
  }

  login(credentials: { usuario: string; senha: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}usuarios/login`, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        this.setCurrentUser(response);
        this.userLoggedIn.next(true);
      })
    );
  }

  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  observeUser(): Observable<Usuario | null> {
    return this.currentUser;
  }

  getCurrentUserObservable(): Observable<Usuario | null> {
    return this.currentUser.asObservable();
  }

  clearUser(): void {
    localStorage.removeItem('Usuario');
    this.currentUser.next(null);
  }

  logout(): void {
    localStorage.removeItem('Usuario');
    localStorage.removeItem('token')
    this.clearUser();
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

  getUsernameFromToken(): string {
    const token = localStorage.getItem('token');
    if (!token) return '';
    
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.usuario;
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}usuarios`, data);
  }

  isAuthenticated(): Observable<boolean> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return of(false);
    }
    return of(true);
  }

}