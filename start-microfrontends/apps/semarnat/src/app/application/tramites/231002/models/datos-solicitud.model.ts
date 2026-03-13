import { ResiduoPeligroso } from './aviso-catalogo.model';

/**
 * Estado que representa los valores del formulario de reciclaje.
 */
export interface EstadoDatoSolicitud {

  /**
   * RFC del solicitante.
   */
  rfc_solicitante: string;

  /**
   * Indica si el formulario está en modo de solo lectura.
   */
  esLectura: boolean | null;

  /**
   * ID de la solicitud.
   */

  idSolicitud: number | null;

  /**
   * Sección de datos de la solicitud.
   */
  solicitudForm: {
    /**
     * Identificador genérico.
     *
     * @type {string}
     */
    ideGenerica1: string;

    /**
     * Número de registro ambiental.
     *
     * @type {string}
     */
    numeroRegistroAmbiental: string;

    /**
     * Descripción genérica del residuo.
     *
     * @type {string}
     */
    descripcionGenerica1: string;

    /**
     * Número de programa IMMEX asociado.
     *
     * @type {string}
     */
    numeroProgramaImmex: string;

    /**
     * Domicilio de la solicitud.
     *
     * @type {string}
     */
    domicilio: string;
  };

  /**
   * Información de la empresa recicladora.
   */
  empresaReciclaje: {
    /**
     * Indicador de si se requiere empresa recicladora (valor: "Si" o "No").
     *
     * @type {string}
     */
    requiereEmpresa: string;

    /**
     * Nombre de la empresa recicladora.
     *
     * @type {string}
     */
    nombreEmpresa: string;

    /**
     * Representante legal de la empresa recicladora.
     *
     * @type {string}
     */
    representanteLegal: string;

    /**
     * Teléfono de contacto de la empresa recicladora.
     *
     * @type {string}
     */
    telefono: string;

    /**
     * Correo electrónico de contacto de la empresa recicladora.
     *
     * @type {string}
     */
    correoElectronico: string;
  };

  /**
   * Información del lugar de reciclaje.
   */
  lugarReciclaje: {
    /**
     * Razón social del lugar de reciclaje.
     *
     * @type {string}
     */
    razonSocial: string;

    /**
     * País donde se realiza el reciclaje.
     *
     * @type {string}
     */
    pais: string;

    /**
     * Dirección de destino del reciclaje.
     *
     * @type {string}
     */
    destinoDomicilio: string;

    /**
     * Código postal del lugar de reciclaje.
     *
     * @type {string}
     */
    codigoPostal: string;
  };

  /**
   * Datos de la empresa transportista.
   */
  empresaTransportista: {
    /**
     * Nombre de la empresa transportista de residuos.
     *
     * @type {string}
     */
    nombreEmpresaTransportistaResiduos: string;

    /**
     * Número de autorización otorgado por SEMARNAT para el transporte de residuos.
     *
     * @type {string}
     */
    numeroAutorizacionSemarnat: string;
  };

  /**
   * Precauciones en el manejo del residuo.
   */
  precaucionesManejo: {
    /**
     * Clave de las precauciones de manejo.
     *
     * @type {string}
     */
    clave: string;

    /**
     * Descripción detallada de las precauciones de manejo del residuo.
     *
     * @type {string}
     */
    precaucionesManejo: string;
  };

  residuos: ResiduoPeligroso[];
}
