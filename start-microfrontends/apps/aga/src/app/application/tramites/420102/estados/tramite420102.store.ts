/**
 * @fileoverview Archivo que contiene el store del trámite 420102 para la gestión de estado.
 * 
 * Este archivo implementa el patrón de gestión de estado utilizando Akita para manejar
 * toda la información relacionada con el trámite 420102, incluyendo RFC, fechas y datos
 * de tablas. Proporciona métodos para actualizar cada parte del estado de forma reactiva.
 * 
 * @author Sistema VUCEM 3.0
 * @version 1.0.0
 * @since 2025
 */

// Importación de tipos y modelos del trámite 420102
import { DatosDelContenedorTabla } from '../models/tramite420102.enum';

// Importaciones de Angular Core para inyección de dependencias
import { Injectable } from '@angular/core';

// Importaciones de Akita para gestión de estado reactivo
import { Store } from '@datorama/akita';
import { StoreConfig } from '@datorama/akita';

/**
 * @interface Tramite420102State
 * @description Interfaz que define la estructura completa del estado del trámite 420102.
 * 
 * Esta interfaz establece el contrato de datos que se mantendrá en el store de Akita,
 * asegurando la consistencia de tipos en toda la aplicación. Incluye información
 * básica del trámite como RFC y fechas, así como datos opcionales de tabla.
 *
 * @property {string} rfc - Registro Federal de Contribuyentes asociado al trámite.
 *                         Debe seguir el formato estándar mexicano (13 caracteres).
 * @property {string} fechaInicial - Fecha de inicio del período del trámite.
 *                                   Formato esperado: YYYY-MM-DD
 * @property {string} fechaFinal - Fecha de finalización del período del trámite.
 *                                 Formato esperado: YYYY-MM-DD
 * @property {DatosDelContenedorTabla[]} [tableDatos] - Array opcional que contiene
 *                                                      los datos de la tabla asociados
 *                                                      al trámite. Puede estar vacío
 *                                                      durante la inicialización.
 * 
 * @see {@link DatosDelContenedorTabla} Para más detalles sobre la estructura de datos de tabla
 * @since 1.0.0
 */
export interface Tramite420102State {
  /** RFC del contribuyente - Registro Federal de Contribuyentes (13 caracteres) */
  rfc: string;
  /** Fecha de inicio del período - Formato ISO 8601 (YYYY-MM-DD) */
  fechaInicial: string;
  /** Fecha de finalización del período - Formato ISO 8601 (YYYY-MM-DD) */
  fechaFinal: string;
  /** Datos opcionales de la tabla asociada al trámite */
  tableDatos?: DatosDelContenedorTabla[];
}

/**
 * @function createTramiteState
 * @description Función factory que crea y retorna el estado inicial del trámite 420102.
 * 
 * Esta función se encarga de establecer los valores por defecto para todas las
 * propiedades del estado del trámite. Es utilizada por el constructor del store
 * para inicializar el estado de manera consistente.
 * 
 * Los valores iniciales son:
 * - RFC: cadena vacía (será establecido por el usuario)
 * - Fecha inicial: cadena vacía (será establecida por el usuario)
 * - Fecha final: cadena vacía (será establecida por el usuario)
 * - Datos de tabla: array vacío (se llenará conforme se carguen datos)
 *
 * @returns {Tramite420102State} El estado inicial del trámite con valores por defecto.
 * 
 * @example
 * ```typescript
 * const estadoInicial = createTramiteState();
 * console.log(estadoInicial.rfc); // ''
 * console.log(estadoInicial.tableDatos); // []
 * ```
 * 
 * @since 1.0.0
 */
export function createTramiteState(): Tramite420102State {
  return {
    // RFC inicializado como cadena vacía - será establecido por el usuario
    rfc: '',
    // Fecha inicial vacía - formato esperado YYYY-MM-DD
    fechaInicial: '',
    // Fecha final vacía - formato esperado YYYY-MM-DD
    fechaFinal: '',
    // Array de datos de tabla inicializado vacío
    tableDatos: []
  };
}

/**
 * @class Tramite420102Store
 * @description Clase principal que representa el store para manejar el estado del trámite 420102.
 * 
 * Esta clase extiende el Store de Akita y proporciona una interfaz reactiva para gestionar
 * el estado completo del trámite 420102. Incluye métodos para actualizar cada propiedad
 * del estado de forma inmutable, manteniendo la consistencia y permitiendo la suscripción
 * a cambios desde cualquier componente de la aplicación.
 * 
 * Características principales:
 * - Gestión reactiva del estado utilizando Akita
 * - Métodos tipados para cada propiedad del estado
 * - Estado inmutable con actualizaciones controladas
 * - Inyección de dependencias a nivel de aplicación
 * - Capacidad de reseteo del estado
 * 
 * Utiliza Akita para la gestión reactiva del estado, proporcionando:
 * - Observables para suscribirse a cambios
 * - Historial de cambios
 * - Capacidades de debugging
 * - Persistencia opcional del estado
 *
 * @example
 * ```typescript
 * // Inyección en un componente
 * constructor(private tramite420102Store: Tramite420102Store) {}
 * 
 * // Establecer valores
 * this.tramite420102Store.establecerRfc('ABC123456789');
 * this.tramite420102Store.establecerFechaInicial('2025-01-01');
 * this.tramite420102Store.establecerFechaFinal('2025-12-31');
 * 
 * // Establecer datos de tabla
 * const datos: DatosDelContenedorTabla[] = [...];
 * this.tramite420102Store.establecerTablaDatos(datos);
 * ```
 * 
 * @extends {Store<Tramite420102State>}
 * @since 1.0.0
 * @see {@link Tramite420102State} Para la estructura del estado
 * @see {@link DatosDelContenedorTabla} Para los tipos de datos de tabla
 */
/**
 * Decorador Injectable que permite la inyección de dependencias a nivel raíz de la aplicación.
 * Esto garantiza que la instancia del store sea singleton en toda la aplicación.
 */
@Injectable({ providedIn: 'root' })
/**
 * Configuración del store de Akita que establece:
 * - name: Identificador único del store para debugging y DevTools
 * - resettable: Permite resetear el store a su estado inicial
 */
@StoreConfig({ name: 'tramite420102', resettable: true })
export class Tramite420102Store extends Store<Tramite420102State> {
  /**
   * @constructor
   * @description Constructor que inicializa el store con el estado inicial del trámite 420102.
   * 
   * Llama al constructor de la clase padre (Store) pasando el estado inicial creado
   * por la función createTramiteState(). Esto establece los valores por defecto
   * para todas las propiedades del estado.
   * 
   * El constructor se ejecuta automáticamente cuando Angular inyecta este servicio,
   * garantizando que el estado esté listo para uso inmediato.
   * 
   * @since 1.0.0
   */
  constructor() {
    // Inicialización del store padre con el estado inicial
    super(createTramiteState());
  }

  /**
   * @method establecerRfc
   * @description Método para actualizar el RFC en el estado del trámite de forma reactiva.
   * 
   * Este método utiliza la función update() de Akita para modificar el estado de manera
   * inmutable. Crea un nuevo objeto de estado manteniendo todas las propiedades existentes
   * y actualizando únicamente el RFC.
   * 
   * El cambio se propaga automáticamente a todos los observadores suscritos al estado,
   * permitiendo que los componentes reaccionen a este cambio.
   *
   * @param {string} rfc - Nuevo RFC a establecer. Debe ser un string válido que represente
   *                       el Registro Federal de Contribuyentes (formato de 13 caracteres).
   *                       
   * @returns {void} No retorna valor, pero actualiza el estado reactivamente.
   * 
   * @example
   * ```typescript
   * // Establecer un RFC válido
   * this.tramite420102Store.establecerRfc('ABC123456789');
   * 
   * // El cambio se propaga automáticamente a todos los suscriptores
   * ```
   * 
   * @since 1.0.0
   */
  public establecerRfc(rfc: string): void {
    // Actualización inmutable del estado manteniendo las demás propiedades
    this.update((state) => ({
      ...state, // Spread del estado actual
      rfc, // Actualización específica del RFC
    }));
  }

  /**
   * @method establecerFechaInicial
   * @description Método para actualizar la fecha inicial en el estado del trámite de forma reactiva.
   * 
   * Este método permite establecer la fecha de inicio del período del trámite 420102.
   * Utiliza el patrón de actualización inmutable de Akita para mantener la integridad
   * del estado y notificar automáticamente a todos los observadores suscritos.
   * 
   * La fecha debe estar en formato ISO 8601 (YYYY-MM-DD) para mantener consistencia
   * en toda la aplicación y facilitar las operaciones de comparación y validación.
   *
   * @param {string} fechaInicial - Nueva fecha inicial a establecer en formato YYYY-MM-DD.
   *                                Debe ser una fecha válida anterior o igual a fechaFinal.
   *                                
   * @returns {void} No retorna valor, pero actualiza el estado reactivamente.
   * 
   * @example
   * ```typescript
   * // Establecer fecha inicial del período
   * this.tramite420102Store.establecerFechaInicial('2025-01-01');
   * 
   * // Para un período específico del año fiscal
   * this.tramite420102Store.establecerFechaInicial('2025-04-01');
   * ```
   * 
   * @since 1.0.0
   */
  public establecerFechaInicial(fechaInicial: string): void {
    // Actualización inmutable preservando el resto del estado
    this.update((state) => ({
      ...state, // Mantiene todas las propiedades existentes
      fechaInicial, // Actualiza únicamente la fecha inicial
    }));
  }

  /**
   * @method establecerFechaFinal
   * @description Método para actualizar la fecha final en el estado del trámite de forma reactiva.
   * 
   * Este método permite establecer la fecha de finalización del período del trámite 420102.
   * La actualización se realiza de manera inmutable, preservando todas las demás propiedades
   * del estado y notificando automáticamente a todos los componentes suscritos al cambio.
   * 
   * La fecha final debe ser posterior o igual a la fecha inicial para mantener la coherencia
   * temporal del período del trámite. Se recomienda validar esta condición en la lógica
   * de negocio antes de llamar a este método.
   *
   * @param {string} fechaFinal - Nueva fecha final a establecer en formato YYYY-MM-DD.
   *                              Debe ser una fecha válida posterior o igual a fechaInicial.
   *                              
   * @returns {void} No retorna valor, pero actualiza el estado reactivamente.
   * 
   * @example
   * ```typescript
   * // Establecer fecha final del período
   * this.tramite420102Store.establecerFechaFinal('2025-12-31');
   * 
   * // Para un período trimestral
   * this.tramite420102Store.establecerFechaFinal('2025-06-30');
   * ```
   * 
   * @since 1.0.0
   */
  public establecerFechaFinal(fechaFinal: string): void {
    // Actualización reactiva manteniendo la inmutabilidad del estado
    this.update((state) => ({
      ...state, // Preserva todas las propiedades del estado actual
      fechaFinal, // Actualiza específicamente la fecha final
    }));
  }

 /**
  * @method establecerTablaDatos
  * @description Método para actualizar los datos de la tabla en el estado del trámite de forma reactiva.
  * 
  * Este método permite establecer o reemplazar completamente los datos de la tabla asociados
  * al trámite 420102. Los datos se almacenan como un array de objetos que implementan la
  * interfaz DatosDelContenedorTabla, proporcionando una estructura consistente para la
  * información tabular del trámite.
  * 
  * La actualización se realiza de manera inmutable, reemplazando todo el array existente
  * con el nuevo conjunto de datos. Esto garantiza que los componentes de tabla suscritos
  * al estado reciban la actualización completa y puedan re-renderizar correctamente.
  * 
  * Este método es especialmente útil cuando se cargan datos desde una API o cuando se
  * necesita actualizar toda la información de la tabla de una sola vez.
  *
  * @param {DatosDelContenedorTabla[]} tableDatos - Nuevo array de datos de la tabla a establecer
  *                                                 en el estado. Cada elemento debe cumplir con
  *                                                 la estructura definida en DatosDelContenedorTabla.
  *                                                 Puede ser un array vacío para limpiar los datos.
  *                                                 
  * @returns {void} No retorna valor, pero actualiza el estado reactivamente.
  * 
  * @example
  * ```typescript
  * // Establecer datos de tabla desde una respuesta de API
  * const datosApi: DatosDelContenedorTabla[] = await this.servicio.obtenerDatos();
  * this.tramite420102Store.establecerTablaDatos(datosApi);
  * 
  * // Limpiar los datos de la tabla
  * this.tramite420102Store.establecerTablaDatos([]);
  * 
  * // Establecer datos manuales
  * const datosLocales: DatosDelContenedorTabla[] = [
  *   { id: 1, descripcion: 'Item 1', valor: 100 },
  *   { id: 2, descripcion: 'Item 2', valor: 200 }
  * ];
  * this.tramite420102Store.establecerTablaDatos(datosLocales);
  * ```
  * 
  * @see {@link DatosDelContenedorTabla} Para más detalles sobre la estructura de datos
  * @since 1.0.0
  */
  public establecerTablaDatos(tableDatos: DatosDelContenedorTabla[]): void {
    // Actualización inmutable del array de datos de tabla
    this.update((state) => ({
      ...state, // Conserva todas las demás propiedades del estado
      tableDatos, // Reemplaza completamente el array de datos de tabla
    }));
  }

}