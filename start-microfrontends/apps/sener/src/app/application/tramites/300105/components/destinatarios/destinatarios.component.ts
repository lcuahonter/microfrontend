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
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  CrosslistBoton,
  OBTENER_BOTONES_CROSSLIST,
} from '../../enum/botons.enum';
import { DESTINATARIO_TABLA_CONFIGURACION, DestinatarioConfiguracionItem, MERCANCIA_TABLA_CONFIGURACION, MercanciaConfiguracionItem } from '../../enum/destinatario-tabla.enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import {
  Tramite300105State,
  Tramite300105Store,
} from '../../estados/tramite300105.store';
import { AutorizacionDeRayosXService } from '../../services/autorizacion-de-rayos-x.service';
import { Tramite300105Query } from '../../estados/tramite300105.query';

/**
 * @class DestinatariosComponent
 * @description Componente Angular responsable de gestionar la información de destinatarios
 * para el trámite 300105 de autorización de equipos de rayos X. Este componente maneja
 * formularios reactivos para captura de datos de destinatarios, tablas dinámicas con
 * selección múltiple, relación de mercancías, y la integración completa con servicios
 * de autorización y el store de estado global.
 * 
 * Funcionalidades principales:
 * - Gestión CRUD completa de destinatarios (crear, leer, actualizar, eliminar)
 * - Formularios reactivos con validaciones para datos de destinatarios
 * - Manejo de tablas dinámicas con selección múltiple
 * - Relación de mercancías con destinatarios específicos
 * - Gestión de catálogos desplegables (países, tipos de mercancía)
 * - Control de estados de solo lectura según permisos del usuario
 * - Notificaciones y confirmaciones de usuario
 * - Integración con crosslist para listas dinámicas
 * 
 * @implements {OnInit} - Interfaz para inicialización del componente
 * @implements {OnDestroy} - Interfaz para limpieza de recursos al destruir el componente
 * 
 * @example
 * ```html
 * <app-destinatarios></app-destinatarios>
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
  selector: 'app-destinatarios',
  
  /**
   * @property {string} templateUrl - Ruta relativa al archivo de plantilla HTML del componente
   * @description Especifica la ubicación del archivo HTML que define la vista del componente
   */
  templateUrl: './destinatarios.component.html',
  
  /**
   * @property {string[]} styleUrls - Array de rutas a los archivos de estilos CSS/SCSS del componente
   * @description Define los archivos de estilos específicos que se aplicarán a este componente
   */
  styleUrls: ['./destinatarios.component.scss'],
})
export class DestinatariosComponent implements OnInit, OnDestroy {
  /**
   * @property {CrosslistComponent} crosslistComponent - Referencia al componente Crosslist para gestionar listas dinámicas
   * @description ViewChild que proporciona acceso directo al componente CrosslistComponent
   * para manejar operaciones de listas dinámicas como aduanas y movimientos en el contexto de destinatarios.
   * @viewChild
   * @example
   * ```typescript
   * this.crosslistComponent.agregarItem(nuevoDestinatario);
   * ```
   */
  @ViewChild(CrosslistComponent) crosslistComponent!: CrosslistComponent;

  /**
   * @property {FormGroup} formularioSolicitud - Formulario reactivo para los datos de la solicitud
   * @description FormGroup que contiene los controles para capturar datos generales de la solicitud
   * relacionados con destinatarios. Utiliza validaciones de Angular Reactive Forms.
   * @example
   * ```typescript
   * this.formularioSolicitud.get('campo')?.setValue('valor');
   * ```
   */
  formularioSolicitud!: FormGroup;

  /**
   * @property {FormGroup} formularioMercancia - Formulario reactivo para los datos de la mercancía
   * @description FormGroup que gestiona todos los campos relacionados con la información
   * de destinatarios: denominación/razón social, domicilio, país, correo, página web y tipo de mercancía.
   * Incluye validaciones específicas para cada campo de destinatario.
   * @example
   * ```typescript
   * this.formularioMercancia.get('denominacionRazon')?.setValue('Empresa ABC S.A.');
   * ```
   */
  formularioMercancia!: FormGroup;

  /**
   * @property {Tramite300105State} estadoSolicitud300105 - Estado actual de la solicitud
   * @description Objeto que contiene todo el estado actual del trámite 300105,
   * incluyendo datos de formularios, tablas de destinatarios, configuraciones y flags de estado.
   * Se actualiza mediante suscripción al store de estado.
   */
  estadoSolicitud300105!: Tramite300105State;

  /**
   * @property {CrosslistBoton[]} botonesAduanas - Botones configurados para la lista dinámica de aduanas
   * @description Array de configuración de botones que se muestran en el componente
   * crosslist para la gestión de aduanas relacionadas con destinatarios.
   */
  botonesAduanas!: CrosslistBoton[];

  /**
   * @property {string[]} listaOriginalAduanas - Lista original de aduanas disponibles
   * @description Array que contiene todas las aduanas disponibles del catálogo,
   * utilizada como fuente de datos para relacionar con destinatarios específicos.
   * @default []
   */
  listaOriginalAduanas: string[] = [];

  /**
   * @property {string[]} listaSeleccionadaAduanas - Lista de aduanas seleccionadas
   * @description Array que mantiene las aduanas que el usuario ha seleccionado
   * para asociar con los destinatarios en la solicitud.
   * @default []
   */
  listaSeleccionadaAduanas: string[] = [];

  /**
   * @property {CrosslistBoton[]} botonesMovimientos - Botones configurados para la lista dinámica de movimientos
   * @description Array de configuración de botones específicos para la gestión
   * de movimientos relacionados con destinatarios en el componente crosslist.
   */
  botonesMovimientos!: CrosslistBoton[];

  /**
   * @property {string[]} listaOriginalMovimientos - Lista original de movimientos disponibles
   * @description Array que contiene todos los tipos de movimientos disponibles del catálogo,
   * utilizada para asociar operaciones específicas con destinatarios.
   * @default []
   */
  listaOriginalMovimientos: string[] = [];

  /**
   * @property {string[]} listSeleccionadaMovimientos - Lista de movimientos seleccionados
   * @description Array que mantiene los tipos de movimientos que el usuario ha seleccionado
   * para asociar con los destinatarios de la solicitud.
   * @default []
   */
  listSeleccionadaMovimientos: string[] = [];

  /**
   * @property {ConfiguracionColumna<DestinatarioConfiguracionItem>[]} configuracionTabla - Configuración de las columnas para la tabla
   * @description Array que define la estructura y configuración de las columnas de la tabla
   * de destinatarios, incluyendo títulos, tipos de datos, ordenamiento y formato de visualización.
   * Utiliza la configuración predefinida DESTINATARIO_TABLA_CONFIGURACION.
   */
  configuracionTabla: ConfiguracionColumna<DestinatarioConfiguracionItem>[] =
  DESTINATARIO_TABLA_CONFIGURACION;

  /**
   * @property {ConfiguracionColumna<MercanciaConfiguracionItem>[]} mercanciaTabla - Configuración de las columnas para la tabla de mercancías
   * @description Array que define la estructura y configuración de las columnas de la tabla
   * de mercancías asociadas a destinatarios. Esta propiedad define la configuración de las columnas que se 
   * utilizarán en la tabla de mercancías dentro del componente destinatarios.
   * Utiliza la configuración predefinida MERCANCIA_TABLA_CONFIGURACION.
   */
  mercanciaTabla: ConfiguracionColumna<MercanciaConfiguracionItem>[] =
  MERCANCIA_TABLA_CONFIGURACION;

  /**
   * @property {TablaSeleccion} tipoSeleccionTabla - Tipo de selección para la tabla dinámica
   * @description Define el tipo de selección permitida en las tablas del componente.
   * Utiliza TablaSeleccion.CHECKBOX para permitir selección múltiple mediante checkboxes.
   */
  tipoSeleccionTabla = TablaSeleccion.CHECKBOX;

  /**
   * @property {DestinatarioConfiguracionItem[]} datosTablaDestinatario - Datos de la tabla de destinatario
   * @description Array que contiene todos los registros de destinatarios que se muestran
   * en la tabla principal. Cada elemento representa un destinatario con su información completa.
   */
  datosTablaDestinatario!: DestinatarioConfiguracionItem[];

  /**
   * @property {MercanciaConfiguracionItem[]} datosMercanciaTablaMercancia - Datos de la tabla de mercancías
   * @description Array que contiene los datos de mercancías asociadas a destinatarios
   * específicos, utilizado para la relación entre mercancías y destinatarios.
   */
  datosMercanciaTablaMercancia!: MercanciaConfiguracionItem[];

  /**
   * @property {DestinatarioConfiguracionItem} filaSeleccionadaMercancia - Fila seleccionada en la tabla de mercancías
   * @description Objeto que contiene los datos del destinatario actualmente seleccionado
   * en la tabla. Se actualiza cuando el usuario hace clic en una fila.
   */
  filaSeleccionadaMercancia!: DestinatarioConfiguracionItem;

  /**
   * @property {DestinatarioConfiguracionItem[]} listaFilaSeleccionadaMercancia - Lista de filas seleccionadas en la tabla de mercancías
   * @description Array que mantiene todos los destinatarios que el usuario ha seleccionado
   * en la tabla. Permite operaciones en lote como eliminación múltiple.
   */
  listaFilaSeleccionadaMercancia!: DestinatarioConfiguracionItem[];

  /**
   * @property {boolean} enableModficarBoton - Indica si un archivo está seleccionado
   * @description Flag que habilita o deshabilita el botón de modificar basado en
   * si hay destinatarios seleccionados en la tabla. Se actualiza dinámicamente.
   * @default false
   */
  enableModficarBoton: boolean = false;

  /**
   * @property {boolean} mostrarModalDatosMercancia - Indica si se debe mostrar el modal de datos de mercancía
   * @description Flag que controla la visibilidad del modal para agregar o editar
   * datos de destinatarios. Se alterna mediante la función alternarModalMercancia().
   * @default false
   */
  mostrarModalDatosMercancia: boolean = false;

  /**
   * @property {boolean} mostrarPopupSeleccionMultiple - Indica si se debe mostrar el popup de selección múltiple
   * @description Flag que controla la visibilidad del popup que advierte al usuario
   * cuando intenta modificar múltiples destinatarios seleccionados simultáneamente.
   * @default false
   */
  mostrarPopupSeleccionMultiple: boolean = false;

  /**
   * @property {boolean} multipleSeleccionPopupAbierto - Indica si el popup está abierto
   * @description Flag que controla el estado de apertura del popup de selección múltiple.
   * Se utiliza para mostrar notificaciones cuando se seleccionan varios destinatarios.
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
   * Se muestra cuando el usuario intenta eliminar uno o más destinatarios de la tabla.
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
   * @property {boolean} enableEliminarBoton - Indica si el botón de eliminar está habilitado
   * @description Flag que habilita o deshabilita el botón de eliminar basado en
   * si hay destinatarios seleccionados en la tabla. Se actualiza dinámicamente con las selecciones.
   * @default false
   */
  enableEliminarBoton: boolean = false;

  /**
   * @property {Notificacion} nuevaNotificacion - Notificación que se muestra al usuario
   * @description Objeto que contiene la configuración completa de las notificaciones
   * que se muestran al usuario (éxito, error, advertencia, etc.) relacionadas con operaciones de destinatarios.
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
   * en el formulario de destinatarios. Afecta el comportamiento del guardado y validaciones.
   * @default false
   */
  esOperacionDeActualizacion: boolean = false;

  /**
   * @property {boolean} relacionMercanciaPopupAbierto - Indica si el popup de relación de mercancía está abierto
   * @description Flag que controla la visibilidad del popup de confirmación que se muestra
   * después de relacionar exitosamente una mercancía con un destinatario.
   * @default false
   */
  relacionMercanciaPopupAbierto: boolean = false;

  /**
   * @property {boolean} esFormularioSoloLectura - Indica si el formulario está en modo solo lectura
   * @description Flag que determina si todos los controles del formulario deben estar deshabilitados.
   * Cuando es `true`, los campos del formulario no se pueden editar, útil para consultas
   * o cuando el usuario no tiene permisos de modificación sobre destinatarios.
   * @default false
   */
  esFormularioSoloLectura: boolean = false; 

  /**
   * @constructor
   * @description Constructor del componente DestinatariosComponent.
   * Inicializa todas las dependencias necesarias y configura la suscripción al estado de solo lectura.
   * Establece la configuración inicial del formulario basada en los permisos del usuario para
   * la gestión de destinatarios.
   * 
   * @param {AutorizacionDeRayosXService} autorizacionDeRayosXService - Servicio para manejar datos relacionados con autorizaciones de equipos de rayos X y catálogos de destinatarios
   * @param {Tramite300105Store} tramite300105Store - Almacén de estado para el trámite 300105, maneja persistencia de datos de destinatarios
   * @param {Tramite300105Query} tramite300105Query - Consulta de estado para el trámite 300105, proporciona acceso reactivo al estado
   * @param {FormBuilder} formBuilder - Constructor de formularios reactivos de Angular para destinatarios
   * @param {ConsultaioQuery} consultaioQuery - Servicio de consulta para obtener el estado de solo lectura y permisos
   * 
   * @example
   * ```typescript
   * // El constructor se invoca automáticamente por Angular DI
   * // No se llama directamente en el código de aplicación
   * ```
   * 
   * @memberof DestinatariosComponent
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
       * Esta suscripción maneja automáticamente el modo de solo lectura del componente basado en los permisos del usuario
       * para la gestión de destinatarios.
       * 
       * Operaciones realizadas:
       * - Asigna el valor de solo lectura (`readonly`) a la propiedad `esFormularioSoloLectura`
       * - Por defecto establece modo solo lectura (|| true) para destinatarios
       * - La suscripción se cancela automáticamente cuando `notificadorDestruccion$` emite un valor (para evitar fugas de memoria)
       * 
       * @since 1.0.0
       */
      this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.notificadorDestruccion$),
        map((seccionState) => {
         this.esFormularioSoloLectura = seccionState.readonly || true;
        })
      )
      .subscribe()
  }

  /**
   * @method ngOnInit
   * @description Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Configura todas las suscripciones, inicializa botones y datos de tabla de destinatarios.
   * Establece el estado inicial del componente basado en el store de estado.
   * 
   * Operaciones realizadas:
   * - Suscripción al estado del trámite 300105 para destinatarios
   * - Configuración de botones para crosslist de movimientos
   * - Inicialización de datos de tabla de destinatarios desde el estado
   * 
   * @returns {void}
   * @memberof DestinatariosComponent
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

    this.datosTablaDestinatario = this.estadoSolicitud300105.destinatarioTablaDatos;
  }

  /**
   * @method crearNuevoFormularioMercancia
   * @description Crea un nuevo formulario para la mercancía asociada a destinatarios.
   * Inicializa un FormGroup con todos los campos necesarios para capturar información
   * completa de destinatarios, incluyendo validaciones requeridas para cada campo.
   * 
   * @param {DestinatarioConfiguracionItem} [data] - Datos opcionales para inicializar el formulario.
   * Si no se proporciona, se utilizarán valores predeterminados vacíos.
   * 
   * Campos del formulario:
   * - denominacionRazon: Nombre o razón social del destinatario (requerido)
   * - domicilio: Dirección completa del destinatario (requerido)
   * - pais: País del destinatario (requerido)
   * - correo: Correo electrónico del destinatario (requerido)
   * - paginaWeb: Sitio web del destinatario (requerido)
   * - tipoMercancia: Tipo de mercancía que maneja el destinatario (requerido)
   * 
   * @returns {void}
   * @memberof DestinatariosComponent
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // Crear formulario vacío para nuevo destinatario
   * this.crearNuevoFormularioMercancia();
   * 
   * // Crear formulario con datos existentes para edición
   * this.crearNuevoFormularioMercancia(destinatarioExistente);
   * ```
   */
  crearNuevoFormularioMercancia(data?: DestinatarioConfiguracionItem): void {
    const DATOS_PREDETERMINADOS: DestinatarioConfiguracionItem = {
      id: 0,
      denominacionRazon: '',
      domicilio: '',
      pais: '',
      correo: '',
      paginaWeb: '',
      tipoMercancia: '',
      ...data,
    };

    this.formularioMercancia = this.formBuilder.group({
      id: [DATOS_PREDETERMINADOS.id],
      denominacionRazon: [
        DATOS_PREDETERMINADOS.denominacionRazon,
        [Validators.required],
      ],
      domicilio: [DATOS_PREDETERMINADOS.domicilio, [Validators.required]],
      pais: [DATOS_PREDETERMINADOS.pais, [Validators.required]],
      correo: [
        DATOS_PREDETERMINADOS.correo,
        [Validators.required],
      ],
      paginaWeb: [DATOS_PREDETERMINADOS.paginaWeb, [Validators.required]],
      tipoMercancia: [
        DATOS_PREDETERMINADOS.tipoMercancia,
        [Validators.required],
      ]
    });
  }

  /**
   * @method manejarCambioFraccionArancelaria
   * @description Maneja el cambio en la fracción arancelaria seleccionada.
   * Busca la descripción correspondiente a la fracción seleccionada y actualiza
   * automáticamente el campo de descripción en el formulario de destinatarios.
   * 
   * @param {Catalogo} $event - Evento que contiene la información de la fracción arancelaria seleccionada
   * @returns {void}
   * @memberof DestinatariosComponent
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
   * @description Maneja la fila seleccionada en la tabla de destinatarios.
   * Actualiza el estado de los botones de acción (modificar/eliminar) basado
   * en la cantidad de destinatarios seleccionados y mantiene la referencia a los elementos seleccionados.
   * 
   * @param {DestinatarioConfiguracionItem[]} fila - Array de filas seleccionadas en la tabla de destinatarios
   * @returns {void}
   * @memberof DestinatariosComponent
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // Se ejecuta cuando el usuario selecciona filas en la tabla
   * this.manejarFilaSeleccionada([destinatarioSeleccionado]);
   * ```
   */
  manejarFilaSeleccionada(fila: DestinatarioConfiguracionItem[]): void {
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
   * Busca los datos actualizados en la tabla principal de destinatarios y sincroniza la referencia
   * de la fila seleccionada con la información más actual.
   * 
   * @returns {void}
   * @memberof DestinatariosComponent
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // Se llama antes de modificar para asegurar datos actualizados
   * this.actualizarFilaSeleccionada();
   * ```
   */
  actualizarFilaSeleccionada(): void {
    const DATOS_ACTUALIZADOS = this.datosTablaDestinatario.find(
      (item) => item.id === this.filaSeleccionadaMercancia.id
    );

    if (DATOS_ACTUALIZADOS) {
      this.filaSeleccionadaMercancia = { ...DATOS_ACTUALIZADOS };
    }
  }

  /**
   * @method modificarItemMercancia
   * @description Modifica los datos de una fila seleccionada en la tabla de destinatarios.
   * Actualiza el formulario de mercancía con los datos de la fila seleccionada
   * y abre el modal para editar los datos. Valida que solo se seleccione un destinatario para modificación.
   * 
   * Funcionalidad:
   * - Verifica que solo haya un destinatario seleccionado
   * - Convierte índices de catálogos a valores de formulario
   * - Precarga el formulario con datos existentes del destinatario
   * - Abre el modal de edición
   * - Muestra popup de advertencia si hay selección múltiple
   * 
   * @returns {void}
   * @memberof DestinatariosComponent
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // Se ejecuta cuando el usuario hace clic en modificar destinatario
   * this.modificarItemMercancia();
   * ```
   */
  modificarItemMercancia(): void {
    if (this.listaFilaSeleccionadaMercancia.length < 2) {
      const OBTENER_INDICE = (array: Catalogo[], value: string): number =>
        array.findIndex((item) => item.descripcion === value) + 1;
      
      this.actualizarFilaSeleccionada();
      this.esOperacionDeActualizacion = true;
        const DESTINATARIO_CONFIGURACION_ITEM: DestinatarioConfiguracionItem = {
        denominacionRazon: this.filaSeleccionadaMercancia.denominacionRazon,
        domicilio: this.filaSeleccionadaMercancia.domicilio,
        pais: OBTENER_INDICE(
          this.autorizacionDeRayosXService.pais,
          this.filaSeleccionadaMercancia.pais
        ).toString(),
        correo: this.filaSeleccionadaMercancia.correo,
        paginaWeb: this.filaSeleccionadaMercancia.paginaWeb,
        tipoMercancia: this.filaSeleccionadaMercancia.tipoMercancia,
      };

      this.crearNuevoFormularioMercancia(DESTINATARIO_CONFIGURACION_ITEM);
      this.alternarModalMercancia();
    } else {
      this.abrirMultipleSeleccionPopup();
    }
  }

  /**
   * @method confirmEliminarMercanciaItem
   * @description Confirma la eliminación de los elementos seleccionados en la tabla de destinatarios.
   * Si no hay elementos seleccionados, no realiza ninguna acción.
   * Si hay elementos seleccionados, abre el popup de confirmación de eliminación.
   * 
   * @returns {void}
   * @memberof DestinatariosComponent
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // Se ejecuta cuando el usuario hace clic en eliminar destinatarios
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
   * @description Filtra y elimina los elementos seleccionados de la tabla de destinatarios.
   * Actualiza el estado del almacén y cierra el popup de confirmación de eliminación.
   * Realiza la eliminación definitiva después de la confirmación del usuario.
   * 
   * Operaciones realizadas:
   * - Extrae los IDs de los destinatarios a eliminar
   * - Filtra la tabla para remover los destinatarios seleccionados
   * - Limpia la lista de selección
   * - Actualiza el store con los nuevos datos de destinatarios
   * - Cierra el popup de confirmación
   * 
   * @returns {void}
   * @memberof DestinatariosComponent
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // Se ejecuta cuando el usuario confirma la eliminación de destinatarios
   * this.eliminarMercanciaItem();
   * ```
   */
  eliminarMercanciaItem(): void {
    const IDS_A_BORRAR = this.listaFilaSeleccionadaMercancia.map(
      (item) => item.id
    );

    this.datosTablaDestinatario = this.datosTablaDestinatario.filter(
      (item) => !IDS_A_BORRAR.includes(item.id)
    );

    this.listaFilaSeleccionadaMercancia = [];
    this.tramite300105Store.setDestinatarioTablaDatos(this.datosTablaDestinatario);
    this.cerrarEliminarConfirmationPopup();
  }

  
/**
 * @method abrirMultipleSeleccionPopup
 * @description Abre el popup de selección múltiple si el botón de modificar está habilitado.
 * Muestra una advertencia al usuario cuando intenta modificar múltiples destinatarios simultáneamente,
 * lo cual no está permitido en la aplicación.
 * 
 * @returns {void}
 * @memberof DestinatariosComponent
 * @since 1.0.0
 * 
 * @example
 * ```typescript
 * // Se ejecuta cuando el usuario intenta modificar múltiples destinatarios
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
   * @memberof DestinatariosComponent
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
   * de eliminar los destinatarios marcados en la tabla.
   * 
   * @returns {void}
   * @memberof DestinatariosComponent
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // Se ejecuta cuando el usuario hace clic en eliminar destinatarios
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
   * @memberof DestinatariosComponent
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
   * de datos de destinatarios está visible o no.
   * 
   * @returns {void}
   * @memberof DestinatariosComponent
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // Se ejecuta para abrir o cerrar el modal de destinatarios
   * this.alternarModalMercancia();
   * ```
   */
  alternarModalMercancia(): void {
    this.mostrarModalDatosMercancia = !this.mostrarModalDatosMercancia;
  }

  /**
   * @method mostrarFormularioMercanciaModal
   * @description Muestra el formulario de mercancía en un modal.
   * Prepara el componente para agregar un nuevo destinatario inicializando
   * los catálogos, creando un formulario limpio y abriendo el modal.
   * 
   * Operaciones realizadas:
   * - Establece el modo de operación como creación (no actualización)
   * - Inicializa los catálogos de datos de mercancía para destinatarios
   * - Crea un formulario nuevo sin datos previos
   * - Abre el modal de captura de destinatarios
   * 
   * @returns {void}
   * @memberof DestinatariosComponent
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // Se ejecuta cuando el usuario hace clic en "Agregar Nuevo Destinatario"
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
   * Verifica el estado de validación de un campo específico del formulario de destinatarios
   * y determina si debe mostrarse como inválido en la interfaz.
   * 
   * @param {string} formControlName - Nombre del control del formulario a validar
   * @returns {boolean} `true` si el control es inválido y ha sido tocado o modificado, de lo contrario `false`
   * @memberof DestinatariosComponent
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // Verificar si el campo denominacionRazon es inválido
   * const esInvalido = this.esControlInvalido('denominacionRazon');
   * 
   * // En el template HTML
   * <input [class.is-invalid]="esControlInvalido('denominacionRazon')">
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
   * @description Envía los datos del formulario de mercancía asociada a destinatarios.
   * Valida el formulario, actualiza o agrega una nueva fila en la tabla de destinatarios,
   * y actualiza el estado del almacén correspondiente. Maneja tanto operaciones de
   * relación de mercancías como guardado final de destinatarios.
   * 
   * Funcionalidad completa:
   * - Valida todos los campos del formulario y marca como tocados
   * - Convierte valores de formulario a descripciones de catálogo
   * - Crea objeto de configuración con todos los datos del destinatario
   * - Determina si es actualización o creación nueva
   * - Actualiza la tabla de datos localmente si no es solo guardar
   * - Persiste los cambios en el store global
   * - Muestra notificaciones apropiadas según el tipo de operación
   * - Gestiona el estado del modal según la acción realizada
   * 
   * @param {boolean} [isGuardar=false] - Indica si es una operación de guardar final (true) o relacionar mercancía (false)
   * @returns {void}
   * @memberof DestinatariosComponent
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // Relacionar mercancía (mantiene modal abierto)
   * this.enviarFormularioMercancia(false);
   * 
   * // Guardar y cerrar modal
   * this.enviarFormularioMercancia(true);
   * ```
   */
  enviarFormularioMercancia(isGuardar: boolean = false): void {
    this.formularioMercancia.markAllAsTouched();

    if (this.formularioMercancia.invalid) {
      return;
    }

    const OBTENER_DESCRIPCION = (array: Catalogo[], index: number): string => array[index - 1]?.descripcion || '';

    const TABLA_ROW: DestinatarioConfiguracionItem = {
      id: this.esOperacionDeActualizacion
        ? this.formularioMercancia.get('id')?.value
        : this.datosTablaDestinatario.length + 1,
      denominacionRazon: this.formularioMercancia.get('denominacionRazon')?.value,
      domicilio: this.formularioMercancia.get('domicilio')?.value,
      pais: OBTENER_DESCRIPCION(
        this.autorizacionDeRayosXService.pais,
        this.formularioMercancia.get('pais')?.value
      ),
      correo: this.formularioMercancia.get('correo')?.value,
      paginaWeb: this.formularioMercancia.get('paginaWeb')?.value,
      tipoMercancia: OBTENER_DESCRIPCION(
        this.autorizacionDeRayosXService.tipoMercancia,
        this.formularioMercancia.get('tipoMercancia')?.value
      ),
    };
    
    if (!isGuardar || this.esOperacionDeActualizacion) {
      const EXISTING_INDEX = this.datosTablaDestinatario.findIndex(item => item.id === TABLA_ROW.id);

      if (EXISTING_INDEX > -1) {
        this.datosTablaDestinatario[EXISTING_INDEX] = TABLA_ROW;
      } else if (!isGuardar) {
        this.datosTablaDestinatario = [...this.datosTablaDestinatario, TABLA_ROW];
      }

      this.tramite300105Store.setDestinatarioTablaDatos(this.datosTablaDestinatario);
    }

    if (!isGuardar) {
      // Si es "Relacionar mercancia", mostrar notificación pero no cerrar el modal
      this.mostrarNotificacionRelacionMercancia();
    } else {
      // Si es "Guardar", resetear el formulario y cerrar el modal
      this.formularioMercancia.reset();
      this.alternarModalMercancia();
    }
  }

  /**
   * @method mostrarNotificacionRelacionMercancia
   * @description Muestra notificación después de relacionar mercancía.
   * Configura y muestra un popup de éxito informando al usuario que la relación
   * entre mercancía y destinatario fue agregada correctamente.
   * 
   * @returns {void}
   * @memberof DestinatariosComponent
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // Se ejecuta después de relacionar mercancía exitosamente
   * this.mostrarNotificacionRelacionMercancia();
   * ```
   */
  mostrarNotificacionRelacionMercancia(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.EXITO,
      modo: 'modal',
      titulo: '',
      mensaje: 'Relación agregada',
      cerrar: false,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
    this.relacionMercanciaPopupAbierto = true;
  }

  /**
   * @method cerrarRelacionMercanciaPopup
   * @description Cierra el popup de relación de mercancía.
   * Cambia el estado del flag para ocultar el modal de confirmación de relación de mercancía.
   * 
   * @returns {void}
   * @memberof DestinatariosComponent
   * @since 1.0.0
   * 
   * @example
   * ```typescript
   * // Se ejecuta cuando el usuario cierra el popup de confirmación
   * this.cerrarRelacionMercanciaPopup();
   * ```
   */
  cerrarRelacionMercanciaPopup(): void {
    this.relacionMercanciaPopupAbierto = false;
  }

  /**
   * @method ngOnDestroy
   * @description Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Maneja la limpieza de recursos para evitar fugas de memoria, especialmente
   * la cancelación de todas las suscripciones activas relacionadas con destinatarios.
   * 
   * Operaciones de limpieza:
   * - Emite señal de destrucción para cancelar suscripciones
   * - Completa el Subject de notificación de destrucción
   * - Libera recursos y previene fugas de memoria
   * 
   * @returns {void}
   * @memberof DestinatariosComponent
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
