import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ITEMS_POR_PAGINA } from '../../../core/enums/paginador-tabla.enum';

/**
 * Componente de paginación para tablas.
 * Este componente permite la navegación entre páginas de datos en una tabla,
 */
@Component({
  selector: 'app-paginador-tabla',
  templateUrl: './paginador-tabla.component.html',
  styleUrls: ['./paginador-tabla.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})

/**
 * Componente de paginación para tablas.
 */
export class PaginadorTablaComponent implements OnChanges {
  /**
   * Constante que define los elementos por página.
   */
  readonly ITEMS_POR_PAGINA = ITEMS_POR_PAGINA;

  /**
   * Número total de páginas.
   */
  @Input() totalPaginas: number = 1;

  /**
   * Número de la página actual.
   */
  @Input() paginaActual!: number;

  /**
   * Emisor de eventos para cambiar la página actual.
   */
  @Output() cambioPagina = new EventEmitter<number>();

  /**
   * Lista de números de páginas para la paginación.
   */
  paginas: number[] = [];

  /**
   * Número de elementos por página seleccionado.
   */
  itemsPorPagina: number = this.ITEMS_POR_PAGINA[0];

  /**
   * Control de formulario para manejar el número de elementos por página.
   * Este control permite al usuario seleccionar cuántos elementos se mostrarán por página.
   */
  itemsPorPaginaControl: FormControl = new FormControl(this.itemsPorPagina);

  /**
   * Detecta cambios en las propiedades de entrada del componente.
   * Cuando `totalPaginas` cambia, actualiza la lista de páginas.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['totalPaginas']) {
      this.paginas = Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
    }
  }

  /**
   * Maneja el cambio de la página actual.
   * Emite un evento con el número de la página actual.
   */
  cambiarItemsPorPagina(): void {
    this.itemsPorPagina = this.itemsPorPaginaControl.value;
    this.cambioPagina.emit(this.paginaActual);
  }
}
