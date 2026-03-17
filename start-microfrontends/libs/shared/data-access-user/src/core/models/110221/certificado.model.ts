/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Interfaz que define la estructura de la información NICO.
 * 
 * Esta interfaz se utiliza para modelar la información de las claves y descripciones
 * del Sistema de Clasificación Industrial de América del Norte (S.C.I.A.N.).
 */
export interface NicoInfo {
    fraccion_arancelaria: string;
    nombre_tecnico: string;
    nombre_comercial: string;
    numero:string;
    fecha_expedicion:string;
    fecha_vencimiento:string
}
   
  /**
   * Configuración de la tabla para la visualización de datos NICO.
   * 
   * Esta constante define las columnas y el orden en que se mostrarán los datos.
   */
export const NICO_TABLA = [
    {
      encabezado: 'Fracción arancelaria',
      clave: (ele: NicoInfo) => ele.fraccion_arancelaria,
      orden: 1,
    },
    {
      encabezado: 'Nombre técnico',
      clave: (ele: NicoInfo) => ele.nombre_tecnico,
      orden: 2,
    },
    {
        
        encabezado: 'Nombre comercial',
        clave: (ele: NicoInfo) => ele.nombre_comercial,
        orden: 3,
    },
    {
        
        encabezado: 'Número de registro de productos',
        clave: (ele: NicoInfo) => ele.numero,
        orden: 4,
    },
    {
        
        encabezado: 'Fecha expedición',
        clave: (ele: NicoInfo) => ele.fecha_expedicion,
        orden: 5,
    },
    {
        
        encabezado: 'Fecha vencimíento',
        clave: (ele: NicoInfo) => ele.fecha_vencimiento,
        orden: 6,
    },
];

export interface MercanciasInfo {
    fraccion_arancelaria: string;
    cantidad: string;
    unidad_de_medida: string;
    valor_mercancia:string;
    tipo_de_factura:string;
    numero:string;
}

export const MERCANCIA_TABLA = [
    {
      encabezado: 'Fracción arancelaria',
      clave: (ele: MercanciasInfo) => ele.fraccion_arancelaria,
      orden: 1,
    },
    {
      encabezado: 'Cantidad',
      clave: (ele: MercanciasInfo) => ele.cantidad,
      orden: 2,
    },
    {
        
        encabezado: 'Unidad de medida',
        clave: (ele: MercanciasInfo) => ele.unidad_de_medida,
        orden: 3,
    },
    {
        
        encabezado: 'Valor mercancía',
        clave: (ele: MercanciasInfo) => ele.valor_mercancia,
        orden: 4,
    },
    {
        
        encabezado: 'Tipo de factura',
        clave: (ele: MercanciasInfo) => ele.tipo_de_factura,
        orden: 5,
    },
    {
        
        encabezado: 'Número',
        clave: (ele: MercanciasInfo) => ele.numero,
        orden: 6,
    },
];
   