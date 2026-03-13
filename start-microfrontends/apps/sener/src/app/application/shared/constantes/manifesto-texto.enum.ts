/**
 * @constant
 * @name MANIFIESTO_ACEPTACION_HTML
 * @description
 * Contiene los textos en formato HTML que describen las condiciones de aceptación para las notificaciones relacionadas con el trámite.
 * Estos textos son utilizados para mostrar información detallada en la interfaz de usuario.
 * 
 * @type {object}
 * @property {string} Texto1 - Texto que describe las condiciones de aceptación relacionadas con las notificaciones en la VUCEM.
 * @property {string} Texto2 - Texto que detalla las disposiciones legales aplicables al trámite.
 * 
 * @example
 * console.log(MANIFIESTO_ACEPTACION_HTML.Texto1);
 * // Output: "He leído y acepto expresamente que las notificaciones derivadas del requerimiento..."
 */
export const MANIFIESTO_ACEPTACION_HTML = {
    Texto1: `"He leído y acepto expresamente que las notificaciones derivadas del requerimiento de información que en su caso realice la autoridad para el presente trámite de permiso previo, surtirán efecto a partir del momento en que se publique en la VUCEM dicho requerimiento y se envíe al correo electrónico que registré en la Ventanilla para la disponibilidad de la notificación, por lo que manifiesto, bajo protesta de decir verdad, que soy responsable de revisar continuamente los requerimientos y notificaciones que me realice la SENER a través de la VUCEM."`,
    Texto2: `Lo anterior de conformidad con los artículos 1, 3, fracciones VI, IX, 4 del Acuerdo por el que se establece la clasificación y codificación de Hidrocarburos y Petrolíferos cuya importación y exportación está sujeta a Permiso Previo por parte de la Secretaría de Energía; 35, fracción II, y 69-C, de la Ley Federal de Procedimiento Administrativo de aplicación supletoria al citado Acuerdo; así como al Acuerdo por el que se modifican los plazos de respuesta de diversos trámites inscritos en el Registro Federal de Trámites y Servicios, que corresponde aplicar a la Secretaría de Energía.`
};

/**
 * @constant
 * @name MANIFIESTO_ACEPTACION_TEXTO
 * @description
 * Contiene los textos en formato plano que describen las condiciones de aceptación para las notificaciones relacionadas con el trámite.
 * Estos textos son utilizados para propósitos legales y de comunicación oficial.
 * 
 * @type {object}
 * @property {string} Texto1 - Texto que describe las condiciones de aceptación relacionadas con las notificaciones en la VUCEM y correos electrónicos oficiales.
 * @property {string} Texto2 - Texto que detalla el compromiso del solicitante de revisar continuamente las notificaciones y avisos.
 * 
 * @example
 * console.log(MANIFIESTO_ACEPTACION_TEXTO.Texto1);
 * // Output: "Acepto expresamente que todas las notificaciones relacionadas con la presente solicitud..."
 */
export const MANIFIESTO_ACEPTACION_TEXTO = {
    Texto1: `"Acepto expresamente que todas las notificaciones relacionadas con la presente solicitud y/o el permiso que, en su caso, deriven de la misma, se realizarán a través del correo electrónico registrado en la Ventanilla Digital Mexicana de Comercio Exterior (VUCEM) en relación con esta solicitud, y/o por medio de las cuentas de correo electrónico que señale como medios de comunicación oficial con la SENER en relación con este trámite; en el entendido de que dichas notificaciones, con independencia de lo establecido en cualquier otra regla, siempre surtirán sus efectos al día siguiente de que hayan sido cargadas en VUCEM y notificadas a través de los correos electrónicos antes señalados.`,
    Texto2: `Por lo que manifiesto, bajo protesta de decir verdad, que acepto que prevalezcan para esta solicitud y lo relacionado con la misma, las reglas de notificación descritas en el párrafo que antecede, y me comprometo a revisar continuamente los avisos que emita la VUCEM, así como las notificaciones recibidas en los correos electrónicos señalados como medios de comunicación oficial con la SENER, a fin de proceder con oportunidad conforme a derecho corresponda."`
};