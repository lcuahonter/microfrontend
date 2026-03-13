/**
 * @component
 * @name RepresentacionComponent
 * @description RepresentacionComponent es un componente que maneja la selección de entidades federativas y representaciones federales.
 * @selector app-representacion
 * @standalone true
 * @imports TituloComponent, CatalogoSelectComponent, CommonModule, ReactiveFormsModule, AlertComponent
 * @templateUrl ./representacion.component.html
 */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { INSTRUCCIONES_REPRESENTACION_FEDERAL_POR_PROCEDIMIENTO, REPRESENTACION_FEDERAL_DECLARACIONES, TEXTOS } from '../../constantes/representacion-federal.enum';
import { Subject, map, takeUntil } from 'rxjs';
import { AlertComponent } from '@libs/shared/data-access-user/src';
import { Catalogo } from '@libs/shared/data-access-user/src/core/models/shared/catalogos.model';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
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
export class RepresentacionComponent implements OnInit {
  /**
   * @description Indica si el formulario debe mostrarse en modo solo lectura.
   */
  @Input() esFormularioSoloLectura!: boolean;
  /**
   * Formulario reactivo para la representación.
   * @type {FormGroup}
   */
  @Input() frmRepresentacionForm!: FormGroup;

  /**
   * Lista de entidades federativas.
   * @type {Catalogo[]}
   */
  @Input() entidadFederativa: Catalogo[] = [];

  /**
   * Lista de representaciones federales.
   * @type {Catalogo[]}
   */
  @Input() representacionFederal: Catalogo[] = [];

  /**
   * Textos utilizados en el componente.
   * @type {any}
   */
  @Input() TEXTOS = TEXTOS;

  /**
   * Indica si el procedimiento es de representación federal.
   * @type {boolean}
   */
  esRepresentacionFederal: boolean = false;

  /**
   * @property {number} idProcedimiento
   * Identificador único del procedimiento asociado a la solicitud.
   * Este valor es recibido como un input desde el componente padre.
   *
   * @decorador @Input
   */
  @Input() public idProcedimiento!: number;

  instruccionMensaje: string = '';

  /**
   * Evento emitido para establecer valores en el store.
   * @type {EventEmitter<{ form: FormGroup; campo: string; metodoNombre: string }>}
   */
  @Output() setValoresStoreEvent = new EventEmitter<{
    form: FormGroup;
    campo: string;
  }>();

  /**
   * Indica si se debe ocultar la primera opción en los select.
   * @type {boolean}
   */
  @Input() hiddenPrimerOption: boolean = true;

  /**
   * Indica si se debe deshabilitar la primera opción en los select.
   * @type {boolean}
   */
  @Input() disabledPrimerOption: boolean = true;

  /**
    * jest.spyOnSujeto para gestionar la destrucción de suscripciones.
    */
  private destroyed$ = new Subject<void>();

  /**
   * Constructor del componente.
   */
  constructor(private consultaioQuery: ConsultaioQuery) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();
  }

  /**
   * Habilita o deshabilita el formulario según el modo de solo lectura.
   * Controla el estado del formulario al iniciar el componente.
   */
  ngOnInit(): void {
    this.esRepresentacionFederal = !this.esFormularioSoloLectura && REPRESENTACION_FEDERAL_DECLARACIONES.includes(this.idProcedimiento);

    this.instruccionMensaje =
      INSTRUCCIONES_REPRESENTACION_FEDERAL_POR_PROCEDIMIENTO[this.idProcedimiento] ||
      this.TEXTOS.INSTRUCCIONES_REPRESENTACION_FEDERAL;

    if (this.esFormularioSoloLectura) {
      this.frmRepresentacionForm.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.frmRepresentacionForm.enable();
    }
  }

  /**
   * Establece valores en el store.
   * @param {FormGroup} form - El formulario reactivo.
   * @param {string} campo - El campo a actualizar.
   * @param {string} metodoNombre - El nombre del método.
   */
  setValoresStore(form: FormGroup, campo: string): void {
    this.setValoresStoreEvent.emit({ form, campo });
  }
}
