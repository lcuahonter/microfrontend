/**
 * @module Agregar220401Store
 * @description Módulo que define el estado y las acciones para la solicitud 220401.
 */

import { Store, StoreConfig } from '@datorama/akita';
import { CatalogoResponse } from '@libs/shared/data-access-user/src';
import { Injectable } from '@angular/core';

/**
 * @interface solicitud220401State
 * @description Interfaz que define la estructura del estado para la solicitud 220401.
 */

/**
 * Interfaz que define el estado de la solicitud 220401.
 */

export interface Solicitud220401State {
  /** Tipo de producto asociado a la solicitud. */
  tipoProducto: string;
  /** Certificación asociada a la solicitud. */
  certificada: string;

  /** Identificación del medio de transporte. */
  identificationDelTransporte: string;

  /** Estado seleccionado, obtenido de un catálogo de respuestas. */
  selectedEstado: CatalogoResponse | null;

  /** Número de contenedor para el transporte de la mercancía. */
  numerodeContenedor: string;

  /** Fecha de embarque de la mercancía. */
  fechdeEmbarque: string;

  /** Número de flejes de seguridad. */
  numerodeFlejes: string;

  /** Datos del certificado asociado a la solicitud. */
  datoscertificado: string;

  /** Fracción arancelaria correspondiente a la mercancía. */
  fraccionArancelaria: string;

  /** Fecha de caducidad de la mercancía o certificado. */
  fechaCaducidad: string;

  /** Nombre o identificación del animal o producto. */
  nombreIdentificacion: string;

  /** Raza del animal, en caso de aplicar. */
  raza: string;

  /** Edad del animal, si corresponde. */
  edadAnimal: string;

  /** Color del animal o producto, si aplica. */
  color: string;

  /** Número de autorización CITES, si es necesario. */
  numeroAutorizacionCITES: string;

  /** Aduana de ingreso o salida de la mercancía. */
  aduana: string;

  /** Código OSIA asociado a la solicitud. */
  osia: string;

  /** Sexo del animal, si aplica. */
  sexo: string;

  /** Otro dato relevante, si no existe un campo específico. */
  otro: string;

  /** Punto de ingreso al país o región. */
  puntoIngreso: string;

  /** Nombre del establecimiento donde se realiza la verificación. */
  nombreEstablecimientoCheck: string;

  /** Número de autorización del establecimiento. */
  numeroAutorizacionCheck: string;

  /** Tipo de actividad realizada en el establecimiento. */
  tipoActividadCheck: string;

  /** Otro dato relevante para la verificación. */
  otroCheck: string;

  /** Fecha estimada de arribo de la mercancía o animales. */
  fechaArribo: string;

  /** Justificación de la solicitud, si es necesaria. */
  Justificacion: string;

  /** Indica si la solicitud está exenta de pago. */
  exentoDePago: string;

  /** Llave o referencia del pago realizado. */
  llaveDePago: string;

  /** Fecha en la que se realizó el pago. */
  fechaPago: string;

  Banco: string;
  especie: string;
  funcionZootecnica: string;
  mercancia: string;
  paisDestino: string;
  nombreEstablecimiento: string;
  tipoActividad: string;
  aduanaSalida: string;
  oisaSalida: string;
  regimenMercancia: string;
  paisOrigen: string;
  exentoPago: string;
  presentacion: string;
  marcaEmbarque: string;

  /** Tipo de transporte utilizado para la mercancía o animales. */
  tipoDeTransporte: string;
  tratamiento: string;
  uso: string;
  radioBotonAnimal: string;
  radioBotonQFBA: string;
  radioBotonProducto: string;
}

/**
 * @function createInitialState
 * @description Función que crea el estado inicial para la solicitud 220401.
 * @returns {Solicitud220401State} El estado inicial.
 */
export function createInitialState(): Solicitud220401State {
  return {
    /** Tipo de producto asociado a la solicitud. */
    tipoProducto: '',
    /** Certificación asociada a la solicitud. */
    certificada: '',

    /** Identificación del medio de transporte. */
    identificationDelTransporte: '',

    /** Estado seleccionado, obtenido de un catálogo de respuestas. */
    selectedEstado: null,

    /** Número de contenedor para el transporte de la mercancía. */
    numerodeContenedor: '',

    /** Fecha de embarque de la mercancía. */
    fechdeEmbarque: '',

    /** Número de flejes de seguridad. */
    numerodeFlejes: '',

    /** Datos del certificado asociado a la solicitud. */
    datoscertificado: '',

    /** Fracción arancelaria correspondiente a la mercancía. */
    fraccionArancelaria: '',

    /** Fecha de caducidad de la mercancía o certificado. */
    fechaCaducidad: '',

    /** Nombre o identificación del animal o producto. */
    nombreIdentificacion: '',

    /** Raza del animal, en caso de aplicar. */
    raza: '',

    /** Edad del animal, si corresponde. */
    edadAnimal: '',

    /** Color del animal o producto, si aplica. */
    color: '',

    /** Número de autorización CITES, si es necesario. */
    numeroAutorizacionCITES: '',

    /** Aduana de ingreso o salida de la mercancía. */
    aduana: '',

    /** Código OSIA asociado a la solicitud. */
    osia: '',

    /** Sexo del animal, si aplica. */
    sexo: '',

    /** Otro dato relevante, si no existe un campo específico. */
    otro: '',

    /** Punto de ingreso al país o región. */
    puntoIngreso: '',

    /** Nombre del establecimiento donde se realiza la verificación. */
    nombreEstablecimientoCheck: '',

    /** Número de autorización del establecimiento. */
    numeroAutorizacionCheck: '',

    /** Tipo de actividad realizada en el establecimiento. */
    tipoActividadCheck: '',

    /** Otro dato relevante para la verificación. */
    otroCheck: '',

    /** Fecha estimada de arribo de la mercancía o animales. */
    fechaArribo: '',

    /** Justificación de la solicitud, si es necesaria. */
    Justificacion: '',

    /** Indica si la solicitud está exenta de pago. */
    exentoDePago: '',

    /** Llave o referencia del pago realizado. */
    llaveDePago: '',

    /** Fecha en la que se realizó el pago. */
    fechaPago: '',
    Banco: '',
    especie: '',
    funcionZootecnica: '',
    mercancia: '',
    paisDestino: '',
    nombreEstablecimiento: '',
    tipoActividad: '',
    aduanaSalida: '',
    oisaSalida: '',
    regimenMercancia: '',
    paisOrigen: '',
    exentoPago: '',
    tipoDeTransporte: '',
    tratamiento: '',
    presentacion: '',
    marcaEmbarque: '',
    uso: '',
    radioBotonAnimal: '',
    radioBotonQFBA: '',
    radioBotonProducto: ''
  };

}

/**
 * @class Agregar220401Store
 * @extends {Store<Solicitud220401State>}
 * @description Clase que maneja el estado y las acciones para la solicitud 220401.
 */
@Injectable({
  providedIn: 'root'
})
@StoreConfig({ name: 'agregar220401', resettable: true })
export class Agregar220401Store extends Store<Solicitud220401State> {
  constructor() {
    super(createInitialState());
  }

  /**
   * @method settipoProducto
   * @description Establece el valor de 'tipoProducto'.
   * @param {string} tipoProducto - El valor de 'tipoProducto'.
   */
  public settipoProducto(tipoProducto: string): void {
    this.update((state) => ({
      ...state,
      tipoProducto,
    }));
  }

  /**
   * @method setCertificada
   * @description Establece el valor de 'certificada'.
   * @param {string} certificada - El valor de 'certificada'.
   */
  public setCertificada(certificada: string): void {
    this.update((state) => ({
      ...state,
      certificada,
    }));
  }

  /**
   * @method setidentificationDelTransporte
   * @description Establece el valor de 'identificationDelTransporte'.
   * @param {string} identificationDelTransporte - El valor de 'identificationDelTransporte'.
   */
  public setidentificationDelTransporte(identificationDelTransporte: string): void {
    this.update((state) => ({
      ...state,
      identificationDelTransporte,
    }));
  }

  /**
   * @method setJustification
   * @description Establece el valor de 'selectedEstado'.
   * @param {CatalogoResponse} selectedEstado - El valor de 'selectedEstado'.
   */
  public setJustification(selectedEstado: CatalogoResponse): void {
    this.update((state) => ({
      ...state,
      selectedEstado,
    }));
  }

  /**
   * @method setnumerodeContenedor
   * @description Establece el valor de 'numerodeContenedor'.
   * @param {string} numerodeContenedor - El valor de 'numerodeContenedor'.
   */
  public setnumerodeContenedor(numerodeContenedor: string): void {
    this.update((state) => ({
      ...state,

      numerodeContenedor,
    }));
  }

  /**
   * @method setfetchdeEmbarque
   * @description Establece el valor de 'fechdeEmbarque'.
   * @param {string} fechdeEmbarque - El valor de 'fechdeEmbarque'.
   */
  public setfetchdeEmbarque(fechdeEmbarque: string): void {
    this.update((state) => ({
      ...state,
      fechdeEmbarque,
    }));
  }

  /**
   * @method setnumerodeFlejes
   * @description Establece el valor de 'numerodeFlejes'.
   * @param {string} numerodeFlejes - El valor de 'numerodeFlejes'.
   */
  public setnumerodeFlejes(numerodeFlejes: string): void {
    this.update((state) => ({
      ...state,
      numerodeFlejes,
    }));
  }

  /**
   * @method setdatoscertificado
   * @description Establece el valor de 'datoscertificado'.
   * @param {string} datoscertificado - El valor de 'datoscertificado'.
   */
  public setdatoscertificado(datoscertificado: string): void {
    this.update((state) => ({
      ...state,
      datoscertificado,
    }));
  }

  /**
   * @method setfraccionArancelaria
   * @description Establece el valor de 'fraccionArancelaria'.
   * @param {string} fraccionArancelaria - El valor de 'fraccionArancelaria'.
   */
  public setfraccionArancelaria(fraccionArancelaria: string): void {
    this.update((state) => ({
      ...state,
      fraccionArancelaria,
    }));
  }

  /**
   * @method setfechaCaducidad
   * @description Establece el valor de 'fechaCaducidad'.
   * @param {string} fechaCaducidad - El valor de 'fechaCaducidad'.
   */
  public setfechaCaducidad(fechaCaducidad: string): void {
    this.update((state) => ({
      ...state,
      fechaCaducidad,
    }));
  }

  /**
   * @method setnombreIdentificacion
   * @description Establece el valor de 'nombreIdentificacion'.
   * @param {string} nombreIdentificacion - El valor de 'nombreIdentificacion'.
   */
  public setnombreIdentificacion(nombreIdentificacion: string): void {
    this.update((state) => ({
      ...state,
      nombreIdentificacion,
    }));
  }

  /**
   * @method setraza
   * @description Establece el valor de 'raza'.
   * @param {string} raza - El valor de 'raza'.
   */
  public setraza(raza: string): void {
    this.update((state) => ({
      ...state,
      raza,
    }));
  }

  /**
   * @method setedadAnimal
   * @description Establece el valor de 'edadAnimal'.
   * @param {string} edadAnimal - El valor de 'edadAnimal'.
   */
  public setedadAnimal(edadAnimal: string): void {
    this.update((state) => ({
      ...state,
      edadAnimal,
    }));
  }

  /**
   * @method setcolor
   * @description Establece el valor de 'color'.
   * @param {string} color - El valor de 'color'.
   */
  public setcolor(color: string): void {
    this.update((state) => ({
      ...state,
      color,
    }));
  }

  /**
   * @method setnumeroAutorizacionCITES
   * @description Establece el valor de 'numeroAutorizacionCITES'.
   * @param {string} numeroAutorizacionCITES - El valor de 'numeroAutorizacionCITES'.
   */
  public setnumeroAutorizacionCITES(numeroAutorizacionCITES: string): void {
    this.update((state) => ({
      ...state,
      numeroAutorizacionCITES,
    }));
  }

  /**
   * @method setaduana
   * @description Establece el valor de 'aduana'.
   * @param {string} aduana - El valor de 'aduana'.
   */
  public setaduana(aduana: string): void {
    this.update((state) => ({
      ...state,
      aduana,
    }));
  }

  /**
   * @method setosia
   * @description Establece el valor de 'osia'.
   * @param {string} osia - El valor de 'osia'.
   */
  public setosia(osia: string): void {
    this.update((state) => ({
      ...state,
      osia,
    }));
  }

  /**
   * @method setsexo
   * @description Establece el valor de 'sexo'.
   * @param {string} sexo - El valor de 'sexo'.
   */
  public setsexo(sexo: string): void {
    this.update((state) => ({
      ...state,
      sexo,
    }));
  }

  /**
   * @method setotro
   * @description Establece el valor de 'otro'.
   * @param {string} otro - El valor de 'otro'.
   */
  public setotro(otro: string): void {
    this.update((state) => ({
      ...state,
      otro,
    }));
  }

  /**
   * @method setpuntoIngreso
   * @description Establece el valor de 'puntoIngreso'.
   * @param {string} puntoIngreso - El valor de 'puntoIngreso'.
   */
  public setpuntoIngreso(puntoIngreso: string): void {
    this.update((state) => ({
      ...state,
      puntoIngreso,
    }));
  }

  /**
   * @method setnombreEstablecimientoCheck
   * @description Establece el valor de 'nombreEstablecimientoCheck'.
   * @param {string} nombreEstablecimientoCheck - El valor de 'nombreEstablecimientoCheck'.
   */
  public setnombreEstablecimientoCheck(nombreEstablecimientoCheck: string): void {
    this.update((state) => ({
      ...state,
      nombreEstablecimientoCheck,
    }));
  }

  /**
   * @method setnumeroAutorizacionCheck
   * @description Establece el valor de 'numeroAutorizacionCheck'.
   * @param {string} numeroAutorizacionCheck - El valor de 'numeroAutorizacionCheck'.
   */
  public setnumeroAutorizacionCheck(numeroAutorizacionCheck: string): void {
    this.update((state) => ({
      ...state,
      numeroAutorizacionCheck,
    }));
  }

  /**
   * @method settipoActividadCheck
   * @description Establece el valor de 'tipoActividadCheck'.
   * @param {string} tipoActividadCheck - El valor de 'tipoActividadCheck'.
   */
  public settipoActividadCheck(tipoActividadCheck: string): void {
    this.update((state) => ({
      ...state,
      tipoActividadCheck,
    }));
  }

  /**
   * @method setotroCheck
   * @description Establece el valor de 'otroCheck'.
   * @param {string} otroCheck - El valor de 'otroCheck'.
   */
  public setotroCheck(otroCheck: string): void {
    this.update((state) => ({
      ...state,
      otroCheck,
    }));
  }

  /**
   * @method setfechaArribo
   * @description Establece el valor de 'fechaArribo'.
   * @param {string} fechaArribo - El valor de 'fechaArribo'.
   */
  public setfechaArribo(fechaArribo: string): void {
    this.update((state) => ({
      ...state,
      fechaArribo,
    }));
  }

  /**
   * @method setJustificacion
   * @description Establece el valor de 'Justificacion'.
   * @param {string} Justificacion - El valor de 'Justificacion'.
   */
  public setJustificacion(Justificacion: string): void {
    this.update((state) => ({
      ...state,
      Justificacion,
    }));
  }

  /**
   * @method setexentoDePago
   * @description Establece el valor de 'exentoDePago'.
   * @param {string} exentoDePago - El valor de 'exentoDePago'.
   */
  public setexentoDePago(exentoDePago: string): void {
    this.update((state) => ({
      ...state,
      exentoDePago,
    }));
  }

  /**
   * @method setllaveDePago
   * @description Establece el valor de 'llaveDePago'.
   * @param {string} llaveDePago - El valor de 'llaveDePago'.
   */
  public setllaveDePago(llaveDePago: string): void {
    this.update((state) => ({
      ...state,
      llaveDePago,
    }));
  }

  /**
   * @method setfechaPago
   * @description Establece el valor de 'fechaPago'.
   * @param {string} fechaPago - El valor de 'fechaPago'.
   */
  public setfechaPago(fechaPago: string): void {
    this.update((state) => ({
      ...state,
      fechaPago,
    }));
  }
  /**
   * @method setBanco
   * @description Establece el valor de 'Banco'.
   * @param {string} Banco - El valor de 'Banco'.
   */
  public setBanco(Banco: string): void {
    this.update((state) => ({
      ...state,
      Banco,
    }));
  }
  /**
   * @method setespecie
   * @description Establece el valor de 'especie'.
   * @param {string} especie - El valor de 'especie'.
   */

  public setespecie(especie: string): void {
    this.update((state) => ({
      ...state,
      especie,
    }));
  }
  /**
   * @method setfuncionZootecnica
   * @description Establece el valor de 'funcionZootecnica'.
   * @param {string} funcionZootecnica - El valor de 'funcionZootecnica'.
   */
  public setfuncionZootecnica(funcionZootecnica: string): void {
    this.update((state) => ({
      ...state,
      funcionZootecnica,
    }));
  }

  /**
   * @method setmercancia
   * @description Establece el valor de 'mercancia'.
   * @param {string} mercancia - El valor de 'mercancia'.
   */
  public setmercancia(mercancia: string): void {
    this.update((state) => ({
      ...state,
      mercancia,
    }));
  }

  /**
   * @method setpaisDestino
   * @description Establece el valor de 'paisDestino'.
   * @param {string} paisDestino - El valor de 'paisDestino'.
   */
  public setpaisDestino(paisDestino: string): void {
    this.update((state) => ({
      ...state,
      paisDestino,
    }));
  }

  /**
   * @method setnombreEstablecimiento
   * @description Establece el valor de 'nombreEstablecimiento'.
   * @param {string} nombreEstablecimiento - El valor de 'nombreEstablecimiento'.
   */
  public setnombreEstablecimiento(nombreEstablecimiento: string): void {
    this.update((state) => ({
      ...state,
      nombreEstablecimiento,
    }));
  }

  /**
   * @method settipoActividad
   * @description Establece el valor de 'tipoActividad'.
   * @param {string} tipoActividad - El valor de 'tipoActividad'.
   */

  public settipoActividad(tipoActividad: string): void {
    this.update((state) => ({
      ...state,
      tipoActividad,
    }));
  }

  /**
   * @method setaduanaSalida
   * @description Establece el valor de 'aduanaSalida'.
   * @param {string} aduanaSalida - El valor de 'aduanaSalida'.
   */
  public setaduanaSalida(aduanaSalida: string): void {
    this.update((state) => ({
      ...state,
      aduanaSalida,
    }));
  }
  /**
   * @method setoisaSalida
   * @description Establece el valor de 'oisaSalida'.
   * @param {string} oisaSalida - El valor de 'oisaSalida'.
   */
  public setoisaSalida(oisaSalida: string): void {
    this.update((state) => ({
      ...state,
      oisaSalida,
    }));
  }

  /**
   * @method setregimenMercancia
   * @description Establece el valor de 'regimenMercancia'.
   * @param {string} regimenMercancia - El valor de 'regimenMercancia'.
   */
  public setregimenMercancia(regimenMercancia: string): void {
    this.update((state) => ({
      ...state,
      regimenMercancia,
    }));
  }
  /**
   * @method setpaisOrigen
   * @description Establece el valor de 'paisOrigen'.
   * @param {string} paisOrigen - El valor de 'paisOrigen'.
   */
  public setpaisOrigen(paisOrigen: string): void {
    this.update((state) => ({
      ...state,
      paisOrigen,
    }));
  }
  /**
   * @method setexentoPago
   * @description Establece el valor de 'exentoPago'.
   * @param {string} exentoPago - El valor de 'exentoPago'.
   */
  public setexentoPago(exentoPago: string): void {
    this.update((state) => ({
      ...state,
      exentoPago,
    }));
  }
  /**
   * Actualiza el estado con el valor proporcionado para el tipo de transporte.
   *
   * @param tipoDeTransporte - El nuevo valor de tipo de transporte a establecer en el estado.
   */
  public settipoDeTransporte(tipoDeTransporte: string): void {
    this.update((state) => ({
      ...state,
      tipoDeTransporte,
    }));
  }
  /**
   * Actualiza el estado con el valor proporcionado para el tratamiento.
   *
   * @param tratamiento - El nuevo valor de tratamiento a establecer en el estado.
   */
  public setTratamiento(tratamiento: string): void {
    this.update((state) => ({
      ...state,
      tratamiento,
    }));
  }
  /**
   * Actualiza el estado con el valor proporcionado para la presentación.
   * @param presentacion - El nuevo valor de presentación a establecer en el estado.
   * */
  public setPresentacion(presentacion: string): void {
    this.update((state) => ({
      ...state,
      presentacion,
    }))
  }
  /**
   * Actualiza el estado con el valor proporcionado para la marca de embarque.
   * @param marcaEmbarque - El nuevo valor de marca de embarque a establecer en el estado.
   * */

  public setMarcaEmbarque(marcaEmbarque: string): void {
    this.update((state) => ({
      ...state,
      marcaEmbarque
    }))
  }

  /** * Actualiza el estado con el valor proporcionado para el uso.
   * @param uso - El nuevo valor de uso a establecer en el estado.  
   * */
  public setUso(uso: string): void {
    this.update((state) => ({
      ...state,
      uso
    }))
  }

  /**
   * Actualiza el estado con el valor proporcionado para el radio botón de producto.
   * @param radioBotonProducto - El nuevo valor del radio botón de producto a establecer en el estado.
   */

  public setradioBotonProducto(radioBotonProducto: string): void {
    this.update((state) => ({
      ...state,
      radioBotonProducto,
    }));
  }

  /**
   * Actualiza el estado con el valor proporcionado para el radio botón de animal.
   * @param radioBotonAnimal - El nuevo valor del radio botón de animal a establecer en el estado.
   */
  public setradioBotonAnimal(radioBotonAnimal: string): void {
    this.update((state) => ({
      ...state,
      radioBotonAnimal,
    }));
  }
  /**
   * Actualiza el estado con el valor proporcionado para el radio botón QFBA.
   * @param radioBotonQFBA - El nuevo valor del radio botón QFBA a establecer en el estado.
   */
  public setradioBotonQFBA(radioBotonQFBA: string): void {
    this.update((state) => ({
      ...state,
      radioBotonQFBA,
    }));
  }

}