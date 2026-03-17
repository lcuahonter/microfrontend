/**
 * Cada objeto representa un paso del wizard, indicando su índice, título, si está activo y si está completado.
 * @const PASOS
 * @description
 * Pasos del proceso para la destrucción o donación de mercancías en el trámite 32509.
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
 * Cada opción contiene una etiqueta y un valor identificador.
 * @const AVISO_OPCIONES
 * @description
 * Opciones disponibles para el tipo de aviso en el trámite de destrucción o donación de mercancía.
 */
export const AVISO_OPCIONES = [
    { label: 'Aviso de destrucción de mercancía destinada al régimen de depósito fiscal', value: 'deposito_fiscal' },
    { label: 'Aviso de donación de mercancía a favor del Fisco Federal', value: 'fisco_federal' },
];

/**
 * Este mensaje se muestra al usuario para recordarle que, en caso de cambiar la fecha de destrucción, debe presentar un nuevo aviso.
 * @const MENSAJE
 * @description
 * Mensaje informativo relacionado con el cambio de fecha de destrucción.
 */
export const MENSAJE = "En caso de que el interesado cambie la fecha de destrucción, deberá presentar un nuevo aviso.";

/**
 * Incluye el nombre de la etiqueta, si es requerido y si está habilitado.
 * @const DESTRUCCION_FECHA
 * @description
 * Configuración para la fecha en la que se llevará a cabo la destrucción.
 */
export const DESTRUCCION_FECHA = {
    labelNombre: 'Fecha en la que se llevará a cabo la destrucción',
    required: true,
    habilitado: false,
};

/**
 * Cada opción contiene una etiqueta y un valor identificador.
 * @const CASO_FORTUITO
 * @description
 * Opciones para indicar si se trata de un caso fortuito en el trámite.
 */
export const CASO_FORTUITO = [
    { label: 'Sí', value: 'si' },
    { label: 'No', value: 'no' },
];

/**
 * Este texto se muestra al usuario para recordarle que debe considerar las unidades de medida conforme a la Tarifa de la Ley de los Impuestos Generales de Importación y Exportación.
 * @const TEXTO
 * @description
 * Texto informativo relacionado con las unidades de medida y la carta de cupo electrónica.
 */
export const TEXTO = "Deberán tomar en cuenta las unidades de medida conforme a la Tarifa de la Ley de los Impuestos Generales de Importación y Exportación, señaladas en la carta de cupo electrónica emitida por el almacén general de depósito autorizado.";

/**
 * Esta etiqueta se muestra en la interfaz de usuario para indicar que no hay archivos seleccionados.
 * @const ETIQUETA_DE_ARCHIVO
 * @description
 * Etiqueta predeterminada para el archivo cuando no se ha seleccionado ninguno.
 */
export const ETIQUETA_DE_ARCHIVO = "Sin archivo seleccionados";