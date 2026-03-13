import { PlantasSubfabricante } from '../models/empresas-subfabricanta.model';

export const SUBFABRICANTE_DISPONIBLES_PLANTAS_TABLA_CONFIGURACION = [
  {
    encabezado: 'Calle',
    clave: (ele: PlantasSubfabricante): string => ele.calle,
    orden: 1,
  },
  {
    encabezado: 'Num.exterior',
    clave: (ele: PlantasSubfabricante): number => ele.numExterior,
    orden: 2,
  },
  {
    encabezado: 'Num.interior',
    clave: (ele: PlantasSubfabricante): number => ele.numInterior,
    orden: 3,
  },
  {
    encabezado: 'Código postal', // Título de la columna
    clave: (ele: PlantasSubfabricante): number => ele.codigoPostal, // Función que devuelve el valor de la columna para cada fila
    orden: 4,
  },
  {
    encabezado: 'Colonia', // Título de la columna
    clave: (ele: PlantasSubfabricante): string => ele.colonia, // Función que devuelve el valor de la columna para cada fila
    orden: 5, // Orden de la columna en la tabla
  },
  {
    encabezado: 'Delegación / Municipio',
    clave: (ele: PlantasSubfabricante): string => ele.municipio,
    orden: 6,
  },
  {
    encabezado: 'Entidad Federativa',
    clave: (ele: PlantasSubfabricante): string => ele.entidadFederativa,
    orden: 7,
  },
  {
    encabezado: 'País',
    clave: (ele: PlantasSubfabricante): string => ele.pais, // Placeholder, no action defined
    orden: 8,
  },
  {
    encabezado: 'Registro federal de contribuyentes',
    clave: (ele: PlantasSubfabricante): string => ele.rfc,
    orden: 9,
  },

  {
    encabezado: 'Domicilio fiscal del solicitante',
    clave: (ele: PlantasSubfabricante): string => ele.domicilioFiscal,
    orden: 10,
  },
  {
    encabezado: 'Razón social',
    clave: (ele: PlantasSubfabricante): string => ele.razonSocial,
    orden: 11,
  },
];

export const SUBFABRICANTE_SELECCIONADAS_PLANTAS_TABLA_CONFIGURACION = [
  {
    encabezado: 'Calle',
    clave: (ele: PlantasSubfabricante): string => ele.calle,
    orden: 1,
  },
  {
    encabezado: 'Num.exterior',
    clave: (ele: PlantasSubfabricante): number => ele.numExterior,
    orden: 2,
  },
  {
    encabezado: 'Num.interior',
    clave: (ele: PlantasSubfabricante): number => ele.numInterior,
    orden: 3,
  },
  {
    encabezado: 'Código postal', // Título de la columna
    clave: (ele: PlantasSubfabricante): number => ele.codigoPostal, // Función que devuelve el valor de la columna para cada fila
    orden: 4,
  },
  {
    encabezado: 'Localidad', // Título de la columna
    clave: (ele: PlantasSubfabricante): string => ele.colonia, // Función que devuelve el valor de la columna para cada fila
    orden: 5, // Orden de la columna en la tabla
  },
  {
    encabezado: 'Delegación / Municipio',
    clave: (ele: PlantasSubfabricante): string => ele.municipio,
    orden: 6,
  },
  {
    encabezado: 'Entidad Federativa',
    clave: (ele: PlantasSubfabricante): string => ele.entidadFederativa,
    orden: 7,
  },
  {
    encabezado: 'País',
    clave: (ele: PlantasSubfabricante): string => ele.pais, // Placeholder, no action defined
    orden: 8,
  },
  {
    encabezado: 'Registro federal de contribuyentes',
    clave: (ele: PlantasSubfabricante): string => ele.rfc,
    orden: 9,
  },

  {
    encabezado: 'Domicilio fiscal del solicitante',
    clave: (ele: PlantasSubfabricante): string => ele.domicilioFiscal,
    orden: 10,
  },
  {
    encabezado: 'Razón social',
    clave: (ele: PlantasSubfabricante): string => ele.razonSocial,
    orden: 11,
  },
];
