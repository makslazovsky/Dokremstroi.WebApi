import { Component, OnInit } from '@angular/core';
import { ReviewManager } from '../managers/review.manager';
import { Review } from '../models/review.model';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css'],
  standalone: false
})
export class ReviewsComponent implements OnInit {
  reviews: Review[] = [];
  currentPageReviews: number = 1;
  itemsPerPageReviews: number = 5;
  totalCountReviews: number = 0;

  constructor(private reviewManager: ReviewManager) { }

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.reviewManager.getApprovedPaged(this.currentPageReviews, this.itemsPerPageReviews)
      .subscribe(response => {
        this.reviews = response.items;
        this.totalCountReviews = response.totalCount;
      }, error => {
        console.error('Ошибка загрузки отзывов:', error);
      });
  }

  onPageChangeReviews(page: number): void {
    if (page < 1 || page > this.getTotalPagesReviews()) return;
    this.currentPageReviews = page;
    this.loadReviews();
  }

  getTotalPagesReviews(): number {
    return Math.ceil(this.totalCountReviews / this.itemsPerPageReviews);
  }

  getPaginationNumbersReviews(totalCount: number, itemsPerPage: number): number[] {
    const totalPages = Math.ceil(totalCount / itemsPerPage);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  getTotalPages(): number {
    return Math.ceil(this.totalCountReviews / this.itemsPerPageReviews);
  }

  getPaginationNumbers(): number[] {
    return Array.from({ length: this.getTotalPages() }, (_, i) => i + 1);
  }

  getStarRating(rating: number): string[] {
    return new Array(rating);
  }
}
