import { Component } from '@angular/core';
import { FirmaElectronicaComponent } from '@libs/shared/data-access-user/src/tramites/components/firma-electronica/firma-electronica.component';
import { TEXTOS } from '@ng-mf/data-access-user';
@Component({
  selector: 'app-paso-tres',
  templateUrl: './paso-tres.component.html',
  styleUrl: './paso-tres.component.scss',
  standalone: true,
  imports: [FirmaElectronicaComponent],
})
export class PasoTresComponent {

  /**
   * Objeto con las instrucciones.
   * @property {string} TEXTOS
   */
  TEXTOS: string = TEXTOS?.INSTRUCCIONES;

}