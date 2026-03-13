import { EmpresaProductora, Importador } from "../models/acuicola.module";
import { ConfiguracionColumna } from "@libs/shared/data-access-user/src";

/**
 * Estos pasos guían al usuario a través del proceso de captura de solicitud, anexado de requisitos y firma de la solicitud.
 * @description 
 * Pasos del proceso en el módulo acuícola.
 * @author Equipo de desarrollo
 * @since 2024
 */
export const PASOS = [
  {
      indice: 1,
      titulo: 'Capturar solicitud',
      activo: true,
      completado: true,
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
  },
];


/**
 * Incluye instrucciones, advertencias y mensajes de ayuda para el usuario durante el proceso de captura y anexado de documentos.
 * @description 
 * Textos utilizados en la interfaz del módulo acuícola.
 * @author Equipo de desarrollo
 * @since 2024
 */
export const TEXTOS = {
  INSTRUCCIONES: `<h6>Instrucciones</h6>
  <p>- De acuerdo al caso particular, algunos documentos podrían ser obligatorios</p>
  <p>- En caso de que no requieras algún documento, seleccionalo y elíminalo</p>
  <p>- Si necesitas anexar más de un documento del mismo tipo selecciónalo de la lista.</p>`,
  ADJUNTAR: `<p>Si deseas adjuntar un nuevo documento, selecciona la opción --Adjuntar nuevo documento-- y presiona el botón "Adjuntar dcumentos"</p>`,
  ADJUNTAR_DOCUMENTOS: `<p>Para poder adjuntar tu documento, deberá cumplir las signuientes características:</p>
  <p><b>•</b> Debe ser formato PDF que no contenga formularios, objetos OLE incrustrados, código java script, etc.</p>
  <p><b>•</b> No debe contener páginas en blanco.</p>`,
  ADJUNTAR_WARNING: `<p>La carga del documento puede tardar varios segundos, este tiempo dependerá del tamaño de tu archivo y de la velocidad de tu conexión.</p>`,
  DECLARACION_DE_RESPONSABILIDAD_SOLIDARIA: `*? En mi calidad de Residente en Territorio Nacional, manifiesto mi voluntad y disposición de asumir la responsabilidad solidaria a que se refiere la fracción VIII del artículo 26 del Código Fiscal de la Federación, por los créditos fiscales que lleguen a derivarse por no retornar las Mercancías a que el presente aviso se refiere, al extranjero dentro del plazo establecido en la Ley"`,
  TERCEROS_ALERTA: `<p style="text-align: center;">Las tablas con asterisco son obligatorias y debes agregar por lo menos un registro.</p>`
};

/**
 * Este mensaje se muestra al usuario para informarle que al dar doble clic en un registro, se creará una nueva solicitud con los mismos datos de la solicitud elegida.
 * @description 
 * Constantes con el mensaje para el doble clic en un registro.
 * @author Equipo de desarrollo
 */
export const MENSAJE_DOBLE_CLIC = `<p>Al dar doble clic en el registro seleccionado creará una nueva solicitud con los mismos datos de la solicitud elegida.</p>`;

/**
 * Opciones de botón de radio para seleccionar el tipo de persona.
 * @description 
 * Define las opciones de botón de radio para el tipo de persona (física o moral).
 */
export const OPCIONES_DE_BOTON_DE_RADIO = [
    {
        label: 'Física',
        value: 'fisica',
    },
    {
        label: 'Moral',
        value: 'moral',
    }
];

/**
 * Configuración de la tabla para mostrar los datos de la empresa productora.
 * @description Configuración de las columnas de la tabla.
 */
export const EMPRESA_PRODUCTORA_CONFIGURACION_TABLA: ConfiguracionColumna<EmpresaProductora>[] = [
  { encabezado: "Nombre/denominación o razón social", clave: (item: EmpresaProductora) => item.nombre, orden: 1, },
  { encabezado: "Teléfono", clave: (item: EmpresaProductora) => item.telefono, orden: 2, },
  { encabezado: "Correo electrónico", clave: (item: EmpresaProductora) => item.correoElectronico, orden: 3, },
  { encabezado: "Número de certificado", clave: (item: EmpresaProductora) => item.numeroCertificado, orden: 4, },
  { encabezado: "Domicilio", clave: (item: EmpresaProductora) => item.domicilio, orden: 5, },
  { encabezado: "País", clave: (item: EmpresaProductora) => item.pais, orden: 6, }
];

/**
 * Configuración de la tabla para mostrar los datos del importador.
 * @description Configuración de las columnas de la tabla.
 */
export const IMPORTADOR_CONFIGURACION_TABLA: ConfiguracionColumna<Importador>[] = [
  { encabezado: "Nombre/denominación o razón social", clave: (item: Importador) => item.nombre, orden: 1, },
  { encabezado: "Teléfono", clave: (item: Importador) => item.telefono, orden: 2, },
  { encabezado: "Correo electrónico", clave: (item: Importador) => item.correoElectronico, orden: 3, },
  { encabezado: "Domicilio", clave: (item: Importador) => item.domicilio, orden: 4, },
  { encabezado: "País", clave: (item: Importador) => item.pais, orden: 5, }
];