import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FirmaElectronicaComponent } from '@libs/shared/data-access-user/src';

/**
 * PasoCuatroComponent es responsable de manejar el primer paso del proceso.
 * para actualizar el componente actual que se está mostrando.
 */
@Component({
  selector: 'app-paso-cuatro',
  standalone: true,
  imports: [CommonModule, FirmaElectronicaComponent],
  templateUrl: './paso-cuatro.component.html',
})
export class PasoCuatroComponent {

  // Variable para almacenar la firma obtenida
  public firma: string = '';
  
  /**
   * Método para actualizar la variable 'firma' con el valor recibido.
   * @param ev - Cadena de texto que representa la firma obtenida
   */
  public obtieneFirma(ev: string): void {
    this.firma = ev;
  }
}
