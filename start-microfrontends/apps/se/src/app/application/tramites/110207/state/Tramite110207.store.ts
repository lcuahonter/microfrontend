import { DetallesDelTransporte, GrupoRepresentativo } from '../models/registro.model';
import { InsumosDisponibles, Mercancia } from '../../../shared/models/modificacion.enum';
import { Store, StoreConfig } from '@datorama/akita';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { Injectable } from '@angular/core';
/**
 * Estado inicial para la interfaz del trámite 110207.
 */
export interface Solicitud110207State {
  /** Indica si el certificado es requerido. */
  paisBloques: Catalogo[];
  /** Datos del formulario del certificado. */
  formCertificado: { [key: string]: unknown };
  /** Estado del trámite. */
  estado: Catalogo;
  /** ID de la solicitud */
  idSolicitud: number | null;
  /** Lista de tratados disponibles. */
  tratado: Catalogo[];
  /** Lista de países disponibles. */
  pais: Catalogo[];
  /** Fracción arancelaria seleccionada. */
  fraccionArancelaria: string;
  /** Número de registro del producto. */
  numeroRegistro: string;
  /** Nombre comercial del producto. */
  nombreComercial: string;
  /** Fecha inicial del trámite. */
  fechaInicial: string;
  /** Fecha final del trámite. */
  fechaFinal: string;
  /** Archivo adjunto al trámite. */
  archivo: string;
  /** Observaciones adicionales del trámite. */
  observaciones: string;
  /** Valor de presica. */
  presica: string;
  /** Valor de presenta. */
  presenta: string;
  /** Lista de idiomas disponibles. */
  idioma: Catalogo[];
  /** Lista de entidades disponibles. */
  entidad: Catalogo[];
  /** Lista de representaciones disponibles. */
  representacion: Catalogo[];
  /** Nombre del solicitante. */
  nombre: string;
  /** Primer apellido del solicitante. */
  apellidoPrimer: string;
  /** Segundo apellido del solicitante. */
  apellidoSegundo: string;
  /** Número fiscal del solicitante. */
  numeroFiscal: string;
  /** Razón social del solicitante. */
  razonSocial: string;
  /** Ciudad del solicitante. */
  ciudad: string;
  /** Calle del solicitante. */
  calle: string;
  /** Número o letra de la dirección del solicitante. */
  numeroLetra: string;
  /** Lada del número telefónico. */
  lada: string;
  /** Número telefónico del solicitante. */
  telefono: string;
  /** Número de fax del solicitante. */
  fax: string;
  /** Correo electrónico del solicitante. */
  correoElectronico: string;
  /** Lista de naciones disponibles. */
  nacion: Catalogo[];
  /** Lista de transportes disponibles. */
  transporte: Catalogo[];
  /** Fracción arancelaria de la mercancía. */
  fraccionMercanciaArancelaria: string;
  /** Nombre técnico de la mercancía. */
  nombreTecnico: string;
  /** Nombre en inglés de la mercancía. */
  nombreEnIngles: string;
  /** Criterio para conferir origen. */
  criterioParaConferir: string;
  /** Marca de la mercancía. */
  marca: string;
  /** Cantidad de la mercancía. */
  cantidad: string;
  /** Lista de unidades de medida comercial (UMC). */
  umc: Catalogo[];
  /** Valor de la mercancía. */
  valorDelaMercancia: string;
  /** Complemento de la descripción de la mercancía. */
  complementoDelaDescripcion: string;
  /** Masa bruta de la mercancía. */
  masaBruta: string;
  /** Nombre comercial de la mercancía. */
  nombreComercialDelaMercancia: string;
  /** Lista de unidades de medida disponibles. */
  unidadMedida: Catalogo[];
  /** Lista de tipos de factura disponibles. */
  tipoFactura: Catalogo[];
  /** Fecha de la factura. */
  fecha: string;
  /** Número de la factura. */
  numeroFactura: string;
  /** Justificación del trámite. */
  justificacion: string;
  /** Valor de la casilla de verificación. */
  casillaVerificacion: string;
  /** Indica si la casilla está marcada. */
  siCasilla: boolean;
  /** Ruta completa del trámite. */
  rutaCompleta: string;
  /** Puerto de embarque. */
  puertoEmbarque: string;
  /** Puerto de desembarque. */
  puertoDesembarque: string;
  /**
   * Datos del formulario relacionados con los detalles del certificado.
   * Estructura dinámica y flexible.
   */
  formDatosCertificado: { [key: string]: unknown };
  /** Lista de entidades federativas disponibles */
  entidadFederativaDatos: Catalogo[];

  /** Lista de representaciones federales disponibles */
  representacionFederalDatos: Catalogo[];

  /** Lista de idiomas disponibles como catálogo */
  idiomaDatos: Catalogo[];
  /** Representación federal seleccionada */
  representacionFederalSeleccion: Catalogo;
  /**
   * Objeto que contiene banderas booleanas para validar formularios.
   * Cada clave representa una sección del formulario.
   */
  formaValida: { [key: string]: boolean };

  /** Datos de la mercancía. */
  formulario: { [key: string]: unknown };
  /**
   * Lista de datos de mercancía  disponibles para selección.
   */
  disponiblesDatos: Mercancia[];
  /**
   * Lista de mercancías añadidas a la tabla.
   */
  mercanciaTabla: Mercancia[];

  /** Lista de mercancías seleccionadas en la tabla. */
  mercanciaSeleccionadasTabla: Mercancia[];

  /** Datos del destinatario. */
  formDatosDelDestinatario: { [key: string]: unknown };

  /** Datos del destinatario en formulario dinámico */
  formDestinatario: { [key: string]: unknown };
  
  /** Información del grupo representativo */
  grupoRepresentativo: GrupoRepresentativo;

  /** Datos generales del destinatario en formulario dinámico */
  destinatarioForm: { [key: string]: unknown };

  /** Lista de medios de transporte disponibles */
  medioDeTransporte: Catalogo[];

  /** País destino seleccionado */
  paisDestinSeleccion: Catalogo;

  /** Lista de países destino como catálogo */
  paisDestin: Catalogo[];

  /** Medio de transporte seleccionado */
  medioDeTransporteSeleccion: Catalogo,

  /**
   * Detalles del transporte en el trámite.
   */
  detallesDelTransporte: DetallesDelTransporte;

  insumosDisponiblesTabla: InsumosDisponibles[];
}
/**
 * Crea el estado inicial para la solicitud del trámite 110207.
 * @returns Estado inicial de tipo `Solicitud110207State`.
 */
export function createInitialState(): Solicitud110207State {
  return {
    formCertificado: {
      entidadFederativa: '',
      tercerOperador: false,
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
      correo: '',
      numeroLetra: '',
      calle: '',
      si: false,
    },
    idSolicitud: 0,
    tratado: [],
    pais: [],
    fraccionArancelaria: '',
    numeroRegistro: '',
    nombreComercial: '',
    fechaInicial: '',
    fechaFinal: '',
    archivo: '',
    observaciones: '',
    presica: '',
    presenta: '',
    idioma: [],
    entidad: [],
    representacion: [],
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
    nacion: [],
    transporte: [],
    fraccionMercanciaArancelaria: '',
    nombreTecnico: '',
    nombreEnIngles: '',
    criterioParaConferir: '',
    marca: '',
    cantidad: '',
    umc: [],
    valorDelaMercancia: '',
    complementoDelaDescripcion: '',
    masaBruta: '',
    nombreComercialDelaMercancia: '',
    unidadMedida: [],
    tipoFactura: [],
    fecha: '',
    numeroFactura: '',
    justificacion: '',
    casillaVerificacion: '',
    siCasilla: false,
    rutaCompleta: '',
    puertoEmbarque: '',
    puertoDesembarque: '',
    detallesDelTransporte: {
      medioDeTransporte: '',
      rutaCompleta: '',
      puertoEmbarque: '',
      puertoDesembarque: '',
      puertoTransito: '',
      nombreEmbarcacion: '',
      numeroVuelo: '',
    },
    /** Medio de transporte seleccionado */
  medioDeTransporteSeleccion: { id: -1, descripcion: '' },
    /** Formulario de datos adicionales del certificado */
    formDatosCertificado: {
      observacionesDates: '',
      idiomaDates: '',
      precisaDates: '',
      EntidadFederativaDates: '',
      representacionFederalDates: '',
    },
    grupoRepresentativo: {
      lugar: '',
      nombreExportador: '',
      empresa: '',
      cargo: '',
      telefono: '',
      correoElectronico: '',
    },
    formDatosDelDestinatario: {
      nombres: '',
      primerApellido: '',
      segundoApellido: '',
      numeroDeRegistroFiscal: '',
      razonSocial: '',
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
    formulario: {
      datosConfidencialesProductor: '',
      productorMismoExportador: '',
    },
    estado: {
      id: -1,
      descripcion: '',
    },
    paisBloques: [],
    disponiblesDatos: [],
    mercanciaTabla: [],
    mercanciaSeleccionadasTabla: [],
    /** Lista de medios de transporte */
    medioDeTransporte: [],
    /** Formulario adicional para el destinatario */
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

    insumosDisponiblesTabla: []
  };
}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite110207', resettable: true })
export class Tramite110207Store extends Store<Solicitud110207State> {
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
   * Establece el valor de la casilla de verificación.
   * @param siCasilla Indica si la casilla está marcada.
   */
  setEstablecerSiCasilla(siCasilla: boolean): void {
    this.update((state) => ({
      ...state,
      siCasilla,
    }));
  }
  /**
   * Establece el catálogo de tratados.
   * @param tratado Lista de objetos de tipo `Catalogo`.
   */
  public setTratado(tratado: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      tratado,
    }));
  }
  /**
   * Establece el catálogo de países.
   * @param pais Lista de objetos de tipo `Catalogo`.
   */
  public setPais(pais: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      pais,
    }));
  }
  /**
   * Establece la fracción arancelaria.
   * @param fraccionArancelaria Cadena que representa la fracción arancelaria.
   */
  public setFraccionArancelaria(fraccionArancelaria: string): void {
    this.update((state) => ({
      ...state,
      fraccionArancelaria,
    }));
  }
  /**
   * Establece la fracción arancelaria de la mercancía.
   * @param fraccionMercanciaArancelaria Cadena que representa la fracción arancelaria de la mercancía.
   */
  public setfraccionMercanArancelaria(
    fraccionMercanciaArancelaria: string
  ): void {
    this.update((state) => ({
      ...state,
      fraccionMercanciaArancelaria,
    }));
  }
  /**
   * Establece el nombre técnico de la mercancía.
   * @param nombreTecnico Cadena que representa el nombre técnico.
   */
  public setnombretecnico(nombreTecnico: string): void {
    this.update((state) => ({
      ...state,
      nombreTecnico,
    }));
  }
  /**
   * Establece el nombre en inglés de la mercancía.
   * @param nombreEnIngles Cadena que representa el nombre en inglés.
   */
  public setnomreeningles(nombreEnIngles: string): void {
    this.update((state) => ({
      ...state,
      nombreEnIngles,
    }));
  }
  /**
   * Establece el criterio para conferir origen.
   * @param criterioParaConferir Cadena que representa el criterio para conferir origen.
   */
  public setcriterioparaconferir(criterioParaConferir: string): void {
    this.update((state) => ({
      ...state,
      criterioParaConferir,
    }));
  }
  /**
   * Establece la marca de la mercancía.
   * @param marca Cadena que representa la marca.
   */
  public setmarca(marca: string): void {
    this.update((state) => ({
      ...state,
      marca,
    }));
  }
  /**
   * Establece la cantidad de la mercancía.
   * @param cantidad Cadena que representa la cantidad.
   */
  public setcantidad(cantidad: string): void {
    this.update((state) => ({
      ...state,
      cantidad,
    }));
  }
  /**
   * Establece el catálogo de unidades de medida comercial (UMC).
   * @param umc Lista de objetos de tipo `Catalogo`.
   */
  public setUMC(umc: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      umc,
    }));
  }
  /**
   * Establece el catálogo de unidades de medida.
   * @param unidadMedida Lista de objetos de tipo `Catalogo`.
   */
  public setUnidadMedida(unidadMedida: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      unidadMedida,
    }));
  }
  /**
   * Establece el catálogo de tipos de factura.
   * @param tipoFactura Lista de objetos de tipo `Catalogo`.
   */
  public setTipoFactura(tipoFactura: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      tipoFactura,
    }));
  }
  /**
   * Establece la fecha de la factura.
   * @param fecha Cadena que representa la fecha.
   */
  public setFecha(fecha: string): void {
    this.update((state) => ({
      ...state,
      fecha,
    }));
  }
  /**
   * Establece el número de factura.
   * @param numeroFactura Cadena que representa el número de factura.
   */
  public setNFactura(numeroFactura: string): void {
    this.update((state) => ({
      ...state,
      numeroFactura,
    }));
  }
  /**
   * Establece la justificación.
   * @param justificacion Cadena que representa la justificación.
   */
  public setJustificacion(justificacion: string): void {
    this.update((state) => ({
      ...state,
      justificacion,
    }));
  }
  /**
   * Establece el catálogo de transporte.
   * @param valorDelaMercancia Lista de objetos de tipo `Catalogo` o `null`.
   */
  public setvalordelamercancia(valorDelaMercancia: string): void {
    this.update((state) => ({
      ...state,
      valorDelaMercancia,
    }));
  }
  /**
   * Establece el valor de la casilla de verificación.
   * @param complementoDelaDescripcion Cadena que representa el valor de la casilla.
   */
  public setcomplementodeladescripcion(
    complementoDelaDescripcion: string
  ): void {
    this.update((state) => ({
      ...state,
      complementoDelaDescripcion,
    }));
  }
  /**
   * Establece el valor de la masa bruta de la mercancía.
   * @param masaBruta Cadena que representa la masa bruta.
   */
  public setmasabruta(masaBruta: string): void {
    this.update((state) => ({
      ...state,
      masaBruta,
    }));
  }
  /**
   * Establece el nombre comercial de la mercancía.
   * @param nombreComercialDelaMercancia Cadena que representa el nombre comercial de la mercancía.
   */
  public setnombrecomercialdelamercancia(
    nombreComercialDelaMercancia: string
  ): void {
    this.update((state) => ({
      ...state,
      nombreComercialDelaMercancia,
    }));
  }
  /**
   * Establece el número de registro.
   * @param numeroRegistro Cadena que representa el número de registro.
   */
  public setNumRegistro(numeroRegistro: string): void {
    this.update((state) => ({
      ...state,
      numeroRegistro,
    }));
  }
  /**
   * Establece el nombre comercial.
   * @param nombreComercial Cadena que representa el nombre comercial.
   */
  public setNomComercial(nombreComercial: string): void {
    this.update((state) => ({
      ...state,
      nombreComercial,
    }));
  }
  /**
   * Establece la fecha de inicio del bloque.
   * @param fechaInicial Cadena que representa la fecha de inicio del bloque.
   */
  public setFechInicioB(fechaInicial: string): void {
    this.update((state) => ({
      ...state,
      fechaInicial,
    }));
  }
  /**
   * Establece la fecha de fin del bloque.
   * @param fechaFinal Cadena que representa la fecha de fin del bloque.
   */
  public setFechFinB(fechaFinal: string): void {
    this.update((state) => ({
      ...state,
      fechaFinal,
    }));
  }
  /**
   * Establece el archivo adjunto.
   * @param archivo Cadena que representa el archivo adjunto.
   */
  public setArchivo(archivo: string): void {
    this.update((state) => ({
      ...state,
      archivo,
    }));
  }
  /**
   * Establece las observaciones.
   * @param observaciones Cadena que representa las observaciones.
   */
  public setObservaciones(observaciones: string): void {
    this.update((state) => ({
      ...state,
      observaciones,
    }));
  }
  /**
   * Establece el valor de presica.
   * @param presica Cadena que representa el valor de presica.
   */
  public setPresica(presica: string): void {
    this.update((state) => ({
      ...state,
      presica,
    }));
  }
  /**
   * Establece el valor de presenta.
   * @param presenta Cadena que representa el valor de presenta.
   */
  public setPresenta(presenta: string): void {
    this.update((state) => ({
      ...state,
      presenta,
    }));
  }
  /**
   * Establece el catálogo de idiomas.
   * @param idioma Lista de objetos de tipo `Catalogo` o `null`.
   */
  public setIdioma(idioma: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      idioma,
    }));
  }
  /**
   * Establece el catálogo de entidades.
   * @param entidad Lista de objetos de tipo `Catalogo` o `null`.
   */
  public setEntidad(entidad: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      entidad,
    }));
  }
  /**
   * Establece el catálogo de representaciones.
   * @param representacion Lista de objetos de tipo `Catalogo` o `null`.
   */
  public setRepresentacion(representacion: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      representacion,
    }));
  }
  /**
   * Establece el nombre del solicitante.
   * @param nombre Cadena que representa el nombre del solicitante.
   */
  public setNombre(nombre: string): void {
    this.update((state) => ({
      ...state,
      nombre,
    }));
  }
  /**
   * Establece el primer apellido del solicitante.
   * @param apellidoPrimer Cadena que representa el primer apellido del solicitante.
   */
  public setApellidoPrimer(apellidoPrimer: string): void {
    this.update((state) => ({
      ...state,
      apellidoPrimer,
    }));
  }
  /**
   * Establece el segundo apellido del solicitante.
   * @param apellidoSegundo Cadena que representa el segundo apellido del solicitante.
   */
  public setApellidoSegundo(apellidoSegundo: string): void {
    this.update((state) => ({
      ...state,
      apellidoSegundo,
    }));
  }
  /**
   * Establece el número fiscal del solicitante.
   * @param numeroFiscal Cadena que representa el número fiscal del solicitante.
   */
  public setNumeroFiscal(numeroFiscal: string): void {
    this.update((state) => ({
      ...state,
      numeroFiscal,
    }));
  }
  /**
   * Establece la razón social.
   * @param razonSocial Cadena que representa la razón social.
   */
  public setRazonSocial(razonSocial: string): void {
    this.update((state) => ({
      ...state,
      razonSocial,
    }));
  }
  /**
   * Establece la ciudad del solicitante.
   * @param ciudad Cadena que representa la ciudad del solicitante.
   */
  public setCiudad(ciudad: string): void {
    this.update((state) => ({
      ...state,
      ciudad,
    }));
  }
  /**
   * Establece la calle del solicitante.
   * @param calle Cadena que representa la calle del solicitante.
   */
  public setCalle(calle: string): void {
    this.update((state) => ({
      ...state,
      calle,
    }));
  }
  /**
   * Establece el número o letra de la dirección del solicitante.
   * @param numeroLetra Cadena que representa el número o letra de la dirección.
   */
  public setNumeroLetra(numeroLetra: string): void {
    this.update((state) => ({
      ...state,
      numeroLetra,
    }));
  }
  /**
   * Establece la lada del número telefónico.
   * @param lada Cadena que representa la lada.
   */
  public setLada(lada: string): void {
    this.update((state) => ({
      ...state,
      lada,
    }));
  }
  /**
   * Establece el número telefónico.
   * @param telefono Cadena que representa el número telefónico.
   */
  public setTelefono(telefono: string): void {
    this.update((state) => ({
      ...state,
      telefono,
    }));
  }
  /**
   * Establece el número de fax.
   * @param fax Cadena que representa el número de fax.
   */
  public setFax(fax: string): void {
    this.update((state) => ({
      ...state,
      fax,
    }));
  }
  /**
   * Establece el correo electrónico.
   * @param correoElectronico Cadena que representa el correo electrónico.
   */
  public setCorreoElectronico(correoElectronico: string): void {
    this.update((state) => ({
      ...state,
      correoElectronico,
    }));
  }
  /**
   * Establece el catálogo de naciones.
   * @param nacion Lista de objetos de tipo `Catalogo` o `null`.
   */
  public setNacion(nacion: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      nacion,
    }));
  }
  /**
   * Establece el catálogo de transportes.
   * @param transporte Lista de objetos de tipo `Catalogo` o `null`.
   */
  public setTransporte(transporte: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      transporte,
    }));
  }
  /**
   * Establece el valor de la casilla de verificación.
   * @param casillaVerificacion Cadena que representa el valor de la casilla.
   */
  public setCheckbox(casillaVerificacion: string): void {
    this.update((state) => ({
      ...state,
      casillaVerificacion,
    }));
  }
  /**
   * Establece la ruta completa del trámite.
   * @param rutaCompleta Cadena que representa la ruta completa.
   */
  public setRutaCompleta(rutaCompleta: string): void {
    this.update((_state) => ({
      ...this.getValue(),
      rutaCompleta,
    }));
  }
  /**
   * Establece el puerto de embarque.
   * @param puertoEmbarque Cadena que representa el puerto de embarque.
   */
  public setPuertoEmbarque(puertoEmbarque: string): void {
    this.update((state) => ({
      ...state,
      puertoEmbarque,
    }));
  }
  /**
   * Establece el puerto de desembarque.
   * @param puertoDesembarque Cadena que representa el puerto de desembarque.
   */
  public setPuertoDesembarque(puertoDesembarque: string): void {
    this.update((state) => ({
      ...state,
      puertoDesembarque,
    }));
  }

  /**
   * @method setFormHistorico
   * @description
   * Actualiza los datos del formulario de formulario.
   * @param values Valores a actualizar en el formulario.
   */
  setFormHistorico(values: {
    [key: string]: undefined | boolean | string | number | object;
  }): void {
    this.update((state) => ({
      formulario: {
        ...state.formulario,
        ...values,
      },
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
   * @method mercanciaSeleccionadasTabla
   * @description
   * Actualiza las mercancías seleccionadas en la tabla del almacén.
   * @param mercanciaSeleccionadasTabla Array de objetos `Mercancia` que representa las mercancías seleccionadas.
   */
  mercanciaSeleccionadasTabla(mercanciaSeleccionadasTabla: Mercancia[]): void {
    this.update((state) => ({
      ...state,
      mercanciaSeleccionadasTabla,
    }));
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
   * @method setFormValida
   * @description
   * Actualiza el estado de validación de los formularios en el almacén.
   * @param formaValida Objeto que contiene los valores de validación para los formularios.
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
   * @method setBloque
   * @description
   * Actualiza los bloques de países en el almacén.
   * @param paisBloques Array de objetos `Catalogo` que representa los bloques de países.
   */
  setBloque(paisBloques: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      paisBloques,
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
   * Actualiza el lugar en el grupo representativo.
   *
   * Este método permite establecer el lugar en el grupo representativo del trámite.
   *
   * @param {string} lugar - El lugar a establecer.
   */
  public setGrupoRepresentativoLugar(lugar: string): void {
    this.update((state) => ({
      ...state,
      grupoRepresentativo: { ...state.grupoRepresentativo, lugar },
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

  /**
   * Actualiza el estado con la lista de países de destino
   * @param paisDestin Arreglo de catálogos con los países de destino
   */
  public setPaisDestinatario(paisDestin: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      paisDestin,
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
   * @method setDetallesDelTransporte
   * @description
   * Actualiza los detalles del transporte en el almacén.
   * @param values 
   */
  setDetallesDelTransporte(values:{ [key: string]: unknown }): void {
    this.update((state) => ({
      detallesDelTransporte: {
        ...state.detallesDelTransporte,
        ...values,
      },
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

    setInsumosDisponiblesTabla(insumosDisponiblesTabla: InsumosDisponibles[]): void {
      this.update((state) => ({
        ...state,
        insumosDisponiblesTabla: insumosDisponiblesTabla,
      }));
    }

  /**
   * Limpia los datos de la solicitud
   */
  public limpiarSolicitud(): void {
    this.reset();
  }
}
