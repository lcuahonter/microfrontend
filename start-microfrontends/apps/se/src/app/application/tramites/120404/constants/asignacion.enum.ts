export const ASIGNACION = [
    {
        indice: 1,
        titulo: 'Capturar solicitud',
        activo: true,
        completado: false,
      },
      {
        indice: 2,
        titulo: 'Anexar requistios',
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
/**
 * Constante que contiene el HTML para mostrar mensajes de error de validación.
 * Muestra un título y lista de errores en formato destacado (color y alineación).
 * Se usa con [innerHTML] en la vista para renderizar el contenido.
 */
export const TEXTOS_BUSCAR = {
TEXTOS_BUSCAR: `
  <div style="text-align: center;">
  <strong style="color: #585051ff"> Corrija los siguientes errores:</strong><br>
  </div>
  <div style="text-align: left; margin-top: 5px;">
  <span style="color: #d1776b">
    1.<span style="padding-left: 320px;">El valor (Test) debe ser un número válido.</span>
  </span>
</div>
  `
};