import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table-pagination',
  templateUrl: './table-pagination.component.html',
  styleUrl: './table-pagination.component.scss',
  standalone: true,
    imports:[
      CommonModule,
     
    ]
})
export class TablePaginationComponent {
  /**
   * @input showCurrentPage
   * @type {boolean}
   * @description
   * Indica si se debe mostrar el número de la página actual en la paginación de la tabla.
   * Si es `true`, se muestra el número de página actual; si es `false`, no se muestra.
   */
  @Input() showCurrentPage: boolean = false;
  
  @Input() totalItems: number = 0; // Total number of items
  @Input() itemsPerPage: number = 5; // Items per page
  @Input() currentPage: number = 1; // Current page
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() itemsPerPageChange: EventEmitter<number> = new EventEmitter<number>(); 
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }
  onItemsPerPageChange(event: Event): void {  
    const TARGET = event.target as HTMLInputElement;
  this.itemsPerPage = Number(TARGET.value);
  this.itemsPerPageChange.emit(this.itemsPerPage);
  }
}
