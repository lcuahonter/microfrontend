import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DatosAnexosComponent } from '../datos-anexos/datos-anexos.component';
import { DatosComplimentariaComponent } from '../datos-complimentaria/datos-complimentaria.component';
import { MontoFactorComponent } from '../monto-factor/monto-factor.component';

/**
 * @component ComplementariaImmexComponent
 * Componente para la sección complementaria IMMEX
 */
@Component({
  selector: 'app-complementaria-immex',
  templateUrl: './complementaria-immex.component.html',
  styleUrls: ['./complementaria-immex.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MontoFactorComponent,
    DatosComplimentariaComponent,
    DatosAnexosComponent,
  ],
})
/**
 * @class ComplementariaImmexComponent
 * Clase del componente complementaria IMMEX
 */
export class ComplementariaImmexComponent {
  /** Índice de la pestaña seleccionada */
  indice: number = 1;

  /**
   * Selecciona una pestaña
   * @param {number} i
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }
}
