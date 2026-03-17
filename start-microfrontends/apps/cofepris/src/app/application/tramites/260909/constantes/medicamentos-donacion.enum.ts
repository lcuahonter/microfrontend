import { ConfiguracionColumna } from '@libs/shared/data-access-user/src';

import {
  MercanciasInfo,
  ScianModel,
} from '../models/datos-de-la-solicitud.model';

/**
 * `MODIFICACION_PERMISO_ENUM`
 * 
 * Esta constante representa los pasos del asistente (wizard) para el proceso de modificación de permisos sanitarios.
 * 
 * ### Estructura:
 * - Cada objeto dentro del array representa un paso del asistente y contiene las siguientes propiedades:
 *   - `indice`: Número del paso en el flujo del asistente.
 *   - `titulo`: Título descriptivo del paso.
 *   - `activo`: Indica si el paso está activo actualmente.
 *   - `completado`: Indica si el paso ha sido completado.
 * 
 * ### Propósito:
 * - Esta constante se utiliza para definir y gestionar los pasos del asistente en el flujo de modificación de permisos sanitarios.
 * - Permite controlar el estado de cada paso (activo o completado) y mostrar el título correspondiente en la interfaz de usuario.
 * 
 * ### Ejemplo de uso:
  * ```typescript
 */
export const MODIFICACION_PERMISO_ENUM = [
    {
        indice: 1,
        titulo: 'Capturar solicitud',
        activo: true,
        completado: false,
      },
      {
        indice: 2,
        titulo: 'Anexar requisitos',
        activo: false,
        completado: false,
      },
      {
        indice: 3,
        titulo: 'Firmar solicitud',
        activo: false,
        completado: false,
      }

]
/**
 * `MODIFICACION_PERMISO_DATA`
 * 
 * Esta constante contiene una descripción general del proceso de modificación del permiso sanitario.
 * 
 * ### Propósito:
 * - Proporcionar un texto descriptivo que explique el objetivo del trámite.
 * - Se utiliza para mostrar información general sobre el proceso en la interfaz de usuario.
 *  
 *  */
export const MODIFICACION_PERMISO_DATA='Modificación del permiso sanitario de importación de insumos para la salud de medicamentos destinados a donación'



/**
 * Configuración de columnas para la tabla de SCIAN.
 */
export const SCIAN_TABLE_CONFIG: ConfiguracionColumna<ScianModel>[] = [
  {
    encabezado: 'Clave S.C.I.A.N.',
    clave: (item: ScianModel) => item.claveScian,
    orden: 1,
  },
  {
    encabezado: 'Descripción del S.C.I.A.N.',
    clave: (item: ScianModel) => item.descripcionScian,
    orden: 2,
  },
];

/**
 * Configuración de datos para la tabla de mercancías.
 */
export const MERCANCIAS_DATA = [
  {
    encabezado: 'Clasificación del producto',
    clave: (ele: MercanciasInfo): string => ele.clasificacion,
    orden: 1,
  },
  {
    encabezado: 'Especificar clasificación del producto',
    clave: (ele: MercanciasInfo): string => ele.especificar,
    orden: 2,
  },
  {
    encabezado: 'Denominación específica del producto',
    clave: (ele: MercanciasInfo): string => ele.denominacionEspecifica,
    orden: 3,
  },
  {
    encabezado: 'Denominación distintiva',
    clave: (ele: MercanciasInfo):string => ele.denominacionDistintiva,
    orden: 4,
  },
  {
    encabezado: 'Denominación común, nombre común o nombre científico',
    clave: (ele: MercanciasInfo): string => ele.denominacionComun,
    orden: 5,
  },
  {
    encabezado: 'Forma farmacéutica',
    clave: (ele: MercanciasInfo): string => ele.formaFarmaceutica,
    orden: 6,
  },
  {
    encabezado: 'Estado físico',
    clave: (ele: MercanciasInfo): string => ele.estadoFisico,
    orden: 7,
  },
  {
    encabezado: 'Fracción arancelaria',
    clave: (ele: MercanciasInfo): string => ele.fraccionArancelaria,
    orden: 8,
  },
  {
    encabezado: 'Descripción de la fracción',
    clave: (ele: MercanciasInfo): string => ele.descripcionFraccion,
    orden: 9,
  },
  {
    encabezado: 'Unidad de medida de comercialización (UMC)',
    clave: (ele: MercanciasInfo): string => ele.unidad,
    orden: 10,
  },
  {
    encabezado: 'Cantidad UMC',
    clave: (ele: MercanciasInfo): string => ele.cantidadUMC,
    orden: 11,
  },
  {
    encabezado: 'Unidad de medida de tarifa (UMT)',
    clave: (ele: MercanciasInfo): string => ele.unidadUMT,
    orden: 12,
  },
  {
    encabezado: 'Cantidad UMT',
    clave: (ele: MercanciasInfo): string => ele.cantidadUMT,
    orden: 13,
  },
  {
    encabezado: 'Presentación',
    clave: (ele: MercanciasInfo): string => ele.presentacion,
    orden: 14,
  },
  {
    encabezado: 'Número de registro sanitario',
    clave: (ele: MercanciasInfo): string => ele.numeroRegistro,
    orden: 15,
  },
  {
    encabezado: 'País de orígen',
    clave: (ele: MercanciasInfo): string => ele.paisDeOrigen,
    orden: 16,
  },
  {
    encabezado: 'País de procedencia',
    clave: (ele: MercanciasInfo): string => ele.paisDeProcedencia,
    orden: 17,
  },
  {
    encabezado: 'Tipo producto',
    clave: (ele: MercanciasInfo): string => ele.tipoProducto,
    orden: 18,
  },
  {
    encabezado: 'Uso específico',
    clave: (ele: MercanciasInfo): string => ele.usoEspecifico,
    orden: 19,
  },
];
/**
 * Configuración para la fecha de pago.
 */
export const FECHA_DE_PAGO = {
  labelNombre: 'Fecha de caducidad',
  required: false,
  habilitado: true,
};

/**
 * Lista de países disponibles para la selección en el formulario.
 * Cada elemento de la lista representa el nombre oficial de un país o territorio.
 */
export const CROSLISTA_DE_PAISES: string[] = [
  "AFGANISTÁN (EMIRATO ISLÁMICO)",
  "ALBANIA (REPÚBLICA DE)",
  "ALEMANIA (REPÚBLICA FEDERAL DE)",
  "ANDORRA (PRINCIPADO DE)",
  "ANGOLA (REPÚBLICA DE)",
  "ANGUILLA",
  "ANTIGUA Y BARBUDA",
  "ARABIA SAUDITA (COMUNIDAD ECONÓMICA EUROPEA)",
  "ARGELIA (REPÚBLICA DEMOCRÁTICA Y POPULAR DE)",
  "ARGENTINA (REPÚBLICA)",
  "AUSTRALIA (COMMONWEALTH OF)",
  "AUSTRIA (REPUBLIC OF)",
  "BAHAMAS (COMMONWEALTH OF THE)",
  "BAHRAIN (KINGDOM OF)",
  "BANGLADESH (PEOPLE'S REPUBLIC OF)",
  "BARBADOS",
  "BELGIUM (KINGDOM OF)",
  "BELIZE",
  "BENIN (REPUBLIC OF)",
  "BHUTAN (KINGDOM OF)"
];
/**
 * Textos utilizados en la aplicación.
 */
export const TEXTOS = {
  ALERTA: `¡Precaución! Debes capturar localidad y colonia`,
  /**
   * Texto para la solicitud.
   */
  TEXTOS_SOLICITUD: 'Al dar doble-clic en una Solicitud, se copiarán sus datos en esta Solicitud.',

  /**
   * Texto para la leyenda de confirmación de la sección.
   */
  SECCION_LEYENDA_CONFIRMAR_TEXTOS: 'Debes declarar la cantidad que ingresa en parcialidad por cada fracción arancelaria. La columna "Saldo pendiente" mostrará el saldo disponible para las siguientes parcialidades.'
}


