import { TableData } from '@/shared/interfaces/table.interface';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { TableComponent } from '@/shared/components/table/table.component';
import { catchError, of, take, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DescargarDocumentoConsultadoService } from '../../services/descargar-documento-consultado.service';
import { FullReportsResponse } from '../../interfaces/descargar-documento-consultado.interface';

@Component({
  selector: 'app-download-document',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './download-document.component.html',
})
export class DownloadDocumentComponent implements OnInit, OnDestroy {
  private descargarDocumentoService = inject(DescargarDocumentoConsultadoService);
  private activatedRoute = inject(ActivatedRoute);

  tableDocumentData = signal<TableData>({
    headers: ['Nombre del Documento'],
    body: [],
  });
  isLoadingDocumentData = signal<boolean>(true);
  errorDataReports = false;

  ngOnInit(): void {
    this.activatedRoute.paramMap
      .pipe(
        tap((params) => {
          const folioFullReport = params.get('idFolio') ?? '';
          this.descargarDocumentoService.folioFullReport.set(folioFullReport);
          this.getFullReports();
        }),
      )
      .subscribe();
  }

  downloadDocument() {
    this.descargarDocumentoService.downloadFullReport().pipe(take(1)).subscribe();
  }

  getFullReports() {
    this.descargarDocumentoService
      .getFullReport()
      .pipe(
        tap((resp: FullReportsResponse) => {
          if (resp.codigo === '00') {
            const body = resp.datos.map((item) => [item.nombreArchivo]);
            this.tableDocumentData.set({ ...this.tableDocumentData(), body });
          }

          this.isLoadingDocumentData.set(false);
        }),
        catchError(() => {
          this.errorDataReports = true;
          this.isLoadingDocumentData.set(false);
          return of();
        }),
        take(1),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.descargarDocumentoService.folioFullReport.set('');
  }
}
