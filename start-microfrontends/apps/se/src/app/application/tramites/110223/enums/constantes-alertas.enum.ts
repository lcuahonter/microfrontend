import { ColumnasTabla, SeleccionadasTabla } from "../models/registro.model";

/**
 * Representa una lista de pasos en un proceso.
 * Cada paso contiene la información sobre el índice, el título y el estado de completitud.
 * @example
 * const pasos = [
 *   { indice: 1, titulo: 'Capturar solicitud', activo: true, completado: true },
 *   { indice: 2, titulo: 'Firmar solicitud', activo: false, completado: false }
 * ];
 */
export const PASOS = [
  {
    indice: 1, // Índice del paso en el proceso
    titulo: 'Capturar solicitud', // Título del paso
    activo: true, // Indica si el paso está activo
    completado: true, // Indica si el paso ha sido completado
  },
  {
    indice: 2, // Índice del paso en el proceso
    titulo: 'Firmar solicitud', // Título del paso
    activo: false, // Indica si el paso está activo
    completado: false, // Indica si el paso ha sido completado
  }
];

/**
   * Configuración de las columnas de la tabla de mercancías seleccionadas.
   * Define los encabezados y las claves asociadas a cada columna de la tabla de mercancías seleccionadas.
   */
export const HEADER_DATA_MERCANCIA = [
    {
      encabezado: 'Fracción arancelaria',
      clave: (ele: SeleccionadasTabla): string => ele.fraccionArancelaria,
      orden: 1,
    },
    {
      encabezado: 'Cantidad',
      clave: (ele: SeleccionadasTabla): string => ele.cantidad,
      orden: 2,
    },
    {
      encabezado: 'Unidad de medida',
      clave: (ele: SeleccionadasTabla): string => ele.unidadMedida,
      orden: 3,
    },
    {
      encabezado: 'Valor mercancía',
      clave: (ele: SeleccionadasTabla): string => ele.valorMercancia,
      orden: 4,
    },
    {
      encabezado: 'Tipo de factura',
      clave: (ele: SeleccionadasTabla): string => ele.tipoFactura,
      orden: 5,
    },
    {
      encabezado: 'Número factura',
      clave: (ele: SeleccionadasTabla): string => ele.numFactura,
      orden: 6,
    },
    {
      encabezado: 'Complemento descripción',
      clave: (ele: SeleccionadasTabla): string => ele.complementoDescripcion,
      orden: 7,
    },
    {
      encabezado: 'Fecha factura',
      clave: (ele: SeleccionadasTabla): string => ele.fechaFactura,
      orden: 8,
    },
  ];

  
    /**
     * Configuración de las columnas de la tabla de mercancías disponibles.
     * Define los encabezados y las claves asociadas a cada columna de la tabla de mercancías disponibles.
     */
    export const HEADER_DISPONIBLES = [
      {
        encabezado: 'Fracción arancelaria',
        clave: (ele: ColumnasTabla): string => ele.fraccionArancelaria,
        orden: 1,
      },
      {
        encabezado: 'Nombre técnico',
        clave: (ele: ColumnasTabla): string => ele.nombreTecnico,
        orden: 2,
      },
      {
        encabezado: 'Nombre comercial',
        clave: (ele: ColumnasTabla): string => ele.nombreComercial,
        orden: 3,
      },
      {
        encabezado: 'Número de registro de productos',
        clave: (ele: ColumnasTabla): string => ele.numeroRegistroProductos,
        orden: 4,
      },
      {
        encabezado: 'Fecha expedición',
        clave: (ele: ColumnasTabla): string => ele.fechaExpedicion,
        orden: 5,
      },
      {
        encabezado: 'Fecha vencimíento',
        clave: (ele: ColumnasTabla): string => ele.fechaVencimiento,
        orden: 6,
      },
    ];
    /**
 * @constant IDPROCEDIMIENTO
 * @description
 * Identificador numérico del procedimiento actual para el trámite 110204.
 * Se utiliza para configurar y asociar el proceso en los componentes y servicios relacionados.
 */
export const IDPROCEDIMIENTO = 110223;
  