/**
 * @description Genera el contenido HTML para las políticas de privacidad y manejo de datos personales de la Ventanilla Digital Mexicana de Comercio Exterior.
 * @param linkSeguro - URL segura para el enlace del INAI.
 * @returns {string} Contenido HTML con las políticas de privacidad.
 */
export const POLITICAS_PRIVACIDAD = (linkSeguro: string): string => {
  return `
    <h4>Ventanilla Digital Mexicana de Comercio Exterior</h4>

    <h4>Política de privacidad y manejo de datos personales</h4>

    <p>Le informamos que los datos personales suministrados a través de sus solicitudes, promociones, trámites, consultas y pagos, hechas por medios electrónicos e impresos serán protegidos, incorporados y tratados en el sistema de datos personales de la Ventanilla Digital, cuyo objeto es permitir a los agentes de comercio exterior realizar, a través de un solo punto de entrada electrónico, todos los trámites de importación, exportación y tránsito de mercancías, con fundamento en las disposiciones aplicables a cada uno de ellos, el cual fue registrado en el listado de sistemas de datos personales ante el Instituto Nacional de Transparencia, Acceso a la Información y Protección de Datos Personales <a class="link" href="${linkSeguro}" target="_blank" rel="noopener noreferrer">(www.inai.org.mx)</a> y podrán ser transmitidos a las autoridades competentes previstas en el Decreto por el que se establece la Ventanilla Digital Mexicana de Comercio Exterior publicado en el Diario Oficial de la Federación el 14 de enero de 2011, así como al propio titular de la información, además de las transmisiones previstas en los ordenamientos legales aplicables. Corresponde al Servicio de Administración Tributaria, una vez implementada, la administración de la citada Ventanilla Digital. Se podrá modificar o corregir sus datos personales a través de la misma Ventanilla.
    </p>
    
    <p> Lo anterior se informa en cumplimiento del Lineamiento Decimoséptimo de los Lineamientos de Protección de Datos Personales, publicados en el Diario Oficial de la Federación el 30 de septiembre de 2005.</p>
`;
};

/**
 * @description Enlace a la página del INAI (Instituto Nacional de Transparencia, Acceso a la Información y Protección de Datos Personales).
 */
export const INAI_LINK = 'https://www.inai.org.mx/';

/**
 * @description Nombre terminos
 */
export const TERMINOS = 'terminos';

/**
 * @desccription URL de las políticas de privacidad y manejo de datos personales.
 */
export const POLITICAS_PRIVACIDAD_URL = 'assets/pdf/ucm014810.pdf';