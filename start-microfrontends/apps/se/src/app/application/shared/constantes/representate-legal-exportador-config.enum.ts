import { FieldConfig } from '../models/representate-legal-exportador.model';

/**
 * @description
 * Configuración por defecto para los campos del formulario del representante legal del exportador.
 * Esta configuración se utiliza cuando el procedimiento no tiene una configuración específica.
 * @constant {FieldConfig[]}
 */
export const DEFAULT_REPRESENTATE_LEGAL_EXPORTADOR_CONFIG: FieldConfig[] = [
  {
    nombre: 'lugar',
    label: 'Lugar',
    columna: 'col-md-8 mb-3',
    required: true,
    tipo: 'text',
    maxlength: '70',
    storeStateName: 'setGrupoRepresentativoLugar',
  },
  {
    nombre: 'nombreExportador',
    label: 'Nombre del representante legal del exportador',
    columna: 'col-md-8 mb-3',
    required: true,
    tipo: 'text',
    maxlength: '70',
    storeStateName: 'setGrupoRepresentativoNombreExportador',
  },
  {
    nombre: '',
    label: '',
    columna: 'col-md-4 mb-3',
    tipo: '',
  },
  {
    nombre: 'empresa',
    label: 'Empresa',
    columna: 'col-md-4 mb-3',
    required: true,
    tipo: 'text',
    maxlength: '90',
    storeStateName: 'setGrupoRepresentativoEmpresa',
  },

  {
    nombre: 'cargo',
    label: 'Cargo',
    columna: 'col-md-4 mb-3',
    required: true,
    tipo: 'text',
    maxlength: '70',
    storeStateName: 'setGrupoRepresentativoCargo',
  },
  {
    nombre: 'lada',
    label: 'Lada:',
    columna: 'col-md-1 mb-3',
    tipo: 'text',
    required: false,
    maxlength: '5',
    storeStateName: 'setGrupoRepresentativoLada',
  },
  {
    nombre: 'telefono',
    label: 'Teléfono',
    columna: 'col-md-3 mb-3',
    required: true,
    tipo: 'text',
    maxlength: '20',
    storeStateName: 'setGrupoRepresentativoTelefono',
  },
  {
    nombre: 'fax',
    label: 'Fax:',
    columna: 'col-md-4 mb-3',
    tipo: 'text',
    required: false,
    maxlength: '20',
    storeStateName: 'setGrupoRepresentativoFax',
  },
  {
    nombre: 'correoElectronico',
    label: 'Correo electrónico',
    columna: 'col-md-4 mb-3',
    required: true,
    tipo: 'text',
    tooltip: 'ejemplo@dominio.com',
    maxlength: '70',
    storeStateName: 'setGrupoRepresentativoCorreoElectronico',
  },
];
export const REPRESENTATE_LEGAL_EXPORTADOR_CONFIGUR: FieldConfig[] = [
  {
    nombre: 'lugar',
    label: 'Lugar',
    columna: 'col-md-8 mb-3',
    required: true,
    tipo: 'text',
    storeStateName: 'setGrupoRepresentativoLugar',
  },
  {
    nombre: 'nombre',
    label: 'Nombre del representante legal del exportador',
    columna: 'col-md-8 mb-3',
    required: true,
    tipo: 'text',
    storeStateName: 'setGrupoRepresentativoNombreExportador',
  },
  {
    nombre: '',
    label: '',
    columna: 'col-md-4 mb-3',
  },
  {
    nombre: 'empresa',
    label: 'Empresa',
    columna: 'col-md-4 mb-3',
    required: true,
    tipo: 'text',
    storeStateName: 'setGrupoRepresentativoEmpresa',
  },
  {
    nombre: 'cargo',
    label: 'Cargo',
    columna: 'col-md-4 mb-3',
    required: true,
    tipo: 'text',
    storeStateName: 'setGrupoRepresentativoCargo',
  },
  {
    nombre: 'registroFiscal',
    label: 'Número de registro fiscal:',
    columna: 'col-md-4 mb-3',
    tipo: 'text',
    required: true,
    storeStateName: 'setGrupoRepresentativoRegistroFiscal',
  },
  {
    nombre: 'correo',
    label: 'Correo electrónico',
    columna: 'col-md-4 mb-3',
    required: true,
    tipo: 'text',
    storeStateName: 'setGrupoRepresentativoCorreoElectronico'
  },
  {
    nombre: 'telefono',
    label: 'Teléfono',
    columna: 'col-md-4 mb-3',
    required: true,
    tipo: 'text',
    storeStateName: 'setGrupoRepresentativoTelefono',
  },
  {
    nombre: 'fax',
    label: 'FAX:',
    columna: 'col-md-4 mb-3',
    required: false,
    tipo: 'text',
    storeStateName: 'setGrupoRepresentativoFax',
  },
]
/**
 * @description
 * Configuración de campos del formulario del representante legal del exportador
 * para diferentes procedimientos.
 * @constant {Record<string, FieldConfig[]>}
 */
export const REPRESENTATE_LEGAL_EXPORTADOR_CONFIG: {
  [key: string]: FieldConfig[];
} = {
  '110205': [
     {
    nombre: 'lugar',
    label: 'Lugar',
    columna: 'col-md-8 mb-3',
    required: true,
    tipo: 'text',
    storeStateName: 'setGrupoRepresentativoLugar',
  },
  {
    nombre: '',
    label: '',
    columna: 'col-md-4 mb-3',
    tipo: '',
  },
  {
    nombre: 'nombreExportador',
    label: 'Nombre del representante legal del exportador',
    columna: 'col-md-8 mb-3',
    required: true,
    tipo: 'text',
    storeStateName: 'setGrupoRepresentativoNombreExportador',
  },
  {
    nombre: '',
    label: '',
    columna: 'col-md-4 mb-3',
    tipo: '',
  },
  {
    nombre: 'empresa',
    label: 'Empresa',
    columna: 'col-md-4 mb-3',
    required: true,
    tipo: 'text',
    storeStateName: 'setGrupoRepresentativoEmpresa',
  },

  {
    nombre: 'cargo',
    label: 'Cargo',
    columna: 'col-md-4 mb-3',
    required: true,
    tipo: 'text',
    storeStateName: 'setGrupoRepresentativoCargo',
  },
  {
    nombre: 'telefono',
    label: 'Teléfono',
    columna: 'col-md-3 mb-3',
    required: true,
    tipo: 'text',
    storeStateName: 'setGrupoRepresentativoTelefono',
  },
  {
    nombre: 'correoElectronico',
    label: 'Correo electrónico',
    columna: 'col-md-4 mb-3',
    required: true,
    tipo: 'text',
    tooltip: 'ejemplo@dominio.com',
    storeStateName: 'setGrupoRepresentativoCorreoElectronico',
  },
  ],
  '110212': DEFAULT_REPRESENTATE_LEGAL_EXPORTADOR_CONFIG,
  '110214': [
    {
      nombre: 'lugar',
      label: 'Lugar',
      columna: 'col-md-8 mb-3',
      required: true,
      tipo: 'text',
    },
    {
      nombre: 'nombre',
      label: 'Nombre del representante legal del exportador',
      columna: 'col-md-8 mb-3',
      required: true,
      tipo: 'text',
    },
    {
      nombre: '',
      label: '',
      columna: 'col-md-4 mb-3',
    },
    {
      nombre: 'empresa',
      label: 'Empresa',
      columna: 'col-md-4 mb-3',
      required: true,
      tipo: 'text',
    },
    {
      nombre: 'cargo',
      label: 'Cargo',
      columna: 'col-md-4 mb-3',
      required: true,
      tipo: 'text',
    },
    {
      nombre: 'telefono',
      label: 'Teléfono',
      columna: 'col-md-4 mb-3',
      required: true,
      tipo: 'text',
    },
    {
      nombre: 'correo',
      label: 'Correo electrónico',
      columna: 'col-md-4 mb-3',
      required: true,
      tipo: 'text',
    },
  ],
  '110216': DEFAULT_REPRESENTATE_LEGAL_EXPORTADOR_CONFIG,
  '110217': DEFAULT_REPRESENTATE_LEGAL_EXPORTADOR_CONFIG,
  '110221': [
    {
      nombre: 'nombre',
      label: 'Nombre del representante legal del exportador',
      columna: 'col-md-8 mb-3',
      required: true,
      tipo: 'text',
    },
    {
      nombre: 'lugar',
      label: 'Lugar',
      columna: 'col-md-4 mb-3',
      required: true,
      tipo: 'text',
    },
    {
      nombre: 'calle',
      label: 'Calle',
      columna: 'col-md-8 mb-3',
      required: true,
      tipo: 'text',
    },
    {
      nombre: 'numero',
      label: 'Número y/o letra',
      columna: 'col-md-4 mb-3',
      required: true,
      tipo: 'text',
    },
    {
      nombre: 'paisDestino',
      label: 'País Destino',
      columna: 'col-md-8 mb-3',
      required: true,
      tipo: 'dropdown',
    },
    {
      nombre: 'ciudad',
      label: 'Ciudad (población, estado o provincial)',
      columna: 'col-md-4 mb-3',
      required: true,
      tipo: 'text',
    },
    {
      nombre: 'cargo',
      label: 'Cargo',
      columna: 'col-md-8 mb-3',
      required: true,
      tipo: 'text',
    },
    {
      nombre: 'empresa',
      label: 'Empresa',
      columna: 'col-md-4 mb-3',
      required: true,
      tipo: 'text',
    },
    {
      nombre: 'registroFiscal',
      label: 'Número de registro fiscal',
      columna: 'col-md-4 mb-3',
      required: true,
      tipo: 'text',
    },
    {
      nombre: 'lada',
      label: 'Lada:',
      columna: 'col-md-1 mb-3',
      tipo: 'text',
      required: false,
    },
    {
      nombre: 'telefono',
      label: 'Teléfono',
      columna: 'col-md-3 mb-3',
      required: true,
      tipo: 'text',
    },
    {
      nombre: 'fax',
      label: 'Fax:',
      columna: 'col-md-4 mb-3',
      tipo: 'text',
      required: false,
    },
    {
      nombre: 'correo',
      label: 'Correo electrónico',
      columna: 'col-md-4 mb-3',
      required: true,
      tipo: 'text',
      tooltip: 'ejemplo@dominio.com',
    },
  ],
  '110222': REPRESENTATE_LEGAL_EXPORTADOR_CONFIGUR,
  '110223': DEFAULT_REPRESENTATE_LEGAL_EXPORTADOR_CONFIG,
  '110207': [
     {
    nombre: 'lugar',
    label: 'Lugar',
    columna: 'col-md-8 mb-3',
    required: true,
    tipo: 'text',
    storeStateName: 'setGrupoRepresentativoLugar',
  },
  {
    nombre: '',
    label: '',
    columna: 'col-md-4 mb-3',
    tipo: '',
  },
  {
    nombre: 'nombreExportador',
    label: 'Nombre del representante legal del exportador',
    columna: 'col-md-8 mb-3',
    required: true,
    tipo: 'text',
    storeStateName: 'setGrupoRepresentativoNombreExportador',
  },
  {
    nombre: '',
    label: '',
    columna: 'col-md-4 mb-3',
    tipo: '',
  },
  {
    nombre: 'empresa',
    label: 'Empresa',
    columna: 'col-md-4 mb-3',
    required: true,
    tipo: 'text',
    storeStateName: 'setGrupoRepresentativoEmpresa',
  },

  {
    nombre: 'cargo',
    label: 'Cargo',
    columna: 'col-md-4 mb-3',
    required: true,
    tipo: 'text',
    storeStateName: 'setGrupoRepresentativoCargo',
  },
  {
    nombre: 'telefono',
    label: 'Teléfono',
    columna: 'col-md-3 mb-3',
    required: true,
    tipo: 'text',
    storeStateName: 'setGrupoRepresentativoTelefono',
  },
  {
    nombre: 'correoElectronico',
    label: 'Correo electrónico',
    columna: 'col-md-4 mb-3',
    required: true,
    tipo: 'text',
    tooltip: 'ejemplo@dominio.com',
    storeStateName: 'setGrupoRepresentativoCorreoElectronico',
  },
  ],
  '110211': DEFAULT_REPRESENTATE_LEGAL_EXPORTADOR_CONFIG,

};

/**
 * @description
 * Lista de procedimientos que utilizan un catálogo para el campo "país destino"
 * en el formulario del representante legal del exportador.
 * @constant {string[]}
 */
export const PAIS_CATALOGO = ['110221'];