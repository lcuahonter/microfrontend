// eslint-disable-next-line @nx/enforce-module-boundaries
import { ConfiguracionColumna } from '@libs/shared/data-access-user/src';
import { PagoDeDerechosTabla } from "../models/301.models";
/**
 * @constant PAGO_DE_DERECHOS_TABLA
 * @description
 * Define la configuración de las columnas para la tabla de partidas en el proceso de importación definitiva.
 * @type {ConfiguracionColumna<PagoDeDerechosTabla>[]}
 */
  export const PAGO_DE_DERECHOS_TABLA: ConfiguracionColumna<PagoDeDerechosTabla>[] = [
      { encabezado: 'Linea de captura', clave: (artículo) => artículo.lineaDeCaptura, orden: 1 },
      { encabezado: 'Monto', clave: (artículo) => artículo.monto, orden: 2 }
    ];

  /**
   * Plantilla HTML para mostrar errores de validación relacionados con el campo "Pago".
   * Se utiliza en formularios para indicar que el pago es un campo requerido.
   */
  export const ERROR_MESSAGE_PAGO: string = `<div class="row">
    <div class="col-md-12 justify-content-center text-center">
      <div class="row">
        <div class="col-md-12">
          <p>Corrija los siguientes errores:</p>
          <ol>
            <li>(Pago) es un campo requerido</li>
          </ol>
        </div>
      </div>
    </div>
  </div>
  `;

  /**
   * Plantilla HTML genérica para indicar que existe un error en el formulario.
   * Mostrar cuando la validación del registro falla por motivos distintos al campo de pago.
   */
  export const ERROR_MESSAGE_REGISTRO: string = `<div class="row">
    <div class="col-md-12 justify-content-center text-center">
      <div class="row">
        <div class="col-md-12 mt-2">
          <p>Error en el formulario, favor de verificar</p>
        </div>
      </div>
    </div>
  </div>
  `;