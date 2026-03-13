import { ConfiguracionColumna, Fabricante, MercanciasDatos } from "@libs/shared/data-access-user/src";
import { Otros260302 } from "@libs/shared/data-access-user/src/core/models/260302/certificados-licencias-permisos.model";

/**
 * Pasos principales del trámite, utilizados para controlar el flujo de la solicitud.
 * Cada objeto representa un paso con su índice, título, estado de actividad y completitud.
 * @type {Array<{indice: number, titulo: string, activo: boolean, completado: boolean}>}
 */
export const PANTA_PASOS = [
    {
      indice: 1,
      titulo: 'Capturar solicitud',
      activo: true,
      completado: false,
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
 * Configuración de columnas para la tabla de fabricantes.
 * Cada elemento define el encabezado de la columna y la clave correspondiente del modelo Fabricante.
 * @type {Array<{encabezado: string, clave: keyof Fabricante}>}
 */
export const FABRICANTE_TABLA: Array<{ encabezado: string; clave: keyof Fabricante }> = [
  { encabezado: 'Nombre/denominación o razón social', clave: 'nombre' },
  { encabezado: 'R.F.C', clave: 'rfc' },
  { encabezado: 'CURP', clave: 'curp' },
  { encabezado: 'Teléfono', clave: 'telefono' },
  { encabezado: 'Correo electrónico', clave: 'correoElectronico' },
  { encabezado: 'Calle', clave: 'calle' },
  { encabezado: 'Número exterior', clave: 'numeroExterior' },
  { encabezado: 'Número interior', clave: 'numeroInterior' },
  { encabezado: 'País', clave: 'pais' },
  { encabezado: 'Colonia', clave: 'colonia' },
  { encabezado: 'Municipio o alcaldia', clave: 'municipio' },
  { encabezado: 'Localidad', clave: 'localidad' },
  { encabezado: 'Entidad federativa', clave: 'entidadFederativa' },
  { encabezado: 'Estado/Localidad', clave: 'estado' },
  { encabezado: 'Código postal.', clave: 'cp' },
];


/**
 * Configuración de columnas para la tabla de otros terceros relacionados.
 * Cada elemento define el encabezado de la columna y la clave correspondiente del modelo Otros260302.
 * @type {Array<{encabezado: string, clave: keyof Otros260302}>}
 */
export const OTROS_TABLA:Array<{ encabezado: string; clave: keyof Otros260302 }> = [
  { encabezado: 'Tercero nombre descripción', clave: 'tercero' },
  { encabezado: 'Nombre/denominación o razón social', clave: 'nombre' },
  { encabezado: 'R.F.C', clave: 'rfc' },
  { encabezado: 'CURP', clave: 'curp' },
  { encabezado: 'Teléfono', clave: 'telefono' },
  { encabezado: 'Correo electrónico', clave: 'correoElectronico' },
  { encabezado: 'Calle', clave: 'calle' },
  { encabezado: 'Número exterior', clave: 'numeroExterior' },
  { encabezado: 'Número interior', clave: 'numeroInterior' },
  { encabezado: 'País', clave: 'pais' },
  { encabezado: 'Colonia', clave: 'colonia' },
  { encabezado: 'Municipio o alcaldia', clave: 'municipio' },
  { encabezado: 'Localidad', clave: 'localidad' },
  { encabezado: 'Entidad federativa', clave: 'entidadFederativa' },
  { encabezado: 'Estado/Localidad', clave: 'estado' },
  { encabezado: 'Código postal.', clave: 'cp' },
];

/**
 * Título del primer paso del trámite.
 * @type {string}
 */
export const PASO_UNO = 'Solicitud de Importación de Medicamentos que sean o contengan Estupefacientes o Psicotrópicos';
/**
 * Título del segundo paso del trámite.
 * @type {string}
 */
export const PASO_DOS = 'Cargar archivos';
/**
 * Título del tercer paso del trámite.
 * @type {string}
 */
export const PASO_TRES = 'Firmar';

/**
 * Configuración para el campo de fecha de pago.
 * Incluye el nombre de la etiqueta, si es requerido y si está habilitado.
 * @type {{labelNombre: string, required: boolean, habilitado: boolean}}
 */
export const FECHA_PAGO = {
  labelNombre: 'Fecha de pago',
  required: false,
  habilitado: false,
};

/**
 * Configuración de columnas para la tabla de mercancías.
 * Cada elemento define el encabezado, la función clave y el orden de la columna.
 * @type {ConfiguracionColumna<MercanciasDatos>[]}
 */
export const CONFIGURACION_MERCANCIAS_DATOS : ConfiguracionColumna<MercanciasDatos>[] = [
    { encabezado: 'Clasificación del producto', clave: (item: MercanciasDatos) => item.clasificacion, orden: 1 },
    { encabezado: 'Especificar clasificación del producto', clave: (item: MercanciasDatos) => item.especificar, orden: 2 },
    { encabezado: 'Denominación común internacional (DCI) o Denominación genérica o nombre científico', clave: (item: MercanciasDatos) => item.dci, orden: 3 },
    { encabezado: 'Denominación distintiva', clave: (item: MercanciasDatos) => item.denominacion, orden: 4 },
    { encabezado: 'Número CAS', clave: (item: MercanciasDatos) => item.numeroCas, orden: 5 },
    { encabezado: 'Fracción arancelaria', clave: (item: MercanciasDatos) => item.fraccion, orden: 6 },
    { encabezado: 'Descripción de la fracción', clave: (item: MercanciasDatos) => item.descripcionDeLa, orden: 7 },
    { encabezado: 'Cantidad UMC', clave: (item: MercanciasDatos) => item.cantidadUmc, orden: 8 },
    { encabezado: 'Unidad de medida de tarifa (UMT)', clave: (item: MercanciasDatos) => item.umt, orden: 9 },
    { encabezado: 'Cantidad de lotes', clave: (item: MercanciasDatos) => item.cantidad, orden: 10 },
    { encabezado: 'Kg o g por lote', clave: (item: MercanciasDatos) => item.kg, orden: 11 },
    { encabezado: 'Numero de piezas a fabricar ', clave: (item: MercanciasDatos) => item.numeroFabricar, orden: 12 },
    { encabezado: 'Descripcion del numero de piezas a fabricar', clave: (item: MercanciasDatos) => item.descripcionFabricar, orden: 13 },
    { encabezado: 'Presentación', clave: (item: MercanciasDatos) => item.presentacion, orden: 14 },
    { encabezado: 'Numero de registro sanitario', clave: (item: MercanciasDatos) => item.registroSanitario, orden: 15 },
    { encabezado: 'Uso especifico', clave: (item: MercanciasDatos) => item.uso, orden: 16 },
    { encabezado: 'Detallar uso especifico', clave: (item: MercanciasDatos) => item.detalle, orden: 17 },
    { encabezado: 'País de destino', clave: (item: MercanciasDatos) => item.paisDeDestino, orden: 18 },
    { encabezado: 'País de origen', clave: (item: MercanciasDatos) => item.paisDeOrigen, orden: 19 },
    { encabezado: 'País de procedencia', clave: (item: MercanciasDatos) => item.paisDeProcedencia, orden: 20},
    { encabezado: 'Forma farmacéutica', clave: (item: MercanciasDatos) => item.formaFarmaceutica, orden: 21 },
    { encabezado: 'UMC', clave: (item: MercanciasDatos) => item.umc, orden: 22 },
    { encabezado: 'Cantidad UMT', clave: (item: MercanciasDatos) => item.cantidadUmt, orden: 23 },
    { encabezado: 'Unidad de medida de tarifa (UMT)', clave: (item: MercanciasDatos) => item.umt, orden: 24 },
  ];

  /**
   * Opciones para los campos de selección tipo radio: "No" y "Sí".
   * Cada opción contiene una etiqueta y un valor numérico.
   * @type {Array<{label: string, value: number}>}
   */
  export const RADIO_OPCIONES = [
    {
      "label": "No",
      "value": 1
    },
    {
      "label": "Sí",
      "value": 2
    }
  ];

  /**
   * Configuración para el campo de entrada de fecha.
   * Define las propiedades del input de fecha: etiqueta, requerido y habilitado.
   * @type {{labelNombre: string, required: boolean, habilitado: boolean}}
   */
  export const INPUT_FECHA_CONFIG = {
    labelNombre: 'Fecha de pago',
    required: true,
    habilitado: true,
  }