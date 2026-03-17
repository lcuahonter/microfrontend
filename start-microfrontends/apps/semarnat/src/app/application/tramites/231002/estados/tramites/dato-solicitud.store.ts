import { Store, StoreConfig } from '@datorama/akita';
import { EstadoDatoSolicitud } from '../../models/datos-solicitud.model';
import { Injectable } from '@angular/core';
import { ResiduoPeligroso } from '../../models/aviso-catalogo.model';

/**
 * Retorna el estado inicial del formulario de reciclaje con valores por defecto.
 *
 * @returns {EstadoDatoSolicitud} Objeto con la estructura inicial del formulario de solicitud.
 */
export function crearEstadoInicialFormularioReciclaje(): EstadoDatoSolicitud {
  return {
    rfc_solicitante: '',
    idSolicitud: null,
    esLectura: null,
    solicitudForm: {
      ideGenerica1: '',
      numeroRegistroAmbiental: '',
      descripcionGenerica1: '',
      numeroProgramaImmex: '',
      domicilio: '',
    },
    empresaReciclaje: {
      requiereEmpresa: '',
      nombreEmpresa: '',
      representanteLegal: '',
      telefono: '',
      correoElectronico: '',
    },
    lugarReciclaje: {
      razonSocial: '',
      pais: '',
      destinoDomicilio: '',
      codigoPostal: '',
    },
    empresaTransportista: {
      nombreEmpresaTransportistaResiduos: '',
      numeroAutorizacionSemarnat: '',
    },
    precaucionesManejo: {
      clave: '',
      precaucionesManejo: '',
    },
    residuos: [],
  };
}

/**
 * Store que gestiona el estado del formulario de solicitud de reciclaje.
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'dato-solicitud', resettable: true })
export class DatoSolicitudStore extends Store<EstadoDatoSolicitud> {
  /**
   * Inicializa el estado del store con los valores por defecto.
   */
  constructor() {
    super(crearEstadoInicialFormularioReciclaje());
  }

  /**
   * Guarda el ID de la solicitud en el estado.
   *
   * @param idSolicitud - El ID de la solicitud que se va a guardar.
   */
  public setIdSolicitud(idSolicitud: number): void {
    this.update((state) => ({
      ...state,
      idSolicitud,
    }));
  }

  /**
   * Actualiza los datos generales de la solicitud.
   *
   * @param valores - Objeto con los valores actualizados para `solicitudForm`.
   */
  actualizarSolicitudForm(valores: EstadoDatoSolicitud['solicitudForm']): void {
    this.update((state) => ({
      ...state,
      solicitudForm: { ...valores },
    }));
  }

  /**
   * Actualiza la información de la empresa recicladora.
   *
   * @param valores - Objeto con los valores actualizados para `empresaReciclaje`.
   */
  actualizarEmpresaReciclaje(
    valores: EstadoDatoSolicitud['empresaReciclaje']
  ): void {
    this.update((state) => ({
      ...state,
      empresaReciclaje: { ...valores },
    }));
  }

  /**
   * Actualiza los datos del lugar de reciclaje.
   *
   * @param valores - Objeto con los valores actualizados para `lugarReciclaje`.
   */
  actualizarLugarReciclaje(
    valores: EstadoDatoSolicitud['lugarReciclaje']
  ): void {
    this.update((state) => ({
      ...state,
      lugarReciclaje: { ...valores },
    }));
  }

  /**
   * Actualiza la información de la empresa transportista de residuos.
   *
   * @param valores - Objeto con los valores actualizados para `empresaTransportista`.
   */
  actualizarEmpresaTransportista(
    valores: EstadoDatoSolicitud['empresaTransportista']
  ): void {
    this.update((state) => ({
      ...state,
      empresaTransportista: { ...valores },
    }));
  }

  /**
   * Actualiza las precauciones para el manejo del residuo.
   *
   * @param valores - Objeto con los valores actualizados para `precaucionesManejo`.
   */
  actualizarPrecaucionesManejo(
    valores: EstadoDatoSolicitud['precaucionesManejo']
  ): void {
    this.update((state) => ({
      ...state,
      precaucionesManejo: { ...valores },
    }));
  }

  actualizarResiduosPeligrosos(residuos: ResiduoPeligroso[]): void {
    this.update((state) => ({
      ...state,
      residuos: [...residuos],
    }));
  }

  /**
   * Restaura el estado del formulario al valor inicial definido.
   */
  limpiarFormulario(): void {
    this.reset();
  }
}
