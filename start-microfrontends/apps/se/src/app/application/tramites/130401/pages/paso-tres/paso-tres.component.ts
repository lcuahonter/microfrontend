import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FirmaElectronicaComponent } from '@libs/shared/data-access-user/src';
import { Router } from '@angular/router';

/**
 * Componente para gestionar el paso tres del trámite 130401.
 * 
 * Este componente incluye la funcionalidad para capturar la firma electrónica
 * y redirigir al usuario al acuse una vez que se ha obtenido la firma.
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
   * @param {Router} router - Servicio de Angular Router para la navegación entre rutas.
   */
  constructor(private router: Router) {
    // Constructor
  }

  /**
   * Método para manejar la firma electrónica obtenida.
   * 
   * Este método se ejecuta cuando se recibe un evento con la firma electrónica.
   * Si la firma es válida, redirige al usuario a la página de acuse.
   * 
   * @param {string} ev - Firma electrónica obtenida.
   */
  obtieneFirma(ev: string): void {
    const FIRMA = ev;
    if (FIRMA) {
      this.router.navigate(['modificacion-descripcion/acuse']);
    }
  }
}