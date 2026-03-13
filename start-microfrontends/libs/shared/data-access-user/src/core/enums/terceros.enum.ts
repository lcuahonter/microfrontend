import { ConfiguracionColumna } from '../models/shared/configuracion-columna.model';
import { PersonaTerceros } from '../models/shared/datos-generales.model';

/**
 * @description
 * Configuración de las columnas para la tabla de terceros.
 */
export const CONFIGURACION_ENCABEZADO_TABLA_TERCEROS: ConfiguracionColumna<PersonaTerceros>[] =
  [
    /**
     * Encabezado de la columna que muestra el nombre de la persona.
     * - Encabezado: "Nombre / Razón Social:".
     * - Clave: Obtiene el valor de `nombre` de la fila.
     * - Orden: 1.
     */
    { encabezado: 'Nombre / Razón Social', clave: (fila) => fila.nombre, orden: 1 },

    /**
     * Encabezado de la columna que muestra el correo electrónico de la persona.
     * - Encabezado: "Correo".
     * - Clave: Obtiene el valor de `correo` de la fila.
     * - Orden: 2.
     */
    { encabezado: 'Correo electrónico', clave: (fila) => fila.correo, orden: 2 },
  ];
