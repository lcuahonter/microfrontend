import { TablaPersonasNotificaciones } from '../models/personas-notificaciones-tabla.model';

/**
 * Configuración de columnas para la tabla de personas notificaciones.
 * 
 * Define la estructura y propiedades de cada columna que se mostrará
 * en la tabla dinámica de personas para notificaciones, incluyendo
 * encabezados, claves de acceso a datos y orden de visualización.
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
        encabezado: 'Apellido Paterno',
        clave: (ele: TablaPersonasNotificaciones): string => ele.apellidoPaterno,
        orden: 4,
    },
    {
        /** Columna para el apellido materno */
        encabezado: 'Apellido Materno',
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
 */
export const PERSONAS_NOTIFICACIONES_PANELS = [
    { 
        label: 'Personas para oír y recibir notificaciones', // Etiqueta del panel
        isCollapsed: false // Estado inicial del panel (expandido)
    }
];