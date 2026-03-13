import { ConfiguracionColumna } from "@libs/shared/data-access-user/src";
import { DatosDeLaTabla } from "../models/datos-tramite.model";

/**
 * Enumeración `Solicitud32101Enum` que contiene manifiestos relacionados con 
 * declaraciones y requisitos para la importación temporal de activo fijo y 
 * cumplimiento de obligaciones en el Esquema de Certificación de Empresas.
 */
export enum Solicitud32101Enum {
    
    MANIFIESTO_1 = 'Bajo protesta de decir verdad, manifiesto que los datos asentados en el presente documento son ciertos y que las facultades que me fueron otorgados para representar a la solicitante no me han sido modificadas y/o revocadas. Asimismo, se cuenta con la infraestructura necesaria y los controles necesarios para llevar a cabo el proceso productivo y/o prestación de servicio declarado.',
  
    MANIFIESTO_2 = 'Que las circunstancias por la cual se me otorgó el registro para la importación temporal de activo fijo, no han variado y se continúan cumpliendo con los requisitos y obligaciones inherentes a la misma.',
    
    MANIFIESTO_3 = 'Manifieste si sus socios o accionistas, e integrantes de la administración, no se encuentren vinculados con alguna empresa a la que se hubiere cancelado su Registro en el Esquema de Certificación de Empresas, de conformidad con las fracciones V, VI y VII del apartado A; II y III del apartado B de la regla 7.2.4.; y/o VI, VII y XI de la regla 7.2.5',
  }

/**
 * Constante que define la configuración de las columnas para una tabla de datos.
 * Cada objeto en el arreglo representa una columna con su encabezado, clave de acceso y orden.
 * 
 * @type {ConfiguracionColumna<DatosDeLaTabla>[]}
 * 
 * @property {string} encabezado - El texto que se mostrará como encabezado de la columna.
 * @property {(artículo: DatosDeLaTabla) => any} clave - Una función que define cómo acceder al valor de la columna desde un objeto de datos.
 * @property {number} orden - El orden en el que se mostrará la columna en la tabla.
 * 
 * Columnas definidas:
 * - **Tipo de inversión**: Representa el tipo de inversión del artículo.
 * - **Descripción general**: Proporciona una descripción general del artículo.
 * - **Valor en pesos**: Muestra el valor del artículo en pesos.
 * - **Forma Adquisicion**: Indica la forma en que se adquirió el artículo.
 * - **Comprobante de pago**: Muestra el comprobante de pago asociado al artículo.
 */
export const ENCABEZADO_TABLA_DATOS: ConfiguracionColumna<DatosDeLaTabla>[] = [
  {
    encabezado: 'Tipo de inversión',
    clave: (artículo) => artículo.tipoDeInversion,
    orden: 1,
  },
  {
    encabezado: 'Descripción general',
    clave: (artículo) => artículo.descripcionGeneral,
    orden: 2,
  },
  {
    encabezado: 'Valor en pesos',
    clave: (artículo) => artículo.valorEnPesos,
    orden: 3,
  },
  {
    encabezado: 'Forma Adquisicion',
    clave: (artículo) => artículo.formaAdquisicion,
    orden: 4,
  },
  {
    encabezado: 'Comprobante',
    clave: (artículo) => artículo.comprobante,
    orden: 5,
  },
];
  