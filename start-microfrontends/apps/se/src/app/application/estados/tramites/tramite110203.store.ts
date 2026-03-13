import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import radioOpciones from '@libs/shared/theme/assets/json/110203/datos-busqueda.json';
import { CertificadoData } from '../../tramites/110203/models/datos-tramite.model';

/**
 * **Estado de la Solicitud 110203**
 *
 * Representa los datos asociados a la solicitud dentro del estado de la aplicación.
 */
export interface Solicitud110203State {
  /** ID de la solicitud */
  idSolicitud: number | null;

  /** **Tratado o acuerdo comercial seleccionado** */
  tratado: string;

  /** **Bloque económico o país asociado al tratado** */
  bloque: string;

  /** **País de origen de la mercancía** */
  origen: string;

  /** **País de destino de la mercancía** */
  destino: string;

  /** **Fecha de expedición del documento** */
  expedicion: string;

  /** **Fecha de vencimiento del documento** */
  vencimiento: string;

  /** **Nombre del solicitante o representante legal** */
  nombre: string;

  /** **Primer apellido del solicitante** */
  primer: string;

  /** **Segundo apellido del solicitante** */
  segundo: string;

  /** **Registro fiscal del solicitante (RFC o equivalente)** */
  fiscal: string;

  /** **Razón social de la empresa o entidad solicitante** */
  razon: string;

  /** **Calle del domicilio del solicitante** */
  calle: string;

  /** **Número o letra adicional en la dirección (si aplica)** */
  letra: string;

  /** **Ciudad donde se ubica el solicitante** */
  ciudad: string;

  /** **Correo electrónico de contacto** */
  correo: string;

  /** **Número de fax de contacto (si aplica)** */
  fax: string;

  /** **Número de teléfono de contacto** */
  telefono: string;

  /** **Medio de contacto preferido (teléfono, correo, etc.)** */
  medio: string;

  /** **Observaciones o notas adicionales** */
  observaciones: string;

  /** **Descripción precisa de la solicitud** */
  precisa: string;

  /** **Quién presenta la solicitud (persona o entidad responsable)** */
  presenta: string;

  /** **Valor seleccionado dentro del proceso de solicitud** */
  valorSeleccionado: string | number;

  /** **Número de certificado asociado a la solicitud** */
  numeroDeCertificado: string;

  /** **Tratado o acuerdo relacionado con la solicitud** */
  tratadoAcuerdo: string;

  /** **País o bloque económico relacionado con la solicitud** */
  paisBloque: string;
  /** **medida económico relacionado con la solicitud** */
  medida: string;
  /** **comercializacion económico relacionado con la solicitud** */
  comercializacion: string;
  /** **tipo económico relacionado con la solicitud** */
  tipo: string;
  /** **complemento de la descripción de la mercancía** */
  complemento: string;
  /** **marca de la mercancía** */
  marca: string;
  /** **valor de la mercancía** */
  valor: string;
  /** **peso bruto de la mercancía** */
  bruta: string;
  /** **Número de factura asociado a la solicitud** */
  factura: string;
  /** **Código de país de la mercancía** */
  cvePais: string;
  /** **Número de orden de compra o pedido** */
  orden: string;
  /** **Código arancelario de la mercancía** */
  arancelaria: string;
  /** Nombre del técnico responsable del trámite */
  tecnico: string;
  /** Nombre del responsable comercial del trámite */
  comercial: string;
  /** Indicador o versión en inglés del documento o trámite */
  ingles: string;
  /** Número o código de registro del producto o solicitud */
  registro: string;
  /** Cantidad de unidades o productos incluidos en la solicitud */
  cantidad: string;
  /** Fecha en la que se emitió la factura asociada */
  fechaFactura: string;
  /** Paso actual o índice del flujo activo en el proceso */
  pasoActivo: number;
  /**
   * Estado de validez de las diferentes secciones del formulario.
   * Cada propiedad indica si la sección ha sido completada correctamente.
   */
    formValidity?: {
      tratados?: boolean;
      destinatario?: boolean;
      transporte?: boolean;
      datosCertificado?: boolean;
  };

  /** Propiedad opcional que contiene el arreglo de datos del certificado.  
 * Se usa para enviar o recibir el *payload* asociado a la búsqueda. */
  buscarPayload?: CertificadoData[];
}

/**
 * **Crea el estado inicial de Solicitud110203State**
 *
 * Esta función devuelve un objeto con los valores predeterminados
 * de la solicitud, asegurando que no haya valores `undefined`.
 *
 * @returns {Solicitud110203State} Estado inicial de la solicitud.
 */
export function createInitialState(): Solicitud110203State {
  return {
    /** ID de la solicitud, inicialmente nulo */
    idSolicitud: 0,

    /** Unidad de medida utilizada para cuantificar la mercancía (ej. kilogramos, litros). */
    medida: '',

    /** Tipo de comercialización de la mercancía (ej. venta, muestra, donación). */
    comercializacion: '',

    /** Tipo de producto o clasificación según su naturaleza o uso. */
    tipo: '',
    /** **Tratado o acuerdo comercial seleccionado** */
    tratado: '',

    /** **Bloque económico o país asociado al tratado** */
    bloque: '',

    /** **País de origen de la mercancía** */
    origen: '',

    /** **País de destino de la mercancía** */
    destino: '',

    /** **Fecha de expedición del documento** */
    expedicion: '',

    /** **Fecha de vencimiento del documento** */
    vencimiento: '',

    /** **Nombre del solicitante o representante legal** */
    nombre: '',

    /** **Primer apellido del solicitante** */
    primer: '',

    /** **Segundo apellido del solicitante** */
    segundo: '',

    /** **Registro fiscal del solicitante (RFC o equivalente)** */
    fiscal: '',

    /** **Razón social de la empresa o entidad solicitante** */
    razon: '',

    /** **Calle del domicilio del solicitante** */
    calle: '',

    /** **Número o letra adicional en la dirección (si aplica)** */
    letra: '',

    /** **Ciudad donde se ubica el solicitante** */
    ciudad: '',

    /** **Correo electrónico de contacto** */
    correo: '',

    /** **Número de fax de contacto (si aplica)** */
    fax: '',

    /** **Número de teléfono de contacto** */
    telefono: '',

    /** **Medio de contacto preferido (teléfono, correo, etc.)** */
    medio: '',

    /** **Observaciones o notas adicionales** */
    observaciones: '',

    /** **Descripción precisa de la solicitud** */
    precisa: '',

    /** **Quién presenta la solicitud (persona o entidad responsable)** */
    presenta: '',

    /** **Valor seleccionado dentro del proceso de solicitud**
     *  Se asigna el primer valor disponible de `radioOpciones.radioOptions`. */
    valorSeleccionado: radioOpciones?.radioOptions[0].label,

    /** **Número de certificado asociado a la solicitud** */
    numeroDeCertificado: '',

    /** **Tratado o acuerdo relacionado con la solicitud** */
    tratadoAcuerdo: '',

    /** **País o bloque económico relacionado con la solicitud** */
    paisBloque: '',
    /** **complemento de la descripción de la mercancía** */
    complemento: '',
    /** **marca de la mercancía** */
    marca: '',
    /** **valor de la mercancía** */
    valor: '',
    /** **peso bruto de la mercancía** */
    bruta: '',
    /** **Número de factura asociado a la solicitud** */
    factura: '',
    /** **Código de país de la mercancía** */
    cvePais: '',
    /** **Número de orden de compra o pedido** */
    orden: '',
    /** **Código arancelario de la mercancía** */
    arancelaria: '',
    /** **Nombre del técnico responsable del trámite** */
    tecnico: '',
    /** **Nombre del responsable comercial del trámite** */
    comercial: '',
    /** **Indicador o versión en inglés del documento o trámite** */
    ingles: '',
    /** **Número o código de registro del producto o solicitud** */
    registro: '',
    /** **Cantidad de unidades o productos incluidos en la solicitud** */
    cantidad: '',
    /** **Fecha en la que se emitió la factura asociada** */
    fechaFactura: '',
    /** **Paso actual o índice del flujo activo en el proceso** */
    pasoActivo: 1,
    /** Estado de validez de las diferentes secciones del formulario */
    formValidity: {},
    /** Arreglo para almacenar datos de certificados */
    buscarPayload: []
  };
}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite110203', resettable: true })
export class Tramite110203Store extends Store<Solicitud110203State> {
  /**
   * **Constructor de la tienda**
   *
   * Inicializa la tienda con el estado inicial definido en `createInitialState()`.
   * Garantiza que la estructura de datos comience con valores predeterminados.
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
   * **Actualiza el valor del tratado en el estado**
   *
   * Modifica el valor de la propiedad `tratado` dentro del estado de la tienda.
   *
   * @param tratado - Nuevo valor del tratado.
   */
  public setTratado(tratado: string): void {
    this.update((state) => ({
      ...state,
      tratado,
    }));
  }

  /**
   * **Actualiza el valor del bloque en el estado**
   *
   * Modifica la propiedad `bloque` dentro del estado de la tienda.
   *
   * @param bloque - Nuevo valor del bloque.
   */
  public setBloque(bloque: string): void {
    this.update((state) => ({
      ...state,
      bloque,
    }));
  }

  /**
   * **Actualiza el valor de origen en el estado**
   *
   * Modifica la propiedad `origen` dentro del estado de la tienda.
   *
   * @param origen - Nuevo valor de origen.
   */
  public setOrigen(origen: string): void {
    this.update((state) => ({
      ...state,
      origen,
    }));
  }

  /**
   * **Actualiza el destino en el estado**
   *
   * Modifica la propiedad `destino` dentro del estado de la tienda.
   *
   * @param destino - Nuevo valor del destino.
   */
  public setDestino(destino: string): void {
    this.update((state) => ({
      ...state,
      destino,
    }));
  }

  /**
   * **Actualiza la fecha de expedición en el estado**
   *
   * Modifica la propiedad `expedicion` dentro del estado de la tienda.
   *
   * @param expedicion - Nueva fecha de expedición.
   */
  public setExpedicion(expedicion: string): void {
    this.update((state) => ({
      ...state,
      expedicion,
    }));
  }

  /**
   * **Actualiza la fecha de vencimiento en el estado**
   *
   * Modifica la propiedad `vencimiento` dentro del estado de la tienda.
   *
   * @param vencimiento - Nueva fecha de vencimiento.
   */
  public setVencimiento(vencimiento: string): void {
    this.update((state) => ({
      ...state,
      vencimiento,
    }));
  }

  /**
   * **Actualiza el nombre en el estado**
   *
   * Modifica la propiedad `nombre` dentro del estado de la tienda.
   *
   * @param nombre - Nuevo valor del nombre.
   */
  public setNombre(nombre: string): void {
    this.update((state) => ({
      ...state,
      nombre,
    }));
  }

  /**
   * **Actualiza el primer apellido en el estado**
   *
   * Modifica la propiedad `primer` dentro del estado de la tienda.
   *
   * @param primer - Nuevo valor del primer apellido.
   */
  public setPrimer(primer: string): void {
    this.update((state) => ({
      ...state,
      primer,
    }));
  }

  /**
   * **Actualiza el segundo apellido en el estado**
   *
   * Modifica la propiedad `segundo` dentro del estado de la tienda.
   *
   * @param segundo - Nuevo valor del segundo apellido.
   */
  public setSegundo(segundo: string): void {
    this.update((state) => ({
      ...state,
      segundo,
    }));
  }

  /**
   * **Actualiza el RFC en el estado**
   *
   * Modifica la propiedad `fiscal` dentro del estado de la tienda.
   *
   * @param fiscal - Nuevo valor del RFC.
   */
  public setFiscal(fiscal: string): void {
    this.update((state) => ({
      ...state,
      fiscal,
    }));
  }

  /**
   * **Actualiza la razón social en el estado**
   *
   * Modifica la propiedad `razon` dentro del estado de la tienda.
   *
   * @param razon - Nuevo valor de la razón social.
   */
  public setRazon(razon: string): void {
    this.update((state) => ({
      ...state,
      razon,
    }));
  }

  /**
   * **Actualiza la calle en el estado**
   *
   * Modifica la propiedad `calle` dentro del estado de la tienda.
   *
   * @param calle - Nuevo valor de la calle.
   */
  public setCalle(calle: string): void {
    this.update((state) => ({
      ...state,
      calle,
    }));
  }

  /**
   * **Actualiza la letra del domicilio en el estado**
   *
   * Modifica la propiedad `letra` dentro del estado de la tienda.
   *
   * @param letra - Nuevo valor de la letra del domicilio.
   */
  public setLetra(letra: string): void {
    this.update((state) => ({
      ...state,
      letra,
    }));
  }

  /**
   * **Actualiza la ciudad en el estado**
   *
   * Modifica la propiedad `ciudad` dentro del estado de la tienda.
   *
   * @param ciudad - Nuevo valor de la ciudad.
   */
  public setCiudad(ciudad: string): void {
    this.update((state) => ({
      ...state,
      ciudad,
    }));
  }

  /**
   * **Actualiza el correo electrónico en el estado**
   *
   * Modifica la propiedad `correo` dentro del estado de la tienda.
   *
   * @param correo - Nuevo valor del correo electrónico.
   */
  public setCorreo(correo: string): void {
    this.update((state) => ({
      ...state,
      correo,
    }));
  }

  /**
   * **Actualiza el número de fax en el estado**
   *
   * Modifica la propiedad `fax` dentro del estado de la tienda.
   *
   * @param fax - Nuevo valor del fax.
   */
  public setFax(fax: string): void {
    this.update((state) => ({
      ...state,
      fax,
    }));
  }

  /**
   * **Actualiza el número de teléfono en el estado**
   *
   * Modifica la propiedad `telefono` dentro del estado de la tienda.
   *
   * @param telefono - Nuevo número de teléfono.
   */
  public setTelefono(telefono: string): void {
    this.update((state) => ({
      ...state,
      telefono,
    }));
  }

  /**
   * **Actualiza el medio de contacto en el estado**
   *
   * Modifica la propiedad `medio` dentro del estado de la tienda.
   *
   * @param medio - Nuevo valor del medio de contacto.
   */
  public setMedio(medio: string): void {
    this.update((state) => ({
      ...state,
      medio,
    }));
  }

  /**
   * **Actualiza la precisión de la información en el estado**
   *
   * Modifica la propiedad `precisa` dentro del estado de la tienda.
   *
   * @param precisa - Nuevo valor para la precisión de la información.
   */
  public setPrecisa(precisa: string): void {
    this.update((state) => ({
      ...state,
      precisa,
    }));
  }

  /**
   * **Actualiza la información de presentación en el estado**
   *
   * Modifica la propiedad `presenta` dentro del estado de la tienda.
   *
   * @param presenta - Nuevo valor para la presentación de la información.
   */
  public setPresenta(presenta: string): void {
    this.update((state) => ({
      ...state,
      presenta,
    }));
  }

  /**
   * Actualiza el valor seleccionado en el control de radio.
   * @param valorSeleccionado El nuevo valor a establecer.
   */
  public setValorSeleccionado(valorSeleccionado: string | number): void {
    this.update((state) => ({
      ...state,
      valorSeleccionado,
    }));
  }

  /**
   * Actualiza el número de certificado ingresado por el usuario.
   * @param numeroDeCertificado El nuevo número de certificado a establecer.
   */
  public setNumeroDeCertificado(numeroDeCertificado: string): void {
    this.update((state) => ({
      ...state,
      numeroDeCertificado,
    }));
  }

  /**
   * Actualiza el tratado o acuerdo seleccionado por el usuario.
   * @param tratadoAcuerdo El nuevo tratado o acuerdo a establecer.
   */
  public setTratadoAcuerdo(tratadoAcuerdo: string): void {
    this.update((state) => ({
      ...state,
      tratadoAcuerdo,
    }));
  }

  /**
   * Actualiza el país o bloque económico seleccionado por el usuario.
   * @param paisBloque El nuevo país o bloque económico a establecer.
   */
  public setPaisBloque(paisBloque: string): void {
    this.update((state) => ({
      ...state,
      paisBloque,
    }));
  }

  /**
   * Actualiza el observaciones seleccionado por el usuario.
   * @param paisBloque El nuevo observaciones o bloque económico a establecer.
   */
  public setObservaciones(observaciones: string): void {
    this.update((state) => ({
      ...state,
      observaciones,
    }));
  }

  /**
   * Limpia la selección de la radio
   */
  public limpiarSeleccion(): void {
    this.reset();
  }
  /**
   * Actualiza el valor del campo "medida" en el estado global de la solicitud.
   *
   * @param medida - Nueva unidad de medida seleccionada por el usuario.
   */
  public setMedida(medida: string): void {
    this.update((state) => ({
      ...state,
      medida,
    }));
  }
  /**
   * Actualiza el valor del campo "comercializacion" en el estado global de la solicitud.
   *
   * @param comercializacion - Nuevo valor del tipo de comercialización seleccionado por el usuario.
   */
  public setComercializacion(comercializacion: string): void {
    this.update((state) => ({
      ...state,
      comercializacion,
    }));
  }
  /**
   * Establece el valor de "comercializacion" en el estado.
   *
   * @param comercializacion - Valor que representa el tipo de comercialización de la mercancía.
   */
  public setTipo(tipo: string): void {
    this.update((state) => ({
      ...state,
      tipo,
    }));
  }

  /**
   * Establece el valor de "complemento" en el estado.
   *
   * @param complemento - Valor que representa el complemento de la descripción de la mercancía.
   */
  public setComplemento(complemento: string): void {
    this.update((state) => ({
      ...state,
      complemento,
    }));
  }
  /**
   * Establece el valor de "marca" en el estado.
   *
   * @param marca - Valor que representa la marca de la mercancía.
   */
  public setMarca(marca: string): void {
    this.update((state) => ({
      ...state,
      marca,
    }));
  }
  /**
   * Establece el valor de "valor" en el estado.
   *
   * @param valor - Valor que representa el valor de la mercancía.
   */
  public setValor(valor: string): void {
    this.update((state) => ({
      ...state,
      valor,
    }));
  }

  /**
   * Establece el valor de "bruta" en el estado.
   *
   * @param bruta - Valor que representa el peso bruto de la mercancía.
   */
  public setBruta(bruta: string): void {
    this.update((state) => ({
      ...state,
      bruta,
    }));
  }

  /**
   * Establece el valor de "factura" en el estado.
   *
   * @param factura - Valor que representa el número de factura asociado a la solicitud.
   */
  public setFactura(factura: string): void {
    this.update((state) => ({
      ...state,
      factura,
    }));
  }

   /**
   * Establece el valor de "cvePais" en el estado.
   *
   * @param cvePais - Valor que representa el código de país de la mercancía.
   */
  public setCvePais(cvePais: string): void {
    this.update((state) => ({
      ...state,
      cvePais,
    }));
  }

  /**
   * Establece el valor de "orden" en el estado.
   *
   * @param orden - Valor que representa el número de orden de compra o pedido asociado a la solicitud.
   */
  public setOrden(orden: string): void {
    this.update((state) => ({
      ...state,
      orden,
    }));
  }

  /**
   * Establece el valor de "arancelaria" en el estado.
   *
   * @param arancelaria - Valor que representa el número de arancelaria asociado a la solicitud.
   */
  public setArancelaria(arancelaria: string): void {
    this.update((state) => ({
      ...state,
      arancelaria,
    }));
  }

/**
 * Establece el nombre del técnico en el estado.
 *
 * @param tecnico - Nombre del técnico responsable de la solicitud.
 */
  public setNombretecnico(tecnico: string): void {
    this.update((state) => ({
      ...state,
      tecnico,
    }));
  }

/**
 * Establece el nombre del responsable comercial en el estado.
 *
 * @param comercial - Nombre del responsable comercial asociado a la solicitud.
 */
  public setComercial(comercial: string): void {
    this.update((state) => ({
      ...state,
      comercial,
    }));
  }

  /**
 * Establece el valor del campo "inglés" en el estado.
 *
 * @param ingles - Valor que representa la versión o información en inglés asociada a la solicitud.
 */
  public setIngles(ingles: string): void {
    this.update((state) => ({
      ...state,
      ingles,
    }));
  }

  /**
 * Establece el valor del campo "registro" en el estado.
 *
 * @param registro - Número o código de registro asociado a la solicitud.
 */
  public setRegistro(registro: string): void {
    this.update((state) => ({
      ...state,
      registro,
    }));
  }

  /**
 * Establece el valor del campo "cantidad" en el estado.
 *
 * @param cantidad - Cantidad de unidades o productos asociados a la solicitud.
 */
  public setCantidad(cantidad: string): void {
    this.update((state) => ({
      ...state,
      cantidad,
    }));
  }

  /**
 * Establece la fecha de la factura en el estado.
 *
 * @param fechaFactura - Fecha en la que se emitió la factura asociada a la solicitud.
 */
  public setFechaFactura(fechaFactura: string): void {
    this.update((state) => ({
      ...state,
      fechaFactura,
    }));
  }

  /**
 * Establece el paso activo actual en el estado.
 *
 * @param pasoActivo - Índice o número que representa el paso activo en el proceso.
 */
  public setPasoActivo(pasoActivo: number): void {
    this.update((state) => ({
      ...state,
      pasoActivo,
    }));
  }

  /**
 * Actualiza la validez de una sección específica del formulario en el estado.
 *
 * @param formName - Nombre de la sección del formulario a actualizar (ejemplo: "tratados", "destinatario").
 * @param isValid - Booleano que indica si la sección es válida (`true`) o no (`false`).
 */
  setFormValidity(formName: string, isValid: boolean): void {
    this.update((state) => ({
      ...state,
      formValidity: {
        ...state.formValidity,
        [formName]: isValid,
      },
    }));
  }

  /** Establece el *payload* de búsqueda asignando el arreglo recibido.  
 * Actualiza el estado interno mediante la función `update()`. */
  setBuscarPayload(payload: CertificadoData[]): void {
  this.update({ buscarPayload: payload });
}
}
