import { CatalogosSelect, ConfiguracionColumna } from "@libs/shared/data-access-user/src";
import { AccesosTabla } from "../models/tecnologicos.model";

/**
 * Configuración de columnas para la tabla de accesos.
 * Define las columnas que se mostrarán en la tabla de accesos,
 * incluyendo encabezados, claves y el orden de las columnas.
 */
export const HEADERS_ACCESOS_TABLA: ConfiguracionColumna<AccesosTabla>[] = [
    {
      encabezado: 'RFC',
      clave: (ele: AccesosTabla) => ele.rfc,
      orden: 1,
    },
    {
      encabezado: 'Sistema',
      clave: (ele: AccesosTabla) => ele.sistema,
      orden: 2,
    },
    {
      encabezado: 'Rol/Perfil',
      clave: (ele: AccesosTabla) => ele.rol,
      orden: 3,
    },
    {
      encabezado: 'Tipo Movimiento',
      clave: (ele: AccesosTabla) => ele.tipoMovimiento,
      orden: 4,
    },
    {
      encabezado: 'Aduana',
      clave: (ele: AccesosTabla) => ele.aduana,
      orden: 5,
    },
  ];

/**
 * Catálogo de opciones para "Aduana".
 * Define las opciones disponibles para el campo "Aduana".
 */
export const ADUANA_CATALOGO: CatalogosSelect = {
  labelNombre: 'Aduana',
  required: true,
  primerOpcion: 'Selecciona un valor',
  catalogos: [],
};

/**
 * Catálogo de opciones para "Sistema".
 * Define las opciones disponibles para el campo "Sistema".
 */
export const SISTEMA_CATALOGO: CatalogosSelect = {
  labelNombre: 'Sistema',
  required: true,
  primerOpcion: 'Selecciona un valor',
  catalogos: [],
};

/**
 * Catálogo de opciones para "Rol".
 * Define las opciones disponibles para el campo "Rol".
 */
export const ROL_CATALOGO: CatalogosSelect = {
  labelNombre: 'Rol',
  required: true,
  primerOpcion: 'Selecciona un valor',
  catalogos: [],
};

/**
 * Catálogo de opciones para "Tipo Movimiento".
 * Define las opciones disponibles para el campo "Tipo Movimiento".
 */
export const MOVIMIENTO_CATALOGO: CatalogosSelect = {
  labelNombre: 'Tipo Movimiento',
  required: true,
  primerOpcion: 'Selecciona un valor',
  catalogos: [],
};

/**
 * Contiene el texto HTML para mostrar un aviso de privacidad simplificado.
 * Este aviso informa al usuario sobre el tratamiento de datos personales por parte del 
   Servicio de  Administración Tributaria (SAT)
 * @constant
 * @type {string}
 */
export const ALERT_TEXTO = `<div>  
  <div style="text-align: center; margin-bottom: 10px;">
    <strong style="color: #007baf;">Aviso de privacidad simplificado</strong>
  </div>
  <p style="margin-top: 10px; text-align: justify;">
    El Servicio de Administración Tributaria (SAT), es el sujeto obligado y responsable del tratamiento de los datos personales que se recaban a través de la Ventanilla Digital Mexicana de Comercio Exterior (VUCEM), los datos personales podrán ser utilizados y transferidos a la autoridades competentes, con la finalidad de llevar a cabo cualquier trámite relacionado con importaciones, exportaciones y tránsito de mercancías de comercio exterior, incluyendo las regulaciones y restricciones no arancelarias que, conforme a la legislación aplicable, sea exigido por las autoridades competentes en materia de comercio exterior y/o consultar información sobre los procedimientos para la importación, exportación y tránsito de mercancías de comercio exterior, incluyendo las regulaciones y restricciones no arancelarias, así como las notificaciones que se deriven de dichos trámites y serán protegidos, incorporados y tratados en el sistema de datos personales de la VUCEM, asimismo podrán ser transmitidos a las autoridades competentes establecidas en el Decreto por el que se establece la Ventanilla Digital Mexicana de Comercio Exterior, publicado en el Diario Oficial de la Federación el 14 de enero de 2011, así como al propio titular de la información. El titular, en su caso, podrá manifestar su negativa para el tratamiento de sus datos personales para finalidades y transferencias de los mismos que requieran el consentimiento del titular. Si desea conocer nuestro aviso de privacidad integral, lo podrá consultar en el portal.
  </p>
  <p style="margin-top: 10px;text-align: center;">
    <a href="#" style="text-decoration: underline;">Aviso de privacidad integral</a>
  </p>
</div>
`;