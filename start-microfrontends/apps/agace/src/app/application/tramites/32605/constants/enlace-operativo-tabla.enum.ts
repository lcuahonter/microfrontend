import { TablaEnlaceOperativo } from '../models/enlace-operativo-tabla.model';

/**
 * Configuración de la tabla de Enlaces Operativos.
 *
 * Define los encabezados, las claves para obtener el valor de cada
 * campo desde la entidad `TablaEnlaceOperativo` y el orden de despliegue.
 */
export const ENLACE_OPERATIVO_TABLA = [
  {
    /** Columna para el Registro Federal de Contribuyentes (RFC) */
    encabezado: 'RFC',
    clave: (ele: TablaEnlaceOperativo): string => ele.rfc,
    orden: 1,
  },
  {
    /** Columna para el Nombre */
    encabezado: 'Nombre',
    clave: (ele: TablaEnlaceOperativo): string => ele.nombre,
    orden: 2,
  },
  {
    /** Columna para el Apellido Paterno */
    encabezado: 'Apellido Paterno',
    clave: (ele: TablaEnlaceOperativo): string => ele.apellidoPaterno,
    orden: 3,
  },
  {
    /** Columna para el Apellido Materno */
    encabezado: 'Apellido Materno',
    clave: (ele: TablaEnlaceOperativo): string => ele.apellidoMaterno,
    orden: 4,
  },
  {
    /** Columna para Ciudad o Estado de Residencia */
    encabezado: 'Ciudad o Estado de Residencia',
    clave: (ele: TablaEnlaceOperativo): string => ele.cuidad,
    orden: 5,
  },
  {
    /** Columna para Cargo o Puesto */
    encabezado: 'Cargo o Puesto',
    clave: (ele: TablaEnlaceOperativo): string => ele.cargo,
    orden: 6,
  },
  {
    /** Columna para Teléfono */
    encabezado: 'Teléfono',
    clave: (ele: TablaEnlaceOperativo): string => ele.telefono,
    orden: 7,
  },
  {
    /** Columna para Correo Electrónico */
    encabezado: 'Correo Electrónico',
    clave: (ele: TablaEnlaceOperativo): string => ele.correoElectronico,
    orden: 8,
  },
  {
    /**
     * Columna para Suplente.
     * Muestra "Sí" si `suplente` es verdadero, en caso contrario "No".
     */
    encabezado: 'Suplente',
    clave: (ele: TablaEnlaceOperativo): string => (ele.suplente ? 'Sí' : 'No'),
    orden: 9,
  },
];


/**
 * Lista de paneles de configuración para la interfaz de usuario.
 * @description Define los paneles visibles en la pantalla, junto con su estado de colapso.
 */
export const PANELS = [
  {
    /**
     * Etiqueta que se muestra en el encabezado del panel.
     */
    label: 'Enlace Operativo',

    /**
     * Indica si el panel está colapsado por defecto.
     */
    isCollapsed: false,
  },
];

