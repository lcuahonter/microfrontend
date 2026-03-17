import { DatosGenerales, Destinatario } from '../../models/pantallas-captura.model';
import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Estado de la solicitud 220402.
 * 
 * Define la estructura del estado para el trámite 220402, incluyendo todos los campos necesarios
 * para capturar la información relacionada con el certificado, mercancías, transporte, solicitante,
 * y detalles de pago.
 */
export interface Solicitud220402State {
  /**
   * Tipo de certificado solicitado.
   */
  tipoDeCertificado: string;

  /**
   * Sección aduanera relacionada con el trámite.
   */
  seccionAduanera: string;

  /**
   * Punto de destino de las mercancías.
   */
  puntoDestino: string;

  /**
   * País de destino de las mercancías.
   */
  paisDeDestino: string;

  /**
   * País de procedencia de las mercancías.
   */
  paisDeProcedencia: string;

  /**
   * Rango de fechas para el trámite.
   */
  rangoDeFechas: string;

  /**
   * Fecha de inicio del trámite.
   */
  fechaInicio: string;

  /**
   * Fecha final del trámite.
   */
  fechaFinal: string;

  /**
   * Fracción arancelaria de las mercancías.
   */
  fraccionArancelaria: string;

  /**
   * Descripción de la fracción arancelaria.
   */
  descdelaFraccion: string;

  idSolicitud?: number | null;

  /**
   * Cantidad en la unidad de medida de transporte (UMT).
   */
  cantidadUMT: string;

  /**
   * Unidad de medida de transporte (UMT).
   */
  UMT: string;

  /**
   * Cantidad en la unidad de medida comercial (UMC).
   */
  cantidadUMC: string;

  /**
   * Unidad de medida comercial (UMC).
   */
  UMC: string;

  /**
   * País de origen de las mercancías.
   */
  paisdeOrigen: string;

  /**
   * Entidad federativa de origen de las mercancías.
   */
  entidadFederativadeOrigen: string;

  /**
   * Municipio de origen de las mercancías.
   */
  municipiodeOrigen: [];

  /**
   * Datos generales relacionados con el trámite.
   */
  datosGeneralesArr: DatosGenerales[];

  /**
   * Marcas distintivas de las mercancías.
   */
  marcasDistintivas: string;

  /**
   * Uso de las mercancías.
   */
  USO: string;

  /**
   * Número relacionado con el trámite.
   */
  numero: string;

  /**
   * Detalles de los empaques de las mercancías.
   */
  empaques: string;

  /**
   * Unidad encargada de verificar las mercancías.
   */
  unidadDeVerificar: string;

  /**
   * Tercero especialista relacionado con el trámite.
   */
  terceroEspecialista: string;

  /**
   * Entidad federativa relacionada con el trámite.
   */
  entidadFederative: string;

  /**
   * Certificado fitosanitario relacionado con las mercancías.
   */
  fitosanitario: string;

  /**
   * Medio de transporte utilizado para las mercancías.
   */
  mediodeTransporte: string;

  /**
   * Identificación del transporte utilizado.
   */
  identificacionDelTransporte: string;

  /**
   * Tipo de persona (física o moral) relacionada con el trámite.
   */
  tipoPersona: string;

  /**
   * Nombre del solicitante.
   */
  nombre: string;

  /**
   * Primer apellido del solicitante.
   */
  primerApellido: string;

  /**
   * Segundo apellido del solicitante.
   */
  segundoApellido: string;

  /**
   * Denominación de la empresa o entidad.
   */
  denominacion: string;

  /**
   * País relacionado con el solicitante.
   */
  pais: string;

  /**
   * Domicilio del solicitante.
   */
  domicilio: string;

  /**
   * Lada telefónica del solicitante.
   */
  lada: string;

  /**
   * Teléfono del solicitante.
   */
  telefono: string;

  /**
   * Correo electrónico del solicitante.
   */
  correoElectronico: string;

  /**
   * Indica si el trámite está exento de pago.
   */
  exentoDePago: string;

  /**
   * Nombre del importador o exportador.
   */
  nombreImportExport: string;

  /**
   * Justificación del trámite.
   */
  justificacion: string;

  /**
   * Clave de referencia relacionada con el trámite.
   */
  claveDeReferencia: string;

  /**
   * Cadena de dependencia relacionada con el trámite.
   */
  cadenaDependencia: string;

  /**
   * Banco relacionado con el pago del trámite.
   */
  banco: string;

  /**
   * Llave de pago del trámite.
   */
  llaveDePago: string;

  /**
   * Fecha de pago del trámite.
   */
  fechaPago: string;

  /**
   * Importe del pago realizado.
   */
  importePago: string;
  /**
   * Nombre común del producto.
   */
  nombreComun: string;

  /**
   * Nombre científico del producto.
   */
  nombreCientifico: string;

  /**
   * Descripción detallada del producto.
   */
  descripcionProducto: string;
  /** Lista de destinatarios relacionados con el trámite. */
  destinatario: Destinatario[];

  /**
   * Contiene el estado de validación de los formularios de cada pestaña.
   * `null` significa que la pestaña no ha sido visitada.
   * `true` o `false` refleja el estado de validez del formulario.
   */
  formStatus: {
    solicitante: boolean | null;
    datosSolicitud: boolean | null;
    transporte: boolean | null;
    pagoDerechos: boolean | null;
    destinatario: boolean | null;
  };

  /**
   * Bandera para indicar a los componentes de las pestañas que deben marcar todos sus campos como 'touched'.
   */
  markAllAsTouched: boolean;
}

export function createInitialSolicitudState(): Solicitud220402State {
  return {
    tipoDeCertificado: '',
    seccionAduanera: '',
    puntoDestino: '',
    paisDeDestino: '',
    idSolicitud:null,
    paisDeProcedencia: 'MEX',
    rangoDeFechas: '',
    fechaInicio: '',
    fechaFinal: '',
    fraccionArancelaria: '',
    descdelaFraccion: '',
    cantidadUMT: '',
    UMT: '',
    cantidadUMC: '',
    UMC: '',
    paisdeOrigen: '',
    entidadFederativadeOrigen: '',
    municipiodeOrigen: [],
    datosGeneralesArr: [],
    marcasDistintivas: '',
    USO: '',
    numero: '',
    empaques: '',
    unidadDeVerificar: '',
    terceroEspecialista: '',
    entidadFederative: '',
    fitosanitario: '',
    mediodeTransporte: '',
    identificacionDelTransporte: '',
    tipoPersona: '',
    nombre: '',
    primerApellido: '',
    segundoApellido: '',
    denominacion: '',
    pais: '',
    domicilio: '',
    lada: '',
    telefono: '',
    correoElectronico: '',
    exentoDePago: 'No',
    nombreImportExport: '',
    justificacion: '',
    claveDeReferencia: '',
    cadenaDependencia: '',
    banco: '',
    llaveDePago: '',
    fechaPago: '',
    importePago: '',
    nombreComun: '',
    nombreCientifico: '',
    descripcionProducto: '',
    destinatario: [],

    formStatus: {
      solicitante: null,
      datosSolicitud: null,
      transporte: null,
      pagoDerechos: null,
      destinatario: null,
    },
    markAllAsTouched: false
  }
}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'solicitud220402', resettable: true })
export class Solicitud220402Store extends Store<Solicitud220402State> {
  constructor() {
    super(createInitialSolicitudState());
  }

  /**
 * Actualiza el estado con el tipo de certificado solicitado.
 */
  public setTipoDeCertificado(tipoDeCertificado: string): void {
    this.update((state) => ({
      ...state,
      tipoDeCertificado
    }));
  }

  /**
   * Actualiza el estado con el punto de destino de las mercancías.
   */
  public setPuntoDestino(puntoDestino: string): void {
    this.update((state) => ({
      ...state,
      puntoDestino
    }));
  }

  /**
   * Actualiza el estado con la sección aduanera relacionada con el trámite.
   */
  public setSeccionAduanera(seccionAduanera: string): void {
    this.update((state) => ({
      ...state,
      seccionAduanera
    }));
  }

  /**
   * Actualiza el estado con el país de destino de las mercancías.
   */
  public setPaisDeDestino(paisDeDestino: string): void {
    this.update((state) => ({
      ...state,
      paisDeDestino
    }));
  }

  /**
   * Actualiza el estado con el país de procedencia de las mercancías.
   */
  public setPaisDeProcedencia(paisDeProcedencia: string): void {
    this.update((state) => ({
      ...state,
      paisDeProcedencia
    }));
  }

  /**
   * Actualiza el estado con el ID de la solicitud.
   */
  public setIdSolicitud(idSolicitud: number | null): void {
    this.update((state) => ({
      ...state,
      idSolicitud
    }));
  }

  /**
   * Actualiza el estado con el rango de fechas para el trámite.
   */
  public setRangoDeFechas(rangoDeFechas: string): void {
    this.update((state) => ({
      ...state,
      rangoDeFechas
    }));
  }

  /**
   * Actualiza el estado con la fecha de inicio del trámite.
   */
  public setFechaInicio(fechaInicio: string): void {
    this.update((state) => ({
      ...state,
      fechaInicio
    }));
  }
  /**
   * Actualiza el estado con la fecha final del trámite.
   */
  public setFechaFinal(fechaFinal: string): void {
    this.update((state) => ({
      ...state,
      fechaFinal
    }));
  }

  /**
   * Actualiza el estado con la fracción arancelaria de las mercancías.
   */
  public setFraccionArancelaria(fraccionArancelaria: string): void {
    this.update((state) => ({
      ...state,
      fraccionArancelaria
    }));
  }

  /**
   * Actualiza el estado con la descripción de la fracción arancelaria.
   */
  public setDescdelaFraccion(descdelaFraccion: string): void {
    this.update((state) => ({
      ...state,
      descdelaFraccion
    }));
  }

  /**
   * Actualiza el estado con la cantidad en la unidad de medida de transporte (UMT).
   */
  public setCantidadUMT(cantidadUMT: string): void {
    this.update((state) => ({
      ...state,
      cantidadUMT
    }));
  }

  /**
   * Actualiza el estado con la unidad de medida de transporte (UMT).
   */
  public setUMT(UMT: string): void {
    this.update((state) => ({
      ...state,
      UMT
    }));
  }

  /**
   * Actualiza el estado con la cantidad en la unidad de medida comercial (UMC).
   */
  public setCantidadUMC(cantidadUMC: string): void {
    this.update((state) => ({
      ...state,
      cantidadUMC
    }));
  }

  /**
   * Actualiza el estado con la unidad de medida comercial (UMC).
   */
  public setUMC(UMC: string): void {
    this.update((state) => ({
      ...state,
      UMC
    }));
  }

  /**
   * Actualiza el estado con el país de origen de las mercancías.
   */
  public setPaisdeOrigen(paisdeOrigen: string): void {
    this.update((state) => ({
      ...state,
      paisdeOrigen
    }));
  }

  /**
   * Actualiza el estado con la entidad federativa de origen de las mercancías.
   */
  public setEntidadFederativadeOrigen(entidadFederativadeOrigen: string): void {
    this.update((state) => ({
      ...state,
      entidadFederativadeOrigen
    }));
  }

  /**
   * Actualiza el estado con el municipio de origen de las mercancías.
   */
  public setMunicipiodeOrigen(municipiodeOrigen: []): void {
    this.update((state) => ({
      ...state,
      municipiodeOrigen
    }));
  }
  /**
 * Actualiza el estado con las marcas distintivas de las mercancías.
 */
  public setMarcasDistintivas(marcasDistintivas: string): void {
    this.update((state) => ({
      ...state,
      marcasDistintivas
    }));
  }

  /**
   * Actualiza el estado con el uso de las mercancías.
   */
  public setUSO(USO: string): void {
    this.update((state) => ({
      ...state,
      USO
    }));
  }

  /**
   * Actualiza el estado con los datos de las mercancías.
   */
  public setDatosMercancia(datosMercancia: string): void {
    this.update((state) => ({
      ...state,
      datosMercancia
    }));
  }

  /**
   * Actualiza el estado con el número relacionado con el trámite.
   */
  public setNumero(numero: string): void {
    this.update((state) => ({
      ...state,
      numero
    }));
  }

  /**
   * Actualiza el estado con los detalles de los empaques de las mercancías.
   */
  public setEmpaques(empaques: string): void {
    this.update((state) => ({
      ...state,
      empaques
    }));
  }

  /**
   * Actualiza el estado con la unidad encargada de verificar las mercancías.
   */
  public setUnidadDeVerificar(unidadDeVerificar: string): void {
    this.update((state) => ({
      ...state,
      unidadDeVerificar
    }));
  }

  /**
   * Actualiza el estado con el tercero especialista relacionado con el trámite.
   */
  public setTerceroEspecialista(terceroEspecialista: string): void {
    this.update((state) => ({
      ...state,
      terceroEspecialista
    }));
  }

  /**
   * Actualiza el estado con la entidad federativa relacionada con el trámite.
   */
  public setEntidadFederative(entidadFederative: string): void {
    this.update((state) => ({
      ...state,
      entidadFederative
    }));
  }

  /**
   * Actualiza el estado con el certificado fitosanitario relacionado con las mercancías.
   */
  public setFitosanitario(fitosanitario: string): void {
    this.update((state) => ({
      ...state,
      fitosanitario
    }));
  }

  /**
   * Actualiza el estado con los datos generales relacionados con el trámite.
   */
  public setDatosGeneralesArr(datosGeneralesArr: DatosGenerales[]): void {
    this.update((state) => ({
      ...state,
      datosGeneralesArr
    }));
  }

  /**
   * Actualiza el estado con el medio de transporte utilizado para las mercancías.
   */
  public setMediodeTransporte(mediodeTransporte: string): void {
    this.update((state) => ({
      ...state,
      mediodeTransporte
    }));
  }


  /**
 * Actualiza el estado con la identificación del transporte utilizado.
 */
  public setIdentificacionDelTransporte(identificacionDelTransporte: string): void {
    this.update((state) => ({
      ...state,
      identificacionDelTransporte
    }));
  }

  /**
   * Actualiza el estado con el tipo de persona (física o moral).
   */
  public setTipoPersona(tipoPersona: string): void {
    this.update((state) => ({
      ...state,
      tipoPersona,
    }));
  }

  /**
   * Actualiza el estado con el nombre del solicitante.
   */
  public setNombre(nombre: string): void {
    this.update((state) => ({
      ...state,
      nombre
    }));
  }

  /**
   * Actualiza el estado con el primer apellido del solicitante.
   */
  public setPrimerApellido(primerApellido: string): void {
    this.update((state) => ({
      ...state,
      primerApellido
    }));
  }

  /**
   * Actualiza el estado con el segundo apellido del solicitante.
   */
  public setSegundoApellido(segundoApellido: string): void {
    this.update((state) => ({
      ...state,
      segundoApellido
    }));
  }

  /**
   * Actualiza el estado con la denominación de la empresa o entidad.
   */
  public setDenominacion(denominacion: string): void {
    this.update((state) => ({
      ...state,
      denominacion
    }));
  }

  /**
   * Actualiza el estado con el país relacionado con el solicitante.
   */
  public setPais(pais: string): void {
    this.update((state) => ({
      ...state,
      pais
    }));
  }

  /**
   * Actualiza el estado con el domicilio del solicitante.
   */
  public setDomicilio(domicilio: string): void {
    this.update((state) => ({
      ...state,
      domicilio
    }));
  }

  /**
   * Actualiza el estado con la lada telefónica del solicitante.
   */
  public setLada(lada: string): void {
    this.update((state) => ({
      ...state,
      lada
    }));
  }

  /**
   * Actualiza el estado con el teléfono del solicitante.
   */
  public setTelefono(telefono: string): void {
    this.update((state) => ({
      ...state,
      telefono
    }));
  }

  /**
   * Actualiza el estado con el correo electrónico del solicitante.
   */
  public setCorreoElectronico(correoElectronico: string): void {
    this.update((state) => ({
      ...state,
      correoElectronico
    }));
  }

  /**
   * Actualiza el estado con la exención de pago del trámite.
   */
  public setExentoDePago(exentoDePago: string): void {
    this.update((state) => ({
      ...state,
      exentoDePago
    }));
  }

  /**
   * Actualiza el estado con la cadena de dependencia relacionada con el trámite.
   */
  public setCadenaDependencia(cadenaDependencia: string): void {
    this.update((state) => ({
      ...state,
      cadenaDependencia
    }));
  }

  /**
   * Actualiza el estado con el banco relacionado con el pago del trámite.
   */
  public setBanco(banco: string): void {
    this.update((state) => ({
      ...state,
      banco
    }));
  }

  /**
   * Actualiza el estado con la llave de pago del trámite.
   */
  public setllaveDePago(llaveDePago: string): void {
    this.update((state) => ({
      ...state,
      llaveDePago
    }));
  }

  /**
   * Actualiza el estado con la fecha de pago del trámite.
   */
  public setFechaPago(fechaPago: string): void {
    this.update((state) => ({
      ...state,
      fechaPago
    }));
  }

  /**
   * Actualiza el estado con la justificación del trámite.
   */
  public setJustificacion(justificacion: string): void {
    this.update((state) => ({
      ...state,
      justificacion
    }));
  }

  /**
   * Actualiza el estado con la clave de referencia relacionada con el trámite.
   */
  public setClaveDeReferencia(claveDeReferencia: string): void {
    this.update((state) => ({
      ...state,
      claveDeReferencia
    }));
  }

  /**
   * Actualiza el estado con el importe del pago realizado.
   */
  public setImportePago(importePago: string): void {
    this.update((state) => ({
      ...state,
      importePago
    }));
  }
  /**
   * Actualiza el estado con el nombre común del producto.
   * 
   * @param {string} nombreComun - Nombre común del producto.
   */
  public setNombreComun(nombreComun: string): void {
    this.update((state) => ({
      ...state,
      nombreComun
    }));
  }

  /**
   * Actualiza el estado con el nombre científico del producto.
   * 
   * @param {string} nombreCientifico - Nombre científico del producto.
   */
  public setNombreCientifico(nombreCientifico: string): void {
    this.update((state) => ({
      ...state,
      nombreCientifico
    }));
  }

  /**
   * Actualiza el estado con la descripción detallada del producto.
   * 
   * @param {string} descripcionProducto - Descripción detallada del producto.
   */
  public setDescripcionProducto(descripcionProducto: string): void {
    this.update((state) => ({
      ...state,
      descripcionProducto
    }));
  }
  /**
   * Actualiza el estado con la lista de destinatarios relacionados con el trámite.
   * 
   * @param {Destinatario[]} destinatario - Lista de destinatarios a actualizar en el estado.
   */
  public setDestinatario(destinatario: Destinatario[]): void {
    this.update((state) => ({
      ...state,
      destinatario
    }));
  }

  /**
   * Actualiza el estado de validación para un formulario de una pestaña específica.
   * @param formKey La clave que identifica el formulario de la pestaña (ej. 'solicitante').
   * @param isValid El estado de validez del formulario.
   */
  public updateFormStatus(formKey: keyof Solicitud220402State['formStatus'], isValid: boolean): void {
    this.update(state => ({
      ...state,
      formStatus: {
        ...state.formStatus,
        [formKey]: isValid
      }
    }));
  }

  /**
   * Activa la bandera para que todos los formularios muestren sus errores de validación.
   */
  public setMarkAllAsTouched(): void {
    this.update({ markAllAsTouched: true });
  }

}