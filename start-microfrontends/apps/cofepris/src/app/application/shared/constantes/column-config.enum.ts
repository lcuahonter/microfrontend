import { Destinatario, TramitesAsociados } from '../models/destinatario.model';
import { FilaData, FilaData2, ListaClave } from '../models/fila-modal';
import { ConfiguracionColumna } from '@libs/shared/data-access-user/src';

export const DESTINATARIO_CONFIGURACION_TABLA: ConfiguracionColumna<Destinatario>[] = [
  {
    encabezado: 'Nombre/denominación o razón social',
    clave: (fila) => fila?.nombre || 'N/A',
    orden: 1,
  },
  {
    encabezado: 'R.F.C.',
    clave: (fila) => fila?.rfc || '---',
    orden: 2,
  },
  {
    encabezado: 'CURP',
    clave: (fila) => fila?.curp || '---',
    orden: 3,
  },
  {
    encabezado: 'Teléfono',
    clave: (fila) => fila?.telefono || 'N/A',
    orden: 4,
  },
  {
    encabezado: 'Correo electrónico',
    clave: (fila) => fila?.correoElectronico || 'N/A',
    orden: 5,
  },
  {
    encabezado: 'Calle',
    clave: (fila) => fila?.calle || 'N/A',
    orden: 6,
  },
  {
    encabezado: 'Número exterior',
    clave: (fila) => fila?.numeroExterior || 'N/A',
    orden: 7,
  },
  {
    encabezado: 'Número interior',
    clave: (fila) => fila?.numeroInterior || 'N/A',
    orden: 8,
  },
  {
    encabezado: 'País',
    clave: (fila) => fila?.pais || 'N/A',
    orden: 9,
  },
  {
    encabezado: 'Colonia',
    clave: (fila) => fila?.colonia || '---',
    orden: 10,
  },
  {
    encabezado: 'Municipio o alcaldía',
    clave: (fila) => fila?.municipio || '---',
    orden: 11,
  },
  {
    encabezado: 'Localidad',
    clave: (fila) => fila?.localidad || '---',
    orden: 12,
  },
  {
    encabezado: 'Estado',
    clave: (fila) => fila?.estado || '---',
    orden: 13,
  },
  {
    encabezado: 'Estado',
    clave: (fila) => fila?.estado2 || '---',
    orden: 14,
  },
  {
    encabezado: 'Código postal',
    clave: (fila) => fila?.codigopostal || 'N/A',
    orden: 15,
  },
];
export const CONFIGURACION_COLUMNAS_SOLI: ConfiguracionColumna<FilaData>[] = [
  {
    encabezado: 'Clave S.C.I.A.N.',
    clave: (fila) => fila.claveScianG.claveScian,
    orden: 1,
  },
  {
    encabezado: 'Description del S.C.I.A.N',
    clave: (fila) => fila.claveScianG.descripcionDelScian,
    orden: 2,
  },
];

export const CONFIGURACION_COLUMNAS_MERCANCIAS: ConfiguracionColumna<FilaData2>[] = [
  {
    encabezado: 'Clasificación del producto',
    clave: (fila) => fila.clasificaionProductos,
    orden: 1,
  },
  {
    encabezado: 'Especificar Clasificación del producto',
    clave: (fila) => fila.especificarProducto,
    orden: 2,
  },
  {
    encabezado: 'Denominación específico del producto',
    clave: (fila) => fila.nombreProductoEspecifico,
    orden: 3,
  },
  {
    encabezado: 'Marca',
    clave: (fila) => fila.marca,
    orden: 4,
  },
  {
    encabezado: 'Tipo de producto',
    clave: (fila) => fila.tipoProducto,
    orden: 5,
  },
  {
    encabezado: 'Fracción arancelaria',
    clave: (fila) => fila.fraccionArancelaria,
    orden: 6,
  },
  {
    encabezado: 'Descripción de la fracción arancelaria',
    clave: (fila) => fila.descripcionFraccionArancelaria,
    orden: 7,
  },
  {
    encabezado: 'Unidad de medida de comercialización (UMC)',
    clave: (fila) => fila.umc,
    orden: 8,
  },
  {
    encabezado: 'Cantidad UMC',
    clave: (fila) => fila.cantidadUMC,
    orden: 9,
  },
  {
    encabezado: 'Unidad de medida de tarifa (UMT)',
    clave: (fila) => fila.umt,
    orden: 10,
  },
  {
    encabezado: 'Cantidad UMT',
    clave: (fila) => fila.cantidadUMT,
    orden: 11,
  },
  {
    encabezado: 'País de origen',
    clave: (fila) => fila.paisDeOrigen,
    orden: 12,
  },
  {
    encabezado: 'País de procedencia',
    clave: (fila) => fila.paisDeProcedencia,
    orden: 13,
  },
  {
    encabezado: 'Uso específico',
    clave: (fila) => fila.usoEspecifico,
    orden: 14,
  },
];

export const CONFIGURACION_COLUMNAS_LISTA_CLAVE: ConfiguracionColumna<ListaClave>[] = [
  {
    encabezado: 'Clave de los lotes',
    clave: (fila) => fila.claveDeLosLotes,
    orden: 1,
  },
  {
    encabezado: 'Fecha de fabricación',
    clave: (fila) => fila.fechaDeFabricacion,
    orden: 2,
  },
  {
    encabezado: 'Fecha de caducidad',
    clave: (fila) => fila.fechaDeCaducidad,
    orden: 3,
  },
];

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