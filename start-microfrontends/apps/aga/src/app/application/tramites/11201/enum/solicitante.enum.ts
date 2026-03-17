import { ConfiguracionColumna } from '@libs/shared/data-access-user/src';
import { DatosDelContenedor } from '@libs/shared/data-access-user/src/core/models/11201/datos-tramite.model';

/**
 * Configuración de columnas para la tabla de contenedores.
 * 
 * Define las columnas que se mostrarán en la tabla de contenedores, incluyendo
 * encabezados, claves de acceso a los datos y orden de visualización.
 * 
 * @type {ConfiguracionColumna<DatosDelContenedor>[]}
 */
export const ENCABEZADO_TABLA_CONTENEDOR: ConfiguracionColumna<DatosDelContenedor>[] = [
  { encabezado: '', clave: (articulo) => articulo.id, orden: 1 },
  { encabezado: 'Iniciales del equipo', clave: (articulo) => articulo.iniciales_contenedor, orden: 1 },
  { encabezado: 'Número de equipo', clave: (articulo) => articulo.numero_contenedor, orden: 2 },
  { encabezado: 'Dígito Verificador', clave: (articulo) => articulo.digito_verificador, orden: 3 },
  { encabezado: 'Tipo de equipo', clave: (articulo) => articulo.tipo_contenedor, orden: 4 },
  { encabezado: 'Aduana', clave: (articulo) => articulo.aduana, orden: 5 },
  { encabezado: 'Fecha Ingreso', clave: (articulo) => articulo.fecha_inicio, orden: 6 },
  { encabezado: 'Vigencia', clave: (articulo) => articulo.vigencia, orden: 7 },
  { encabezado: 'Estado de constancia', clave: (articulo) => articulo.puede_registrar, orden: 8 },
  { encabezado: 'Existe en VUCEM', clave: (articulo) => articulo.existe_en_vucem, orden: 9 }
];

/**
 * Configuración de columnas para la tabla de contenedores de manifiestos.
 * 
 * Define las columnas específicas que se mostrarán en la tabla de contenedores
 * relacionados con manifiestos, incluyendo encabezados, claves de acceso y orden.
 * 
 * @type {ConfiguracionColumna<DatosDelContenedor>[]}
 */
export const ENCABEZADO_TABLA_CONTENEDOR_MANIFIESTO: ConfiguracionColumna<DatosDelContenedor>[] = [
  { encabezado: 'Iniciales del equipo', clave: (articulo) => articulo.iniciales_contenedor, orden: 1 },
  { encabezado: 'Número de equipo', clave: (articulo) => articulo.numero_contenedor, orden: 2 },
  { encabezado: 'Dígito Verificador', clave: (articulo) => articulo.digito_verificador, orden: 3 },
  { encabezado: 'Tipo de equipo', clave: (articulo) => articulo.tipo_contenedor, orden: 4 },
  { encabezado: 'Aduana', clave: (articulo) => articulo.aduana, orden: 5 },
  { encabezado: 'Fecha Ingreso', clave: (articulo) => articulo.fecha_inicio, orden: 6 },
  { encabezado: 'Vigencia', clave: (articulo) => articulo.vigencia, orden: 7 },
  { encabezado: 'Estado de constancia', clave: (articulo) => articulo.puede_registrar, orden: 8 },
  { encabezado: 'Existe en VUCEM', clave: (articulo) => articulo.existe_en_vucem, orden: 9 },
];

/**
 * Mapeo de encabezados de columnas a nombres de propiedades de los datos.
 * 
 * Este objeto define la correspondencia entre los nombres de las columnas mostradas
 * en la interfaz de usuario y las propiedades reales de los objetos de datos.
 * 
 * @type {{ [key: string]: string }}
 */
export const HEADER_MAP_DATOS: { [key: string]: string } = {
      Id: 'id',
      'Aduana': 'aduana',
      'Iniciales del equipo': 'inicialesEquipo',
      'Tipo de equipo': 'tipoEquipo',
      'Número de equipo': 'numeroEquipo',
      'Dígito Verificador': 'digitoVerificador',
      'Fecha Ingreso': 'fechaIngreso',
      'Vigencia': 'vigencia',
      'Estado de constancia': 'estadoConstancia',
      'Existe en VUCEM': 'existeEnVUCEM',
      'Id constancia': 'idConstancia',
      'Número manifiesto': 'numeroManifiesto',
      'Id solicitud': 'idSolicitud',
      'Fecha inicio': 'fechaInicio',
    };

  /**
   * Specifies the available search types for solicitantes (requesters) within the tramites flow.
   *
   * - Contenedor: Perform a search by container identifier.
   * - ArchivoCsv: Perform a search using an uploaded CSV file.
   * - NoManifiesto: Perform a search by manifest number.
   *
   * Use this enum to indicate which search mode the UI or service should execute.
   */
  export enum SearchType {
    Contenedor = 'Contenedor',
    ArchivoCsv = 'Archivo CSV',
    NoManifiesto = 'No. de Manifiesto'
  }   

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const MSG_REGISTRO_EXITOSO = (numeroSolicitud: string) =>
  `<p style="text-align: center;">
    La solicitud ha quedado registrada con el número temporal ${numeroSolicitud ?? ''}. 
    Este no tiene válidez legal y sirve solamente para efectos de identificar tu solicitud. 
    Un folio oficial le será asignado al momento en que ésta sea firmada.
  </p>`;

