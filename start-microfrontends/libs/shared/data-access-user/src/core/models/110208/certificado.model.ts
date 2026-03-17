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
    fecha_vencimi:string
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
        
        encabezado: 'Fecha vencimi',
        clave: (ele: NicoInfo) => ele.fecha_vencimi,
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
    complemento:string;
    fecha:string;
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
     {
        
        encabezado: 'Complemento descripción',
        clave: (ele: MercanciasInfo) => ele.complemento,
        orden: 7,
    },
     {
        
        encabezado: 'Fecha factura',
        clave: (ele: MercanciasInfo) => ele.fecha,
        orden: 7,
    },
];

export interface RespuestaTabla {
    /**
     * Código de respuesta.
     */
    code: number;
    /**
     * Datos de la tabla NICO.
     */
    data: MercanciasInfo[];
    /**
     * Mensaje de la respuesta.
     */
    message: string;
}


/**
 * Interfaz que representa la información del formulario de mercancías.
 */
export interface MercanciasFormInfo {
    /**
     * Fracción arancelaria de la mercancía.
     */
    fraccionArancelaria: string;
  
    /**
     * Nombre comercial de la mercancía.
     */
    nombreComercial: string;
  
    /**
     * Nombre técnico de la mercancía.
     */
    nombreTecnio: string;
  
    /**
     * Nombre en inglés de la mercancía.
     */
    nombreEnIngles: string;
  
    /**
     * Criterio para la mercancía.
     */
    criterioPara: string;
  
    /**
     * Marca de la mercancía.
     */
    marca: string;
  
    /**
     * Unidad de medida comercial (UMC) de la mercancía.
     */
    umc: string;
  
    /**
     * Cantidad de la mercancía.
     */
    cantidad: string;
  
    /**
     * Valor de la mercancía.
     */
    valorDeLa: string;
  
    /**
     * Descripción complementaria de la mercancía.
     */
    complementoDescripcion: string;
  
    /**
     * Número de factura asociado a la mercancía.
     */
    nFactura: string;

    /**
     * Tipo de factura de la mercancía.
     */
    tipoDeFactura?: string;

    /**
     * Fecha de la factura de la mercancía.
     */
    fechaDeFactura?: string;
    
}

/**
 * Interfaz que representa la respuesta de los datos.
 */
export interface RespuestaDatos {
    /**
     * Código de respuesta.
     */
    code: number;
    /**
     * Datos de la tabla NICO.
     */
    data: MercanciasFormInfo[];
    /**
     * Mensaje de la respuesta.
     */
    message: string;
}


/**
 * Interfaz que representa la respuesta de la tabla de certificado.
 */
export interface RespuestaTablaCertificado {
    /**
     * Código de respuesta.
     */
    code: number;
    /**
     * Datos de la tabla NICO.
     */
    data: NicoInfo[];
    /**
     * Mensaje de la respuesta.
     */
    message: string;
  }
   