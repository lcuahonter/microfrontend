import { Component, inject, OnInit, signal } from '@angular/core';
import { GeneralDataTransportDocumentComponent } from '../../components/general-data-transport-document/general-data-transport-document.component';
import { APP_ROUTES, STORE_FRONT_ROUTES } from '../../../../../routes.constants';
import { TransportDocumentDetailsComponent } from '../../components/transport-document-details/transport-document-details.component';
import { AirWaybillDetailComponent } from '../../components/air-waybill-detail/air-waybill-detail.component';
import { TransportDocumentTotalsComponent } from '../../components/transport-document-totals/transport-document-totals.component';
import { RoutingService } from '../../../../../core/services/routing.service';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { ConsultasAereosService } from '../../services/consultas-aereos/consultas-aereos.service';
import { ActivatedRoute } from '@angular/router';
import { take, tap } from 'rxjs';
import {
  GeneralDataDocument,
  DocumentDetail,
  DetailMessage,
  Totals,
} from '../../interfaces/consultas-aereos.interface';
import { SessionStorageService } from '@/shared/services/session-storage.service';
import { MANIFIESTO_AEREO_ROUTES } from '../../services/manifiesto-aereo.routes.constants';

@Component({
  selector: 'app-manifiesto-aereo-detalles-page',
  standalone: true,
  imports: [
    GeneralDataTransportDocumentComponent,
    TransportDocumentDetailsComponent,
    AirWaybillDetailComponent,
    TransportDocumentTotalsComponent,
    ButtonComponent,
  ],
  templateUrl: './manifiesto-aereo-detalles-page.html',
})
export class ManifiestoAereoDetallesPage implements OnInit {
  private routing = inject(RoutingService);
  private activatedRoute = inject(ActivatedRoute);
  private consultasAereoService = inject(ConsultasAereosService);
  private sessionStorage = inject(SessionStorageService);
  documentGeneralData = signal<GeneralDataDocument | null>(null);
  documentDetails = signal<DocumentDetail | null>(null);
  totals = signal<Totals | null>(null);
  isManifest = signal<boolean>(false);

  ngOnInit(): void {
    this.activatedRoute.paramMap
      .pipe(
        tap((params) => {
          const idHeader = params.get('idHeader') ?? '';
          this.consultasAereoService.idHeader.set(idHeader);
          this.sessionStorage.set('idHeader', idHeader);
          this.isManifest.set(this.consultasAereoService.isManifest());
        }),
      )
      .subscribe();

    this.getMessagesDetails();
  }

  getMessagesDetails() {
    this.consultasAereoService
      .getMessageDetails()
      .pipe(
        tap((resp: DetailMessage) => {
          this.documentGeneralData.set(resp.datosGeneralesDocumento);
          this.documentDetails.set(resp.detalleDocumento);
          this.totals.set(resp.totales);
        }),
        take(1),
      )
      .subscribe();
  }
  goBack() {
    this.routing.navigate([
      STORE_FRONT_ROUTES.CONSULTAS,
      MANIFIESTO_AEREO_ROUTES.RESULTADOS_MANIFIESTO_AEREO,
    ]);
  }
}
