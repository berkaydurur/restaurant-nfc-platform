import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Restaurant, MenuCategory, MenuItem, WifiQrResponse } from '../../core/models/restaurant.model';

@Component({
  selector: 'app-customer-portal',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './customer-portal.component.html',
  styleUrls: ['./customer-portal.component.css']
})
export class CustomerPortalComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);

  public slug = signal<string>('');
  public tableNumber = signal<string | null>(null);
  public restaurant = signal<Restaurant | null>(null);
  public categories = signal<(MenuCategory & { items: MenuItem[] })[]>([]);
  public wifiData = signal<WifiQrResponse | null>(null);

  public isLoading = signal<boolean>(true);
  public errorMessage = signal<string | null>(null);

  // Active UI filters
  public selectedCategoryId = signal<string>('all');
  public searchQuery = signal<string>('');
  public selectedDietary = signal<string>('all');
  public currentLang = signal<'tr' | 'en'>('tr');

  // Modals state
  public showWifiModal = signal<boolean>(false);
  public showWaiterModal = signal<boolean>(false);
  public showItemDetailModal = signal<boolean>(false);
  public selectedItem = signal<MenuItem | null>(null);
  public waiterCallSuccess = signal<string | null>(null);
  public wifiCopied = signal<boolean>(false);

  // Filtered menu items
  public filteredCategories = computed(() => {
    const cats = this.categories();
    const query = this.searchQuery().toLowerCase().trim();
    const dietary = this.selectedDietary();
    const catId = this.selectedCategoryId();

    return cats
      .filter((cat) => catId === 'all' || cat.id === catId)
      .map((cat) => {
        const filteredItems = (cat.items || []).filter((item) => {
          if (!item.isAvailable) return false;
          const matchQuery =
            !query ||
            item.name.toLowerCase().includes(query) ||
            (item.nameEn && item.nameEn.toLowerCase().includes(query)) ||
            (item.description && item.description.toLowerCase().includes(query));

          const matchDietary =
            dietary === 'all' ||
            (item.dietaryTags && item.dietaryTags.toLowerCase().includes(dietary.toLowerCase()));

          return matchQuery && matchDietary;
        });

        return {
          ...cat,
          filteredItems,
        };
      })
      .filter((cat) => cat.filteredItems.length > 0);
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slugVal = params.get('slug');
      if (slugVal) {
        this.slug.set(slugVal);
        this.loadRestaurantData(slugVal);
      }
    });

    this.route.queryParamMap.subscribe((queryParams) => {
      const table = queryParams.get('table');
      if (table) {
        this.tableNumber.set(table);
      }
    });
  }

  private loadRestaurantData(slug: string): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    // Track NFC tap automatically
    this.api.trackInteraction(slug, 'NFC_TAP', this.tableNumber() || undefined).subscribe();

    // Fetch Restaurant Profile
    this.api.getPublicRestaurant(slug).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.restaurant.set(res.data);
          this.applyBranding(res.data);
          this.loadMenu(slug);
          this.loadWifi(slug);
        } else {
          this.errorMessage.set('Restoran bulunamadı.');
          this.isLoading.set(false);
        }
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Mekan bilgileri yüklenirken bir sorun oluştu.');
        this.isLoading.set(false);
      }
    });
  }

  private loadMenu(slug: string): void {
    this.api.getPublicMenu(slug).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.categories.set(res.data.categories || []);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  private loadWifi(slug: string): void {
    this.api.getPublicWifiQr(slug).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.wifiData.set(res.data);
        }
      }
    });
  }

  private applyBranding(restaurant: Restaurant): void {
    if (restaurant.primaryColor) {
      document.documentElement.style.setProperty('--brand-primary', restaurant.primaryColor);
      const hex = restaurant.primaryColor.replace('#', '');
      if (hex.length === 6) {
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        document.documentElement.style.setProperty('--brand-primary-rgb', `${r}, ${g}, ${b}`);
      }
    }
    if (restaurant.accentColor) {
      document.documentElement.style.setProperty('--brand-accent', restaurant.accentColor);
    }
  }

  public openWifiModal(): void {
    this.showWifiModal.set(true);
    this.api.trackInteraction(this.slug(), 'WIFI_CONNECT', this.tableNumber() || undefined).subscribe();
  }

  public closeWifiModal(): void {
    this.showWifiModal.set(false);
    this.wifiCopied.set(false);
  }

  public copyWifiPassword(): void {
    const pwd = this.restaurant()?.wifiPassword;
    if (pwd) {
      navigator.clipboard.writeText(pwd).then(() => {
        this.wifiCopied.set(true);
        setTimeout(() => this.wifiCopied.set(false), 2500);
      });
    }
  }

  public openGoogleReview(): void {
    const rest = this.restaurant();
    this.api.trackInteraction(this.slug(), 'GOOGLE_REVIEW', this.tableNumber() || undefined).subscribe();
    if (rest?.googleReviewUrl) {
      window.open(rest.googleReviewUrl, '_blank');
    } else if (rest?.googleMapsUrl) {
      window.open(rest.googleMapsUrl, '_blank');
    } else if (rest?.name) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(rest.name + ' yorumlar')}`, '_blank');
    }
  }

  public openWaiterModal(): void {
    this.waiterCallSuccess.set(null);
    this.showWaiterModal.set(true);
  }

  public sendWaiterRequest(type: 'WAITER' | 'BILL_CASH' | 'BILL_CARD'): void {
    const table = this.tableNumber() || 'Masa Belirtilmedi';
    let msg = '';
    if (type === 'WAITER') msg = `${table}: Garson çağrısı iletildi.`;
    if (type === 'BILL_CASH') msg = `${table}: Nakit hesap talebi iletildi.`;
    if (type === 'BILL_CARD') msg = `${table}: Kredi kartı ile hesap talebi iletildi.`;

    this.api.trackInteraction(this.slug(), 'WAITER_CALL', this.tableNumber() || undefined, { requestType: type }).subscribe();
    this.waiterCallSuccess.set(msg);

    setTimeout(() => {
      this.showWaiterModal.set(false);
      this.waiterCallSuccess.set(null);
    }, 2800);
  }

  public viewItem(item: MenuItem): void {
    this.selectedItem.set(item);
    this.showItemDetailModal.set(true);
    this.api.trackInteraction(this.slug(), 'MENU_VIEW', this.tableNumber() || undefined, { itemId: item.id }).subscribe();
  }

  public toggleLanguage(): void {
    this.currentLang.set(this.currentLang() === 'tr' ? 'en' : 'tr');
  }

  public scrollToMenu(): void {
    const el = document.getElementById('menu-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
