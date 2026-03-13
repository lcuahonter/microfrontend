import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ConsultaioQuery, ValidacionesFormularioService } from '@ng-mf/data-access-user';
import { DatosDelTramiteFormState, MercanciaDetalle } from '../../../../shared/models/datos-del-tramite.model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DatosDelTramiteComponent } from '../../../../shared/components/datos-del-tramite/datos-del-tramite.component';
import { DatosMercanciaContenedoraComponent } from '../../../240107/components/datos-mercancia-contenedora/datos-mercancia-contenedora.component';
import { ID_PROCEDIMIENTO } from '../../constantes/sustancias-quimicas.enum';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { Tramite240107Query } from '../../estados/tramite240107Query.query';
import { Tramite240107Store } from '../../estados/tramite240107Store.store';

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
export class DatosDelTramiteContenedoraComponent implements OnInit, OnDestroy {

  /**
   * Componente contenedor para los datos del trámite.
   * Gestiona el formulario reactivo y la interacción con el store y query de Akita.
   * Permite abrir modales para la gestión de mercancías y expone eventos de cierre.
   *
   * @export
   * @class DatosDelTramiteContenedoraComponent
   * @implements {OnInit}
   * @implements {OnDestroy}
   */
  @ViewChild('modal', { static: false }) modalComponent!: ModalComponent;

  /**
   * Evento que se emite para notificar el cierre del componente.
   * Los componentes padres pueden suscribirse a este evento para ejecutar acciones al cerrar.
   *
   * @type {EventEmitter<void>}
   * @memberof AgregarDestinatarioFinalContenedoraComponent
   */
  @Output() cerrar = new EventEmitter<void>();
  /**
   * Formulario reactivo para la combinación de datos.
   * @property {FormGroup} formCombinacion
   */
  public formCombinacion!: FormGroup;

  /**
   * Observable para limpiar suscripciones activas al destruir el componente.
   * @property {Subject<void>} unsubscribe$
   */
  private unsubscribe$ = new Subject<void>();

  /**
   * Datos de la tabla de mercancías que se muestran en el formulario.
   * @property {MercanciaDetalle[]} datosMercanciaTabla
   */
  public datosMercanciaTabla: MercanciaDetalle[] = [];

  /**
   * Estado actual del formulario de datos del trámite.
   * @property {DatosDelTramiteFormState} datosDelTramiteFormState
   */
  public datosDelTramiteFormState!: DatosDelTramiteFormState;

  /**
 * Identificador único del procedimiento.
 * @property {number} idProcedimiento
 */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;
  /**
   * Indica si el formulario es de solo lectura.
   * @property {boolean}
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Indica si se deben usar botones personalizados en el componente.
   * Cuando es `true`, el componente mostrará y gestionará la lógica de botones personalizados.
   */
  usarBotonesPersonalizados: boolean = true;

  /**
   * Constructor del componente.
   *
   * @method constructor
   * @param {Tramite240107Query} tramiteQuery - Query de Akita para obtener el estado actual del trámite.
   * @param {Tramite240107Store} tramiteStore - Store de Akita para actualizar el estado del trámite.
   * @param {ValidacionesFormularioService} validacionesService - Servicio para validar formularios.
   * @param {FormBuilder} fb - Servicio de Angular para construir formularios reactivos
   * @returns {void}
   */
  constructor(
    private fb: FormBuilder,
    private tramiteQuery: Tramite240107Query,
    private tramiteStore: Tramite240107Store,
    private validacionesService: ValidacionesFormularioService,
    private consultaQuery: ConsultaioQuery
  ) {
    this.crearFormCombinacion();
  }

  /**
   * Hook del ciclo de vida que se ejecuta al inicializar el componente.
   * Suscribe a los observables del estado para mostrar los datos en la vista.
   *
   * @method ngOnInit
   * @returns {void}
   */
 ngOnInit(): void {
  this.tramiteQuery.getMercanciaTablaDatos$
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => this.datosMercanciaTabla = data);

  this.tramiteQuery.getDatosDelTramite$
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => this.datosDelTramiteFormState = data);

  this.consultaQuery.selectConsultaioState$
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(state => {
      this.esFormularioSoloLectura = state.readonly;
    });
}
  /**
   * Valida si un campo del formulario es válido.
   *
   * @method isValid
   * @param {string} field - Nombre del campo a validar.
   * @returns {boolean} Indica si el campo es válido.
   */
  public isValid(field: string): boolean {
    return this.validacionesService.isValid(this.formCombinacion, field) ?? false;
  }

  /**
 * Crea el formulario reactivo para la combinación de datos.
 *
 * @method crearFormCombinacion
 * @returns {void}
 */
  public crearFormCombinacion(): void {
    this.formCombinacion = this.fb.group({
    });
  }

  /**
   * Actualiza el estado del formulario de datos del trámite en el store.
   *
   * @method updateDatosDelTramiteFormulario
   * @param {DatosDelTramiteFormState} event - Estado actualizado del formulario.
   * @returns {void}
   */
  updateDatosDelTramiteFormulario(event: DatosDelTramiteFormState): void {
    this.tramiteStore.updateDatosDelTramiteFormState(event);
  }


  /**
   * Hook del ciclo de vida que se ejecuta al destruir el componente.
   * Libera las suscripciones activas para evitar fugas de memoria.
   *
   * @method ngOnDestroy
   * @returns {void}
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
