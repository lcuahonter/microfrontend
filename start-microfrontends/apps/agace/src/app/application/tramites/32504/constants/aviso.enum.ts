import {
  DatosDomicilioLugar,
  DatosMercanciaSubmanufactura,
} from '../models/aviso.model';
import { ListaPasosWizard } from '@libs/shared/data-access-user/src';

/**
 * Identificador numérico del trámite asociado a este conjunto de constantes.
 * Se utiliza para enrutar y distinguir la configuración de este trámite.
 */
export const TRAMITE_ID = 32504;

/**
 * @constant
 * @name TIPO_MANUAL
 * @description Tipo de carga manual para el trámite 32504.
 * @type {string}
 */
export const TIPO_MANUAL = 'TIPCAR.MA';

/**
 * @constant
 * @name PLANTILLA_NOMBRE_ARCHIVO
 * @description Nombre del archivo de plantilla para el trámite 32504.
 * @type {string}
 */
export const PLANTILLA_NOMBRE_ARCHIVO = 'Plantilla_AvisoRegla437.xls';

/**
 * @constant
 * @name TEXTOS
 * @description Textos de ayuda e instrucciones para la carga de archivos y requisitos.
 * @type {Object}
 */
export const TEXTOS = {
  INSTRUCCIONES: `
    <p> El archivo no debe exceder los 1000 registros. Para descargar plantilla del archivo de excel de click* </br> <strong><a>Descargar plantilla</a></strong> </p>`,
  CARGA_DE_ARCHIVOS: `Seleccionar archivo`,
  CARGA_DE_ARCHIVO_DE_TEXTO: ` Sin archivos seleccionados`,
  CARGA_DE_ARCHIVO_DE_TEXTO_EXITOSO: `El formato del archivo es correcto. Se enviará un correo de notificación con el resultado.`,
};

/**
 * @constant
 * @name TEXTO_REQUISITOS
 * @description Textos para los requisitos obligatorios y opcionales.
 * @type {Object}
 */
export const TEXTO_REQUISITOS = {
  REQUISITOS_OBLIGATORIOS: 'Requisitos obligatorios',
  REQUISITOS_OPCIONALES: 'Requisitos opcionales',
  REQUISITOS_OPCIONALES_INSTRUCCIONES: `<h6>Instrucciones</h6>
  <p>- De acuerdo al caso particular, algunos documentos podrían ser obligatorios</p>
  <p>- En caso de que no requieras algún documento, seleccionalo y elíminalo</p>
  <p>- Si necesitas anexar más de un documento del mismo tipo selecciónalo de la lista y presiona "Agregar nuevo".</p>`,
};

/**
 * @constant
 * @name TEXTO_ANEXAR_REQUISITOS
 * @description Textos para la sección de anexar documentos y requisitos.
 * @type {Object}
 */
export const TEXTO_ANEXAR_REQUISITOS = {
  INIT_DOCUMENTO: `
    <p>- Si deseas adjuntar un nuevo documento, selecciona la opción --Adjuntar nuevo documento--y persiona el botón "Adjuntar documentos"</p>`,
  ADJUNTAR_DOCUMENTO: 'Adjuntar documentos',
  ADJUNTAR_DOCUMENTO_INSTRUCCIONES: `
  <p>Para poder adjuntar tu documento, deberá cumplir las siguientes características</p>
  <ul>Debe ser formato PDF que no contega formularios, objetos OLE incrustrados, Codígo java script, etc.</ul>
  <ul>No debe contener páginas en blanco</ul>
  `,
};

/**
 * @constant
 * @name PASOS
 * @description Pasos del asistente (wizard) para el flujo del trámite.
 */
export const PASOS: ListaPasosWizard[] = [
  {
    indice: 1,
    titulo: 'Capturar solicitud',
    activo: true,
    completado: true,
  },
  {
    indice: 2,
    titulo: 'Anexar requisitos',
    activo: false,
    completado: false,
  },
  {
    indice: 3,
    titulo: 'Firmar solicitud',
    activo: false,
    completado: false,
  },
];

/**
 * Pasos del asistente (wizard) para el flujo del trámite.
 * Cada entrada describe índice, título y estados del paso.
 */

/**
 * Columnas configuradas para la tabla que muestra información de materia prima.
 */
export const MERCANCIA_TRASFERIDA = [
  {
    encabezado: 'Fracción arancelaria',
    clave: (ele: DatosMercanciaSubmanufactura): string => ele.descFraccion,
    orden: 1,
  },
  {
    encabezado: 'NICO',
    clave: (ele: DatosMercanciaSubmanufactura): string => ele.nico,
    orden: 2,
  },
  {
    encabezado: 'Unidad de medida',
    clave: (ele: DatosMercanciaSubmanufactura): string => ele.descUnidadMedida,
    orden: 3,
  },
  {
    encabezado: 'Cantidad',
    clave: (ele: DatosMercanciaSubmanufactura): string => ele.cantidad,
    orden: 4,
  },
  {
    encabezado: 'Valor USD',
    clave: (ele: DatosMercanciaSubmanufactura): string => ele.valor_usd,
    orden: 5,
  },
];

/**
 * Columnas configuradas para la tabla que muestra información de domicilios.
 * Cada entrada define el encabezado, clave de acceso y orden de la columna.
 */
export const DOMICILIO_AVISO = [
  {
    encabezado: 'RFC',
    clave: (ele: DatosDomicilioLugar): string => ele.rfc,
    orden: 1,
  },
  {
    encabezado: 'Nombre comercial',
    clave: (ele: DatosDomicilioLugar): string => ele.nombre_comercial,
    orden: 2,
  },
  {
    encabezado: 'Entidad federativa',
    clave: (ele: DatosDomicilioLugar): string =>
      ele.descEntidadFederativa || '',
    orden: 3,
  },
  {
    encabezado: 'Alcaldía o municipio',
    clave: (ele: DatosDomicilioLugar): string =>
      ele.descAlcaldiaMunicipio || '',
    orden: 4,
  },
  {
    encabezado: 'Colonia',
    clave: (ele: DatosDomicilioLugar): string => ele.descColonias || '',
    orden: 5,
  },
];

export const ERROR_DOMICILIOS_ALERT = `
<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">
      Corrija los siguientes errores:
    </div>
     <div class="col-md-12">
      Es necesario registrar información en datos del aviso.
    </div>
  </div>
</div>
`;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const MSG_REGISTRO_EXITOSO = (numeroSolicitud: string) =>
  `<p>La solicitud ha quedado registrada con el número temporal ${
    numeroSolicitud ?? ''
  }. Éste no tiene validez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado a la solicitud al momento en que ésta sea firmada.</p>`;

export const MSG_AVISO_DOCUMENTACION = `Se sugiere verificar todos los datos capturados y documentos adjuntos antes de culminar el trámite, ya que, en caso de existir algún error, no se podrá modificar o eliminar la información posterior a su firma.</p>`;
