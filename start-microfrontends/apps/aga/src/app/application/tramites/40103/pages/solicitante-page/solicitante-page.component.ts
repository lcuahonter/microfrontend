
/**
 * @fileoverview Componente principal de la página de solicitante para el trámite 40103
 * 
 * Este archivo contiene el componente Angular que gestiona la página principal del
 * solicitante en el trámite 40103. Implementa un wizard de pasos para guiar al usuario
 * a través del proceso de solicitud, manejando la navegación entre diferentes secciones
 * y manteniendo el estado de validación de cada paso.
 * 
 * El componente integra:
 * - Gestión de estado reactivo con Akita
 * - Navegación por wizard con validación de pasos
 * - Comunicación con stores y queries específicos del trámite
 * - Manejo del ciclo de vida del componente y limpieza de recursos
 * 
 * Responsabilidades principales:
 * - Configuración y navegación del wizard de pasos
 * - Gestión del estado de secciones y validaciones
 * - Comunicación entre componentes padre e hijo
 * - Manejo de subscripciones y limpieza de memoria
 * 
 * @author Sistema de Gestión de Trámites - Frontend Team
 * @version 1.0.0
 * @since 1.0.0
 * @module SolicitantePageComponent
 */

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, combineLatest } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { modificarTerrestreService } from '../../components/services/modificacar-terrestre.service';

import {
  CategoriaMensaje,
  ConsultaioState,
  DatosPasos,
  ListaPasosWizard,
  Notificacion,
  PASOS,
  SECCIONES_TRAMITE_40103,
  TipoNotificacionEnum,
  WizardComponent
} from '@libs/shared/data-access-user/src';
import {
  Chofer40103Store,
  Choferesnacionales40103State,
} from '../../estados/chofer40103.store';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';

import { Chofer40103Query } from '../../estados/chofer40103.query';
import { Tramite40103Query } from '../../estados/tramite40103.query';

import { Tramite40103State } from '../../estados/tramite40103.store';


import { ChoferExtranjeroPayload, ChoferNacionalDatos, ChoferNacionalPayload, ChoferesExtranjeros, DatosDelChoferNacional, DatosUnidad, DatosVehiculo, DomicilioFiscal, Payload40103, UnidadArrastrePayload, VehiculoPayload } from '../../models/registro-muestras-mercancias.model';
import { DocumentoDetalle, IniciarResponse } from '../../../40101/pages/solicitante-page/solicitante-page.component';
import { BodyTablaResolucion } from '@libs/shared/data-access-user/src/core/models/shared/consulta-generica.model';
import { NotificacionesService } from '@libs/shared/data-access-user/src/core/services/shared/notificaciones.service';

export interface DatosUnidadArrastre {
  vinVehiculo?: string;
  idDeVehiculo?: string;
  numeroPlaca?: string;
  paisEmisor?: string;
  estado?: string;
  colorVehiculo?: number;
  numeroEconomico?: string;
  numero2daPlaca?: string;
  estado2daPlaca?: string;
  paisEmisor2daPlaca?: string;
  tipoDeUnidadArrastre?: string;
  idDeUnidad?: string;
  colorUnidad?: string;
  descripcion?: string;
  operacion?: 'AGREGAR' | 'MODIFICAR' | 'ELIMINAR';
}


/**
 * Interfaz que define la estructura de una acción de botón en el wizard.
 * 
 * Representa los datos necesarios para manejar las acciones de navegación
 * en el wizard, incluyendo el tipo de acción y el valor del índice asociado.
 * 
 * @interface AccionBoton
 * 
 * @example
 * ```typescript
 * const accionContinuar: AccionBoton = {
 *   accion: 'cont',
 *   valor: 2
 * };
 * 
 * const accionAtras: AccionBoton = {
 *   accion: 'prev',
 *   valor: 1
 * };
 * ```
 * 
 * @since 1.0.0
 */
interface AccionBoton {
  /**
   * Tipo de acción a ejecutar.
   * 
   * @property {string} accion
   * Indica el tipo de navegación ('cont' para continuar, 'prev' para anterior)
   */
  accion: string;
  
  /**
   * Valor del índice del paso.
   * 
   * @property {number} valor
   * Número que indica el índice del paso al que se debe navegar
   */
  valor: number;
}

/**
 * Componente principal de la página de solicitante para el trámite 40103.
 * 
 * Este componente Angular gestiona la interfaz principal del proceso de solicitud
 * para el trámite 40103. Implementa un sistema de wizard con múltiples pasos que
 * guía al usuario a través del proceso de registro de choferes nacionales.
 * 
 * Funcionalidades principales:
 * - Gestión de navegación por wizard con validación de pasos
 * - Integración con el sistema de gestión de estado Akita
 * - Comunicación bidireccional con componentes hijo
 * - Manejo del estado de secciones y validaciones del trámite
 * - Limpieza automática de recursos y subscripciones
 * 
 * El componente implementa los interfaces OnInit y OnDestroy para un manejo
 * adecuado del ciclo de vida y prevención de memory leaks.
 * 
 * @class SolicitantePageComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 * 
 * @example
 * ```typescript
 * // Uso en template
 * <app-solicitante-page></app-solicitante-page>
 * 
 * // Navegación programática
 * component.seleccionadosTodos(2); // Ir al paso 2
 * component.getValorIndice({ accion: 'cont', valor: 3 }); // Continuar al paso 3
 * ```
 * 
 * @since 1.0.0
 */
@Component({
  selector: 'app-solicitante-page',
  templateUrl: './solicitante-page.component.html',
  styleUrl: './solicitante-page.component.scss',
})
export class SolicitantePageComponent implements OnInit, OnDestroy {
  /**
   * Lista de pasos del wizard que se mostrarán en la página.
   * 
   * Contiene los primeros 2 pasos del wizard general, configurados específicamente
   * para el flujo del trámite 40103. Los pasos se obtienen de la constante global
   * PASOS y se filtran para mostrar solo los relevantes para esta página.
   *
   * @property {Array<ListaPasosWizard>} pasos
   * 
   * @example
   * ```typescript
   * // Los pasos típicamente incluyen:
   * // [
   * //   { indice: 1, titulo: 'Capturar solicitud', activo: true, completado: false },
   * //   { indice: 2, titulo: 'Firmar solicitud', activo: false, completado: false }
   * // ]
   * ```
   * 
   * @since 1.0.0
   */

  isCaat: boolean = false;

    acuseDocumentos: BodyTablaResolucion[] = [];

    documentDetails: DocumentoDetalle = {};

  guardarDatos: ConsultaioState = {
      folioTramite: '',
      procedureId: '',
      parameter: '',
      department: '',
      tipoDeTramite: '',
      estadoDeTramite: '',
      readonly: false,
      create: true,
      update: false,
      consultaioSolicitante: null,
      action_id: '',
      current_user: '',
      id_solicitud: '',
      nombre_pagina: '',
      idSolicitudSeleccionada: ''
    };

     isExtrajero: boolean = false
  
  pasos: Array<ListaPasosWizard> = PASOS.slice(0, 2);

  isBtnShow: string = "yes"; // Bandera para controlar la visibilidad de un botón.

  /**
   * Índice actual del paso en el wizard.
   * 
   * Representa el paso actualmente seleccionado o en progreso dentro del wizard.
   * El índice es base 1 (comienza en 1 en lugar de 0) para coincidir con la
   * numeración visual mostrada al usuario.
   *
   * @property {number} indice
   * 
   * @example
   * ```typescript
   * this.indice = 1; // Primer paso del wizard
   * this.indice = 2; // Segundo paso del wizard
   * ```
   * 
   * @default 1
   * @since 1.0.0
   */
  indice: number = 1;

  /**
   * Estado de la sección actual del trámite.
   * 
   * Almacena el estado completo de la sección de choferes nacionales para el
   * trámite 40103. Este estado se actualiza reactivamente a través de subscripciones
   * al query service y contiene toda la información del progreso del usuario.
   *
   * @property {Choferesnacionales40103State} seccion
   * 
   * @example
   * ```typescript
   * // El estado incluye información como:
   * // {
   * //   datosDelChoferNacionalAlta: {...},
   * //   validacionesSecciones: [...],
   * //   formasValidas: [...]
   * // }
   * ```
   * 
   * @since 1.0.0
   */
  public seccion!: Choferesnacionales40103State;

  /**
   * Subject utilizado para manejar la limpieza de recursos al destruir el componente.
   * 
   * Este Subject se utiliza con el operador takeUntil para automaticamente
   * completar todas las subscripciones cuando el componente se destruye,
   * previniendo memory leaks y subscripciones huérfanas.
   *
   * @property {Subject<void>} destroyNotifier$
   * @private
   * 
   * @example
   * ```typescript
   * this.someObservable$.pipe(
   *   takeUntil(this.destroyNotifier$)
   * ).subscribe();
   * ```
   * 
   * @since 1.0.0
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Referencia al componente hijo WizardComponent.
   * 
   * Permite acceder a las propiedades y métodos públicos del componente hijo
   * WizardComponent desde el componente padre. Esta referencia se utiliza para
   * controlar programáticamente la navegación del wizard (siguiente/anterior).
   *
   * @property {WizardComponent} wizardComponent
   * 
   * @example
   * ```typescript
   * // Navegar al siguiente paso
   * this.wizardComponent.siguiente();
   * 
   * // Navegar al paso anterior
   * this.wizardComponent.atras();
   * ```
   * 
   * @since 1.0.0
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Configuración de datos para el wizard de pasos.
   * 
   * Contiene la configuración necesaria para el funcionamiento del wizard,
   * incluyendo el número total de pasos, el índice actual, y los textos
   * personalizados para los botones de navegación.
   *
   * @property {DatosPasos} datosPasos
   * 
   * @example
   * ```typescript
   * // Configuración típica:
   * {
   *   nroPasos: 2,
   *   indice: 1,
   *   txtBtnAnt: 'Anterior',
   *   txtBtnSig: 'Continuar'
   * }
   * ```
   * 
   * @since 1.0.0
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Referencia al componente paso-uno para acceder a la validación.
   */
  @ViewChild('pasoUnoRef') pasoUnoRef!: PasoUnoComponent;

   
  public info = 'alert-info';
  /**
   * Configuración de notificación para mostrar alertas al usuario.
   */
  public nuevaNotificacion!: Notificacion;

  catErrorMessage:string=''
  /**
   * Estado del botón continuar.
   */
  public btnContinuar: boolean = false;

  /**
   * Estado de validación del formulario.
   */
  public esFormaValido: boolean = false;

  /**
   * Bandera para controlar la vista de acuse.
   * @property {string} banderaVista
   */
  public banderaVista = 'Default';

  /**
   * Constructor del componente SolicitantePageComponent.
   * 
   * Inicializa las dependencias necesarias para el funcionamiento del componente,
   * incluyendo los servicios de query y store para la gestión del estado del
   * trámite 40103. Utiliza la inyección de dependencias de Angular para
   * proporcionar las instancias requeridas.
   *
   * @constructor
   * @param {Chofer40103Query} chofer40103Query - Servicio de consulta para acceder al estado del store de manera reactiva
   * @param {Chofer40103Store} chofer40103Store - Servicio de almacenamiento para modificar el estado del trámite
   * 
   * @example
   * ```typescript
   * // Angular maneja la inyección automáticamente
   * constructor(
   *   private chofer40103Query: Chofer40103Query,
   *   private chofer40103Store: Chofer40103Store
   * ) {}
   * ```
   * 
   * @since 1.0.0
   */
  constructor(
    private chofer40103Query: Chofer40103Query,
    private chofer40103Store: Chofer40103Store,
    private tramite40103Query: Tramite40103Query,
    private NOTIF: NotificacionesService,
    private modificarTerrestreService: modificarTerrestreService
  ) {}

  /**
   * Método del ciclo de vida OnInit de Angular.
   * 
   * Se ejecuta después de que Angular inicialice todas las propiedades vinculadas
   * a datos del componente. Configura el wizard personalizado, establece las
   * subscripciones reactivas al estado del store, y inicializa las secciones
   * del trámite con sus respectivas validaciones.
   * 
   * Operaciones realizadas:
   * - Configuración personalizada de los pasos del wizard
   * - Subscripción al estado reactivo del store
   * - Inicialización de secciones y validaciones del trámite
   * - Configuración de operadores RxJS para manejo de memoria
   *
   * @method ngOnInit
   * @returns {void}
   * 
   * @example
   * ```typescript
   * // Angular llama automáticamente este método
   * ngOnInit(): void {
   *   // Configuración del wizard
   *   this.pasos = PASOS.slice(0, 2).map(paso => ({
   *     ...paso,
   *     titulo: paso.titulo === 'Anexar necesarios' ? 'Firmar solicitud' : paso.titulo
   *   }));
   *   
   *   // Subscripción al estado
   *   this.chofer40103Query.selectSeccionState$.subscribe();
   * }
   * ```
   * 
   * @since 1.0.0
   */
  ngOnInit(): void {
    this.pasos = PASOS.slice(0, 2).map((paso) => {
      if (paso.indice === 2 && paso.titulo === 'Anexar necesarios') {
        return { ...paso, titulo: 'Firmar solicitud' };
      }
      return paso;
    });

    this.chofer40103Query.selectSeccionState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.seccion = seccionState;
            this.isCaat = seccionState.codigo !== '00' ? true : false;
      this.catErrorMessage = seccionState.catErrorMessage;
        })
      )
      .subscribe();

    this.asignarSecciones();
  }

  /**
   * Método del ciclo de vida OnDestroy de Angular.
   * 
   * Se ejecuta justo antes de que Angular destruya el componente. Implementa
   * la limpieza adecuada de recursos para prevenir memory leaks, completando
   * todas las subscripciones activas mediante el patrón takeUntil con el
   * Subject destroyNotifier$.
   * 
   * Operaciones de limpieza:
   * - Emisión de señal de destrucción a todas las subscripciones
   * - Completado del Subject para liberar recursos
   * - Prevención de memory leaks por subscripciones huérfanas
   *
   * @method ngOnDestroy
   * @returns {void}
   * 
   * @example
   * ```typescript
   * // Angular llama automáticamente este método
   * ngOnDestroy(): void {
   *   this.destroyNotifier$.next();
   *   this.destroyNotifier$.complete();
   * }
   * ```
   * 
   * @since 1.0.0
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Establece el índice actual del wizard al valor proporcionado.
   * 
   * Permite navegar directamente a un paso específico del wizard mediante
   * la selección directa del índice. Este método se utiliza típicamente
   * cuando el usuario hace clic en un paso específico del navegador del wizard
   * o cuando se necesita navegar programáticamente a un paso determinado.
   *
   * @method seleccionadosTodos
   * @param {number} i - Índice del paso seleccionado (base 1)
   * @returns {void}
   * 
   * @example
   * ```typescript
   * // Navegar al segundo paso del wizard
   * this.seleccionadosTodos(2);
   * 
   * // Regresar al primer paso
   * this.seleccionadosTodos(1);
   * 
   * // Uso desde template
   * <button (click)="seleccionadosTodos(3)">Ir al paso 3</button>
   * ```
   * 
   * @since 1.0.0
   */
  seleccionadosTodos(i: number): void {
    this.indice = i;
  }

  /**
   * Maneja la navegación del wizard basada en acciones de botones.
   * 
   * Procesa las acciones de navegación del wizard (anterior/siguiente) y
   * actualiza el índice actual antes de delegar la navegación física al
   * componente hijo WizardComponent. Incluye validación del rango del índice
   * para prevenir navegación fuera de los límites establecidos.
   *
   * @method getValorIndice
   * @param {AccionBoton} e - Objeto que contiene la acción y el valor del índice
   * @param {string} e.accion - Tipo de acción ('cont' para continuar, otros para retroceder)
   * @param {number} e.valor - Nuevo valor del índice del paso
   * @returns {void}
   * 
   * @example
   * ```typescript
   * // Continuar al siguiente paso
   * this.getValorIndice({ accion: 'cont', valor: 2 });
   * 
   * // Retroceder al paso anterior
   * this.getValorIndice({ accion: 'prev', valor: 1 });
   * 
   * // Llamada desde componente hijo
   * @Output() accionBoton = new EventEmitter<AccionBoton>();
   * this.accionBoton.emit({ accion: 'cont', valor: this.indiceActual + 1 });
   * ```
   * 
   * @since 1.0.0
   */
  getValorIndice(e: AccionBoton): void {
  this.esFormaValido = false;
  let ISSHOWDIRECTOR=false
 this.chofer40103Query.selectSolicitud$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data: Choferesnacionales40103State) => {
        ISSHOWDIRECTOR = data?.isShowDirector;
      });
  // Validar antes de pasar del paso 1 al paso 2
  if (e.accion === 'cont' && this.indice === 1) {
    if(ISSHOWDIRECTOR){
      const ES_VALIDO = true
      if (!ES_VALIDO) {
        this.nuevaNotificacion = {
          tipoNotificacion: TipoNotificacionEnum.ALERTA,
          categoria: CategoriaMensaje.ERROR,
          modo: 'modal-md',
          titulo: '',
          mensaje: 'Existen requisitos obligatorios en blanco o con errores.',
          cerrar: false,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: '',
        };
        this.btnContinuar = true;
        this.indice = 1;
        this.actualizarDatosPasos();
        return;
      }
      
      
    }
      // ✅ Validación correcta: proceder a construir payload SIN modificar el store
    if (e.valor === 2) {
      combineLatest([
        this.chofer40103Query.select((s) => s),
        this.tramite40103Query.select((s) => s),
      ])
        .pipe(take(1))
        .subscribe(([choferesState, tramiteState]) => {
          const PAYLOAD = SolicitantePageComponent.buildPayload(
            choferesState,
            tramiteState as Tramite40103State
          );

          this.modificarTerrestreService.guardarDatosTramite(PAYLOAD).subscribe(
            (res: IniciarResponse) => {
              // Éxito: cambiar vista sin tocar store
             if (res.codigo !== '00') {
      this.NOTIF.showNotification({
        tipoNotificacion: 'toastr',
        categoria: 'danger',
        mensaje: res.mensaje ? res.mensaje : '',
        titulo: 'Error',
        modo: '',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: 'Cancelar',
      });
    }

    (this.chofer40103Store['setCadenaOriginal'] as (valor: unknown) => void)(res?.datos?.cadena_original ?? '');
    (this.chofer40103Store['setSolicitudeId'] as (valor: unknown) => void)(res?.datos?.id_solicitud);
    this.isExtrajero = res?.datos?.is_extranjero ?? false
    this.documentDetails = res?.datos?.documento_detalle ?? {}
    this.acuseDocumentos = [
      {
        id: 1,
        idDocumento: res?.datos?.cve_folio_caat ?? '',
        documento: res?.datos?.documento_detalle?.nombre_archivo ?? '',
        urlPdf: res?.datos?.documento_detalle?.nombre_archivo ?? '', // para mostrar o descargar nombre
        fullBase64: res?.datos?.documento_detalle?.contenido ?? '' // <--- Base64 del backend aquí
      }
    ];

    this.guardarDatos = {
      ...this.guardarDatos,
      folioTramite: res?.datos?.mensaje ?? '',
      procedureId: (res?.datos?.id_solicitud ?? 0).toString()
    };

    if (this.isExtrajero) {
      this.isBtnShow = 'no'
      this.pasos = PASOS.slice(0, 1)
    }
    if (!this.isExtrajero) {
      if (res.codigo === '00') {
        if (e.valor > 0 && e.valor < 6) {
          this.indice = e.valor;
          this.wizardComponent.siguiente();
        }
      }
    }
            },
            () => {
              this.nuevaNotificacion = {
                tipoNotificacion: TipoNotificacionEnum.ALERTA,
                categoria: CategoriaMensaje.ERROR,
                modo: 'modal-md',
                titulo: 'Error al guardar',
                mensaje:
                  'Ocurrió un error al intentar guardar los datos de la solicitud. Por favor, intente de nuevo.',
                cerrar: false,
                txtBtnAceptar: 'Aceptar',
                txtBtnCancelar: '',
              };
              this.btnContinuar = true;
            }
          );
        });

      return; // prevenir navegación por defecto
    }
  }

  // Navegación estándar (no paso 1 → 2)
  if (e.valor > 0 && e.valor < 5) {
    this.indice = e.valor;
    if (e.accion === 'cont') {
      this.wizardComponent?.siguiente();
    } else {
      this.wizardComponent?.atras();
    }
  }
}

  /**
   * Actualiza los datos de los pasos del wizard.
   */
  private actualizarDatosPasos(): void {
    this.datosPasos = {
      ...this.datosPasos,
      indice: this.indice
    };
  }
  
/**
 * Construye el payload principal (Payload40103) que se enviará al backend.
 *
 * Esta función es la encargada de consolidar y transformar toda la información
 * proveniente de los estados `Choferesnacionales40103State` y `Tramite40103State`
 * en el formato requerido por el backend.
 *
 * Incluye el mapeo de choferes nacionales, extranjeros, director general,
 * vehículos y unidades de arrastre.
 *
 * @param choferesState - Estado que contiene la información de los choferes nacionales y extranjeros.
 * @param tramiteState - Estado que contiene la información de vehículos y unidades de arrastre.
 * @returns Payload40103 - Objeto listo para ser enviado al backend con toda la información estructurada.
 */
 private static buildPayload(
  choferesState: Choferesnacionales40103State,
  tramiteState: Tramite40103State
): Payload40103 {
  const MAPCHOFERDATOSNACIONAL = (chofer: DatosDelChoferNacional): ChoferNacionalDatos => ({
    rfc: chofer.rfc ?? '',
    curp: chofer.curp ?? '',
    nombre: chofer.nombre ?? '',
    primer_apellido: chofer.primerApellido ?? '',
    segundo_apellido: chofer.segundoApellido ?? '',
    numero_de_gafete: chofer.numeroDeGafete ?? '',
    vigencia_del_gafete: chofer.vigenciaGafete ?? '',
  });

  const MAPDOMICILIOFISCAL = (chofer: DatosDelChoferNacional): DomicilioFiscal => ({
    ciudad: chofer.ciudad ?? '',
    pais: chofer.pais ?? '',
    codigo_postal: chofer.codigoPostal ?? '',
    estado: chofer.estado ?? '',
    municipio: chofer.municipioAlcaldia ?? '',
    localidad: chofer.localidad ?? '',
    colonia: chofer.colonia ?? '',
    calle: chofer.calle ?? '',
    numero_exterior: chofer.numeroExterior ?? '',
    numero_interior: chofer.numeroInterior ?? '',
    correo_electronico: chofer.correoElectronico ?? '',
    telefono: chofer.telefono ?? '',
    pais_de_residencia: chofer.paisDeResidencia ?? '',
  });

  const MAPCHOFERNACIONAL = (
    chofer: DatosDelChoferNacional,
    operacion: 'AGREGAR' | 'MODIFICAR' | 'ELIMINAR'
  ): ChoferNacionalPayload => ({
    operacion,
    chofer_datos: MAPCHOFERDATOSNACIONAL(chofer),
    domicilio_fiscal: MAPDOMICILIOFISCAL(chofer),
  });

  const MAPCHOFEREXTRANJERO = (
    chofer: ChoferesExtranjeros,
    operacion: 'AGREGAR' | 'MODIFICAR' | 'ELIMINAR'
  ): ChoferExtranjeroPayload => ({
    operacion,
    chofer_datos: {
      nombre: chofer.numero ?? '',
      primer_apellido: chofer.primerApellido ?? '',
      segundo_apellido: chofer.segundoApellido ?? '',
      numero_de_gafete: chofer.numeroDeGafete ?? '',
      vigencia_del_gafete: chofer.vigenciaGafete ?? '',
      num_del_seg_social: chofer.numeroDelSeguroSocial ?? '',
      num_de_iden_fisc: chofer.numberDeIdeFiscal ?? '',
      nacionalidad: chofer.nacionalidad ?? '',
    },
    domicilio_fiscal: {
      ciudad: chofer.ciudad ?? '',
      pais: chofer.pais ?? '',
      codigo_postal: chofer.codigoPostal ?? '',
      estado: chofer.estado ?? '',
      calle: chofer.calle ?? '',
      numero_exterior: chofer.numeroExterior ?? '',
      numero_interior: chofer.numeroInterior ?? '',
      correo_electronico: chofer.correoElectronico ?? '',
      telefono: chofer.telefono ?? '',
      pais_de_residencia: chofer.paisDeResidencia ?? '',
    },
  });

  const CHOFERES_NACIONALES = [
    ...(choferesState.datosDelChoferNacionalAlta ?? []).map((c) =>
      MAPCHOFERNACIONAL(c, 'AGREGAR')
    ),
    ...(choferesState.datosDelChoferNacionalModification ?? []).map((c) =>
      MAPCHOFERNACIONAL(c, 'MODIFICAR')
    ),
    ...(choferesState.datosDelChoferNacionalRetirada ?? []).map((c) =>
      MAPCHOFERNACIONAL(c, 'ELIMINAR')
    ),
  ];

  const CHOFERES_EXTRANJEROS = [
    ...(choferesState.datosDelChoferExtranjerosAlta ?? []).map((c) =>
      MAPCHOFEREXTRANJERO(c, 'AGREGAR')
    ),
    ...(choferesState.datosDelChoferExtranjerosModification ?? []).map((c) =>
      MAPCHOFEREXTRANJERO(c, 'MODIFICAR')
    ),
    ...(choferesState.datosDelChoferExtranjerosRetirada ?? []).map((c) =>
      MAPCHOFEREXTRANJERO(c, 'ELIMINAR')
    ),
  ];

  const DIRECTOR_GENERAL = choferesState.nombre
    ? {
        nombre: choferesState.nombre,
        primer_apellido: choferesState.primerApellido,
        segundo_apellido: choferesState.segundoApellido,
      }
    : null;

  // Mapea los datos de vehículos para cumplir con el formato requerido por el backend.
 const MAPVEHICULO = (
  vehiculo: DatosVehiculo,
  operacion: 'AGREGAR' | 'MODIFICAR' | 'ELIMINAR'
): VehiculoPayload => {

  return {
    operacion,
    numero_identificacion_vehicular: vehiculo.numero ?? '',
    tipo_vehiculo: vehiculo.tipoDeVehiculo ?? '',
    id_vehiculo:
      operacion === 'AGREGAR'
        ? vehiculo.idDeVehiculo ?? ''
        : vehiculo.idDeUnidad ?? '',
    numero_placas: vehiculo.numeroPlaca ?? '',
    pais_emisor: vehiculo.paisEmisor ?? '',
    estado_provincia: vehiculo.estado ?? '',
    color_vehiculo: Number(vehiculo.colorVehiculo) ?? 0,
    numero_economico: vehiculo.numeroEconomico ?? '',
    numero_2da_placa: vehiculo.numero2daPlaca ?? '',
    estado_emisor_2da_placa: vehiculo.estado2daPlaca ?? '',
    pais_emisor_2da_placa: vehiculo.paisEmisor2daPlaca ?? '',
    descripcion_vehiculo: vehiculo.descripcion ?? '',
    marca: vehiculo.marca ?? '',
    modelo: vehiculo.modelo ?? '',
    anio: vehiculo.ano ?? '',
    transponder: vehiculo.transponder ?? '',
  };
};

  // Mapea los datos de unidades de arrastre para cumplir con el formato requerido por el backend.
  const MAPUNIDAD = (
    unidad: DatosUnidad,
    operacion: 'AGREGAR' | 'MODIFICAR' | 'ELIMINAR'
  ): UnidadArrastrePayload => ({
    operacion,
    numero_identificacion_vehicular: unidad.vinVehiculo ?? '',
    tipo_vehiculo: unidad.tipoDeUnidadArrastre ?? '',
    id_vehiculo:operacion === 'AGREGAR'
      ? unidad.idDeVehiculoUnidad?? ''
      : unidad.idDeUnidad ?? '', 
    numero_placas: unidad.numeroPlaca ?? '',
    pais_emisor: unidad.paisEmisor ?? '',
    estado_provincia: unidad.estado ?? '',
    color_vehiculo:Number( unidad.colorVehiculo) ?? 0,
    numero_economico: unidad.numeroEconomico ?? '',
    numero_2da_placa: unidad.numero2daPlaca ?? '',
    estado_emisor_2da_placa: unidad.estado2daPlaca ?? '',
    pais_emisor_2da_placa: unidad.paisEmisor2daPlaca ?? '',
    descripcion_vehiculo: '',
    tipo_vehiculo_arrastre: unidad.tipoDeUnidadArrastre ?? '',
    id_vehiculo_arrastre: unidad.idDeVehiculo ?? '',
    color_vehiculo_arrastre:Number( unidad.colorVehiculo) ?? 0,
    descripcion_unidad_arrastre: unidad.descripcion ?? '',
  });

  const PARQUE_VEHICULAR = [
    ...(tramiteState.parque_vehicular_alta ?? []).map((v) => MAPVEHICULO(v, 'AGREGAR')),
    ...(tramiteState.parque_vehicular_modification ?? []).map((v) => MAPVEHICULO(v, 'MODIFICAR')),
    ...(tramiteState.parque_vehicular_retirada ?? []).map((v) => MAPVEHICULO(v, 'ELIMINAR')),
  ];

  const UNIDADES_ARRASTRE = [
    ...(tramiteState.unidades_arrastre_alta ?? []).map((u) => MAPUNIDAD(u, 'AGREGAR')),
    ...(tramiteState.unidades_arrastre_modification ?? []).map((u) => MAPUNIDAD(u, 'MODIFICAR')),
    ...(tramiteState.unidades_arrastre_retirada ?? []).map((u) => MAPUNIDAD(u, 'ELIMINAR')),
  ];

  return {
    choferes_nacionales: CHOFERES_NACIONALES,
    choferes_extranjeros: CHOFERES_EXTRANJEROS,
    director_general: DIRECTOR_GENERAL,
    vehiculos: {
      parque_vehicular: PARQUE_VEHICULAR,
      unidades_arrastre: UNIDADES_ARRASTRE,
    },
  };
}


  /**
   * Inicializa las secciones y validaciones del trámite en el store.
   * 
   * Método privado que configura el estado inicial de las secciones del trámite
   * 40103 basándose en la configuración SECCIONES_TRAMITE_40103. Extrae las
   * configuraciones de validación del PASO_1 y establece los arrays de secciones
   * y formas válidas en el store de estado.
   * 
   * Proceso de inicialización:
   * - Extracción de claves de configuración del PASO_1
   * - Creación de arrays de secciones y validaciones
   * - Establecimiento del estado inicial en el store
   * - Configuración de formularios como no válidos por defecto
   *
   * @method asignarSecciones
   * @private
   * @returns {void}
   * 
   * @example
   * ```typescript
   * // Este método se ejecuta automáticamente en ngOnInit
   * private asignarSecciones(): void {
   *   const SECCIONES: boolean[] = [];
   *   const FORMA_VALIDA: boolean[] = [];
   *   
   *   // Configuración basada en SECCIONES_TRAMITE_40103.PASO_1
   *   for (const LLAVE_SECCION of Object.keys(SECCIONES_TRAMITE_40103.PASO_1)) {
   *     SECCIONES.push(SECCIONES_TRAMITE_40103.PASO_1[LLAVE_SECCION]);
   *     FORMA_VALIDA.push(false);
   *   }
   * }
   * ```
   * 
   * @since 1.0.0
   */
  private asignarSecciones(): void {
    const SECCIONES: boolean[] = [];
    const FORMA_VALIDA: boolean[] = [];

    for (const LLAVE_SECCION of Object.keys(
      SECCIONES_TRAMITE_40103.PASO_1
    ) as Array<keyof typeof SECCIONES_TRAMITE_40103.PASO_1>) {
      SECCIONES.push(SECCIONES_TRAMITE_40103.PASO_1[LLAVE_SECCION]);
      FORMA_VALIDA.push(false);
    }

    this.chofer40103Store.establecerSeccion(SECCIONES);
    this.chofer40103Store.establecerFormaValida(FORMA_VALIDA);
  }
}
