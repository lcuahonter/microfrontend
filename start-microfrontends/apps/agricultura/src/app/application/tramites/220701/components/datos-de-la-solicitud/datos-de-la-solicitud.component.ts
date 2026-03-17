/**
 * @fileoverview
 * Componente Angular para la gestión de los datos de la solicitud en el trámite 220701.
 * Este componente utiliza formularios reactivos y consume múltiples servicios para obtener catálogos y datos relacionados con la solicitud.
 * Implementa la lógica de inicialización, carga de catálogos, manejo de estado y sincronización con el store de Akita.
 * 
 * @module DatosDeLaSolicitudComponent
 * @author
 * @description
 * - Permite la captura y visualización de los datos de la solicitud.
 * - Sincroniza el estado del formulario con el store.
 * - Gestiona la visualización en modo solo lectura.
 * - Carga catálogos y datos auxiliares desde servicios.
 * - Utiliza Akita para la gestión de estado.
 */
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Subject, delay, map, takeUntil, tap } from 'rxjs';

import {
  AlertComponent,
  CatalogoSelectComponent,
  CatalogosSelect,
  ConfiguracionColumna,
  InputFecha,
  InputFechaComponent,
  SeccionLibQuery,
  SeccionLibState,
  SeccionLibStore,
  TituloComponent,
} from '@libs/shared/data-access-user/src';


import {
  ConsultaioQuery,
  TablaDinamicaComponent,
  TablaSeleccion,
} from '@ng-mf/data-access-user';

import {
  EXPEDICION_FACTURA_FECHA,
  INSTRUCCION_DOBLE_CLIC,
} from '../../constantes/inspeccion-fisica-zoosanitario.enums';

import {
  DatosDelTramite,
  ResponsableInspección,
} from '../../modelos/acuicola.model';

import {
  DatosDeLaSolicitudInt,
  MEDIO_SERVICIO,
  medioInfo,
} from '../../modelos/datos-de-interfaz.model';

import { AcuicolaService } from '../../servicios/acuicola.service';
import { MedioDeTransporteService } from '../../servicios/medio-de-transporte';

import { TramiteState } from '../../estados/tramite220701.store';
import { TramiteStore } from '../../estados/tramite220701.store';
import { TramiteStoreQuery } from '../../estados/tramite220701.query';

/**
 * @component
 * @name DatosDeLaSolicitudComponent
 * @description
 * Componente Angular para la gestión de los datos de la solicitud en el trámite 220701.
 * Permite la captura y visualización de los datos de la solicitud, sincroniza el estado del formulario con el store y gestiona la visualización en modo solo lectura.
 * Carga catálogos y datos auxiliares desde servicios y utiliza Akita para la gestión de estado.
 *
 * - Gestiona la captura y visualización de los datos de la solicitud.
 * - Sincroniza el estado del formulario con el store.
 * - Permite el modo solo lectura para revisión.
 * - Carga catálogos y datos auxiliares desde servicios.
 * - Utiliza Akita para la gestión de estado.
 *
 * @example
 * <datos-de-la-solicitud [esFormularioSoloLectura]="true"></datos-de-la-solicitud>
 */
@Component({
  selector: 'datos-de-la-solicitud',
  standalone: true,
  imports: [
    AlertComponent,
    TituloComponent,
    CatalogoSelectComponent,
    InputFechaComponent,
    ReactiveFormsModule,
    TablaDinamicaComponent,
    CommonModule,
  ],
  templateUrl: './datos-de-la-solicitud.component.html',
  styleUrl: './datos-de-la-solicitud.component.scss',
})

/**
 * Componente que maneja los datos de la solicitud en el formulario.
 * Implementa `OnInit` y `OnDestroy` para la inicialización y limpieza de recursos.
 * 
 * @example
 * <datos-de-la-solicitud [esFormularioSoloLectura]="true"></datos-de-la-solicitud>
 */
export class DatosDeLaSolicitudComponent implements OnInit, OnDestroy {
  /**
   * Formulario reactivo para capturar los datos de la solicitud.
   * Contiene los campos y validaciones necesarias para el formulario.
   * @type {FormGroup}
   */
  datosDeLaSolicitudForm!: FormGroup;

  /**
   * Estado actual de la solicitud basado en el modelo `DatosDeLaSolicitudInt`.
   * Contiene la información manejada dentro del componente.
   * @type {DatosDeLaSolicitudInt}
   */
  solicitudState!: DatosDeLaSolicitudInt;

  /**
   * Indica si la sección del formulario es colapsable.
   * Permite mostrar u ocultar contenido adicional.
   * @type {boolean}
   * @default false
   */
  colapsable: boolean = false;

  /**
   * Mensaje de instrucción para la acción de doble clic.
   * Proporciona información al usuario sobre cómo interactuar con el formulario.
   * @type {string}
   */
  instruccionDobleClic: string = INSTRUCCION_DOBLE_CLIC;

  /**
   * Catálogo de opciones para la hora de inspección.
   * Contiene las opciones disponibles para seleccionar la hora de inspección.
   * @type {CatalogosSelect}
   */
  horaDeInspeccion!: CatalogosSelect;

  /**
   * Catálogo de opciones para la aduana de ingreso.
   * Contiene las opciones disponibles para seleccionar la aduana de ingreso.
   * @type {CatalogosSelect}
   */
  aduanaDeIngreso!: CatalogosSelect;

  /**
   * Catálogo de opciones para la oficina de inspección.
   * Contiene las opciones disponibles para seleccionar la oficina de inspección.
   * @type {CatalogosSelect}
   */
  oficinaDeInspeccion!: CatalogosSelect;

  /**
   * Catálogo de opciones para el punto de inspección.
   * Contiene las opciones disponibles para seleccionar el punto de inspección.
   * @type {CatalogosSelect}
   */
  puntoDeInspeccion!: CatalogosSelect;

  /**
   * Catálogo de opciones para el tipo de contenedor.
   * Contiene las opciones disponibles para seleccionar el tipo de contenedor.
   * @type {CatalogosSelect}
   */
  tipoContenedor!: CatalogosSelect;

  /**
   * Catálogo de opciones para el medio de transporte.
   * Contiene las opciones disponibles para seleccionar el medio de transporte.
   * @type {CatalogosSelect}
   */
  medioDeTransporte!: CatalogosSelect;

  /**
   * Constante que contiene los textos utilizados en el componente.
   * Proporciona mensajes y etiquetas predefinidas.
   * @type {any}
   */
  mercanciaDatos: string[] = [];

  /**
   * Fecha de inicio utilizada en el componente, basada en la expedición de la factura.
   * Proporciona un valor inicial para el campo de fecha.
   * @type {InputFecha}
   */
  fechaInicioInput: InputFecha = EXPEDICION_FACTURA_FECHA;

  /**
   * Tipo de selección de la tabla (Checkbox).
   * Define el tipo de interacción permitida en la tabla.
   * @type {TablaSeleccion}
   */
  tablaSeleccionCheckbox: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * Configuración de las columnas de la tabla para los servicios de mercancía.
   * Define la estructura y propiedades de las columnas.
   * @type {ConfiguracionColumna<medioInfo>[]}
   */
  exportadorTabla: ConfiguracionColumna<medioInfo>[] = MEDIO_SERVICIO;

  /**
   * Datos de los servicios de mercancía.
   * Contiene la información mostrada en la tabla de mercancía.
   * @type {medioInfo[]}
   */
  medioTableDatos: medioInfo[] = [];

  /**
   * Contenido relacionado con el medio de transporte.
   * Contiene información sobre los elementos del medio de transporte.
   * @type {medioInfo[]}
   */
  medioContenido: medioInfo[] = [];

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Subject para manejar la desuscripción de observables.
   * Utilizado para evitar fugas de memoria.
   * @type {Subject<void>}
   */
  private destroyNotifier$ = new Subject<void>();

  /**
   * Estado de la sección actual.
   * Contiene información sobre el estado de la sección.
   * @type {SeccionLibState}
   */
  private seccion!: SeccionLibState;

  constructor(
    /**
     * @param {FormBuilder} fb - Servicio para la construcción y gestión de formularios reactivos.
     * @param {AcuicolaService} acuicolaService - Servicio para obtener y gestionar datos de acuicultura.
     * @param {MedioDeTransporteService} medioDeTransporteService - Servicio para obtener y gestionar datos del medio de transporte.
     * @param {ChangeDetectorRef} cdr - Servicio para detectar y optimizar cambios en la vista.
     * @param {TramiteStoreQuery} tramiteStoreQuery - Query de Akita para consultar el estado del trámite.
     * @param {TramiteStore} tramiteStore - Tienda Akita para manejar y actualizar el estado del trámite.
     * @param {SeccionLibQuery} seccionQuery - Query de Akita para consultar el estado de una sección específica.
     * @param {SeccionLibStore} seccionStore - Tienda Akita para manejar y actualizar el estado de una sección.
     * @param {ConsultaioQuery} consultaioQuery - Consulta Akita para manejar y actualizar el estado de una sección.
     */
    private readonly fb: FormBuilder,
    private readonly acuicolaService: AcuicolaService,
    private readonly medioDeTransporteService: MedioDeTransporteService,
    private cdr: ChangeDetectorRef,
    private tramiteStoreQuery: TramiteStoreQuery,
    private tramiteStore: TramiteStore,
    private seccionQuery: SeccionLibQuery,
    private seccionStore: SeccionLibStore,
    private consultaioQuery: ConsultaioQuery
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  /**
   * Inicializa el formulario reactivo con los campos requeridos.
   * Configura validaciones y deshabilita ciertos campos según sea necesario.
   *
   * @method inicializarFormulario
   * @returns {void}
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormulario();
    }
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.datosDeLaSolicitudForm.disable();
    } else {
      this.datosDeLaSolicitudForm.enable();
    }
  }

  /**
   * Inicializa el formulario reactivo con los campos requeridos.
   * Configura validaciones y deshabilita ciertos campos según sea necesario.
   *
   * @method inicializarFormulario
   * @returns {void}
   */
  inicializarFormulario(): void {
    this.tramiteStoreQuery.selectSolicitudTramite$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState.SolicitudState;
        })
      )
      .subscribe();

    /**
     * Inicializa el formulario reactivo con los campos requeridos.
     * Configura validaciones y deshabilita ciertos campos según sea necesario.
     *
     * @method iniciarFormulario
     * @returns {void}
     */

    this.datosDeLaSolicitudForm = this.fb.group({
      justificacion: [this.solicitudState.justificacion, Validators.required],
      certificadosAutorizados: [this.solicitudState.certificadosAutorizados, Validators.required],
      fechaInicio: [this.solicitudState.fechaInicio, Validators.required],
      horaDeInspeccion: [this.solicitudState.horaDeInspeccion, Validators.required],
      aduanaDeIngreso: [this.solicitudState.aduanaDeIngreso, Validators.required],
      oficinaDeInspeccion: [this.solicitudState.horaDeInspeccion, Validators.required],
      puntoDeInspeccion: [this.solicitudState.puntoDeInspeccion, Validators.required],
      nombreInspector: [this.solicitudState.nombreInspector, Validators.required],
      primerApellido: [this.solicitudState.primerApellido, Validators.required],
      segundoApellido: [this.solicitudState.segundoApellido, Validators.required],
      cantidadContenedores: [this.solicitudState.cantidadContenedores, Validators.required],
      tipoContenedor: [this.solicitudState.tipoContenedor, Validators.required],
      medioDeTransporte: [this.solicitudState.medioDeTransporte, Validators.required],
      identificacionTransporte: [this.solicitudState.identificacionTransporte, Validators.required],
      esSolicitudFerros: [{value: this.solicitudState.esSolicitudFerros, disabled: true}, Validators.required],
    });
  }

  /**
   * Inicializa el componente y obtiene los datos necesarios.
   * Se suscribe a los cambios en el estado y configura el formulario.
   *
   * @method ngOnInit
   * @returns {void}
   */
  ngOnInit(): void {
    this.tramiteStoreQuery.selectSolicitudTramite$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState.SolicitudState;
        })
      )
      .subscribe();
    this.inicializarEstadoFormulario();
    this.getHoraDeInspeccion();
    this.cargarDatos();
    this.getAduanaDeIngreso();
    this.getOficinaDeInspeccion();
    this.getPuntoDeInspeccion();
    this.getTipoContenedor();
    this.obtenerResponsableDatos();
    this.getMedioDeTransporte();
  

    /**
     * Se suscribe a los cambios en el estado del formulario.
     * Después de un breve retraso, actualiza el estado de la solicitud en el store.
     */
    this.tramiteStoreQuery.selectSolicitudTramite$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState: TramiteState) => {
          if (seccionState) {
            this.solicitudState = seccionState?.SolicitudState;
            this.datosDeLaSolicitudForm.patchValue(this.solicitudState);
          }
        })
      )
      .subscribe();
    /**
     * Se suscribe a los cambios en el estado del formulario.
     * Después de un breve retraso, actualiza el estado de la solicitud en el store.
     */
    this.datosDeLaSolicitudForm.statusChanges
      .pipe(
        takeUntil(this.destroyNotifier$),
        delay(10),
        tap(() => {
          const ACTIVE_STATE = { ...this.datosDeLaSolicitudForm.value };
          this.tramiteStore.setSolicitudTramite(ACTIVE_STATE);
        })
      )
      .subscribe();

    /**
     * Obtiene los datos iniciales requeridos para el componente.
     */
    this.obtenerDatos();

    /**
     * Se suscribe a los cambios en el estado de la sección.
     * Almacena la información de la sección en la propiedad `seccion`.
     * Para el botón de validación Continuar
     */
    this.seccionQuery.selectSeccionState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.seccion = seccionState;
        })
      )
      .subscribe();
  }

  /**
   * Obtiene datos del servicio de medio de transporte y actualiza el estado del componente.
   *
   * - La primera llamada obtiene `medioContenido` y actualiza `medioTableDatos`.
   * - La segunda llamada actualiza los valores del formulario con los datos recibidos.
   *
   * Se gestiona la suscripción con `takeUntil(this.destroyNotifier$)` para evitar fugas de memoria.
   *
   * @method obtenerDatos
   * @returns {void}
   */
  obtenerDatos(): void {
    this.medioDeTransporteService
      .getDatos()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (response: { medioContenido: medioInfo[] }) => {
          if (response && Array.isArray(response.medioContenido)) {
            this.medioTableDatos = response.medioContenido;
            this.cdr.detectChanges();
          }
        },
      });
    this.medioDeTransporteService
      .getDatos()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.datosDeLaSolicitudForm.patchValue(data);
      });
  }

  /**
   * Alterna el estado de la propiedad `colapsable`, mostrando u ocultando contenido colapsable.
   *
   * @method mostrarColapsable
   * @returns {void}
   */
  mostrarColapsable(): void {
    this.colapsable = !this.colapsable;
  }

  /**
   * Carga los datos de certificados autorizados y los establece en el formulario.
   *
   * @method cargarDatos
   * @returns {void}
   */
  cargarDatos(): void {
    this.acuicolaService
      .obtenerDatosCertificados()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data: DatosDelTramite) => {
        this.datosDeLaSolicitudForm.patchValue(data);
      });
  }

  /**
   * Obtiene la lista de horas de inspección desde el servicio y la almacena en `horaDeInspeccion`.
   *
   * @method getHoraDeInspeccion
   * @returns {void}
   */
  getHoraDeInspeccion(): void {
    this.acuicolaService
      .getHoraDeInspeccion()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp.code === 200) {
          const RESPONSE = resp.data;
          this.horaDeInspeccion = {
            labelNombre: 'Hora de inspección',
            required: false,
            primerOpcion: 'Selecciona un valor',
            catalogos: RESPONSE,
          };
        }
      });
  }

  /**
   * Obtiene la lista de aduanas de ingreso desde el servicio y la almacena en `aduanaDeIngreso`.
   *
   * @method getAduanaDeIngreso
   * @returns {void}
   */
  getAduanaDeIngreso(): void {
    this.acuicolaService
      .getAduanaDeIngreso()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp.code === 200) {
          const RESPONSE = resp.data;
          this.aduanaDeIngreso = {
            labelNombre: 'Aduana de ingreso',
            required: false,
            primerOpcion: 'Selecciona un valor',
            catalogos: RESPONSE,
          };
        }
      });
  }

  /**
   * Obtiene la lista de oficinas de inspección y la almacena en `oficinaDeInspeccion`.
   *
   * @method getOficinaDeInspeccion
   * @returns {void}
   */
  getOficinaDeInspeccion(): void {
    this.acuicolaService
      .getOficinaDeInspeccion()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp.code === 200) {
          const RESPONSE = resp.data;
          this.oficinaDeInspeccion = {
            labelNombre: 'Oficina de inspección de Sanidad Agropecuaria',
            required: false,
            primerOpcion: 'Selecciona un valor',
            catalogos: RESPONSE,
          };
        }
      });
  }

  /**
   * Obtiene la lista de puntos de inspección desde el servicio y la almacena en `puntoDeInspeccion`.
   *
   * @method getPuntoDeInspeccion
   * @returns {void}
   */
  getPuntoDeInspeccion(): void {
    this.acuicolaService
      .getPuntoDeInspeccion()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp.code === 200) {
          const RESPONSE = resp.data;
          this.puntoDeInspeccion = {
            labelNombre: 'Punto de inspección',
            required: false,
            primerOpcion: 'Selecciona un valor',
            catalogos: RESPONSE,
          };
        }
      });
  }

  /**
   * Obtiene la lista de tipos de contenedor desde el servicio y la almacena en `tipoContenedor`.
   *
   * @method getTipoContenedor
   * @returns {void}
   */
  getTipoContenedor(): void {
    this.acuicolaService
      .getTipoContenedor()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp.code === 200) {
          const RESPONSE = resp.data;
          this.tipoContenedor = {
            labelNombre: 'Tipo contenedor',
            required: false,
            primerOpcion: 'Selecciona un valor',
            catalogos: RESPONSE,
          };
        }
      });
  }

  /**
   * Obtiene la lista de medios de transporte desde el servicio y la almacena en `medioDeTransporte`.
   *
   * @method getMedioDeTransporte
   * @returns {void}
   */
  getMedioDeTransporte(): void {
    this.acuicolaService
      .getMedioDeTransporte()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp.code === 200) {
          const RESPONSE = resp.data;
          this.medioDeTransporte = {
            labelNombre: 'Medio de transporte',
            required: false,
            primerOpcion: 'Selecciona un valor',
            catalogos: RESPONSE,
          };
        }
      });
  }

  /**
   * Obtiene los datos del responsable de la inspección y los establece en el formulario.
   *
   * @method obtenerResponsableDatos
   * @returns {void}
   */
  obtenerResponsableDatos(): void {
    this.acuicolaService
      .obtenerResponsableDatos()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data: ResponsableInspección) => {
        this.datosDeLaSolicitudForm.patchValue(data);
      });
  }

  /**
   * Cambia el valor de la fecha de inicio en el formulario.
   * @param nuevo_valor El nuevo valor de la fecha de inicio.
   */
  public cambioFechaInicio(nuevo_valor: string): void {
    this.datosDeLaSolicitudForm.get('fechaInicio')?.setValue(nuevo_valor);
    this.datosDeLaSolicitudForm.get('fechaInicio')?.markAsUntouched();
  }

  /**
   * @method ngOnDestroy
   * @description Maneja la limpieza de recursos antes de destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
