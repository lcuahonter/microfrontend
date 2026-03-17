import { ConfiguracionColumna } from '@libs/shared/data-access-user/src';

/**
 * Interfaz que define la estructura de un elemento de configuración para la tabla de terceros.
 * Representa los datos asociados a un destinatario, como país, ciudad, entidad federativa, domicilio y código postal.

 * @pais País del destinatario.
 * @ciudad Ciudad del destinatario.
 * @entidadFederativa Entidad federativa del destinatario.
 * @domicilio Domicilio del destinatario.
 * @codigoPostal Código postal o equivalente del destinatario.
 */

export interface DestinatarioConfiguracionItem {
  id_direccion?: (number | string),
  cve_entidad_federativa?: string,
  cve_entidad?: string,
  nombre_entidad?: string,
  domicilio?: string,
  codigo_postal?: string,
  cve_pais?: string,
  pais?: string,
  ciudad?: string,
  es_nuevo?: boolean,
  desc_ubicacion?: string,
  nombre_pais?: string,
  informacion_extra?: string
}

/**
 * Configuración de las columnas para la tabla de terceros.
 * Define cómo se mostrarán los datos de los destinatarios en la tabla, incluyendo encabezados, claves y orden.

 * @encabezado Encabezado de la columna para el país.
 * @clave Clave que define cómo obtener el valor del país de un elemento.
 * @orden Orden de la columna en la tabla.
 */
export const DESTINATARIO_TABLA_CONFIGURACION: ConfiguracionColumna<DestinatarioConfiguracionItem>[] = [
  {
    encabezado: 'País',
    clave: (item: DestinatarioConfiguracionItem) => item.pais,
    orden: 1,
  },
  {
    encabezado: 'Ciudad',
    clave: (item: DestinatarioConfiguracionItem) => item.ciudad,
    orden: 2,
  },
  {
    encabezado: 'Entidad Federativa',
    clave: (item: DestinatarioConfiguracionItem) => item.cve_entidad_federativa,
    orden: 3,
  },
  {
    encabezado: 'Domicilio',
    clave: (item: DestinatarioConfiguracionItem) => item.domicilio,
    orden: 4,
  },
  {
    encabezado: 'Código postal o equivalente',
    clave: (item: DestinatarioConfiguracionItem) => item.codigo_postal,
    orden: 5,
  },
];
