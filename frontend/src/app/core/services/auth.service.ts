import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { User, Restaurant } from '../models/restaurant.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private baseUrl = `${environment.apiUrl}/auth`;

  public currentUser = signal<User | null>(null);
  public currentRestaurant = signal<Restaurant | null>(null);
  public isAuthenticated = signal<boolean>(false);

  constructor() {
    this.checkSession();
  }

  public checkSession() {
    const token = localStorage.getItem('nfc_token');
    const storedUser = localStorage.getItem('nfc_user');
    const storedRest = localStorage.getItem('nfc_restaurant');

    if (token && storedUser) {
      try {
        this.currentUser.set(JSON.parse(storedUser));
        if (storedRest) this.currentRestaurant.set(JSON.parse(storedRest));
        this.isAuthenticated.set(true);

        // Refresh in background
        this.http.get<{ success: boolean; user: User; restaurant: Restaurant }>(`${this.baseUrl}/me`, {
          headers: { Authorization: `Bearer ${token}` }
        }).subscribe({
          next: (res) => {
            if (res.success) {
              this.currentUser.set(res.user);
              this.currentRestaurant.set(res.restaurant);
              localStorage.setItem('nfc_user', JSON.stringify(res.user));
              if (res.restaurant) localStorage.setItem('nfc_restaurant', JSON.stringify(res.restaurant));
            }
          },
          error: () => {
            // Token expired
            this.logout();
          }
        });
      } catch (e) {
        this.logout();
      }
    }
  }

  public login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, credentials).pipe(
      tap((res) => {
        if (res.success && res.token) {
          localStorage.setItem('nfc_token', res.token);
          localStorage.setItem('nfc_user', JSON.stringify(res.user));
          if (res.restaurant) {
            localStorage.setItem('nfc_restaurant', JSON.stringify(res.restaurant));
            this.currentRestaurant.set(res.restaurant);
          }
          this.currentUser.set(res.user);
          this.isAuthenticated.set(true);
        }
      })
    );
  }

  public register(data: {
    userName: string;
    email: string;
    password: string;
    restaurantName: string;
    restaurantSlug: string;
  }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register`, data).pipe(
      tap((res) => {
        if (res.success && res.token) {
          localStorage.setItem('nfc_token', res.token);
          localStorage.setItem('nfc_user', JSON.stringify(res.user));
          if (res.restaurant) {
            localStorage.setItem('nfc_restaurant', JSON.stringify(res.restaurant));
            this.currentRestaurant.set(res.restaurant);
          }
          this.currentUser.set(res.user);
          this.isAuthenticated.set(true);
        }
      })
    );
  }

  public logout() {
    localStorage.removeItem('nfc_token');
    localStorage.removeItem('nfc_user');
    localStorage.removeItem('nfc_restaurant');
    this.currentUser.set(null);
    this.currentRestaurant.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }
}
