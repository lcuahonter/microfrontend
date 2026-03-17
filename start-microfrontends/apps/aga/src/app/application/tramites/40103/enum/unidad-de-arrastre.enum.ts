
/**
 * Importa la definición de columna para tablas dinámicas.
 */
import { Catalogo } from '@ng-mf/data-access-user';
import { ConfiguracionColumna } from '@libs/shared/data-access-user/src';
import { DatosUnidad } from '../models/registro-muestras-mercancias.model';


/**
 * Interfaz que representa la estructura de una unidad de arrastre.
 * Incluye los campos principales para identificar y describir una unidad de arrastre utilizada en el transporte.
 *
 * @interface UnidadArrastre
 * @property {string} numeroEconomico - Número económico de la unidad.
 * @property {string} tipoUnidad - Tipo de unidad de arrastre (ej. remolque, semirremolque).
 * @property {string} marca - Marca del fabricante de la unidad.
 * @property {string} modelo - Modelo de la unidad.
 * @property {string} placas - Placas de circulación.
 * @property {string} capacidad - Capacidad de carga de la unidad.
 * @property {string} propietario - Nombre del propietario de la unidad.
 */
export interface UnidadArrastre {
  numeroEconomico: string;
  tipoUnidad: string;
  marca: string;
  modelo: string;
  placas: string;
  capacidad: string;
  propietario: string;
}

/**
 * Columnas de la tabla para mostrar las unidades de arrastre.
 * Cada columna define el encabezado, la clave de acceso y el orden de aparición.
 *
 * @const UNIDADES_ARRASTRE_COLUMNAS
 * @type {ConfiguracionColumna<UnidadArrastre>[]}
 */
export const UNIDADES_ARRASTRE_COLUMNAS: ConfiguracionColumna<UnidadArrastre>[] = [
  {
    encabezado: 'Número económico',
    clave: (item: UnidadArrastre) => item.numeroEconomico,
    orden: 1,
  },
  {
    encabezado: 'Tipo de unidad',
    clave: (item: UnidadArrastre) => item.tipoUnidad,
    orden: 2,
  },
  {
    encabezado: 'Marca',
    clave: (item: UnidadArrastre) => item.marca,
    orden: 3,
  },
  {
    encabezado: 'Modelo',
    clave: (item: UnidadArrastre) => item.modelo,
    orden: 4,
  },
  {
    encabezado: 'Placas',
    clave: (item: UnidadArrastre) => item.placas,
    orden: 5,
  },
  {
    encabezado: 'Capacidad',
    clave: (item: UnidadArrastre) => item.capacidad,
    orden: 6,
  },
  {
    encabezado: 'Propietario',
    clave: (item: UnidadArrastre) => item.propietario,
    orden: 7,
  },
];

/**
 * Función auxiliar para buscar la descripción en un catálogo por su clave.
 * @param {string} clave - Clave a buscar en el catálogo.
 * @param {Catalogo[]} catalogo - Array del catálogo donde buscar.
 * @returns {string} La descripción encontrada o la clave original si no se encuentra.
 */
export function obtenerDescripcionDeCatalogo(clave: string, catalogo: Catalogo[]): string {
  if (!clave || !catalogo || catalogo.length === 0) {
    return clave || '';
  }
  const ELEMENTO = catalogo.find(c => c.id === Number(clave) || c.descripcion === clave);
  return ELEMENTO ? ELEMENTO.descripcion : clave;
}

/**
 * Función que genera la configuración de columnas para la tabla de unidades de arrastre.
 * Requiere los catálogos como parámetros para realizar las traducciones de códigos a descripciones.
 * 
 * @param {Catalogo[]} tipoDeUnidadCatalogo - Catálogo de tipos de unidad de arrastre.
 * @param {Catalogo[]} paisEmisorCatalogo - Catálogo de países emisores.
 * @returns {ConfiguracionColumna<UnidadTabla>[]} Configuración de columnas para la tabla.
 */
export function obtenerColumnasUnidad(
  tipoDeUnidadCatalogo: Catalogo[],
  paisEmisorCatalogo: Catalogo[]
): ConfiguracionColumna<DatosUnidad>[] {
  return [
    {
      encabezado: 'IDENTIFICACIÓN',
      clave: (item: DatosUnidad): string => item.idDeVehiculo ? String(item.idDeVehiculo) : '',
      orden: 0,
    },
    {
      encabezado: 'VIN del vehículo',
      clave: (item: DatosUnidad): string => item.vinVehiculo || '',
      orden: 1,
    },
    {
      encabezado: 'Tipo de unidad de arrastre',
      clave: (item: DatosUnidad): string => obtenerDescripcionDeCatalogo(item.tipoDeUnidadArrastre, tipoDeUnidadCatalogo),
      orden: 2,
    },
    {
      encabezado: 'Número económico',
      clave: (item: DatosUnidad): string => item.numeroEconomico || '',
      orden: 3,
    },
    {
      encabezado: 'Número de placas',
      clave: (item: DatosUnidad): string => item.numeroPlaca || '',
      orden: 4,
    },
    {
      encabezado: 'Emisora País',
      clave: (item: DatosUnidad): string => obtenerDescripcionDeCatalogo(item.paisEmisor, paisEmisorCatalogo),
      orden: 5,
    },
    {
      encabezado: 'Estado o provincia',
      clave: (item: DatosUnidad): string => item.estado || '',
      orden: 6,
    }
  ];
}


/**
 * Textos y mensajes utilizados en la gestión de unidades de arrastre.
 *
 * @const TEXTOS_UNIDAD_ARRASTRE
 * @property {string} MENSAJE_MODIFICACION - Mensaje de ayuda para modificar o eliminar una unidad de arrastre.
 */
export const TEXTOS_UNIDAD_ARRASTRE = {
  MENSAJE_MODIFICACION: `<p>Para modificar o dar de baja una unidad de arrastre existente, primero debe seleccionarla de la tabla.</p>`,
};
