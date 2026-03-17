/**
 * @component
 * @name RepresentacionComponent
 * @description RepresentacionComponent es un componente que maneja la selección de entidades federativas y representaciones federales.
 * @selector app-representacion
 * @standalone true
 * @imports TituloComponent, CatalogoSelectComponent, CommonModule, ReactiveFormsModule, AlertComponent
 * @templateUrl ./representacion.component.html
 */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';
import { AlertComponent } from '@libs/shared/data-access-user/src';
import { Catalogo } from '@libs/shared/data-access-user/src/core/models/shared/catalogos.model';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { CommonModule } from '@angular/common';
import { TEXTOS } from '../../constantes/representacion-federal.enum';
import { TituloComponent } from '@libs/shared/data-access-user/src/tramites/components/titulo/titulo.component';

@Component({
  selector: 'app-representacion',
  standalone: true,
  imports: [
    AlertComponent,
    CatalogoSelectComponent,
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
  ],
  templateUrl: './representacion.component.html',
})
export class RepresentacionComponent {
  /**
   * Formulario reactivo para la representación.
   * @type {FormGroup}
   * @property {FormGroup} frmRepresentacionForm - Formulario reactivo que contiene los datos de la representación.
   */
  @Input() frmRepresentacionForm!: FormGroup;

    /**
   * @description Indica si el formulario debe mostrarse en modo solo lectura.
   * Cuando es `true`, todos los campos del formulario estarán deshabilitados y no podrán ser editados por el usuario.
   * Este valor se recibe como entrada desde el componente padre.
   * @type {boolean}
   * @default false
   */
   @Input() esFormularioSoloLectura: boolean = false;

  /**
   * Lista de entidades federativas.
   * @type {Catalogo[]}
   * @property {Catalogo[]} estado - Catálogo de entidades federativas disponibles.
   */
  @Input() estado: Catalogo[] = [];

  /**
   * Lista de representaciones federales.
   * @type {Catalogo[]}
   * @property {Catalogo[]} representacionFederal - Catálogo de representaciones federales disponibles.
   */
  @Input() representacionFederal: Catalogo[] = [];

  /**
   * Textos utilizados en el componente.
   * @type {any}
   * @property {any} TEXTOS - Constantes de texto utilizadas en el componente.
   */
  @Input() TEXTOS = TEXTOS;

  /**
   * Evento emitido para establecer valores en el store.
   * @type {EventEmitter<{ form: FormGroup; campo: string; metodoNombre: string }>}
   * @event setValoresStoreEvent - Evento que emite los valores del formulario, el campo y el método para actualizar el store.
   */
  @Output() setValoresStoreEvent = new EventEmitter<{ form: FormGroup; campo: string }>();

  /**
   * Establece valores en el store.
   * @method setValoresStore
   * @param {FormGroup} form - El formulario reactivo.
   * @param {string} campo - El campo a actualizar.
   * @param {string} metodoNombre - El nombre del método que se ejecutará.
   * @description Este método emite un evento con los valores necesarios para actualizar el store.
   */
  setValoresStore(form: FormGroup, campo: string): void {
    this.setValoresStoreEvent.emit({ form, campo });
  }
}