import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ButtonComponent } from '@/shared/components/button/button.component';
import { FormsModule } from '@angular/forms';
import { TableComponent } from '@/shared/components/table/table.component';
import { TableBodyData, TableData } from '@/shared/interfaces/table.interface';
import { RoutingService } from '@/core/services/routing.service';
import { APP_ROUTES } from '@/app.routes.constants';
import { STORE_FRONT_ROUTES } from '@/routes.constants';
import { DESCARGAR_DOCUMENTO_CONSULTADO_ROUTES } from '../../descargar-documento-consultado.routes.constants';
import { AuthInformationService } from '@/features/auth/services/auth-information.service';
import { catchError, of, take, tap } from 'rxjs';
import { DescargarDocumentoConsultadoService } from '../../services/descargar-documento-consultado.service';
import { FullReportsResponse } from '../../interfaces/descargar-documento-consultado.interface';
import { SessionStorageService } from '@/shared/services/session-storage.service';

@Component({
  selector: 'app-folio-results',
  standalone: true,
  imports: [ButtonComponent, FormsModule, TableComponent],
  templateUrl: './folio-results.component.html',
})
export class FolioResultsComponent implements OnInit, OnDestroy {
  private routing = inject(RoutingService);
  private descargarDocumentoService = inject(DescargarDocumentoConsultadoService);
  private sessionStorage = inject(SessionStorageService);
  authInformation = inject(AuthInformationService);
  isLoadingDataReportsTable = signal<boolean>(true);
  errorDataReports = false;
  tableData = signal<TableData>({
    headers: ['Folio', 'Fecha Creación', 'Estado del Folio'],
    body: [],
  });
  hiddenData = signal<Object[]>([]);
  folio: string = this.descargarDocumentoService.folioFullReport();

  ngOnInit(): void {
    this.getFullReports();
  }

  search() {
    this.descargarDocumentoService.folioFullReport.set(this.folio);
    this.getFullReports();
  }

  getFullReports() {
    this.descargarDocumentoService
      .getFullReport()
      .pipe(
        tap((resp: FullReportsResponse) => {
          if (resp.codigo === '00') {
            const body = resp.datos.map((item) => [item.idFolio, item.fecha, item.estatus]);
            this.tableData.set({ ...this.tableData(), body });
            this.hiddenData.set(resp.datos);
          }

          this.isLoadingDataReportsTable.set(false);
        }),
        catchError(() => {
          this.errorDataReports = true;
          this.isLoadingDataReportsTable.set(false);
          return of();
        }),
        take(1),
      )
      .subscribe();
  }

  onRowClicked(event: TableBodyData) {
    this.routing.navigate([
      STORE_FRONT_ROUTES.CONSULTAS,
      DESCARGAR_DOCUMENTO_CONSULTADO_ROUTES.DOCUMENTO,
      event.hiddenData.idFolio,
    ]);
  }

  ngOnDestroy(): void {
    this.sessionStorage.remove('folioFullReport');
  }
}
