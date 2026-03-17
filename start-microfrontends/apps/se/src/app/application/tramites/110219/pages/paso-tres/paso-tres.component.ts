import { Component } from '@angular/core';
import { FirmaElectronicaComponent } from '@libs/shared/data-access-user/src';
import { Router } from '@angular/router';

/**
 * Componente para gestionar el paso tres del trámite.
 */
@Component({
  selector: 'app-paso-tres',
  templateUrl: './paso-tres.component.html',
  styleUrl: './paso-tres.component.scss',
  standalone: true,
  imports: [FirmaElectronicaComponent],
})
export class PasoTresComponent {
  /**
   * Constructor del componente.
   * Se utiliza para la inyección de dependencias.
   * 
   * @param router Servicio de enrutamiento para navegar entre rutas.
   */
  constructor(private router: Router) {
    // El constructor se utiliza para la inyección de dependencias.
  }

  /**
   * Maneja el evento para obtener la firma y realiza acciones adicionales.
   * Si se obtiene una firma válida, redirige al usuario a la página de acuse.
   * 
   * @param ev - La cadena de texto que representa la firma obtenida.
   */
  obtieneFirma(ev: string): void {
    const FIRMA: string = ev;
    if (FIRMA) {
      this.router.navigate(['servicios-extraordinarios/acuse']);
    }
  }
}