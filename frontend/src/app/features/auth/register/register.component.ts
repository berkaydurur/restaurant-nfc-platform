import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  public userName = signal<string>('');
  public email = signal<string>('');
  public password = signal<string>('');
  public restaurantName = signal<string>('');
  public restaurantSlug = signal<string>('');

  public isLoading = signal<boolean>(false);
  public errorMessage = signal<string | null>(null);

  public onRestaurantNameChange(val: string) {
    this.restaurantName.set(val);
    if (!this.restaurantSlug()) {
      // Auto-generate slug from name
      const slugified = val
        .toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      this.restaurantSlug.set(slugified);
    }
  }

  public onSubmit() {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.auth.register({
      userName: this.userName(),
      email: this.email(),
      password: this.password(),
      restaurantName: this.restaurantName(),
      restaurantSlug: this.restaurantSlug(),
    }).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.success) {
          this.router.navigate(['/admin']);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'Kayıt sırasında bir hata oluştu.');
      }
    });
  }
}
