import { Cancelacion, Plantas } from '../models/cancelacion-de-solicitus.model';
import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Interfaz que define la estructura del estado de desistimiento de permiso.
 */
export interface DesistimientoDePermisoState {
  /** Identificador de la solicitud, puede ser nulo si aún no se ha creado. */
  idSolicitud: number | null;
  
  /** RFC del solicitante */
  rfc: string;
  
  /** Nombre del solicitante */
  nombre: string;
  
  /** Apellido paterno */
  apPaterno: string;
  
  /** Apellido materno */
  apMaterno: string;
  
  /** Teléfono */
  telefono: string;
  
  /** Tipo de desistimiento */
  tipoDesistimiento: string;
  
  /** Motivo de cancelación */
  motivoCancelacion: string;
  
  /** Número de permiso */
  numeroPermiso: string;
  
  /** Fecha de desistimiento */
  fechaDesistimiento: string;
  
  /** Observaciones */
  observaciones: string;
  
  /** Certificado Serial Number para firma electrónica */
  certificadoSerialNumber: string;
  
  /** Certificado para firma electrónica */
  certificado: string;
  
  /** Datos de cancelación legacy */
  datos: Cancelacion[];

   /**
   * Lista de identificadores de plantas seleccionadas.
   */
  plantasSeleccionadas: Plantas[];

  /** Clave de entidad federativa */
  claveEntidadFederativa: string;

  /** ID del tipo de trámite */
  idTipoTramite: number;

  /** Folio del trámite a cancelar */
  folioCancelar: string;
}

/**
 * Función para crear el estado inicial
 */
function createInitialState(): DesistimientoDePermisoState {
  return {
    idSolicitud: 140105, 
    rfc: 'AAL0409235E6',
    nombre: '',
    apPaterno: '',
    apMaterno: '',
    telefono: '',
    tipoDesistimiento: '',
    motivoCancelacion: '',
    numeroPermiso: '',
    fechaDesistimiento: '',
    observaciones: '',
    certificadoSerialNumber: '',
    certificado: '',
    datos: [],
    plantasSeleccionadas: [] as Plantas[],
    claveEntidadFederativa: 'SIN',
    idTipoTramite: 140105,
    folioCancelar: '',
  };
}

@Injectable({
  providedIn: 'root',
})

@StoreConfig({ name: 'desistimiento-de-permiso', resettable: true })
/**
 * Tienda (store) Akita para gestionar el estado relacionado con la cancelación o desistimiento
 * de solicitudes de permiso.
 *
 * @description
 * Esta clase extiende de `Store` de Akita y permite inicializar y actualizar el estado
 * de tipo `DesistimientoDePermisoState`. Está diseñada para almacenar y manejar los datos relacionados
 * con los trámites de cancelación, como el folio del trámite, tipo de solicitud, fracción arancelaria, etc.
 */
export class DesistimientoStore extends Store<DesistimientoDePermisoState> {

  /**
   * Constructor que inicializa la tienda con el estado inicial.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Actualiza los datos de la forma de cancelación en el estado.
   *
   * @remarks
   * Este método recibe un arreglo de objetos de tipo `Cancelacion` y reemplaza
   * los datos actuales en el estado por los nuevos.
   * 
   * Es útil cuando se modifica la información del formulario o cuando se cargan datos desde una fuente externa.
   *
   * @param datos - Arreglo de objetos de tipo `Cancelacion` que se utilizará para actualizar el estado.
   */
  public actualizarDatosForma(datos: Cancelacion[]): void {
    this.update((_state) => ({
      datos,
    }));
  }

  /**
   * Actualiza el ID de la solicitud
   */
  public setIdSolicitud(idSolicitud: number): void {
    this.update({ idSolicitud });
  }

  /**
   * Actualiza los datos del solicitante
   */
  public setSolicitanteData(data: Partial<DesistimientoDePermisoState>): void {
    this.update(data);
  }

  /**
   * Actualiza los datos de firma electrónica
   */
  public setFirmaData(certificadoSerialNumber: string, certificado: string): void {
    this.update({ certificadoSerialNumber, certificado });
  }

  /**
   * Actualiza la clave de entidad federativa
   */
  public setClaveEntidadFederativa(claveEntidadFederativa: string): void {
    this.update({ claveEntidadFederativa });
  }

  /**
   * Actualiza el ID del tipo de trámite
   */
  public setIdTipoTramite(idTipoTramite: number): void {
    this.update({ idTipoTramite });
  }

  /**
   * Actualiza los datos de configuración del trámite
   */
  public setTramiteConfig(claveEntidadFederativa: string, idTipoTramite: number): void {
    this.update({ claveEntidadFederativa, idTipoTramite });
  }
}
