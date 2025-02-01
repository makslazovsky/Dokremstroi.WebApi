import { Component, OnInit } from '@angular/core';
import { MainPageBlockManager } from '../managers/main-page-blocks.manager';
import { MainPageBlock } from '../models/main-page-block.model';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    standalone: false
})
export class HomeComponent implements OnInit {
  blocks: MainPageBlock[] = [];

  constructor(private mainPageBlockManager: MainPageBlockManager) { }

  ngOnInit(): void {
    this.loadBlocks();
  }

  loadBlocks(): void {
    this.mainPageBlockManager.getAll().subscribe({
      next: (blocks) => this.blocks = blocks,
      error: (err) => console.error('Ошибка загрузки блоков:', err),
    });
  }
}
