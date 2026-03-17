import { FilaData, FilaData2, FilaTablaData } from '../models/fila-modal';
import { ConfiguracionColumna } from '@libs/shared/data-access-user/src';
import { MercanciasInfo } from '../models/mercancia.model';
import { TramitesAsociados } from '../models/destinatario.model';

/**
 * Configuración de la tabla para destinatarios.
 */
export const DESTINATARIO_CONFIGURACION_TABLA: ConfiguracionColumna<FilaTablaData>[] = [
  {
    /** Configuración de la columna para el nombre o razón social */
    encabezado: 'Nombre/denominación o razón social',
    clave: (fila) => fila?.nombre || 'N/A',
    orden: 1,
  },
  {
    /** Configuración de la columna para el R.F.C. */
    encabezado: 'R.F.C.',
    clave: (fila) => fila?.rfc || '---',
    orden: 2,
  },
  {
    /** Configuración de la columna para el CURP */
    encabezado: 'CURP',
    clave: (fila) => fila?.curp || '---',
    orden: 3,
  },
  {
    /** Configuración de la columna para el teléfono */
    encabezado: 'Teléfono',
    clave: (fila) => fila?.telefono || 'N/A',
    orden: 4,
  },
  {
    /** Configuración de la columna para el correo electrónico */
    encabezado: 'Correo electrónico',
    clave: (fila) => fila?.correoElectronico || 'N/A',
    orden: 5,
  },
  {
    /** Configuración de la columna para la calle */
    encabezado: 'Calle',
    clave: (fila) => fila?.calle || 'N/A',
    orden: 6,
  },
  {
    /** Configuración de la columna para el número exterior */
    encabezado: 'Número exterior',
    clave: (fila) => fila?.numeroExterior || 'N/A',
    orden: 7,
  },
  {
    /** Configuración de la columna para el número interior */
    encabezado: 'Número interior',
    clave: (fila) => fila?.numeroInterior || 'N/A',
    orden: 8,
  },
  {
    /** Configuración de la columna para el país */
    encabezado: 'País',
    clave: (fila) => fila?.pais || 'N/A',
    orden: 9,
  },
  {
    /** Configuración de la columna para la colonia */
    encabezado: 'Colonia',
    clave: (fila) => fila?.colonia || '---',
    orden: 10,
  },
  {
    /** Configuración de la columna para el municipio o alcaldía */
    encabezado: 'Municipio o alcaldía',
    clave: (fila) => fila?.municipio || '---',
    orden: 11,
  },
  {
    /** Configuración de la columna para la localidad */
    encabezado: 'Localidad',
    clave: (fila) => fila?.localidad || '---',
    orden: 12,
  },
  {
    /** Configuración de la columna para el Entidad Federativa */
    encabezado: 'Entidad Federativa',
    clave: (fila) => fila?.entidadFederativa || '---',
    orden: 13,
  },
  {
    /** Configuración de la columna para el Estado Localidad */
    encabezado: 'Estado Localidad',
    clave: (fila) => fila?.estadoLocalidad || '---',
    orden: 14,
  },
  {
    /** Configuración de la columna para el código postal */
    encabezado: 'Código postal',
    clave: (fila) => fila?.codigo || 'N/A',
    orden: 15,
  },
  {
    /** Configuración de la columna para el Colonia o Equivalente */
    encabezado: 'Colonia o Equivalente',
    clave: (fila) => fila?.coloniaoEquivalente || 'N/A',
    orden: 15,
  },
];


/**
 * Configuración de las columnas para solicitudes.
 */
export const CONFIGURACION_COLUMNAS_SOLI: ConfiguracionColumna<FilaData>[] = [
  {
    /** Configuración de la columna para la clave S.C.I.A.N. */
    encabezado: 'Clave S.C.I.A.N.',
    clave: (fila) => fila.claveScianG.claveScian,
    orden: 1,
  },
  {
    /** Configuración de la columna para la descripción del S.C.I.A.N. */
    encabezado: 'Description del S.C.I.A.N',
    clave: (fila) => fila.claveScianG.descripcionDelScian,
    orden: 2,
  },
];

/**
 * Configuración de las columnas para mercancías.
 */
export const CONFIGURACION_COLUMNAS_MERCANCIAS: ConfiguracionColumna<MercanciasInfo>[] = [
  {
    /** Configuración de la columna para la clasificación del producto */
    encabezado: 'Clasificación del producto',
    clave: (fila) => fila.clasificaionProductos,
    orden: 1,
  },
  {
    /** Configuración de la columna para especificar la clasificación del producto */
    encabezado: 'Especificar Clasificación del producto',
    clave: (fila) => fila.especificarProducto,
    orden: 2,
  },
  {
    /** Configuración de la columna para la denominación específica del producto */
    encabezado: 'Denominación específico del producto',
    clave: (fila) => fila.denominacionEspecifica,
    orden: 3,
  },
  {
    /** Configuración de la columna para la denominación distintiva */
    encabezado: 'Denominación distintiva',
    clave: (fila) => fila.denominacionDistintiva,
    orden: 4,
  },
  {
      /** Configuración de la columna para la denominación común, nombre común o nombre científico del producto.*/
    encabezado: 'Denominación común, nombre común o nombre científico',
    clave: (fila) => fila.denominacionComun,
    orden: 5,
  },
  {
    /** Configuración de la columna para el Forma farmacéutica */
    encabezado: 'Forma farmacéutica',
    clave: (fila) => fila.formaFarmaceutica,
    orden: 6,
  },
  {
    /** Configuración de la columna para el estado físico */
    encabezado: 'Estado fisico',
    clave: (fila) => fila.estadoFisico,
    orden: 7,
  },
  {
    /** Configuración de la columna para la fracción arancelaria */
    encabezado: 'Fracción arancelaria',
    clave: (fila) => fila.fraccionArancelaria,
    orden: 8,
  },
  {
    /** Configuración de la columna para la descripción de la fracción arancelaria */
    encabezado: 'Descripción de la fracción',
    clave: (fila) => fila.descripcionDeLaFraccion,
    orden: 9,
  },
  {
    /** Configuración de la columna para la unidad de medida de comercialización (UMC) */
    encabezado: 'Unidad de medida de comercialización (UMC)',
    clave: (fila) => fila.UMC,
    orden: 10,
  },
  {
    /** Configuración de la columna para la cantidad UMC */
    encabezado: 'Cantidad UMC',
    clave: (fila) => fila.cantidadUMC,
    orden: 11,
  },
  {
    /** Configuración de la columna para la unidad de medida de tarifa (UMT) */
    encabezado: 'Unidad de medida de tarifa (UMT)',
    clave: (fila) => fila.UMT,
    orden: 12,
  },
  {
    /** Configuración de la columna para la cantidad UMT */
    encabezado: 'Cantidad UMT',
    clave: (fila) => fila.cantidadUMT,
    orden: 13,
  },
  
  {
    /** Configuración de la columna para la presentación farmacéutica o tipo de envase */
    encabezado: 'presentacion',
    clave: (fila) => fila.presentacion,
    orden: 14,
  },
  {
    /** Configuración de la columna para el número de registro sanitario */
    encabezado: 'Numero de registro sanitario',
    clave: (fila) => fila.numeroDeRegistoSanitario,
    orden: 15,
  },
  {
    /** Configuración de la columna para el país de origen */
    encabezado: 'País de origen',
    clave: (fila) => fila.paisDeOrigen,
    orden: 16,
  },
  {
    /** Configuración de la columna para el país de procedencia */
    encabezado: 'País de procedencia',
    clave: (fila) => fila.paisdeProcedencia,
    orden: 17,
  },
  {
    /** Configuración de la columna para el Tipo producto */
    encabezado: 'Tipo producto',
    clave: (fila) => fila.tipoProducto,
    orden: 18,
  },
  {
    /** Configuración de la columna para el uso específico */
    encabezado: 'Uso específico',
    clave: (fila) => fila.usoEspecifico,
    orden: 19,
  },
  {
    /** Configuración de la columna para el Fecha de caducidad */
    encabezado: 'Fecha de caducidad',
    clave: (fila) => fila.fechaDeCaducidad,
    orden: 20,
  },
];

/**
 * Configuración de la tabla para trámites asociados.
 */
export const DESTINATARIO_CONFIGURACION_TABLA2: ConfiguracionColumna<TramitesAsociados>[] = [
  {
    /** Configuración de la columna para el número */
    encabezado: 'No.',
    clave: (fila) => fila?.No,
    orden: 1,
  },
  {
    /** Configuración de la columna para el folio del trámite */
    encabezado: 'Folio tramite',
    clave: (fila) => fila?.folioTramite,
    orden: 2,
  },
  {
    /** Configuración de la columna para el tipo de trámite */
    encabezado: 'Tipo tramite',
    clave: (fila) => fila?.tipoTramite,
    orden: 3,
  },
  {
    /** Configuración de la columna para el estatus */
    encabezado: 'Estatus',
    clave: (fila) => fila?.estatus,
    orden: 4,
  },
  {
    /** Configuración de la columna para la fecha de alta del registro */
    encabezado: 'Fecha alta de registro',
    clave: (fila) => fila?.fechaaltaderegistro,
    orden: 5,
  },
];