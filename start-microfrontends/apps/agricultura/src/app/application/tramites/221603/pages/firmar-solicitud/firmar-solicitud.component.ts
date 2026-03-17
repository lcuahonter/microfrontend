import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-firmar-solicitud',
  templateUrl: './firmar-solicitud.component.html',
})
export class FirmarSolicitudComponent {
  constructor(private router: Router) {
    // Constructor
  }
/**
 * Obtiene la firma proporcionada y, si es válida, redirige a la página de acuse.
 * 
 * ev - Cadena de texto que representa la firma obtenida.
 */
  obtieneFirma(ev: string): void {
    const FIRMA: string = ev;
    if (FIRMA) {
      this.router.navigate(['servicios-extraordinarios/acuse']);
    }
  }
}
