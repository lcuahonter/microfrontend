import { Store, StoreConfig } from '@datorama/akita';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { Injectable } from '@angular/core';
import { Mercancia } from '../../shared/models/modificacion.enum';

/**
 * Interfaz que representa el estado de Solicitud260211.
 */
export interface Solicitud110208State {
  id: number | null;
  /** ID de la solicitud */
  idSolicitud: number | null;
  /**
   * El valor de entidadFederativa.
   */
  entidadFederativa: string;
  /**
   * El valor de bloque.
   */
  bloque: string;
  /**
   * El valor de fraccionArancelariaForm.
   */
  fraccionArancelariaForm: string;
  /**
   * El valor de registroProductoForm.
   */
  registroProductoForm: string;
  /**
   * El valor de nombreComercialForm.
   */
  nombreComercialForm: string;
  /**
   * El valor de fechaInicio.
   */
  fechaInicio: string;
  /**
   * El valor de fechaFinal.
   */
  fechaFinal: string;
  /**
   * El valor de tercerOperador.
   */
  tercerOperador: string;
  /**
   * El valor de marca.
   */
  marca: string;
  /**
   * El valor de cantidad.
   */
  cantidad: string;
  /**
   * El valor de umc.
   */
  umc: string;
  /**
   * El valor de valorDeLa.
   */
  valorDeLa: string;
  /**
   * El valor de complementoDescripcion.
   */
  complementoDescripcion: string;
  /**
   * El valor de nFactura.
   */
  nFactura: string;
  /**
   * El valor de tipoDeFactura.
   */
  tipoDeFactura: string;
  /**
   * El valor de fechaFactura.
   */
  fechaFactura: string;
  /**
   * El valor de ciudad.
   */
  ciudad: string;
  /**
   * El valor de calle.
   */
  calle: string;
  /**
   * El valor de numeroLetra.
   */
  numeroLetra: string;
  /**
   * El valor de lada.
   */
  lada: string;
  /**
   * El valor de telefono.
   */
  telefono: string;
  /**
   * El valor de fax.
   */
  fax: string;
  /**
   * El valor de correoElectronico.
   */
  correoElectronico: string;
  /**
   * El valor de paisDestino.
   */
  paisDestino: string;
  /**
   * El valor de nombres.
   */
  nombres: string;
  /**
   * El valor de primerApellido.
   */
  primerApellido: string;
  /**
   * El valor de segundoApellido.
   */
  segundoApellido: string;
  /**
   * El valor de numeroFiscal.
   */
  numeroFiscal: string;
  /**
   * El valor de razonSocial.
   */
  razonSocial: string;
  /**
   * El valor de medioTransporte.
   */
  medioTransporte: string;
  /**
   * El valor de rutaCompleta.
   */
  rutaCompleta: string;
  /**
   * El valor de puertoDeEmbarque.
   */
  puertoDeEmbarque: string;
  /**
   * El valor de puertoDeDesembarque.
   */
  puertoDeDesembarque: string;
  /**
   * El valor de observaciones.
   */
  observaciones: string;
  /** Lista de idiomas disponibles. */
  idioma: Catalogo[];
  /**
   * El valor de entidadFederativaCertificado.
   */
  entidadFederativaCertificado: string;
  /**
   * El valor de representacionFederal.
   */
  representacionFederal: string;

  /**
   * Datos del formulario relacionados con los detalles del certificado.
   * Estructura dinámica y flexible.
   */
  formDatosCertificado: { [key: string]: unknown };
  /** Lista de entidades federativas disponibles */
  entidadFederativaDatos?: Catalogo[];

  /** Lista de representaciones federales disponibles */
  representacionFederalDatos?: Catalogo[];

  /** Catálogo de idiomas disponibles. */
  idiomaDatos?: Catalogo[];
  /** Representación federal seleccionada */
  representacionFederalSeleccion: Catalogo;
  /**
   * Objeto que contiene banderas booleanas para validar formularios.
   * Cada clave representa una sección del formulario.
   */
  formaValida: { [key: string]: boolean };
  /**
   * @description
   * Lista de mercancías disponibles para seleccionar o procesar.
   */
  disponiblesDatos: Mercancia[];
  /**
   * @description
   * Tabla que contiene las mercancías agregadas o registradas en el formulario.
   */
  mercanciaTabla: Mercancia[];
  /**
   * @description
   * Contiene los valores del formulario de certificado.
   */
  formCertificado: { [key: string]: unknown };
  /**
   * @description
   * Estado o catálogo seleccionado actualmente.
   */
  estado: Catalogo;
  /**
   * @description
   * Objeto que almacena los valores del formulario de mercancía.
   */
  mercanciaForm: { [key: string]: unknown };
  /** Datos generales del destinatario en formulario dinámico */
  formDatosDelDestinatario: { [key: string]: unknown };
  /** Datos del destinatario en formulario dinámico */
  formDestinatario: { [key: string]: unknown };
  /** Datos generales del destinatario en formulario dinámico */
  destinatarioForm: { [key: string]: unknown };
  /** Lista de países destino como catálogo */
  paisDestin: Catalogo[];
  /** País destino seleccionado */
  paisDestinSeleccion: Catalogo;
  /** Catálogo del medio de transporte seleccionado */
  medioDeTransporteSeleccion: Catalogo;
  /** Lista de medios de transporte disponibles */
  medioDeTransporte: Catalogo[];
    /** Formulario dinámico de transporte. */
  formTransporte?: { [key: string]: unknown };
}
/**
 * Función para crear el estado inicial de Solicitud110208State.
 * @returns {Solicitud110208State} El estado inicial de Solicitud110208State.
 */
export function createInitialState(): Solicitud110208State {
  return {
    id: null,
    idSolicitud: 0,
    /**
     * El valor de entidadFederativa.
     */
    entidadFederativa: '',
    /**
     * El valor de bloque.
     */
    bloque: '',
    /**
     * El valor de fraccionArancelariaForm.
     */
    fraccionArancelariaForm: '',
    /**
     * El valor de registroProductoForm.
     */
    registroProductoForm: '',
    /**
     * El valor de nombreComercialForm.
     */
    nombreComercialForm: '',
    /**
     * El valor de fechaInicio.
     */
    fechaInicio: '',
    /**
     * El valor de fechaFinal.
     */
    fechaFinal: '',
    /**
     * El valor de tercerOperador.
     */
    tercerOperador: '',
    /**
     * El valor de marca.
     */
    marca: '',
    /**
     * El valor de cantidad.
     */
    cantidad: '',
    /**
     * El valor de umc.
     */
    umc: '',
    /**
     * El valor de valorDeLa.
     */
    valorDeLa: '',
    /**
     * El valor de complementoDescripcion.
     */
    complementoDescripcion: '',
    /**
     * El valor de nFactura.
     */
    nFactura: '',
    /**
     * El valor de tipoDeFactura.
     */
    tipoDeFactura: '',
    /**
     * El valor de fechaFactura.
     */
    fechaFactura: '',
    /**
     * El valor de ciudad.
     */
    ciudad: '',
    /**
     * El valor de calle.
     */
    calle: '',
    /**
     * El valor de numeroLetra.
     */
    numeroLetra: '',
    /**
     * El valor de lada.
     */
    lada: '',
    /**
     * El valor de telefono.
     */
    telefono: '',
    /**
     * El valor de fax.
     */
    fax: '',
    /**
     * El valor de correoElectronico.
     */
    correoElectronico: '',
    /**
     * El valor de paisDestino.
     */
    paisDestino: '',
    /**
     * El valor de nombres.
     */
    nombres: '',
    /**
     * El valor de primerApellido.
     */
    primerApellido: '',
    /**
     * El valor de segundoApellido.
     */
    segundoApellido: '',
    /**
     * El valor de numeroFiscal.
     */
    numeroFiscal: '',
    /**
     * El valor de razonSocial.
     */
    razonSocial: '',
    /**
     * El valor de medioTransporte.
     */
    medioTransporte: '',
    /**
     * El valor de rutaCompleta.
     */
    rutaCompleta: '',
    /**
     * El valor de puertoDeEmbarque.
     */
    puertoDeDesembarque: '',

    /**
     * El valor de observaciones.
     */
    observaciones: '',
    /**
     * El valor de idioma.
     */
    idioma: [],
    /**
     * El valor de entidadFederativaCertificado.
     */
    entidadFederativaCertificado: '',
    /**
     * El valor de representacionFederal.
     */
    representacionFederal: '',

    /** Formulario de datos adicionales del certificado */
    formDatosCertificado: {
      observacionesDates: '',
      idiomaDates: '',
      precisaDates: '',
      EntidadFederativaDates: '',
      representacionFederalDates: '',
    },
    /** Lista de entidades federativas disponibles */
    entidadFederativaDatos: [],

    /** Lista de representaciones federales disponibles */
    representacionFederalDatos: [],
    /** Lista de idiomas disponibles */
    idiomaDatos: [],
    /** Representación federal seleccionada */
    representacionFederalSeleccion: { id: -1, descripcion: '' },
    /** Estado de validación de los diferentes formularios */
    formaValida: {
      certificado: true,
      datos: true,
      destinatrio: true,
      datosDestinatario: true,
    },
      formTransporte: {
      medioDeTransporte: '',
      rutaCompleta: '',
      puertoDeEmbarque: '',
      puertoDeDesembarque: '',
    },
    disponiblesDatos: [],
    mercanciaTabla: [],
    formCertificado: {
      si: false,
      entidadFederativa: '',
      bloque: '',
      nombreComercialForm: '',
      registroProductoForm: '',
      fraccionArancelariaForm: '',
      fechaInicioInput: '',
      fechaFinalInput: '',
      nombres: '',
      primerApellido: '',
      segundoApellido: '',
      numeroDeRegistroFiscal: '',
      razonSocial: '',
      pais: '',
      ciudad: '',
      telefono: '',
      correoElectronico: '',
      numeroLetra: '',
      calle: '',
    },
    estado: {
      id: -1,
      descripcion: '',
    },
    mercanciaForm: {
      fraccionArancelaria: '',
      nombreComercialMercancia: '',
      nombreTecnico: '',
      nombreIngles: '',
      otrasInstancias: '',
      criterioParaConferirOrigen: '',
      marca: '',
      cantidad: '',
      umc: '',
      valorMercancia: '',
      complementoDescripcion: '',
      masaBruta: '',
      unidadMedidaMasaBruta: '',
      numeroFactura: '',
      tipoFactura: '',
      fechaFinal: '',
      normaOrigen: '',
      id: '',
      fechaFinalInput: '',
      nalad: '',
    },
    formDatosDelDestinatario: {
      nombres: '',
      primerApellido: '',
      segundoApellido: '',
      numeroDeRegistroFiscal: '',
      razonSocial: '',
    },
    destinatarioForm: {
      medioDeTransporte: '',
    },
    formDestinatario: {
      paisDestin: '',
      ciudad: '',
      calle: '',
      numeroLetra: '',
      lada: '',
      telefono: '',
      fax: '',
      correoElectronico: '',
    },
    /** País destino seleccionado */
    paisDestinSeleccion: { id: -1, descripcion: '' },
    /** Lista de países destino */
    paisDestin: [],
    /** Lista de medios de transporte */
    medioDeTransporte: [],
    puertoDeEmbarque: '',
    /** Medio de transporte seleccionado */
    medioDeTransporteSeleccion: { id: -1, descripcion: '' }
  };
}

/**
 * Decorador Injectable para hacer que la tienda esté disponible a nivel raíz.
 */
@Injectable({
  providedIn: 'root',
})
/**
 * Decorador StoreConfig para configurar la tienda con un nombre y una opción de restablecimiento.
 * @param {Object} config - El objeto de configuración.
 * @param {string} config.name - El nombre de la tienda.
 * @param {boolean} config.resettable - Indica si la tienda es restablecible.
 */
@StoreConfig({ name: 'tramite110208', resettable: true })
export class Tramite110208Store extends Store<Solicitud110208State> {
  /**
   * Crea una instancia de Tramite31601Store.
   * Inicializa la tienda con el estado inicial.
   */
  constructor() {
    super(createInitialState());
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
   * @method setformTransporte
   * @description
   * Actualiza los datos del formulario de transporte en el almacén.
   * @param values Objeto que contiene los valores a actualizar en el formulario de transporte.
   */
  setformTransporte(values: {
    [key: string]: undefined | boolean | string | number | object;
  }): void {
    this.update((state) => ({
      formTransporte: {
        ...state.formTransporte,
        ...values,
      },
    }));
  }

  /**
   * Establece el estado de entidadFederativa.
   * @param entidadFederativa - El valor de entidadFederativa.
   */
  public setEntidadFederativa(entidadFederativa: string): void {
    this.update((state) => ({
      ...state,
      entidadFederativa,
    }));
  }
  /**
   * Establece el estado de bloque.
   * @param bloque - El valor de bloque.
   */
  public setBloque(bloque: string): void {
    this.update((state) => ({
      ...state,
      bloque,
    }));
  }
  /**
   * Establece el estado de fraccionArancelariaForm.
   * @param fraccionArancelariaForm - El valor de fraccionArancelariaForm.
   */
  public setFraccionArancelariaForm(fraccionArancelariaForm: string): void {
    this.update((state) => ({
      ...state,
      fraccionArancelariaForm,
    }));
  }
  /**
   * Establece el estado de registroProductoForm.
   * @param registroProductoForm - El valor de registroProductoForm.
   */
  public setRegistroProductoForm(registroProductoForm: string): void {
    this.update((state) => ({
      ...state,
      registroProductoForm,
    }));
  }
  /**
   * Establece el estado de nombreComercialForm.
   * @param nombreComercialForm - El valor de nombreComercialForm.
   */
  public setNombreComercialForm(nombreComercialForm: string): void {
    this.update((state) => ({
      ...state,
      nombreComercialForm,
    }));
  }
  /**
   * Establece el estado de fechaInicio.
   * @param fechaInicio - El valor de fechaInicio.
   */
  public setFechaInicio(fechaInicio: string): void {
    this.update((state) => ({
      ...state,
      fechaInicio,
    }));
  }
  /**
   * Establece el estado de fechaFinal.
   * @param fechaFinal - El valor de fechaFinal.
   */
  public setFechaFinal(fechaFinal: string): void {
    this.update((state) => ({
      ...state,
      fechaFinal,
    }));
  }
  /**
   * Establece el estado de tercerOperador.
   * @param tercerOperador - El valor de tercerOperador.
   */
  public setTercerOperador(tercerOperador: string): void {
    this.update((state) => ({
      ...state,
      tercerOperador,
    }));
  }
  /**
   * Establece el estado de marca.
   * @param marca - El valor de marca.
   */
  public setMarca(marca: string): void {
    this.update((state) => ({
      ...state,
      marca,
    }));
  }
  /**
   * Establece el estado de cantidad.
   * @param cantidad - El valor de cantidad.
   */
  public setCantidad(cantidad: string): void {
    this.update((state) => ({
      ...state,
      cantidad,
    }));
  }
  /**
   * Establece el estado de umc.
   * @param umc - El valor de umc.
   */
  public setUmc(umc: string): void {
    this.update((state) => ({
      ...state,
      umc,
    }));
  }
  /**
   * Establece el estado de valorDeLa.
   * @param valorDeLa - El valor de valorDeLa.
   */
  public setValorDeLa(valorDeLa: string): void {
    this.update((state) => ({
      ...state,
      valorDeLa,
    }));
  }
  /**
   * Establece el estado de complementoDescripcion.
   * @param complementoDescripcion - El valor de complementoDescripcion.
   */
  public setComplementoDescripcion(complementoDescripcion: string): void {
    this.update((state) => ({
      ...state,
      complementoDescripcion,
    }));
  }
  /**
   * Establece el estado de nFactura.
   * @param nFactura - El valor de nFactura.
   */
  public setNFactura(nFactura: string): void {
    this.update((state) => ({
      ...state,
      nFactura,
    }));
  }
  /**
   * Establece el estado de tipoDeFactura.
   * @param tipoDeFactura - El valor de tipoDeFactura.
   */
  public setTipoDeFactura(tipoDeFactura: string): void {
    this.update((state) => ({
      ...state,
      tipoDeFactura,
    }));
  }
  /**
   * Establece el estado de fechaFactura.
   * @param fechaFactura - El valor de fechaFactura.
   */
  public setFechaFactura(fechaFactura: string): void {
    this.update((state) => ({
      ...state,
      fechaFactura,
    }));
  }
  /**
   * Establece el estado de ciudad.
   * @param ciudad - El valor de ciudad.
   */
  public setCiudad(ciudad: string): void {
    this.update((state) => ({
      ...state,
      ciudad,
    }));
  }
  /**
   * Establece el estado de calle.
   * @param calle - El valor de calle.
   */
  public setCalle(calle: string): void {
    this.update((state) => ({
      ...state,
      calle,
    }));
  }
  /**
   * Establece el estado de numeroLetra.
   * @param numeroLetra - El valor de numeroLetra.
   */
  public setNumeroLetra(numeroLetra: string): void {
    this.update((state) => ({
      ...state,
      numeroLetra,
    }));
  }
  /**
   * Establece el estado de lada.
   * @param lada - El valor de lada.
   */
  public setLada(lada: string): void {
    this.update((state) => ({
      ...state,
      lada,
    }));
  }
  /**
   * Establece el estado de telefono.
   * @param telefono - El valor de telefono.
   */
  public setTelefono(telefono: string): void {
    this.update((state) => ({
      ...state,
      telefono,
    }));
  }
  /**
   * Establece el estado de fax.
   * @param fax - El valor de fax.
   */
  public setFax(fax: string): void {
    this.update((state) => ({
      ...state,
      fax,
    }));
  }
  /**
   * Establece el estado de correoElectronico.
   * @param correoElectronico - El valor de correoElectronico.
   */
  public setCorreoElectronico(correoElectronico: string): void {
    this.update((state) => ({
      ...state,
      correoElectronico,
    }));
  }
  /**
   * Establece el estado de paisDestino.
   * @param paisDestino - El valor de paisDestino.
   */
  public setPaisDestino(paisDestino: string): void {
    this.update((state) => ({
      ...state,
      paisDestino,
    }));
  }
  /**
   * Establece el estado de nombres.
   * @param nombres - El valor de nombres.
   */
  public setNombres(nombres: string): void {
    this.update((state) => ({
      ...state,
      nombres,
    }));
  }
  /**
   * Establece el estado de primerApellido.
   * @param primerApellido - El valor de primerApellido.
   */
  public setPrimerApellido(primerApellido: string): void {
    this.update((state) => ({
      ...state,
      primerApellido,
    }));
  }
  /**
   * Establece el estado de segundoApellido.
   * @param segundoApellido - El valor de segundoApellido.
   */
  public setSegundoApellido(segundoApellido: string): void {
    this.update((state) => ({
      ...state,
      segundoApellido,
    }));
  }
  /**
   * Establece el estado de numeroFiscal.
   * @param numeroFiscal - El valor de numeroFiscal.
   */
  public setNumeroFiscal(numeroFiscal: string): void {
    this.update((state) => ({
      ...state,
      numeroFiscal,
    }));
  }
  /**
   * Establece el estado de razonSocial.
   * @param razonSocial - El valor de razonSocial.
   */
  public setRazonSocial(razonSocial: string): void {
    this.update((state) => ({
      ...state,
      razonSocial,
    }));
  }
  /**
   * Establece el estado de medioTransporte.
   * @param medioTransporte - El valor de medioTransporte.
   */
  public setMedioTransporte(medioTransporte: string): void {
    this.update((state) => ({
      ...state,
      medioTransporte,
    }));
  }
  /**
   * Establece el estado de rutaCompleta.
   * @param rutaCompleta - El valor de rutaCompleta.
   */
  public setRutaCompleta(rutaCompleta: string): void {
    this.update((state) => ({
      ...state,
      rutaCompleta,
    }));
  }
  /**
   * Establece el estado de puertoDeEmbarque.
   * @param puertoDeEmbarque - El valor de puertoDeEmbarque.
   */
  public setPuertoEmbarque(puertoDeEmbarque: string): void {
    this.update((state) => ({
      ...state,
      puertoDeEmbarque,
    }));
  }
  /**
   * Establece el estado de puertoDeDesembarque.
   * @param puertoDeDesembarque - El valor de puertoDeDesembarque.
   */
  public setPuertoDesembarque(puertoDeDesembarque: string): void {
    this.update((state) => ({
      ...state,
      puertoDeDesembarque,
    }));
  }
  /**
   * Establece el estado de observaciones.
   * @param observaciones - El valor de observaciones.
   */
  public setObservaciones(observaciones: string): void {
    this.update((state) => ({
      ...state,
      observaciones,
    }));
  }
  /**
   * Establece el estado de idioma.
   * @param idioma - El valor de idioma.
   */
  public setIdioma(idioma: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      idioma,
    }));
  }
  /**
   * Establece el estado de entidadFederativaCertificado.
   * @param entidadFederativaCertificado - El valor de entidadFederativaCertificado.
   */
  public setEntidadFederativaCertificado(
    entidadFederativaCertificado: string
  ): void {
    this.update((state) => ({
      ...state,
      entidadFederativaCertificado,
    }));
  }
  /**
   * Establece el estado de representacionFederal.
   * @param representacionFederal - El valor de representacionFederal.
   */
  public setRepresentacionFederal(representacionFederal: string): void {
    this.update((state) => ({
      ...state,
      representacionFederal,
    }));
  }

  /**
   * Establece el catálogo de idiomaDatosSeleccion en el estado de la tienda.
   *
   * @param idiomaDatosSeleccion - Una lista de objetos de tipo `Catalogo` que representan las idiomaDatosSeleccion a establecer.
   */
  setIdiomaSeleccion(idiomaDatosSeleccion: Catalogo): void {
    this.update((state) => ({
      ...state,
      idiomaDatosSeleccion,
    }));
  }

  /**
   * Establece los valores del formulario de fechas del certificado en el almacén.
   *
   * @param {Object} values - Un objeto con las claves y valores para actualizar las fechas del certificado.
   *
   * @returns {void} - No devuelve ningún valor.
   */
  setFormDatosCertificado(values: { [key: string]: unknown }): void {
    this.update((state) => ({
      formDatosCertificado: {
        ...state.formDatosCertificado,
        ...values,
      },
    }));
  }

  /**
   * Establece los datos de la representación federal en el almacén.
   *
   * @param {Catalogo[]} representacionFederalDatos - Un array de objetos `Catalogo` con los datos de la representación federal.
   *
   * @returns {void} - No devuelve ningún valor.
   */
  setRepresentacionFederalDatos(representacionFederalDatos: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      representacionFederalDatos,
    }));
  }

  /**
   * Establece los datos de la entidad federativa en el almacén.
   *
   * @param {Catalogo[]} entidadFederativaDatos - Un array de objetos `Catalogo` con los datos de la entidad federativa.
   *
   * @returns {void} - No devuelve ningún valor.
   */
  setEntidadFederativaDatos(entidadFederativaDatos: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      entidadFederativaDatos,
    }));
  }

  /**
   * Establece los representacionFederalSeleccion de países en el almacén.
   *
   * @param {Catalogo} representacionFederalSeleccion - Un array de objetos `Catalogo` que representa los representacionFederalSeleccion de países.
   *
   * @returns {void} - No devuelve ningún valor.
   */
  setRepresentacionFederalDatosSeleccion(
    representacionFederalSeleccion: Catalogo
  ): void {
    this.update((state) => ({
      ...state,
      representacionFederalSeleccion,
    }));
  }

  /**
   * Establece el estado de validación del formulario en el almacén.
   *
   * @param {Object} formaValida - Un objeto donde las claves son los nombres de los campos del formulario y los valores son booleanos que indican si el campo es válido o no.
   *
   * @returns {void} - No devuelve ningún valor.
   */
  setFormValida(formaValida: { [key: string]: boolean }): void {
    this.update((state) => {
      const IS_VALID = { ...state.formaValida, ...formaValida };
      return {
        ...state,
        formaValida: IS_VALID,
      };
    });
  }

  /**
   * @method setDatosConfidencialesProductor
   * @description
   * Actualiza el estado de datos confidenciales del productor en el almacén.
   * @param datosConfidencialesProductor Valor booleano que indica si los datos del productor son confidenciales.
   * */
  setDisponsiblesDatos(disponiblesDatos: Mercancia[]): void {
    this.update((state) => ({
      ...state,
      disponiblesDatos,
    }));
  }

  /**
   * @method setmercanciaTabla
   * @description
   * Actualiza la tabla de mercancías en el almacén.
   * @param mercanciaTabla Array de objetos `Mercancia` que representa la tabla de mercancías.
   */
  public setmercanciaTabla(mercanciaTabla: Mercancia[]): void {
    this.update((STATE) => {
      // Si el array está vacío o se pasa más de un elemento, reemplazar toda la tabla
      if (mercanciaTabla.length === 0 || mercanciaTabla.length > 1) {
        return { ...STATE, mercanciaTabla: [...mercanciaTabla] };
      }

      const LISTAEXISTENTE = STATE.mercanciaTabla || [];
      const NUEVOARTICULO = { ...mercanciaTabla[0] };

      if (NUEVOARTICULO.id === 0) {
        // Agregar nuevo elemento con una identificación generada
        NUEVOARTICULO.id = (LISTAEXISTENTE.length || 0) + 1;
        const UPDATEDLIST = [...LISTAEXISTENTE, NUEVOARTICULO];
        return { ...STATE, mercanciaTabla: UPDATEDLIST };
      }

      // Actualizar el elemento existente cuando id > 0
      const UPDATEDLIST = LISTAEXISTENTE.map((ITEM) =>
        ITEM.id === NUEVOARTICULO.id ? { ...ITEM, ...NUEVOARTICULO } : ITEM
      );
      return { ...STATE, mercanciaTabla: UPDATEDLIST };
    });
  }

  /**
   * @method replaceMercanciaTabla
   * @description
   * Reemplaza completamente la tabla de mercancías en el almacén.
   * @param mercanciaTabla Array de objetos `Mercancia` que reemplazará toda la tabla.
   */
  public replaceMercanciaTabla(mercanciaTabla: Mercancia[]): void {
    this.update((STATE) => ({
      ...STATE,
      mercanciaTabla: [...mercanciaTabla]
    }));
  }

  /**
   * @method setFormCertificadoGenric
   * @description
   * Actualiza los datos del formulario de certificado en el almacén.
   * @param values Objeto que contiene los valores a actualizar en el formulario de certificado.
   */
  setFormCertificadoGenric(values: {
    [key: string]: undefined | boolean | string | number | object;
  }): void {
    this.update((state) => ({
      formCertificado: {
        ...state.formCertificado,
        ...values,
      },
    }));
  }

  /**
   * @method setEstado
   * @description
   * Actualiza el estado seleccionado en el almacén.
   * @param estado Objeto de tipo `Catalogo` que contiene la información del estado a actualizar.
   */
  setEstado(estado: Catalogo): void {
    this.update((state) => ({
      ...state,
      estado,
    }));
  }

  /**
   * @method setFormMercancia
   * @description
   * Actualiza los datos del formulario de mercancía en el almacén.
   * @param values Objeto que contiene los valores a actualizar en el formulario de mercancía.
   */
  setFormMercancia(values: {
    [key: string]: undefined | boolean | string | number | object;
  }): void {
    this.update((state) => ({
      mercanciaForm: {
        ...state.mercanciaForm,
        ...values,
      },
    }));
  }
  /**
 * Actualiza el estado del formulario de destinatario con nuevos valores
 * @param values Objeto con los valores a actualizar en el formulario.
 */
  setDestinatarioForm(values: { [key: string]: unknown }): void {
    this.update((state) => ({
      destinatarioForm: {
        ...state.destinatarioForm,
        ...values,
      },
    }));
  }

  /**
   * @method setFormDatosDelDestinatario
   * @description
   * Actualiza los datos del formulario de destinatario en el almacén.
   * @param values Objeto que contiene los valores a actualizar en el formulario de destinatario.
   */
  setFormDatosDelDestinatario(values: {
    [key: string]: undefined | boolean | string | number | object;
  }): void {
    this.update((state) => ({
      formDatosDelDestinatario: {
        ...state.formDatosDelDestinatario,
        ...values,
      },
    }));
  }
  /**
 * @method setFormDestinatario
 * @description
 * Actualiza los datos del formulario de destinatario en el almacén.
 * @param values Objeto que contiene los valores a actualizar en el formulario de destinatario.
 */
  setFormDestinatario(values: {
    [key: string]: undefined | boolean | string | number | object;
  }): void {
    this.update((state) => ({
      formDestinatario: {
        ...state.formDestinatario,
        ...values,
      },
    }));
  }
  /**
  * Actualiza el estado con la lista de medios de transporte
  * @param medioDeTransporte Arreglo de catálogos con los medios de transporte
  */
  setMedioDeTransporte(medioDeTransporte: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      medioDeTransporte,
    }));
  }
  /**
   * Establece los medioDeTransporteSeleccion de países en el almacén.
   * 
   * @param {Catalogo} medioDeTransporteSeleccion - Un array de objetos `Catalogo` que representa los medioDeTransporteSeleccion de países.
   * 
   * @returns {void} - No devuelve ningún valor.
   */
  setMedioDeTransporteSeleccion(medioDeTransporteSeleccion: Catalogo): void {
    this.update((state) => ({
      ...state,
      medioDeTransporteSeleccion,
    }));
  }
  /**
   * Establece los paisDestinSeleccion de países en el almacén.
   *
   * @param {Catalogo} paisDestinSeleccion - Un array de objetos `Catalogo` que representa los paisDestinSeleccion de países.
   *
   * @returns {void} - No devuelve ningún valor.
   */
  setPaisDestinSeleccion(paisDestinSeleccion: Catalogo): void {
    this.update((state) => ({
      ...state,
      paisDestinSeleccion,
    }));
  }
}
