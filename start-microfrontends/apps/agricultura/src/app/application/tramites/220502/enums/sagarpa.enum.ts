import { Destinatario, Exportador } from "../models/pago-de-derechos.model";
import { ConfiguracionColumna } from "@libs/shared/data-access-user/src";

/**
 * Matriz de opciones para botones de radio.
 *
 * Cada objeto representa una opción de botón de radio con:
 * - `label`: El texto mostrado a la usuaria.
 * - `value`: El valor correspondiente de la opción.
 */
export const OPCIONES_DE_BOTON_DE_RADIO = [
  {
    label: 'Sí',
    value: '1',
  },
  {
    label: 'No',
    value: '0',
  }
];

/** 
* Constante que define las opciones disponibles para el botón de radio. 
* Se utiliza para capturar la selección del usuario en el formulario.
* 
* - "Animales Vivos" tiene un valor de '1'.
* - "Productos Subproductos" tiene un valor de '0'.
*/
export const CAPTURA_OPCIONES_DE_BOTON_DE_RADIO = [
  {
    label: 'Animales Vivos',
    value: '1',
  },
  {
    label: 'Productos y Subproductos',
    value: '0',
  }
];

/**
* Configuración de columnas para la tabla de destinatarios.
*/
export const DESTINATARIO_CONFIGURACION_TABLA: ConfiguracionColumna<Destinatario>[] = [
  { encabezado: "Nombre/denominación o razón social", clave: (item: Destinatario) => item.nombre_razon_social, orden: 1, },
  { encabezado: "Teléfono", clave: (item: Destinatario) => item.telefono, orden: 2, },
  { encabezado: "Correo electrónico", clave: (item: Destinatario) => item.correo_electronico, orden: 3, },
  { encabezado: "Calle", clave: (item: Destinatario) => item.calle, orden: 4, },
  { encabezado: "Número exterior", clave: (item: Destinatario) => item.numero_exterior, orden: 5, },
  { encabezado: "Número interior", clave: (item: Destinatario) => item.numero_interior, orden: 6, },
  { encabezado: "País", clave: (item: Destinatario) => item.pais, orden: 7, },
  { encabezado: "Colonia", clave: (item: Destinatario) => item.colonia, orden: 8, },
  { encabezado: "Municipio o alcaldía", clave: (item: Destinatario) => item.municipio_alcaldia, orden: 9, },
  { encabezado: "Entidad federativa", clave: (item: Destinatario) => item.entidad_federativa, orden: 10, },
  { encabezado: "Código postal", clave: (item: Destinatario) => item.codigo_postal, orden: 11, }
];
/**
* Configuración de columnas para la tabla de exportador.
*/
export const EXPORTADOR_CONFIGURACION_TABLA: ConfiguracionColumna<Exportador>[] = [
  { encabezado: "Nombre/denominación o razón social", clave: (item: Exportador) => item.nombre_razon_social, orden: 1, },
  { encabezado: "Teléfono", clave: (item: Exportador) => item.telefono, orden: 2, },
  { encabezado: "Correo electrónico", clave: (item: Exportador) => item.correo_electronico, orden: 3, },
  { encabezado: "Domoicilio", clave: (item: Exportador) => item.domicilio, orden: 4, },
  { encabezado: "País", clave: (item: Exportador) => item.pais, orden: 5, },

];