import { Component, inject } from '@angular/core';
import { ManifiestoAereoResultsComponent } from '../../components/manifiesto-aereo-results/manifiesto-aereo-results.component';
import { RoutingService } from '../../../../../core/services/routing.service';
import { APP_ROUTES, STORE_FRONT_ROUTES, CONSULTAS_ROUTES } from '../../../../../routes.constants';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';

@Component({
  selector: 'app-manifiesto-aereo-resultados',
  standalone: true,
  imports: [ManifiestoAereoResultsComponent, ButtonComponent],
  templateUrl: './manifiesto-aereo-resultados.page.html',
})
export class ManifiestoAereoResultadosPage {
  private routing = inject(RoutingService);

  goBack() {
    this.routing.navigate([
      STORE_FRONT_ROUTES.CONSULTAS,
      CONSULTAS_ROUTES.MANIFIESTO_AEREO,
    ]);
  }
}
