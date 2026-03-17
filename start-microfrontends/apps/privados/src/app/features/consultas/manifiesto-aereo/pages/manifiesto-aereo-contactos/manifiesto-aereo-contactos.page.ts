import { Component, inject } from '@angular/core';
import { ContactsComponent } from '../../components/contactos/contacts.component';
import { RoutingService } from '../../../../../core/services/routing.service';
import { APP_ROUTES } from '../../../../../app.routes.constants';
import { STORE_FRONT_ROUTES } from '../../../../../routes.constants';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { ConsultasAereosService } from '../../services/consultas-aereos/consultas-aereos.service';
import { MANIFIESTO_AEREO_ROUTES } from '../../services/manifiesto-aereo.routes.constants';

@Component({
  selector: 'app-manifiesto-aereo-contactos-page',
  standalone: true,
  imports: [ContactsComponent, ButtonComponent],
  templateUrl: './manifiesto-aereo-contactos.page.html',
})
export class ManifiestoAereoContactosPage {
  private routing = inject(RoutingService);
  private consultasAereosService = inject(ConsultasAereosService);

  goBack() {
    this.routing.navigate([
      STORE_FRONT_ROUTES.CONSULTAS,
      MANIFIESTO_AEREO_ROUTES.DETALLES_MANIFIESTO_AEREO,
      this.consultasAereosService.idHeader(),
    ]);
  }
}
