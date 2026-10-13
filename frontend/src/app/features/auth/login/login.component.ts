import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  public email = signal<string>('admin@lucca.com');
  public password = signal<string>('password123');
  public isLoading = signal<boolean>(false);
  public errorMessage = signal<string | null>(null);

  public fillDemo(email: string) {
    this.email.set(email);
    this.password.set('password123');
  }

  public onSubmit() {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.auth.login({
      email: this.email(),
      password: this.password()
    }).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.success) {
          this.router.navigate(['/admin']);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'Giriş yapılamadı. Bilgilerinizi kontrol edin.');
      }
    });
  }
}
