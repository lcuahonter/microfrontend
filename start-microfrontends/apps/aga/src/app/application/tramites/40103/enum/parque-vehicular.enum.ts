
/**
 * Importa la definición de columna para tablas dinámicas.
 */
import { Catalogo } from '@ng-mf/data-access-user';
import { ConfiguracionColumna } from '@libs/shared/data-access-user/src';
import { DatosVehiculo } from '../models/registro-muestras-mercancias.model';


/**
 * Interfaz que representa la estructura de un vehículo del parque vehicular.
 * Incluye los campos principales para identificar y describir un vehículo utilizado en el transporte.
 *
 * @interface VehiculoParque
 * @property {string} numeroEconomico - Número económico del vehículo.
 * @property {string} tipoVehiculo - Tipo de vehículo (ej. camión, tractocamión).
 * @property {string} marca - Marca del fabricante del vehículo.
 * @property {string} modelo - Modelo del vehículo.
 * @property {string} placas - Placas de circulación.
 * @property {string} capacidad - Capacidad de carga del vehículo.
 * @property {string} propietario - Nombre del propietario del vehículo.
 */
export interface VehiculoParque {
  numeroEconomico: string;
  tipoVehiculo: string;
  marca: string;
  modelo: string;
  placas: string;
  capacidad: string;
  propietario: string;
}

/**
 * Columnas de la tabla para mostrar los vehículos del parque vehicular.
 * Cada columna define el encabezado, la clave de acceso y el orden de aparición.
 *
 * @const PARQUE_VEHICULAR_COLUMNAS
 * @type {ConfiguracionColumna<VehiculoParque>[]}
 */
export const PARQUE_VEHICULAR_COLUMNAS: ConfiguracionColumna<VehiculoParque>[] = [
  {
    encabezado: 'Número económico',
    clave: (item: VehiculoParque) => item.numeroEconomico,
    orden: 1,
  },
  {
    encabezado: 'Tipo de vehículo',
    clave: (item: VehiculoParque) => item.tipoVehiculo,
    orden: 2,
  },
  {
    encabezado: 'Marca',
    clave: (item: VehiculoParque) => item.marca,
    orden: 3,
  },
  {
    encabezado: 'Modelo',
    clave: (item: VehiculoParque) => item.modelo,
    orden: 4,
  },
  {
    encabezado: 'Placas',
    clave: (item: VehiculoParque) => item.placas,
    orden: 5,
  },
  {
    encabezado: 'Capacidad',
    clave: (item: VehiculoParque) => item.capacidad,
    orden: 6,
  },
  {
    encabezado: 'Propietario',
    clave: (item: VehiculoParque) => item.propietario,
    orden: 7,
  },
];


/**
 * Textos y mensajes utilizados en la gestión del parque vehicular.
 *
 * @const TEXTOS_PARQUE_VEHICULAR
 * @property {string} MENSAJE_MODIFICACION - Mensaje de ayuda para modificar o eliminar un vehículo.
 */
export const TEXTOS_PARQUE_VEHICULAR = {
  MENSAJE_MODIFICACION: `<p>Para modificar o dar de baja un vehículo existente, primero debe seleccionarlo de la tabla.</p>`,
};

/**
 * Función auxiliar para buscar la descripción en un catálogo por su clave.
 * @param {string} clave - Clave a buscar en el catálogo.
 * @param {Catalogo[]} catalogo - Array del catálogo donde buscar.
 * @returns {string} La descripción encontrada o la clave original si no se encuentra.
 */
export function obtenerDescripcionDeCatalogoVehiculo(clave: string, catalogo: Catalogo[]): string {
  if (!clave || !catalogo || catalogo.length === 0) {
    return clave || '';
  }
  const ELEMENTO = catalogo.find(c => c.clave === clave || c.descripcion === clave);
  return ELEMENTO ? ELEMENTO.descripcion : clave;
}

/**
 * Función que genera la configuración de columnas para la tabla de vehículos del parque vehicular.
 * Requiere los catálogos como parámetros para realizar las traducciones de códigos a descripciones.
 * 
 * @param {Catalogo[]} tipoDeVehiculoCatalogo - Catálogo de tipos de vehículo.
 * @param {Catalogo[]} paisEmisorCatalogo - Catálogo de países emisores.
 * @param {Catalogo[]} anoCatalogo - Catálogo de años.
 * @returns {ConfiguracionColumna<VehiculoTabla>[]} Configuración de columnas para la tabla.
 */
export function obtenerColumnasVehiculo(
  tipoDeVehiculoCatalogo: Catalogo[],
  paisEmisorCatalogo: Catalogo[],
  anoCatalogo: Catalogo[]
): ConfiguracionColumna<DatosVehiculo>[] {
  return [
    {
      encabezado: 'ID',
      clave: (item: DatosVehiculo): string => item.idDeVehiculo ? String(item.idDeVehiculo) : '',
      orden: 0,
    },
    {
      encabezado: 'Número de identificación vehícular',
      clave: (item: DatosVehiculo): string => item.numero || '',
      orden: 1,
    },
    {
      encabezado: 'Tipo de vehículo',
      clave: (item: DatosVehiculo): string => obtenerDescripcionDeCatalogoVehiculo(item.tipoDeVehiculo, tipoDeVehiculoCatalogo),
      orden: 2,
    },
    {
      encabezado: 'Número económico',
      clave: (item: DatosVehiculo): string => item.numeroEconomico || '',
      orden: 3,
    },
    {
      encabezado: 'Transponder',
      clave: (item: DatosVehiculo): string => item.transponder || '',
      orden: 4,
    },
    {
      encabezado: 'Número de placas',
      clave: (item: DatosVehiculo): string => item.numeroPlaca || '',
      orden: 5,
    },
    {
      encabezado: 'País emisor',
      clave: (item: DatosVehiculo): string => obtenerDescripcionDeCatalogoVehiculo(item.paisEmisor, paisEmisorCatalogo),
      orden: 6,
    },
    {
      encabezado: 'Estado o provincia',
      clave: (item: DatosVehiculo): string => item.estado || '',
      orden: 7,
    },
    {
      encabezado: 'Marca',
      clave: (item: DatosVehiculo): string => item.marca || '',
      orden: 8,
    },
    {
      encabezado: 'Modelo',
      clave: (item: DatosVehiculo): string => item.modelo || '',
      orden: 9,
    },
    {
      encabezado: 'Año',
      clave: (item: DatosVehiculo): string => obtenerDescripcionDeCatalogoVehiculo(item.ano, anoCatalogo),
      orden: 10,
    }
  ];
}
