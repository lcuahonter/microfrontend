import { Component, inject, OnInit, signal } from '@angular/core';
import { TableComponent } from '../../../../../shared/components/table/table.component';
import { TableData } from '../../../../../shared/interfaces/table.interface';
import { ConsultasAereosService } from '../../services/consultas-aereos/consultas-aereos.service';
import { catchError, of, take, tap } from 'rxjs';
import { TransportDocumentInformationDetailsResponse } from '../../interfaces/consultas-aereos.interface';

@Component({
  selector: 'app-transport-document-information-details',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './transport-document-information-details.component.html',
})
export class TransportDocumentInformationDetailsComponent implements OnInit {
  private consultasAereosService = inject(ConsultasAereosService);
  tableTransportDocumentDetails = signal<TableData>({
    headers: [
      'Número de Viaje  ',
      'CAAT / IATA (Código)',
      'fecha/Hora',
      'Lugar de transbordo (Ruta) y Destino (Código)',
    ],
    body: [],
  });
  isLoadingDocumentDeatailsData = signal<boolean>(true);
  errorDocumentDetailsData = false;

  ngOnInit(): void {
    this.getTransportDocumentInformationDetails();
  }

  getTransportDocumentInformationDetails() {
    this.consultasAereosService
      .getTransportDocumentInformationDetails()
      .pipe(
        tap((resp: TransportDocumentInformationDetailsResponse) => {
          if (resp.codigo === '00') {
            const body = resp.datos.map((item) => [
              item.numeroViaje,
              item.caatIataCodigo,
              item.fechaHora,
              item.lugarTransbordoRutaDestinoCodigo,
            ]);
            this.tableTransportDocumentDetails.set({
              ...this.tableTransportDocumentDetails(),
              body,
            });
          }
          this.isLoadingDocumentDeatailsData.set(false);
        }),
        catchError(() => {
          this.errorDocumentDetailsData = true;
          this.isLoadingDocumentDeatailsData.set(false);
          return of();
        }),
        take(1),
      )
      .subscribe();
  }
}
