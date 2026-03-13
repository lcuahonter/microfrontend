import { Catalogo, ConfiguracionColumna } from '@ng-mf/data-access-user';

/**
 * @const MENSAJE_TABLA_OBLIGATORIA
 * @description Mensaje que indica que las tablas marcadas con asterisco son obligatorias
 * y se debe agregar al menos un registro.
 */
export const MENSAJE_TABLA_OBLIGATORIA = `
  <p style="text-align: center;">
    Las tablas con asterisco son obligatorias y debes agregar por lo menos un registro.
  </p>
`;

/**
 * @interface Fabricante
 * @description Representa los datos correspondientes a un fabricante.
 */
export interface Fabricante {
  nacionalidad?: string;
  tipoPersona?: string;
  id?: number;
  nombreRazonSocial: string;
  rfc: string;
  curp: string;
  telefono: string;
  correoElectronico: string;
  calle: string;
  numeroExterior: string;
  numeroInterior: string;
  pais: string;
  paisObj?: Catalogo | undefined;
  colonia: string;
  coloniaObj?: Catalogo | undefined;
  municipioAlcaldia: string;
  municipioAlcaldiaObj?: Catalogo | undefined;
  localidad: string;
  localidadObj?: Catalogo | undefined; 
  entidadFederativa: string;
  entidadFederativaObj?: Catalogo | undefined;
  estadoLocalidad: string;
  codigoPostal: string;
  codigoPostalObj?: Catalogo | undefined;
  coloniaEquivalente: string;
  nombres?: string;
  primerApellido?: string;
  segundoApellido?: string;
  razonSocial?: string;
  lada?: string;
}

/**
 * @const FABRICANTE_ENCABEZADO_DE_TABLA
 * @description Columnas configuradas para mostrar los datos del fabricante en una tabla.
 */
export const FABRICANTE_ENCABEZADO_DE_TABLA: ConfiguracionColumna<Fabricante>[] =
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
 * @interface Destinatario
 * @description Representa los datos correspondientes a un destinatario.
 */
export interface Destinatario {
  nacionalidad?: string;
  tipoPersona?: string;
  id?: number;
  nombreRazonSocial: string;
  rfc: string;
  curp: string;
  telefono: string;
  correoElectronico: string;
  calle: string;
  numeroExterior: string;
  numeroInterior: string;
  pais: string;
  paisObj?: Catalogo | undefined;
  colonia: string;
  coloniaObj?: Catalogo | undefined;
  municipioAlcaldia: string;
  municipioObj?: Catalogo | undefined;
  localidad: string;
  localidadObj?: Catalogo | undefined;
  entidadFederativa: string;
  estadoLocalidad: string;
  estadoObj?: Catalogo | undefined;
  codigoPostal: string;
  codigoPostalObj?: Catalogo | undefined;
  coloniaEquivalente: string;
  nombres?: string;
  primerApellido?: string;
  segundoApellido?: string;
  razonSocial?: string;
  lada?: string;
}

/**
 * @const DESTINATARIO_ENCABEZADO_DE_TABLA
 * @description Columnas configuradas para mostrar los datos del destinatario en una tabla.
 */
export const DESTINATARIO_ENCABEZADO_DE_TABLA: ConfiguracionColumna<Destinatario>[] =
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
    {
      encabezado: 'Colonia o equivalente',
      clave: (fila) => fila.coloniaEquivalente,
      orden: 16,
    },
  ];

/**
 * @interface Proveedor
 * @description Representa los datos correspondientes a un proveedor.
 */
export interface Proveedor {
  nacionalidad?: string;
  tipoPersona?: string;
  id?: number;
  nombreRazonSocial: string;
  rfc: string;
  curp: string;
  telefono: string;
  correoElectronico: string;
  calle: string;
  numeroExterior: string;
  numeroInterior: string;
  pais: string;
  paisObj?: Catalogo | undefined;
  colonia: string;
  municipioAlcaldia: string;
  localidad: string;
  entidadFederativa: string;
  estadoLocalidad: string;
  codigoPostal: string;
  coloniaEquivalente: string;
  nombres?: string;
  primerApellido?: string;
  segundoApellido?: string;
  razonSocial?: string;
  lada?: string;
}

/**
 * @const PROVEEDOR_ENCABEZADO_DE_TABLA
 * @description Columnas configuradas para mostrar los datos del proveedor en una tabla.
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
 * @interface Facturador
 * @description Representa los datos correspondientes a un facturador.
 */
export interface Facturador {
  nacionalidad?: string;
  tipoPersona?: string;
  id?: number;
  nombreRazonSocial: string;
  rfc: string;
  curp: string;
  telefono: string;
  correoElectronico: string;
  calle: string;
  numeroExterior: string;
  numeroInterior: string;
  pais: string;
  paisObj?: Catalogo | undefined;
  colonia: string;
  municipioAlcaldia: string;
  localidad: string;
  entidadFederativa: string;
  estadoLocalidad: string;
  codigoPostal: string;
  coloniaEquivalente: string;
  nombres?: string;
  primerApellido?: string;
  segundoApellido?: string;
  razonSocial?: string;
  lada?: string;
}

/**
 * @const FACTURADOR_ENCABEZADO_DE_TABLA
 * @description Columnas configuradas para mostrar los datos del facturador en una tabla.
 */
export const FACTURADOR_ENCABEZADO_DE_TABLA: ConfiguracionColumna<Facturador>[] =
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
    {
      encabezado: 'Colonia o equivalente',
      clave: (fila) => fila.coloniaEquivalente,
      orden: 16,
    },
  ];

/**
 * @interface PagoDerechosFormState
 * @description Representa el estado del formulario para el pago de derechos.
 */
export interface PagoDerechosFormState {
  claveReferencia: string;
  cadenaDependencia: string;
  estado?: string;
  llavePago: string;
  fechaPago: string;
  importePago: string;
  banco?: string;
  bancoObject?: Catalogo;
  estadoObject?: Catalogo;
}

export interface DomicilioFormState {
  avisoCheckbox: string;
  licenciaSanitaria: string;
  codigoPostal: string;
  estado: Catalogo;
  municipio: string;
  localidad: string;
  colonia: string;
  calleYNumero: string;
  correoElecronico: string;
  rfc: string;
  lada: string;
  telefono: string;
  regimenDestinara: string;
  aduana?: string;
}

/**
 * @const FECHA_DE_PAGO
 * @description Configuración del campo “Fecha de pago” en el formulario.
 */
export const FECHA_DE_PAGO = {
  labelNombre: 'Fecha de pago:',
  required: false,
  habilitado: true,
};

/**
 * @const FECHA_DE_FABRICACIO_PAGO
 * @description Configuración del campo “Fecha de pago” en el formulario.
 */
export const FECHA_DE_FABRICACIO_PAGO = {
  labelNombre: 'Fecha de fabricación',
  required: true,
  habilitado: true,
};

/**
 * @const FECHA_DE_CADUCIDAD_PAGO
 * @description Configuración del campo “Fecha de pago” en el formulario.
 */
export const FECHA_DE_CADUCIDAD_PAGO = {
  labelNombre: 'Fecha de caducidad',
  required: true,
  habilitado: true,
};

/**
 * @const FECHA_DE_CADUCIDAD_MERCANICA
 * @description Configuración del campo “Fecha de caducidad” para mercancía en el formulario.
 * Incluye la etiqueta, si es requerido y si está habilitado.
 */
export const FECHA_DE_CADUCIDAD_MERCANICA = {
  labelNombre: 'Fecha de caducidad:',
  required: false,
  habilitado: true,
};

/**
 * Representa la estructura de los datos relacionados con terceros.
 *
 * Contiene las listas de información de los distintos actores
 * involucrados en el proceso de solicitud.
 *
 * @interface TercerosRelacionadosDatos
 *
 * @property {Fabricante[]} fabricanteTablaDatos - Lista de fabricantes asociados.
 * @property {Destinatario[]} destinatarioFinalTablaDatos - Lista de destinatarios finales asociados.
 * @property {Proveedor[]} proveedorTablaDatos - Lista de proveedores asociados.
 * @property {Facturador[]} facturadorTablaDatos - Lista de facturadores asociados.
 */
export interface TercerosRelacionadosDatos {
  fabricanteTablaDatos: Fabricante[];
  destinatarioFinalTablaDatos: Destinatario[];
  proveedorTablaDatos: Proveedor[];
  facturadorTablaDatos: Facturador[];
}
