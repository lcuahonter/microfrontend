import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import {
  Tramite300105State,
  Tramite300105Store,
} from '../../estados/tramite300105.store';
import { AutorizacionDeRayosXService } from '../../services/autorizacion-de-rayos-x.service';
import { Catalogo } from '@libs/shared/data-access-user/src/core/models/shared/catalogos.model';
import { CatalogosSelect } from '@libs/shared/data-access-user/src/core/models/shared/components.model';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { INPUT_FECHA_CONFIG } from '../../enum/permiso.enum';
import { Tramite300105Query } from '../../estados/tramite300105.query';

/**
 * @class PagoDeDerechosComponent
 * @description Componente Angular responsable de gestionar la sección de pago de derechos
 * para el trámite 300105 de autorización de equipos de rayos X. Este componente maneja
 * formularios reactivos para la captura de información financiera relacionada con el pago
 * de derechos gubernamentales, incluyendo datos bancarios, referencias de pago y validaciones.
 * 
 * Funcionalidades principales:
 * - Gestión de formularios reactivos para datos de pago
 * - Validación de campos obligatorios del pago de derechos
 * - Integración con catálogos de bancos
 * - Manejo de fechas de pago y importes
 * - Capitalización automática de llaves de pago
 * - Control de estados de solo lectura según permisos del usuario
 * - Sincronización automática con el store de estado global
 * - Gestión de referencias bancarias y cadenas de dependencia
 * 
 * Campos del formulario de pago:
 * - Clave de referencia: Identificador único del pago
 * - Cadena de dependencia: Código de dependencia gubernamental
 * - Banco: Institución bancaria donde se realizó el pago
 * - Llave de pago: Código único de transacción bancaria
 * - Fecha de pago: Fecha en que se realizó el pago
 * - Importe de pago: Cantidad pagada por los derechos
 * 
 * @implements {OnInit} - Interfaz para inicialización del componente
 * @implements {OnDestroy} - Interfaz para limpieza de recursos al destruir el componente
 * 
 * @example
 * ```html
 * <app-pago-de-derechos></app-pago-de-derechos>
 * ```
 * 
 * @since 1.0.0
 * @author VUCEM Development Team
 * @version 1.0.0
 */
@Component({
  /**
   * @property {string} selector - Selector CSS para usar el componente en plantillas HTML
   * @description Define cómo se invoca este componente en las plantillas padre
   */
  selector: 'app-pago-de-derechos',
  
  /**
   * @property {string} templateUrl - Ruta relativa al archivo de plantilla HTML del componente
   * @description Especifica la ubicación del archivo HTML que define la vista del componente
   */
  templateUrl: './pago-de-derechos.component.html',
})
export class PagoDeDerechosComponent implements OnInit, OnDestroy {
  /**
   * @property {FormGroup} formSolicitud - Formulario de la solicitud
   * @description FormGroup principal que contiene todos los controles del formulario para
   * la captura de datos relacionados con el pago de derechos. Incluye validaciones
   * y estructura anidada para organizar los datos del importador/exportador.
   * 
   * Estructura del formulario:
   * - datosImportadorExportador: FormGroup anidado con campos de pago
   *   - claveDeReferencia: Identificador único del pago
   *   - cadenaDependencia: Código de dependencia gubernamental
   *   - banco: Banco seleccionado del catálogo
   *   - llaveDePago: Código de transacción bancaria
   *   - fechaPago: Fecha de realización del pago
   *   - importePago: Monto pagado por los derechos
   * 
   * @example
   * ```typescript
   * this.formSolicitud.get('datosImportadorExportador.claveDeReferencia')?.setValue('REF123');
   * ```
   */
  formSolicitud!: FormGroup;

  /**
   * @property {Tramite300105State} solicitudState - Estado de la solicitud de la sección 300105
   * @description Objeto que representa el estado actual del trámite 300105,
   * incluyendo todos los datos de pago de derechos. Se sincroniza automáticamente
   * con el store global y se utiliza para inicializar el formulario.
   * @public
   */
  public solicitudState!: Tramite300105State;

  /**
   * @property {Subject<void>} destroyNotifier$ - Subject para notificar la destrucción del componente
   * @description Subject utilizado para limpiar las suscripciones activas cuando el componente
   * se destruye, evitando fugas de memoria y comportamientos inesperados.
   * Se utiliza con el operador takeUntil() en todas las suscripciones.
   * @private
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @property {object} INPUT_FECHA_CONFIG - Constante para configurar el input de fecha
   * @description Configuración predefinida que define las propiedades del campo de entrada de fecha
   * en el formulario de pago de derechos. Incluye formato, validaciones y restricciones de fecha.
   * Utiliza la configuración importada desde el enum de permisos.
   */
  INPUT_FECHA_CONFIG = INPUT_FECHA_CONFIG;

  /**
   * @property {CatalogosSelect} bancoCatalogo - Catálogo de bancos
   * @description Objeto que contiene la lista de bancos disponibles para seleccionar en el formulario
   * de pago de derechos. Incluye configuración del componente select y los datos del catálogo.
   * 
   * Propiedades:
   * - labelNombre: Etiqueta mostrada en el campo select
   * - required: Indica si el campo es obligatorio
   * - primerOpcion: Texto de la opción por defecto
   * - catalogos: Array de objetos Catalogo con los bancos disponibles
   * 
   * @public
   * @example
   * ```typescript
   * this.bancoCatalogo.catalogos = [
   *   { id: 1, descripcion: 'Banco Nacional', activo: true },
   *   { id: 2, descripcion: 'Banco Internacional', activo: true }
   * ];
   * ```
   */
  public bancoCatalogo: CatalogosSelect = {
    labelNombre: 'Banco',
    required: true,
    primerOpcion: 'Selecciona un valor',
    catalogos: [],
  };

  /**
   * @property {boolean} esFormularioSoloLectura - Indica si el formulario está en modo solo lectura
   * @description Flag que determina si todos los controles del formulario deben estar deshabilitados.
   * Cuando es `true`, los campos del formulario no se pueden editar, útil para consultas
   * o cuando el usuario no tiene permisos de modificación sobre datos de pago.
   * @default false
   */
  esFormularioSoloLectura: boolean = false; 

  /**
   * @constructor
   * @description Constructor del componente PagoDeDerechosComponent.
   * Inicializa los servicios necesarios, configura la suscripción al estado de solo lectura,
   * y obtiene los datos del catálogo de bancos. Establece la base para el funcionamiento
   * del formulario de pago de derechos.
   * 
   * @param {FormBuilder} fb - Servicio para construir formularios reactivos de Angular
   * @param {Tramite300105Store} tramite300105Store - Store para gestionar el estado del trámite 300105
   * @param {Tramite300105Query} tramite300105Query - Query para consultar el estado del trámite 300105
   * @param {AutorizacionDeRayosXService} autorizacionDeRayosXService - Servicio para obtener datos relacionados con rayos X y catálogos
   * @param {ConsultaioQuery} consultaioQuery - Servicio de consulta para obtener el estado de solo lectura
   * 
   * @example
   * ```typescript
   * // El constructor se invoca automáticamente por Angular DI
   * // No se llama directamente en el código de aplicación
   * ```
   * 
   * @memberof PagoDeDerechosComponent
   */
  constructor(
    private fb: FormBuilder,
    private tramite300105Store: Tramite300105Store,
    private tramite300105Query: Tramite300105Query,
    @Inject(AutorizacionDeRayosXService)
    private autorizacionDeRayosXService: AutorizacionDeRayosXService,
    private consultaioQuery: ConsultaioQuery,
  ) {
    /**
     * @description Se suscribe al estado de `Consultaio` para obtener información actualizada del estado del formulario.
     * Esta suscripción maneja automáticamente el modo de solo lectura del componente basado en los permisos del usuario
     * para la gestión de datos de pago de derechos.
     * 
     * Operaciones realizadas:
     * - Asigna el valor de solo lectura (`readonly`) a la propiedad `esFormularioSoloLectura`
     * - La suscripción se cancela automáticamente cuando `destroyNotifier$` emite un valor (para evitar fugas de memoria)
     * - Llama a fetchBancoData() para inicializar el catálogo de bancos
     * 
     * @since 1.0.0
     */
    this.consultaioQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState) => {
       this.esFormularioSoloLectura = seccionState.readonly;
      })
    )
    .subscribe()
    this.fetchBancoData();
  }

  /**
   * @method ngOnInit
   * @description Método del ciclo de vida de Angular que inicializa el componente y configura el formulario con los datos del estado.
   * Establece la suscripción al estado del trámite, crea el formulario reactivo con validaciones,
   * y aplica el modo de solo lectura si corresponde.
   * 
   * Operaciones realizadas:
   * - Suscripción al estado del trámite 300105
   * - Creación del formulario reactivo con estructura anidada
   * - Inicialización de campos con datos del estado
   * - Aplicación de validaciones requeridas
   * - Control del estado de solo lectura del formulario
   * 
   * @returns {void}
   * @memberof PagoDeDerechosComponent
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // Se ejecuta automáticamente por Angular
   * // No se llama directamente en el código de aplicación
   * ```
   */
  ngOnInit(): void {
    this.tramite300105Query.selectTramite300105$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();

    this.formSolicitud = this.fb.group({
      datosImportadorExportador: this.fb.group({
        claveDeReferencia: [this.solicitudState?.claveDeReferencia,[Validators.required]],
        cadenaDependencia: [this.solicitudState?.cadenaDependencia,[Validators.required]],
        banco: [this.solicitudState?.banco,[Validators.required]],
        llaveDePago: [this.solicitudState?.llaveDePago,[Validators.required]],
        fechaPago: [this.solicitudState?.fechaPago,[Validators.required]],
        importePago: [this.solicitudState?.importePago,[Validators.required]],
      }),
    });

    if(this.esFormularioSoloLectura) {
      this.formSolicitud.disable();
    } else {
      this.formSolicitud.enable();
    }
  }

  /**
   * @method fetchBancoData
   * @description Obtiene los datos del catálogo de bancos desde el servicio.
   * Realiza una llamada al servicio de autorización de rayos X para obtener
   * la lista actualizada de bancos disponibles y actualiza el catálogo local.
   * 
   * @returns {void}
   * @memberof PagoDeDerechosComponent
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // Se llama automáticamente en el constructor
   * this.fetchBancoData();
   * ```
   */
  fetchBancoData(): void {
    this.autorizacionDeRayosXService
      .getBancoData()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data): void => {
        this.bancoCatalogo.catalogos = data as Catalogo[];
      });
  }

  /**
   * @method manejarCambioLlavePago
   * @description Capitaliza el valor de la llave de pago y actualiza el estado en el store.
   * Convierte automáticamente el texto ingresado a mayúsculas para mantener consistencia
   * en el formato de las llaves de pago y sincroniza el valor con el store global.
   * 
   * @returns {void}
   * @memberof PagoDeDerechosComponent
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // Se ejecuta cuando el usuario modifica el campo llave de pago
   * this.manejarCambioLlavePago();
   * ```
   */
  manejarCambioLlavePago(): void {
    const VALOR_EN_MAYUSCULAS = this.datosImportadorExportador.get('llaveDePago')?.value.toUpperCase();
    this.datosImportadorExportador.get('llaveDePago')?.setValue(VALOR_EN_MAYUSCULAS);
    this.tramite300105Store.setllaveDePago(
      VALOR_EN_MAYUSCULAS
    );
  }

  /**
   * @method setValoresStore
   * @description Actualiza un valor específico en el store utilizando el método correspondiente.
   * Método genérico que toma un valor del formulario y lo persiste en el store global
   * del trámite 300105 utilizando el método establecerDatos.
   * 
   * @param {FormGroup} form - Formulario reactivo que contiene los datos
   * @param {string} campo - Nombre del campo cuyo valor se actualizará en el store
   * @returns {void}
   * @memberof PagoDeDerechosComponent
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // Actualizar un campo específico en el store
   * this.setValoresStore(this.formSolicitud, 'claveDeReferencia');
   * ```
   */
  setValoresStore(form: FormGroup, campo: string): void {
    const VALOR = form.get(campo)?.value;
    this.tramite300105Store.establecerDatos({[campo]: VALOR});
  }

  /**
   * @method ngOnDestroy
   * @description Método del ciclo de vida de Angular que limpia las suscripciones activas y notifica la destrucción del componente.
   * Maneja la limpieza de recursos para evitar fugas de memoria, especialmente
   * la cancelación de todas las suscripciones activas relacionadas con el pago de derechos.
   * 
   * Operaciones de limpieza:
   * - Emite señal de destrucción para cancelar suscripciones
   * - Completa el Subject de notificación de destrucción
   * - Libera recursos y previene fugas de memoria
   * 
   * @returns {void}
   * @memberof PagoDeDerechosComponent
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // Se ejecuta automáticamente por Angular
   * // No se llama directamente en el código de aplicación
   * ```
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * @getter datosImportadorExportador
   * @description Devuelve el formulario anidado de datos del importador/exportador.
   * Proporciona acceso directo al FormGroup anidado que contiene todos los campos
   * relacionados con los datos de pago de derechos del importador/exportador.
   * 
   * @returns {FormGroup} FormGroup anidado con los campos de datos del importador/exportador
   * @memberof PagoDeDerechosComponent
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // Acceder a un campo específico del formulario anidado
   * const claveRef = this.datosImportadorExportador.get('claveDeReferencia')?.value;
   * 
   * // Establecer un valor en el formulario anidado
   * this.datosImportadorExportador.get('banco')?.setValue('001');
   * 
   * // Validar el formulario anidado
   * if (this.datosImportadorExportador.valid) {
   *   // Procesar datos válidos
   * }
   * ```
   */
  get datosImportadorExportador(): FormGroup {
    return this.formSolicitud.get('datosImportadorExportador') as FormGroup;
  }
}