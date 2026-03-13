import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { FirmaElectronicaComponent } from '@libs/shared/data-access-user/src';
import { Router } from '@angular/router';
/**
 * Componente para gestionar el paso cuatro del trámite 32503.
 * 
 * Este componente permite al usuario realizar la firma electrónica y, en caso de éxito,
 * redirigirlo a la página de acuse.
 */
@Component({
  selector: 'app-paso-tres',
  templateUrl: './paso-tres.component.html',
  styleUrl: './paso-tres.component.scss',
  standalone: true,
  imports: [CommonModule, FirmaElectronicaComponent],
})
export class PasoTresComponent {

  /**
   * Constructor del componente.
   * 
   * @param {Router} router - Servicio de Angular para manejar la navegación entre rutas.
   */
  constructor(private router: Router) {
    // Constructor
  }

  /**
   * Maneja la obtención de la firma electrónica.
   * 
   * Este método recibe la firma electrónica y, si es válida, redirige al usuario
   * a la página de acuse.
   * 
   * @param {string} ev - Cadena que representa la firma electrónica obtenida.
   */
  obtieneFirma(ev: string): void {
    const FIRMA = ev;
    if (FIRMA) {
      this.router.navigate(['aviso-traslado/acuse']);
    }
  }
}