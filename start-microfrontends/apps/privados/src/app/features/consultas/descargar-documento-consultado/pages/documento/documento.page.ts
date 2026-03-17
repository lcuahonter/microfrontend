import { Component, inject } from '@angular/core';
import { ButtonComponent } from '@/shared/components/button/button.component';
import { DownloadDocumentComponent } from '../../components/download-document/download-document.component';
import { RoutingService } from '@/core/services/routing.service';
import { APP_ROUTES, CONSULTAS_ROUTES, STORE_FRONT_ROUTES } from '@/routes.constants';

@Component({
  selector: 'app-documento.page',
  standalone: true,
  imports: [ButtonComponent, DownloadDocumentComponent],
  templateUrl: './documento.page.html',
})
export class DocumentoPage {
  private routing = inject(RoutingService);

  goBack() {
    this.routing.navigate([
      STORE_FRONT_ROUTES.CONSULTAS,
      CONSULTAS_ROUTES.DESCARGAR_DOCUMENTO_CONSULTADO,
    ]);
  }
}
