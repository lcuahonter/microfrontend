import { FraccionTabla } from "@libs/shared/data-access-user/src/core/models/90201/expansion-de-productores.model";

/**
 * Arreglo de configuraciones de columnas para la tabla de Fracción Arancelaria.
 * Cada objeto define la configuración de una columna, incluyendo el encabezado,
 * el campo asociado y otras propiedades de estilo.
 */
export const FRACCION = [
    {
      encabezado: 'Fracción arancelaria',
      clave: (item: FraccionTabla) => item.fraccion,
      orden: 1,
    },
    {
      encabezado: 'Clave del sector',
      clave: (item: FraccionTabla) => item.claveDel,
      orden: 2,
    },
  ];