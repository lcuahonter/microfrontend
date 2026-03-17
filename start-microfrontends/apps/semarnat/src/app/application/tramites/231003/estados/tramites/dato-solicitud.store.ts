import { Store, StoreConfig } from '@datorama/akita';
import { EstadoDatoSolicitud } from '../../models/datos-solicitud.model';
import { Injectable } from '@angular/core';
/**
 * Función que retorna el estado inicial para el formulario de reciclaje.
 */
export function crearEstadoInicialFormularioReciclaje(): EstadoDatoSolicitud {
  return {
    idSolicitud: null,
    // Datos generales de la solicitud
    solicitudForm: {
      // Número de registro ambiental proporcionado por SEMARNAT
      numeroRegistroAmbiental: '',

      // Descripción genérica del residuo
      descripcionGenerica1: '',

      // Número del programa IMMEX asociado a la empresa
      numeroProgramaImmex: '',
    },

    // Información de la empresa recicladora
    empresaReciclaje: {
      // Indicador de si se requiere empresa recicladora (valor inicial: "Si")
      requiereEmpresa: '',

      // Nombre de la empresa recicladora
      nombreEmpresa: '',

      // Representante legal de la empresa recicladora
      representanteLegal: '',

      // Teléfono de contacto de la empresa recicladora
      telefono: '',

      // Correo electrónico de la empresa recicladora
      correoElectronico: '',
    },

    // Información sobre el lugar donde se realiza el reciclaje
    lugarReciclaje: {
      // Indicador si el reciclaje se realiza en las instalaciones del generador (valor inicial: "Si")
      reciclajeInstalaciones: 'Si',

      // Dirección o nombre del lugar de reciclaje
      lugarReciclaje: '',

      // Número de autorización de la empresa recicladora otorgado por la autoridad competente
      numeroAutorizacionEmpresaReciclaje: '',
    },

    // Datos de la empresa encargada del transporte de los residuos
    empresaTransportista: {
      // Nombre de la empresa transportista
      nombreEmpresaTransportistaResiduos: '',

      // Número de autorización de SEMARNAT para transportar residuos
      numeroAutorizacionSemarnat: '',
    },

    // Descripción de las precauciones a tomar en el manejo del residuo
    precaucionesManejo: {
      precaucionesManejo: '',
    },

    residuos: [],
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'dato-solicitud', resettable: true })
export class DatoSolicitudStore extends Store<EstadoDatoSolicitud> {
  /**
   * Constructor del store que inicializa el estado con los valores predeterminados
   * definidos en la función crearEstadoInicialFormularioReciclaje().
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
   * Actualiza los valores del formulario de solicitud en el estado.
   * @param valores - Objeto con los nuevos valores del formulario de solicitud.
   */
  actualizarSolicitudForm(valores: EstadoDatoSolicitud['solicitudForm']): void {
    this.update((state) => ({
      ...state,
      solicitudForm: { ...valores },
    }));
  }

  /**
   * Actualiza los valores del formulario de la empresa recicladora en el estado.
   * @param valores - Objeto con los nuevos valores del formulario de empresa reciclaje.
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
   * Actualiza los valores del formulario del lugar de reciclaje en el estado.
   * @param valores - Objeto con los nuevos valores del formulario de lugar de reciclaje.
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
   * Actualiza los valores del formulario de la empresa transportista en el estado.
   * @param valores - Objeto con los nuevos valores del formulario de empresa transportista.
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
   * Actualiza los valores del formulario de precauciones de manejo en el estado.
   * @param valores - Objeto con los nuevos valores del formulario de precauciones de manejo.
   */
  actualizarPrecaucionesManejo(
    valores: EstadoDatoSolicitud['precaucionesManejo']
  ): void {
    this.update((state) => ({
      ...state,
      precaucionesManejo: { ...valores },
    }));
  }

  actualizarResiduos(valores: EstadoDatoSolicitud['residuos']): void {
    this.update((state) => ({
      ...state,
      residuos: [...valores],
    }));
  }

  /**
   * Restaura el estado del formulario al estado inicial.
   */
  limpiarFormulario(): void {
    this.reset();
  }
}
