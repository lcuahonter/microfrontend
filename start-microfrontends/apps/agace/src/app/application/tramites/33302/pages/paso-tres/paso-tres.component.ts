import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';
import { Router } from '@angular/router';

/**
 * Componente PasoTresComponent.
 * 
 * Este componente representa el tercer paso de un flujo de trabajo en la aplicación.
 * Contiene la lógica para manejar la obtención de una firma y redirigir al usuario
 * a la página de acuse en caso de que se reciba una firma válida.
 */
@Component({
  selector: 'app-paso-tres',
  standalone: true,
  imports: [CommonModule, FirmaElectronicaComponent],
  templateUrl: './paso-tres.component.html',
  
})


export class PasoTresComponent {
/**
 * Constructor de la clase PasoTresComponent.
 * 
 * @param router - Servicio de Angular Router utilizado para la navegación entre rutas.
 */
constructor(private router: Router) {
  // No se necesita lógica de inicialización adicional.
}

  /**
   * Maneja el evento para obtener una firma y redirige al usuario a la página de acuse
   * si la firma es válida.
   *
   * @param ev - Cadena de texto que representa la firma obtenida.
   *            Se espera que sea una firma válida.
   */
  obtieneFirma(ev: string):void{
    const FIRMA: string = ev;
    if (FIRMA) {
      this.router.navigate(['servicios-extraordinarios/acuse']);

    }
  }
}
