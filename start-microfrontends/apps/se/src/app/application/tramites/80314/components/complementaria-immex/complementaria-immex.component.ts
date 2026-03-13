import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DatosAnexosComponent } from '../datos-anexos/datos-anexos.component';
import { DatosComplimentariaComponent } from '../datos-complimentaria/datos-complimentaria.component';
import { MontoFactorComponent } from '../monto-factor/monto-factor.component';

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
export class ComplementariaImmexComponent {
  /**
   * Índice de la pestaña seleccionada.
   * @type {number}
   */
  indice: number = 1;

  /**
   * Método para seleccionar una pestaña.
   * Actualiza el índice de la pestaña seleccionada con el valor proporcionado.
   * @param {number} i - El índice de la pestaña que se desea seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i; // Actualiza el índice de la pestaña seleccionada.
  }
}
