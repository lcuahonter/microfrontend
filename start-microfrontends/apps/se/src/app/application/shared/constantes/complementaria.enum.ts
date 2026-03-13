import { Complimentaria, Mercancias, Plantas, PlantasTabla, ProductorIndirecto, SectorTabla, ServiciosImmex } from '../models/complementaria.model';
import { ConfiguracionColumna } from '@ng-mf/data-access-user';

/**
 * Configuración de la tabla de Plantas.
 * @type {ConfiguracionColumna<PlantasTabla>[]}
 */
export const PLANTAS: ConfiguracionColumna<PlantasTabla>[] = [
    { encabezado: 'Calle', clave: (item: PlantasTabla) => item.calle, orden: 1 },
    { encabezado: 'Número exterior', clave: (item: PlantasTabla) => item.numeroExterior, orden: 2 },
    { encabezado: 'Número interior', clave: (item: PlantasTabla) => item.numeroInterior, orden: 3 },
    { encabezado: 'Código postal', clave: (item: PlantasTabla) => item.codigoPostal, orden: 4 },
    { encabezado: 'Colonia', clave: (item: PlantasTabla) => item.colonia, orden: 5 },
    { encabezado: 'Municipio o alcaldía', clave: (item: PlantasTabla) => item.municipioOAlcaldia, orden: 6 },
    { encabezado: 'Estado', clave: (item: PlantasTabla) => item.estado, orden: 7 },
    { encabezado: 'País', clave: (item: PlantasTabla) => item.pais, orden: 8 },
    { encabezado: 'Registro federal de contribuyentes', clave: (item: PlantasTabla) => item.registroFederal, orden: 9 },
    { encabezado: 'Razón social', clave: (item: PlantasTabla) => item.razonSocial, orden: 10 },
    { encabezado: 'Domicilio fiscal del solicitante', clave: (item: PlantasTabla) => item.domicilioFiscal, orden: 11 },
    { encabezado: 'Estatus', clave: (item: PlantasTabla) => item.estatus, orden: 12 },
];

/**
 * Configuración de la tabla de sectores.
 * @type {ConfiguracionColumna<SectorTabla>[]}
 */
export const SECTOR: ConfiguracionColumna<SectorTabla>[] = [
    { encabezado: 'Lista de sectores', clave: (item: SectorTabla) => item.listaDeSectores, orden: 1 },
    { encabezado: 'Clave del sector', clave: (item: SectorTabla) => item.claveDelSector, orden: 2 },
    { encabezado: 'Estatus', clave: (item: SectorTabla) => item.estatus, orden: 3 }
];

/**
 * Configuración de la tabla de mercancías.
 * @type {ConfiguracionColumna<Mercancias>[]}
 */
export const TABLA_PRODUCIR_MERCANCIAS: ConfiguracionColumna<Mercancias>[] = [
    {
        encabezado: 'Fracción arancelaria',
        clave: (item: Mercancias) => item.fraccionArancelaria.cveFraccion,
        orden: 1,
    },
    {
        encabezado: 'Clave del sector',
        clave: (item: Mercancias) => item.cveSector,
        orden: 2,
    },
    {
        encabezado: 'Estatus',
        clave: (item: Mercancias) => item.descripcionTestado,
        orden: 3,
    }
];

/**
 * Configuración de la tabla de productores indirectos.
 * @type {ConfiguracionColumna<ProductorIndirecto>[]}
 */
export const TABLA_PRODUCTOR_INDIRECTO: ConfiguracionColumna<ProductorIndirecto>[] = [
    {
        encabezado: 'Registro federal de contribuyentes',
        clave: (item: ProductorIndirecto) => item.registroFederal,
        orden: 1
    },
    {
        encabezado: 'Denominación o razón social',
        clave: (item: ProductorIndirecto) => item.denominacion,
        orden: 2
    },
    {
        encabezado: 'Correo',
        clave: (item: ProductorIndirecto) => item.correo,
        orden: 3
    },
    {
        encabezado: 'Estatus',
        clave: (item: ProductorIndirecto) => item.eStatus,
        orden: 4
    }
];

/**
 * Configuración de los accionistas utilizada para definir las propiedades
 * y el orden de las columnas en una tabla o lista.
 */
export const CONFIGURACION_SOCIOS: ConfiguracionColumna<unknown>[] = [
  {
    encabezado: 'Registro Federal de Contribuyentes',
    clave: (ele: unknown): string | undefined => (ele as Complimentaria).rfc,
    orden: 1,
  },
  {
    encabezado: 'Nombre(s)',
    clave: (ele: unknown): string | undefined => (ele as Complimentaria).nombre,
    orden: 2,
  },
  {
    encabezado: 'Primer apellido',
    clave: (ele: unknown): string | undefined => (ele as Complimentaria).apellidoPaterno,
    orden: 3,
  },
  {
    encabezado: 'Segundo apellido',
    clave: (ele: unknown): string | undefined => (ele as Complimentaria).apellidoMaterno,
    orden: 4,
  },
];

/**
 * CONFIGURACION_PLANTAS - Configuración de columnas para la tabla de plantas
 * Muestra información sobre las plantas relacionadas con el trámite,
 * incluyendo dirección, RFC, razón social y estatus
 */
export const CONFIGURACION_PLANTAS = [
  {
    encabezado: 'Calle',
    clave: (ele: unknown) : string | undefined => (ele as Plantas).calle,
    orden: 1,
  },
  {
    encabezado: 'Número Exterior',
    clave: (ele: unknown) : string | undefined => (ele as Plantas).numeroExterior,
    orden: 2,
  },
  {
    encabezado: 'Número Interior',
    clave: (ele: unknown) : string | undefined => (ele as Plantas).numeroInterior,
    orden: 3,
  },
  {
    encabezado: 'Código Postal',
    clave: (ele: unknown) : string | undefined => (ele as Plantas).codigoPostal,
    orden: 4,
  },
  {
    encabezado: 'Colonia',
    clave: (ele: unknown) : string | undefined => (ele as Plantas).colonia,
    orden: 5,
  },
  {
    encabezado: 'Municipio o delegación',
    clave: (ele: unknown) : string | undefined => (ele as Plantas).municipioDelegacion,
    orden: 6,
  },
  {
    encabezado: 'Entidad Federativa',
    clave: (ele: unknown) : string | undefined => (ele as Plantas).estado,
    orden: 7,
  },
  {
    encabezado: 'País',
    clave: (ele: unknown) : string | undefined => (ele as Plantas).pais,
    orden: 8,
  },
  {
    encabezado: 'Registro Federal de Contribuyentes',
    clave: (ele: unknown) : string | undefined => (ele as Plantas).rfc,
    orden: 9,
  },
  {
    encabezado: 'Domicilio fiscal del solicitante',
    clave: (ele: unknown) : string | undefined => (ele as Plantas).fiscalSolicitante,
    orden: 10,
  },
  {
    encabezado: 'Estatus',
    clave: (ele: unknown) : string | undefined => ((ele as Plantas).desEstatus),
    orden: 11,
  },
];

/**
 * CONFIGURACION_SERVICIOS - Configuración de columnas para la tabla de servicios
 * Muestra información sobre los servicios relacionados con el trámite,
 * incluyendo descripción, tipo, estatus y si está testado
 */
export const CONFIGURACION_SERVICIOS_IMMEX = [
    {
      encabezado: 'Estatus',
      clave: (ele: ServiciosImmex):string | undefined => ele.desEstatus,
      orden: 4,
    },
    {
      encabezado: 'Testado',
      clave: (ele: ServiciosImmex):string | undefined => ele.descripcionTestado,
      orden: 3,
    },
    {
      encabezado: 'Descripción del servicio',
      clave: (ele: ServiciosImmex):string | undefined => ele.descripcion,
      orden: 1,
    },
    {
      encabezado: 'Tipo de servicio',
      clave: (ele: ServiciosImmex):string | undefined => ele.descripcionTipo,
      orden: 2,
    }
];