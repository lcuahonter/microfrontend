/**
* Texto de alerta utilizado en el componente.
* @constant {string}
*/
export const TERCEROS_TEXTO_DE_ALERTA =
 'Las tablas con asterisco son obligatorias y debes agregar por lo menos un registro.'; // Define the constant

 /**
 * Lista de exportadores con sus datos de contacto y ubicación.
 * Contiene información relevante para identificar y comunicar con el exportador.
 */
export const EXPORTADOR_ITEM = [
    {
        /**
         * Nombre del exportador.
         */
        nombre: 'Miriam Lopez Solis',

        /**
         * Número de teléfono del exportador con código de país incluido.
         */
        telefono: '52-2298456543',

        /**
         * Dirección de correo electrónico del exportador.
         */
        correo: 'miriam@gmail.com',

        /**
         * Domicilio del exportador.
         */
        domicilio: 'este es un domicilio address',

        /**
         * País de origen del exportador.
         */
        pais: 'ANGOLA(REPUBLIC DE)',
    },
];

/**
 * Lista de destinatarios con sus datos de contacto y ubicación.
 * Contiene información detallada sobre la dirección y ubicación del destinatario.
 */
export const DESTINATARIO_ITEM = [
    {
        /**
         * Nombre del destinatario.
         */
        nombre: 'Miriam Lopez Solis',

        /**
         * Número de teléfono del destinatario con código de país incluido.
         */
        telefono: '52-2298456543',

        /**
         * Dirección de correo electrónico del destinatario.
         */
        correo: 'miriam@gmail.com',

        /**
         * Nombre de la calle donde se ubica el destinatario.
         */
        calle: '#10',

        /**
         * Número exterior del domicilio del destinatario.
         */
        exterior: 856,

        /**
         * Número interior del domicilio del destinatario.
         */
        interior: 1,

        /**
         * País de residencia del destinatario.
         * Nota: Hay un posible error en la escritura del nombre del país ("MEXICO(ESTAD UNIDOS MEXICANOS").
         */
        pais: 'MEXICO(ESTADOS UNIDOS MEXICANOS)',
        /**
         * Código de país del destinatario.
         */
        colonia:'CENTRO',
        /**
         * Municipio o alcaldía del destinatario.
         */
        municipio:'ALVARADO',
        /**
         * Entidad federativa del destinatario.
         */
        entidadFederativa: 'VERACRUZ',
        /**
         * Código postal del destinatario.
         */
        codigoPostal:'95270',
    },
];
