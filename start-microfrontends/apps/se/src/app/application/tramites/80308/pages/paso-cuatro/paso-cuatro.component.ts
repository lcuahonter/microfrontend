import { Component } from '@angular/core';
import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';
import { Router } from '@angular/router';

/**
 * @component PasoCuatroComponent
 * Componente para el paso cuatro del asistente
 */
@Component({
  selector: 'app-paso-cuatro',
  templateUrl: './paso-cuatro.component.html',
  styleUrl: './paso-cuatro.component.scss',
  standalone: true,
  imports: [FirmaElectronicaComponent],
  host: {},
})
/**
 * @class PasoCuatroComponent
 * Clase del componente para el paso cuatro
 */
export class PasoCuatroComponent {
  /**
   * Constructor del componente
   * @param {Router} router
   */
  constructor(private router: Router) { }

  /**
   * Método para navegar al acuse si el parámetro tiene valor
   * @param {string} ev
   */
  obtieneFirma(ev: string): void {
    if (ev) {
      this.router.navigate(['servicios-extraordinarios/acuse']);
    }
  }
}
