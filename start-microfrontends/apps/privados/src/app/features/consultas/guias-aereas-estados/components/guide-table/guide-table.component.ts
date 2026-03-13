import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { GuidesService } from '../../services/guides.service';
import { catchError, of, take, tap } from 'rxjs';
import { Guide, GuidesResponse } from '../../interfaces/guides.interface';
import { TableData } from '@/shared/interfaces/table.interface';
import { TableComponent } from '@/shared/components/table/table.component';
import { TypeSearch } from '@/features/consultas/guias-aereas/interfaces/air-waybill-forms.interface';

@Component({
  selector: 'app-guide-table',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './guide-table.component.html',
})
export class GuideTableComponent {
  @Output() notResults = new EventEmitter();
  private guidesService = inject(GuidesService);
  tableGuideData = signal<TableData>({
    headers: ['Número de Guía', 'Estado', 'Fecha', 'Tipo Operación', 'Replica'],
    body: [],
  });
  errorGuideData = false;
  isLoadingGuideDataTable = signal<boolean>(true);

  ngOnInit() {
    if (this.guidesService.searchBy() === TypeSearch.MASTER) {
      this.getMasterGuide();
    } else if (this.guidesService.searchBy() === TypeSearch.HOUSE) {
      this.getHouseGuide();
    } else if (this.guidesService.searchBy() === TypeSearch.MANIFEST) {
      this.getManifestGuide();
    }
  }

  getMasterGuide() {
    this.guidesService
      .getMasterGuide()
      .pipe(
        tap((resp: GuidesResponse) => {
          if (resp.codigo === '00') {
            this.buildTable(resp.datos);
            if (resp.datos.length === 0) {
              this.notResultsEmit();
            }
          }
        }),
        catchError(() => {
          this.errorGuideData = true;
          this.isLoadingGuideDataTable.set(false);
          return of();
        }),
        take(1),
      )
      .subscribe();
  }

  getHouseGuide() {
    this.guidesService
      .getHouseGuide()
      .pipe(
        tap((resp: GuidesResponse) => {
          if (resp.codigo === '00') {
            this.buildTable(resp.datos);
            if (resp.datos.length === 0) {
              this.notResultsEmit();
            }
          }
        }),
        catchError(() => {
          this.errorGuideData = true;
          this.isLoadingGuideDataTable.set(false);
          return of();
        }),
        take(1),
      )
      .subscribe();
  }

  getManifestGuide() {
    this.guidesService
      .getManifestGuide()
      .pipe(
        tap((resp: GuidesResponse) => {
          if (resp.codigo === '00') {
            this.buildTable(resp.datos);
            if (resp.datos.length === 0) {
              this.notResultsEmit();
            }
          }
        }),
        catchError(() => {
          this.errorGuideData = true;
          this.isLoadingGuideDataTable.set(false);
          return of();
        }),
        take(1),
      )
      .subscribe();
  }

  notResultsEmit() {
    this.notResults.emit();
  }

  buildTable(guide: Guide[]) {
    const body = guide.map((item) => [
      item.numeroGuia,
      item.estado,
      item.fecha,
      item.tipoOperacion,
      item.replica,
    ]);
    this.tableGuideData.set({ ...this.tableGuideData(), body });
    this.isLoadingGuideDataTable.set(false);
  }
}
