/**
 * Constante que define los pasos del asistente.
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
    titulo: 'Firmar solicitud',
    activo: false,
    completado: false,
  },
];

/**
 * Interfaz que define la estructura de las mercancías.
 */
export interface Mercancias {
  numeroDeOrden: string;
  fraccionArancelaria: string;
  nombreTecnico: string;
  nombreComercial: string;
  nombreIngles: string;
  numeroDeRegistro: string;
}
/**
 * Interfaz que define la estructura de la acción del botón.
 */
export interface AccionBoton {
  accion: string;
  valor: number;
}

/**
 * Configuración de las mercancías para la tabla dinámica.
 */
export const CONFIGURACION_MERCANCIAS = [
  {
    encabezado: 'Número de orden',
    clave: (ele: Mercancias): string => ele.numeroDeOrden,
    orden: 1
  },
  {
    encabezado: 'Fracción arancelaria',
    clave: (ele: Mercancias): string => ele.fraccionArancelaria,
    orden: 2
  },
  {
    encabezado: 'Nombre técnico',
    clave: (ele: Mercancias): string => ele.nombreTecnico,
    orden: 3
  },
  {
    encabezado: 'Nombre comercial',
    clave: (ele: Mercancias): string => ele.nombreComercial,
    orden: 4
  },
  {
    encabezado: 'Nombre inglés',
    clave: (ele: Mercancias): string => ele.nombreIngles,
    orden: 5
  },
  {
    encabezado: 'Número de registro',
    clave: (ele: Mercancias): string => ele.numeroDeRegistro,
    orden: 6
  }
];

/**
 * Constante que representa la configuración de la fecha de vencimiento.
 * 
 * @property {string} labelNombre - Etiqueta que describe el nombre del campo.
 * @property {boolean} required - Indica si el campo es obligatorio.
 * @property {boolean} habilitado - Indica si el campo está habilitado.
 */
export const FECHA_VENCIMIENTO = {
  labelNombre: 'Fecha de vencimiento:',
  required: false,
  habilitado: false,
};
/**
 * Constant representing the "Fecha de expedición" (Date of issuance).
 * 
 * @property {string} labelNombre - The label name for the date of issuance.
 * @property {boolean} required - Indicates whether the date of issuance is required.
 * @property {boolean} habilitado - Indicates whether the date of issuance is enabled.
 */
export const FECHA_EXPEDICION = {
  labelNombre: 'Fecha de expedición:',
  required: false,
  habilitado: false,
};
/**
 * Constant representing the invoice date field configuration.
 * 
 * @property {string} labelNombre - The label for the invoice date field.
 * @property {boolean} required - Indicates if the invoice date field is required.
 * @property {boolean} habilitado - Indicates if the invoice date field is enabled.
 */
export const FECHA_FACTURA = {
  labelNombre: 'Fecha de la factura',
  required: false,
  habilitado: false,
};

export interface DatosDelDestinatario {
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  numeroDeRegistroFiscal: string;
  razonSocial: string;
}

/**
 * @constant ERROR_FORMA_ALERT
 * @description
 * Mensaje HTML que se muestra como alerta cuando faltan campos por capturar en el formulario.
 * Se utiliza para informar al usuario que debe completar todos los campos requeridos antes de continuar.
 */
export const ERROR_FORMA_ALERT =
  `
<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">
      <b>Faltan campos por capturar.</b>
    </div>
  </div>
</div>
`

