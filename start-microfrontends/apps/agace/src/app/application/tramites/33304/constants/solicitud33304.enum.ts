import { TablaEmpresaFusionada } from '../modelos/aviso-de-empresa-fusionadas.model';
import { TablaEmpresaTransportista } from '../modelos/aviso-de-transportistas.model';

/**
 * Enumeración para la solicitud 33304.
 * Contiene las declaraciones bajo protesta de decir verdad.
 */
export enum Solicitud33304Enum {
  /**
   * Manifiesto que indica que la empresa solicitante es la propietaria del activo fijo.
   */
  BAJO_MANIFIESTO = 'Bajo protesta de decir verdad, manifiesto que los datos asentados en el presente documento son ciertos y que las facultades que me fueron otorgadas para representar a la solicitante no me han sido modificadas y/o revocadas.',
}

/**
 * Opciones de radio para el aviso de fusión o escisión.
 * Se utilizan para representar los diferentes escenarios de combinación de empresas
 * bajo el Esquema de Certificación de Empresas.
 */
export const AVISO_DE_FUSION_RADIO_OPCIONES = [
  {
    label: `Aviso de fusión o escisión de dos o más personas morales que se
              encuentren registradas en el Esquema de
              Certificación de Empresas, en cualquiera de sus modalidades y subsista una de ellas`,
    value: '1',
  },
  {
    label: `Aviso de fusión o escisión de empresas que cuenten con el Registro en el
              Esquema de Certificación de
              Empresas, cuando resulte una nueva sociedad o extinguiéndose una o más empresas con Registro.
              Aviso de fusión de una empresa que se encuentre registrada en el Esquema de Certificación de Empresas
              con una o más empresas que no cuenten con el Registro en el Esquema de Certificación de Empresas
              y`,
    value: '0',
  },
  {
    label: 'subsista la que cuenta con dicho Registro',
    value: '2',
  },
];

/**
 * Opciones de radio para seleccionar el tipo de operación.
 * Permite al usuario indicar si se trata de una fusión o una escisión.
 */
export const TIPO_DE_BOTON_DE_RADIO_OPCIONES = [
  {
    label: 'Fusión',
    value: '1',
  },
  {
    label: 'Escisión',
    value: '0',
  },
];

/**
 * Opciones de radio para indicar si la empresa cuenta con el Registro en el Esquema de Certificación.
 */
export const CUENTA_DE_BOTON_DE_RADIO_OPCIONES = [
  {
    label: 'Sí',
    value: '1',
  },
  {
    label: 'No',
    value: '0',
  },
];

/**
 * Constante que representa la configuración por defecto para el campo de fecha de entrada.
 *
 * - `labelNombre`: Etiqueta visible para el campo de fecha.
 * - `required`: Indica si el campo es obligatorio.
 * - `habilitado`: Determina si el campo está habilitado para su edición o interacción.
 */
export const FUSIONE_FECHA_INPUT = {
  labelNombre: '',
  required: false,
  habilitado: true,
};

/**
 * Columnas de la tabla de empresas fusionadas.
 * Cada entrada define un campo visualizable con su encabezado y orden.
 */
export const EMPRESAS_FUSIONE_TABLA_DATOS = [
  /** Columna para mostrar el Registro Federal de Contribuyentes. */
  {
    encabezado: 'Registro Federal de Contribuyentes',
    clave: (item: TablaEmpresaFusionada): string => item.rfc,
    orden: 1,
  },
  /** Columna para mostrar la Denominación o Razón Social. */
  {
    encabezado: 'Denominación o Razón Social',
    clave: (item: TablaEmpresaFusionada): string => item.denominacion,
    orden: 2,
  },
  /** Columna para mostrar el Folio VUCEM de la última certificación/renovación. */
  {
    encabezado: 'Folio VUCEM de la ultima certificación/renovación',
    clave: (item: TablaEmpresaFusionada): string => item.folioVucem,
    orden: 3,
  },
  /** Columna para mostrar la Fecha de inicio de vigencia de la Última certificación/renovación. */
  {
    encabezado:
      'Fecha de inicio de vigencia de la Última certificación/renovació',
    clave: (item: TablaEmpresaFusionada): string => item.fechaInicioVigencia,
    orden: 4,
  },
  /** Columna para mostrar la Fecha de fin de vigencia de la Última certificación/renovación. */
  {
    encabezado:
      'Fecha de fin de vigencia de la Última certificación/renovación',
    clave: (item: TablaEmpresaFusionada): string => item.fechaFinVigencia,
    orden: 5,
  },
];

/**
 * Opciones de radio para indicar si la empresa cuenta con una certificación vigente.
 */
export const REGISTRO_CERTIFICACION_OPCIONES_RADIO_OPCIONES = [
  {
    label: 'Sí',
    value: '1',
  },
  {
    label: 'No',
    value: '0',
  },
];

/**
 * Constante que define la configuración de las columnas para la tabla de empresas transportistas.
 *
 * Cada objeto representa una columna de la tabla:
 * - `encabezado`: Título visible de la columna.
 * - `clave`: Función que extrae el valor correspondiente del objeto TablaEmpresaTransportista.
 * - `orden`: Orden de aparición de la columna en la tabla.
 */
export const EMPRESAS_TRANSPORTISTAS_TABLA_DATOS = [
  /** Columna para mostrar el RFC de la empresa transportista. */
  {
    encabezado: 'RFC',
    clave: (item: TablaEmpresaTransportista): string => item.rfc,
    orden: 1,
  },
  /** Columna para mostrar la Denominación o Razón Social de la empresa transportista. */
  {
    encabezado: 'Denominación o Razón Social',
    clave: (item: TablaEmpresaTransportista): string => item.denominacion,
    orden: 2,
  },
  /** Columna para mostrar el Domicilio de la empresa transportista. */
  {
    encabezado: 'Domicilio',
    clave: (item: TablaEmpresaTransportista): string => item.domicilio,
    orden: 3,
  },
  /** Columna para mostrar el Registro CAAT vigente de la empresa transportista. */
  {
    encabezado: 'Registro CAAT Vigente',
    clave: (item: TablaEmpresaTransportista): string => item.registroCaat,
    orden: 4,
  },
  /** Columna para mostrar el Estatus de la empresa transportista. */
  {
    encabezado: 'Estatus',
    clave: (item: TablaEmpresaTransportista): string => item.estatus,
    orden: 5,
  },
];
