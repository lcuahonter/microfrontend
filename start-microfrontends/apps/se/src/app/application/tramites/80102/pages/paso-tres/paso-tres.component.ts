import { Component } from '@angular/core';
import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';
import { Router } from '@angular/router';

/**
 * Este componente se utiliza para mostrar el subtítulo del asistente - 220201
 * Establecer el índice del subtítulov
 */
@Component({
  selector: 'app-paso-tres',
  templateUrl: './paso-tres.component.html',
  styleUrl: './paso-tres.component.scss',
  standalone: true,
  imports: [FirmaElectronicaComponent],
  host: { hostID: crypto.randomUUID().toString() },
})
export class PasoTresComponent {

  // eslint-disable-next-line no-empty-function
  constructor(private router: Router){}

  /**
   * Navega a la ruta 'servicios-extraordinarios/acuse' si el parámetro `ev` tiene un valor.
   *
   * @param {string} ev - El parámetro que se verifica para determinar si la navegación debe ocurrir.
   * Si `ev` tiene un valor (no es vacío o nulo), se realiza la navegación.
   */
  obtieneFirma(ev: string): void {
    if (ev) {
      this.router.navigate(['servicios-extraordinarios/acuse']);
    }
  }
}
