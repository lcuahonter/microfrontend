import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { NgIf } from '@angular/common';
import { TableComponent } from '@/shared/components/table/table.component';
import { PaginationInfo, TableBodyData, TableData } from '@/shared/interfaces/table.interface';
import { APP_ROUTES, STORE_FRONT_ROUTES } from '../../../../../routes.constants';
import { RoutingService } from '../../../../../core/services/routing.service';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '@/shared/components/button/button.component';
import { ConsultasAereosService } from '../../services/consultas-aereos/consultas-aereos.service';
import { catchError, of, take, tap } from 'rxjs';
import { MANIFIESTO_AEREO_ROUTES } from '../../services/manifiesto-aereo.routes.constants';
import { AirConsultsResponse, SearchBy } from '../../interfaces/consultas-aereos.interface';

@Component({
  selector: 'app-manifiesto-aereo-results',
  standalone: true,
  imports: [TableComponent, FormsModule, NgIf, ButtonComponent],
  templateUrl: './manifiesto-aereo-results.component.html',
})
export class ManifiestoAereoResultsComponent implements OnInit {
  @ViewChild(TableComponent) table!: TableComponent;
  private routing = inject(RoutingService);
  private consultasAereosService = inject(ConsultasAereosService);
  tableData = signal<TableData>({
    headers: [
      'Tipo de Documento',
      'Tipo de Movimiento',
      'Tipo de Operación',
      'Estado Mensaje',
      'CAAT',
      'Nombre CAAT',
      'ID Referencia',
      'No. Documento de Transporte',
      'Estatus',
      'Fecha del Mensaje',
      'Fecha de Validación',
      'Aduana de Despacho',
      'Aduana de Transbordo',
    ],
    body: [],
  });
  paginationInfo: PaginationInfo = {} as PaginationInfo;
  errorMessagesData = false;
  hiddenData = signal<Object[]>([]);
  rowsSelected = signal<TableBodyData[]>([]);
  isLoadingDataTable = signal<boolean>(true);
  isOneRowSelected = signal<boolean>(false);
  isAtleastOneRowSelected = signal<boolean>(false);
  folioMessage = signal<string>('');
  displayAlertFullReport = signal<boolean>(false);
  displayAlertFullReportGenerated = signal<boolean>(false);
  filterByManifest = signal<boolean>(false);
  searchBy = SearchBy;
  ACCEPTED = 'Aceptado';

  ngOnInit(): void {
    this.getMensajes(1);
  }

  rowsSelectedChange(rowsSelected: TableBodyData[]): void {
    this.rowsSelected.set(rowsSelected);
    this.isOneRowSelected.set(rowsSelected.length === 1);
    this.isAtleastOneRowSelected.set(rowsSelected.length > 0);
  }

  seeDetails(): void {
    this.routing.navigate([
      STORE_FRONT_ROUTES.CONSULTAS,
      MANIFIESTO_AEREO_ROUTES.DETALLES_MANIFIESTO_AEREO,
      this.rowsSelected()[0].hiddenData.idHeader,
    ]);
  }

  generateFullReport(): void {
    if (this.isAtleastOneRowSelected()) {
      const dataList = this.rowsSelected().map((row) => ({
        idEncabezado: row.hiddenData.idHeader,
        tipoGuia: this.consultasAereosService.paramsToGetMenssages().tipoDocumentoTransporte,
      }));
      this.consultasAereosService
        .createReport(dataList)
        .pipe(
          tap(({ success, msg }) => {
            if (success) {
              this.folioMessage.set(msg ?? '');
            }
          }),
          take(1),
        )
        .subscribe();
      this.displayAlertFullReportGenerated.set(true);
      this.displayAlertFullReport.set(false);
    } else {
      this.displayAlertFullReportGenerated.set(false);
      this.displayAlertFullReport.set(true);
    }
  }

  onFilterByManifestChange(): void {
    if (!this.filterByManifest()) {
      this.table.clearSelectedRows();
    }
    this.consultasAereosService.changeFilterByManifest(this.filterByManifest());
    this.getMensajes(1);
  }

  getMensajes(page: number): void {
    this.consultasAereosService
      .getMensajes(page)
      .pipe(
        tap((resp: AirConsultsResponse) => {
          if (resp.codigo === '00') {
            const messages = this.consultasAereosService.messages();
            const body = messages.map((item) => [
              item.tipoDocumentoTransporte,
              item.tipoMovimiento,
              item.tipoOperacion,
              item.estadoMensaje,
              item.caat,
              item.nombreCaat,
              item.idReferencia,
              item.numDocumentoTransporte,
              item.estatus,
              item.fechaMensaje,
              item.fechaValidacion,
              item.aduanaDespacho,
              item.aduanaTransbordo,
            ]);
            this.paginationInfo = {
              page: resp.datos.page,
              totalPage: resp.datos.totalPage,
              totalRecords: resp.datos.totalRecords,
              totalToLoad: resp.datos.totalToLoad,
            };
            this.hiddenData.set(messages);
            this.tableData.set({ ...this.tableData(), body });
          }

          this.isLoadingDataTable.set(false);
        }),
        catchError(() => {
          this.errorMessagesData = true;
          this.isLoadingDataTable.set(false);
          return of();
        }),
        take(1),
      )
      .subscribe();
  }

  export(): void {
    this.consultasAereosService.createCsvFile().pipe(take(1)).subscribe();
  }

  tableDataIsEmpty(): boolean {
    return this.tableData().body.length === 0;
  }

  displayFilterByManifest(): boolean {
    return (
      this.consultasAereosService.searchedBy() === this.searchBy.date &&
      (!this.consultasAereosService.isManifest() || !this.consultasAereosService.isHouse())
    );
  }

  allAreAcepted(): boolean {
    return this.rowsSelected().every((item) => item.hiddenData.estadoMensaje === this.ACCEPTED);
  }

  onPageChange(page: number) {
    if (!page) return;
    this.getMensajes(page);
  }
}
