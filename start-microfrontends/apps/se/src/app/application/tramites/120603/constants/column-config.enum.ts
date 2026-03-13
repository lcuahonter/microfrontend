import { CatalogosSelect, ConfiguracionColumna } from "@libs/shared/data-access-user/src";

import { SeleccionDeSucursalData, SociosYAccionistasData, SociosYAccionistasExtranjerosData } from "../models/filaData.modal";

/** 
 * Configuración de columnas para la selección de sucursal.
 * Define las columnas que se mostrarán en la tabla de selección de sucursal.
 */
export const SELECCION_DE_SUCURSAL_DATA: ConfiguracionColumna<SeleccionDeSucursalData>[] = [
    {
      encabezado: 'Calle',
      clave: (fila) => fila.calle,
      orden: 1
    },
    {
      encabezado: 'Número Exterior',
      clave: (fila) => fila.numeroExterior,
      orden: 2
    },
    {
      encabezado: 'Número Interior',
      clave: (fila) => fila.numeroInterior,
      orden: 3
    },
    {
      encabezado: 'Codigo postal',
      clave: (fila) => fila.codigoPostal,
      orden: 4
    },
    {
      encabezado: 'Colonia',
      clave: (fila) => fila.colonia,
      orden: 5
    },
    {
      encabezado: 'Municipio o alcaldia',
      clave: (fila) => fila.municipioAlcaldia,
      orden: 6
    },
    {
      encabezado: 'Estado',
      clave: (fila) => fila.estado,
      orden: 7
    },
    {
      encabezado: 'Pais',
      clave: (fila) => fila.pais,
      orden: 8
    },
    {
      encabezado: 'Localidad',
      clave: (fila) => fila.localidad,
      orden: 9
    },
    {
      encabezado: 'Teléfono',
      clave: (fila) => fila.telefono,
      orden: 9
    }
];

/** 
 * Configuración de columnas para socios y accionistas.
 * Define las columnas que se mostrarán en la tabla de socios y accionistas.
 */
export const SOCIOS_Y_ACCIONISTAS_DATA: ConfiguracionColumna<SociosYAccionistasData>[] = [
   {
      encabezado: 'RFC',
      clave: (fila) => fila.rfc,
      orden: 1
    }, 
    {
      encabezado: 'Razón social',
      clave: (fila) => fila.razonSocial,
      orden: 2
    },
    {
      encabezado: 'Nombre',
      clave: (fila) => fila.nombre,
      orden: 3
    },
    {
      encabezado: 'Apellido paterno',
      clave: (fila) => fila.apellidoPaterno,
      orden: 4
    },
    {
      encabezado: 'Apellido materno',
      clave: (fila) => fila.apellidoMaterno,
      orden: 5
    },
    {
      encabezado: 'Correo',
      clave: (fila) => fila.correo,
      orden: 6
    },
];

/** 
 * Configuración de columnas para socios y accionistas extranjeros.
 * Define las columnas que se mostrarán en la tabla de socios y accionistas extranjeros.
 */
export const SOCIOS_Y_ACCIONISTAS_EXTRANJEROS_DATA: ConfiguracionColumna<SociosYAccionistasExtranjerosData>[] = [
    {
      encabezado: 'TAX ID',
      clave: (fila) => fila.taxId,
      orden: 1
    },
    {
      encabezado: 'Razón social',
      clave: (fila) => fila.razonSocial,
      orden: 2
    },
    {
      encabezado: 'Nombre',
      clave: (fila) => fila.nombre,
      orden: 3
    },
    {
      encabezado: 'Apellido paterno',
      clave: (fila) => fila.apellidoPaterno,
      orden: 4
    },
    {
      encabezado: 'Pais',
      clave: (fila) => fila.datosPais,
      orden: 5
    },
    {
      encabezado: 'CP',
      clave: (fila) => fila.datosCodigoPostal,
      orden: 6
    },
    {
      encabezado: 'Estado',
      clave: (fila) => fila.datosEstado,
      orden: 7
    },
    {
      encabezado: 'Correo',
      clave: (fila) => fila.correoElectronico,
      orden: 8
    },
];

/** 
 * Opciones de selección para un radio button.
 * Contiene las opciones "Sí" y "No".
 */
export const RADIO_OPCION = [
    { label: 'Sí', value: 'Si' },
    { label: 'No', value: 'No' }
];

/** 
 * Tipos de persona disponibles.
 * Contiene las opciones "Persona Física" y "Persona Moral".
 */
export const TIPO_DE_PERSONA = [
   { "label": "Persona física", "value": "Persona Física" },
   { "label": "Persona moral", "value": "Persona Moral" }
];

/** Configuración de datos del estado */
export const ESTADO_DATA: CatalogosSelect = {
    labelNombre: 'Estado',
    required: true,
    primerOpcion: 'Selecciona un medio de transporte',
    catalogos: [],
  };
  
  /** Configuración de datos de representación federal */
  export const REPRESENTACION_FEDERAL_DATA: CatalogosSelect = {
    labelNombre: 'Estado',
    required: true,
    primerOpcion: 'Selecciona un medio de transporte',
    catalogos: [],
  };
  
  /** Configuración de datos del tipo de empresa */
  export const TIPO_EMPRESA_DATA: CatalogosSelect = {
    labelNombre: 'Tipo de empresa',
    required: true,
    primerOpcion: 'Selecciona un medio de transporte',
    catalogos: [],
  };
  
  /** Configuración de datos del país */
  export const PAIS_DATA: CatalogosSelect = {
    labelNombre: 'País',
    required: true,
    primerOpcion: 'Selecciona un medio de transporte',
    catalogos: [],
  };

/** Interfaz que define la estructura del domicilio */
export interface Domicilio {
  codigoPostal?: string;
  informacionExtra?: string;
  telefono?: string;
  fax?: string;
  pais?: string;
}

/** Interfaz que define la estructura de una persona relacionada */
export interface PersonaRelacionada {
  idPersona?: number;
  nombre?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  rfc?: string;
  correoElectronico?: string;
  razonSocial?: string;
  nombrePuesto?: string;
  ideTipoPersona?: string;
  datosPais?: string;
  datosEstado?: string;
  datosCodigoPostal?: string;
  domicilio?: Domicilio;
}

/** Interfaz que define la estructura del payload para una persona relacionada */
export interface PayloadPersonaRelacionada {
  idRolePersona?: number;
  personaRelacionada?: PersonaRelacionada;
}

