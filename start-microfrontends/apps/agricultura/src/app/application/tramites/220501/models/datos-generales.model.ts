import { Solicitud220501State } from "../estados/tramites220501.store";
import { Solicitud220502State } from "../../220502/estados/tramites220502.store";

/** 
 * Interfaz que representa los datos de la solicitud. 
 */
export interface DatosDelaSolicitud {
    /** Aduana de ingreso seleccionada para la solicitud. */
    aduanaIngreso: string;
    
    /** Oficina de inspección asignada para la solicitud. */
    oficinaInspeccion: string;
    
    /** Punto de inspección donde se llevará a cabo la revisión. */
    puntoInspeccion: string;
    
    /** Clave UCON asociada a la solicitud. */
    claveUCON: string;
    
    /** Establecimiento TIF relacionado con la solicitud. */
    establecimientoTIF: string;
    
    /** Régimen bajo el cual se encuentra la solicitud. */
    regimen: string;
    
    /** Número de folio de la solicitud. */
    foliodel: string;
  }
  
  /** 
   * Interfaz que representa los datos de la movilización. 
   */
  export interface Movilizacion {
    /** Coordenadas geográficas del punto de movilización. */
    coordenadas: string;
    
    /** Nombre del lugar o entidad relacionado con la movilización. */
    nombre: string;
    
    /** Medio utilizado para la movilización (ejemplo: terrestre, aéreo, marítimo). */
    medio: string;
    
    /** Tipo de transporte utilizado para la movilización. */
    transporte: string;
    
    /** Punto específico donde se realiza la movilización. */
    punto: string;
  }

  /**
   * Interfaz que representa los datos de registro de toma de muestras de mercancías.
   * Contiene el estado de las solicitudes 220501 y 220502.
   */
  export interface RegistroTomaMuestrasMercanciasDatos {
    /** 
     * Estado de la solicitud 220501. 
     */
    solicitud220501State: Solicitud220501State;

    /** 
     * Estado de la solicitud 220502. 
     */
    solicitud220502State: Solicitud220502State;
}
/**
 * Representa la información básica de una solicitud vinculada a mercancías.
 * Incluye datos generales como la fecha de creación, proveedor, cantidad
 * y un identificador opcional asignado por el sistema.
 */
export interface Solicitud {

 /** Identificador de la solicitud */
  id_solicitud?: number;

  /** Fecha de creación */
  fechaCreacion: string;

  /** Nombre o identificador de la mercancía */
  mercancia: string;

  /** Cantidad solicitada */
  cantidad: string;

  /** Proveedor de la mercancia */
  proovedor: string;
}
  