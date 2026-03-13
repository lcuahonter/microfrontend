import { DatosDelaSolicitud, Movilizacion } from './datos-generales.model';
import { MedioTransporte } from './medio-transporte.model';
import { PagoDeDerechos } from './pago-de-derechos.model';

/** 
 * Interfaz que representa el estado de la aplicación para la gestión de Sagarpa. 
 */
export interface SagarpaState {
  /** Información relacionada con el pago de derechos. */
  pagoDeDerechos: PagoDeDerechos;

  /** Datos del medio de transporte utilizado en la solicitud. */
  medioTransporte: MedioTransporte;

  /** Información general de la solicitud. */
  datosDelaSolicitud: DatosDelaSolicitud;

  /** Datos relacionados con la movilización del transporte. */
  movilizacion: Movilizacion;
}
