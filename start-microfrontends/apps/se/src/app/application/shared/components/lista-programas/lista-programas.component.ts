import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfiguracionColumna, TablaDinamicaComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { CONFIGURACION_LISTA_PROGRAMA } from '../../enum/lista-programas.enum';
import { CommonModule } from '@angular/common';
import { ProgramaLista } from '../../models/lista-programa.model';

/**
 * Componente que muestra una lista de programas PROSEC en una tabla.
 * Permite la selección de un programa y emite un evento cuando se selecciona uno.
 */
@Component({
  selector: 'app-lista-programas',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    TablaDinamicaComponent
  ],
  templateUrl: './lista-programas.component.html',
  styleUrl: './lista-programas.component.scss',
})
/**
 * Clase que representa el componente de lista de programas PROSEC.
 * @class ListaProgramasComponent
 */
export class ListaProgramasComponent {
  /**
   * Título del componente que se muestra en la interfaz de usuario.
   * @type {string}
   */
  @Input() titulo: string = '';

  /**
   * Configuración de las columnas de la tabla que muestra la lista de programas.
   * @type {ConfiguracionColumna<ProgramaLista>[]}
   */
  programaListaTablaConfiguracion: ConfiguracionColumna<ProgramaLista>[] =
      CONFIGURACION_LISTA_PROGRAMA;

  /**
   * Datos de la lista de programas que se mostrarán en la tabla.
   * @type {ProgramaLista[]}
   */
  @Input() programaListaDatosTabla: ProgramaLista[] = [];

  /**
   * Evento que se emite cuando se selecciona un programa de la lista.
   * @type {EventEmitter<ProgramaLista>}
   */
  @Output() programaListaSeleccionado = new EventEmitter<ProgramaLista>();

  /**
   * Maneja el evento de clic en una fila de la tabla.
   * Emite el programa seleccionado a través del evento programaListaSeleccionado.
   * @param {ProgramaLista} fila - El programa seleccionado.
   */
  onFilaClic(fila: ProgramaLista): void {
    this.programaListaSeleccionado.emit(fila);
  }
}
