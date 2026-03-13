import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { DatosDelTramiteComponent } from '../../../../shared/components/datos-del-tramite/datos-del-tramite.component';
import { DatosDelTramiteFormState } from '../../../../shared/models/datos-del-tramite.model';
import { DatosMercanciaContenedoraComponent } from '../datos-mercancia-contenedora/datos-mercancia-contenedora.component';
import { ID_PROCEDIMIENTO } from '../../constantes/exportacion-armas-explosivo.enum';
import { MercanciaDetalle } from '../../../../shared/models/datos-del-tramite.model';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { Tramite240121Query } from '../../estados/tramite240121Query.query';
import { Tramite240121Store } from '../../estados/tramite240121Store.store';
import { ValidacionesFormularioService } from '@ng-mf/data-access-user';
/**
 * @title Datos del Trámite Contenedora
 * @description Componente contenedor que se encarga de enlazar el estado del trámite con el componente de datos del trámite.
 * @summary Maneja la suscripción al estado y propaga los cambios a través del store.
 */

@Component({
  selector: 'app-datos-del-tramite-contenedora',
  standalone: true,
  imports: [CommonModule, DatosDelTramiteComponent, ReactiveFormsModule, ModalComponent],
  templateUrl: './datos-del-tramite-contenedora.component.html',
  styleUrl: './datos-del-tramite-contenedora.component.scss',
})
/**
 * Componente que representa la contenedora de datos del trámite.
 * Este componente se encarga de gestionar el formulario y los datos relacionados
 * con el trámite, incluyendo la tabla de mercancías y el estado del formulario.
 *
 * @export
 * @class DatosDelTramiteContenedoraComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
export class DatosDelTramiteContenedoraComponent implements OnInit, OnDestroy {
  /**
   * Formulario reactivo para la combinación de datos del trámite.
   * 
   * @type {FormGroup}
   * @memberof DatosDelTramiteContenedoraComponent
   */
  public formCombinacion!: FormGroup;

  /**
   * Observable para gestionar la limpieza de suscripciones activas al destruir el componente.
   * 
   * @private
   * @type {Subject<void>}
   * @memberof DatosDelTramiteContenedoraComponent
   */
  private unsubscribe$ = new Subject<void>();

  /**
   * Datos de la tabla de mercancías que se muestran en el formulario.
   * 
   * @type {MercanciaDetalle[]}
   * @memberof DatosDelTramiteContenedoraComponent
   */
  public datosMercanciaTabla: MercanciaDetalle[] = [];

  /**
 * Indica si el formulario debe mostrarse en modo solo lectura.
 *
 * @type {boolean}
 * @memberof DatosDelTramiteContenedoraComponent
 * @default false
 */
  esFormularioSoloLectura: boolean = false;

  /**
   * Estado actual del formulario de datos del trámite.
   * 
   * @type {DatosDelTramiteFormState}
   * @memberof DatosDelTramiteContenedoraComponent
   */
  public datosDelTramiteFormState!: DatosDelTramiteFormState;

  /**
   * Identificador del procedimiento actual.
   * 
   * @readonly
   * @type {string}
   * @memberof DatosDelTramiteContenedoraComponent
   */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;

  /**
   * @description Referencia al componente ModalComponent dentro de la plantilla.
   * Utiliza el decorador ViewChild para acceder a la instancia del modal y manipularlo desde el código TypeScript.
   * @example
   * // Para abrir el modal:
   * this.modalComponent.open();
   * 
   * @see ModalComponent
   * 
   * @es
   * Referencia al componente modal para mostrar u ocultar diálogos modales en la interfaz de usuario.
   */
  @ViewChild('modal', { static: false }) modalComponent!: ModalComponent;

  /**
   * Constructor del componente.
   * Inicializa el formulario y configura las dependencias necesarias.
   *
   * @param {FormBuilder} fb - Servicio para construir formularios reactivos.
   * @param {Tramite240121Query} tramiteQuery - Query de Akita para obtener el estado actual del trámite.
   * @param {Tramite240121Store} tramiteStore - Store de Akita para actualizar el estado del trámite.
   * @param {ValidacionesFormularioService} validacionesService - Servicio para validar formularios.
   * @param {ConsultaioQuery} consultaQuery - Query para obtener datos de consulta de usuario.
   * @memberof DatosDelTramiteContenedoraComponent
   */
  constructor(
    private fb: FormBuilder,
    private tramiteQuery: Tramite240121Query,
    private tramiteStore: Tramite240121Store,
    private validacionesService: ValidacionesFormularioService,
    private consultaQuery: ConsultaioQuery
  ) {
    this.crearFormCombinacion();
  }

  /**
   * Hook del ciclo de vida que se ejecuta al inicializar el componente.
   * Suscribe a los observables del estado para mostrar los datos en la vista.
   *
   * @returns {void}
   * @memberof DatosDelTramiteContenedoraComponent
   */
  ngOnInit(): void {
    this.crearFormCombinacion();
    this.tramiteQuery.getMercanciaTablaDatos$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.datosMercanciaTabla = data;
      });

    this.tramiteQuery.getDatosDelTramite$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.datosDelTramiteFormState = data;
      });
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.unsubscribe$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();
  }

  /**
   * Verifica si un campo del formulario es válido.
   *
   * @param {string} field - Nombre del campo a validar.
   * @returns {boolean} `true` si el campo es válido, de lo contrario `false`.
   * @memberof DatosDelTramiteContenedoraComponent
   */
  public isValid(field: string): boolean {
    return this.validacionesService.isValid(this.formCombinacion, field) ?? false;
  }

  /**
   * Crea el formulario reactivo para la combinación de datos del trámite.
   *
   * @returns {void}
   * @memberof DatosDelTramiteContenedoraComponent
   */
  public crearFormCombinacion(): void {
    this.formCombinacion = this.fb.group({
    });
  }

  /**
   * Actualiza el estado del formulario de datos del trámite en el store.
   *
   * @param {DatosDelTramiteFormState} event - Estado actualizado del formulario.
   * @returns {void}
   * @memberof DatosDelTramiteContenedoraComponent
   */
  updateDatosDelTramiteFormulario(event: DatosDelTramiteFormState): void {
    this.tramiteStore.updateDatosDelTramiteFormState(event);
  }

  /**
   * Hook del ciclo de vida que se ejecuta al destruir el componente.
   * Libera las suscripciones activas para evitar fugas de memoria.
   *
   * @returns {void}
   * @memberof DatosDelTramiteContenedoraComponent
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
    * Abre el modal correspondiente según el nombre del evento recibido.
    *
    * Si el evento es `'Datosmercancia'`, se carga el componente `DatosMercanciaContenedoraComponent`
    * dentro del modal y se le pasa una función de cierre como input.
    *
    * @method openModal
    * @param {string} event - Nombre del evento que indica qué componente se debe mostrar en el modal.
    * @returns {void}
    */
  openModal(event: string): void {
    if (event === 'Datosmercancia') {
      this.modalComponent.abrir(DatosMercanciaContenedoraComponent, {
        cerrarModal: this.cerrarModal.bind(this),
      });
    }
  }

  /**
   * Cierra el modal dinámico actualmente abierto utilizando el método del componente modal.
   *
   * @method cerrarModal
   * @returns {void}
   */
  cerrarModal(): void {
    this.modalComponent.cerrar();
  }
}
