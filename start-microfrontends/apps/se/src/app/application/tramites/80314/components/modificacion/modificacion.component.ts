import {
  CatalogoSelectComponent,
  CatalogosSelect,
  TablaSeleccion,
} from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import {
  Solicitud80314State,
  Tramite80314Store,
} from '../../../../estados/tramites/tramite80314.store';
import { Subject, map, takeUntil } from 'rxjs';
import { ACTIVIDAD_PRODUCTIVA } from '../../constantes/modificacion.enum';
import { CommonModule } from '@angular/common';
import { DatosDelModificacion } from '../../estados/models/datos-tramite.model';
import { ImmerModificacionService } from '../../service/immer-modificacion.service';
import { Tramite80314Query } from '../../../../estados/queries/tramite80314.query';

@Component({
  selector: 'app-modificacion',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    CatalogoSelectComponent,
  ],
  templateUrl: './modificacion.component.html',
  styleUrl: './modificacion.component.scss',
})
export class ModificacionComponent implements OnInit, OnDestroy {
  constructor(
    private fb: FormBuilder,
    private solicitudService: ImmerModificacionService,
    private tramite80314Store: Tramite80314Store,
    private tramite80314Query: Tramite80314Query,
    private consultaioQuery: ConsultaioQuery
  ) {}

  /**
   * @description Representa la actividad productiva seleccionada en el componente.
   * @type {CatalogosSelect}
   * @memberof ModificacionComponent
   * @compodoc
   */
  actividadProductiva!: CatalogosSelect;

  /**
   * Grupo de formulario para el formulario de solicitud.
   */
  modificacionForm!: FormGroup;

  /**
   * Observable para notificar la destrucción del componente.
   * Se utiliza para cancelar suscripciones activas y evitar fugas de memoria.
   */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado actual del trámite.
   * Contiene los datos relacionados con la modificación del trámite.
   */
  public derechoState: Solicitud80314State = {} as Solicitud80314State;

  /**
   * Representa la tabla de selección utilizada en el componente de modificación.
   * Esta tabla se utiliza para gestionar y mostrar los datos seleccionados
   * en el contexto de los trámites específicos.
   */
  TablaSeleccion = TablaSeleccion;

  /**
   * Define los datos que se mostrarán en la tabla dinámica.
   */
  datosTabla: DatosDelModificacion[] = [];

    /**
   * @property {ConsultaioState} consultaDatos
   * @description Estado actual de la consulta, que contiene información relacionada con el trámite y el solicitante.
   */
  consultaDatos!: ConsultaioState;

  /**
   * @property {boolean} soloLectura
   * @description Indica si el formulario o los campos están en modo de solo lectura.
   * @default false
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Método que se ejecuta al inicializar el componente.
   * Configura el formulario, carga los datos de modificación y los datos de la tabla.
   */
  ngOnInit(): void {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.esFormularioSoloLectura = this.consultaDatos.readonly;
        })
      )
      .subscribe();
    this.tramite80314Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.derechoState = {
            ...this.derechoState,
            ...seccionState,
          };
        })
      )
      .subscribe();

    this.inicializarFormulario();
    this.loadDatosModificacion();
    this.inicializarEstadoFormulario();
    this.loadDatosTablaData();
    this.inicializarEstadoFormulario();

    this.actividadProductiva = {
      labelNombre: 'Actividad productiva',
      required: true,
      primerOpcion: 'Seleccione una opción',
      catalogos: ACTIVIDAD_PRODUCTIVA
    };
  }

  /**
  * @method inicializarEstadoFormulario
  * @description Inicializa el estado del formulario según el modo de solo lectura.
  * 
  * Si la propiedad `soloLectura` es verdadera, deshabilita todos los controles del formulario.
  * En caso contrario, habilita los controles del formulario
  * 
  * @returns {void}
  */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.modificacionForm?.disable();
    } else {
      this.modificacionForm?.enable();
      const CAMPOS = [
        'rfc',
        'federal',
        'tipo',
        'programa',
        'actividadProductivaActual'
      ];
      CAMPOS.forEach(campo => this.modificacionForm.get(campo)?.disable());
    }
  }


  /**
   * Método que se ejecuta cuando el componente es destruido.
   * Notifica a todos los observables que deben completarse y limpia las suscripciones.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next(); // Notifica a todos los observables que deben completar.
    this.destroyNotifier$.unsubscribe(); // Cancela cualquier suscripción activa.
  }

  /**
   * Inicializa el formulario reactivo con los valores actuales del estado.
   */
  inicializarFormulario(): void {
    this.modificacionForm = this.fb.group({
      rfc: [this.derechoState?.datosModificacion?.rfc, []],
      federal: [this.derechoState?.datosModificacion?.federal, []],
      tipo: [this.derechoState?.datosModificacion?.tipo, []],
      programa: [this.derechoState?.datosModificacion?.programa, []],
      actividadProductivaActual: [this.derechoState?.datosModificacion?.actividadProductivaActual, []],
      actividadProductiva: [this.derechoState?.datosModificacion?.actividadProductiva, []],
    });
  }

  /**
   * Carga los datos de modificación desde el servicio.
   * Actualiza el estado del trámite y los valores del formulario.
   */
  loadDatosModificacion(): void {
    this.solicitudService
      .getDatosModificacion()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos) => {
        (
          this.tramite80314Store.setDatosModificacion as (
            valor: unknown
          ) => void
        )(datos);
        this.setFormValues();
      });
  }

  /**
   * Cargar datos de la tabla.
   *
   * Este método obtiene los datos de la tabla desde el servicio `datosTramiteService`
   * y los almacena en la propiedad `datosTabla`. Utiliza `takeUntil` para cancelar la suscripción
   * cuando el componente se destruye, evitando fugas de memoria.
   *
   * @example
   * // Llamar al método para cargar los datos de la tabla
   * this.loadDatosTablaData();
   */
  loadDatosTablaData(): void {
    this.solicitudService
      .getDatosTableData()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.datosTabla = data;
      });
  }

  /**
   * Establece los valores del formulario utilizando los datos de modificación.
   */
  setFormValues(): void {
    this.modificacionForm
      .get('rfc')
      ?.setValue(this.derechoState?.datosModificacion?.rfc);
    this.modificacionForm
      .get('federal')
      ?.setValue(this.derechoState?.datosModificacion?.federal);
    this.modificacionForm
      .get('tipo')
      ?.setValue(this.derechoState?.datosModificacion?.tipo);
    this.modificacionForm
      .get('programa')
      ?.setValue(this.derechoState?.datosModificacion?.programa);
    this.modificacionForm
      .get('actividadProductivaActual')
      ?.setValue(
        this.derechoState?.datosModificacion?.actividadProductivaActual
      );
  }

  /**
   * Establecer valores en el store del trámite.
   * @param form Formulario reactivo.
   * @param campo Nombre del campo.
   * @param metodoNombre Nombre del método en el store.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite80314Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite80314Store[metodoNombre] as (valor: unknown) => void)(VALOR);
  }
}
