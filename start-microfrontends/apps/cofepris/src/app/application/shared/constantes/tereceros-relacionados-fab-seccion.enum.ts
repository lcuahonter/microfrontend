import { FacricanteModel, FacturadorModel } from "../models/terceros-fabricante-relocionados.model";

import { DestinatarioModel } from "../models/terceros-fabricante-relocionados.model";

/**
 * `NACIONALIDAD_OPCIONES_DE_BOTON_DE_RADIO`
 * 
 * Esta constante define las opciones disponibles para un grupo de botones de radio que representan la nacionalidad.
 * 
 * 
 * ### Propósito:
 * - Se utiliza para representar la nacionalidad de una persona o entidad en formularios o interfaces de usuario.
 * - Permite al usuario seleccionar entre las opciones "Nacional" y "Extranjero".

 */
export const NACIONALIDAD_OPCIONES_DE_BOTON_DE_RADIO = [
    {
        label: 'Nacional',
        value: '1',
    },
    {
        label: 'Extranjero',
        value: '0',
    }
  ];
  /**
 * `PERSONA_OPCIONES_DE_BOTON_DE_RADIO`
 * 
 * Esta constante define las opciones disponibles para un grupo de botones de radio que representan el tipo de persona.
 * 
 * ### Estructura:
 * - Cada objeto dentro del array contiene las siguientes propiedades:
 *   - `label`: El texto que se mostrará junto al botón de radio.
 *   - `value`: El valor asociado a la opción seleccionada.
 * 

 * ### Propósito:
 * - Se utiliza para representar el tipo de persona (física o moral) en formularios o interfaces de usuario.
 * - Permite al usuario seleccionar entre las opciones "Física" y "Moral".
 * 

 * 

 * ```
 */
  export const PERSONA_OPCIONES_DE_BOTON_DE_RADIO = [
    {
        label: 'Física',
        value: '1',
        hint: 'Una persona física es entendida como toda persona con una actividad específica'
    },
    {
        label: 'Moral',
        value: '0',
        hint: 'Una persona moral es entendida como una empresa con una actividad específica'
    },
    {
      label: 'No contribuyente',
      value: '2',
      hint: 'No contribuyente'
    }
  ];
  /**
 * Texto de alerta para los terceros relacionados.
 * Indica que las tablas con asterisco son obligatorias.
 */
export const TERCEROS_TEXTO_DE_ALERTA =
'Las tablas con asterisco son obligatorias y debes agregar por lo menos un registro.';
/**
 * `FABRICANTE_TABLE_CONFIG` Configuración de la tabla para los fabricantes.
 */

export const FABRICANTE_TABLE_CONFIG = [
  {
    encabezado: 'Nombre/denominación o razón social',
    clave: (ele: FacricanteModel): string => ele.denominacionRazonSocial,
    orden: 1,
  },
  {
    encabezado: "R.F.C",
    clave: (ele: FacricanteModel): string => ele.rfc,
    orden: 2,
  },
 {
    encabezado: 'CURP',
    clave: (ele: FacricanteModel): string => ele.curp,
    orden: 3,
  },
  {
    encabezado: "Teléfono",
    clave: (ele: FacricanteModel): string => ele.telefono,
    orden: 4,
  },
   {
    encabezado: 'Correo electrónico',
    clave: (ele: FacricanteModel): string => ele.CorreoElectronico,
    orden: 5,
  },
  {
    encabezado: "Calle",
    clave: (ele: FacricanteModel): string => ele.calle,
    orden: 6,
  },
   {
    encabezado: 'Número exterior',
    clave: (ele: FacricanteModel): string => ele.numeroExterior,
    orden: 7,
  },
  {
    encabezado: "Número interior",
    clave: (ele: FacricanteModel): string => ele.numeroInterior,
    orden: 8,
  },
   {
    encabezado: 'País',
    clave: (ele: FacricanteModel): string => ele.pais,
    orden: 9,
  },
  {
    encabezado: "Colonia",
    clave: (ele: FacricanteModel): string => ele.colonia,
    orden: 10,
  },

   {
    encabezado: 'Municipio o alcaldía',
    clave: (ele: FacricanteModel): string => ele.municipioOAlcaldia,
    orden: 11,
  },
  {
    encabezado: "Localidad",
    clave: (ele: FacricanteModel): string => ele.localidad,
    orden: 12,
  }, 
  {
    encabezado: 'Entidad federativa',
    clave: (ele: FacricanteModel): string => ele.entidadFederativa,
    orden: 13,
  },
   {
    encabezado: 'Estado/localidad',
    clave: (ele: FacricanteModel): string => ele.estadoLocalidad,
    orden: 14,
  },
  {
    encabezado: "Código postal",
    clave: (ele: FacricanteModel): string => ele.codigoPostal,
    orden: 15,
  },
 {
    encabezado: "Colonia o equivalente",
    clave: (ele: FacricanteModel): string => ele.coloniaoEquivalente,
    orden: 16,
  },

]
/**
 * `DESTINATARIO_TABLE_CONFIG` Configuración de la tabla para los destinatarios.
 */
export const DESTINATARIO_TABLE_CONFIG = [
   {
    encabezado: 'Nombre/denominación o razón social',
    clave: (ele: DestinatarioModel): string => ele.denominacionRazonSocial,
    orden: 1,
  },
  {
    encabezado: "R.F.C",
    clave: (ele: DestinatarioModel): string => ele.rfc,
    orden: 2,
  },
 {
    encabezado: 'CURP',
    clave: (ele: DestinatarioModel): string => ele.curp,
    orden: 3,
  },
  {
    encabezado: "Teléfono",
    clave: (ele: DestinatarioModel): string => ele.telefono,
    orden: 4,
  },
   {
    encabezado: 'Correo electrónico',
    clave: (ele: DestinatarioModel): string => ele.CorreoElectronico,
    orden: 5,
  },
  {
    encabezado: "Calle",
    clave: (ele: DestinatarioModel): string => ele.calle,
    orden: 6,
  },
   {
    encabezado: 'Número exterior',
    clave: (ele: DestinatarioModel): string => ele.numeroExterior,
    orden: 7,
  },
  {
    encabezado: "Número interior",
    clave: (ele: DestinatarioModel): string => ele.numeroInterior,
    orden: 8,
  },
   {
    encabezado: 'País',
    clave: (ele: DestinatarioModel): string => ele.pais,
    orden: 9,
  },
  {
    encabezado: "Colonia",
    clave: (ele: DestinatarioModel): string => ele.colonia,
    orden: 10,
  },

   {
    encabezado: 'Municipio o alcaldía',
    clave: (ele: DestinatarioModel): string => ele.municipioOAlcaldia,
    orden: 11,
  },
  {
    encabezado: "Localidad",
    clave: (ele: DestinatarioModel): string => ele.localidad,
    orden: 12,
  }, 
  {
    encabezado: 'Entidad federativa',
    clave: (ele: DestinatarioModel): string => ele.entidadFederativa,
    orden: 13,
  },
   {
    encabezado: 'Estado/localidad',
    clave: (ele: DestinatarioModel): string => ele.estadoLocalidad,
    orden: 14,
  },
  {
    encabezado: "Código postal",
    clave: (ele: DestinatarioModel): string => ele.codigoPostal,
    orden: 15,
  },
 {
    encabezado: "Colonia o equivalente",
    clave: (ele: DestinatarioModel): string => ele.coloniaoEquivalente,
    orden: 16,
  },
]

/**
 * `PROVEEDOR_TABLE_CONFIG` Configuración de la tabla para los proveedores.
 */

export const PROVEEDOR_TABLE_CONFIG = [
   {
    encabezado: 'Nombre/denominación o razón social',
    clave: (ele: DestinatarioModel): string => ele.denominacionRazonSocial,
    orden: 1,
  },
  {
    encabezado: "R.F.C",
    clave: (ele: DestinatarioModel): string => ele.rfc,
    orden: 2,
  },
 {
    encabezado: 'CURP',
    clave: (ele: DestinatarioModel): string => ele.curp,
    orden: 3,
  },
  {
    encabezado: "Teléfono",
    clave: (ele: DestinatarioModel): string => ele.telefono,
    orden: 4,
  },
   {
    encabezado: 'Correo electrónico',
    clave: (ele: DestinatarioModel): string => ele.CorreoElectronico,
    orden: 5,
  },
  {
    encabezado: "Calle",
    clave: (ele: DestinatarioModel): string => ele.calle,
    orden: 6,
  },
   {
    encabezado: 'Número exterior',
    clave: (ele: DestinatarioModel): string => ele.numeroExterior,
    orden: 7,
  },
  {
    encabezado: "Número interior",
    clave: (ele: DestinatarioModel): string => ele.numeroInterior,
    orden: 8,
  },
   {
    encabezado: 'País',
    clave: (ele: DestinatarioModel): string => ele.pais,
    orden: 9,
  },
  {
    encabezado: "Colonia",
    clave: (ele: DestinatarioModel): string => ele.colonia,
    orden: 10,
  },

   {
    encabezado: 'Municipio o alcaldía',
    clave: (ele: DestinatarioModel): string => ele.municipioOAlcaldia,
    orden: 11,
  },
  {
    encabezado: "Localidad",
    clave: (ele: DestinatarioModel): string => ele.localidad,
    orden: 12,
  }, 
  {
    encabezado: 'Entidad federativa',
    clave: (ele: DestinatarioModel): string => ele.entidadFederativa,
    orden: 13,
  },
   {
    encabezado: 'Estado/localidad',
    clave: (ele: DestinatarioModel): string => ele.estadoLocalidad,
    orden: 14,
  },
  {
    encabezado: "Código postal",
    clave: (ele: DestinatarioModel): string => ele.codigoPostal,
    orden: 15,
  },
 {
    encabezado: "Colonia o equivalente",
    clave: (ele: DestinatarioModel): string => ele.coloniaoEquivalente,
    orden: 16,
  },
]
/**
 * `FACTURADOR_TABLE_CONFIG` Configuración de la tabla para los facturadores.
 */


export const FACTURADOR_TABLE_CONFIG = [
   {
    encabezado: 'Nombre/denominación o razón social',
    clave: (ele: FacturadorModel): string => ele.denominacionRazonSocial,
    orden: 1,
  },
  {
    encabezado: "R.F.C",
    clave: (ele: FacturadorModel): string => ele.rfc,
    orden: 2,
  },
 {
    encabezado: 'CURP',
    clave: (ele: FacturadorModel): string => ele.curp,
    orden: 3,
  },
  {
    encabezado: "Teléfono",
    clave: (ele: FacturadorModel): string => ele.telefono,
    orden: 4,
  },
   {
    encabezado: 'Correo electrónico',
    clave: (ele: FacturadorModel): string => ele.CorreoElectronico,
    orden: 5,
  },
  {
    encabezado: "Calle",
    clave: (ele: FacturadorModel): string => ele.calle,
    orden: 6,
  },
   {
    encabezado: 'Número exterior',
    clave: (ele: FacturadorModel): string => ele.numeroExterior,
    orden: 7,
  },
  {
    encabezado: "Número interior",
    clave: (ele: FacturadorModel): string => ele.numeroInterior,
    orden: 8,
  },
   {
    encabezado: 'País',
    clave: (ele: FacturadorModel): string => ele.pais,
    orden: 9,
  },
  {
    encabezado: "Colonia",
    clave: (ele: FacturadorModel): string => ele.colonia,
    orden: 10,
  },

   {
    encabezado: 'Municipio o alcaldía',
    clave: (ele: FacturadorModel): string => ele.municipioOAlcaldia,
    orden: 11,
  },
  {
    encabezado: "Localidad",
    clave: (ele: FacturadorModel): string => ele.localidad,
    orden: 12,
  }, 
  {
    encabezado: 'Entidad federativa',
    clave: (ele: FacturadorModel): string => ele.entidadFederativa,
    orden: 13,
  },
   {
    encabezado: 'Estado/localidad',
    clave: (ele: FacturadorModel): string => ele.estadoLocalidad,
    orden: 14,
  },
  {
    encabezado: "Código postal",
    clave: (ele: FacturadorModel): string => ele.codigoPostal,
    orden: 15,
  },
 {
    encabezado: "Colonia o equivalente",
    clave: (ele: FacturadorModel): string => ele.coloniaoEquivalente,
    orden: 16,
  },
];

/**
 * `PERSONA_OPCIONES_DE_BOTON_DE_RADIO_DOS`
 * Esta constante define las opciones disponibles para un grupo de botones de radio que representan el tipo de persona.
 */
 export const PERSONA_OPCIONES_DE_BOTON_DE_RADIO_DOS = [
    {
        label: 'Física',
        value: 'fisica',
        hint: 'Una persona física es entendida como toda persona con una actividad específica'
    },
    {
        label: 'Moral',
        value: 'moral',
        hint: 'Una persona moral es entendida como una empresa con una actividad específica'
    },
    {
      label: 'No contribuyente',
      value: 'noContribuyente',
      hint: 'No contribuyente'
    }
  ];

  /** 
   * `TIPO_PERSONA_DESTINATARIO`
 * Esta constante define las opciones disponibles para un grupo de botones de radio que representan el tipo de persona del destinatario.
 */
  export const TIPO_PERSONA_DESTINATARIO = [
    {
        label: 'Física',
        value: 'fisica',
        hint: 'Una persona física es entendida como toda persona con una actividad específica'
    },
    {
        label: 'Moral',
        value: 'moral',
        hint: 'Una persona moral es entendida como una empresa con una actividad específica'
    },
  ];