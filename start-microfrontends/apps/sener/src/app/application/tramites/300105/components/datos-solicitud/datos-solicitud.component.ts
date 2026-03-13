import {
  Catalogo,
  CategoriaMensaje,
  ConfiguracionColumna,
  ConsultaioQuery,
  CrosslistComponent,
  Notificacion,
  TablaSeleccion,
  TipoNotificacionEnum,
} from '@ng-mf/data-access-user';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  ConfiguracionItem,
  SERIE_TABLA_CONFIGURACION,
  SerieConfiguracionItem,
  TABLA_CONFIGURACION,
} from '../../enum/mercancia-tabla.enum';
import {
  CrosslistBoton,
  OBTENER_BOTONES_CROSSLIST,
} from '../../enum/botons.enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import {
  Tramite300105State,
  Tramite300105Store,
} from '../../estados/tramite300105.store';
import { AutorizacionDeRayosXService } from '../../services/autorizacion-de-rayos-x.service';
import { Tramite300105Query } from '../../estados/tramite300105.query';

/**
 * @class DatosSolicitudComponent
 * @description Componente Angular responsable de gestionar los datos de la solicitud para el trámite 300105
 * de autorización de equipos de rayos X. Este componente maneja formularios reactivos para datos de solicitud
 * y mercancías, tablas dinámicas con selección múltiple, modales de configuración, y la interacción completa
 * con servicios de autorización y el store de estado global.
 * 
 * Funcionalidades principales:
 * - Gestión de formularios reactivos con validaciones
 * - Manejo de tablas dinámicas con selección múltiple
 * - CRUD completo de mercancías (agregar, modificar, eliminar)
 * - Gestión de catálogos desplegables (fracciones arancelarias, unidades de medida)
 * - Control de estados de solo lectura según permisos del usuario
 * - Notificaciones y confirmaciones de usuario
 * - Integración con crosslist para listas dinámicas
 * 
 * @implements {OnInit} - Interfaz para inicialización del componente
 * @implements {OnDestroy} - Interfaz para limpieza de recursos al destruir el componente
 * 
 * @example
 * ```html
 * <app-datos-solicitud 
 *   [tipoOperacionSeleccionado]="tipoOperacion">
 * </app-datos-solicitud>
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
  selector: 'app-datos-solicitud',
  
  /**
   * @property {string} templateUrl - Ruta relativa al archivo de plantilla HTML del componente
   * @description Especifica la ubicación del archivo HTML que define la vista del componente
   */
  templateUrl: './datos-solicitud.component.html',
  
  /**
   * @property {string[]} styleUrls - Array de rutas a los archivos de estilos CSS/SCSS del componente
   * @description Define los archivos de estilos específicos que se aplicarán a este componente
   */
  styleUrls: ['./datos-solicitud.component.scss'],
})
export class DatosSolicitudComponent implements OnInit, OnDestroy {
  /** 
   * @property {string | number} tipoOperacionSeleccionado - Tipo de operación recibida como entrada desde el componente padre
   * @description Valor que determina el tipo de operación a realizar en la solicitud.
   * Este valor es pasado desde el componente padre y define el comportamiento del formulario.
   * @input
   * @required
   * @example
   * ```html
   * <app-datos-solicitud [tipoOperacionSeleccionado]="1"></app-datos-solicitud>
   * ```
   */
  @Input() tipoOperacionSeleccionado!: string | number;

  /**
   * @property {CrosslistComponent} crosslistComponent - Referencia al componente Crosslist para gestionar listas dinámicas
   * @description ViewChild que proporciona acceso directo al componente CrosslistComponent
   * para manejar operaciones de listas dinámicas como aduanas y movimientos.
   * @viewChild
   * @example
   * ```typescript
   * this.crosslistComponent.agregarItem(nuevoItem);
   * ```
   */
  @ViewChild(CrosslistComponent) crosslistComponent!: CrosslistComponent;

  /**
   * @property {FormGroup} formularioSolicitud - Formulario reactivo para los datos de la solicitud
   * @description FormGroup que contiene los controles para capturar datos generales de la solicitud,
   * incluyendo observaciones y otros campos relacionados con el trámite.
   * Utiliza validaciones de Angular Reactive Forms.
   * @example
   * ```typescript
   * this.formularioSolicitud.get('observaciones')?.setValue('Nueva observación');
   * ```
   */
  formularioSolicitud!: FormGroup;

  /**
   * @property {FormGroup} formularioMercancia - Formulario reactivo para los datos de la mercancía
   * @description FormGroup que gestiona todos los campos relacionados con la información
   * de equipos de rayos X: marca, modelo, serie, voltaje, corriente, fracción arancelaria, etc.
   * Incluye validaciones específicas para cada campo.
   * @example
   * ```typescript
   * this.formularioMercancia.get('marca')?.setValue('PHILIPS');
   * ```
   */
  formularioMercancia!: FormGroup;

  /**
   * @property {boolean} otraFraccionSeleccionada - Indica si se seleccionó otra fracción en el formulario de mercancía
   * @description Flag que determina si el usuario ha seleccionado una fracción arancelaria
   * diferente a las predefinidas, habilitando campos adicionales en el formulario.
   */
  otraFraccionSeleccionada!: boolean;

  /**
   * @property {Tramite300105State} estadoSolicitud300105 - Estado actual de la solicitud
   * @description Objeto que contiene todo el estado actual del trámite 300105,
   * incluyendo datos de formularios, tablas, configuraciones y flags de estado.
   * Se actualiza mediante suscripción al store de estado.
   */
  estadoSolicitud300105!: Tramite300105State;

  /**
   * @property {CrosslistBoton[]} botonesAduanas - Botones configurados para la lista dinámica de aduanas
   * @description Array de configuración de botones que se muestran en el componente
   * crosslist para la gestión de aduanas (agregar, eliminar, modificar).
   */
  botonesAduanas!: CrosslistBoton[];

  /**
   * @property {string[]} listaOriginalAduanas - Lista original de aduanas disponibles
   * @description Array que contiene todas las aduanas disponibles del catálogo,
   * utilizada como fuente de datos para el componente de selección múltiple.
   * @default []
   */
  listaOriginalAduanas: string[] = [];

  /**
   * @property {string[]} listaSeleccionadaAduanas - Lista de aduanas seleccionadas
   * @description Array que mantiene las aduanas que el usuario ha seleccionado
   * para incluir en la solicitud. Se actualiza dinámicamente con las selecciones del usuario.
   * @default []
   */
  listaSeleccionadaAduanas: string[] = [];

  /**
   * @property {CrosslistBoton[]} botonesMovimientos - Botones configurados para la lista dinámica de movimientos
   * @description Array de configuración de botones específicos para la gestión
   * de movimientos en el componente crosslist (importación, exportación, etc.).
   */
  botonesMovimientos!: CrosslistBoton[];

  

  /**
   * @property {string[]} listaOriginalMovimientos - Lista original de movimientos disponibles
   * @description Array que contiene todos los tipos de movimientos disponibles del catálogo,
   * utilizada como fuente de datos para la selección de operaciones aduaneras.
   * @default []
   */
  listaOriginalMovimientos: string[] = [
    'ACAPULCO, PUERTO Y AEROPUERTO',
    'ADUANA DE PANTACO',
    'AEROPUERTO INT. DE LA CD DE MEXI',
    'AEROPUERTO INTERNACIONAL FELIF',
    'AGUA PRIETA',
    'AGUASCALIENTES, AGS.',
    'ALTAMIRA',
    'CANCUN, AEROPUERTO',
    'CD. CAMARGO, TAMPS.',
    'CD. DEL CARMEN',
    'CD. JUAREZ',
    'CHIHUAHUA, CHIH.'
  ];

  /**
   * @property {string[]} listSeleccionadaMovimientos - Lista de movimientos seleccionados
   * @description Array que mantiene los tipos de movimientos que el usuario ha seleccionado
   * para la solicitud de autorización de equipos.
   * @default []
   */
  listSeleccionadaMovimientos: string[] = [];

  /**
   * @property {ConfiguracionColumna<ConfiguracionItem>[]} configuracionTabla - Configuración de las columnas para la tabla
   * @description Array que define la estructura y configuración de las columnas de la tabla
   * de mercancías, incluyendo títulos, tipos de datos, ordenamiento y formato de visualización.
   * Utiliza la configuración predefinida TABLA_CONFIGURACION.
   */
  configuracionTabla: ConfiguracionColumna<ConfiguracionItem>[] =
    TABLA_CONFIGURACION;

  /**
   * @property {boolean} esFormularioSoloLectura - Indica si el formulario está en modo solo lectura
   * @description Flag que determina si todos los controles del formulario deben estar deshabilitados.
   * Cuando es `true`, los campos del formulario no se pueden editar, útil para consultas
   * o cuando el usuario no tiene permisos de modificación.
   * @default false
   */
  esFormularioSoloLectura: boolean = false; 

  /**
   * @property {ConfiguracionColumna<SerieConfiguracionItem>[]} serieTabla - Configuración de las columnas para la tabla de series
   * @description Array que define la estructura y configuración de las columnas de la tabla
   * de series de equipos. Esta propiedad define la configuración de las columnas que se utilizarán
   * en la tabla de series dentro del componente de datos de solicitud.
   * Utiliza la configuración predefinida SERIE_TABLA_CONFIGURACION.
   */
  serieTabla: ConfiguracionColumna<SerieConfiguracionItem>[] =
  SERIE_TABLA_CONFIGURACION;

  /**
   * @property {TablaSeleccion} tipoSeleccionTabla - Tipo de selección para la tabla dinámica
   * @description Define el tipo de selección permitida en las tablas del componente.
   * Utiliza TablaSeleccion.CHECKBOX para permitir selección múltiple mediante checkboxes.
   */
  tipoSeleccionTabla = TablaSeleccion.CHECKBOX;

  /**
   * @property {ConfiguracionItem[]} datosTablaMercancia - Datos de la tabla de mercancías
   * @description Array que contiene todos los registros de mercancías (equipos de rayos X)
   * que se muestran en la tabla principal. Cada elemento representa un equipo con sus
   * características técnicas completas.
   */
  datosTablaMercancia!: ConfiguracionItem[];

  /**
   * @property {SerieConfiguracionItem[]} datosSerieTablaMercancia - Datos de la tabla de mercancías para la selección múltiple
   * @description Array específico para manejar datos de series de equipos en operaciones
   * de selección múltiple. Utilizado en conjunto con la tabla de series.
   */
  datosSerieTablaMercancia!: SerieConfiguracionItem[];

  /**
   * @property {ConfiguracionItem} filaSeleccionadaMercancia - Fila seleccionada en la tabla de mercancías
   * @description Objeto que contiene los datos de la fila actualmente seleccionada
   * en la tabla de mercancías. Se actualiza cuando el usuario hace clic en una fila.
   */
  filaSeleccionadaMercancia!: ConfiguracionItem;

  /**
   * @property {ConfiguracionItem[]} listaFilaSeleccionadaMercancia - Lista de filas seleccionadas en la tabla de mercancías
   * @description Array que mantiene todas las filas que el usuario ha seleccionado
   * en la tabla de mercancías. Permite operaciones en lote como eliminación múltiple.
   */
  listaFilaSeleccionadaMercancia!: ConfiguracionItem[];

  /**
   * @property {boolean} enableModficarBoton - Indica si un archivo está seleccionado
   * @description Flag que habilita o deshabilita el botón de modificar basado en
   * si hay elementos seleccionados en la tabla. Se actualiza dinámicamente.
   * @default false
   */
  enableModficarBoton: boolean = false;

  /**
   * @property {boolean} mostrarModalDatosMercancia - Indica si se debe mostrar el modal de datos de mercancía
   * @description Flag que controla la visibilidad del modal para agregar o editar
   * datos de mercancías. Se alterna mediante la función alternarModalMercancia().
   * @default false
   */
  mostrarModalDatosMercancia: boolean = false;

  /**
   * @property {boolean} mostrarPopupSeleccionMultiple - Indica si se debe mostrar el popup de selección múltiple
   * @description Flag que controla la visibilidad del popup que advierte al usuario
   * cuando intenta modificar múltiples elementos seleccionados simultáneamente.
   * @default false
   */
  mostrarPopupSeleccionMultiple: boolean = false;

  /**
   * @property {boolean} multipleSeleccionPopupAbierto - Indica si el popup está abierto
   * @description Flag que controla el estado de apertura del popup de selección múltiple.
   * Se utiliza para mostrar notificaciones cuando se seleccionan varios elementos.
   * @default false
   */
  multipleSeleccionPopupAbierto: boolean = false;

  /**
   * @property {boolean} multipleSeleccionPopupCerrado - Indica si el popup está cerrado
   * @description Flag que controla el estado de cierre del popup de selección múltiple.
   * Complementa el flag de apertura para un control preciso del estado del modal.
   * @default true
   */
  multipleSeleccionPopupCerrado: boolean = true;

  /**
   * @property {boolean} confirmEliminarPopupAbierto - Indica si el popup está abierto
   * @description Flag que controla la visibilidad del popup de confirmación de eliminación.
   * Se muestra cuando el usuario intenta eliminar uno o más elementos de la tabla.
   * @default false
   */
  confirmEliminarPopupAbierto: boolean = false;

  /**
   * @property {boolean} confirmEliminarPopupCerrado - Indica si el popup está cerrado
   * @description Flag que controla el estado de cierre del popup de confirmación de eliminación.
   * Utilizado para manejar la animación y estado del modal de confirmación.
   * @default true
   */
  confirmEliminarPopupCerrado: boolean = true;

  /**
   * @property {boolean} serieAgregadaPopupAbierto - Indica si el popup de serie agregada está abierto
   * @description Flag que controla la visibilidad del popup de confirmación que se muestra
   * después de agregar exitosamente un número de serie a la tabla.
   * @default false
   */
  serieAgregadaPopupAbierto: boolean = false;

  /**
   * @property {boolean} mercanciaAgregadaPopupAbierto - Indica si el popup de mercancía agregada está abierto
   * @description Flag que controla la visibilidad del popup de confirmación que se muestra
   * después de guardar exitosamente una mercancía en la tabla.
   * @default false
   */
  mercanciaAgregadaPopupAbierto: boolean = false;

  /**
   * @property {boolean} enableEliminarBoton - Indica si el botón de eliminar está habilitado
   * @description Flag que habilita o deshabilita el botón de eliminar basado en
   * si hay elementos seleccionados en la tabla. Se actualiza dinámicamente con las selecciones.
   * @default false
   */
  enableEliminarBoton: boolean = false;

  /**
   * @property {Notificacion} nuevaNotificacion - Notificación que se muestra al usuario
   * @description Objeto que contiene la configuración completa de las notificaciones
   * que se muestran al usuario (éxito, error, advertencia, etc.).
   * Incluye tipo, mensaje, botones y comportamiento del modal.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * @property {Subject<void>} notificadorDestruccion$ - Observable para manejar la destrucción del componente y evitar fugas de memoria
   * @description Subject utilizado para cancelar todas las suscripciones activas
   * cuando el componente se destruye, evitando fugas de memoria y comportamientos inesperados.
   * Se completa en el método ngOnDestroy().
   * @private
   */
  private notificadorDestruccion$: Subject<void> = new Subject();

  /**
   * @property {boolean} esOperacionDeActualizacion - Indica si se está realizando una operación de actualización
   * @description Flag que distingue entre operaciones de creación y actualización
   * en el formulario de mercancías. Afecta el comportamiento del guardado y validaciones.
   * @default false
   */
  esOperacionDeActualizacion: boolean = false;

  /**
   * @constructor
   * @description Constructor del componente DatosSolicitudComponent.
   * Inicializa todas las dependencias necesarias y configura la suscripción al estado de solo lectura.
   * Establece la configuración inicial del formulario basada en los permisos del usuario.
   * 
   * @param {AutorizacionDeRayosXService} autorizacionDeRayosXService - Servicio para manejar datos relacionados con autorizaciones de equipos de rayos X
   * @param {Tramite300105Store} tramite300105Store - Almacén de estado para el trámite 300105
   * @param {Tramite300105Query} tramite300105Query - Consulta de estado para el trámite 300105
   * @param {FormBuilder} formBuilder - Constructor de formularios reactivos de Angular
   * @param {ConsultaioQuery} consultaioQuery - Servicio de consulta para obtener el estado de solo lectura
   * 
   * @example
   * ```typescript
   * // El constructor se invoca automáticamente por Angular DI
   * // No se llama directamente en el código de aplicación
   * ```
   * 
   * @memberof DatosSolicitudComponent
   */
  constructor(
    public autorizacionDeRayosXService: AutorizacionDeRayosXService,
    private tramite300105Store: Tramite300105Store,
    private tramite300105Query: Tramite300105Query,
    private formBuilder: FormBuilder,
    private consultaioQuery: ConsultaioQuery
  ) {
    /**
     * @description Se suscribe al estado de `Consultaio` para obtener información actualizada del estado del formulario.
     * Esta suscripción maneja automáticamente el modo de solo lectura del componente basado en los permisos del usuario.
     * 
     * Operaciones realizadas:
     * - Asigna el valor de solo lectura (`readonly`) a la propiedad `esFormularioSoloLectura`
     * - Llama a `inicializarEstadoFormulario()` para aplicar configuraciones basadas en el estado recibido
     * - La suscripción se cancela automáticamente cuando `notificadorDestruccion$` emite un valor (para evitar fugas de memoria)
     * 
     * @since 1.0.0
     */
    this.consultaioQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.notificadorDestruccion$),
      map((seccionState) => {
       this.esFormularioSoloLectura = seccionState.readonly;
      })
    )
    .subscribe()
  }

  /**
   * @method ngOnInit
   * @description Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Configura todas las suscripciones, inicializa formularios, botones y datos de tabla.
   * Establece el estado inicial del componente basado en el store de estado.
   * 
   * Operaciones realizadas:
   * - Suscripción al estado del trámite 300105
   * - Configuración de botones para crosslist de movimientos
   * - Inicialización de datos de tabla de mercancías
   * - Creación del formulario de solicitud con validaciones
   * - Aplicación del modo de solo lectura si corresponde
   * 
   * @returns {void}
   * @memberof DatosSolicitudComponent
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
      .pipe(takeUntil(this.notificadorDestruccion$))
      .subscribe((state) => {
        this.estadoSolicitud300105 = state;
      });

    this.botonesMovimientos = OBTENER_BOTONES_CROSSLIST(
      this.crosslistComponent
    );

    this.datosTablaMercancia = this.estadoSolicitud300105.mercanciaTablaDatos;

    this.formularioSolicitud = this.formBuilder.group({
      observaciones: [this.estadoSolicitud300105.observaciones, Validators.maxLength(500)],
    });

    if(this.esFormularioSoloLectura){
      this.formularioSolicitud.disable();
    } else {
      this.formularioSolicitud.enable();
    }
  }

   /**
   * @method guardarObservaciones
   * @description Método para guardar el valor de observaciones en el store de estado.
   * Obtiene el valor actual del campo de observaciones del formulario y lo persiste
   * en el store global del trámite 300105.
   * 
   * @returns {void}
   * @memberof DatosSolicitudComponent
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // Se llama cuando el usuario modifica el campo de observaciones
   * this.guardarObservaciones();
   * ```
   */
   guardarObservaciones(): void {
    const VALOR = this.formularioSolicitud.get('observaciones')?.value;
    this.tramite300105Store.establecerDatos({observaciones : VALOR}); 
  }

  /**
   * @method crearNuevoFormularioMercancia
   * @description Método para inicializar el formulario de la solicitud.
   * Crea un nuevo formulario reactivo con los campos necesarios para capturar
   * información completa de equipos de rayos X, incluyendo todas las validaciones requeridas.
   * 
   * @param {ConfiguracionItem} [data] - Datos opcionales para precargar el formulario (usado en edición)
   * @returns {void}
   * @memberof DatosSolicitudComponent
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // Crear formulario vacío para nuevo equipo
   * this.crearNuevoFormularioMercancia();
   * 
   * // Crear formulario con datos existentes para edición
   * this.crearNuevoFormularioMercancia(equipoExistente);
   * ```
   */
  crearNuevoFormularioMercancia(data?: ConfiguracionItem): void {
    const DATOS_PREDETERMINADOS: ConfiguracionItem = {
      id: 0,
      marca: '',
      modelo: '',
      serie: '',
      voltaje: '',
      unidadMedidaVoltaje: '',
      corriente: '',
      unidadMedidaCorriente: '',
      numEquipos: '',
      fraccionArancelaria: '',
      fraccionDescripcion: '',
      ...data,
    };

    this.formularioMercancia = this.formBuilder.group({
      id: [DATOS_PREDETERMINADOS.id],
      marca: [DATOS_PREDETERMINADOS.marca, [Validators.required, Validators.maxLength(50)]],
      modelo: [DATOS_PREDETERMINADOS.modelo, [Validators.required, Validators.maxLength(100)]],
      serie: [DATOS_PREDETERMINADOS.serie, [Validators.required, Validators.maxLength(150)]],
      voltaje: [DATOS_PREDETERMINADOS.voltaje, [Validators.required, Validators.maxLength(11)]],
      unidadMedidaVoltaje: [DATOS_PREDETERMINADOS.unidadMedidaVoltaje, Validators.required],
      corriente: [DATOS_PREDETERMINADOS.corriente, [Validators.required, Validators.maxLength(11)]],
      unidadMedidaCorriente: [DATOS_PREDETERMINADOS.unidadMedidaCorriente, Validators.required],
      numEquipos: [DATOS_PREDETERMINADOS.numEquipos, [Validators.required, Validators.maxLength(2)]],
      fraccionArancelaria: [DATOS_PREDETERMINADOS.fraccionArancelaria, Validators.required],
      fraccionDescripcion: [DATOS_PREDETERMINADOS.fraccionDescripcion, Validators.required],
    });
    this.formularioMercancia.get('fraccionDescripcion')?.disable();
  }

  /**
   * @method manejarCambioFraccionArancelaria
   * @description Maneja el cambio en la fracción arancelaria seleccionada.
   * Busca la descripción correspondiente a la fracción seleccionada y actualiza
   * automáticamente el campo de descripción en el formulario.
   * 
   * @param {Catalogo} $event - Evento que contiene la información de la fracción arancelaria seleccionada
   * @returns {void}
   * @memberof DatosSolicitudComponent
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // Se ejecuta automáticamente cuando el usuario selecciona una fracción
   * this.manejarCambioFraccionArancelaria(eventoSeleccion);
   * ```
   */
  manejarCambioFraccionArancelaria($event: Catalogo): void {
    const FRACCION_DESCRIPCION =
      this.autorizacionDeRayosXService.fraccionArancelariaDescripcion.find(
        (item) => Number(item.id) === Number($event.descripcion)
      );
    this.formularioMercancia
      .get('fraccionDescripcion')
      ?.setValue(FRACCION_DESCRIPCION?.descripcion);
  }

  /**
   * @method manejarFilaSeleccionada
   * @description Maneja la fila seleccionada en la tabla de mercancías.
   * Actualiza el estado de los botones de acción (modificar/eliminar) basado
   * en la cantidad de elementos seleccionados y mantiene la referencia a los elementos seleccionados.
   * 
   * @param {ConfiguracionItem[]} fila - Array de filas seleccionadas en la tabla
   * @returns {void}
   * @memberof DatosSolicitudComponent
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // Se ejecuta cuando el usuario selecciona filas en la tabla
   * this.manejarFilaSeleccionada([equipoSeleccionado]);
   * ```
   */
  manejarFilaSeleccionada(fila: ConfiguracionItem[]): void {
    if (fila.length === 0) {
      this.enableModficarBoton = false;
      this.enableEliminarBoton = false;
      return;
    }
    this.listaFilaSeleccionadaMercancia = fila;
    this.filaSeleccionadaMercancia = fila[fila.length - 1];
    this.enableModficarBoton = true;
    this.enableEliminarBoton = true;
  }

  /**
   * @method actualizarFilaSeleccionada
   * @description Actualiza la fila seleccionada con los datos más recientes de la tabla.
   * Busca los datos actualizados en la tabla principal y sincroniza la referencia
   * de la fila seleccionada con la información más actual.
   * 
   * @returns {void}
   * @memberof DatosSolicitudComponent
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // Se llama antes de modificar para asegurar datos actualizados
   * this.actualizarFilaSeleccionada();
   * ```
   */
  actualizarFilaSeleccionada(): void {
    const DATOS_ACTUALIZADOS = this.datosTablaMercancia.find(
      (item) => item.id === this.filaSeleccionadaMercancia.id
    );

    if (DATOS_ACTUALIZADOS) {
      this.filaSeleccionadaMercancia = { ...DATOS_ACTUALIZADOS };
    }
  }

  /**
   * @method modificarItemMercancia
   * @description Modifica los datos de una fila seleccionada en la tabla de mercancías.
   * Actualiza el formulario de mercancía con los datos de la fila seleccionada
   * y abre el modal para editar los datos. Valida que solo se seleccione un elemento para modificación.
   * 
   * Funcionalidad:
   * - Verifica que solo haya un elemento seleccionado
   * - Convierte índices de catálogos a valores de formulario
   * - Precarga el formulario con datos existentes
   * - Abre el modal de edición
   * - Muestra popup de advertencia si hay selección múltiple
   * 
   * @returns {void}
   * @memberof DatosSolicitudComponent
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // Se ejecuta cuando el usuario hace clic en modificar
   * this.modificarItemMercancia();
   * ```
   */
  modificarItemMercancia(): void {
    if (this.listaFilaSeleccionadaMercancia.length < 2) {
      const OBTENER_INDICE = (array: Catalogo[], value: string): number =>
        array.findIndex((item) => item.descripcion === value) + 1;
      
      this.actualizarFilaSeleccionada();
      this.esOperacionDeActualizacion = true;
      const FRACCION_DESCRIPCION =
        this.autorizacionDeRayosXService.fraccionArancelariaDescripcion.find((item)=>Number(item.id) === Number(this.filaSeleccionadaMercancia.fraccionArancelaria))?.descripcion || '';

        const MERCANCIA_CONFIGURACION_ITEM: ConfiguracionItem = {
        id: this.filaSeleccionadaMercancia.id,
        marca: this.filaSeleccionadaMercancia.marca,
        modelo: this.filaSeleccionadaMercancia.modelo,
        serie: this.filaSeleccionadaMercancia.serie,
        voltaje: this.filaSeleccionadaMercancia.voltaje,
        unidadMedidaVoltaje: OBTENER_INDICE(
          this.autorizacionDeRayosXService.unidadMedidaVoltaje,
          this.filaSeleccionadaMercancia.unidadMedidaVoltaje
        ).toString(),
        corriente: this.filaSeleccionadaMercancia.corriente,
        unidadMedidaCorriente: OBTENER_INDICE(
          this.autorizacionDeRayosXService.unidadMedidaCorriente,
          this.filaSeleccionadaMercancia.unidadMedidaCorriente
        ).toString(),        
        fraccionArancelaria: OBTENER_INDICE(
          this.autorizacionDeRayosXService.fraccionArancelaria,
          this.filaSeleccionadaMercancia.fraccionArancelaria
        ).toString(),
        fraccionDescripcion:FRACCION_DESCRIPCION,
        numEquipos: this.filaSeleccionadaMercancia.numEquipos, 
      };

      this.crearNuevoFormularioMercancia(MERCANCIA_CONFIGURACION_ITEM);
      this.alternarModalMercancia();
    } else {
      this.abrirMultipleSeleccionPopup();
    }
  }

  /**
   * @method confirmEliminarMercanciaItem
   * @description Confirma la eliminación de los elementos seleccionados en la tabla de mercancías.
   * Si no hay elementos seleccionados, no realiza ninguna acción.
   * Si hay elementos seleccionados, abre el popup de confirmación de eliminación.
   * 
   * @returns {void}
   * @memberof DatosSolicitudComponent
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // Se ejecuta cuando el usuario hace clic en eliminar
   * this.confirmEliminarMercanciaItem();
   * ```
   */
  confirmEliminarMercanciaItem(): void {
    if (this.listaFilaSeleccionadaMercancia.length === 0) {
      return;
    }
    this.abrirElimninarConfirmationopup();
  }

  /**
   * @method eliminarMercanciaItem
   * @description Filtra y elimina los elementos seleccionados de la tabla de mercancías.
   * Actualiza el estado del almacén y cierra el popup de confirmación de eliminación.
   * Realiza la eliminación definitiva después de la confirmación del usuario.
   * 
   * Operaciones realizadas:
   * - Extrae los IDs de los elementos a eliminar
   * - Filtra la tabla para remover los elementos seleccionados
   * - Limpia la lista de selección
   * - Actualiza el store con los nuevos datos
   * - Cierra el popup de confirmación
   * 
   * @returns {void}
   * @memberof DatosSolicitudComponent
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // Se ejecuta cuando el usuario confirma la eliminación
   * this.eliminarMercanciaItem();
   * ```
   */
  eliminarMercanciaItem(): void {
    const IDS_TO_DELETE = this.listaFilaSeleccionadaMercancia.map(
      (item) => item.id
    );

    this.datosTablaMercancia = this.datosTablaMercancia.filter(
      (item) => !IDS_TO_DELETE.includes(item.id)
    );

    this.listaFilaSeleccionadaMercancia = [];
    this.tramite300105Store.setMercanciaTablaDatos(this.datosTablaMercancia);
    this.cerrarEliminarConfirmationPopup();
  }

  /**
   * @method mostrarNotificacionSerieAgregada
   * @description Muestra notificación después de agregar un número de serie.
   * Configura y muestra un popup de éxito informando al usuario que el número de serie
   * fue agregado correctamente a la tabla.
   * 
   * @returns {void}
   * @memberof DatosSolicitudComponent
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // Se ejecuta después de agregar una serie exitosamente
   * this.mostrarNotificacionSerieAgregada();
   * ```
   */
  mostrarNotificacionSerieAgregada(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.EXITO,
      modo: 'modal',
      titulo: '',
      mensaje: 'Número de serie agregado',
      cerrar: false,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
    this.serieAgregadaPopupAbierto = true;
  }

  /**
   * @method cerrarSerieAgregadaPopup
   * @description Cierra el popup de serie agregada.
   * Cambia el estado del flag para ocultar el modal de confirmación de serie agregada.
   * 
   * @returns {void}
   * @memberof DatosSolicitudComponent
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // Se ejecuta cuando el usuario cierra el popup
   * this.cerrarSerieAgregadaPopup();
   * ```
   */
  cerrarSerieAgregadaPopup(): void {
    this.serieAgregadaPopupAbierto = false;
  }

  /**
   * @method mostrarNotificacionMercanciaAgregada
   * @description Muestra notificación después de guardar la mercancía.
   * Configura y muestra un popup de éxito informando al usuario que la mercancía
   * fue agregada correctamente a la tabla.
   * 
   * @returns {void}
   * @memberof DatosSolicitudComponent
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // Se ejecuta después de guardar una mercancía exitosamente
   * this.mostrarNotificacionMercanciaAgregada();
   * ```
   */
  mostrarNotificacionMercanciaAgregada(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.EXITO,
      modo: 'modal',
      titulo: '',
      mensaje: 'La mercancia fue agregada correctamente.',
      cerrar: false,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
    this.mercanciaAgregadaPopupAbierto = true;
  }

  /**
   * @method cerrarMercanciaAgregadaPopup
   * @description Cierra el popup de mercancía agregada.
   * Cambia el estado del flag para ocultar el modal de confirmación y cierra también
   * el modal principal de datos de mercancía.
   * 
   * @returns {void}
   * @memberof DatosSolicitudComponent
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // Se ejecuta cuando el usuario cierra el popup de confirmación
   * this.cerrarMercanciaAgregadaPopup();
   * ```
   */
  cerrarMercanciaAgregadaPopup(): void {
    this.mercanciaAgregadaPopupAbierto = false;
    this.alternarModalMercancia();
  }
  
/**
 * @method abrirMultipleSeleccionPopup
 * @description Abre el popup de selección múltiple si el botón de modificar está habilitado.
 * Muestra una advertencia al usuario cuando intenta modificar múltiples elementos simultáneamente,
 * lo cual no está permitido en la aplicación.
 * 
 * @returns {void}
 * @memberof DatosSolicitudComponent
 * @since 1.0.0
 * 
 * @example
 * ```typescript
 * // Se ejecuta cuando el usuario intenta modificar múltiples elementos
 * this.abrirMultipleSeleccionPopup();
 * ```
 */
  abrirMultipleSeleccionPopup(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ERROR,
      modo: 'modal',
      titulo: 'Aviso',
      mensaje: 'Selecciona sólo un registro para modificar.',
      cerrar: false,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
    if (this.enableModficarBoton) {
      this.multipleSeleccionPopupAbierto = true;
    }
  }

  /**
   * @method cerrarMultipleSeleccionPopup
   * @description Cierra el popup de selección múltiple.
   * Actualiza los flags de estado para ocultar el modal de advertencia de selección múltiple.
   * 
   * @returns {void}
   * @memberof DatosSolicitudComponent
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // Se ejecuta cuando el usuario cierra el popup de advertencia
   * this.cerrarMultipleSeleccionPopup();
   * ```
   */
  cerrarMultipleSeleccionPopup(): void {
    this.multipleSeleccionPopupAbierto = false;
    this.multipleSeleccionPopupCerrado = false;
  }

  /**
   * @method abrirElimninarConfirmationopup
   * @description Abre el popup de confirmación de eliminación.
   * Muestra un modal de confirmación preguntando al usuario si está seguro
   * de eliminar los registros marcados en la tabla.
   * 
   * @returns {void}
   * @memberof DatosSolicitudComponent
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // Se ejecuta cuando el usuario hace clic en eliminar
   * this.abrirElimninarConfirmationopup();
   * ```
   */
  abrirElimninarConfirmationopup(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ERROR,
      modo: 'modal',
      titulo: 'Aviso',
      mensaje: '¿Estás seguro que deseas eliminar los registros marcados?',
      cerrar: false,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: 'Cancelar',
    };
    this.confirmEliminarPopupAbierto = true;
  }

  /**
   * @method cerrarEliminarConfirmationPopup
   * @description Cierra el popup de confirmación de eliminación.
   * Actualiza los flags de estado para ocultar el modal de confirmación de eliminación.
   * 
   * @returns {void}
   * @memberof DatosSolicitudComponent
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // Se ejecuta cuando el usuario cancela la eliminación
   * this.cerrarEliminarConfirmationPopup();
   * ```
   */
  cerrarEliminarConfirmationPopup(): void {
    this.confirmEliminarPopupAbierto = false;
    this.confirmEliminarPopupCerrado = false;
  }

  /**
   * @method alternarModalMercancia
   * @description Alterna la visibilidad del modal de datos de mercancía.
   * Cambia el estado del flag que controla si el modal de captura/edición
   * de datos de mercancía está visible o no.
   * 
   * @returns {void}
   * @memberof DatosSolicitudComponent
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // Se ejecuta para abrir o cerrar el modal
   * this.alternarModalMercancia();
   * ```
   */
  alternarModalMercancia(): void {
    this.mostrarModalDatosMercancia = !this.mostrarModalDatosMercancia;
  }

  /**
   * @method mostrarFormularioMercanciaModal
   * @description Muestra el formulario de mercancía en un modal.
   * Prepara el componente para agregar una nueva mercancía inicializando
   * los catálogos, creando un formulario limpio y abriendo el modal.
   * 
   * Operaciones realizadas:
   * - Establece el modo de operación como creación (no actualización)
   * - Inicializa los catálogos de datos de mercancía
   * - Crea un formulario nuevo sin datos previos
   * - Abre el modal de captura
   * 
   * @returns {void}
   * @memberof DatosSolicitudComponent
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // Se ejecuta cuando el usuario hace clic en "Agregar Nueva Mercancía"
   * this.mostrarFormularioMercanciaModal();
   * ```
   */
  mostrarFormularioMercanciaModal(): void {
    this.esOperacionDeActualizacion = false;
    this.autorizacionDeRayosXService.inicializaMercanciaDatosCatalogos();
    this.crearNuevoFormularioMercancia();
    this.alternarModalMercancia();
  }

  /**
   * @method esControlInvalido
   * @description Valida si un control del formulario es inválido.
   * Verifica el estado de validación de un campo específico del formulario
   * y determina si debe mostrarse como inválido en la interfaz.
   * 
   * @param {string} formControlName - Nombre del control del formulario a validar
   * @returns {boolean} `true` si el control es inválido y ha sido tocado o modificado, de lo contrario `false`
   * @memberof DatosSolicitudComponent
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // Verificar si el campo marca es inválido
   * const esInvalido = this.esControlInvalido('marca');
   * 
   * // En el template HTML
   * <input [class.is-invalid]="esControlInvalido('marca')">
   * ```
   */
  esControlInvalido(formControlName: string): boolean {
    const CONTROL = this.formularioMercancia.get(formControlName);
    return CONTROL
      ? CONTROL.invalid && (CONTROL.touched || CONTROL.dirty)
      : false;
  }

  /**
   * @method enviarFormularioMercancia
   * @description Envía los datos del formulario de mercancía.
   * Valida el formulario, actualiza o agrega una nueva fila en la tabla de mercancías,
   * y actualiza el estado del almacén correspondiente. Maneja tanto operaciones de
   * creación como de actualización de mercancías.
   * 
   * Funcionalidad completa:
   * - Convierte valores de formulario a descripciones de catálogo
   * - Crea objeto de configuración con todos los datos del equipo
   * - Determina si es actualización o creación nueva
   * - Actualiza la tabla de datos localmente
   * - Persiste los cambios en el store global
   * - Resetea el formulario después del guardado
   * - Muestra notificación apropiada según el tipo de operación
   * 
   * @param {boolean} isAgregar - Indica si es una operación de agregar (true) o guardar final (false)
   * @returns {void}
   * @memberof DatosSolicitudComponent
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // Agregar otra mercancía (mantiene modal abierto)
   * this.enviarFormularioMercancia(true);
   * 
   * // Guardar y cerrar modal
   * this.enviarFormularioMercancia(false);
   * ```
   */
  enviarFormularioMercancia(isAgregar: boolean): void {
    const OBTENER_DESCRIPCION = (array: Catalogo[], index: number): string => array[index - 1]?.descripcion || '';
  
    const TABLA_ROW: ConfiguracionItem = {
      id: this.esOperacionDeActualizacion
        ? this.formularioMercancia.get('id')?.value
        : this.datosTablaMercancia.length + 1,
      marca: this.formularioMercancia.get('marca')?.value,
      modelo: this.formularioMercancia.get('modelo')?.value,
      serie: this.formularioMercancia.get('serie')?.value,
      voltaje: this.formularioMercancia.get('voltaje')?.value,
      unidadMedidaVoltaje: OBTENER_DESCRIPCION(
        this.autorizacionDeRayosXService.unidadMedidaVoltaje,
        this.formularioMercancia.get('unidadMedidaVoltaje')?.value
      ),
      corriente: this.formularioMercancia.get('corriente')?.value,
      unidadMedidaCorriente: OBTENER_DESCRIPCION(
        this.autorizacionDeRayosXService.unidadMedidaCorriente,
        this.formularioMercancia.get('unidadMedidaCorriente')?.value
      ),
      fraccionArancelaria: OBTENER_DESCRIPCION(
        this.autorizacionDeRayosXService.fraccionArancelaria,
        this.formularioMercancia.get('fraccionArancelaria')?.value
      ),
      fraccionDescripcion: this.formularioMercancia.get('fraccionDescripcion')?.value,
      numEquipos: this.formularioMercancia.get('numEquipos')?.value,
    };
  
    const EXISTING_INDEX = this.datosTablaMercancia.findIndex(item => item.id === TABLA_ROW.id);
  
    if (EXISTING_INDEX > -1) {
      this.datosTablaMercancia[EXISTING_INDEX] = TABLA_ROW;
    } else {
      this.datosTablaMercancia = [...this.datosTablaMercancia, TABLA_ROW];
    }
    
    this.tramite300105Store.setMercanciaTablaDatos(this.datosTablaMercancia);
    this.formularioMercancia.reset();
    if (isAgregar) {
      this.mostrarNotificacionSerieAgregada();
    } else {
      this.mostrarNotificacionMercanciaAgregada();
    }
  }

  /**
   * @method ngOnDestroy
   * @description Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Maneja la limpieza de recursos para evitar fugas de memoria, especialmente
   * la cancelación de todas las suscripciones activas.
   * 
   * Operaciones de limpieza:
   * - Emite señal de destrucción para cancelar suscripciones
   * - Completa el Subject de notificación de destrucción
   * - Libera recursos y previene fugas de memoria
   * 
   * @returns {void}
   * @memberof DatosSolicitudComponent
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // Se ejecuta automáticamente por Angular
   * // No se llama directamente en el código de aplicación
   * ```
   */
  ngOnDestroy(): void {
    this.notificadorDestruccion$.next();
    this.notificadorDestruccion$.complete();
  }
}
