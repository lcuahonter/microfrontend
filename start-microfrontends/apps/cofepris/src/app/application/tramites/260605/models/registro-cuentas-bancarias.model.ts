/**
 * Interfaz que representa una tabla de registro de solicitudes.
 * 
 * @export
 * @interface RegistroDeSolicitudesTabla
 */
export interface RegistroDeSolicitudesTabla {
    /**
     * Movimiento de la solicitud.
     * 
     * @type {number}
     * @memberof RegistroDeSolicitudesTabla
     */
    movimiento: number;
  
    /**
     * Cuenta de la solicitud.
     * 
     * @type {string}
     * @memberof RegistroDeSolicitudesTabla
     */
    cuenta: string;
  
    /**
     * RFC de la solicitud.
     * 
     * @type {string}
     * @memberof RegistroDeSolicitudesTabla
     */
    rfc: string;
  
    /**
     * Persona de la solicitud.
     * 
     * @type {string}
     * @memberof RegistroDeSolicitudesTabla
     */
    persona: string;
  
    /**
     * Número de cuenta de la solicitud.
     * 
     * @type {string}
     * @memberof RegistroDeSolicitudesTabla
     */
    numeroDeCuenta: string;
  
    /**
     * Sucursal de la solicitud.
     * 
     * @type {string}
     * @memberof RegistroDeSolicitudesTabla
     */
    sucursal: string;
  
    /**
     * Institución de crédito de la solicitud.
     * 
     * @type {string}
     * @memberof RegistroDeSolicitudesTabla
     */
    institucionDeCredito: string;
  
    /**
     * Número de la solicitud.
     * 
     * @type {string}
     * @memberof RegistroDeSolicitudesTabla
     */
    numero: string;
  
    /**
     * Radicación de la cuenta de la solicitud.
     * 
     * @type {string}
     * @memberof RegistroDeSolicitudesTabla
     */
    radicaCuenta: string;
  
    /**
     * Estado de la solicitud.
     * 
     * @type {string}
     * @memberof RegistroDeSolicitudesTabla
     */
    estado: string;
  
    /**
     * Domicilio de la solicitud.
     * 
     * @type {string}
     * @memberof RegistroDeSolicitudesTabla
     */
    domicilio: string;
  }
  
  /**
   * Interfaz que representa los datos generales.
   * 
   * @export
   * @interface DatosGenerales
   */
  export interface DatosGenerales {
    /**
     * Datos de la solicitud.
     * 
     * @type {DATOS[]}
     * @memberof DatosGenerales
     */
    data: DATOS[];
  }
  
  /**
   * Interfaz que representa los datos.
   * 
   * @export
   * @interface DATOS
   */
  export interface DATOS {
    /**
     * Aduana adicional.
     * 
     * @type {string}
     * @memberof DATOS
     */
    aduanaAdicional: string;
  
    /**
     * Nombre.
     * 
     * @type {string}
     * @memberof DATOS
     */
    nombre: string;
  
    /**
     * Registro Federal de Contribuyentes.
     * 
     * @type {string}
     * @memberof DATOS
     */
    federalDeContribuyentes: string;
  
    /**
     * Tipo de persona.
     * 
     * @type {string}
     * @memberof DATOS
     */
    tipoDePersona: string;
  }
  
  /**
   * Interfaz que representa una sociedad.
   * 
   * @export
   * @interface Sociedad
   */
  export interface Sociedad {
    /**
     * ID de la sociedad.
     * 
     * @type {string}
     * @memberof Sociedad
     */
    id: string;
  
    /**
     * Descripción de la sociedad.
     * 
     * @type {string}
     * @memberof Sociedad
     */
    descripcion: string;
  }