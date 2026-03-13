export const REQUERIDO = 'Este campo es obligatorio';
export const RFC_INVALIDO = 'La nomenclatura del RFC es incorrecta';
export const CORREO_INVALIDO = 'Correo inválido';
export const TELEFONO_INVAIDO = 'Formato de teléfono inválido';
export const INTRODUZCA_NUMERO = 'Introduzca un número con una longitud máxima de 8 dígitos';
export const ALERTA = `<p style='text-align: center;'><b>¡Error de registro!</b> Faltan campos por capturar</p>`;
export const ERROR_ALERTA = `<div style='text-align: center;'>Faltan campos por capturar.</div>`;
export const ALERTA_BUSCAR_ERROR = `<p style='text-align: center;'>Corrija los siguientes errores:</p>
<div style="display: grid; grid-template-columns: auto 1fr; align-items: center; width: 100%; color: #d0021b;">
  <span>1.</span>
  <span style="text-align: center;">Debe seleccionar una asignación</span>
</div>`;
export function getAlertaNumFolioAsignacionError(valor: string): string {
  return `<p style='text-align: center;'>Corrija los siguientes errores:</p>
  <div style="display: grid; grid-template-columns: auto 1fr; align-items: center; width: 100%; color: #d0021b;">
    <span>1.</span>
    <span style="text-align: center;">(Número de oficio de asignación) es un campo requerido</span>
    <span>2.</span>
    <span style="text-align: center;">El valor (${valor}) debe ser un número válido</span>
  </div>`;
}
export function getFechaFinError(error: string): string { 
  return `<p style='text-align: center;'>Corrija los siguientes errores:</p>
  <div style="display: grid; grid-template-columns: auto 1fr; align-items: center; width: 100%; color: #d0021b;">
    <span>1.</span>
    <span style="text-align: center;">${error}</span>
  </div>`;
}