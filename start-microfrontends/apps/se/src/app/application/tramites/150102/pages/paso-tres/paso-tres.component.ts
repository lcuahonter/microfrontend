import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FirmaElectronicaComponent } from '@libs/shared/data-access-user/src';
import { Router } from '@angular/router';

/**
 * Componente PasoTresComponent.
 *
 * Este componente maneja la lógica para el paso tres de un trámite específico.
 *
 * @component
 * @selector app-paso-tres
 * @templateUrl ./paso-tres.component.html
 * @styleUrl ./paso-tres.component.scss
 */
@Component({
  selector: 'app-paso-tres',
  standalone: true,
  imports: [CommonModule, FirmaElectronicaComponent],
  templateUrl: './paso-tres.component.html',
  styleUrl: './paso-tres.component.scss',
})
export class PasoTresComponent {
  /**
   * Constructor de la clase PasoTresComponent.
   *
   * @param router - Servicio de Angular Router para la navegación entre rutas.
   */
  constructor(public router: Router) {
    // Si es necesario, se puede agregar aquí la lógica de inicialización
  }

  /**
   * Maneja el evento para obtener una firma y redirige a una ruta específica si la firma es válida.
   *
   * @param ev - La cadena de texto que representa la firma obtenida.
   * @returns void
   */
  obtieneFirma(ev: string): void {
    const FIRMA: string = ev;
    if (FIRMA) {
      this.router.navigateByUrl('se/reporte-anual/acuse');
    }
  }
}
