import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Restaurant } from '../../core/models/restaurant.model';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  private api = inject(ApiService);
  public restaurants = signal<Restaurant[]>([]);

  ngOnInit(): void {
    this.api.getPublicRestaurants().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.restaurants.set(res.data);
        }
      }
    });
  }
}
