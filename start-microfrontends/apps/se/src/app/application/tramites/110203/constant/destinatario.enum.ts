import { DestinatarioDatos } from "../models/datos-tramite.model";
/** Datos de ejemplo del destinatario para inicializar o poblar el formulario. 
 * Contiene nombre, dirección y datos de contacto. */
export const DESTINATARIO_DATOS: DestinatarioDatos = {
  nombre: "Juan",
  primer: "Perez",
  segundo: "Perez",
  fiscal: "123",
  razon: "razon destinatario",
  calle: "pruebas1",
  letra: "1",
  ciudad: "pruebas2",
  correo: "correo@correo.com",
  fax: "55446778899",
  telefono: "2-55446778899"
};

/**
 * Plantilla HTML para mostrar una alerta de error cuando faltan campos por capturar en el registro.
 */
export const ERROR_FORMA_ALERT =
  `
<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">
      Faltan campos por capturar.
    </div>
  </div>
</div>
`
/**
 * Constante que define el mensaje de error en formato HTML
 * para indicar que el campo 'Precisa' es obligatorio.
 */
export const ERROR_PRECISA_REQUIRED = `
<div class="d-flex align-items-start">
  <div class="me-2">
    <span>1.</span>
  </div>
  <div class="flex-grow-1 d-flex justify-content-center">
    <div class="text-center">
      <div style="color: black;">
        Corrija los siguientes errores:
      </div>
      <div style="color: red;">
        (Precisa) es un campo requerido
      </div>
    </div>
  </div>
</div>
`;

/**
 * Constante que define la configuración del campo 'Fecha de vencimiento'.
 * Incluye la etiqueta, si es requerido y su estado de habilitación.
 */
export const FECHA_VENCIMIENTO = {
  labelNombre: 'Fecha de vencimiento:',
  required: false,
  habilitado: false,
};

/**
 * Constante que define la configuración del campo 'Fecha de expedición'.
 * Contiene la etiqueta, si es obligatorio y su estado de habilitación.
 */
export const FECHA_EXPEDICION = {
  labelNombre: 'Fecha de expedición:',
  required: false,
  habilitado: false,
};

/**
 * Constante que define la configuración del campo 'Fecha de la factura'.
 * Especifica la etiqueta, si es requerido y su estado de habilitación.
 */
export const FECHA_FACTURA = {
  labelNombre: 'Fecha de la factura:',
  required: false,
  habilitado: true,
};