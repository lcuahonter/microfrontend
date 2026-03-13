import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';

import { Catalogo, Notificacion, TablaSeleccion, ValidacionesFormularioService } from '@ng-mf/data-access-user';
import { Modal } from 'bootstrap';

import {
  UNIDAD_TABLA_CONFIG,
  VEHICULOS_TABLA_CONFIG,
} from '../../enum/transportista-terrestre.enum';

import {
  Tramite40101State,
  Tramite40101Store,
} from '../../estado/tramite40101.store';

import { Tramite40101Query } from '../../estado/tramite40101.query';
import { modificarTerrestreService } from '../services/modificacar-terrestre.service';

import { CatalogoLista, UnidadTabla, UnidadTablaConfig, VehiculoTabla, VehiculoTablaDatos } from '../../models/registro-muestras-mercancias.model';

/**
 * Componente para la gestión de vehículos y unidades de arrastre en el trámite 40101.
 * 
 * Este componente maneja el registro, edición y eliminación de vehículos y unidades
 * de arrastre para el proceso de transportista terrestre. Incluye formularios reactivos,
 * tablas de datos con selección múltiple, y modales para la captura de información.
 * 
 * @remarks
 * **Funcionalidades principales:**
 * - Gestión de catálogos: tipos de vehículo, países, años, colores, etc.
 * - Formularios reactivos con validación automática y manual
 * - Tablas con selección múltiple y operaciones CRUD
 * - Modales Bootstrap para captura y edición de datos
 * - Navegación por pestañas entre vehículos y unidades de arrastre
 * - Sincronización con el store del trámite para persistencia de datos
 * 
 * **Patrones implementados:**
 * - Component lifecycle hooks para inicialización
 * - RxJS observables con cleanup automático (takeUntil)
 * - Formularios reactivos con validaciones dinámicas
 * - State management con Akita store/query pattern
 * - Bootstrap modals para UX optimizada
 * 
 * @example
 * ```html
 * <app-vehiculos></app-vehiculos>
 * ```
 */
@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.component.html',
  styleUrl: './vehiculos.component.scss',
})
export class VehiculosComponent implements OnInit {
  /**
   * Array de unidades de arrastre seleccionadas en la tabla.
   * 
   * Mantiene el estado de las filas seleccionadas por el usuario mediante
   * checkboxes en la tabla de unidades de arrastre. Se utiliza para operaciones
   * de eliminación y edición en lote.
   * 
   * @type {UnidadTabla[]}
   * @default []
   */
  filasUnidadSeleccionadas: UnidadTabla[] = [];

  /**
   * Maneja la selección de una o más filas de unidad de arrastre (array de selección).
   * 
   * Callback ejecutado cuando el usuario selecciona/deselecciona filas en la tabla
   * de unidades de arrastre. Actualiza el array de elementos seleccionados.
   * 
   * @param event Array de unidades de arrastre seleccionadas por el usuario
   * 
   * @remarks
   * - Se ejecuta automáticamente desde el componente de tabla
   * - Reemplaza completamente la selección anterior
   * - Utilizado para habilitar/deshabilitar botones de acción
   */
  enUnidadFilaSeleccionada(event: UnidadTabla[]): void {
    this.filasUnidadSeleccionadas = event;
  }

  /**
   * Elimina los registros seleccionados de la tabla de unidades de arrastre y limpia el estado.
   * 
   * Filtra los elementos seleccionados de la tabla de unidades de arrastre y restablece
   * el estado del componente para reflejar la eliminación. Incluye limpieza del formulario
   * y variables de control específicas de unidades.
   * 
   * @remarks
   * - Solo procede si hay unidades seleccionadas (`filasUnidadSeleccionadas.length > 0`)
   * - Filtra los elementos de `unidadesTablaConfig.datos` excluyendo los seleccionados
   * - Limpia la selección actual (`filasUnidadSeleccionadas = []`)
   * - Restablece el índice de edición unitario (`editarIndiceUnitario = null`)
   * - Resetea el formulario de unidad para evitar estados inconsistentes
   */
  eliminarFilaUnidad(): void {
    if (this.filasUnidadSeleccionadas.length > 0) {
      const CURRENTUNIDAS = this.tramiteQuery.getValue().unidadesArrastre || [];
      const UPDATEDUNIDAS = CURRENTUNIDAS.filter(
        (item) => !this.filasUnidadSeleccionadas.includes(item)
      );
      this.store.setUnidadesArrastre(UPDATEDUNIDAS);
      this.filasUnidadSeleccionadas = [];
      this.editarIndiceUnitario = null;
      this.unidadFormulario.reset();
    }
  }

  /**
   * Array de vehículos seleccionados en la tabla principal.
   * 
   * Mantiene el estado de las filas seleccionadas por el usuario mediante
   * checkboxes en la tabla de vehículos. Se utiliza para operaciones
   * de eliminación y edición de registros.
   * 
   * @type {VehiculoTabla[]}
   * @default []
   */
  vehiculoSeleccionado: VehiculoTabla[] = [];

  /**
   * Indica si el componente está en modo de solo lectura.
   * 
   * Flag que controla la habilitación/deshabilitación de elementos interactivos
   * del formulario y tabla. En modo solo lectura, se deshabilitan las operaciones
   * de edición, creación y eliminación.
   * 
   * @type {boolean}
   * @default false
   */
  esSoloLectura = false;

  /**
   * Maneja la selección de una o más filas de vehículo en la tabla.
   * 
   * Callback ejecutado cuando el usuario selecciona/deselecciona filas en la tabla
   * de vehículos. Actualiza el array de elementos seleccionados para operaciones
   * posteriores como edición o eliminación.
   * 
   * @param event Array de vehículos seleccionados por el usuario
   * 
   * @remarks
   * - Se ejecuta automáticamente desde el componente de tabla
   * - Reemplaza completamente la selección anterior
   * - Utilizado para habilitar/deshabilitar botones de acción
   */
  enVehiculoFilaSeleccionada(event: VehiculoTabla[]): void {
    this.vehiculoSeleccionado = event;
  }

  /**
   * Array interno que almacena la lista completa de vehículos.
   * 
   * Colección de datos de vehículos utilizada para operaciones internas
   * del componente. Mantiene sincronización con la tabla principal.
   * 
   * @type {VehiculoTabla[]}
   * @default []
   * 
   * @remarks
   * - Separado de la configuración de tabla para mayor flexibilidad
   * - Puede contener datos no mostrados en la tabla actual
   */
  VehiculoTabla: VehiculoTabla[] = [];

  /**
   * Referencia al elemento DOM del modal de vehículo.
   * 
   * ViewChild que proporciona acceso directo al elemento modal de vehículo
   * para operaciones de apertura, cierre y manipulación programática.
   * 
   * @type {ElementRef}
   * 
   * @remarks
   * - Se inicializa automáticamente después de la renderización del componente
   * - Utilizado con Bootstrap Modal para mostrar/ocultar el modal
   * - Requerido para la gestión manual de modales
   */
  @ViewChild('vehiculoModal') vehiculoModal!: ElementRef;

  /**
   * Referencia al elemento DOM del modal de unidad de arrastre.
   * 
   * ViewChild que proporciona acceso directo al elemento modal de unidad
   * de arrastre para operaciones de apertura, cierre y manipulación programática.
   * 
   * @type {ElementRef}
   * 
   * @remarks
   * - Se inicializa automáticamente después de la renderización del componente
   * - Utilizado con Bootstrap Modal para mostrar/ocultar el modal
   * - Requerido para la gestión manual de modales
   */
  @ViewChild('unidadModal') unidadModal!: ElementRef;

  /**
   * Formulario reactivo para la captura y edición de datos de vehículos.
   * 
   * FormGroup que contiene todos los controles necesarios para manejar
   * la información de vehículos incluyendo validaciones, estado y valores.
   * 
   * @type {FormGroup}
   * 
   * @remarks
   * - Se inicializa en `inicializarFormulario()` con validaciones requeridas
   * - Incluye campos para placas primarias y secundarias
   * - Maneja habilitación/deshabilitación dinámica del campo descripción
   * - Integrado con el servicio de validaciones para UX mejorada
   */
  vehiculoFormulario!: FormGroup;

  /**
   * Formulario reactivo para la captura y edición de datos de unidades de arrastre.
   * 
   * FormGroup que contiene todos los controles necesarios para manejar
   * la información de unidades de arrastre incluyendo validaciones, estado y valores.
   * 
   * @type {FormGroup}
   * 
   * @remarks
   * - Se inicializa en `inicializarFormulario()` con validaciones requeridas
   * - Incluye campos específicos para unidades de arrastre (VIN, etc.)
   * - Maneja habilitación/deshabilitación dinámica del campo descripción
   * - Integrado con el servicio de validaciones para UX mejorada
   */
  unidadFormulario!: FormGroup;

  /**
   * Flag que indica si el formulario ha sido enviado o está en proceso de envío.
   * 
   * Variable de control utilizada para manejar el estado de envío de formularios
   * y mostrar mensajes de validación apropiados al usuario.
   * 
   * @type {boolean}
   * @default false
   * 
   * @remarks
   * - Se establece en `true` al enviar el formulario
   * - Se restablece a `false` después de completar el procesamiento
   * - Utilizado para mostrar/ocultar errores de validación
   * - Previene múltiples envíos accidentales
   */
  enviada = false;

  /**
   * Subject para manejar la destrucción de suscripciones RxJS.
   * 
   * Observable utilizado para limpiar automáticamente todas las suscripciones
   * cuando el componente se destruye, evitando memory leaks y suscripciones huérfanas.
   * 
   * @type {Subject<void>}
   * 
   * @remarks
   * - Se emite en `ngOnDestroy()` para cancelar todas las suscripciones activas
   * - Utilizado con el operador `takeUntil()` en todas las suscripciones
   * - Patrón recomendado para gestión de memoria en Angular
   * - Previene efectos secundarios después de la destrucción del componente
   */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * Catálogo de tipos de vehículo disponibles.
   * 
   * Array que contiene la lista completa de tipos de vehículo obtenidos
   * del servicio backend para su uso en formularios y validaciones.
   * 
   * @type {Catalogo[]}
   * @default []
   * 
   * @remarks
   * - Se carga automáticamente en `ngOnInit()` mediante `cargarTipoDeVehiculo()`
   * - Utilizado para poblar el dropdown de tipos de vehículo
   * - Incluye lógica especial para el tipo "Otro" (id: 1) que habilita campo descripción
   */
  tipoDeVehiculoCatalogo: Catalogo[] = [];

  /**
   * Catálogo de tipos de unidad de arrastre disponibles.
   * 
   * Array que contiene la lista completa de tipos de unidad de arrastre
   * obtenidos del servicio backend para su uso en formularios.
   * 
   * @type {Catalogo[]}
   * @default []
   * 
   * @remarks
   * - Se carga condicionalmente si el método del servicio existe
   * - Utilizado para poblar el dropdown de tipos de unidad de arrastre
   * - Incluye lógica especial para el tipo "Otro" (id: 1) que habilita campo descripción
   */
  tipoArrastreCatalogo: Catalogo[] = [];

  /**
   * Catálogo de años disponibles para vehículos.
   * 
   * Array que contiene la lista de años válidos para el registro
   * de vehículos obtenidos del servicio backend.
   * 
   * @type {Catalogo[]}
   * @default []
   * 
   * @remarks
   * - Se carga automáticamente en `ngOnInit()`
   * - Utilizado para poblar el dropdown de años en formularios
   * - Configurado para mostrar descripciones en lugar de IDs en las tablas
   */
  anoCatalogo: Catalogo[] = [];

  /**
   * Catálogo de países emisores de placas vehiculares.
   * 
   * Array que contiene la lista completa de países que pueden emitir
   * placas vehiculares para vehículos y unidades de arrastre.
   * 
   * @type {Catalogo[]}
   * @default []
   * 
   * @remarks
   * - Se carga automáticamente en `ngOnInit()`
   * - Utilizado para poblar dropdowns de país emisor en ambos formularios
   * - Configurado para mostrar descripciones en lugar de IDs en las tablas
   */
  paisEmisorCatalogo: Catalogo[] = [];

  /**
   * Catálogo de colores disponibles para vehículos.
   * 
   * Array que contiene la lista completa de colores válidos
   * para el registro de vehículos y unidades de arrastre.
   * 
   * @type {Catalogo[]}
   * @default []
   * 
   * @remarks
   * - Se carga condicionalmente si el método del servicio existe
   * - Utilizado para poblar el dropdown de colores en formularios
   * - Compartido entre formularios de vehículos y unidades de arrastre
   */
  colorVehiculoCatalogo: Catalogo[] = [];

  /**
   * Objeto de notificación actual para mostrar mensajes al usuario.
   * 
   * Instancia de notificación utilizada para mostrar alertas, confirmaciones
   * y mensajes informativos al usuario a través de modales o toasts.
   * 
   * @type {Notificacion}
   * 
   * @remarks
   * - Se configura dinámicamente según el tipo de mensaje a mostrar
   * - Incluye propiedades para tipo, categoría, título, mensaje y botones
   * - Utilizada principalmente para confirmaciones de éxito en operaciones CRUD
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Nombre de la pestaña actualmente seleccionada para mostrar en la UI.
   * 
   * String que contiene el nombre legible de la pestaña activa que se
   * muestra al usuario en la interfaz de navegación.
   * 
   * @type {string}
   * @default 'Parque vehicular'
   * 
   * @remarks
   * - Se actualiza mediante `seleccionarPestana()` cuando el usuario cambia de pestaña
   * - Valores posibles: 'Parque vehicular' | 'Unidad de arrastre'
   * - Utilizado para mostrar el nombre de la pestaña en la UI
   */
  pestanaSeleccionada: string = 'Parque vehicular';

  /**
   * Identificador técnico de la pestaña actualmente activa.
   * 
   * String que contiene el identificador interno de la pestaña activa
   * utilizado para el control y lógica del componente.
   * 
   * @type {string}
   * @default 'parquevehicular'
   * 
   * @remarks
   * - Se actualiza mediante `selectTab()` cuando el usuario cambia de pestaña
   * - Valores posibles: 'parquevehicular' | 'unidaddearrastre'
   * - Utilizado para la lógica interna de navegación y control
   */
  activeTab: string = 'parquevehicular';

  /**
   * Tipo de selección utilizado en las tablas del componente.
   * 
   * Configuración que define el mecanismo de selección de filas
   * en las tablas de vehículos y unidades de arrastre.
   * 
   * @type {TablaSeleccion}
   * @default TablaSeleccion.CHECKBOX
   * 
   * @remarks
   * - Configurado como CHECKBOX para permitir selección múltiple
   * - Utilizado por el componente de tabla para renderizar controles de selección
   * - Habilita operaciones en lote como eliminación múltiple
   */
  tipoSeleccionTabla = TablaSeleccion.CHECKBOX;

  /**
   * Estado actual del trámite 40101 obtenido del store.
   * 
   * Objeto que contiene toda la información del estado actual del trámite,
   * incluyendo datos de vehículos, unidades y configuración general.
   * 
   * @type {Tramite40101State}
   * 
   * @remarks
   * - Se actualiza automáticamente mediante suscripción al query
   * - Contiene `datosVehiculo` y `datosUnidad` para inicialización de formularios
   * - Sincronizado en tiempo real con cambios en el store
   * - Utilizado para cargar valores iniciales en formularios
   */
  public tramiteState!: Tramite40101State;

  /**
   * Referencia al elemento DOM del botón de cierre del modal de vehículo.
   * 
   * ViewChild que proporciona acceso directo al botón de cierre del modal
   * de vehículo para cerrar programáticamente el modal después de operaciones.
   * 
   * @type {ElementRef}
   * 
   * @remarks
   * - Se utiliza para cerrar automáticamente el modal después de guardar datos
   * - Activado mediante `.click()` en los métodos de guardado exitoso
   * - Mejora la experiencia del usuario al evitar cierre manual
   */
  @ViewChild('cerrarModal') public cerrarModal!: ElementRef;

  /**
   * Referencia al elemento DOM del botón de cierre del modal de unidad de arrastre.
   * 
   * ViewChild que proporciona acceso directo al botón de cierre del modal
   * de unidad de arrastre para cerrar programáticamente el modal después de operaciones.
   * 
   * @type {ElementRef}
   * 
   * @remarks
   * - Se utiliza para cerrar automáticamente el modal después de guardar datos
   * - Activado mediante `.click()` en los métodos de guardado exitoso
   * - Mejora la experiencia del usuario al evitar cierre manual
   */
  @ViewChild('cerrarUnidadModal') public cerrarUnidadModal!: ElementRef;

  /**
   * Constructor del componente VehiculosComponent.
   * 
   * Inicializa las dependencias necesarias para el funcionamiento del componente
   * incluyendo FormBuilder para formularios reactivos, store y query para gestión
   * de estado, servicios para operaciones backend y validaciones.
   * 
   * @param fb FormBuilder de Angular para crear y gestionar formularios reactivos
   * @param store Store del trámite 40101 para gestión de estado de la aplicación
   * @param tramiteQuery Query service para acceder al estado del trámite de forma reactiva
   * @param modificarTerrestreService Servicio para operaciones CRUD de datos terrestres
   * @param validacionesService Servicio para validaciones avanzadas de formularios
   * 
   * @remarks
   * **Dependencias inyectadas:**
   * - `FormBuilder`: Creación de formularios reactivos con validaciones
   * - `Tramite40101Store`: Gestión centralizada del estado del trámite
   * - `Tramite40101Query`: Acceso reactivo a los datos del store
   * - `modificarTerrestreService`: Operaciones de backend (CRUD, catálogos)
   * - `ValidacionesFormularioService`: Validaciones personalizadas y UX mejorada
   * 
   * **Patrón de inyección:**
   * - Utiliza constructor injection estándar de Angular
   * - Todas las dependencias son públicas para acceso desde el template
   * - Seguimiento del patrón de arquitectura Akita para state management
   */
  constructor(
    public fb: FormBuilder,
    public store: Tramite40101Store,
    public tramiteQuery: Tramite40101Query,
    public modificarTerrestreService: modificarTerrestreService,
    private validacionesService: ValidacionesFormularioService
  ) {
    // Lógica para el constructor si es necesario.
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   *
   * - Suscribe al estado del trámite y lo actualiza en la propiedad local.
   * - Selecciona la pestaña inicial y configura los formularios reactivos.
   * - Carga los catálogos necesarios para los formularios (tipo de vehículo, país emisor, año, color, tipo de arrastre).
   * - Configura la habilitación/deshabilitación dinámica de los campos 'descripcion' según el tipo seleccionado.
   */
  ngOnInit(): void {
    this.tramiteQuery.select(state => state.parqueVehicular).pipe(
      takeUntil(this.destroyNotifier$)
    ).subscribe(data => {
      if (data) {
        this.vehiculosTablaConfig.datos = data;
      }

    });
    this.tramiteQuery.select(state => state.unidadesArrastre).pipe(
      takeUntil(this.destroyNotifier$)
    ).subscribe(data => {
      if (data) {
        this.unidadesTablaConfig.datos = data;
      }
    });

    this.tramiteQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.tramiteState = seccionState;
        })
      )
      .subscribe();

    this.seleccionarPestana('parquevehicular');
    this.inicializarFormulario();
    this.cargarTipoDeVehiculo();

    // Carga el catálogo de países emisores de placas.
    this.modificarTerrestreService.obtenerPaisEmisor()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos: CatalogoLista) => {
        this.paisEmisorCatalogo = datos.datos;
        this.configurarTablasConDescripciones();
      });

    // Carga el catálogo de años de los vehículos.
    this.modificarTerrestreService.obtenerAno()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos: CatalogoLista) => {
        this.anoCatalogo = datos.datos;
        this.configurarTablasConDescripciones();
      });

    // Carga el catálogo de colores de vehículos.
    if (this.modificarTerrestreService.obtenerColorVehiculo) {
      this.modificarTerrestreService.obtenerColorVehiculo()
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((datos: CatalogoLista) => {
          this.colorVehiculoCatalogo = datos.datos;
          this.configurarTablasConDescripciones();
        });
    }

    // Carga el catálogo de tipos de unidad de arrastre.
    if (this.modificarTerrestreService.obtenerTipoArrastre) {
      this.modificarTerrestreService.obtenerTipoArrastre()
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((datos: CatalogoLista) => {
          this.tipoArrastreCatalogo = datos.datos;
          this.configurarTablasConDescripciones();
        });
    }

    // Configurar las tablas con descripciones después de cargar los catálogos
    this.configurarTablasConDescripciones();

    // Deshabilita el campo 'descripcion' del formulario de vehículo y lo habilita solo si el tipo seleccionado es 60.
    this.vehiculoFormulario.get('descripcion')?.disable();
    this.vehiculoFormulario.get('tipoDeVehiculo')?.valueChanges
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((valorSeleccionado) => {
        const ID_SELECCIONADO = Number(valorSeleccionado);
        if (ID_SELECCIONADO === 60) {
          this.vehiculoFormulario.get('descripcion')?.enable();
        } else {
          this.vehiculoFormulario.get('descripcion')?.disable();
        }
      });

    // Deshabilita el campo 'descripcion' del formulario de unidad de arrastre y lo habilita solo si el tipo seleccionado es 70.
    this.unidadFormulario.get('descripcion')?.disable();
    this.unidadFormulario.get('tipoDeUnidadArrastre')?.valueChanges
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((valorSeleccionado) => {
        const ID_SELECCIONADO = Number(valorSeleccionado);
        if (ID_SELECCIONADO === 70) {
          this.unidadFormulario.get('descripcion')?.enable();
        } else {
          this.unidadFormulario.get('descripcion')?.disable();
        }
      });
  }

  /**
   * Configuración de la tabla de vehículos con estructura de encabezados y datos.
   * 
   * Objeto que define la estructura completa de la tabla de vehículos incluyendo
   * configuración de columnas, ordenamiento y datos. Utiliza la configuración
   * base definida en los enums del módulo.
   * 
   * @type {Object}
   * @property {Array} encabezadas Array de configuración de columnas de la tabla
   * @property {Function} encabezadas[].clave Función para extraer el valor de cada celda
   * @property {string} encabezadas[].encabezado Texto del encabezado de la columna
   * @property {number} encabezadas[].orden Orden de visualización de la columna
   * @property {VehiculoTabla[]} datos Array de datos de vehículos a mostrar
   * 
   * @default VEHICULOS_TABLA_CONFIG
   * 
   * @remarks
   * - Se inicializa con la configuración base de `VEHICULOS_TABLA_CONFIG`
   * - Las funciones `clave` se actualizan dinámicamente para mostrar descripciones
   * - Soporta operaciones CRUD directamente sobre el array `datos`
   * - Compatible con el componente de tabla genérico del sistema
   */
  vehiculosTablaConfig: {
    encabezadas: {
      encabezado: string;
      clave: (item: VehiculoTabla) => string;
      orden: number;
    }[];
    datos: VehiculoTabla[];
  } = VEHICULOS_TABLA_CONFIG;

  /**
   * Configuración de la tabla de unidades de arrastre con estructura completa.
   * 
   * Objeto que define la estructura completa de la tabla de unidades de arrastre
   * incluyendo configuración de columnas, ordenamiento y datos. Utiliza la configuración
   * base definida en los enums del módulo.
   * 
   * @type {UnidadTablaConfig}
   * @default UNIDAD_TABLA_CONFIG
   * 
   * @remarks
   * - Se inicializa con la configuración base de `UNIDAD_TABLA_CONFIG`
   * - Las funciones `clave` se actualizan dinámicamente para mostrar descripciones
   * - Soporta operaciones CRUD directamente sobre el array `datos`
   * - Compatible con el componente de tabla genérico del sistema
   * - Incluye configuración específica para unidades de arrastre
   */
  unidadesTablaConfig: UnidadTablaConfig = UNIDAD_TABLA_CONFIG;

  /**
   * Busca la descripción de un catálogo basándose en el ID proporcionado.
   * 
   * Localiza un elemento específico dentro de un catálogo utilizando su ID
   * y retorna la descripción correspondiente. Si no encuentra el elemento,
   * retorna el ID original como string.
   * 
   * @param catalogo Array de catálogo donde buscar el elemento
   * @param id Identificador del elemento a buscar (número o string)
   * @returns La descripción del elemento encontrado o el ID convertido a string
   * 
   * @remarks
   * - Maneja casos donde el catálogo o ID son nulos/indefinidos
   * - Convierte automáticamente el ID a número para la comparación
   * - Útil para mostrar descripciones legibles en lugar de IDs en las tablas
   */
  private static obtenerDescripcionCatalogo(catalogo: Catalogo[], id: number | string): string {
    if (!id || !catalogo) {
      return id?.toString() || '';
    }
    const ELEMENTO = catalogo.find(cat => cat.id === Number(id));
    return ELEMENTO ? ELEMENTO.descripcion : id.toString();
  }

  /**
   * Configura las tablas para mostrar descripciones legibles en lugar de IDs.
   * 
   * Actualiza la configuración de las columnas de ambas tablas (vehículos y unidades)
   * para que muestren descripciones de los catálogos en lugar de los IDs numéricos.
   * Esto mejora la experiencia del usuario al mostrar información más comprensible.
   * 
   * @remarks
   * - Se ejecuta después de cargar cada catálogo para asegurar datos actualizados
   * - Utiliza `obtenerDescripcionCatalogo()` para resolver las descripciones
   * - Modifica las funciones `clave` de las columnas específicas que requieren traducción
   * - Afecta las columnas: Tipo de vehículo, País emisor, Año, Tipo de unidad de arrastre
   */
  private configurarTablasConDescripciones(): void {
    // Actualizar solo las columnas que necesitan mostrar descripciones en lugar de IDs

    // Para tabla de vehículos
    const TIPO_VEHICULO_COL = this.vehiculosTablaConfig.encabezadas.find(col => col.encabezado === 'Tipo de vehículo');
    if (TIPO_VEHICULO_COL) {
      TIPO_VEHICULO_COL.clave = (item: VehiculoTabla): string => VehiculosComponent.obtenerDescripcionCatalogo(this.tipoDeVehiculoCatalogo, item.tipoDeVehiculo);
    }

    const PAIS_EMISOR_VEH_COL = this.vehiculosTablaConfig.encabezadas.find(col => col.encabezado === 'País emisor');
    if (PAIS_EMISOR_VEH_COL) {
      PAIS_EMISOR_VEH_COL.clave = (item: VehiculoTabla): string => VehiculosComponent.obtenerDescripcionCatalogo(this.paisEmisorCatalogo, item.paisEmisor);
    }

    const ANO_COL = this.vehiculosTablaConfig.encabezadas.find(col => col.encabezado === 'Año');
    if (ANO_COL) {
      ANO_COL.clave = (item: VehiculoTabla): string => VehiculosComponent.obtenerDescripcionCatalogo(this.anoCatalogo, item.ano);
    }

    // Para tabla de unidades de arrastre
    const TIPO_UNIDAD_COL = this.unidadesTablaConfig.encabezadas.find(col => col.encabezado === 'Tipo de unidad de arrastre');
    if (TIPO_UNIDAD_COL) {
      TIPO_UNIDAD_COL.clave = (item: UnidadTabla): string => VehiculosComponent.obtenerDescripcionCatalogo(this.tipoArrastreCatalogo, item.tipoDeUnidadArrastre);
    }

    const PAIS_EMISOR_UNIDAD_COL = this.unidadesTablaConfig.encabezadas.find(col => col.encabezado === 'País Emisor');
    if (PAIS_EMISOR_UNIDAD_COL) {
      PAIS_EMISOR_UNIDAD_COL.clave = (item: UnidadTabla): string => VehiculosComponent.obtenerDescripcionCatalogo(this.paisEmisorCatalogo, item.paisEmisor);
    }
  }

  /**
   * Cambia la pestaña seleccionada y actualiza el estado de la interfaz.
   * 
   * Gestiona la navegación entre las pestañas del componente, actualizando
   * tanto el nombre mostrado como el identificador interno de la pestaña activa.
   * 
   * @param tabName Identificador de la pestaña a seleccionar ('parquevehicular' | 'unidaddearrastre')
   * @returns El identificador de la pestaña actualmente activa
   * 
   * @remarks
   * - Actualiza `selectedTab` con el nombre legible para mostrar en la UI
   * - Actualiza `activeTab` con el identificador técnico para el control interno
   * - Soporta dos pestañas: 'Parque vehicular' y 'Unidad de arrastre'
   */
  seleccionarPestana(tabName: string): string {
    this.pestanaSeleccionada =
      tabName === 'parquevehicular' ? 'Parque vehicular' : 'Unidad de arrastre';
    this.activeTab = tabName;
    return this.activeTab;
  }

  /**
   * Elimina los registros seleccionados de la tabla de vehículos y limpia el estado.
   * 
   * Filtra los elementos seleccionados de la tabla de vehículos y restablece
   * el estado del componente para reflejar la eliminación. Incluye limpieza
   * del formulario y variables de control.
   * 
   * @remarks
   * - Solo procede si hay vehículos seleccionados (`vehiculoSeleccionado.length > 0`)
   * - Filtra los elementos de `vehiculosTablaConfig.datos` excluyendo los seleccionados
   * - Limpia la selección actual (`vehiculoSeleccionado = []`)
   * - Restablece el índice de edición (`indiceEdicion = null`)
   * - Resetea el formulario de vehículo para evitar estados inconsistentes
   */
  eliminarFilaVehiculo(): void {
    if (this.vehiculoSeleccionado.length > 0) {
      const CURRENTVEHICULOS = this.tramiteQuery.getValue().parqueVehicular || [];
      const UPDATEDVEHICULOS = CURRENTVEHICULOS.filter(vehiculo => !this.vehiculoSeleccionado.includes(vehiculo));
      this.store.setParqueVehicular(UPDATEDVEHICULOS);
      this.vehiculoSeleccionado = [];
      this.indiceEdicion = null;
      this.vehiculoFormulario.reset();
    }
  }

  /**
   * Elimina el registro seleccionado de la tabla de unidades de arrastre.
   */



  /**
   * Abre el modal de vehículo para agregar o editar registros.
   * 
   * Inicializa el estado del formulario marcando que no ha sido enviado
   * y muestra el modal de vehículo utilizando Bootstrap Modal.
   * 
   * @remarks
   * - Restablece la bandera `enviada` a false para permitir nuevas validaciones
   * - Utiliza Bootstrap Modal para mostrar la interfaz de usuario
   * - El contexto (agregar/editar) se determina por el estado previo del formulario
   */
  abrirPedimento(): void {
    this.enviada = false;
    if (this.vehiculoModal) {
      const MODAL_INSTANCE = new Modal(this.vehiculoModal.nativeElement);
      MODAL_INSTANCE.show();
    }
  }

  /**
   * Abre el modal de unidad de arrastre para agregar o editar registros.
   * 
   * Inicializa el estado del formulario marcando que no ha sido enviado
   * y muestra el modal de unidad de arrastre utilizando Bootstrap Modal.
   * 
   * @remarks
   * - Restablece la bandera `enviada` a false para permitir nuevas validaciones
   * - Utiliza Bootstrap Modal para mostrar la interfaz de usuario
   * - El contexto (agregar/editar) se determina por el estado previo del formulario
   */
  abrirPedimentoUnidad(): void {
    this.enviada = false;
    if (this.unidadModal) {
      const MODAL_INSTANCE = new Modal(this.unidadModal.nativeElement);
      MODAL_INSTANCE.show();
    }
  }

  /**
   * Actualiza el valor de un campo específico en el store del trámite.
   * 
   * Extrae el valor de un campo del formulario reactivo y lo actualiza
   * en el store utilizando el método especificado. Proporciona sincronización
   * entre el formulario y el estado global de la aplicación.
   * 
   * @param form Formulario reactivo del cual extraer el valor
   * @param campo Nombre del campo/control dentro del formulario
   * @param metodoNombre Nombre del método del store a ejecutar para actualizar el valor
   * 
   * @remarks
   * - Utiliza `form.get(campo)?.value` para extraer el valor del campo
   * - Realiza casting del método del store para asegurar compatibilidad de tipos
   * - El método del store debe aceptar un parámetro del tipo correcto
   * - Útil para mantener sincronizado el estado del formulario con el store
   * 
   * @example
   * ```typescript
   * // Actualizar el número de vehículo en el store
   * this.setValoresStore(this.vehiculoFormulario, 'numero', 'setNumeroVehiculo');
   * ```
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite40101Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Inicializa los formularios reactivos de vehículo y unidad de arrastre.
   * 
   * Configura ambos formularios con sus respectivos campos, validaciones y estados iniciales.
   * Incluye lógica de incremento automático para los IDs y carga de datos desde el estado del trámite.
   * 
   * @remarks
   * **Formulario de Vehículo:**
   * - Calcula automáticamente el próximo ID basándose en los datos existentes
   * - Carga valores iniciales desde `tramiteState.datosVehiculo`
   * - Configura validaciones requeridas para todos los campos
   * - El campo `idDeVehiculo` se inicializa deshabilitado
   * 
   * **Formulario de Unidad de Arrastre:**
   * - Calcula automáticamente el próximo ID para unidades
   * - Carga valores iniciales desde `tramiteState.datosUnidad`
   * - Configura validaciones requeridas para todos los campos
   * - El campo `idDeVehiculoUnidad` se inicializa deshabilitado
   * 
   * **Campos Comunes:**
   * - Todos los formularios incluyen validación `Validators.required`
   * - Los campos `descripcion` se inicializan deshabilitados
   * - Se preserva la estructura de datos para placas primarias y secundarias
   */
  inicializarFormulario(): void {
    // Incremento automático idDeVehiculo
    let siguienteId = 1;
    if (Array.isArray(this.vehiculosTablaConfig.datos) && this.vehiculosTablaConfig.datos.length > 0) {
      const ID_MAXIMO = Math.max(...this.vehiculosTablaConfig.datos.map(v => Number(v.idDeVehiculo) || 0));
      siguienteId = ID_MAXIMO + 1;
    }
    this.vehiculoFormulario = this.fb.group({
      numero: [this.tramiteState.datosVehiculo.numero, [Validators.required]],
      tipoDeVehiculo: [this.tramiteState.datosVehiculo.tipoDeVehiculo],
      idDeVehiculo: [{ value: siguienteId, disabled: true }, Validators.required],
      numeroPlaca: [this.tramiteState.datosVehiculo.numeroPlaca, Validators.required],
      paisEmisor: [this.tramiteState.datosVehiculo.paisEmisor],
      estado: [this.tramiteState.datosVehiculo.estado, Validators.required],
      marca: [this.tramiteState.datosVehiculo.marca, Validators.required],
      modelo: [this.tramiteState.datosVehiculo.modelo, Validators.required],
      ano: [this.tramiteState.datosVehiculo.ano],
      transponder: [this.tramiteState.datosVehiculo.transponder, Validators.required],
      colorVehiculo: [this.tramiteState.datosVehiculo.colorVehiculo],
      numuroEconomico: [this.tramiteState.datosVehiculo.numuroEconomico, Validators.required],
      numero2daPlaca: [this.tramiteState.datosVehiculo.numero2daPlaca],
      estado2daPlaca: [this.tramiteState.datosVehiculo.estado2daPlaca],
      paisEmisor2daPlaca: [this.tramiteState.datosVehiculo.paisEmisor2daPlaca],
      descripcion: [{ value: this.tramiteState.datosVehiculo.descripcion, disabled: true }],
    });

    // Incremento automático idDeVehiculoUnidad
    let siguienteIdUnidad = 1;
    if (Array.isArray(this.unidadesTablaConfig.datos) && this.unidadesTablaConfig.datos.length > 0) {
      const ID_MAXIMO_UNIDAD = Math.max(...this.unidadesTablaConfig.datos.map(u => Number(u.idDeVehiculoUnidad) || 0));
      siguienteIdUnidad = ID_MAXIMO_UNIDAD + 1;
    }
    this.unidadFormulario = this.fb.group({
      idDeVehiculoUnidad: [{ value: siguienteIdUnidad, disabled: true }, [Validators.required]],
      vinVehiculo: [this.tramiteState.datosUnidad.vinVehiculo, [Validators.required]],
      tipoDeUnidadArrastre: [this.tramiteState.datosUnidad.tipoDeUnidadArrastre],
      numeroEconomico: [this.tramiteState.datosUnidad.numeroEconomico, [Validators.required]],
      numeroPlaca: [this.tramiteState.datosUnidad.numeroPlaca, [Validators.required]],
      paisEmisor: [this.tramiteState.datosUnidad.paisEmisor],
      estado: [this.tramiteState.datosUnidad.estado, [Validators.required]],
      colorVehiculo: [this.tramiteState.datosUnidad.colorVehiculo],
      numero2daPlaca: [this.tramiteState.datosUnidad.numero2daPlaca],
      estado2daPlaca: [this.tramiteState.datosUnidad.estado2daPlaca],
      paisEmisor2daPlaca: [this.tramiteState.datosUnidad.paisEmisor2daPlaca],
      descripcion: [{ value: this.tramiteState.datosUnidad.descripcion, disabled: true }],
    });
  }

  /**
   * Valida si un campo específico del formulario es válido.
   * 
   * Utiliza el servicio de validaciones para determinar si un campo particular
   * del formulario cumple con todas las reglas de validación establecidas.
   * 
   * @param form Formulario reactivo a validar
   * @param field Nombre del campo/control del formulario a verificar
   * @returns `true` si el campo es válido, `false` si es inválido, `null` si no se puede determinar
   * 
   * @remarks
   * - Delega la lógica de validación al `ValidacionesFormularioService`
   * - Utilizado principalmente en el template para mostrar/ocultar mensajes de error
   * - Considera el estado touched/dirty del campo para UX mejorada
   * - Compatible con validadores síncronos y asíncronos de Angular
   * 
   * @example
   * ```typescript
   * // En el template
   * <div *ngIf="!isValid(vehiculoFormulario, 'numeroPlaca')" class="error">
   *   Campo requerido
   * </div>
   * ```
   */
  isValid(form: FormGroup, field: string): boolean | null {
    return this.validacionesService.isValid(form, field);
  }

  /**
   * Índice del vehículo actualmente en modo de edición.
   * 
   * Variable que almacena la posición en el array de vehículos del registro
   * que está siendo editado. Se utiliza para distinguir entre operaciones
   * de creación (null) y actualización (número válido).
   * 
   * @type {number | null}
   * @default null
   * 
   * @remarks
   * - `null` indica modo de creación de nuevo registro
   * - Número válido indica la posición del registro en edición
   * - Se establece en `inicioEditarVehiculo()` y se limpia después de guardar
   * - Utilizado en `agregarVahiculodata()` para determinar la operación a realizar
   */
  indiceEdicion: number | null = null;

  /**
   * Inicia la edición del primer vehículo seleccionado en la tabla.
   * 
   * Toma el primer vehículo de la selección actual, configura el modo de edición
   * y prepara el formulario con los datos del vehículo para su modificación.
   * Finalmente abre el modal de vehículo.
   * 
   * @remarks
   * **Validaciones previas:**
   * - Verifica que exista una selección (`vehiculoSeleccionado` no sea null/vacío)
   * - Confirma que el vehículo seleccionado existe en la tabla de datos
   * 
   * **Proceso de edición:**
   * - Obtiene el primer vehículo de la selección (`vehiculoSeleccionado[0]`)
   * - Busca el índice del vehículo en `vehiculosTablaConfig.datos`
   * - Establece `indiceEdicion` para indicar modo de edición
   * - Precarga el formulario con los datos del vehículo usando `patchValue()`
   * - Abre el modal de vehículo para la edición
   * 
   * **Casos de salida temprana:**
   * - Si no hay selección, termina sin acción
   * - Si el vehículo no se encuentra en la tabla (`index === -1`), termina sin acción
   */
  iniciarEditarVehiculo(): void {
    if (!this.vehiculoSeleccionado || this.vehiculoSeleccionado.length === 0) {
      return;
    }
    const VEHICULO = this.vehiculoSeleccionado[0];
    const INDICE = this.vehiculosTablaConfig.datos.indexOf(VEHICULO);
    if (INDICE === -1) {
      return;
    }
    this.indiceEdicion = INDICE;
    this.vehiculoFormulario.patchValue(VEHICULO);
    this.abrirPedimento();
  }

  /**
   * Agrega un nuevo vehículo o actualiza uno existente en la tabla.
   * 
   * Valida el formulario de vehículo y, si es válido, procede a agregar o actualizar
   * el registro en la tabla. Incluye lógica de incremento automático de ID y
   * limpieza del estado del formulario.
   * 
   * @remarks
   * **Proceso de validación:**
   * - Marca el formulario como enviado (`enviada = true`)
   * - Activa validación manual en todos los controles
   * - Marca todos los campos como tocados para mostrar errores
   * - Solo procede si el formulario es válido
   * 
   * **Lógica de actualización vs. inserción:**
   * - Si `editIndex` no es null: actualiza el registro existente en esa posición
   * - Si `editIndex` es null: agrega un nuevo registro al final de la tabla
   * - Utiliza `Object.assign()` para actualización y spread operator para inserción
   * 
   * **Post-procesamiento:**
   * - Calcula el próximo ID automáticamente basándose en el máximo actual
   * - Restablece el estado del formulario (`enviada = false`)
   * - Limpia el formulario con `reset()`
   * - Configura el nuevo ID y lo deshabilita
   * - Cierra el modal automáticamente
   * 
   * **Gestión de estado:**
   * - Restablece `editIndex` a null después de actualizar
   * - Crea nueva referencia del array para triggear detección de cambios
   */
  agregarVahiculodata(): void {
    this.enviada = true;
    // Activar la validación manualmente para todos los controles de formulario.
    Object.values(this.vehiculoFormulario.controls).forEach(control => {
      control.markAsTouched({ onlySelf: true });
      control.updateValueAndValidity();
    });

    if (this.vehiculoFormulario.valid) {
      const VALOR_FORMULARIO = this.vehiculoFormulario.getRawValue();
      if (this.indiceEdicion !== null) {
        const CURRENTVEHICULOS = [...(this.tramiteQuery.getValue().parqueVehicular || [])];
        CURRENTVEHICULOS[this.indiceEdicion] = VALOR_FORMULARIO;
        this.store.setParqueVehicular(CURRENTVEHICULOS);
        this.indiceEdicion = null;
      } else {
        const CURRENTVEHICULOS = this.tramiteQuery.getValue().parqueVehicular || [];
        this.store.setParqueVehicular([...CURRENTVEHICULOS, VALOR_FORMULARIO]);
      }
      // Incrementa automáticamente el ID para el próximo vehículo
      const ID_MAXIMO = Math.max(...this.vehiculosTablaConfig.datos.map(v => Number(v.idDeVehiculo) || 0));
      this.enviada = false;
      this.vehiculoFormulario.reset();
      this.vehiculoFormulario.get('idDeVehiculo')?.setValue(ID_MAXIMO + 1);
      this.vehiculoFormulario.get('idDeVehiculo')?.disable();
      this.cerrarModal.nativeElement.click();
    }
  }

  /**
   * Índice de la unidad de arrastre actualmente en modo de edición.
   * 
   * Variable que almacena la posición en el array de unidades de arrastre del registro
   * que está siendo editado. Se utiliza para distinguir entre operaciones
   * de creación (null) y actualización (número válido).
   * 
   * @type {number | null}
   * @default null
   * 
   * @remarks
   * - `null` indica modo de creación de nuevo registro
   * - Número válido indica la posición del registro en edición
   * - Se establece en `inicioEditarUnidad()` y se limpia después de guardar
   * - Utilizado en `agregarUnidadData()` para determinar la operación a realizar
   */
  editarIndiceUnitario: number | null = null;

  /**
   * Inicia la edición de la primera unidad de arrastre seleccionada.
   * 
   * Toma la primera unidad de arrastre de la selección actual, configura el modo
   * de edición y prepara el formulario con los datos de la unidad para su modificación.
   * Finalmente abre el modal de unidad de arrastre.
   * 
   * @remarks
   * **Validaciones previas:**
   * - Verifica que exista una selección (`filasUnidadSeleccionadas` no sea null/vacío)
   * - Confirma que la unidad seleccionada existe en la tabla de datos
   * 
   * **Proceso de edición:**
   * - Obtiene la primera unidad de la selección (`filasUnidadSeleccionadas[0]`)
   * - Busca el índice de la unidad en `unidadesTablaConfig.datos`
   * - Establece `editarIndiceUnitario` para indicar modo de edición
   * - Limpia y precarga el formulario con los datos de la unidad usando `patchValue()`
   * - Abre el modal de unidad de arrastre para la edición
   * 
   * **Casos de salida temprana:**
   * - Si no hay selección, termina sin acción
   * - Si la unidad no se encuentra en la tabla (`index === -1`), termina sin acción
   */
  iniciarEditarUnidad(): void {
    if (!this.filasUnidadSeleccionadas || this.filasUnidadSeleccionadas.length === 0) {
      return;
    }
    const UNIDAD = this.filasUnidadSeleccionadas[0];
    const INDICE = this.unidadesTablaConfig.datos.indexOf(UNIDAD);
    if (INDICE === -1) {
      return;
    }
    this.editarIndiceUnitario = INDICE;
    this.unidadFormulario.reset();
    this.unidadFormulario.patchValue(UNIDAD);
    this.abrirPedimentoUnidad();
  }

  /**
   * Agrega una nueva unidad de arrastre o actualiza una existente en la tabla.
   * 
   * Valida el formulario de unidad de arrastre y, si es válido, procede a agregar
   * o actualizar el registro en la tabla. Incluye lógica de incremento automático
   * de ID y limpieza del estado del formulario.
   * 
   * @remarks
   * **Proceso de validación:**
   * - Marca el formulario como enviado (`enviada = true`)
   * - Activa validación manual en todos los controles
   * - Marca todos los campos como tocados para mostrar errores
   * - Solo procede si el formulario es válido
   * 
   * **Lógica de actualización vs. inserción:**
   * - Si `editarIndiceUnitario` no es null: actualiza el registro existente en esa posición
   * - Si `editarIndiceUnitario` es null: agrega un nuevo registro al final de la tabla
   * - Utiliza `Object.assign()` para actualización y spread operator para inserción
   * 
   * **Post-procesamiento:**
   * - Calcula el próximo ID automáticamente basándose en el máximo actual
   * - Restablece el estado del formulario (`enviada = false`)
   * - Limpia el formulario con `reset()`
   * - Configura el nuevo ID y lo deshabilita
   * - Cierra el modal automáticamente
   * 
   * **Gestión de estado:**
   * - Restablece `editarIndiceUnitario` a null después de actualizar
   * - Crea nueva referencia del array para triggear detección de cambios
   */
  agregarUnidadData(): void {
    this.enviada = true;
    // Activar la validación manualmente para todos los controles de formulario.
    Object.values(this.unidadFormulario.controls).forEach(control => {
      control.markAsTouched({ onlySelf: true });
      control.updateValueAndValidity();
    });

    if (this.unidadFormulario.valid) {
      const VALOR_FORMULARIO = this.unidadFormulario.getRawValue();
      if (this.editarIndiceUnitario !== null) {
        const CURRENTUNIDADAS = [...(this.tramiteQuery.getValue().unidadesArrastre || [])];
        CURRENTUNIDADAS[this.editarIndiceUnitario] = VALOR_FORMULARIO;
        this.store.setUnidadesArrastre(CURRENTUNIDADAS);
        this.editarIndiceUnitario = null;
      } else {
        const CURRENTUNIDADAS = this.tramiteQuery.getValue().unidadesArrastre || [];
        this.store.setUnidadesArrastre([...CURRENTUNIDADAS, VALOR_FORMULARIO]);
      }
      // Incrementa automáticamente el ID para la próxima unidad de arrastre
      const ID_MAXIMO_UNIDAD = Math.max(...this.unidadesTablaConfig.datos.map(u => Number(u.idDeVehiculoUnidad) || 0));
      this.enviada = false;
      this.unidadFormulario.reset();
      this.unidadFormulario.get('idDeVehiculoUnidad')?.setValue(ID_MAXIMO_UNIDAD + 1);
      this.unidadFormulario.get('idDeVehiculoUnidad')?.disable();
      this.cerrarUnidadModal.nativeElement.click();
    }
  }

  /**
   * Carga los datos del pedimento en la tabla de vehículos desde el servicio.
   * 
   * Realiza una solicitud HTTP para obtener los datos de vehículos del pedimento
   * y actualiza la configuración de la tabla con la información recibida.
   * 
   * @remarks
   * - Utiliza `takeUntil` para manejar automáticamente la cancelación de la suscripción
   * - Los datos se asignan directamente a `vehiculosTablaConfig.datos`
   * - La respuesta debe cumplir con la interfaz `VehiculoTablaDatos`
   */
  public cargarPedimentoTabla(): void {
    this.modificarTerrestreService
      .obtenerPedimentoTabla()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos: VehiculoTablaDatos) => {
        this.vehiculosTablaConfig.datos = datos.datos;
      });
  }

  /**
   * Limpia el formulario de vehículo y restablece el estado de validación.
   * 
   * Restablece todos los campos del formulario a sus valores iniciales,
   * limpia los errores de validación y marca el formulario como no enviado.
   */
  limpiarVahiculodata(): void {
    this.enviada = false;
    this.vehiculoFormulario.reset();
  }

  /**
   * Limpia el formulario de unidad de arrastre y restablece el estado de validación.
   * 
   * Restablece todos los campos del formulario a sus valores iniciales,
   * limpia los errores de validación y marca el formulario como no enviado.
   */
  limpiarUnidaddata(): void {
    this.enviada = false;
    this.unidadFormulario.reset();
  }

  /**
   * Abre una notificación modal de confirmación.
   * 
   * Configura y muestra una notificación modal con mensaje de éxito
   * para informar al usuario que el registro fue agregado correctamente.
   * La notificación se cierra automáticamente después de 2 segundos.
   */
  public abrirModal(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'El registro fue agregado correctamente.',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }

  /**
   * Carga el catálogo de tipos de vehículo desde el servicio correspondiente.
   * 
   * Este método realiza una solicitud al servicio para obtener la lista de tipos
   * de vehículo disponibles. Una vez recibida la respuesta, actualiza la propiedad
   * `tipoDeVehiculoCatalogo` y configura las tablas con las descripciones correspondientes.
   * 
   * @remarks
   * - Utiliza `takeUntil` para limpiar automáticamente la suscripción cuando se destruya el componente
   * - Los datos se almacenan en `tipoDeVehiculoCatalogo` para su uso en formularios y validaciones
   * - Después de cargar los datos, se ejecuta `configurarTablasConDescripciones()` para actualizar las tablas
   */
  public cargarTipoDeVehiculo(): void {
    this.modificarTerrestreService
      .obtenerTipoDeVehiculo()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos: CatalogoLista) => {
        this.tipoDeVehiculoCatalogo = datos.datos;
        this.configurarTablasConDescripciones();
      });
  }
}
