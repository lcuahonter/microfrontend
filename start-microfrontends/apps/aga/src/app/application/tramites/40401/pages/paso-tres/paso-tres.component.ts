
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';
import { Router } from '@angular/router';
/**
 * Componente para el paso tres del wizard.
 */
@Component({
  selector: 'paso-tres',
  templateUrl: './paso-tres.component.html',
  styleUrls: ['./paso-tres.component.scss'],
  standalone: true,
      imports: [FormsModule,ReactiveFormsModule,CommonModule,FirmaElectronicaComponent],
  
})
export class PasoTresComponent {


  /**
   * Constructor del componente.
   * @param router Servicio de enrutamiento.
   */
  constructor(private router: Router) {
    // Inicializa el componente.
  }

  /**
   * Obtiene la firma y navega a la página de acuse si la firma es válida.
   * @param {string} ev - La firma obtenida.
   */
  obtieneFirma(ev: string): void {
    const FIRMA: string = ev;
    if (FIRMA) {
      this.router.navigate(['servicios-extraordinarios/acuse']);
    }
  }


}
