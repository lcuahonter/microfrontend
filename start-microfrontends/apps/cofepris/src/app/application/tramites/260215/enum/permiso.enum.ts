export const CROSLISTA_DE_PAISES: string[] = [
  'AFGANISTÁN (EMIRATO ISLÁMICO)',
  'ALBANIA (REPÚBLICA DE)',
  'ALEMANIA (REPÚBLICA FEDERAL DE)',
  'ANDORRA (PRINCIPADO DE)',
  'ANGOLA (REPÚBLICA DE)',
  'ANGUILLA',
  'ANTIGUA Y BARBUDA',
  'ARABIA SAUDITA (COMUNIDAD ECONÓMICA EUROPEA)',
  'ARGELIA (REPÚBLICA DEMOCRÁTICA Y POPULAR DE)',
  'ARGENTINA (REPÚBLICA)',
  'AUSTRALIA (COMMONWEALTH OF)',
  'AUSTRIA (REPUBLIC OF)',
  'BAHAMAS (COMMONWEALTH OF THE)',
  'BAHRAIN (KINGDOM OF)',
  "BANGLADESH (PEOPLE'S REPUBLIC OF)",
  'BARbados',
  'BELGIUM (KINGDOM OF)',
  'BELIZE',
  'BENIN (REPUBLIC OF)',
  'BHUTAN (KINGDOM OF)',
];

export const CONTINUAR: string = 't';
export const MENSAJE_DE_ALERTA: string =
  'Cumplo con los requisitos y normatividad aplicable, sin que me eximan de que la autoridad sanitaria verifique su cumplimiento, esto sin perjuicio de las sanciones en que puedo incurrir por falsedad de declaraciones dadas a una autoridad. Asimismo acepto que la notificación de este trámite, sea a través de la Ventanilla Única de Comercio Exterior por los mecanismos de la misma.';

export const INPUT_FECHA_CONFIG = {
  labelNombre: 'Fecha de pago:',
  required: false,
  habilitado: true,
};

export const INPUT_FECHA_CADUCIDAD_CONFIG = {
  labelNombre: 'Fecha de caducidad',
  required: false,
  habilitado: true,
};

/**
 * Opciones para el selector de códigos postales.
 * Cada objeto contiene un ID y una descripción del código postal.
 */
export const CODIGOPOSTALSELECTDATA = [
  { id: 1, descripcion: '42377' },
  { id: 2, descripcion: '42378' },
  { id: 3, descripcion: '42379' },
];

/**
 * Opciones para el selector de colonias.
 * Cada objeto contiene un ID y una descripción de la colonia.
 */
export const COLONIASELECTDATA = [
  { id: 1, descripcion: 'CENTRO' },
  { id: 2, descripcion: 'CERRO COLORADO' },
  { id: 3, descripcion: 'EL BONDHO' },
];

/**
 * Opciones para el selector de localidades.
 * Cada objeto contiene un ID y una descripción de la localidad.
 */
export const LOCALIDADSELECTDATA = [
  { id: 1, descripcion: 'AGUA NUEVA' },
  { id: 2, descripcion: 'AGUACATLAN' },
  { id: 3, descripcion: 'BAXCAJAY' },
];

/**
 * Opciones para el selector de municipios.
 * Cada objeto contiene un ID y una descripción del municipio.
 */
export const MUNICIPIOSELECTDATA = [
  { id: 1, descripcion: 'ACATLAN' },
  { id: 2, descripcion: 'ACAXOCHITLAN' },
  { id: 3, descripcion: 'ACTOPAN' },
];

/**
 * Opciones para el selector de países.
 * Cada objeto contiene un ID y una descripción del país.
 */
export const PAISSELECTDATA = [
  { id: 1, descripcion: 'MEXICO (ESTADOS UNIDOS MEXICANO)' },
  { id: 2, descripcion: 'MUESTRA2' },
  { id: 3, descripcion: 'MUESTRA3' },
];

/**
 * Encabezados para la tabla de terceros relacionados.
 * Cada cadena representa una columna en la tabla.
 */
export const TERCEROS_RELACIONADOS_TABLE_HEADER_DATA = [
  'Nombre/denominación o razón social',
  'R.F.C',
  'CURP',
  'Teléfono',
  'Correo electrónico',
  'Calle',
  'Número exterior',
  'Número interior',
  'País',
  'Colonia',
  'Municipio o alcaldía',
  'Localidad',
  'Entidad federativa',
  'Estado/localidad',
  'Código postal',
  'Colonia o equivalente',
];
export const TERCEROS_RELACIONADOS_TABLE_BODY_DATA = {
  tbodyData: [
    "FEREZ", "RFC2113", "DUMYD", "12-42322445", "5234", "Avenida Insurgentes", "DUMYD", "23", "1", "DUMYD", "DUMYD", "DUMYD", "DUMYD", "BAJA CALIFORNIA", "DUMYD", "DUMYD"
  ]
};

