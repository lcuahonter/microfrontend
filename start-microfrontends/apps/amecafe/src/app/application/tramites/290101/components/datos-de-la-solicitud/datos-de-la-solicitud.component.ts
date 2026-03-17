/**
 * Componente para la gestión de datos de solicitud del trámite 290101 - AMECAFE.
 * 
 * Este componente maneja la captura, validación y visualización de los datos de solicitud
 * relacionados con el trámite de exportación de café. Incluye funcionalidades para:
 * - Gestión de formularios reactivos con validaciones
 * - Manejo de tablas dinámicas para regiones, beneficios, bodegas y café de exportación
 * - Integración con stores de estado (Akita) para persistencia de datos
 * - Navegación entre diferentes secciones del trámite
 * - Modo de solo lectura para consulta de datos
 * 
 * @fileoverview Componente principal para los datos de solicitud del trámite 290101
 * @author Sistema VUCEM 3.0
 * @version 1.0.0
 * @since 2025
 */

import { ActivatedRoute } from '@angular/router';
import { BENEFICIOS_SERVICIO } from '../../modelos/cafe-exportadores.model';
import { BODEGAS_SERVICIO } from '../../modelos/cafe-exportadores.model';
import { BeneficiosInfo } from '../../modelos/cafe-exportadores.model';
import { BodegasInfo } from '../../modelos/cafe-exportadores.model';
import { CAFE_EXPORTADORES } from '../../modelos/cafe-exportadores.model';
import { CafeExporacionInfo } from '../../modelos/cafe-exportadores.model';
import { CatalogosService } from '../../servicios/catalogos.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConfiguracionColumna } from '@ng-mf/data-access-user';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DatosSolicitudFormaInt } from '../../modelos/datos-de-interfaz.model';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Input } from '@angular/core';
import { InputRadioComponent } from '@libs/shared/data-access-user/src';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { ProductoTablaServicios } from '../../servicios/regiones-compra.service';
import { REGIONES_SERVICIO } from '../../modelos/cafe-exportadores.model';
import { ReactiveFormsModule } from '@angular/forms';
import { RegionesInfo } from '../../modelos/cafe-exportadores.model';
import { Router } from '@angular/router';
import { SeccionLibQuery } from '@libs/shared/data-access-user/src';
import { SeccionLibState } from '@libs/shared/data-access-user/src';
import { SeccionLibStore } from '@libs/shared/data-access-user/src';
import { Subject } from 'rxjs';
import { Subscription } from 'rxjs';
import { TablaDinamicaComponent } from '@ng-mf/data-access-user';
import { TablaSeleccion } from '@ng-mf/data-access-user';
import { TituloComponent } from '@ng-mf/data-access-user';
import { TramiteState } from '../../estados/tramite290101.store';
import { TramiteStore } from '../../estados/tramite290101.store';
import { TramiteStoreQuery } from '../../estados/tramite290101.query';
import { Validators } from '@angular/forms';
import { delay } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators';
import { tap } from 'rxjs/operators';

/**
 * Componente Angular para la gestión de datos de solicitud del trámite 290101.
 * 
 * Este componente standalone implementa la funcionalidad completa para capturar,
 * validar y gestionar los datos de solicitud relacionados con el trámite de exportación de café.
 * Proporciona interfaces para el manejo de tablas dinámicas, formularios reactivos,
 * y navegación entre diferentes secciones del proceso de trámite.
 * 
 * @component
 * @implements {OnInit}
 * @implements {OnDestroy}
 * 
 * @example
 * ```html
 * <app-datos-de-la-solicitud 
 *   [esFormularioSoloLectura]="false">
 * </app-datos-de-la-solicitud>
 * ```
 */
@Component({
  selector: 'app-datos-de-la-solicitud',
  standalone: true,
  imports: [
    TituloComponent,
    CommonModule,
    ReactiveFormsModule,
    TablaDinamicaComponent,
    InputRadioComponent,
  ],
  templateUrl: './datos-de-la-solicitud.component.html',
  styleUrl: './datos-de-la-solicitud.component.scss'
})
export class DatosDeLaSolicitudComponent implements OnInit, OnDestroy {
  /**
   * Formulario principal para capturar los datos de la solicitud.
   * 
   * Contiene los campos principales para la gestión de la solicitud del trámite,
   * incluyendo validaciones y control de estado del formulario.
   * 
   * @type {FormGroup}
   * @memberof DatosDeLaSolicitudComponent
   */
  datosSolicitudForma!: FormGroup;

  /**
   * Estado actual de la solicitud basado en el modelo `DatosSolicitudFormaInt`.
   * 
   * Contiene la información manejada dentro del componente y representa
   * el estado completo de los datos de la solicitud en curso.
   * 
   * @type {DatosSolicitudFormaInt}
   * @memberof DatosDeLaSolicitudComponent
   */
  solicitudState!: DatosSolicitudFormaInt;

  /**
   * Indica si el formulario debe mostrarse solo en modo de lectura.
   * 
   * Cuando es `true`, deshabilita la edición de campos y solo permite
   * la visualización de datos. Utilizado para consultas o revisiones.
   * 
   * @type {boolean}
   * @memberof DatosDeLaSolicitudComponent
   */
 esFormularioSoloLectura!: boolean;

  /**
   * Opciones para el componente de radio buttons.
   * 
   * Contiene un arreglo de objetos con etiquetas y valores para las opciones
   * de selección única en los controles de radio button del formulario.
   * 
   * @type {Array<{ label: string; value: string }>}
   * @memberof DatosDeLaSolicitudComponent
   * @default []
   */
  radioOpcion: { label: string; value: string }[] = [];

  /**
   * Valor seleccionado en el radio button de exención de pago.
   * 
   * Almacena el valor actual seleccionado para determinar si el trámite
   * está exento de pago o no. Por defecto se establece como 'true'.
   * 
   * @type {string}
   * @memberof DatosDeLaSolicitudComponent
   * @default 'true'
   */
  valorSeleccionado: string = 'true';

  /**
   * Tipo de selección de la tabla utilizando un radio button.
   * 
   * Define el comportamiento de selección para tablas que requieren
   * selección única mediante radio buttons.
   * 
   * @type {TablaSeleccion}
   * @memberof DatosDeLaSolicitudComponent
   * @readonly
   */
  tablaSeleccionRadio: TablaSeleccion = TablaSeleccion.RADIO;

  /**
   * Tipo de selección de la tabla utilizando checkbox.
   * 
   * Define el comportamiento de selección para tablas que permiten
   * selección múltiple mediante checkboxes.
   * 
   * @type {TablaSeleccion}
   * @memberof DatosDeLaSolicitudComponent
   * @readonly
   */
  tablaSeleccionCheckbox: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * Configuración de las columnas de la tabla para la lista de regiones.
   * 
   * Define las propiedades y formato de las columnas en la tabla de regiones,
   * incluyendo tipos de datos, formato de visualización y configuraciones
   * específicas para cada columna de la tabla dinámica.
   * 
   * @type {ConfiguracionColumna<RegionesInfo>[]}
   * @memberof DatosDeLaSolicitudComponent
   * @readonly
   */
  regionesTabla: ConfiguracionColumna<RegionesInfo>[] = REGIONES_SERVICIO;

  /**
   * Datos procesados para la tabla de regiones.
   * 
   * Contiene la información de las regiones asociadas al trámite,
   * listos para su visualización en la interfaz de usuario.
   * Estos datos han sido procesados y formateados para su presentación.
   * 
   * @type {RegionesInfo[]}
   * @memberof DatosDeLaSolicitudComponent
   * @default []
   */
  regionesTableDatos: RegionesInfo[] = [];

  /**
   * Datos obtenidos desde la API relacionados con las regiones de compra.
   * 
   * Se almacenan antes de ser procesados para su presentación en la tabla.
   * Representan los datos en bruto obtenidos del servicio de backend.
   * 
   * @type {RegionesInfo[]}
   * @memberof DatosDeLaSolicitudComponent
   * @default []
   */
  regionesCompraApiDatos: RegionesInfo[] = [];

  /**
   * Configuración de las columnas de la tabla para la lista de beneficios.
   * 
   * Define las propiedades y formato de las columnas en la tabla de beneficios,
   * estableciendo la estructura de visualización y comportamiento de cada columna.
   * 
   * @type {ConfiguracionColumna<BeneficiosInfo>[]}
   * @memberof DatosDeLaSolicitudComponent
   * @readonly
   */
  beneficiosTabla: ConfiguracionColumna<BeneficiosInfo>[] = BENEFICIOS_SERVICIO;

  /**
   * Datos procesados para la tabla de beneficios.
   * 
   * Contiene la información de los beneficios asociados al trámite,
   * listos para su visualización en la interfaz de usuario después
   * del procesamiento y formateo correspondiente.
   * 
   * @type {BeneficiosInfo[]}
   * @memberof DatosDeLaSolicitudComponent
   * @default []
   */
  beneficiosTableDatos: BeneficiosInfo[] = [];

  /**
   * Datos obtenidos desde la API relacionados con los beneficios.
   * 
   * Se almacenan antes de ser procesados para su presentación en la tabla.
   * Contiene la información en bruto proveniente del servicio de backend.
   * 
   * @type {BeneficiosInfo[]}
   * @memberof DatosDeLaSolicitudComponent
   * @default []
   */
  beneficiosApiDatos: BeneficiosInfo[] = [];

  /**
   * Configuración de las columnas de la tabla para la lista de bodegas.
   * 
   * Define las propiedades y formato de las columnas en la tabla de bodegas,
   * incluyendo validaciones, tipos de datos y configuraciones de presentación.
   * 
   * @type {ConfiguracionColumna<BodegasInfo>[]}
   * @memberof DatosDeLaSolicitudComponent
   * @readonly
   */
  bodegasTabla: ConfiguracionColumna<BodegasInfo>[] = BODEGAS_SERVICIO;

  /**
   * Datos procesados para la tabla de bodegas.
   * 
   * Se utilizan para mostrar la información de bodegas en la interfaz de usuario
   * después de haber sido procesados y formateados apropiadamente.
   * 
   * @type {BodegasInfo[]}
   * @memberof DatosDeLaSolicitudComponent
   * @default []
   */
  bodegasTableDatos: BodegasInfo[] = [];

  /**
   * Datos obtenidos desde la API relacionados con las bodegas.
   * 
   * Se almacenan antes de ser procesados para su visualización en la tabla.
   * Representan la información cruda recibida del servicio de backend.
   * 
   * @type {BodegasInfo[]}
   * @memberof DatosDeLaSolicitudComponent
   * @default []
   */
  bodegasApiDatos: BodegasInfo[] = [];

  /**
   * Configuración de las columnas de la tabla para la lista de café de exportación.
   * 
   * Define las propiedades y formato de las columnas en la tabla de café de exportación,
   * estableciendo la estructura completa de visualización y comportamiento.
   * 
   * @type {ConfiguracionColumna<CafeExporacionInfo>[]}
   * @memberof DatosDeLaSolicitudComponent
   * @readonly
   */
  cafeExporacionTabla: ConfiguracionColumna<CafeExporacionInfo>[] = CAFE_EXPORTADORES;

  /**
   * Datos procesados para la tabla de exportación de café.
   * 
   * Se utiliza para mostrar la información de café de exportación en la interfaz
   * de usuario después del procesamiento y formateo correspondiente.
   * 
   * @type {CafeExporacionInfo[]}
   * @memberof DatosDeLaSolicitudComponent
   * @default []
   */
  cafeExporacionTableDatos: CafeExporacionInfo[] = [];

  /**
   * Datos obtenidos desde la API relacionados con la exportación de café.
   * 
   * Se almacenan antes de ser procesados para su visualización en la tabla.
   * Contiene la información original recibida del servicio de backend.
   * 
   * @type {CafeExporacionInfo[]}
   * @memberof DatosDeLaSolicitudComponent
   * @default []
   */
  cafeExportacionApiDatos: CafeExporacionInfo[] = [];

  /**
   * Suscripciones activas en el componente.
   * 
   * Almacena todas las suscripciones a observables para poder
   * gestionarlas y cancelarlas apropiadamente en la destrucción del componente.
   * 
   * @type {Subscription[]}
   * @memberof DatosDeLaSolicitudComponent
   * @private
   * @default []
   */
  private subscriptions: Subscription[] = [];

  /**
   * Estado de la sección actual.
   * 
   * Contiene información sobre el estado de la sección,
   * incluyendo configuraciones y datos de contexto relevantes.
   * 
   * @type {SeccionLibState}
   * @memberof DatosDeLaSolicitudComponent
   * @private
   */
  private seccion!: SeccionLibState;

  /**
   * Subject para notificar la destrucción del componente.
   * 
   * Utilizado para gestionar la limpieza de recursos y cancelar
   * suscripciones activas cuando el componente es destruido,
   * previniendo fugas de memoria.
   * 
   * @type {Subject<void>}
   * @memberof DatosDeLaSolicitudComponent
   * @private
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Datos seleccionados de la tabla de regiones.
   * 
   * Contiene la información de las regiones seleccionadas por el usuario
   * en la interfaz de tabla dinámica para su posterior procesamiento.
   * 
   * @type {RegionesInfo[]}
   * @memberof DatosDeLaSolicitudComponent
   * @default []
   */
  regionesSeleccionadas: RegionesInfo[] = [];

  /**
   * Datos seleccionados de la tabla de café de exportación.
   * 
   * Contiene la información de los cafés seleccionados por el usuario
   * para procesamiento en el trámite de exportación.
   * 
   * @type {CafeExporacionInfo[]}
   * @memberof DatosDeLaSolicitudComponent
   * @default []
   */
  cafeSeleccionado: CafeExporacionInfo[] = [];

  /**
   * Datos seleccionados de la tabla de beneficios.
   * 
   * Contiene la información de los beneficios seleccionados por el usuario
   * en la interfaz para su inclusión en el trámite.
   * 
   * @type {BeneficiosInfo[]}
   * @memberof DatosDeLaSolicitudComponent
   * @default []
   */
  beneficiosSeleccionados: BeneficiosInfo[] = [];

  /**
   * Datos seleccionados de la tabla de bodegas.
   * 
   * Contiene la información de las bodegas seleccionadas por el usuario
   * para su asociación con el trámite en proceso.
   * 
   * @type {BodegasInfo[]}
   * @memberof DatosDeLaSolicitudComponent
   * @default []
   */
  bodegasSeleccionadas: BodegasInfo[] = [];

  /**
   * Constructor de la clase DatosDeLaSolicitudComponent.
   * 
   * Inicializa todas las dependencias necesarias para el funcionamiento del componente,
   * incluyendo servicios de formularios, navegación, gestión de estado y catálogos.
   * También establece la suscripción inicial para detectar cambios en el estado de solo lectura.
   * 
   * @constructor
   * @param {FormBuilder} fb - Servicio para construir formularios reactivos de Angular
   * @param {ProductoTablaServicios} productoTablaServicios - Servicio para obtener los datos de las tablas dinámicas
   * @param {Router} router - Servicio de Angular para la navegación entre rutas
   * @param {TramiteStoreQuery} tramiteStoreQuery - Consulta Akita para manejar y obtener el estado del trámite
   * @param {TramiteStore} tramiteStore - Almacén Akita para gestionar el estado del trámite
   * @param {SeccionLibQuery} seccionQuery - Consulta Akita para manejar y obtener el estado de una sección
   * @param {SeccionLibStore} seccionStore - Almacén Akita para gestionar el estado de una sección
   * @param {CatalogosService} catalogosService - Servicio para interactuar con los catálogos de datos
   * @param {ActivatedRoute} activatedRoute - Servicio de Angular para acceder a información sobre la ruta activa
   * @param {ConsultaioQuery} consultaioQuery - Consulta Akita para manejar y actualizar el estado de una sección
   * 
   * @memberof DatosDeLaSolicitudComponent
   */
  constructor(
    private fb: FormBuilder,
    private productoTablaServicios: ProductoTablaServicios,
    private router: Router,
    private tramiteStoreQuery: TramiteStoreQuery,
    private tramiteStore: TramiteStore,
    private seccionQuery: SeccionLibQuery,
    private seccionStore: SeccionLibStore,
    private catalogosService: CatalogosService,
    private activatedRoute: ActivatedRoute,
    private consultaioQuery: ConsultaioQuery,
  ) {
      this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe()
   }
  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   * 
   * Determina el estado del formulario basado en el modo de solo lectura
   * y ejecuta la inicialización o carga de datos correspondiente.
   * También obtiene la información del catálogo de mercancía necesaria.
   * 
   * @method inicializarEstadoFormulario
   * @returns {void}
   * @memberof DatosDeLaSolicitudComponent
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
   * 
   * Inicializa el formulario y configura el estado de habilitación/deshabilitación
   * de los controles basado en el modo de solo lectura del formulario.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   * 
   * @method guardarDatosFormulario
   * @returns {void}
   * @memberof DatosDeLaSolicitudComponent
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.datosSolicitudForma.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.datosSolicitudForma.enable();
    } else {
      // No se requiere ninguna acción en el formulario
    }
  }

  /**
   * Inicializa el formulario y establece suscripciones a cambios de estado.
   * 
   * Crea una suscripción al estado de la solicitud del trámite para mantener
   * sincronizada la información del componente con el store global.
   * También configura el FormGroup principal con validaciones.
   * 
   * @method inicializarFormulario
   * @returns {void}
   * @memberof DatosDeLaSolicitudComponent
   */
  inicializarFormulario(): void {
    this.tramiteStoreQuery.selectSolicitudTramite$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState.SolicitudState;
        })
      )
      .subscribe()

  /**
   * Inicializa el formulario reactivo con los campos requeridos.
   * 
   * Configura validaciones y establece los valores por defecto para cada campo.
   * El formulario incluye campos para exención de pago, clave del padrón,
   * observaciones, requerimientos de inspección e información confidencial.
   * 
   * @method iniciarFormulario
   * @returns {void}
   * @memberof DatosDeLaSolicitudComponent
   * @private
   */

      this.datosSolicitudForma = this.fb.group({
        exentoDePago: [this.valorSeleccionado, Validators.required],
        claveDelPadron: [this.valorSeleccionado, Validators.required],
        observaciones: ['', Validators.required],
        requiereInspeccionInmediata: ['', Validators.required],
        informacionConfidencial: ['', Validators.required],
      });
  }

  /**
   * Redirige a la página de gestión de bodegas.
   * 
   * Navega a la ruta relativa '../bodegas' para permitir al usuario
   * gestionar los datos específicos de bodegas asociadas al trámite.
   * Utiliza navegación relativa a la ruta actual.
   * Limpia el estado del formulario de bodegas antes de navegar.
   * 
   * @method redirigirBodegas
   * @returns {void}
   * @memberof DatosDeLaSolicitudComponent
   */
  redirigirBodegas(): void {
    // Limpiar el estado del formulario de bodegas antes de navegar
    this.tramiteStore.clearBodegasTramite();
    
    this.router.navigate(['../bodegas'],
      {
        relativeTo: this.activatedRoute,
      });
  }

  /**
   * Redirige a la página de gestión de café de exportadores.
   * 
   * Navega a la ruta relativa '../cafe-de-exportadores' para permitir
   * al usuario gestionar los datos específicos de café de exportación.
   * Utiliza navegación relativa a la ruta actual.
   * Limpia el estado del formulario de café exportadores antes de navegar.
   * 
   * @method redirigirCafeExportadores
   * @returns {void}
   * @memberof DatosDeLaSolicitudComponent
   */
  redirigirCafeExportadores(): void {
    // Limpiar el estado del formulario de café exportadores antes de navegar
    this.tramiteStore.clearCafExportTramite();
    
    this.router.navigate(['../cafe-de-exportadores'],
      {
        relativeTo: this.activatedRoute,
      }
    );
  }

  /**
   * Redirige a la página de gestión de beneficios.
   * 
   * Navega a la ruta relativa '../beneficios' para permitir al usuario
   * gestionar los datos específicos de beneficios asociados al trámite.
   * Utiliza navegación relativa a la ruta actual.
   * 
   * @method redirigirBeneficios
   * @returns {void}
   * @memberof DatosDeLaSolicitudComponent
   */
  redirigirBeneficios(): void {
    this.tramiteStore.clearBeneficiosTramite();
    this.router.navigate(['../beneficios'],
      {
        relativeTo: this.activatedRoute,
      }
    );
  }

  /**
   * Redirige a la página de gestión de regiones.
   * 
   * Navega a la ruta relativa '../regiones' para permitir al usuario
   * gestionar los datos específicos de regiones de compra.
   * Utiliza navegación relativa a la ruta actual.
   * Limpia el estado del formulario de regiones antes de navegar.
   * 
   * @method redirigirRegiones
   * @returns {void}
   * @memberof DatosDeLaSolicitudComponent
   */
  redirigirRegiones(): void {
    // Limpiar el estado del formulario de regiones antes de navegar
    this.tramiteStore.clearRegionTramite();
    
    this.router.navigate(['../regiones'],
      {
        relativeTo: this.activatedRoute,
      });
  }

  /**
   * Método de inicialización del componente (Angular OnInit lifecycle hook).
   * 
   * Configura el formulario reactivo, establece suscripciones a observables,
   * carga los datos iniciales de las tablas y configura los listeners
   * para cambios en el formulario. También inicializa las opciones de radio
   * y gestiona el estado de validación del formulario.
   * 
   * Este método se ejecuta después de que Angular haya inicializado
   * todas las propiedades vinculadas por datos del componente.
   * 
   * @method ngOnInit
   * @returns {void}
   * @memberof DatosDeLaSolicitudComponent
   * @implements {OnInit}
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
    this.tramiteStoreQuery.selectSolicitudTramite$.pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState) => {
        this.solicitudState = seccionState.SolicitudState;
      })
    ).subscribe();

    this.radioOpcion = this.catalogosService.RadioOpcion;

    const EXENTO_DE_PAGO_SUBSCRIPTION = this.datosSolicitudForma.get('exentoDePago')?.valueChanges.subscribe((value) => {
      if (value === 'false' || this.esFormularioSoloLectura === true) {
        this.datosSolicitudForma.get('claveDelPadron')?.disable();
        this.datosSolicitudForma.patchValue({
          claveDelPadron: '',
        });
      } else {
        this.datosSolicitudForma.get('claveDelPadron')?.enable();
      }
    });

    if (EXENTO_DE_PAGO_SUBSCRIPTION) {
      this.subscriptions.push(EXENTO_DE_PAGO_SUBSCRIPTION);
    }

    /**
    * Se suscribe a los cambios en el estado de la solicitud de trámite.
    * Actualiza el formulario con los datos obtenidos del estado.
    */
    this.tramiteStoreQuery.selectSolicitudTramite$
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState: TramiteState) => {
        if (seccionState) {
          this.solicitudState = seccionState?.SolicitudState;
          this.datosSolicitudForma.patchValue(this.solicitudState);
        }
      })
    ).subscribe();
    /**
     * Se suscribe a los cambios en el estado del formulario.
     * Después de un breve retraso, actualiza el estado de la solicitud en el store.
     */
    this.datosSolicitudForma.statusChanges
    .pipe(
      takeUntil(this.destroyNotifier$),
      delay(10),
      tap(() => {
        const ACTIVE_STATE = { ...this.datosSolicitudForma.value };
        this.tramiteStore.setSolicitudTramite(ACTIVE_STATE);
      })
    )
    .subscribe();

    /**
     * Obtiene los datos iniciales requeridos para el componente.
     */
    this.buscarDatos();

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
   * Método para buscar y cargar los datos de las tablas desde servicios externos.
   * 
   * Realiza una llamada al servicio `productoTablaServicios` para obtener
   * los datos de regiones, beneficios, bodegas y café de exportación.
   * También sincroniza estos datos con el store de estado global y
   * maneja la lógica de persistencia de datos previamente cargados.
   * 
   * @method buscarDatos
   * @returns {void}
   * @memberof DatosDeLaSolicitudComponent
   * @private
   * 
   * @example
   * ```typescript
   * // Llamado internamente durante ngOnInit
   * this.buscarDatos();
   * ```
   */
  buscarDatos(): void {
    this.productoTablaServicios.obtenerDatos()
    .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (response: { regionesCompraApiDatos: RegionesInfo[]; beneficiosApiDatos: BeneficiosInfo[]; bodegasApiDatos: BodegasInfo[]; cafeExportacionApiDatos: CafeExporacionInfo[] }) => {
          if (response && Array.isArray(response.regionesCompraApiDatos) &&
            Array.isArray(response.beneficiosApiDatos) &&
            Array.isArray(response.bodegasApiDatos) &&
            Array.isArray(response.cafeExportacionApiDatos)) {
            this.regionesTableDatos = response.regionesCompraApiDatos;
            this.beneficiosTableDatos = response.beneficiosApiDatos;
            this.bodegasTableDatos = response.bodegasApiDatos;
            this.cafeExporacionTableDatos = response.cafeExportacionApiDatos;

          
            this.tramiteStoreQuery.selectSolicitudTramite$
            .pipe(
              takeUntil(this.destroyNotifier$),
              map((seccionState: TramiteState) => {
                if (seccionState) {
                  const REGIONES_DATOS= seccionState?.regionesTabla;
                if (REGIONES_DATOS.length > 0) {
                  this.regionesTableDatos = REGIONES_DATOS;
                  
                }
                else {
                  this.tramiteStore.setRegionesTabla(this.regionesTableDatos);
                }
              }
              })
            ).subscribe();
            this.tramiteStoreQuery.selectSolicitudTramite$
            .pipe(
              takeUntil(this.destroyNotifier$),
              map((seccionState: TramiteState) => {
                if (seccionState) {
                  const BENEFICIOS_DATOS= seccionState?.beneficiosTabla;
                if (BENEFICIOS_DATOS.length > 0) {
                  this.beneficiosTableDatos = BENEFICIOS_DATOS;
                  
                }
                else {
                  this.tramiteStore.setBeneficiosTabla(this.beneficiosTableDatos);
                }
              }
              })
            ).subscribe();
            this.tramiteStoreQuery.selectSolicitudTramite$
            .pipe(  
              takeUntil(this.destroyNotifier$),
              map((seccionState: TramiteState) => {
                if (seccionState) {
                  const BODEGAS_DATOS= seccionState?.bodegasTabla;
                if (BODEGAS_DATOS.length > 0) {
                  this.bodegasTableDatos = BODEGAS_DATOS;
                  
                }
                else {
                  this.tramiteStore.setBodegasTabla(this.bodegasTableDatos);
                }
              }
              })
            ).subscribe();
            this.tramiteStoreQuery.selectSolicitudTramite$

            .pipe(
              takeUntil(this.destroyNotifier$),
              map((seccionState: TramiteState) => {
                if (seccionState) {
                  const CAFE_EXPORTACION_DATOS= seccionState?.cafeExportacionTabla;
                if (CAFE_EXPORTACION_DATOS.length > 0) {
                  this.cafeExporacionTableDatos = CAFE_EXPORTACION_DATOS;
                  
                }
                else {
                  this.tramiteStore.setCafeExportacionTabla(this.cafeExporacionTableDatos);
                }
              }
              })
            ).subscribe();
          } 
        }
      });
  }
  /**
   * Método para borrar una región específica de la tabla.
   * 
   * Busca el índice de la región seleccionada en la tabla de regiones
   * usando el identificador único (TABLA_Columna_1) y la elimina del array.
   * Posteriormente actualiza el estado de la tabla en el store global.
   * 
   * @method borrarRegiones
   * @returns {void}
   * @memberof DatosDeLaSolicitudComponent
   * 
   * @requires regionesSeleccionadas - Debe tener al menos un elemento seleccionado
   * 
   * @example
   * ```typescript
   * // Después de seleccionar una región
   * this.seleccionarRegiones(region);
   * this.borrarRegiones(); // Elimina la región seleccionada
   * ```
   */
  borrarRegiones(): void {
    const INDICE = this.regionesTableDatos.findIndex((region) => region.TABLA_Columna_1 === this.regionesSeleccionadas[0].TABLA_Columna_1);
    if (INDICE !== -1) {
      this.regionesTableDatos.splice(INDICE, 1);
      this.tramiteStore.updateRegionesTabla(this.regionesTableDatos);
    }

  }

  /**
   * Método para seleccionar una región específica.
   * 
   * Recibe un objeto `RegionesInfo` y lo asigna a la propiedad `regionesSeleccionadas`
   * como un array con un solo elemento (clonado para evitar referencias directas).
   * Esta selección se utiliza posteriormente para operaciones de borrado o edición.
   * 
   * @method seleccionarRegiones
   * @param {RegionesInfo} regionesSeleccionadas - Objeto que contiene la información de la región seleccionada
   * @returns {void}
   * @memberof DatosDeLaSolicitudComponent
   * 
   * @example
   * ```typescript
   * const region: RegionesInfo = { TABLA_Columna_1: '001', nombre: 'Región Norte' };
   * this.seleccionarRegiones(region);
   * ```
   */
   seleccionarRegiones(regionesSeleccionadas: RegionesInfo): void {
    this.regionesSeleccionadas = [{...regionesSeleccionadas}];
   }
  /**
   * Método para borrar un beneficio específico de la tabla.
   * 
   * Busca el índice del beneficio seleccionado en la tabla de beneficios
   * usando el identificador único (TABLA_Columna_1) y lo elimina del array.
   * Posteriormente actualiza el estado de la tabla en el store global.
   * 
   * @method borrarBeneficios
   * @returns {void}
   * @memberof DatosDeLaSolicitudComponent
   * 
   * @requires beneficiosSeleccionados - Debe tener al menos un elemento seleccionado
   */
  borrarBeneficios(): void {
    const INDICE = this.beneficiosTableDatos.findIndex((beneficio) => beneficio.TABLA_Columna_1 === this.beneficiosSeleccionados[0].TABLA_Columna_1);
    if (INDICE !== -1) {
      this.beneficiosTableDatos.splice(INDICE, 1);
      this.tramiteStore.updateBeneficiosTabla(this.beneficiosTableDatos);
    }
  }

  /**
   * Método para seleccionar un beneficio específico.
   * 
   * Recibe un objeto `BeneficiosInfo` y lo asigna a la propiedad `beneficiosSeleccionados`
   * como un array con un solo elemento (clonado para evitar referencias directas).
   * 
   * @method seleccionarBeneficios
   * @param {BeneficiosInfo} beneficiosSeleccionados - Objeto que contiene la información del beneficio seleccionado
   * @returns {void}
   * @memberof DatosDeLaSolicitudComponent
   */
  seleccionarBeneficios(beneficiosSeleccionados: BeneficiosInfo): void {
    this.beneficiosSeleccionados = [{...beneficiosSeleccionados}];
  }
  /**
   * Método para borrar una bodega específica de la tabla.
   * 
   * Busca el índice de la bodega seleccionada en la tabla de bodegas
   * usando el identificador único (TABLA_Columna_1) y la elimina del array.
   * Posteriormente actualiza el estado de la tabla en el store global.
   * 
   * @method borrarBodegas
   * @returns {void}
   * @memberof DatosDeLaSolicitudComponent
   * 
   * @requires bodegasSeleccionadas - Debe tener al menos un elemento seleccionado
   */
  borrarBodegas(): void {
    const INDICE = this.bodegasTableDatos.findIndex((bodega) => bodega.TABLA_Columna_1 === this.bodegasSeleccionadas[0].TABLA_Columna_1);
    if (INDICE !== -1) {
      this.bodegasTableDatos.splice(INDICE, 1);
      this.tramiteStore.updateBodegasTabla(this.bodegasTableDatos);
    }
  }
 
  /**
   * Método para seleccionar una bodega específica.
   * 
   * Recibe un objeto `BodegasInfo` y lo asigna a la propiedad `bodegasSeleccionadas`
   * como un array con un solo elemento (clonado para evitar referencias directas).
   * 
   * @method seleccionarBodega
   * @param {BodegasInfo} bodegaSeleccionada - Objeto que contiene la información de la bodega seleccionada
   * @returns {void}
   * @memberof DatosDeLaSolicitudComponent
   */
  seleccionarBodega(bodegaSeleccionada: BodegasInfo): void {
    this.bodegasSeleccionadas = [{...bodegaSeleccionada}];
  }

  /**
   * Método para borrar un registro de café de exportación de la tabla.
   * 
   * Elimina un registro de la tabla de datos de exportación de café basado
   * en el elemento seleccionado. Busca el índice del registro seleccionado
   * en la tabla usando el identificador único (TABLA_Columna_1) y, si existe,
   * lo elimina y actualiza el estado correspondiente en el store.
   * 
   * @method borrarCafe
   * @returns {void}
   * @memberof DatosDeLaSolicitudComponent
   * 
   * @requires cafeSeleccionado - Debe tener al menos un elemento seleccionado
   * 
   * @example
   * ```typescript
   * // Después de seleccionar un café
   * this.seleccionarCafe(cafe);
   * this.borrarCafe(); // Elimina el café seleccionado
   * ```
   */
   borrarCafe(): void {
    const INDICE = this.cafeExporacionTableDatos.findIndex((cafe) => cafe.TABLA_Columna_1 === this.cafeSeleccionado[0].TABLA_Columna_1);
    if (INDICE !== -1) {
      this.cafeExporacionTableDatos.splice(INDICE, 1);
      this.tramiteStore.updateCafeExportacionTabla(this.cafeExporacionTableDatos);
    }
  }

  /**
   * Método para seleccionar un café específico.
   * 
   * Recibe un objeto `CafeExporacionInfo` y lo asigna a la propiedad `cafeSeleccionado`
   * como un array con un solo elemento (clonado para evitar referencias directas).
   * 
   * @method seleccionarCafe
   * @param {CafeExporacionInfo} cafeSeleccionado - Objeto que contiene la información del café seleccionado
   * @returns {void}
   * @memberof DatosDeLaSolicitudComponent
   */
  seleccionarCafe(cafeSeleccionado: CafeExporacionInfo): void {
    this.cafeSeleccionado = [{...cafeSeleccionado}];
  }

  /**
   * Hook del ciclo de vida que se llama cuando el componente es destruido.
   * 
   * Garantiza la limpieza adecuada emitiendo un valor al subject `destroyNotifier$`
   * y completándolo para liberar recursos y prevenir fugas de memoria.
   * Todas las suscripciones que utilizan `takeUntil(this.destroyNotifier$)`
   * serán automáticamente canceladas.
   * 
   * @method ngOnDestroy
   * @returns {void}
   * @memberof DatosDeLaSolicitudComponent
   * @implements {OnDestroy}
   * 
   * @example
   * ```typescript
   * // Angular llama automáticamente este método cuando el componente se destruye
   * // No es necesario llamarlo manualmente
   * ```
   */
    ngOnDestroy(): void {
      this.destroyNotifier$.next();
      this.destroyNotifier$.complete();
    }
}
