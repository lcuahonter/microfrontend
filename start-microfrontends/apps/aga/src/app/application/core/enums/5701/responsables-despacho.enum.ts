import { ConfiguracionColumna } from '@libs/shared/data-access-user/src';
import { ResponsablesDespacho } from '../../models/5701/tramite5701.model';

/**
 * @description
 * Configuración de las columnas para la tabla de terceros.
 */
export const CONFIGURACION_ENCABEZADO_TABLA_RESPONSABLES_DESPACHO: ConfiguracionColumna<ResponsablesDespacho>[] =
  [
    /**
     * Encabezado de la columna que muestra el gafete de la persona responsable del despacho.
     * - Encabezado: "Gafete".
     * - Clave: Obtiene el valor de `gafeteRespoDespacho` de la fila.
     * - Orden: 1.
     */
    {
      encabezado: 'Gafete',
      clave: (fila) => fila.gafeteRespoDespacho,
      orden: 1,
    },

    /**
     * Encabezado de la columna que muestra el nombre de la persona responsable del despacho.
     * - Encabezado: "Nombre".
     * - Clave: Obtiene el valor de `nombre` de la fila.
     * - Orden: 2.
     */
    { encabezado: 'Nombre', clave: (fila) => fila.nombre, orden: 2 },

    /**
     * Encabezado de la columna que muestra el apellido paterno de la persona responsable del despacho.
     * - Encabezado: "Apellido paterno".
     * - Clave: Obtiene el valor de `primerApellido` de la fila.
     * - Orden: 3.
     */
    {
      encabezado: 'Apellido paterno',
      clave: (fila) => fila.primerApellido,
      orden: 3,
    },

    /**
     * Encabezado de la columna que muestra el apellido materno de la persona responsable del despacho.
     * - Encabezado: "Apellido materno".
     * - Clave: Obtiene el valor de `segundoApellido` de la fila.
     * - Orden: 4.
     */
    {
      encabezado: 'Apellido materno',
      clave: (fila) => fila.segundoApellido,
      orden: 4,
    },
  ];


