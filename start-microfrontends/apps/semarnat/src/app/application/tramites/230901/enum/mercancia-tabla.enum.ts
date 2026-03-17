/**
  * Interfaz que define la estructura de un elemento de configuración para la tabla de mercancías.
   * 
   * @id Identificador único de la mercancía.
   * @fraccionArancelaria  Fracción arancelaria de la mercancía.
   * @fraccionDescripcion Descripción adicional de la fracción arancelaria de la mercancía.
   * @otraFraccion  Indica si la mercancía pertenece a otra fracción.
   * @descripcion  Descripción de la mercancía.
   * @clasificacionTaxonomica Clasificación taxonómica de la mercancía.
   * @clasificacionTaxonomicaDesc Descripcion Clasificación taxonómica de la mercancía.
   * @rendimientoProducto Rendimiento del producto.
   * @nombreCientifico Nombre científico de la mercancía.
   * @nombreComun Nombre común de la mercancía.
   * @nombreComunDesc Descripcion Nombre común de la mercancía.
   * @marca Marca o marcaje de la mercancía.
   * @cantidad Cantidad de la mercancía.
   * @unidadMedida Unidad de medida de la mercancía.
   * @unidad_medida_comercial Descripcion Unidad de medida de la mercancía.
   * @paisOrigen País de origen de la mercancía.
   * @pais_origen Descripcion País de origen de la mercancía.
   * @paisProcedencia País de procedencia de la mercancía.
   * @pais_procedencia Descripcion País de procedencia de la mercancía.
 */
export interface MercanciaConfiguracionItem {
  id?: number,
  id_mercancia?: number,
  cve_fraccion_arancelaria: string,
  descripcion?: string,
  otraFraccion?: boolean,
  descripcion_mercancia: string,
  clasificacionTaxonomica?: string,
  rendimiento_producto: string,
  cve_nombre_cientifico: string,
  nombre_cientifico: string,
  cve_nombre_comun: string,
  nombre_comun: string,
  marca_marcaje: string,
  cantidad: string,
  cve_unidad_medida_comercial: string,
  unidad_medida_comercial: string,
  cve_pais_origen?: string,
  pais_origen: string,
  cve_pais_procedencia?: string,
  pais_procedencia: string,
  clave_fraccion_arancelaria: string,
  id_fraccion_gubernamental?: (number | string),
  nombre_comun_especifique: string
}

export interface FraccionArancelaria {
  cve_fraccion: string;
  capitulo: string;
  partida: string;
  sub_partida: string;
  descripcion: string;
  fecha_captura: string;
  fecha_inicio_vigencia: string;
  fecha_fin_vigencia: null,
  cve_usuario: string;
  cve_capitulo_fraccion: string;
  cve_partida_fraccion: string;
  cve_sub_partida_fraccion: string;
  activo: boolean;
  activo_anexo28: boolean;
  decreto_immex: boolean;
}

export interface Mercancias {
  cve_fraccion_arancelaria: string,
  id_fraccion_gubernamental?: (number | string),
  descripcion_mercancia: string,
  rendimiento_producto: string,
  cve_clasificacion_taxonomica?: string,
  cve_nombre_cientifico: string,
  nombre_cientifico: string,
  cve_nombre_comun: string,
  nombre_comun: string,
  nombre_comun_especifique: string,
  marca_marcaje: string,
  cantidad: (number | string),
  cve_unidad_medida_comercial: string,
  cve_pais_origen: string,
  cve_pais_procedencia: string,
  clave_fraccion_arancelaria: string
}

/**
 * Configuración de las columnas para la tabla de mercancías.
 * 
 * @encabezado Encabezado de la columna para la fracción arancelaria.
 * @clave Clave que define cómo obtener el valor de la fracción arancelaria de un elemento.
 * @orden Orden de la columna en la tabla.
 */
export const MERCANCIA_TABLA_CONFIGURACION = [
  {
    encabezado: 'Fracción arancelaria',
    clave: (item: MercanciaConfiguracionItem): string => item.cve_fraccion_arancelaria,
    orden: 1,
  },
  {
    encabezado: 'Otra fracción',
    clave: (item: MercanciaConfiguracionItem): string => item.clave_fraccion_arancelaria,
    orden: 2,
  },
  {
    encabezado: 'Descripción',
    clave: (item: MercanciaConfiguracionItem): string => item.descripcion_mercancia,
    orden: 3,
  },
  {
    encabezado: 'Rendimiento del producto',
    clave: (item: MercanciaConfiguracionItem): string => item.rendimiento_producto,
    orden: 4,
  },
  /*{
    encabezado: 'Clasificación taxonómica',
    clave: (item: MercanciaConfiguracionItem): string => item.clasificacionTaxonomicaDesc,
    orden: 5,
  },*/
  {
    encabezado: 'Nombre científico',
    clave: (item: MercanciaConfiguracionItem): string => item.nombre_cientifico,
    orden: 6,
  },
  {
    encabezado: 'Nombre común',
    clave: (item: MercanciaConfiguracionItem): string => item.nombre_comun,
    orden: 7,
  },
  {
    encabezado: 'Marca (marcaje)',
    clave: (item: MercanciaConfiguracionItem): string => item.marca_marcaje,
    orden: 8,
  },
  {
    encabezado: 'Cantidad',
    clave: (item: MercanciaConfiguracionItem): string => item.cantidad,
    orden: 9,
  },
  {
    encabezado: 'Unidad de medida',
    clave: (item: MercanciaConfiguracionItem): string => item.unidad_medida_comercial,
    orden: 10,
  },
  {
    encabezado: 'País de orígen',
    clave: (item: MercanciaConfiguracionItem): string => item.pais_origen,
    orden: 11,
  },
  {
    encabezado: 'País de procedencia',
    clave: (item: MercanciaConfiguracionItem): string => item.pais_procedencia,
    orden: 12,
  },
];