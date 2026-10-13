import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Restaurant, MenuCategory, MenuItem, DashboardStats, WifiQrResponse, TableQrResponse } from '../models/restaurant.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('nfc_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    });
  }

  // --- Public NFC Portal endpoints ---
  public getPublicRestaurants(): Observable<{ success: boolean; data: Restaurant[] }> {
    return this.http.get<{ success: boolean; data: Restaurant[] }>(`${this.baseUrl}/public/restaurants`);
  }

  public getPublicRestaurant(slug: string): Observable<{ success: boolean; data: Restaurant }> {
    return this.http.get<{ success: boolean; data: Restaurant }>(`${this.baseUrl}/public/restaurants/${slug}`);
  }

  public getPublicMenu(slug: string): Observable<{ success: boolean; data: { categories: (MenuCategory & { items: MenuItem[] })[] } }> {
    return this.http.get<{ success: boolean; data: { categories: (MenuCategory & { items: MenuItem[] })[] } }>(`${this.baseUrl}/public/restaurants/${slug}/menu`);
  }

  public getPublicWifiQr(slug: string): Observable<{ success: boolean; data: WifiQrResponse }> {
    return this.http.get<{ success: boolean; data: WifiQrResponse }>(`${this.baseUrl}/public/restaurants/${slug}/wifi-qr`);
  }

  public trackInteraction(slug: string, eventType: string, tableNumber?: string, metadata?: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/public/restaurants/${slug}/track`, {
      eventType,
      tableNumber,
      metadata
    });
  }

  // --- Admin Restaurant endpoints ---
  public getMyRestaurant(): Observable<{ success: boolean; data: Restaurant }> {
    return this.http.get<{ success: boolean; data: Restaurant }>(`${this.baseUrl}/admin/restaurant`, {
      headers: this.getAuthHeaders()
    });
  }

  public updateMyRestaurant(data: Partial<Restaurant>): Observable<{ success: boolean; message: string; data: Restaurant }> {
    return this.http.put<{ success: boolean; message: string; data: Restaurant }>(`${this.baseUrl}/admin/restaurant`, data, {
      headers: this.getAuthHeaders()
    });
  }

  // --- Admin Menu endpoints ---
  public getAdminFullMenu(): Observable<{ success: boolean; data: { categories: (MenuCategory & { items: MenuItem[] })[] } }> {
    return this.http.get<{ success: boolean; data: { categories: (MenuCategory & { items: MenuItem[] })[] } }>(`${this.baseUrl}/admin/menu`, {
      headers: this.getAuthHeaders()
    });
  }

  public getAdminCategories(): Observable<{ success: boolean; data: MenuCategory[] }> {
    return this.http.get<{ success: boolean; data: MenuCategory[] }>(`${this.baseUrl}/admin/menu/categories`, {
      headers: this.getAuthHeaders()
    });
  }

  public createCategory(data: Partial<MenuCategory>): Observable<{ success: boolean; data: MenuCategory }> {
    return this.http.post<{ success: boolean; data: MenuCategory }>(`${this.baseUrl}/admin/menu/categories`, data, {
      headers: this.getAuthHeaders()
    });
  }

  public updateCategory(id: string, data: Partial<MenuCategory>): Observable<{ success: boolean; data: MenuCategory }> {
    return this.http.put<{ success: boolean; data: MenuCategory }>(`${this.baseUrl}/admin/menu/categories/${id}`, data, {
      headers: this.getAuthHeaders()
    });
  }

  public deleteCategory(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.baseUrl}/admin/menu/categories/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  public getAdminItems(): Observable<{ success: boolean; data: MenuItem[] }> {
    return this.http.get<{ success: boolean; data: MenuItem[] }>(`${this.baseUrl}/admin/menu/items`, {
      headers: this.getAuthHeaders()
    });
  }

  public createItem(data: Partial<MenuItem>): Observable<{ success: boolean; data: MenuItem }> {
    return this.http.post<{ success: boolean; data: MenuItem }>(`${this.baseUrl}/admin/menu/items`, data, {
      headers: this.getAuthHeaders()
    });
  }

  public updateItem(id: string, data: Partial<MenuItem>): Observable<{ success: boolean; data: MenuItem }> {
    return this.http.put<{ success: boolean; data: MenuItem }>(`${this.baseUrl}/admin/menu/items/${id}`, data, {
      headers: this.getAuthHeaders()
    });
  }

  public toggleItemAvailability(id: string): Observable<{ success: boolean; data: MenuItem }> {
    return this.http.patch<{ success: boolean; data: MenuItem }>(`${this.baseUrl}/admin/menu/items/${id}/toggle`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  public deleteItem(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.baseUrl}/admin/menu/items/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // --- Admin Analytics ---
  public getDashboardStats(days = 30): Observable<{ success: boolean; data: DashboardStats }> {
    return this.http.get<{ success: boolean; data: DashboardStats }>(`${this.baseUrl}/admin/analytics?days=${days}`, {
      headers: this.getAuthHeaders()
    });
  }

  // --- Admin QR & NFC Tools ---
  public getAdminWifiQr(): Observable<{ success: boolean; data: WifiQrResponse }> {
    return this.http.get<{ success: boolean; data: WifiQrResponse }>(`${this.baseUrl}/admin/qr/wifi`, {
      headers: this.getAuthHeaders()
    });
  }

  public getAdminGoogleQr(): Observable<{ success: boolean; data: { url: string; qrDataUrl: string } }> {
    return this.http.get<{ success: boolean; data: { url: string; qrDataUrl: string } }>(`${this.baseUrl}/admin/qr/google-review`, {
      headers: this.getAuthHeaders()
    });
  }

  public getAdminTableQr(tableNumber?: string): Observable<{ success: boolean; data: TableQrResponse }> {
    const query = tableNumber ? `?table=${encodeURIComponent(tableNumber)}` : '';
    return this.http.get<{ success: boolean; data: TableQrResponse }>(`${this.baseUrl}/admin/qr/table${query}`, {
      headers: this.getAuthHeaders()
    });
  }

  public getBatchTableQrs(count = 10): Observable<{ success: boolean; data: TableQrResponse[] }> {
    return this.http.get<{ success: boolean; data: TableQrResponse[] }>(`${this.baseUrl}/admin/qr/batch-tables?count=${count}`, {
      headers: this.getAuthHeaders()
    });
  }
}
