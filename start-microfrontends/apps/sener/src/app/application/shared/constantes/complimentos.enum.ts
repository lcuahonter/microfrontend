import { DatosCatalago } from '../../tramites/80102/models/autorizacion-programa-nuevo.model';
import { SociaoAccionistas } from '../models/complimentos.model';

export const FORMA_SOCIO_ACCIONISTAS: DatosCatalago[] = [
  {
    labelNombre: 'Tax ID',
    campo: 'taxId',
    class: 'col-md-7 col-sm-10 pr-5',
    tipo_input: 'text',
    required: true,
    orden: 1,
  },
  {
    labelNombre: 'Denominación o razón social',
    campo: 'razonSocial',
    class: 'col-md-6 col-sm-10 mt-3',
    tipo_input: 'text',
    required: true,
    orden: 2,
  },
  {
    labelNombre: 'País',
    campo: 'pais',
    class: 'col-md-6 col-10 mt-1',
    tipo_input: 'select-paise',
    required: true,
    opciones: [],
    orden: 3,
  },
  {
    labelNombre: 'Código postal',
    campo: 'codigoPostal',
    class: 'col-md-6 col-10 mt-3',
    tipo_input: 'text',
    required: true,
    orden: 4,
  },
  {
    labelNombre: 'Estado',
    campo: 'estado',
    class: 'col-md-6 col-10  mt-1',
    tipo_input: 'select-catalog',
    required: true,
    opciones: [],
    orden: 5,
  },
  {
    labelNombre: 'Correo electrónico',
    campo: 'correoElectronico',
    class: 'col-md-6 col-10 mt-3',
    tipo_input: 'text',
    required: true,
    orden: 6,
  },
];

export const FORMA_SOCIO_ACCIONISTAS_EXTRANJEROS: DatosCatalago[] = [
  {
    labelNombre: 'Nombre',
    campo: 'nombre',
    class: 'col-md-6 col-sm-10 mt-3',
    tipo_input: 'text',
    required: true,
    orden: 1,
  },
  {
    labelNombre: 'Apellido paterno',
    campo: 'apellidoPaterno',
    class: 'col-md-6 col-sm-10 mt-3',
    tipo_input: 'text',
    required: true,
    orden: 2,
  },
  {
    labelNombre: 'País',
    campo: 'pais',
    class: 'col-md-10 col-10 mt-1',
    tipo_input: 'select-paise',
    required: true,
    opciones: [],
    orden: 3,
  },
  {
    labelNombre: 'Código postal',
    campo: 'codigoPostal',
    class: 'col-md-6 col-10 mt-3',
    tipo_input: 'text',
    required: true,
    orden: 4,
  },
  {
    labelNombre: 'Estado',
    campo: 'estado',
    class: 'col-md-6 col-10 mt-3',
    tipo_input: 'select-catalog ',
    required: true,
    opciones: [],
    orden: 5,
  },
  {
    labelNombre: 'Correo electrónico',
    campo: 'correoElectronico',
    class: 'col-md-6 col-10 mt-3',
    tipo_input: 'text',
    required: true,
    orden: 6,
  },
  {
    labelNombre: 'Tax ID',
    campo: 'taxId',
    class: 'col-md-6 col-sm-10 mt-3',
    tipo_input: 'text',
    required: true,
    orden: 7,
  },
];

export const FORMA_SOCIO: DatosCatalago[] = [
  {
    labelNombre: 'Registro Federal de Contribuyentes',
    campo: 'rfc',
    class: 'col-md-6 col-10 mt-3',
    tipo_input: 'text',
    required: true,
    orden: 1,
  },
];

export enum TIPO_FORMA {
  DEFAULT = 1,
  TIPO_PERSONA = 2,
  NATIONALIDAD_MEXICANA = 3,
}

export const TABLA_SOCIO_ACCIONISTAS = [
  {
    encabezado: 'RFC',
    clave: (ele: SociaoAccionistas): string | undefined => ele.rfc,
    orden: 1,
  },
  {
    encabezado: 'razón social',
    clave: (ele: SociaoAccionistas): string | undefined => ele.razonSocial,
    orden: 2,
  },
  {
    encabezado: 'Nombre',
    clave: (ele: SociaoAccionistas): string | undefined => ele.nombre,
    orden: 3,
  },
  {
    encabezado: 'Apellido paterno',
    clave: (ele: SociaoAccionistas): string | undefined => ele.apellidoPaterno,
    orden: 4,
  },

  {
    encabezado: 'Apellido materno',
    clave: (ele: SociaoAccionistas): string | undefined => ele.apellidoMaterno,
    orden: 5,
  },
  {
    encabezado: 'Correo',
    clave: (ele: SociaoAccionistas): string | undefined => ele.correoElectronico,
    orden: 6,
  },
];

export const TABLA_SOCIO_ACCIONISTAS_EXTRANJEROS = [
  {
    encabezado: 'TAX ID',
    clave: (ele: SociaoAccionistas): string | undefined => ele.taxId,
    orden: 1,
  },
  {
    encabezado: 'razón social',
    clave: (ele: SociaoAccionistas): string | undefined => ele.razonSocial,
    orden: 2,
  },
  {
    encabezado: 'Nombre',
    clave: (ele: SociaoAccionistas): string | undefined => ele.nombre,
    orden: 3,
  },
  {
    encabezado: 'Apellido paterno',
    clave: (ele: SociaoAccionistas): string | undefined => ele.apellidoPaterno,
    orden: 4,
  },

  {
    encabezado: 'País',
    clave: (ele: SociaoAccionistas): string | undefined => ele.pais,
    orden: 5,
  },
  {
    encabezado: 'CP',
    clave: (ele: SociaoAccionistas): string | undefined => ele.cp,
    orden: 6,
  },
  {
    encabezado: 'Estado',
    clave: (ele: SociaoAccionistas): string | undefined => ele.estado,
    orden: 6,
  },
  {
    encabezado: 'Correo',
    clave: (ele: SociaoAccionistas): string | undefined => ele.correoElectronico,
    orden: 7,
  },
];

export const PAIS = 'pais';
export const ESTADO = 'estado';