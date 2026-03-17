import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

import {
  ApiResponseSolicitante,
  DatosUnidad,
  DatosVehiculo,
  DirectorGeneralData,
  UnidadTabla,
  VehiculoTabla
} from '../models/registro-muestras-mercancias.model';
/**
 * Estado de la store para el trámite 40101.
 * @property datosVehiculo - Datos del vehículo principal.
 * @property datosUnidad - Datos de la unidad de arrastre.
 */
export interface Tramite40101State {
  datosVehiculo: DatosVehiculo;
  datosUnidad: DatosUnidad;
  directorGeneral: DirectorGeneralData | null;
  parqueVehicular: VehiculoTabla[];
  unidadesArrastre: UnidadTabla[];
  solicitanteDatas: ApiResponseSolicitante['datos'];
  seccion: boolean[];
  formaValida: boolean[];
}
/**
 * Crea el estado inicial para el trámite 40101.
 * @returns Estado inicial con valores vacíos para vehículo y unidad.
 */
export function createInitialState(): Tramite40101State {
  return {
    datosVehiculo: {
      numero: '',
      tipoDeVehiculo: '',
      idDeVehiculo: '',
      numeroPlaca: '',
      paisEmisor: '',
      estado: '',
      marca: '',
      modelo: '',
      ano: '',
      transponder: '',
      colorVehiculo: '',
      numuroEconomico: '',
      numero2daPlaca: '',
      estado2daPlaca: '',
      paisEmisor2daPlaca: '',
      descripcion: '',
    },
    datosUnidad: {
      vinVehiculo: '',
      tipoDeUnidadArrastre: '',
      idDeVehiculoUnidad: '',
      numeroEconomico: '',
      numeroPlaca: '',
      paisEmisor: '',
      estado: '',
      colorVehiculo: '',
      numero2daPlaca: '',
      estado2daPlaca: '',
      paisEmisor2daPlaca: '',
      descripcion: '',
    },
    directorGeneral: null,
    parqueVehicular: [],
    unidadesArrastre: [],
    solicitanteDatas: {
      caat_existe: false,
      mostrar_director_general: true,
      mensaje: '',
      solicitante: {
        id_persona_solicitud: null,
        rfc: '',
        razon_social: '',
        descripcion_giro: '',
        correo_electronico: '',
        domicilio: {
          pais: '',
          codigo_postal: '',
          estado: '',
          municipio: '',
          localidad: '',
          colonia: '',
          calle: '',
          numero_exterior: '',
          numero_interior: '',
          telefono: '',
          lada: '',
        },
      }
    },
    seccion: [],
    formaValida: [],
  };
}
/**
 * Store de Akita para el trámite 40101.
 * Permite actualizar campos individuales de los datos de vehículo y unidad de arrastre.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite40101', resettable: true })
export class Tramite40101Store extends Store<Tramite40101State> {
  /**
   * Inicializa la store con el estado inicial.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Actualiza el número del vehículo.
   * @param numero Nuevo número.
   */
  public setDatosVehiculoNumero(numero: string): void {
    this.update((state) => ({
      ...state,
      datosVehiculo: {
        ...state.datosVehiculo,
        numero,
      },
    }));
  }

  /**
   * Actualiza el tipo de vehículo.
   * @param tipoDeVehiculo Nuevo tipo de vehículo.
   */
  public setDatosVehiculoTipoDeVehiculo(tipoDeVehiculo: string): void {
    this.update((state) => ({
      ...state,
      datosVehiculo: {
        ...state.datosVehiculo,
        tipoDeVehiculo,
      },
    }));
  }

  /**
   * Actualiza el identificador del vehículo.
   * @param idDeVehiculo Nuevo identificador.
   */
  public setDatosVehiculoIdDeVehiculo(idDeVehiculo: string): void {
    this.update((state) => ({
      ...state,
      datosVehiculo: {
        ...state.datosVehiculo,
        idDeVehiculo,
      },
    }));
  }

  /**
   * Actualiza el número de placa del vehículo.
   * @param numeroPlaca Nuevo número de placa.
   */
  public setDatosVehiculoNumeroPlaca(numeroPlaca: string): void {
    this.update((state) => ({
      ...state,
      datosVehiculo: {
        ...state.datosVehiculo,
        numeroPlaca,
      },
    }));
  }

  /**
   * Actualiza el país emisor de la placa del vehículo.
   * @param paisEmisor Nuevo país emisor.
   */
  public setDatosVehiculoPaisEmisor(paisEmisor: string): void {
    this.update((state) => ({
      ...state,
      datosVehiculo: {
        ...state.datosVehiculo,
        paisEmisor,
      },
    }));
  }

  /**
   * Actualiza el estado de la placa del vehículo.
   * @param estado Nuevo estado.
   */
  public setDatosVehiculoEstado(estado: string): void {
    this.update((state) => ({
      ...state,
      datosVehiculo: {
        ...state.datosVehiculo,
        estado,
      },
    }));
  }

  /**
   * Actualiza la marca del vehículo.
   * @param marca Nueva marca.
   */
  public setDatosVehiculoMarca(marca: string): void {
    this.update((state) => ({
      ...state,
      datosVehiculo: {
        ...state.datosVehiculo,
        marca,
      },
    }));
  }

  /**
   * Actualiza el modelo del vehículo.
   * @param modelo Nuevo modelo.
   */
  public setDatosVehiculoModelo(modelo: string): void {
    this.update((state) => ({
      ...state,
      datosVehiculo: {
        ...state.datosVehiculo,
        modelo,
      },
    }));
  }

  /**
   * Actualiza el año del vehículo.
   * @param ano Nuevo año.
   */
  public setDatosVehiculoAno(ano: string): void {
    this.update((state) => ({
      ...state,
      datosVehiculo: {
        ...state.datosVehiculo,
        ano,
      },
    }));
  }

  /**
   * Actualiza el transponder del vehículo.
   * @param transponder Nuevo transponder.
   */
  public setDatosVehiculoTransponder(transponder: string): void {
    this.update((state) => ({
      ...state,
      datosVehiculo: {
        ...state.datosVehiculo,
        transponder,
      },
    }));
  }

  /**
   * Actualiza el color del vehículo.
   * @param colorVehiculo Nuevo color.
   */
  public setDatosVehiculoColorVehiculo(colorVehiculo: string): void {
    this.update((state) => ({
      ...state,
      datosVehiculo: {
        ...state.datosVehiculo,
        colorVehiculo,
      },
    }));
  }

  /**
   * Actualiza el número económico del vehículo.
   * @param numuroEconomico Nuevo número económico.
   */
  public setDatosVehiculoNumuroEconomico(numuroEconomico: string): void {
    this.update((state) => ({
      ...state,
      datosVehiculo: {
        ...state.datosVehiculo,
        numuroEconomico,
      },
    }));
  }

  /**
   * Actualiza el número de segunda placa del vehículo.
   * @param numero2daPlaca Nuevo número de segunda placa.
   */
  public setDatosVehiculoNumero2daPlaca(numero2daPlaca: string): void {
    this.update((state) => ({
      ...state,
      datosVehiculo: {
        ...state.datosVehiculo,
        numero2daPlaca,
      },
    }));
  }

  /**
   * Actualiza el estado de la segunda placa del vehículo.
   * @param estado2daPlaca Nuevo estado de la segunda placa.
   */
  public setDatosVehiculoEstado2daPlaca(estado2daPlaca: string): void {
    this.update((state) => ({
      ...state,
      datosVehiculo: {
        ...state.datosVehiculo,
        estado2daPlaca,
      },
    }));
  }

  /**
   * Actualiza el país emisor de la segunda placa del vehículo.
   * @param paisEmisor2daPlaca Nuevo país emisor de la segunda placa.
   */
  public setDatosVehiculoPaisEmisor2daPlaca(paisEmisor2daPlaca: string): void {
    this.update((state) => ({
      ...state,
      datosVehiculo: {
        ...state.datosVehiculo,
        paisEmisor2daPlaca,
      },
    }));
  }

  /**
   * Actualiza la descripción del vehículo.
   * @param descripcion Nueva descripción.
   */
  public setDatosVehiculoDescripcion(descripcion: string): void {
    this.update((state) => ({
      ...state,
      datosVehiculo: {
        ...state.datosVehiculo,
        descripcion,
      },
    }));
  }

  /**
   * Actualiza el VIN de la unidad de arrastre.
   * @param vinVehiculo Nuevo VIN.
   */
  public setDatosUnidadVinVehiculo(vinVehiculo: string): void {
    this.update((state) => ({
      ...state,
      datosUnidad: {
        ...state.datosUnidad,
        vinVehiculo,
      },
    }));
  }

  /**
   * Actualiza el tipo de unidad de arrastre.
   * @param tipoDeUnidadArrastre Nuevo tipo de unidad.
   */
  public setDatosUnidadTipoDeUnidadArrastre(
    tipoDeUnidadArrastre: string
  ): void {
    this.update((state) => ({
      ...state,
      datosUnidad: {
        ...state.datosUnidad,
        tipoDeUnidadArrastre,
      },
    }));
  }

  /**
   * Actualiza el número económico de la unidad de arrastre.
   * @param numeroEconomico Nuevo número económico.
   */
  public setDatosUnidadNumeroEconomico(numeroEconomico: string): void {
    this.update((state) => ({
      ...state,
      datosUnidad: {
        ...state.datosUnidad,
        numeroEconomico,
      },
    }));
  }

  /**
   * Actualiza el número de placa de la unidad de arrastre.
   * @param numeroPlaca Nuevo número de placa.
   */
  public setDatosUnidadNumeroPlaca(numeroPlaca: string): void {
    this.update((state) => ({
      ...state,
      datosUnidad: {
        ...state.datosUnidad,
        numeroPlaca,
      },
    }));
  }

  /**
   * Actualiza el país emisor de la unidad de arrastre.
   * @param paisEmisor Nuevo país emisor.
   */
  public setDatosUnidadPaisEmisor(paisEmisor: string): void {
    this.update((state) => ({
      ...state,
      datosUnidad: {
        ...state.datosUnidad,
        paisEmisor,
      },
    }));
  }

  /**
   * Actualiza el estado de la unidad de arrastre.
   * @param estado Nuevo estado.
   */
  public setDatosUnidadEstado(estado: string): void {
    this.update((state) => ({
      ...state,
      datosUnidad: {
        ...state.datosUnidad,
        estado,
      },
    }));
  }

  /**
   * Actualiza el tipo de vehículo de la unidad de arrastre.
   * @param tipoVehiculo Nuevo tipo de vehículo.
   */
  public setDatosUnidadTipoVehiculo(tipoVehiculo: string): void {
    this.update((state) => ({
      ...state,
      datosUnidad: {
        ...state.datosUnidad,
        tipoVehiculo,
      },
    }));
  }

  /**
   * Actualiza el identificador de la unidad de arrastre.
   * @param idDeVehiculo Nuevo identificador.
   */
  public setDatosUnidadIdDeVehiculo(idDeVehiculo: string): void {
    this.update((state) => ({
      ...state,
      datosUnidad: {
        ...state.datosUnidad,
        idDeVehiculo,
      },
    }));
  }
  /**
   * Actualiza el identificador de la unidad de arrastre.
   * @param idDeVehiculo Nuevo identificador.
   */
  public setDatosUnidadIdDeUnidad(idDeVehiculoUnidad: string): void {
    this.update((state) => ({
      ...state,
      datosUnidad: {
        ...state.datosUnidad,
        idDeVehiculoUnidad,
      },
    }));
  }
  /**
   * Actualiza el color de la unidad de arrastre.
   * @param colorVehiculo Nuevo color.
   */
  public setDatosUnidadColorVehiculo(colorVehiculo: string): void {
    this.update((state) => ({
      ...state,
      datosUnidad: {
        ...state.datosUnidad,
        colorVehiculo,
      },
    }));
  }

  /**
   * Actualiza el número de segunda placa de la unidad de arrastre.
   * @param numero2daPlaca Nuevo número de segunda placa.
   */
  public setDatosUnidadNumero2daPlaca(numero2daPlaca: string): void {
    this.update((state) => ({
      ...state,
      datosUnidad: {
        ...state.datosUnidad,
        numero2daPlaca,
      },
    }));
  }

  /**
   * Actualiza el estado de la segunda placa de la unidad de arrastre.
   * @param estado2daPlaca Nuevo estado de la segunda placa.
   */
  public setDatosUnidadEstado2daPlaca(estado2daPlaca: string): void {
    this.update((state) => ({
      ...state,
      datosUnidad: {
        ...state.datosUnidad,
        estado2daPlaca,
      },
    }));
  }

  /**
   * Actualiza el país emisor de la segunda placa de la unidad de arrastre.
   * @param paisEmisor2daPlaca Nuevo país emisor de la segunda placa.
   */
  public setDatosUnidadPaisEmisor2daPlaca(paisEmisor2daPlaca: string): void {
    this.update((state) => ({
      ...state,
      datosUnidad: {
        ...state.datosUnidad,
        paisEmisor2daPlaca,
      },
    }));
  }

  /**
   * Actualiza la descripción de la unidad de arrastre.
   * @param descripcion Nueva descripción.
   */
  public setDatosUnidadDescripcion(descripcion: string): void {
    this.update((state) => ({
      ...state,
      datosUnidad: {
        ...state.datosUnidad,
        descripcion,
      },
    }));
  }

  public establecerSeccion(seccion: boolean[]): void {
    this.update({ seccion });
  }

  public establecerFormaValida(formaValida: boolean[]): void {
    this.update({ formaValida });
  }

  public setDirectorGeneral(directorGeneral: DirectorGeneralData): void {
    this.update({ directorGeneral });
  }

  public setParqueVehicular(parqueVehicular: VehiculoTabla[]): void {
    this.update({ parqueVehicular });
  }

  public setUnidadesArrastre(unidadesArrastre: UnidadTabla[]): void {
    this.update({ unidadesArrastre });
  }
}