import { Component } from '@angular/core';
import { Router } from '@angular/router';


/**
 * Componente encargado del paso tres en el flujo de trámites.
 * 
 * @component
 * @selector app-paso-tres
 * @template ./paso-tres.component.html
 */
@Component({
  selector: 'app-paso-tres',
  templateUrl: './paso-tres.component.html',
})
export class PasoTresComponent {
 /**
 * Constructor del componente PasoTresComponent.
 * 
 * @param router - Servicio de enrutamiento para la navegación entre páginas.
 */
  constructor(public router: Router) {
   
  }

 /**
 * Método que obtiene la firma y navega a la página de acuse si la firma es válida.
 * 
 * @param ev - Cadena que representa la firma obtenida.
 * 
 * Si la firma es válida, redirige al usuario a la ruta 'servicios-extraordinarios/acuse'.
 */
   obtieneFirma(ev: string): void {
    const FIRMA: string = ev;
    if (FIRMA) {
      this.router.navigate(['servicios-extraordinarios/acuse']);
    }
  }
}

