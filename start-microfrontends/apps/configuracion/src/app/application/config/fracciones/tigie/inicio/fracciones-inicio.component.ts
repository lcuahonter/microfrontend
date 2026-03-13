import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TituloComponent } from '@libs/shared/data-access-user/src';

@Component({
  selector: 'app-fracciones-inicio',
  standalone: true,
  imports: [CommonModule, RouterModule, TituloComponent],
  templateUrl: './fracciones-inicio.component.html',
  styleUrls: ['./fracciones-inicio.component.scss']
})
export class FraccionesInicioComponent {
  correlacionExpanded = false;
  consultaExpanded = false;

  /**
   * Toggle expandir/collapsar correlacion
   */
  toggleCorrelacion(): void {
    this.correlacionExpanded = !this.correlacionExpanded;
  }

  /**
   * Toggle expandir/collapsar consulta
   */
  toggleConsulta(): void {
    this.consultaExpanded = !this.consultaExpanded;
  }
}
