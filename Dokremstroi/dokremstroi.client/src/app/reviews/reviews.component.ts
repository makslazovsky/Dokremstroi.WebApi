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
  currentPage: number = 1;
  pageSize: number = 5;
  totalCount: number = 0;

  constructor(private reviewManager: ReviewManager) { }

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.reviewManager.getApprovedPaged(this.currentPage, this.pageSize)
      .subscribe(response => {
        this.reviews = response.items;
        this.totalCount = response.totalCount;
      }, error => {
        console.error('Error loading reviews:', error);
      });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadReviews();
  }

  getStarRating(rating: number): string[] {
    return new Array(rating);
  }
}
