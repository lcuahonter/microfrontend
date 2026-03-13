import { TablaPersonasNotificaciones } from '../models/personas-notificaciones-tabla.model';

/**
 * Configuración de columnas para la tabla de personas notificaciones.
 * 
 * Define la estructura y propiedades de cada columna que se mostrará
 * en la tabla dinámica de personas para notificaciones, incluyendo
 * encabezados, claves de acceso a datos y orden de visualización.
 * 
 * @description Cada objeto de configuración contiene:
 * - `encabezado`: Texto que se muestra en el encabezado de la columna
 * - `clave`: Función que extrae el valor del objeto de datos
 * - `orden`: Número que determina la posición de la columna
 * 
 * @example
 * ```typescript
 * // Uso en un componente de tabla
 * this.configuracionTabla = PERSONAS_NOTIFICACIONES_TABLA;
 * ```
 * 
 * @constant
 * @type {ConfiguracionColumna<TablaPersonasNotificaciones>[]}
 * @since 1.0.0
 * @author Equipo de Desarrollo VUCEM
 */
export const PERSONAS_NOTIFICACIONES_TABLA = [
    {
        /** Columna para el Registro Federal de Contribuyentes */
        encabezado: 'RFC',
        clave: (ele: TablaPersonasNotificaciones): string => ele.rfc,
        orden: 1,
    },
    {
        /** Columna para la Clave Única de Registro de Población */
        encabezado: 'CURP',
        clave: (ele: TablaPersonasNotificaciones): string => ele.curp,
        orden: 2,
    },
    {
        /** Columna para el nombre de la persona */
        encabezado: 'Nombre',
        clave: (ele: TablaPersonasNotificaciones): string => ele.nombre,
        orden: 3,
    },
    {
        /** Columna para el apellido paterno */
        encabezado: 'Apellido paterno',
        clave: (ele: TablaPersonasNotificaciones): string => ele.apellidoPaterno,
        orden: 4,
    },
    {
        /** Columna para el apellido materno */
        encabezado: 'Apellido materno',
        clave: (ele: TablaPersonasNotificaciones): string => ele.apellidoMaterno,
        orden: 5,
    }
];

/**
 * Configuración de paneles colapsables para la interfaz de usuario.
 * 
 * Define los paneles que pueden expandirse o contraerse en la
 * interfaz de personas notificaciones, incluyendo su estado inicial
 * y etiquetas descriptivas.
 * 
 * @description Cada panel contiene:
 * - `label`: Texto descriptivo que se muestra en el encabezado del panel
 * - `isCollapsed`: Estado inicial del panel (true = contraído, false = expandido)
 * 
 * @example
 * ```typescript
 * // Uso en un componente
 * this.panels = PANELS;
 * 
 * // Alternar estado de un panel
 * this.panels[0].isCollapsed = !this.panels[0].isCollapsed;
 * ```
 * 
 * @constant
 * @type {Panel[]}
 * @since 1.0.0
 * @author Equipo de Desarrollo VUCEM
 */
export const PANELS = [
    { 
        /** Panel principal para la gestión de personas notificaciones */
        label: 'Personas para oír y recibir notificaciones', 
        isCollapsed: false 
    }
];