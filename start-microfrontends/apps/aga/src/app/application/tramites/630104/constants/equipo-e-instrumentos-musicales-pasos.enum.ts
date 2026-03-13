/**
 * PASOS_EXPORTACION
 * 
 * Constante que define los pasos necesarios para el proceso de exportación.
 * Cada paso incluye:
 * - `indice`: Número que indica el orden del paso.
 * - `titulo`: Descripción del paso.
 * - `activo`: Indica si el paso está activo actualmente.
 * - `completado`: Indica si el paso ha sido completado.
 */
export const PASOS_EXPORTACION = [
    {
        indice: 1,
        titulo: 'Capturar solicitud',
        activo: true,
        completado: true,
    },
    {
        indice: 2,
        titulo: 'Firmar solicitud',
        activo: false,
        completado: false,
    }
];

/**
 * FECHA_FINAL
 * 
 * Constante que define las propiedades relacionadas con la fecha final del proceso.
 * Incluye:
 * - `labelNombre`: Etiqueta que describe el campo de la fecha.
 * - `required`: Indica si el campo es obligatorio.
 * - `habilitado`: Indica si el campo está habilitado para ser editado.
 */
export const FECHA_FINAL = {
    labelNombre: 'Fecha de pago',
    required: true,
    habilitado: true,
};