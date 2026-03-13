import { CrosslistComponent } from "@libs/shared/data-access-user/src";

/**
 * @interface CrosslistBoton
 * @description Interfaz que define la estructura de un botón utilizado en el componente Crosslist
 * para operaciones de gestión de listas dinámicas en el trámite 300105. Cada botón tiene un nombre
 * descriptivo, una clase CSS para su estilización y una función asociada que se ejecuta al hacer clic.
 * 
 * Esta interfaz estandariza la configuración de botones para operaciones como agregar, remover,
 * agregar todo y remover todo elementos en las listas de crosslist del sistema VUCEM.
 * 
 * @example
 * ```typescript
 * const botonEjemplo: CrosslistBoton = {
 *   btnNombre: 'Agregar Seleccionados',
 *   class: 'btn-primary',
 *   funcion: () => this.agregarElementos()
 * };
 * ```
 * 
 * @since 1.0.0
 * @author VUCEM Development Team
 */
export interface CrosslistBoton {
  /**
   * @property {string} btnNombre - Nombre del botón que se mostrará en la interfaz
   * @description Texto descriptivo que aparece en el botón y que indica la acción
   * que realizará el usuario al hacer clic. Debe ser claro y conciso para una
   * experiencia de usuario óptima.
   * 
   * @example
   * ```typescript
   * btnNombre: 'Agregar todo'
   * btnNombre: 'Remover seleccionados'
   * ```
   */
  btnNombre: string;

  /**
   * @property {string} class - Clase CSS que define el estilo del botón
   * @description Clase CSS que se aplica al botón para definir su apariencia visual.
   * Típicamente incluye clases de Bootstrap o del sistema de diseño de VUCEM
   * para mantener consistencia visual en la aplicación.
   * 
   * @example
   * ```typescript
   * class: 'btn-primary'    // Botón principal azul
   * class: 'btn-danger'     // Botón de advertencia rojo
   * class: 'btn-default'    // Botón estándar gris
   * ```
   */
  class: string;

  /**
   * @property {Function} funcion - Función que se ejecutará al hacer clic en el botón
   * @description Función callback que define la lógica a ejecutar cuando el usuario
   * hace clic en el botón. Esta función interactúa con el componente CrosslistComponent
   * para realizar operaciones específicas en las listas dinámicas.
   * 
   * @returns {void}
   * 
   * @example
   * ```typescript
   * funcion: (): void => {
   *   if (crosslistComponent) {
   *     crosslistComponent.agregar('t');
   *   }
   * }
   * ```
   */
  funcion: () => void;
}

/**
 * @function OBTENER_BOTONES_CROSSLIST
 * @description Función que genera una lista predefinida de botones para el componente Crosslist
 * utilizado en el trámite 300105. Esta función crea una configuración estándar de botones
 * que permite realizar operaciones comunes en listas dinámicas como agregar y remover elementos
 * individuales o en lote.
 * 
 * La función retorna un array con cuatro botones configurados:
 * 1. Agregar: Agrega elementos específicos con filtro 't'
 * 2. Agregar todo: Agrega todos los elementos disponibles
 * 3. Remover: Remueve elementos específicos
 * 4. Remover todo: Remueve todos los elementos con filtro 't'
 * 
 * @param {CrosslistComponent} crosslistComponent - Componente Crosslist al que se asocian las funciones de los botones
 * @returns {CrosslistBoton[]} Array de objetos `CrosslistBoton` con las configuraciones de los botones
 * 
 * @example
 * ```typescript
 * // Uso típico en un componente
 * export class MiComponente {
 *   @ViewChild(CrosslistComponent) crosslist!: CrosslistComponent;
 *   
 *   ngOnInit() {
 *     this.botones = OBTENER_BOTONES_CROSSLIST(this.crosslist);
 *   }
 * }
 * ```
 * 
 * @example
 * ```html
 * <!-- Uso en template -->
 * <div *ngFor="let boton of botones">
 *   <button [class]="boton.class" (click)="boton.funcion()">
 *     {{ boton.btnNombre }}
 *   </button>
 * </div>
 * ```
 * 
 * @since 1.0.0
 * @author VUCEM Development Team
 */
export const OBTENER_BOTONES_CROSSLIST = (crosslistComponent: CrosslistComponent): CrosslistBoton[] => [
  {
    /**
     * @description Botón Agregar - Permite agregar un elemento específico al componente Crosslist
     * utilizando el filtro 't' para seleccionar elementos específicos de la lista disponible.
     * Utiliza la clase 'btn-primary' para indicar que es una acción principal.
     */
    btnNombre: 'Agregar',
    class: 'btn-primary',
    funcion: (): void => {
      if (crosslistComponent) {
        crosslistComponent.agregar('t');
      }
    },
  },
  {
    /**
     * @description Botón Agregar todo - Permite agregar todos los elementos disponibles al componente Crosslist
     * sin aplicar filtros, transfiriendo toda la lista de elementos disponibles a la lista seleccionada.
     * Utiliza la clase 'btn-default' para indicar que es una acción secundaria.
     */
    btnNombre: 'Agregar todo',
    class: 'btn-default',
    funcion: (): void => {
      if (crosslistComponent) {
        crosslistComponent.agregar('');
      }
    },
  },
  {
    /**
     * @description Botón Remover - Permite quitar un elemento específico del componente Crosslist
     * removiendo elementos seleccionados de la lista sin aplicar filtros específicos.
     * Utiliza la clase 'btn-danger' para indicar que es una acción de eliminación.
     */
    btnNombre: 'Remover',
    class: 'btn-danger',
    funcion: (): void => {
      if (crosslistComponent) {
        crosslistComponent.quitar('');
      }
    },
  },
  {
    /**
     * @description Botón Remover todo - Permite quitar todos los elementos del componente Crosslist
     * utilizando el filtro 't' para remover todos los elementos de la lista seleccionada.
     * Utiliza la clase 'btn-default' para indicar que es una acción secundaria de limpieza.
     */
    btnNombre: 'Remover todo',
    class: 'btn-default',
    funcion: (): void => {
      if (crosslistComponent) {
        crosslistComponent.quitar('t');
      }
    },
  },
];


/**
 * @constant OPCIONES_DE_BOTON_DE_RADIO
 * @description Matriz de opciones predefinidas para botones de radio utilizados en el trámite 300105
 * de autorización de equipos de rayos X. Define las opciones disponibles para seleccionar
 * el tipo de autorización requerida.
 * 
 * Cada objeto en el array representa una opción de botón de radio con:
 * - `label`: El texto descriptivo mostrado al usuario en la interfaz
 * - `value`: El valor correspondiente que se almacena cuando se selecciona la opción
 * 
 * Opciones disponibles:
 * 1. Exento (valor: '1'): Para casos donde el equipo está exento de autorización
 * 2. Autorización (valor: '0'): Para casos donde se requiere autorización completa
 * 
 * @type {Array<{label: string, value: string}>}
 * 
 * @example
 * ```typescript
 * // Uso en un componente Angular
 * export class AutorizacionComponent {
 *   opciones = OPCIONES_DE_BOTON_DE_RADIO;
 *   tipoSeleccionado: string = '';
 *   
 *   onSeleccionChanged(valor: string) {
 *     this.tipoSeleccionado = valor;
 *   }
 * }
 * ```
 * 
 * @example
 * ```html
 * <!-- Uso en template Angular -->
 * <div *ngFor="let opcion of opciones">
 *   <input type="radio" 
 *          [value]="opcion.value" 
 *          [(ngModel)]="tipoSeleccionado"
 *          [id]="'radio-' + opcion.value">
 *   <label [for]="'radio-' + opcion.value">{{ opcion.label }}</label>
 * </div>
 * ```
 * 
 * @example
 * ```typescript
 * // Validación del valor seleccionado
 * const esExento = this.tipoSeleccionado === '1';
 * const requiereAutorizacion = this.tipoSeleccionado === '0';
 * ```
 * 
 * @since 1.0.0
 * @author VUCEM Development Team
 * @readonly
 */
export const OPCIONES_DE_BOTON_DE_RADIO = [
    {
        /**
         * @description Opción para equipos exentos de autorización.
         * Cuando se selecciona esta opción, indica que el equipo de rayos X
         * está exento de requerir autorización específica.
         */
        label: 'Exento',
        value: '1',
    },
    {
        /**
         * @description Opción para equipos que requieren autorización completa.
         * Cuando se selecciona esta opción, indica que el equipo de rayos X
         * requiere pasar por el proceso completo de autorización.
         */
        label: 'Autorización',
        value: '0',
    }
];