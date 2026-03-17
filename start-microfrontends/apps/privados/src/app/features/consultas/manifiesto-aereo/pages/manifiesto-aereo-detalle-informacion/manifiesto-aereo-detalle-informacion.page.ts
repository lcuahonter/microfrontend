import { Component, inject } from '@angular/core';
import { TransportDocumentInformationDetailsComponent } from '../../components/transport-document-information-details/transport-document-information-details.component';
import { RoutingService } from '../../../../../core/services/routing.service';
import { APP_ROUTES } from '../../../../../app.routes.constants';
import { STORE_FRONT_ROUTES } from '../../../../../routes.constants';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { MANIFIESTO_AEREO_ROUTES } from '../../services/manifiesto-aereo.routes.constants';
import { ConsultasAereosService } from '../../services/consultas-aereos/consultas-aereos.service';

@Component({
  selector: 'app-manifiesto-aereo-detalle-informacio-page',
  standalone: true,
  imports: [TransportDocumentInformationDetailsComponent, ButtonComponent],
  templateUrl: './manifiesto-aereo-detalle-informacion.page.html',
})
export class ManifiestoAereoDetalleInformacionPage {
  private consultasAereosService = inject(ConsultasAereosService);
  private routing = inject(RoutingService);

  goBack() {
    this.routing.navigate([
      STORE_FRONT_ROUTES.CONSULTAS,
      MANIFIESTO_AEREO_ROUTES.DETALLES_MANIFIESTO_AEREO,
      this.consultasAereosService.idHeader(),
    ]);
  }
}
