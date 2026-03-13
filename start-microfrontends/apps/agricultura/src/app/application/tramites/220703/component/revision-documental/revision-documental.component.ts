import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DatosGeneralesComponent } from '../datos-generales/datos-generales.component';
import { PagoDerechosComponent } from '../pago-derechos/pago-derechos.component';
import { TercerosRelacionadosComponent } from '../terceros-relacionados/terceros-relacionados.component';

@Component({
  selector: 'app-revision-documental',
  standalone: true,
  imports: [
    CommonModule,
    DatosGeneralesComponent,
    TercerosRelacionadosComponent,
    PagoDerechosComponent
  ],
  templateUrl: './revision-documental.component.html',
  styleUrl: './revision-documental.component.scss'
})
export class RevisionDocumentalComponent {

  /**
  * Índice del tab seleccionado.
  * @type {number}
  */
  indice: number = 1;

  /**
 * Indica si el contenido es colapsable.
 * @type {boolean}
 */
  colapsable: boolean = true;

  /**
  * Índice actual de la fila.
  * @type {number}
  */
  indiceActual: number = 1;

  /**
  * Filas de datos.
  * @type {any[]}
  */
  rows: { [key: string]: string }[] = [];

  /**
  * Formulario principal.
  * @type {any}
  */
  forma: string = '';

  /**
   * Selecciona un tab específico.
   * @param {number} i - El índice del tab a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

}
