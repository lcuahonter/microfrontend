/**
 * compo doc
 * @fileoverview Componente encargado de gestionar la selección de países de procedencia en un trámite.
 * @module PaisDeOrigenComponent
 */
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import {
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Catalogo } from '@libs/shared/data-access-user/src/core/models/shared/catalogos.model';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { CommonModule } from '@angular/common';
import { CrosslistComponent } from '@libs/shared/data-access-user/src/tramites/components/crosslist/crosslist.component';
import { TituloComponent } from '@libs/shared/data-access-user/src/tramites/components/titulo/titulo.component';

 
/**
 * @componente
 * @nombre PaisDeOrigenComponent
 * @descripcion Componente para la gestión de la selección de países de procedencia.
 *
 * @selector app-pais-procendencia
 * @autonomo true
 * @plantillaUrl ./pais-procendencia.component.html
 * @estiloUrl ./pais-procendencia.component.scss
 * @importaciones [TituloComponent, CrosslistComponent, CommonModule, ReactiveFormsModule, CatalogoSelectComponent]
 */
@Component({
  selector: 'app-pais-de-origen',
  standalone: true,
  imports: [
    TituloComponent,
    CrosslistComponent,
    CommonModule,
    ReactiveFormsModule,
    CatalogoSelectComponent,
  ],
  templateUrl: './pais-de-origen.component.html',
  styleUrl: './pais-de-origen.component.scss',
})
export class PaisDeOrigenComponent implements OnChanges {
  /**
   * @propiedad
   * @nombre crosslistComponent
   * @descripcion Referencia al componente CrosslistComponent.
   * @tipo {CrosslistComponent}
   */
  @ViewChild("crosslistComponent") crosslistComponent!: CrosslistComponent;

  /**
 * @evento
 * @nombre eventoAlHacerClicEnTodasLasCiudades
 * @descripcion Evento que se emite cuando se hace clic en el botón para obtener todas las ciudades.
 * @tipo {EventEmitter<void>}
 */
  @Output() eventoAlHacerClicEnTodasLasCiudades = new EventEmitter<void>();

    /**
   * @description Indica si el formulario debe mostrarse en modo solo lectura.
   * Cuando es `true`, todos los campos del formulario estarán deshabilitados y no podrán ser editados por el usuario.
   * Este valor se recibe como entrada desde el componente padre.
   * @type {boolean}
   * @default false
   */
   @Input() esFormularioSoloLectura: boolean = false;

  /**
 * @metodo
 * @nombre onObtenerCiudades
 * @descripcion Método que emite el evento `eventoAlHacerClicEnTodasLasCiudades` para notificar que se ha solicitado obtener todas las ciudades.
 * @returns {void}
 */
  onObtenerCiudades(): void {
    this.eventoAlHacerClicEnTodasLasCiudades.emit();
  }
 
  /**
   * @propiedad
   * @nombre paisForm
   * @descripcion Formulario reactivo para la selección de países.
   * @tipo {FormGroup}
   */
  @Input() paisForm!: FormGroup;
 
  /**
   * @propiedad
   * @nombre elementosDeBloque
   * @descripcion Lista de países de procedencia.
   * @tipo {Catalogo[]}
   */
  @Input() elementosDeBloque: Catalogo[] = [];
 
  /**
   * @propiedad
   * @nombre paisesPorBloque
   * @descripcion Lista de países agrupados por bloques.
   * @tipo {Catalogo[]}
   */
  @Input() paisesPorBloque: Catalogo[] = [];
 
  /**
   * @propiedad
   * @nombre selectRangoDias
   * @descripcion Rango de días seleccionables.
   * @tipo {string[]}
   */
  @Input() selectRangoDias: string[] = [];

  /**
   * @propiedad
   * @nombre fechaSeleccionada
   * @descripcion Fecha seleccionada por el usuario.
   * @tipo {string[]}
   */
  @Input() fechaSeleccionada: string[] = [];

  /**
 * @property
 * @name titulo
 * @description
 * Título que se muestra en el componente. Este valor puede ser configurado desde el componente padre
 * para personalizar el encabezado o título del componente.
 * 
 * @type {string}
 * @default ''
 * 
 * @example
 * <app-pais-de-origen [titulo]="'Selecciona un país de origen'"></app-pais-de-origen>
 */
  @Input() titulo: string = '';
 
  /**
   * @evento
   * @nombre bloqueCambiar
   * @descripcion Evento emitido cuando se cambia el bloque seleccionado.
   * @tipo {EventEmitter<number>}
   */
  @Output() bloqueCambiar = new EventEmitter<number>();
 
  /**
   * @evento
   * @nombre setValoresStoreEvent
   * @descripcion Evento emitido para establecer valores en el store.
   * @tipo {EventEmitter<{ form: FormGroup; campo: string; metodoNombre: string }>}
   */
  @Output() setValoresStoreEvent = new EventEmitter<{ form: FormGroup; campo: string}>();

  /**
   * @evento
   * @nombre fechasSeleccionadasChangeEvent
   * @descripcion Evento que se emite cuando cambian las fechas seleccionadas en el crosslist.
   * @tipo {EventEmitter<string[]>}
   */
  @Output() fechasSeleccionadasChangeEvent = new EventEmitter<string[]>();
 
  /**
   * @propiedad
   * @nombre campoDeBotones
   * @descripcion Configuración de los botones para la gestión de la selección de países.
   * @tipo {Array<{ btnNombre: string; class: string; funcion: () => void }>}
   */
  campoDeBotones = [
    {
      /**
       * @propiedad
       * @nombre btnNombre
       * @descripcion Nombre del botón para agregar todos los elementos.
       * @tipo {string}
       */
      btnNombre: 'Agregar',
      /**
       * @propiedad
       * @nombre class
       * @descripcion Clase CSS del botón.
       * @tipo {string}
       */
      class: 'btn-primary',
      style: 'margin-top: 8rem; !important',
      /**
       * @metodo
       * @nombre funcion
       * @descripcion Función para agregar todos los elementos.
       */
      funcion: (): void => {
        if (this.crosslistComponent) {
          this.crosslistComponent.agregar('');
        }
      },
    },
    {
      btnNombre: 'Agregar todos',
      class: 'btn-primary',
      funcion: (): void => {
        if (this.crosslistComponent) {
          this.crosslistComponent.agregar('t');
        }
      },
    },
    {
      btnNombre: 'Eliminar',
      class: 'btn-default',
      funcion: (): void => {
        if (this.crosslistComponent) {
          this.crosslistComponent.quitar('');
        }
      },
    },
    {
      btnNombre: 'Eliminar todos',
      class: 'btn-danger',
      funcion: (): void => {
        if (this.crosslistComponent) {
          this.crosslistComponent.quitar('t');
        }
      },
    },
  ];
 
  /**
   * @metodo
   * @nombre ngOnChanges
   * @descripcion Método que se ejecuta cuando hay cambios en las propiedades de entrada del componente.
   * @param {SimpleChanges} changes - Objeto que contiene los cambios en las propiedades de entrada.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectRangoDias'] && changes['selectRangoDias'].currentValue) {
      this.selectRangoDias = changes['selectRangoDias'].currentValue;
    }

    if(changes['fechaSeleccionada'] && changes['fechaSeleccionada'].currentValue) {
      /**
       * @descripcion Actualiza la propiedad fechaSeleccionada con las fechas seleccionadas por el usuario.
       */
      this.fechaSeleccionada = changes['fechaSeleccionada'].currentValue;
      }
  }
 
  /**
   * @metodo
   * @nombre enCambioDeBloque
   * @descripcion Maneja el cambio de bloque seleccionado.
   * @param {Event} event - El evento de cambio.
   */
  enCambioDeBloque(event: Event): void {
    const SELECTED_BLOQUE = Number((event.target as HTMLInputElement).value);
    this.bloqueCambiar.emit(SELECTED_BLOQUE);
  }
 
  /**
   * @metodo
   * @nombre setValoresStore
   * @descripcion Establece valores en el store.
   * @param {FormGroup} form - El formulario reactivo.
   * @param {string} campo - El campo a actualizar.
   * @param {string} metodoNombre - El nombre del método.
   */
  setValoresStore(form: FormGroup, campo: string): void {
    this.setValoresStoreEvent.emit({ form, campo });
  }
 /**
   * @method esInvalido
   * @description Verifica si un control del formulario es inválido.
   * @param nombreControl El nombre del control a verificar.
   * @returns Verdadero si el control es inválido y está tocado o modificado, de lo contrario, falso.
   */
 esInvalido(nombreControl: string): boolean {
  const CONTROL = this.paisForm.get(nombreControl);
  return CONTROL
    ? CONTROL.invalid && (CONTROL.touched || CONTROL.dirty)
    : false;
}

/**
   * @method formularioSolicitudValidacion
   * Valida el formulario de solicitud verificando si todos los campos cumplen con las reglas de validación.
   * Si el formulario es inválido, marca todos los controles como tocados para mostrar los mensajes de error.
   *
   * @returns {boolean} - Retorna `true` si el formulario es válido, de lo contrario `false`.
   */
formularioSolicitudValidacion(): boolean {
  if (this.paisForm.valid) {
    return true;
  }
  this.paisForm.markAllAsTouched();
  return false;
}


  /**
   * @metodo
   * @nombre onFechasSeleccionadasChange
   * @descripcion Maneja el cambio de fechas seleccionadas en el crosslist.
   * @param {string[]} fechasSeleccionadas - Array de fechas seleccionadas.
   */
  onFechasSeleccionadasChange(fechasSeleccionadas: string[]): void {
    this.fechaSeleccionada = fechasSeleccionadas;
    this.fechasSeleccionadasChangeEvent.emit(fechasSeleccionadas);
  }
}
 