import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { Restaurant, MenuCategory, MenuItem, DashboardStats, WifiQrResponse, TableQrResponse } from '../../core/models/restaurant.model';
import { SafeUrlPipe } from '../../shared/pipes/safe-url.pipe';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SafeUrlPipe],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  public auth = inject(AuthService);
  private api = inject(ApiService);
  private router = inject(Router);

  // Active navigation tab
  public activeTab = signal<'overview' | 'menu' | 'venue' | 'nfc-stands' | 'preview'>('overview');

  public restaurant = signal<Restaurant | null>(null);
  public stats = signal<DashboardStats | null>(null);
  public categories = signal<(MenuCategory & { items: MenuItem[] })[]>([]);
  public wifiQr = signal<WifiQrResponse | null>(null);
  public googleQr = signal<{ url: string; qrDataUrl: string } | null>(null);
  public tableStandQr = signal<TableQrResponse | null>(null);
  public batchStands = signal<TableQrResponse[]>([]);

  public isLoading = signal<boolean>(true);
  public toastMessage = signal<string | null>(null);

  // Venue Form
  public venueForm = {
    name: '',
    slug: '',
    tagline: '',
    logoUrl: '',
    coverUrl: '',
    primaryColor: '#e11d48',
    accentColor: '#f59e0b',
    wifiSsid: '',
    wifiPassword: '',
    wifiEncryption: 'WPA',
    googleReviewUrl: '',
    instagramHandle: '',
    whatsappNumber: '',
    address: '',
    phone: '',
  };

  // Menu Management State
  public selectedCategoryForFilter = signal<string>('all');
  public showItemModal = signal<boolean>(false);
  public showCategoryModal = signal<boolean>(false);
  public editingItem = signal<MenuItem | null>(null);
  public editingCategory = signal<MenuCategory | null>(null);

  // Form Models
  public itemForm = {
    name: '',
    nameEn: '',
    categoryId: '',
    price: 0,
    description: '',
    descriptionEn: '',
    imageUrl: '',
    isChefSpecial: false,
    isPopular: false,
    isNew: false,
    dietaryTags: '',
    allergens: '',
    calories: 0,
    preparationTime: 15,
  };

  public categoryForm = {
    name: '',
    nameEn: '',
    description: '',
    icon: '🍽️',
    sortOrder: 0,
  };

  // Stand generator controls
  public selectedTableNumber = signal<string>('Masa 1');
  public batchCount = signal<number>(10);

  ngOnInit(): void {
    this.loadAllData();
  }

  public loadAllData(): void {
    this.isLoading.set(true);

    // 1. Load Restaurant Details
    this.api.getMyRestaurant().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.restaurant.set(res.data);
          this.venueForm = {
            name: res.data.name || '',
            slug: res.data.slug || '',
            tagline: res.data.tagline || '',
            logoUrl: res.data.logoUrl || '',
            coverUrl: res.data.coverUrl || '',
            primaryColor: res.data.primaryColor || '#e11d48',
            accentColor: res.data.accentColor || '#f59e0b',
            wifiSsid: res.data.wifiSsid || '',
            wifiPassword: res.data.wifiPassword || '',
            wifiEncryption: res.data.wifiEncryption || 'WPA',
            googleReviewUrl: res.data.googleReviewUrl || '',
            instagramHandle: res.data.instagramHandle || '',
            whatsappNumber: res.data.whatsappNumber || '',
            address: res.data.address || '',
            phone: res.data.phone || '',
          };
          this.loadStats();
          this.loadMenu();
          this.loadWifiQr();
          this.loadGoogleQr();
          this.loadTableStandQr();
        }
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  public loadStats(): void {
    this.api.getDashboardStats(30).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.stats.set(res.data);
        }
        this.isLoading.set(false);
      }
    });
  }

  public loadMenu(): void {
    this.api.getAdminFullMenu().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.categories.set(res.data.categories || []);
        }
      }
    });
  }

  public loadWifiQr(): void {
    this.api.getAdminWifiQr().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.wifiQr.set(res.data);
        }
      }
    });
  }

  public loadGoogleQr(): void {
    this.api.getAdminGoogleQr().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.googleQr.set(res.data);
        }
      }
    });
  }

  public loadTableStandQr(): void {
    this.api.getAdminTableQr(this.selectedTableNumber()).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.tableStandQr.set(res.data);
        }
      }
    });
  }

  public onTableNumberChange(): void {
    this.loadTableStandQr();
  }

  public generateBatchStands(): void {
    this.api.getBatchTableQrs(this.batchCount()).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.batchStands.set(res.data);
          this.showToast(`${this.batchCount()} adet masa kartı hazırlandı!`);
        }
      }
    });
  }

  public printStands(): void {
    window.print();
  }

  // --- Venue Profile Updates ---
  public saveVenueSettings(): void {
    this.api.updateMyRestaurant(this.venueForm).subscribe({
      next: (res) => {
        if (res.success) {
          this.restaurant.set(res.data);
          this.loadWifiQr();
          this.showToast('Mekan ve NFC ayarları başarıyla kaydedildi!');
        }
      },
      error: (err) => {
        this.showToast(err.error?.message || 'Kaydedilirken hata oluştu.');
      }
    });
  }

  // --- Category Actions ---
  public openAddCategory(): void {
    this.editingCategory.set(null);
    this.categoryForm = {
      name: '',
      nameEn: '',
      description: '',
      icon: '🍽️',
      sortOrder: (this.categories().length + 1) * 10,
    };
    this.showCategoryModal.set(true);
  }

  public openEditCategory(cat: MenuCategory): void {
    this.editingCategory.set(cat);
    this.categoryForm = {
      name: cat.name,
      nameEn: cat.nameEn || '',
      description: cat.description || '',
      icon: cat.icon || '🍽️',
      sortOrder: cat.sortOrder,
    };
    this.showCategoryModal.set(true);
  }

  public saveCategory(): void {
    if (!this.categoryForm.name) {
      this.showToast('Lütfen kategori adını girin.');
      return;
    }

    const editCat = this.editingCategory();
    if (editCat) {
      this.api.updateCategory(editCat.id, this.categoryForm).subscribe({
        next: () => {
          this.showCategoryModal.set(false);
          this.loadMenu();
          this.showToast('Kategori güncellendi.');
        }
      });
    } else {
      this.api.createCategory(this.categoryForm).subscribe({
        next: () => {
          this.showCategoryModal.set(false);
          this.loadMenu();
          this.showToast('Yeni kategori eklendi.');
        }
      });
    }
  }

  public deleteCategory(catId: string): void {
    if (confirm('Bu kategoriyi ve içindeki ürünleri silmek istediğinizden emin misiniz?')) {
      this.api.deleteCategory(catId).subscribe({
        next: () => {
          this.loadMenu();
          this.showToast('Kategori silindi.');
        }
      });
    }
  }

  // --- Item Actions ---
  public openAddItem(defaultCategoryId?: string): void {
    this.editingItem.set(null);
    const catId = defaultCategoryId || (this.categories().length > 0 ? this.categories()[0].id : '');
    this.itemForm = {
      name: '',
      nameEn: '',
      categoryId: catId,
      price: 0,
      description: '',
      descriptionEn: '',
      imageUrl: '',
      isChefSpecial: false,
      isPopular: false,
      isNew: false,
      dietaryTags: '',
      allergens: '',
      calories: 0,
      preparationTime: 15,
    };
    this.showItemModal.set(true);
  }

  public openEditItem(item: MenuItem): void {
    this.editingItem.set(item);
    this.itemForm = {
      name: item.name,
      nameEn: item.nameEn || '',
      categoryId: item.categoryId,
      price: item.price,
      description: item.description || '',
      descriptionEn: item.descriptionEn || '',
      imageUrl: item.imageUrl || '',
      isChefSpecial: item.isChefSpecial,
      isPopular: item.isPopular,
      isNew: item.isNew,
      dietaryTags: item.dietaryTags || '',
      allergens: item.allergens || '',
      calories: item.calories || 0,
      preparationTime: item.preparationTime || 15,
    };
    this.showItemModal.set(true);
  }

  public saveItem(): void {
    if (!this.itemForm.name || !this.itemForm.categoryId || !this.itemForm.price) {
      this.showToast('Lütfen yemek adı, kategori ve fiyat alanlarını doldurun.');
      return;
    }

    const editItem = this.editingItem();
    if (editItem) {
      this.api.updateItem(editItem.id, this.itemForm).subscribe({
        next: () => {
          this.showItemModal.set(false);
          this.loadMenu();
          this.showToast('Ürün güncellendi.');
        }
      });
    } else {
      this.api.createItem(this.itemForm).subscribe({
        next: () => {
          this.showItemModal.set(false);
          this.loadMenu();
          this.showToast('Yeni ürün eklendi.');
        }
      });
    }
  }

  public toggleItemAvailability(item: MenuItem): void {
    this.api.toggleItemAvailability(item.id).subscribe({
      next: (res) => {
        if (res.success) {
          item.isAvailable = res.data.isAvailable;
          this.showToast(item.isAvailable ? `${item.name} satışa açıldı.` : `${item.name} tükendi olarak işaretlendi.`);
        }
      }
    });
  }

  public deleteItem(itemId: string): void {
    if (confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
      this.api.deleteItem(itemId).subscribe({
        next: () => {
          this.loadMenu();
          this.showToast('Ürün silindi.');
        }
      });
    }
  }

  public showToast(msg: string): void {
    this.toastMessage.set(msg);
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 3200);
  }

  public logout(): void {
    this.auth.logout();
  }
}
