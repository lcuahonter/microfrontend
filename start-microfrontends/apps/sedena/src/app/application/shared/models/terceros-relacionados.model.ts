import { ConfiguracionColumna, TipoPersona } from '@ng-mf/data-access-user';
/**
 * Interfaz que representa los datos de un destinatario final.
 *
 * @property {string} nombreRazonSocial - Nombre o razón social del destinatario.
 * @property {string} rfc - Registro Federal de Contribuyentes.
 * @property {string} curp - Clave Única de Registro de Población.
 * @property {string} telefono - Número telefónico de contacto.
 * @property {string} correoElectronico - Correo electrónico del destinatario.
 * @property {string} calle - Calle del domicilio.
 * @property {string} numeroExterior - Número exterior del domicilio.
 * @property {string} numeroInterior - Número interior del domicilio.
 * @property {string} pais - País de residencia.
 * @property {string} colonia - Colonia del domicilio.
 * @property {string} municipioAlcaldia - Municipio o alcaldía correspondiente.
 * @property {string} localidad - Localidad del domicilio.
 * @property {string} entidadFederativa - Estado o entidad federativa.
 * @property {string} estadoLocalidad - Estado o localidad detallada.
 * @property {string} codigoPostal - Código postal.
 */
export interface DestinoFinal {
  nombreRazonSocial: string;
  rfc: string;
  curp: string;
  telefono: string;
  correoElectronico: string;
  calle: string;
  numeroExterior: string;
  numeroInterior: string;
  cve_pais: string;
  pais: string;
  cve_colonia: string;
  colonia: string;
  cve_municipio: string;
  municipioAlcaldia: string;
  cve_localidad: string;
  localidad: string;
  entidadFederativa: string;
  estadoLocalidad: string;
  codigoPostal: string;
  tipoPersona?: string;
  denominacionRazon?: string;
  nombres?: string;
  primerApellido?: string;
  segundoApellido?: string;
  cve_estado?: string;
  estado?: string;
  tableindex?: number;
  nacionalidad?: string;
  id?: number;
  lada?: string;  
}

/**
 * Constante que define la configuración de columnas para la tabla de destinatarios finales.
 *
 * @const
 * @type {ConfiguracionColumna<DestinoFinal>[]}
 */
export const DESTINO_FINAL_ENCABEZADO_DE_TABLA: ConfiguracionColumna<DestinoFinal>[] =
  [
    {
      encabezado: 'Nombre/denominación o razón social',
      clave: (fila) => fila.nombreRazonSocial,
      orden: 1,
    },
    { encabezado: 'R.F.C.', clave: (fila) => fila.rfc, orden: 2 },
    { encabezado: 'CURP', clave: (fila) => fila.curp, orden: 3 },
    { encabezado: 'Teléfono', clave: (fila) => fila.telefono, orden: 4 },
    {
      encabezado: 'Correo electrónico',
      clave: (fila) => fila.correoElectronico,
      orden: 5,
    },
    { encabezado: 'Calle', clave: (fila) => fila.calle, orden: 6 },
    {
      encabezado: 'Número exterior',
      clave: (fila) => fila.numeroExterior,
      orden: 7,
    },
    {
      encabezado: 'Número interior',
      clave: (fila) => fila.numeroInterior,
      orden: 8,
    },
    { encabezado: 'País', clave: (fila) => fila.pais, orden: 9 },
    { encabezado: 'Colonia', clave: (fila) => fila.colonia, orden: 10 },
    {
      encabezado: 'Municipio o alcaldía',
      clave: (fila) => fila.municipioAlcaldia,
      orden: 11,
    },
    { encabezado: 'Localidad', clave: (fila) => fila.localidad, orden: 12 },
    {
      encabezado: 'Entidad federativa',
      clave: (fila) => fila.entidadFederativa,
      orden: 13,
    },
    {
      encabezado: 'Estado/localidad',
      clave: (fila) => fila.estadoLocalidad,
      orden: 14,
    },
    {
      encabezado: 'Código postal',
      clave: (fila) => fila.codigoPostal,
      orden: 15,
    },
  ];

/**
 * Interfaz que representa los datos de un proveedor.
 *
 * @property {string} nombreRazonSocial - Nombre o razón social del proveedor.
 * @property {string} rfc - Registro Federal de Contribuyentes.
 * @property {string} curp - Clave Única de Registro de Población.
 * @property {string} telefono - Número telefónico de contacto.
 * @property {string} correoElectronico - Correo electrónico del proveedor.
 * @property {string} calle - Calle del domicilio.
 * @property {string} numeroExterior - Número exterior del domicilio.
 * @property {string} numeroInterior - Número interior del domicilio.
 * @property {string} pais - País de residencia.
 * @property {string} colonia - Colonia del domicilio.
 * @property {string} municipioAlcaldia - Municipio o alcaldía correspondiente.
 * @property {string} localidad - Localidad del domicilio.
 * @property {string} entidadFederativa - Estado o entidad federativa.
 * @property {string} estadoLocalidad - Estado o localidad detallada.
 * @property {string} codigoPostal - Código postal.
 */
export interface Proveedor {
  nombreRazonSocial: string;
  rfc: string;
  curp: string;
  telefono: string;
  correoElectronico: string;
  calle: string;
  numeroExterior: string;
  numeroInterior: string;
  cve_pais: string;
  pais: string;
  colonia: string;
  municipioAlcaldia: string;
  localidad: string;
  entidadFederativa: string;
  estadoLocalidad: string;
  codigoPostal: string;
  tableIndex?: number;
  tipoPersona?: TipoPersona;
  nombres?: string;
  primerApellido?: string;
  segundoApellido?: string;
  estado?: string;
  id?: number;
  nacionalidad?: string;
  lada?: string;
  denominacionRazon?: string;
}

/**
 * Constante que define la configuración de columnas para la tabla de proveedores.
 *
 * @const
 * @type {ConfiguracionColumna<Proveedor>[]}
 */
export const PROVEEDOR_ENCABEZADO_DE_TABLA: ConfiguracionColumna<Proveedor>[] =
  [
    {
      encabezado: 'Nombre/denominación o razón social',
      clave: (fila) => fila.nombreRazonSocial,
      orden: 1,
    },
    { encabezado: 'R.F.C.', clave: (fila) => fila.rfc, orden: 2 },
    { encabezado: 'CURP', clave: (fila) => fila.curp, orden: 3 },
    { encabezado: 'Teléfono', clave: (fila) => fila.telefono, orden: 4 },
    {
      encabezado: 'Correo electrónico',
      clave: (fila) => fila.correoElectronico,
      orden: 5,
    },
    { encabezado: 'Calle', clave: (fila) => fila.calle, orden: 6 },
    {
      encabezado: 'Número exterior',
      clave: (fila) => fila.numeroExterior,
      orden: 7,
    },
    {
      encabezado: 'Número interior',
      clave: (fila) => fila.numeroInterior,
      orden: 8,
    },
    { encabezado: 'País', clave: (fila) => fila.pais, orden: 9 },
    { encabezado: 'Colonia', clave: (fila) => fila.colonia, orden: 10 },
    {
      encabezado: 'Municipio o alcaldía',
      clave: (fila) => fila.municipioAlcaldia,
      orden: 11,
    },
    { encabezado: 'Localidad', clave: (fila) => fila.localidad, orden: 12 },
    {
      encabezado: 'Entidad federativa',
      clave: (fila) => fila.entidadFederativa,
      orden: 13,
    },
    {
      encabezado: 'Estado/localidad',
      clave: (fila) => fila.estadoLocalidad,
      orden: 14,
    },
    {
      encabezado: 'Código postal',
      clave: (fila) => fila.codigoPostal,
      orden: 15,
    },
  ];

/**
 * Texto de alerta mostrado cuando las tablas obligatorias no tienen registros.
 *
 * @const
 * @type {string}
 */
export const TERCEROR_TEXTO_DE_ALERTA =
  'Las tablas con asterisco son obligatorias y debes agregar por lo menos un registro.';
