import { AcuseTablaDatos, DomiciliosDePlantasTabla, MercanciasTabla, ProductorIndirectoTabla, SectoresTabla } from "../../models/90201/expansion-de-productores.model";
import { ConfiguracionColumna } from "../../models/shared/configuracion-columna.model";

/**
 * Arreglo de configuraciones de columnas para la tabla de domicilios de plantas.
 * 
 * Cada objeto en el arreglo representa una columna de la tabla, especificando:
 * - `encabezado`: El nombre que se mostrará en la cabecera de la columna.
 * - `clave`: Función que extrae el valor correspondiente del objeto `DomiciliosDePlantasTabla` para mostrar en la columna.
 * - `orden`: El orden en el que aparecerá la columna en la tabla.
 * 
 * @type {ConfiguracionColumna<DomiciliosDePlantasTabla>[]}
 */ 
export const DOMICILIOS_PLANTAS: ConfiguracionColumna<DomiciliosDePlantasTabla>[] = [
    { encabezado: 'Calle', clave: (item: DomiciliosDePlantasTabla) => item.calle, orden: 1 },
    { encabezado: 'Número exterior', clave: (item: DomiciliosDePlantasTabla) => item.numExterior, orden: 2 },
    { encabezado: 'Número interior', clave: (item: DomiciliosDePlantasTabla) => item.numInterior, orden: 3 },
    { encabezado: 'Código postal', clave: (item: DomiciliosDePlantasTabla) => item.codigoPostal, orden: 4 },
    { encabezado: 'Colonia', clave: (item: DomiciliosDePlantasTabla) => item.colonia, orden: 5 },
    { encabezado: 'Municipio o alcaldía', clave: (item: DomiciliosDePlantasTabla) => item.municipioOAlcaldia, orden: 6 },
    { encabezado: 'Estado', clave: (item: DomiciliosDePlantasTabla) => item.estado, orden: 7 },
    { encabezado: 'País', clave: (item: DomiciliosDePlantasTabla) => item.pais, orden: 8 },
    { encabezado: 'Registro federal de contribuyentes', clave: (item: DomiciliosDePlantasTabla) => item.registroFederalDeContribuyentes, orden: 9 },
    { encabezado: 'Razón social', clave: (item: DomiciliosDePlantasTabla) => item.razonSocial, orden: 10 },
    { encabezado: 'Domicilio fiscal del solicitante', clave: (item: DomiciliosDePlantasTabla) => item.domicilioFiscalDelSolicitante, orden: 11 },
  ];


  /**
   * Arreglo de configuraciones de columnas para la tabla de Productor Indirecto.
   * Cada objeto define la configuración de una columna, incluyendo el encabezado,
   * la clave de acceso al valor y el orden de aparición.
   *
   * @type {ConfiguracionColumna<ProductorIndirectoTabla>[]}
   *
   * @property {string} encabezado - Nombre del encabezado de la columna.
   * @property {(item: ProductorIndirectoTabla) => any} clave - Función para obtener el valor de la columna a partir del objeto.
   * @property {number} orden - Orden en el que se muestra la columna.
   */
  export const PRODUCTOR_INDIRECTO: ConfiguracionColumna<ProductorIndirectoTabla>[] = [
    { encabezado: 'Registro federal de contribuyentes', clave: (item: ProductorIndirectoTabla) => item.registro, orden: 1 },
    {
      encabezado: 'Denominación o razón social',
      clave: (item: ProductorIndirectoTabla) => item.denominacion,
      orden: 2,
    },
    { encabezado: 'Correo electrónico', clave: (item: ProductorIndirectoTabla) => item.correo, orden: 3 },
  ];


  /**
   * Arreglo de configuración para las columnas de la tabla de sectores.
   * Cada objeto define una columna con su encabezado, la clave para extraer el valor del objeto `SectoresTabla`
   * y el orden en el que debe aparecer la columna.
   *
   * @type {ConfiguracionColumna<SectoresTabla>[]}
   *
   * @property {string} encabezado - Texto que se muestra como encabezado de la columna.
   * @property {(item: SectoresTabla) => any} clave - Función que retorna el valor a mostrar en la columna a partir del objeto `SectoresTabla`.
   * @property {number} orden - Posición en la que se muestra la columna en la tabla.
   */
   export const SECTORES_TABLA: ConfiguracionColumna<SectoresTabla>[] = [
    {
      encabezado: 'Lista de sectores',
      clave: (item: SectoresTabla) => item.sectores,
      orden: 1,
    },
    {
      encabezado: 'Clave del sector',
      clave: (item: SectoresTabla) => item.claveDel,
      orden: 2,
    },
  ];

  /**
   * Arreglo de configuración para las columnas de la tabla de mercancías.
   * Cada objeto define una columna con su encabezado, la clave para extraer el valor
   * del objeto `MercanciasTabla` y el orden en el que debe aparecer la columna.
   */
    export const FRACCION_TABLA: ConfiguracionColumna<MercanciasTabla>[] = [
    {
      encabezado: 'Fracción arancelaria',
      clave: (item: MercanciasTabla) => item.fraccion,
      orden: 1,
    },
    {
      encabezado: 'Clave del sector',
      clave: (item: MercanciasTabla) => item.claveDel,
      orden: 2,
    },
  ];

  /**
   * Configuración de las columnas para la tabla de datos de acuse.
   * 
   * Cada objeto en el arreglo representa una columna en la tabla, especificando:
   * - `encabezado`: El texto que se mostrará como encabezado de la columna.
   * - `clave`: Una función que recibe un elemento de tipo `AcuseTablaDatos` y retorna el valor a mostrar en la columna.
   * - `orden`: El orden en el que aparecerá la columna en la tabla.
   * 
   * @type {ConfiguracionColumna<AcuseTablaDatos>[]}
   */
  export const ACUSE_DATOS: ConfiguracionColumna<AcuseTablaDatos>[] = [
    { encabezado: 'no', clave: (item: AcuseTablaDatos) => item.no, orden: 1 },
    { encabezado: 'documento', clave: (item: AcuseTablaDatos) => item.documento, orden: 2 },
    { encabezado: 'descargar', clave: (item: AcuseTablaDatos) => item.descargar, orden: 3 },
  ];
