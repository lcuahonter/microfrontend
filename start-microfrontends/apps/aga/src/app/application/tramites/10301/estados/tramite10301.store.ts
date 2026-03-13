import { Store, StoreConfig } from '@datorama/akita';
import { DatosMercancia } from '../models/importador-exportador.model';
import { Injectable } from '@angular/core';

/**
 * Representa un catálogo general con un identificador único y una descripción.
 * 
 * Esta interfaz se utiliza comúnmente para poblar listas desplegables (selects) 
 * dentro de formularios, como por ejemplo: aduanas, países, años, condiciones, etc.
 */
export interface Catalogo {
  /**
   * Identificador numérico único del elemento del catálogo.
   * Suele utilizarse como valor (value) en controles de formulario.
   */
  id: number;

  /**
   * Descripción legible del elemento del catálogo.
   * Suele mostrarse como texto visible en listas o combos.
   */
  descripcion: string;
}

/**
 * Define la estructura del estado del formulario del trámite 10301.
 * Contiene todos los campos requeridos para su llenado, validación y control de UI.
 */
export interface Solicitud10301State {
  /** Identificador del manifiesto asociado al trámite. */
  manifesto: string;

  /** Identificador único de la solicitud. */
  idSolicitud: string;

  /** Tipo de solicitud del trámite (por ejemplo, modificación, alta, etc.). */
  tipoSolicitud: string;

  /** Lista de aduanas disponibles para seleccionar. */
  aduana: Catalogo[] | null;

  /** Lista de años disponibles en el catálogo. */
  ano: Catalogo[] | null;

  /** Lista de países disponibles en el catálogo. */
  pais: Catalogo[] | null;

  /** Lista de condiciones de la mercancía (nueva, usada, etc.). */
  condicion: Catalogo[] | null;

  /** Lista de tipos de documento disponibles. */
  tipoDocumento: Catalogo[] | null;

  /** Fechas disponibles para seleccionar dentro del trámite. */
  fechasSeleccionadas: string[];

  /** Fines o propósitos seleccionados por el usuario. */
  finesElegidos: string[];

  /** Rango de días seleccionado por el usuario. */
  selectRangoDias: string[];

  /** Lista de fechas utilizadas o seleccionadas en el trámite. */
  fechasDatos: string[];

  /** Fecha actual o predeterminada del trámite. */
  fecha: string | null;

  /** Fecha que fue seleccionada específicamente por el usuario. */
  fechaSeleccionada: string | null;

  /** Valor actualmente seleccionado en algún campo dinámico. */
  valorSeleccionado: string | null;

  /** Nombre de la empresa o persona que realiza la solicitud. */
  nombre: string;

  /** Tipo de mercancía involucrada en la solicitud. */
  tipoMercancia: string;

  /** Uso específico declarado para la mercancía. */
  usoEspecifico: string;

  /** Marca del artículo o producto. */
  marca: string;

  /** Modelo del artículo o producto. */
  modelo: string;

  /** Número de serie del artículo o producto. */
  serie: string;

  /** Nombre de la calle del domicilio fiscal u operativo. */
  calle: string;

  /** Número exterior del domicilio. */
  numeroExterior: number;

  /** Número interior del domicilio. */
  numeroInterior: number;

  /** Número telefónico de contacto principal. */
  telefono: number;

  /** Correo electrónico principal de contacto. */
  correoElectronico: string;

  /** Código postal del domicilio declarado. */
  codigoPostal: number;

  /** Identificador del estado o entidad federativa del domicilio. */
  estado: number;

  /** Identificador de la colonia del domicilio. */
  colonia: number;

  /** Opción seleccionada por el usuario (casilla, alternativa, etc.). */
  opcion: string;

  /** Lista de documentos requeridos o anexados. */
  documentos: Catalogo[] | null;

  /** Identificador del checkbox o selección en la tabla. */
  tableCheck: string;

  /** Indica si el trámite está relacionado con una donación. */
  donacion: string;

  /** Nombre de la persona que realiza o representa la solicitud. */
  persona: string;

  /** Campo para especificar un valor adicional no contemplado (por ejemplo, "otro"). */
  otro: string;

  /** Lista de datos de mercancía asociados a la solicitud. */
  condicionMercancia: string;
}


/**
 * Retorna el estado inicial del formulario con valores predeterminados.
 * Se usa para inicializar el store o restablecer su estado.
 * @returns Estado inicial de tipo `Solicitud10301State`
 */
export function createInitialState(): Solicitud10301State {
  return {
    manifesto: '',
    idSolicitud: '',
    tipoSolicitud: '',
    aduana: null,
    ano: null,
    condicion: null,
    pais: null,
    tipoDocumento: null,
    fechasSeleccionadas: [],
    finesElegidos: [],
    selectRangoDias: [],
    fechasDatos: [],
    fecha: null,
    fechaSeleccionada: null,
    valorSeleccionado: null,
    documentos: null,
    nombre: '',
    tipoMercancia: '',
    usoEspecifico: '',
    marca: '',
    modelo: '',
    serie: '',
    calle: '',
    numeroExterior: 0,
    numeroInterior: 0,
    telefono: 0,
    correoElectronico: '',
    codigoPostal: 0,
    estado: 0,
    colonia: 0,
    opcion: '',
    tableCheck: '',
    donacion: '',
    persona: '',
    otro: '',
    condicionMercancia: '',
  };
}

/**
 * Store de Akita para manejar el estado del formulario del trámite 10301.
 * Permite modificar partes del estado de manera centralizada.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite10301', resettable: true })
export class Tramite10301Store extends Store<Solicitud10301State> {
  constructor() {
    super(createInitialState());
  }

  // Métodos para actualizar campos individuales del estado
  
  /** Actualiza el campo `manifesto` del estado. */
  public setCondicionMercancia(condicionMercancia: string): void {
    this.update((state) => ({ ...state, condicionMercancia }));
  }

  /** Actualiza el campo `tableCheck` del estado. */
  public setTableCheck(tableCheck: string): void {
    this.update((state) => ({ ...state, tableCheck }));
  }

  /** Actualiza el campo `donacion` del estado. */
  public setDonacion(donacion: string): void {
    this.update((state) => ({ ...state, donacion }));
  }

  /** Actualiza el campo `persona` del estado. */
  public setPersona(persona: string): void {
    this.update((state) => ({ ...state, persona }));
  }

  /** Actualiza el campo `otro` del estado. */
  public setOtro(otro: string): void {
    this.update((state) => ({ ...state, otro }));
  }

  /** Actualiza el campo `manifesto` del estado. */
  public setManifesto(manifesto: string): void {
    this.update((state) => ({ ...state, manifesto }));
  }

  /** Actualiza la lista de aduanas disponibles. */
  public setAduana(aduana: Catalogo[] | null): void {
    this.update((state) => ({ ...state, aduana }));
  }

  /** Actualiza el catálogo de documentos. */
  public setDocumentos(documentos: Catalogo[]): void {
    this.update((state) => ({ ...state, documentos }));
  }

  /** Actualiza el nombre del solicitante. */
  public setNombre(nombre: string): void {
    this.update((state) => ({ ...state, nombre }));
  }

  /** Actualiza el catálogo de años. */
  public setAno(ano: Catalogo[]): void {
    this.update((state) => ({ ...state, ano }));
  }

  /** Actualiza el catálogo de condiciones. */
  public setCondicion(condicion: Catalogo[]): void {
    this.update((state) => ({ ...state, condicion }));
  }

  /** Actualiza el catálogo de países. */
  public setPais(pais: Catalogo[] | null): void {
    this.update((state) => ({ ...state, pais }));
  }

  /** Actualiza el catálogo de tipos de documentos. */
  public setTipoDocumento(tipoDocumento: Catalogo[]): void {
    this.update((state) => ({ ...state, tipoDocumento }));
  }

  /** Actualiza las fechas seleccionadas del formulario. */
  public setFechasSeleccionadas(fechasSeleccionadas: string[]): void {
    this.update((state) => ({ ...state, fechasSeleccionadas }));
  }

  /** Actualiza los fines seleccionados. */
  public setFinesElegidos(finesElegidos: string[]): void {
    this.update((state) => ({ ...state, finesElegidos }));
  }

  /** Actualiza los elementos seleccionados por el usuario. */
  public setElegidosSeleccionados(elegidosSeleccionados: string[]): void {
    this.update((state) => ({ ...state, elegidosSeleccionados }));
  }

  /** Actualiza el rango de días seleccionados. */
  public setSelectRangoDias(selectRangoDias: string[]): void {
    this.update((state) => ({ ...state, selectRangoDias }));
  }

  /** Actualiza los datos relacionados con fechas múltiples. */
  public setFechasDatos(fechasDatos: string[]): void {
    this.update((state) => ({ ...state, fechasDatos }));
  }

  /** Establece la fecha seleccionada. */
  public setFecha(fecha: string): void {
    this.update((state) => ({ ...state, fecha }));
  }

  /** Establece una fecha específica como seleccionada. */
  public setFechaSeleccionada(fechaSeleccionada: string): void {
    this.update((state) => ({ ...state, fechaSeleccionada }));
  }

  /** Actualiza el valor actualmente seleccionado. */
  public setValorSeleccionado(valorSeleccionado: string): void {
    this.update((state) => ({ ...state, valorSeleccionado }));
  }

  /** Establece el tipo de mercancía del formulario. */
  public setTipoMercancia(tipoMercancia: string): void {
    this.update((state) => ({ ...state, tipoMercancia }));
  }

  /** Establece el uso específico de la mercancía. */
  public setUsoEspecifico(usoEspecifico: string): void {
    this.update((state) => ({ ...state, usoEspecifico }));
  }

  /** Establece la marca de la mercancía. */
  public setMarca(marca: string): void {
    this.update((state) => ({ ...state, marca }));
  }

  /** Establece el modelo de la mercancía. */
  public setModelo(modelo: string): void {
    this.update((state) => ({ ...state, modelo }));
  }

  /** Establece el número de serie de la mercancía. */
  public setSerie(serie: string): void {
    this.update((state) => ({ ...state, serie }));
  }

  /** Establece la calle del domicilio. */
  public setCalle(calle: string): void {
    this.update((state) => ({ ...state, calle }));
  }

  /** Establece el número exterior del domicilio. */
  public setNumeroExterior(numeroExterior: number): void {
    this.update((state) => ({ ...state, numeroExterior }));
  }

  /** Establece el número interior del domicilio. */
  public setNumeroInterior(numeroInterior: number): void {
    this.update((state) => ({ ...state, numeroInterior }));
  }

  /** Establece el teléfono de contacto. */
  public setTelefono(telefono: number): void {
    this.update((state) => ({ ...state, telefono }));
  }

  /** Establece el correo electrónico del solicitante. */
  public setCorreoElectronico(correoElectronico: string): void {
    this.update((state) => ({ ...state, correoElectronico }));
  }

  /** Establece el código postal del domicilio. */
  public setCodigoPostal(codigoPostal: number): void {
    this.update((state) => ({ ...state, codigoPostal }));
  }

  /** Establece el estado (entidad federativa) del domicilio. */
  public setEstado(estado: number): void {
    this.update((state) => ({ ...state, estado }));
  }

  /** Establece la colonia del domicilio. */
  public setColonia(colonia: number): void {
    this.update((state) => ({ ...state, colonia }));
  }

  /** Establece la opción seleccionada (checkbox u otra opción). */
  public setOpcion(opcion: string): void {
    this.update((state) => ({ ...state, opcion }));
  }

  /**
   * Actualiza los datos de la solicitud en el estado.
   * @param {DatosMercancia[]} mercanciaDatos - Lista de datos de la solicitud.
   */
  public setDatosMercancia(mercanciaDatos: DatosMercancia[]): void {
    this.update((state) => ({
      ...state,
      mercanciaDatos,
    }));
  }

  /**
   * Reinicia el estado del formulario al estado inicial.
   * Útil para limpiar el formulario tras enviar o cancelar.
   */
  public limpiarSolicitud(): void {
    this.reset();
  }
}
