import { ConfiguracionColumna } from "@libs/shared/data-access-user/src";
 
export interface TereceorsConfiguracionItem {
  pais: string;
  ciudad: string;
  entidadFederativa: string;
  domicilio: string;
  codigoPostal: number;
}
 
 
export const TERCEROS_CONFIGURACION_TABLA: ConfiguracionColumna<TereceorsConfiguracionItem>[] = [
    {
      encabezado: 'País',
      clave: (item: TereceorsConfiguracionItem) => item.pais,
      orden: 1,
    },
    {
      encabezado: 'Ciudad',
      clave: (item: TereceorsConfiguracionItem) => item.ciudad,
      orden: 2,
    },
    {
      encabezado: 'Entidad Federativa',
      clave: (item: TereceorsConfiguracionItem) => item.entidadFederativa,
      orden: 3,
    },
    {
      encabezado: 'Domicilio',
      clave: (item: TereceorsConfiguracionItem) => item.domicilio,
      orden: 4,
    },
    {
      encabezado: 'Código postal o equivalente',
      clave: (item: TereceorsConfiguracionItem) => item.codigoPostal,
      orden: 5,
    }
  ];
 
  export const DESTINARIO_TABLE_ENTRY= {
    pais: 'MEXICO (ESTADOS UNIDOS MEXICANOS)',
    ciudad: '---',
    entidadFederativa: 'MORELOS',
    domicilio: 'prueba',
    codigoPostal: 96533,
  }

/**
 * @interface CatalogoPais
 * @description
 * Interface que define la estructura de los datos de un país en el catálogo.
 * Se utiliza para mapear la información de países desde los servicios de catálogos.
 */
export interface CatalogoPais {
  /**
   * @property {number} id
   * @description
   * Identificador único del país en el catálogo.
   */
  id: number;
  
  /**
   * @property {string} descripcion
   * @description
   * Nombre o descripción del país.
   */
  descripcion: string;
}

/**
 * @interface CatalogoEstado
 * @description
 * Interface que define la estructura de los datos de un estado o entidad federativa en el catálogo.
 * Se utiliza para mapear la información de estados desde los servicios de catálogos.
 */
export interface CatalogoEstado {
  /**
   * @property {number} id
   * @description
   * Identificador único del estado o entidad federativa en el catálogo.
   */
  id: number;
  
  /**
   * @property {string} descripcion
   * @description
   * Nombre o descripción del estado o entidad federativa.
   */
  descripcion: string;
}