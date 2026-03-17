import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-paso-tres',
  templateUrl: './paso-tres.component.html',
  styleUrl: './paso-tres.component.scss'
})
/**
 * Componente que representa el paso tres en el asistente.
 * En este paso, se maneja la obtención de la firma y la navegación a la siguiente página.
 */
export class PasoTresComponent {
  
  /**
   * Constructor del componente.
   * 
   * @param router Servicio para la navegación entre rutas en la aplicación.
   * Este servicio se usa para redirigir al usuario a la página de acuse después de obtener la firma.
   */
  constructor(private router: Router) {
    // No hace nada en el constructor.
  }

  /**
   * Método que obtiene la firma y navega a la página de acuse.
   * 
   * @param ev Firma recibida como string.
   * Si se recibe una firma válida, redirige al usuario a la ruta de 'servicios-extraordinarios/acuse'.
   */
  obtieneFirma(ev: string): void {
    
    // Variable que almacena la firma recibida del evento.
    const FIRMA: string = ev;

    // Verifica si la firma es válida (no es vacía o nula).
    if (FIRMA) {
      // Si la firma es válida, navega a la página de acuse.
      this.router.navigate(['servicios-extraordinarios/acuse']);
    }
  }
}
