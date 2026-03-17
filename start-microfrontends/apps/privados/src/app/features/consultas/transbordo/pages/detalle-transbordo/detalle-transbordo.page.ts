import { Component, inject } from '@angular/core';
import { TransferDetailsComponent } from '../../components/transfer-details/transfer-details.component';
import { RoutingService } from '@/core/services/routing.service';
import { APP_ROUTES } from '@/app.routes.constants';
import { CONSULTAS_ROUTES, STORE_FRONT_ROUTES } from '@/routes.constants';
import { SessionStorageService } from '@/shared/services/session-storage.service';

@Component({
  selector: 'app-detalle-transbordo',
  standalone: true,
  imports: [TransferDetailsComponent],
  templateUrl: './detalle-transbordo.page.html',
})
export class DetalleTransbordoPage {
  private routing = inject(RoutingService);
  private sessionStorage = inject(SessionStorageService);

  goBack() {
    this.sessionStorage.cleanParamsFromSessionStorage([
      'manifestNumber',
      'flight',
      'searchBy',
      'idHead',
      'idHeadDetail',
      'numGuideMaster',
    ]);
    this.routing.navigate([
      STORE_FRONT_ROUTES.CONSULTAS,
      CONSULTAS_ROUTES.CONSULTA_TRANSBORDO,
    ]);
  }
}
