import { ColumnasTabla, SeleccionadasTabla } from '../models/registro.model';
import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
/**
 * Representa un catálogo con un identificador y una descripción.
 */
export interface Catalogo {
  id: number;
  descripcion: string;
}
/**
 * Estado inicial para la interfaz del trámite 110201.
 */
export interface Solicitud110201State {
  idSolicitud: number | null;
  tratado: string;
  pais: string;
  fraccionArancelaria: string;
  numeroRegistro: string;
  nombreComercial: string;
  fechaInicial: string;
  fechaFinal: string;
  archivo: string;
  observaciones: string;
  presica: string;
  presenta: string;
  idioma: string;
  entidad: string;
  representacion: string;
  nombre: string;
  apellidoPrimer: string;
  apellidoSegundo: string;
  numeroFiscal: string;
  razonSocial: string;
  ciudad: string;
  calle: string;
  numeroLetra: string;
  lada: string;
  telefono: string;
  fax: string;
  correoElectronico: string;
  nacion: string;
  transporte: string;
  fraccionMercanciaArancelaria: string;
  nombreTecnico: string;
  nombreEnIngles: string;
  criterioParaConferir: string;
  marca: string;
  cantidad: string;
  umc: string;
  valorDelaMercancia: string;
  complementoDelaDescripcion: string;
  masaBruta: string;
  nombreComercialDelaMercancia: string;
  unidadMedida: string;
  tipoFactura: string;
  fecha: string;
  numeroFactura: string;
  justificacion: string;
  casillaVerificacion: string;
  idiomaDescripcion?: string;
  entidadDescripcion?: string;
  representacionDescripcion?: string;
  tratadoDescripcion?: string;
  paisDescripcion?: string;
  transporteDescripcion?: string;
  nacionDescripcion?: string;
  mercanciaSeleccionadasTablaData: SeleccionadasTabla[];
    /**
     * @property {ColumnasTabla[]} mercancias_disponibles - Tabla de mercancías agregadas.
     * @description
     * Arreglo que almacena las mercancías disponibles, cada una representada por un objeto `ColumnasTabla`.
     */
    mercancias_disponibles: ColumnasTabla[];
}
/**
 * Crea el estado inicial para la solicitud del trámite 110201.
 * @returns Estado inicial de tipo `Solicitud110201State`.
 */
export function createInitialState(): Solicitud110201State {
  return {
    idSolicitud: 0,
    tratado: '',
    tratadoDescripcion: '',
    paisDescripcion: '',
    pais: '',
    fraccionArancelaria: '',
    numeroRegistro: '',
    nombreComercial: '',
    fechaInicial: '',
    fechaFinal: '',
    archivo: '',
    observaciones: '',
    presica: '',
    presenta: '',
    idioma: '',
    idiomaDescripcion: '',
    entidad: '',
    entidadDescripcion: '',
    representacionDescripcion: '',
    nacionDescripcion: '',
    transporteDescripcion: '',
    representacion: '',
    nombre: '',
    apellidoPrimer: '',
    apellidoSegundo: '',
    numeroFiscal: '',
    razonSocial: '',
    ciudad: '',
    calle: '',
    numeroLetra: '',
    lada: '',
    telefono: '',
    fax: '',
    correoElectronico: '',
    nacion: '',
    transporte: '',
    fraccionMercanciaArancelaria: '',
    nombreTecnico: '',
    nombreEnIngles: '',
    criterioParaConferir: '',
    marca: '',
    cantidad: '',
    umc: '',
    valorDelaMercancia: '',
    complementoDelaDescripcion: '',
    masaBruta: '',
    nombreComercialDelaMercancia: '',
    unidadMedida: '',
    tipoFactura: '',
    fecha: '',
    numeroFactura: '',
    justificacion: '',
    casillaVerificacion: '',
    mercancias_disponibles: [],
    mercanciaSeleccionadasTablaData: []
  };
}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite110201', resettable: true })
export class Tramite110201Store extends Store<Solicitud110201State> {
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

 public setMercanciaTabla(mercanciaTabla: ColumnasTabla[]): void {
    this.update((state) => {

      const EXISTING_LIST = state.mercancias_disponibles;

      const UPDATED_LIST = [...EXISTING_LIST];

      for (const NEW_DEST of mercanciaTabla) {
        const INDEX = EXISTING_LIST.findIndex(
          (existing) => existing.id === NEW_DEST.id
        );

        if (INDEX !== -1) {
          UPDATED_LIST[INDEX] = NEW_DEST;
        } else {
          UPDATED_LIST.push(NEW_DEST);
        }
      }

      return {
        ...state,
        mercancias_disponibles: UPDATED_LIST,
      };
    });
  }
    /**
   * Actualiza los datos de la solicitud en el estado.
   * @param {DatosMercancia[]} mercanciaDatos - Lista de datos de la solicitud.
   */
  public setDatosMercancia(mercanciaSeleccionadasTablaData: SeleccionadasTabla[]): void {
    this.update((state) => ({
      ...state,
      mercanciaSeleccionadasTablaData,
    }));
  }
  /**
   * Establece el catálogo de tratados.
   * @param tratado Lista de objetos de tipo `Catalogo`.
   */
  public setTratado(tratado: string):void {
    this.update((state) => ({
      ...state,
      tratado,
    }));
  }

  /** Establece la descripción del tratado.
   * @param tratadoDescripcion Cadena que representa la descripción del tratado.
   */
  public setTratadoDescripciones(tratadoDescripcion: string):void {
    this.update((state) => ({
      ...state,
      tratadoDescripcion,
    }));
  }

  /** Establece la descripción del país.
   *  @param paisDescripcion Cadena que representa la descripción del país.
   */
  public setPaisDescripcion(paisDescripcion: string):void {
    this.update((state) => ({
      ...state,
      paisDescripcion,
    }));
  }

  /** Establece la descripción del transporte.
   * @param umcDescripcion Cadena que representa la descripción del transporte.
   */
  public setUmcDescripcion(umcDescripcion: string): void {
    this.update((state) => ({
      ...state,
      umcDescripcion,
    }));
  }

  /** Establece la descripción del tipo de factura.
   * @param tipoFacturaDescripcion Cadena que representa la descripción del tipo de factura.
   **/
  public setTipoFacturaDescripcion(tipoFacturaDescripcion: string): void {
    this.update((state) => ({
      ...state,
      tipoFacturaDescripcion,
    }));
  }

  /** Establece la descripción de la unidad de medida.
   * @param unidadMedidaDescripcion Cadena que representa la descripción de la unidad de medida.
   * */
  public setUnidadMedidaDescripcion(unidadMedidaDescripcion: string): void {
    this.update((state) => ({
      ...state,
      unidadMedidaDescripcion,
    }));
  }
  
  /** Establece la descripción del idioma.
   * @param idiomaDescripcion Cadena que representa la descripción del idioma.
   * */
  public setIdiomaDescripcion(idiomaDescripcion: string):void {
    this.update((state) => ({
      ...state,
      idiomaDescripcion,
    }));
  }

  /** Establece la descripción de la entidad.
   * @param entidadDescripcion Cadena que representa la descripción de la entidad.
   */
  public setEntidadDescripcion(entidadDescripcion: string):void {
    this.update((state) => ({
      ...state,
      entidadDescripcion,
    }));
  }
  /** Establece la descripción de la representación.
   *    @param representacionDescripcion Cadena que representa la descripción de la representación.
   * */
  public setRepresentacionDescripcion(representacionDescripcion: string):void {
    this.update((state) => ({
      ...state,
      representacionDescripcion,
    }));
  }
  
  /** Establece la descripción de la nación.
   *  @param nacionDescripcion Cadena que representa la descripción de la nación.
   * */
  public setNacionDescripcion(nacionDescripcion: string):void {
    this.update((state) => ({
      ...state,
      nacionDescripcion,
    }));
  }

  /** Establece la descripción del transporte.
   * @param transporteDescripcion Cadena que representa la descripción del transporte.
   * */
  public setTransporteDescripcion(transporteDescripcion: string):void {
    this.update((state) => ({
      ...state,
      transporteDescripcion,
    }));
  }

  /**
   * Establece el catálogo de países.
   * @param pais Lista de objetos de tipo `Catalogo`.
   */
  public setPais(pais: string):void {
    this.update((state) => ({
      ...state,
      pais,
    }));
  }
  /**
   * Establece la fracción arancelaria.
   * @param fraccionArancelaria Cadena que representa la fracción arancelaria.
   */
  public setFraccionArancelaria(fraccionArancelaria: string):void {
    this.update((state) => ({
      ...state,
      fraccionArancelaria,
    }));
  }
  /**
   * Establece la fracción arancelaria de la mercancía.
   * @param fraccionMercanciaArancelaria Cadena que representa la fracción arancelaria de la mercancía.
   */
  public setfraccionMercanArancelaria(fraccionMercanciaArancelaria: string):void {
    this.update((state) => ({
      ...state,
      fraccionMercanciaArancelaria,
    }));
  }
  /**
   * Establece el nombre técnico de la mercancía.
   * @param nombreTecnico Cadena que representa el nombre técnico.
   */
  public setnombretecnico(nombreTecnico: string):void {
    this.update((state) => ({
      ...state,
      nombreTecnico,
    }));
  }
  /**
   * Establece el nombre en inglés de la mercancía.
   * @param nombreEnIngles Cadena que representa el nombre en inglés.
   */
  public setnomreeningles(nombreEnIngles: string):void {
    this.update((state) => ({
      ...state,
      nombreEnIngles,
    }));
  }
  /**
   * Establece el criterio para conferir origen.
   * @param criterioParaConferir Cadena que representa el criterio para conferir origen.
   */
  public setcriterioparaconferir(criterioParaConferir: string):void {
    this.update((state) => ({
      ...state,
      criterioParaConferir,
    }));
  }
  /**
   * Establece la marca de la mercancía.
   * @param marca Cadena que representa la marca.
   */
  public setmarca(marca: string):void {
    this.update((state) => ({
      ...state,
      marca,
    }));
  }
  /**
   * Establece la cantidad de la mercancía.
   * @param cantidad Cadena que representa la cantidad.
   */
  public setcantidad(cantidad: string):void {
    this.update((state) => ({
      ...state,
      cantidad,
    }));
  }
  /**
   * Establece el catálogo de unidades de medida comercial (UMC).
   * @param umc Lista de objetos de tipo `Catalogo`.
   */
  public setUMC(umc: string):void {
    this.update((state) => ({
      ...state,
      umc,
    }));
  }
  /**
   * Establece el catálogo de unidades de medida.
   * @param unidadMedida Lista de objetos de tipo `Catalogo`.
   */
  public setUnidadMedida(unidadMedida: string):void {
    this.update((state) => ({
      ...state,
      unidadMedida,
    }));
  }
  /**
   * Establece el catálogo de tipos de factura.
   * @param tipoFactura Lista de objetos de tipo `Catalogo`.
   */
  public setTipoFactura(tipoFactura: string):void {
    this.update((state) => ({
      ...state,
      tipoFactura,
    }));
  }
  /**
   * Establece la fecha de la factura.
   * @param fecha Cadena que representa la fecha.
   */
  public setFecha(fecha: string):void {
    this.update((state) => ({
      ...state,
      fecha,
    }));
  }
  /**
   * Establece el número de factura.
   * @param numeroFactura Cadena que representa el número de factura.
   */
  public setNFactura(numeroFactura: string):void {
    this.update((state) => ({
      ...state,
      numeroFactura,
    }));
  }
  /**
   * Establece la justificación.
   * @param justificacion Cadena que representa la justificación.
   */
  public setJustificacion(justificacion: string):void {
    this.update((state) => ({
      ...state,
      justificacion,
    }));
  }
  /**
   * Establece el catálogo de transporte.
   * @param valorDelaMercancia Lista de objetos de tipo `Catalogo` o `null`.
   */
  public setvalordelamercancia(valorDelaMercancia: string):void {
    this.update((state) => ({
      ...state,
      valorDelaMercancia,
    }));
  }
  /**
   * Establece el valor de la casilla de verificación.
   * @param complementoDelaDescripcion Cadena que representa el valor de la casilla.
   */
  public setcomplementodeladescripcion(complementoDelaDescripcion: string):void {
    this.update((state) => ({
      ...state,
      complementoDelaDescripcion,
    }));
  }
  /**
   * Establece el valor de la masa bruta de la mercancía.
   * @param masaBruta Cadena que representa la masa bruta.
   */
  public setmasabruta(masaBruta: string):void {
    this.update((state) => ({
      ...state,
      masaBruta,
    }));
  }
  /**
   * Establece el nombre comercial de la mercancía.
   * @param nombreComercialDelaMercancia Cadena que representa el nombre comercial de la mercancía.
   */
  public setnombrecomercialdelamercancia(nombreComercialDelaMercancia: string):void {
    this.update((state) => ({
      ...state,
      nombreComercialDelaMercancia,
    }));
  }
  /**
   * Establece el número de registro.
   * @param numeroRegistro Cadena que representa el número de registro.
   */
  public setNumRegistro(numeroRegistro: string):void {
    this.update((state) => ({
      ...state,
      numeroRegistro,
    }));
  }
  /**
   * Establece el nombre comercial.
   * @param nombreComercial Cadena que representa el nombre comercial.
   */
  public setNomComercial(nombreComercial: string):void {
    this.update((state) => ({
      ...state,
      nombreComercial,
    }));
  }
  /**
   * Establece la fecha de inicio del bloque.
   * @param fechaInicial Cadena que representa la fecha de inicio del bloque.
   */
  public setFechInicioB(fechaInicial: string):void {
    this.update((state) => ({
      ...state,
      fechaInicial,
    }));
  }
  /**
   * Establece la fecha de fin del bloque.
   * @param fechaFinal Cadena que representa la fecha de fin del bloque.
   */
  public setFechFinB(fechaFinal: string):void {
    this.update((state) => ({
      ...state,
      fechaFinal,
    }));
  }
  /**
   * Establece el archivo adjunto.
   * @param archivo Cadena que representa el archivo adjunto.
   */
  public setArchivo(archivo: string):void {
    this.update((state) => ({
      ...state,
      archivo,
    }));
  }
  /**
   * Establece las observaciones.
   * @param observaciones Cadena que representa las observaciones.
   */
  public setObservaciones(observaciones: string):void {
    this.update((state) => ({
      ...state,
      observaciones,
    }));
  }
  /**
   * Establece el valor de presica.
   * @param presica Cadena que representa el valor de presica.
   */
  public setPresica(presica: string):void {
    this.update((state) => ({
      ...state,
      presica,
    }));
  }
  /**
   * Establece el valor de presenta.
   * @param presenta Cadena que representa el valor de presenta.
   */
  public setPresenta(presenta: string):void {
    this.update((state) => ({
      ...state,
      presenta,
    }));
  }
  /**
   * Establece el catálogo de idiomas.
   * @param idioma Lista de objetos de tipo `Catalogo` o `null`.
   */
  public setIdioma(idioma: string):void {
    this.update((state) => ({
      ...state,
      idioma,
    }));
  }
  /**
   * Establece el catálogo de entidades.
   * @param entidad Lista de objetos de tipo `Catalogo` o `null`.
   */
  public setEntidad(entidad: string):void {
    this.update((state) => ({
      ...state,
      entidad,
    }));
  }
  /**
   * Establece el catálogo de representaciones.
   * @param representacion Lista de objetos de tipo `Catalogo` o `null`.
   */
  public setRepresentacion(representacion: string):void {
    this.update((state) => ({
      ...state,
      representacion,
    }));
  }
  /**
   * Establece el nombre del solicitante.
   * @param nombre Cadena que representa el nombre del solicitante.
   */
  public setNombre(nombre: string):void {
    this.update((state) => ({
      ...state,
      nombre,
    }));
  }
  /**
   * Establece el primer apellido del solicitante.
   * @param apellidoPrimer Cadena que representa el primer apellido del solicitante.
   */
  public setApellidoPrimer(apellidoPrimer: string):void {
    this.update((state) => ({
      ...state,
      apellidoPrimer,
    }));
  }
  /**
   * Establece el segundo apellido del solicitante.
   * @param apellidoSegundo Cadena que representa el segundo apellido del solicitante.
   */
  public setApellidoSegundo(apellidoSegundo: string):void {
    this.update((state) => ({
      ...state,
      apellidoSegundo,
    }));
  }
  /**
   * Establece el número fiscal del solicitante.
   * @param numeroFiscal Cadena que representa el número fiscal del solicitante.
   */
  public setNumeroFiscal(numeroFiscal: string):void {
    this.update((state) => ({
      ...state,
      numeroFiscal,
    }));
  }
  /**
   * Establece la razón social.
   * @param razonSocial Cadena que representa la razón social.
   */
  public setRazonSocial(razonSocial: string):void {
    this.update((state) => ({
      ...state,
      razonSocial,
    }));
  }
  /**
   * Establece la ciudad del solicitante.
   * @param ciudad Cadena que representa la ciudad del solicitante.
   */
  public setCiudad(ciudad: string):void {
    this.update((state) => ({
      ...state,
      ciudad,
    }));
  }
  /**
   * Establece la calle del solicitante.
   * @param calle Cadena que representa la calle del solicitante.
   */
  public setCalle(calle: string):void {
    this.update((state) => ({
      ...state,
      calle,
    }));
  }
  /**
   * Establece el número o letra de la dirección del solicitante.
   * @param numeroLetra Cadena que representa el número o letra de la dirección.
   */
  public setNumeroLetra(numeroLetra: string):void {
    this.update((state) => ({
      ...state,
      numeroLetra,
    }));
  }
  /**
   * Establece la lada del número telefónico.
   * @param lada Cadena que representa la lada.
   */
  public setLada(lada: string):void {
    this.update((state) => ({
      ...state,
      lada,
    }));
  }
  /**
   * Establece el número telefónico.
   * @param telefono Cadena que representa el número telefónico.
   */
  public setTelefono(telefono: string):void {
    this.update((state) => ({
      ...state,
      telefono,
    }));
  }
  /**
   * Establece el número de fax.
   * @param fax Cadena que representa el número de fax.
   */
  public setFax(fax: string):void {
    this.update((state) => ({
      ...state,
      fax,
    }));
  }
  /**
   * Establece el correo electrónico.
   * @param correoElectronico Cadena que representa el correo electrónico.
   */
  public setCorreoElectronico(correoElectronico: string):void {
    this.update((state) => ({
      ...state,
      correoElectronico,
    }));
  }
  /**
   * Establece el catálogo de naciones.
   * @param nacion Lista de objetos de tipo `Catalogo` o `null`.
   */
  public setNacion(nacion: string):void {
    this.update((state) => ({
      ...state,
      nacion,
    }));
  }
  /**
   * Establece el catálogo de transportes.
   * @param transporte Lista de objetos de tipo `Catalogo` o `null`.
   */
  public setTransporte(transporte: string):void {
    this.update((state) => ({
      ...state,
      transporte,
    }));
  }
  /**
   * Establece el valor de la casilla de verificación.
   * @param casillaVerificacion Cadena que representa el valor de la casilla.
   */
  public setCheckbox(casillaVerificacion: string):void {
    this.update((state) => ({
      ...state,
      casillaVerificacion,
    }));
  }

  /**
   * Limpia los datos de la solicitud
   */
  public limpiarSolicitud():void {
    this.reset();
  }
}
