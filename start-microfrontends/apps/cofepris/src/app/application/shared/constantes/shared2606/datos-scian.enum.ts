
import { DatosProducto, ScianData } from "../../models/shared2606/datos-modificacion.model";

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
    clave: (item: ScianData ):string => item.clave,
    orden: 1,
  },
  {
    encabezado: 'Descripción del S.C.I.A.N.',
    clave: (item: ScianData ):string => item.descripcion,
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
      clave: (item: DatosProducto):string => item.clasificacionProducto,
      orden: 1,
    },
    {
      encabezado: 'Especificar clasificación del producto',
      clave: (item: DatosProducto):string => item.especificarClasificacionProducto,
      orden: 2,
    },
    {
      encabezado: 'Marca comercial o denominación distintiva',
      clave: (item: DatosProducto):string => item.marcaComercialODenominacionDistintiva,
      orden: 3,
    },
    {
      encabezado: 'Denominación común internacional (DCI) o denominación genérica',
      clave: (item: DatosProducto):string => item.denominacionComunInternacionalODenominacionGenerica,
      orden: 4,
    },
    {
      encabezado: 'Tipo de producto',
      clave: (item: DatosProducto):string => item.tipoProducto,
      orden: 5,
    },
    {
      encabezado: 'Estado físico',
      clave: (item: DatosProducto):string => item.estadoFisico,
      orden: 6,
    },
    {
      encabezado: 'Fracción arancelaria',
      clave: (item: DatosProducto):string => item.fraccionArancelaria,
      orden: 7,
    },
    {
      encabezado: 'Descripción de la fracción',
      clave: (item: DatosProducto):string => item.descripcionFraccion,
      orden: 8,
    },
    {
      encabezado: 'Unidad de medida de comercialización (UMC)',
      clave: (item: DatosProducto):string => item.unidadMedidaComercializacion,
      orden: 9,
    },
    {
      encabezado: 'Cantidad UMC',
      clave: (item: DatosProducto):string | unknown => item.cantidadUMC,
      orden: 10,
    },
    {
      encabezado: 'Uso específico',
      clave: (item: DatosProducto):string => item.usoEspecifico,
      orden: 11,
    },
    {
      encabezado: 'Porcentaje de concentración',
      clave: (item: DatosProducto):string | unknown => item.porcentajeConcentracion,
      orden: 12,
    },
    {
      encabezado: 'Valor comercial (dólares)',
      clave: (item: DatosProducto):string | unknown => item.valorComercialDolares,
      orden: 13,
    },
    {
      encabezado: 'Fecha de movimiento',
      clave: (item: DatosProducto):string | unknown => item.fechaMovimiento,
      orden: 14,
    },
    {
      encabezado: 'Presentación farmacéutica o tipo de envase',
      clave: (item: DatosProducto):string | unknown => item.presentacionFarmaceuticaOTipoEnvase,
      orden: 15,
    },
    {
      encabezado: 'País de destino',
      clave: (item: DatosProducto):string | unknown => item.paisDestino,
      orden: 16,
    },
    {
      encabezado: 'País de procedencia',
      clave: (item: DatosProducto):string | unknown => item.paisProcedencia,
      orden: 17,
    },
    {
      encabezado: 'País de origen',
      clave: (item: DatosProducto):string | unknown => item.paisOrigen,
      orden: 18,
    }
  ];

/**
 * Códigos de procedimientos que no aplican para elementos SCIAN.
 * @type {number[]}
 */
export const PROCEDIMIENTOS_NO_PARA_ELEMENTO_DESCRIPCION_REQUERIDO = [260206, 260208,260201,260302, 260219,260214,260102,260209, 260210];
   

