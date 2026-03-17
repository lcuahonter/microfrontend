import {
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
  Signal,
  effect,
  computed,
  input,
} from '@angular/core';
import {
  PaginationInfo,
  TableBodyData,
  TableData,
  TableDataConverted,
} from '../../interfaces/table.interface';
import { FormsModule } from '@angular/forms';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [FormsModule, NgClass, NgFor, NgIf, ButtonComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  @Input() tableData = signal<TableData>({} as TableData);
  @Input() hiddenData = signal<Object[]>([]);
  @Input() isLoading: Signal<boolean> = signal(false);
  @Input() ableSelectAllTable: boolean = false;
  @Input() borderedStyle: boolean = false;
  @Input() ableSelectRows: boolean = false;
  @Input() ableCollapse: boolean = true;
  @Input() title: string = '';
  @Input() hasRedirect: boolean = false;
  @Input() error: boolean = false;
  @Input() hasPagination: boolean = false;
  @Input() textCenterTitleColums: boolean = false;
  @Input() displayHeader: boolean = true;
  @Output() onRowsSelected = new EventEmitter<Array<TableBodyData>>();
  @Output() onRowClicked = new EventEmitter<TableBodyData>();
  @Output() pageChange = new EventEmitter<number>();
  tableDataConverted = signal<TableDataConverted>({} as TableDataConverted);
  collapseId = `collapseTable-${Math.random().toString(36).substring(2, 9)}`;
  selectAllRows: boolean = false;
  pagination = input<PaginationInfo>({
    page: 1,
    totalPage: 1,
    totalRecords: 0,
    totalToLoad: 10,
  });
  currentPage = signal(1);

  tableDataEffect = effect(
    () => {
      if (!this.isLoading()) {
        const data = this.tableData();
        this.tableDataConverted.set({
          headers: data.headers,
          body: this.addSelectedProperty(data.body),
        });
      }
    },
    { allowSignalWrites: true },
  );

  currentPageEffect = effect(
    () => {
      if (this.pagination().page < 1) return;
      this.currentPage.set(this.pagination().page);
    },
    { allowSignalWrites: true },
  );

  pageChangeEffect = effect(
    () => {
      if (this.currentPage() < 1) return;
      this.pageChange.emit(this.currentPage());
    },
    { allowSignalWrites: true },
  );

  pages = computed(() => Array.from({ length: this.pagination().totalPage }, (_, i) => i + 1));
  totalPages = computed(() => this.pagination().totalPage);
  totalRecords = computed(() => this.pagination().totalRecords);
  totalToLoad = computed(() => this.pagination().totalToLoad);

  onRowChange() {
    const rowsSelected = this.tableDataConverted().body.filter((row) => !!row.isSelected);
    this.onRowsSelected.emit(rowsSelected);
  }

  addSelectedProperty(rows: string[][]): TableBodyData[] {
    return (
      rows?.map((row, idx) => ({
        rows: row,
        isSelected: false,
        hiddenData: this.hiddenData()[idx],
      })) ?? []
    );
  }

  onRowClick(index: number) {
    const converted: TableDataConverted = this.tableDataConverted();
    const row: TableBodyData = converted.body[index];
    if (!!row) {
      if (this.ableSelectRows) {
        row.isSelected = !row.isSelected;
        this.tableDataConverted.set({ ...converted });
        this.onRowChange();
      } else {
        this.onRowClicked.emit(row);
      }
    }
  }

  onSelectAllChange() {
    const converted = this.tableDataConverted();
    converted.body.forEach((row) => (row.isSelected = this.selectAllRows));
    this.tableDataConverted.set({ ...converted });
    this.onRowChange();
  }

  clearSelectedRows() {
    const converted = this.tableDataConverted();
    converted.body.forEach((row) => (row.isSelected = false));
    this.selectAllRows = false;
    this.tableDataConverted.set({ ...converted });
    this.onRowChange();
  }

  changePage(page: number) {
    const pageNum = Number(page);

    if (pageNum < 1 || pageNum > this.totalPages() || pageNum === this.currentPage()) return;
    this.currentPage.set(pageNum);
  }

  dataIsEmpty(): boolean {
    const tableData = this.tableDataConverted?.();
    return !tableData?.body || tableData.body.length === 0;
  }
}
