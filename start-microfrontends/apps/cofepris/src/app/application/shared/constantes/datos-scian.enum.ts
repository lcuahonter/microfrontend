/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { DatosProducto, ScianData } from "../models/datos-modificacion.model";

/**
 * @const SCIAN_DATA
 * @description Constante que define una lista de objetos que representan los datos del SCIAN (Sistema de Clasificación Industrial de América del Norte).
 * Cada objeto contiene información sobre el encabezado, la clave (función que obtiene el valor de una propiedad de un objeto `ScianData`),
 * y el orden en el que se deben mostrar los datos.
 * 
 * @componente Utilizado en la aplicación Cofepris para gestionar la información relacionada con el SCIAN.
 * 
 * @propiedad {string} encabezado - El título o descripción del dato del SCIAN.
 * @propiedad {(item: ScianData) => any} clave - Función que devuelve el valor de una propiedad específica del objeto `ScianData`.
 * @propiedad {number} orden - El orden en el que se debe mostrar el dato en la interfaz de usuario.
 */
export const SCIAN_DATA = [
  {
    encabezado: 'Clave S.C.I.A.N.',
    clave: (item: ScianData ) => item.clave,
    orden: 1,
  },
  {
    encabezado: 'Descripción del S.C.I.A.N.',
    clave: (item: ScianData ) => item.descripcion,
    orden: 2,
  }
  ];

  /**
   * @const DATOS_PRODUCTO
   * @description Constante que define una lista de objetos que representan los datos de un producto.
   * Cada objeto contiene información sobre el encabezado, la clave (función que obtiene el valor de una propiedad de un objeto `DatosProducto`),
   * y el orden en el que se deben mostrar los datos.
   * 
   * @componente Utilizado en la aplicación Cofepris para gestionar la información de productos.
   * 
   * @propiedad {string} encabezado - El título o descripción del dato del producto.
   * @propiedad {(item: DatosProducto) => any} clave - Función que devuelve el valor de una propiedad específica del objeto `DatosProducto`.
   * @propiedad {number} orden - El orden en el que se debe mostrar el dato en la interfaz de usuario.
   */
  export const DATOS_PRODUCTO = [
    {
      encabezado: 'Clasificación del producto',
      clave: (item: DatosProducto) => item.clasificacionProducto,
      orden: 1,
    },
    {
      encabezado: 'Especificar clasificación del producto',
      clave: (item: DatosProducto) => item.especificarClasificacionProducto,
      orden: 2,
    },
    {
      encabezado: 'Marca comercial o denominación distintiva',
      clave: (item: DatosProducto) => item.marcaComercialODenominacionDistintiva,
      orden: 3,
    },
    {
      encabezado: 'Denominación común internacional (DCI) o denominación genérica',
      clave: (item: DatosProducto) => item.denominacionComunInternacionalODenominacionGenerica,
      orden: 4,
    },
    {
      encabezado: 'Tipo de producto',
      clave: (item: DatosProducto) => item.tipoProducto,
      orden: 5,
    },
    {
      encabezado: 'Estado físico',
      clave: (item: DatosProducto) => item.estadoFisico,
      orden: 6,
    },
    {
      encabezado: 'Fracción arancelaria',
      clave: (item: DatosProducto) => item.fraccionArancelaria,
      orden: 7,
    },
    {
      encabezado: 'Descripción de la fracción',
      clave: (item: DatosProducto) => item.descripcionFraccion,
      orden: 8,
    },
    {
      encabezado: 'Unidad de medida de comercialización (UMC)',
      clave: (item: DatosProducto) => item.unidadMedidaComercializacion,
      orden: 9,
    },
    {
      encabezado: 'Cantidad UMC',
      clave: (item: DatosProducto) => item.cantidadUMC,
      orden: 10,
    },
    {
      encabezado: 'Uso específico',
      clave: (item: DatosProducto) => item.usoEspecifico,
      orden: 11,
    },
    {
      encabezado: 'Porcentaje de concentración',
      clave: (item: DatosProducto) => item.porcentajeConcentracion,
      orden: 12,
    },
    {
      encabezado: 'Valor comercial (dólares)',
      clave: (item: DatosProducto) => item.valorComercialDolares,
      orden: 13,
    },
    {
      encabezado: 'Fecha de movimiento',
      clave: (item: DatosProducto) => item.fechaMovimiento,
      orden: 14,
    },
    {
      encabezado: 'Presentación farmacéutica o tipo de envase',
      clave: (item: DatosProducto) => item.presentacionFarmaceuticaOTipoEnvase,
      orden: 15,
    },
    {
      encabezado: 'País de destino',
      clave: (item: DatosProducto) => item.paisDestino,
      orden: 16,
    },
    {
      encabezado: 'País de procedencia',
      clave: (item: DatosProducto) => item.paisProcedencia,
      orden: 17,
    },
    {
      encabezado: 'País de origen',
      clave: (item: DatosProducto) => item.paisOrigen,
      orden: 18,
    }
  ];

/**
 * Códigos de procedimientos que no aplican para elementos SCIAN.
 * @type {number[]}
 */
export const PROCEDIMIENTOS_NO_PARA_ELEMENTO_DESCRIPCION_REQUERIDO = [260206, 260208,260201,260302, 260219,260214,260102,260209, 260210];
   

