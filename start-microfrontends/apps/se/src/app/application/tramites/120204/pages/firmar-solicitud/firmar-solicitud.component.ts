import { Component } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Componente FirmarSolicitudComponent.
 * 
 * Este componente se encarga de gestionar la lógica relacionada con la firma de solicitudes
 * dentro de la aplicación. Proporciona métodos para manejar la firma del usuario y redirigir
 * a la página correspondiente tras completar el proceso.
 * 
 * @selector app-firmar-solicitud
 * @template ./firmar-solicitud.component.html
 */
@Component({
  selector: 'app-firmar-solicitud',
  templateUrl: './firmar-solicitud.component.html',
})
export class FirmarSolicitudComponent {

  /**
   * Constructor del componente FirmarSolicitudComponent.
   * 
   * Inicializa el componente y configura el servicio de enrutamiento para manejar la navegación
   * entre diferentes rutas de la aplicación.
   * 
   * @param router Servicio de enrutamiento utilizado para navegar entre rutas.
   */
  constructor(private router: Router) {
     // El constructor se utiliza para la inyección de dependencias.
  }

  /**
   * Método encargado de procesar la firma obtenida del usuario.
   * 
   * Este método se ejecuta al recibir la firma del usuario. Si la firma es válida, 
   * redirige al usuario a la página de acuse correspondiente.
   * 
   * @param ev Cadena que representa la firma proporcionada por el usuario.
   */
  obtieneFirma(ev: string): void {
    // Asigna la firma recibida al constante FIRMA
    const FIRMA: string = ev; 
    
    // Verifica si la firma es válida
    if (FIRMA) {
      // Si la firma es válida, redirige al usuario a la ruta especificada
      this.router.navigate(['servicios-extraordinarios/acuse']);
    }
  }

}
