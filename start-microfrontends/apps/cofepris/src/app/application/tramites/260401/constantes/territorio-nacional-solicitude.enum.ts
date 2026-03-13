/**
 * Lista de pasos del proceso para el módulo de territorio.
 * 
 * Cada objeto representa una etapa del proceso con:
 * - `indice`: número del paso en el proceso.
 * - `titulo`: descripción textual del paso.
 * - `activo`: indica si el paso está activo actualmente.
 * - `completado`: indica si el paso ha sido completado.
 * 
 * Esta constante se puede utilizar para mostrar un flujo de pasos en un wizard o asistente de captura de información.
 */
export const PASSOS_TERRITORIO = [
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

export const MENSAJE_DE_VALIDACION_PAGO_DERECHOS = '<div>¿Está seguro que su solicitud no requiere los datos del Pago de derechos?</div>';