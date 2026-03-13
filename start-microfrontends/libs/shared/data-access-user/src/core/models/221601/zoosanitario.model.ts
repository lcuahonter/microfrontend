import { ConfiguracionColumna } from "../shared/configuracion-columna.model";
/**
 * Interfaz que define la estructura de los datos de una mercancia.
 */
export interface Mercancia {
    noPartida: number;
    tipoRequisito: string;
    requisito: string;
    numeroCertificadoInternacional: number;
    fraccionArancelaria: string;
    nico: string;
    descripcionNico: string;
    descripcion: string;
    unidadMedidaTarifa: string;
    cantidadUmt: number;
    unidadMedidaComercializacion: string;
    cantidadUmc: number;
    uso: string;
    tipoProducto: string;
    numeroLote: string;
    paisOrigen: string;
    paisProcedencia: string;
    certificadoInternacionalElectronico: string;
  }
  /**
 * Interfaz que define la estructura de los datos de un exportador.
 */
  export interface Exportador {
    nombreDenominacionORazonSocial: string;
    telefono: string;
    correoElectronico: string;
    domicilio: string;
    pais: string;
  }
  /**
 * Interfaz que representa los datos de un destinatario.
 * Un destinatario incluye información sobre su nombre, contacto, dirección y ubicación.
 */
  export interface Destinatario {
    nombreDenominacionORazonSocial: string;
    telefono: string;
    correoElectronico: string;
    domicilio: string;
    calle: string;
    numeroExterior: string;
    numeroInterior: string;
    pais: string | undefined;
    colonia: string | undefined;
    municipioOAlcaldia: string | undefined;
    entidadFederativa: string | undefined;
    codigoPostal: string;
  }

 /**
 * Mensaje informativo sobre las tablas obligatorias.
 */
export const MENSAJE_TABLA_OBLIGATORIA =
'Las tablas con asterisco son obligatorias y debes agregar por lo menos un registro.';

/**
* Mensaje informativo sobre la creación de una nueva solicitud.
*/
export const DATOS_SOLICITUD =
'Al dar clic en el botón "Cargar" se creará una nueva solicitud con los mismos datos de la solicitud 202768246';

/**
* Configuración de las columnas de la tabla de mercancías.
*/
export const CONFIGURATION_TABLA_MERCANCIAS = [
    { encabezado: 'Número de partida', clave: (item: Mercancia): number => item.noPartida, orden: 1 },
    { encabezado: 'Tipo de requisito', clave: (item: Mercancia): string => item.tipoRequisito, orden: 2 },
    { encabezado: 'Requisito', clave: (item: Mercancia): string => item.requisito, orden: 3 },
    { encabezado: 'Número de Certificado Internacional', clave: (item: Mercancia): number => item.numeroCertificadoInternacional, orden: 4 },
    { encabezado: 'Fracción arancelaria', clave: (item: Mercancia): string => item.fraccionArancelaria, orden: 5 },
    { encabezado: 'NICO', clave: (item: Mercancia): string => item.nico, orden: 6 },
    { encabezado: 'Descripción NICO', clave: (item: Mercancia): string => item.descripcionNico, orden: 7 },
    { encabezado: 'Descripción', clave: (item: Mercancia): string => item.descripcion, orden: 8 },
    { encabezado: 'Unidad de medida de tarifa', clave: (item: Mercancia): string => item.unidadMedidaTarifa, orden: 9 },
    { encabezado: 'Cantidad UMT', clave: (item: Mercancia): number => item.cantidadUmt, orden: 10 },
    { encabezado: 'Unidad de medida de comercialización', clave: (item: Mercancia): string => item.unidadMedidaComercializacion, orden: 11 },
    { encabezado: 'Cantidad UMC', clave: (item: Mercancia): number => item.cantidadUmc, orden: 12 },
    { encabezado: 'Uso', clave: (item: Mercancia): string => item.uso, orden: 13 },
    { encabezado: 'Tipo de Producto', clave: (item: Mercancia): string => item.tipoProducto, orden: 14 },
    { encabezado: 'Número de lote', clave: (item: Mercancia): string => item.numeroLote, orden: 15 },
    { encabezado: 'País de origen', clave: (item: Mercancia): string => item.paisOrigen, orden: 16 },
    { encabezado: 'País de procedencia', clave: (item: Mercancia): string => item.paisProcedencia, orden: 17 },
    { encabezado: 'Certificado Internacional Electrónico', clave: (item: Mercancia): string => item.certificadoInternacionalElectronico, orden: 18 }
];
/**
 * Configuración de las columnas de la tabla para los destinatarios.
 * Cada objeto en esta lista representa una columna de la tabla que se mostrará,
 * con un encabezado, una clave de acceso al campo del destinatario, y un orden
 * de visualización.
 */
export const CONFIGURATION_TABLA_DESTINATARIO: ConfiguracionColumna<Destinatario>[] = [
    { encabezado: 'Nombre/Razón social', clave: (item: Destinatario): string => item.nombreDenominacionORazonSocial, orden: 1 },
    { encabezado: 'Teléfono', clave: (item: Destinatario): string => item.telefono || '', orden: 2 },
    { encabezado: 'Correo electrónico', clave: (item: Destinatario): string => item.correoElectronico, orden: 3 },
    { encabezado: 'Domicilio', clave: (item: Destinatario): string => item.domicilio, orden: 4 },
    { encabezado: 'Calle', clave: (item: Destinatario): string => item.calle, orden: 5 },
    { encabezado: 'Número exterior', clave: (item: Destinatario): string => item.numeroExterior, orden: 6 },
    { encabezado: 'Número interior', clave: (item: Destinatario): string => item.numeroInterior || '', orden: 7 },
    { encabezado: 'País', clave: (item: Destinatario): string => item.pais || '', orden: 8 },
    { encabezado: 'Colonia', clave: (item: Destinatario): string => item.colonia || '', orden: 9 },
    { encabezado: 'Delegación/Municipio', clave: (item: Destinatario): string => item.municipioOAlcaldia || '', orden: 10 },
    { encabezado: 'Entidad Federativa', clave: (item: Destinatario): string => item.entidadFederativa || '', orden: 11 },
    { encabezado: 'Código Postal', clave: (item: Destinatario): string => item.codigoPostal, orden: 12 }
  ];
  /**
 * Configuración de las columnas de la tabla para los exportadores.
 * Cada objeto en esta lista representa una columna de la tabla que se mostrará,
 * con un encabezado, una clave de acceso al campo del exportador, y un orden
 * de visualización.
 */
 export const CONFIGURATION_TABLA_DATOS = [
    { encabezado: 'Nombre/denominación o razón social', clave: (item: Exportador): string => item.nombreDenominacionORazonSocial, orden: 1 },
    { encabezado: 'Teléfono', clave: (item: Exportador): string => item.telefono, orden: 2 },
    { encabezado: 'Correo electrónico', clave: (item: Exportador): string => item.correoElectronico, orden: 3 },
    { encabezado: 'Domicilio', clave: (item: Exportador): string => item.domicilio, orden: 4 },
    { encabezado: 'País', clave: (item: Exportador): string => item.pais, orden: 5 }
  ];
/**
 * Interfaz que define la estructura de los datos de una mercancias.
 */
export interface Mercancias {
  noPartida: number;
  tipoRequisito: string;
  requisito: string;
  numeroCertificadoInternacional: number;
  fraccionArancelaria: string;
  descripcionFraccion:string;
  nico: string;
  descripcionNico: string;
  descripcion: string;
  unidadMedidaTarifa: string;
  cantidadUmt: number;
  unidadMedidaComercializacion: string;
  cantidadUmc: number;
  especie:string;
  uso: string;
  tipoProducto: string;
  numeroLote: string;
  paisOrigen: string;
  paisProcedencia: string;
  certificadoInternacionalElectronico: string;
  presentacion:string;
  candidProcedencia:string;
  tipoProcedencia:string;
  tipoPlanta:string;
  plantaAutorizadaOrigen:string
}
/**
 * Interfaz que define la estructura de los pasos
 */
  export const PASOS = [
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
 * Mensaje informativo sobre las tablas obligatorias.
 */
 export const CAPTURA_MERCANCIA =
 'Para continuar con el trámite, deberá agregar por lo menos una mercancía.';
 
 /**
 * Mensaje informativo sobre OPCIONES_DE_BOTON_DE_RADIO.
 */
 export const OPCIONES_DE_BOTON_DE_RADIO = [
  {
      label: 'Animales Vivos',
      value: 'Animales Vivos',
  },
  {
      label: 'Productos y Subproductos',
      value: 'Productos y Subproductos',
  }
];

/**
* Configuración de las columnas de la tabla de mercancías.
*/
export const CONFIGURATION_TABLAS_MERCANCIAS: ConfiguracionColumna<Mercancias>[] = [
  { encabezado: 'No.partida', clave:(item: Mercancia) => item.noPartida, orden: 1 },
  { encabezado: 'Tipo de requisito', clave: (item: Mercancias) => item.tipoRequisito, orden: 2 },
  { encabezado: 'Requisito', clave: (item: Mercancias) => item.requisito, orden: 3 },
  { encabezado: 'Número de Certificado Internacional', clave: (item: Mercancias) => item.numeroCertificadoInternacional, orden: 4 },
  { encabezado: 'Fracción arancelaria', clave: (item: Mercancias) => item.fraccionArancelaria, orden: 5 },
  { encabezado: 'Descripción de la fraccíon', clave: (item: Mercancias) => item.descripcionFraccion, orden: 6 },
  { encabezado: 'Nico', clave: (item: Mercancias) => item.nico, orden: 7 },
  { encabezado: 'Descripción Nico', clave: (item: Mercancias) => item.descripcionNico, orden: 8 },
  { encabezado: 'Descripción', clave: (item: Mercancias) => item.descripcion, orden: 9 },
  { encabezado: 'Unidad de medida de tarifa(UMT)', clave: (item: Mercancias) => item.unidadMedidaTarifa, orden: 10 },
  { encabezado: 'Cantidad UMT', clave: (item: Mercancias) => item.cantidadUmt, orden: 11 },
  { encabezado: 'Unidad de medida de comercialización (UMC)', clave: (item: Mercancias) => item.unidadMedidaComercializacion, orden: 12 },
  { encabezado: 'Cantidad UMC', clave: (item: Mercancias) => item.cantidadUmc, orden: 13 },
  { encabezado: 'Especie', clave: (item: Mercancias) => item.especie, orden: 14 },
  { encabezado: 'Uso', clave: (item: Mercancias) => item.uso, orden: 15 },
  { encabezado: 'País de origen', clave: (item: Mercancias) => item.paisOrigen, orden: 16 },
  { encabezado: 'País de procedencia', clave: (item: Mercancias) => item.paisProcedencia, orden: 17 },
  { encabezado: 'presentación', clave: (item: Mercancias) => item.presentacion, orden: 18 },
  { encabezado: 'Cantidad de presentación', clave: (item: Mercancias) => item.candidProcedencia, orden: 19 },
  { encabezado: 'Tipo de presentación', clave: (item: Mercancias) => item.tipoProcedencia, orden: 20 },
  { encabezado: 'Tipo planta', clave: (item: Mercancias) => item.tipoPlanta, orden: 21 },
  { encabezado: 'Planta autorizada de origen', clave: (item: Mercancias) => item.plantaAutorizadaOrigen, orden: 22 },
  { encabezado: 'Certificado Internacional Electrónico', clave: (item: Mercancias) => item.certificadoInternacionalElectronico, orden: 23 }
 ];

/**
 * Interfaz que representa los datos de solicitud.
 * @description Contiene la información necesaria para la solicitud.
 */
 export interface DatosSolicitud {
    justificacion: string;
    aduana: string;
    oficina: string;
    punto: string;
    guia?: string;
    regimen: string;
    carro?: string;
    clave: string;
    claves: string;
    veterinario: string;
    establecimiento: string;
    capturaMercancia: string;
  }
  /**
 * Interfaz que representa el formulario de medio de transporte.
 * @description Contiene los datos relacionados con el medio de transporte de la mercancía.
 */
  export interface MedioForm {
    medio: string;
    transporte: string;
    verificacion: string;
    empresa: string;
    coordenadas: string;
  }
  /**
 * Interfaz que representa el formulario de pago de derechos.
 * @description Contiene los datos relacionados con el pago de derechos por la mercancía.
 */
  export interface PagoDerechosForm {
    claves: string;
    dependencia: string;
    banco: string;
    llave: string;
    fecha: string;
    importe: string;
  }
  /**
 * Interfaz que representa el formulario de tipo de persona.
 * @description Contiene el tipo de persona relacionado con la solicitud.
 */
  export interface TipoPersonaForm {
    tipoPersona: string;
  }
  
  /**
 * Interfaz que representa los datos personales del solicitante.
 * @description Contiene los datos personales para la validación y procesamiento de la solicitud.
 */
  export interface DatosPersonales {
    nombre: string;
    primerApellido: string;
    segundoApellido?: string;
    social: string;
    pais: string;
    codigo?: string;
    estado: string;
    municipio: string;
    colonia: string;
    calle: string;
    exterior: string;
    interior: string;
    lada?: string;
    telefono?: string;
    correoElectronico: string;
    tif: string;
  }
  /**
 * Payload que agrupa todos los formularios y datos relacionados con la solicitud.
 * @description Contiene los datos combinados de los formularios y la solicitud.
 */
  export interface ZoosanitarioPayload {
    datosSolicitud: DatosSolicitud;
    medioForm: MedioForm;
    pagoDerechosForm: PagoDerechosForm;
    tipoPersonaForm: TipoPersonaForm;
    datosPersonales: DatosPersonales;
  }

  /**
 * Interfaz que representa una opción preoperativa.
 */
export interface PreOperativo {
  /**
   * Etiqueta que describe la opción preoperativa.
   */
  label: string;

  /**
   * Valor asociado a la opción preoperativa.
   */
  value: string;
}

/**
 * Interfaz que representa los detalles de una mercancía.
 */
export interface MercanciaDellate {
  noPartida: string;
  fechaDesde: string;
  FechadeSacrificio: string;
  FechadeCaducidad: string;
  FechadefinElaboracion: string;
  FechafindeSacrificio: string;
  FechafindeCaducidad: string;
}

/**
 * Configuración de las columnas para la tabla de mercancías detalladas.
 */
export const CONFIGURATION_TABLAS_MERCANCIASDELLATE: ConfiguracionColumna<MercanciaDellate>[] = [
  { encabezado: 'Número de lote', clave: (item: MercanciaDellate) => item.noPartida, orden: 1 },
  { encabezado: 'Fecha de elaboración o empaque o proceso', clave: (item: MercanciaDellate) => item.fechaDesde, orden: 2 },
  { encabezado: 'Fecha de producción o sacrificio', clave: (item: MercanciaDellate) => item.FechadeSacrificio, orden: 3 },
  { encabezado: 'Fecha de caducidad del producto o consumo preferente', clave: (item: MercanciaDellate) => item.FechadeCaducidad, orden: 4 },
  { encabezado: 'Fecha fin de elaboración o empaque o proceso', clave: (item: MercanciaDellate) => item.FechadefinElaboracion, orden: 5 },
  { encabezado: 'Fecha fin de producción o sacrificio', clave: (item: MercanciaDellate) => item.FechafindeSacrificio, orden: 6 },
  { encabezado: 'Fecha fin de caducidad del producto o consumo preferente', clave: (item: MercanciaDellate) => item.FechafindeCaducidad, orden: 7 },
];

