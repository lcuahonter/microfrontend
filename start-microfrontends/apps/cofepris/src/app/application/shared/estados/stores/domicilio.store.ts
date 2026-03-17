import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Representa el estado de una solicitud en la aplicación.
 */
export interface DomicilioState {
  /** Denominación de la solicitud. */
  denominacion: string;
  /** Correo electrónico asociado a la solicitud. */
  correoElectronico: string;
  /** Código postal del solicitante. */
  codigoPostal: string;
  /** Estado de residencia del solicitante. */
  estado: string;
  /** Municipio de residencia del solicitante. */
  municipio: string;
  /** Localidad de residencia del solicitante. */
  localidad: string;
  /** Colonia de residencia del solicitante. */
  colonia: string;
  /** Calle de residencia del solicitante. */
  calle: string;
  /** LADA del número telefónico del solicitante. */
  lada: string;
  /** Número telefónico del solicitante. */
  telefono: string;
  /** Código SCIAN relacionado con la solicitud. */
  scian: string;
  /** Aviso relacionado con la solicitud. */
  aviso: string;
  /** Número de licencia sanitaria. */
  noLicenciaSanitaria: string;
  /** Régimen destinado para la solicitud. */
  regimenDestinado: string;
  /** Aduana relacionada con la solicitud. */
  aduana: string;
  /** Información sobre el producto relacionado. */
  datosProducto: string;
  /** Autorización de IVA/IEPS. */
  autorizacionIVAIEPS: string;
  /** Clave SCIAN del producto. */
  claveScian: string;
  /** Descripción SCIAN del producto. */
  descripcionScian: string;
  /** Clasificación del producto. */
  clasificacionProducto: string;
  /** Detalles adicionales sobre la clasificación. */
  especificarClasificacion: string;
  /** Marca comercial del producto. */
  marcaComercial: string;
  /** Denominación genérica del producto. */
  denominacionGenerica: string;
  /** Tipo de producto. */
  tipoProducto: string;
  /** Estado físico del producto. */
  estadoFisico: string;
  /** Fracción arancelaria del producto. */
  fraccionArancelaria: string;
  /** Descripción de la fracción arancelaria. */
  descripcionFraccionArancelaria: string;
  /** Cantidad en la unidad de medida comercial. */
  cantidadUMC: string;
  /** Unidad de medida comercial. */
  umc: string;
  /** Porcentaje de concentración del producto. */
  porcentajeConcentracion: string;
  /** Valor comercial del producto. */
  valorComercial: string;
  /** Fecha del movimiento relacionado. */
  fechaMovimiento: string;
  /** Presentación farmacéutica del producto. */
  presentacionFarmaceutica: string;
  /** País de destino del producto. */
  paisDestino: string;
  /** País de procedencia del producto. */
  paisProcedencia: string;
  /** RFC del solicitante. */
  rfc: string;
  /** Nombre o razón social del representante legal. */
  nombreRazonSocial: string;
  /** Apellido paterno del representante legal. */
  apellidoPaterno: string;
  /** Apellido materno del representante legal. */
  apellidoMaterno: string;
  /** Cumplimiento de obligaciones fiscales del representante legal. */
  cumplimiento: string;
  /** Indica si se ha seleccionado un establecimiento. */
  establecimientoSeleccionado: boolean;

}

/**
 *
 * Esta función crea y devuelve el estado inicial para la entidad `Solicitud260603State`.
 * Proporciona valores predeterminados vacíos para todas las propiedades del estado.
 */
export function createInitialState(): DomicilioState {
  return {
    /** Denominación de la solicitud. */
    denominacion: '',
    /** Correo electrónico asociado a la solicitud. */
    correoElectronico: '',
    /** Código postal del solicitante. */
    codigoPostal: '',
    /** Estado de residencia del solicitante. */
    estado: '',
    /** Municipio de residencia del solicitante. */
    municipio: '',
    /** Localidad de residencia del solicitante. */
    localidad: '',
    /** Colonia de residencia del solicitante. */
    colonia: '',
    /** Calle de residencia del solicitante. */
    calle: '',
    /** LADA del número telefónico del solicitante. */
    lada: '',
    /** Número telefónico del solicitante. */
    telefono: '',
    /** Código SCIAN relacionado con la solicitud. */
    scian: '',
    /** Aviso relacionado con la solicitud. */
    aviso: '',
    /** Número de licencia sanitaria. */
    noLicenciaSanitaria: '',
    /** Régimen destinado para la solicitud. */
    regimenDestinado: '',
    /** Aduana relacionada con la solicitud. */
    aduana: '',
    /** Información sobre el producto relacionado. */
    datosProducto: '',
    /** Autorización de IVA/IEPS. */
    autorizacionIVAIEPS: '',
    /** Clave SCIAN del producto. */
    claveScian: '',
    /** Descripción SCIAN del producto. */
    descripcionScian: '',
    /** Clasificación del producto. */
    clasificacionProducto: '',
    /** Detalles adicionales sobre la clasificación. */
    especificarClasificacion: '',
    /** Marca comercial del producto. */
    marcaComercial: '',
    /** Denominación genérica del producto. */
    denominacionGenerica: '',
    /** Tipo de producto. */
    tipoProducto: '',
    /** Estado físico del producto. */
    estadoFisico: '',
    /** Fracción arancelaria del producto. */
    fraccionArancelaria: '',
    /** Descripción de la fracción arancelaria. */
    descripcionFraccionArancelaria: '',
    /** Cantidad en la unidad de medida comercial. */
    cantidadUMC: '',
    /** Unidad de medida comercial. */
    umc: '',
    /** Porcentaje de concentración del producto. */
    porcentajeConcentracion: '',
    /** Valor comercial del producto. */
    valorComercial: '',
    /** Fecha del movimiento relacionado. */
    fechaMovimiento: '',
    /** Presentación farmacéutica del producto. */
    presentacionFarmaceutica: '',
    /** País de destino del producto. */
    paisDestino: '',
    /** País de procedencia del producto. */
    paisProcedencia: '',
    /** RFC del solicitante. */
    rfc: '',
    /** Nombre o razón social del representante legal. */
    nombreRazonSocial: '',
    /** Apellido paterno del representante legal. */
    apellidoPaterno: '',
    /** Apellido materno del representante legal. */
    apellidoMaterno: '',
    /** Cumplimiento de obligaciones fiscales del representante legal. */
    cumplimiento: '',
    /** Indica si se ha seleccionado un establecimiento. */
    establecimientoSeleccionado: false
  };
}

/**
 * @description
 * Esta clase representa el store para manejar el estado de la solicitud.
 * Proporciona métodos para actualizar diferentes propiedades del estado de la solicitud.
 * 
 * @example
 * ```typescript
 * const tramiteStore = new Tramite260603Store();
 * tramiteStore.setDenominacion('Nueva Denominación');
 * tramiteStore.setCorreoElectronico('correo@ejemplo.com');
 * ```
 * 
 * @providedIn root
 * 
 * @storeConfig
 * Nombre del store: 'DomicilioState'
 */
@Injectable({
  providedIn: 'root'
})

@StoreConfig({ name: 'DomicilioState' })

/**
 * Clase que representa el store para gestionar el estado de la solicitud.
 * Extiende la clase base `Store` para manejar el estado de tipo `Solicitud260603State`.
 */
export class DomicilioStore extends Store<DomicilioState> {
  /**
   * Constructor de la clase que inicializa el estado con valores predeterminados.
   */
  constructor() {
    super(createInitialState());
  }

    public setrRfc(rfc: string): void {
    this.update((state) => ({
      ...state,
      rfc,
    }));
  }

  /**
   * Actualiza el estado con la denominación.
   * @param denominacion La denominación a establecer.
   */
  public setDenominacion(denominacion: string): void {
    this.update((state) => ({
      ...state,
      denominacion,
    }));
  }

  /**
   * Actualiza el estado con el correo electrónico.
   * @param correoElectronico El correo electrónico a establecer.
   */
  public setCorreoElectronico(correoElectronico: string): void {
    this.update((state) => ({
      ...state,
      correoElectronico,
    }));
  }

  /**
   * Actualiza el estado con el código postal.
   * @param codigoPostal El código postal a establecer.
   */
  public setCodigoPostal(codigoPostal: string): void {
    this.update((state) => ({
      ...state,
      codigoPostal,
    }));
  }

  /**
   * Actualiza el estado con el estado (entidad federativa).
   * @param estado El estado a establecer.
   */
  public setEstado(estado: string): void {
    this.update((state) => ({
      ...state,
      estado,
    }));
  }

  /**
   * Actualiza el estado con el municipio.
   * @param municipio El municipio a establecer.
   */
  public setMunicipio(municipio: string): void {
    this.update((state) => ({
      ...state,
      municipio,
    }));
  }

  /**
   * Actualiza el estado con la localidad.
   * @param localidad La localidad a establecer.
   */
  public setLocalidad(localidad: string): void {
    this.update((state) => ({
      ...state,
      localidad,
    }));
  }

  /**
   * Actualiza el estado con la colonia.
   * @param colonia La colonia a establecer.
   */
  public setColonia(colonia: string): void {
    this.update((state) => ({
      ...state,
      colonia,
    }));
  }

  /**
   * Actualiza el estado con la calle.
   * @param calle La calle a establecer.
   */
  public setCalle(calle: string): void {
    this.update((state) => ({
      ...state,
      calle,
    }));
  }

  /**
   * Actualiza el estado con la lada.
   * @param lada La lada a establecer.
   */
  public setLada(lada: string): void {
    this.update((state) => ({
      ...state,
      lada,
    }));
  }

  /**
   * Actualiza el estado con el teléfono.
   * @param telefono El teléfono a establecer.
   */
  public setTelefono(telefono: string): void {
    this.update((state) => ({
      ...state,
      telefono,
    }));
  }

  /**
   * Actualiza el estado con el SCIAN.
   * @param scian El SCIAN a establecer.
   */
  public setScian(scian: string): void {
    this.update((state) => ({
      ...state,
      scian,
    }));
  }

  /**
   * Actualiza el estado con el aviso.
   * @param aviso El aviso a establecer.
   */
  public setAviso(aviso: string): void {
    this.update((state) => ({
      ...state,
      aviso,
    }));
  }

  /**
   * Actualiza el estado con el número de licencia sanitaria.
   * @param noLicenciaSanitaria El número de licencia sanitaria a establecer.
   */
  public setNoLicenciaSanitaria(noLicenciaSanitaria: string): void {
    this.update((state) => ({
      ...state,
      noLicenciaSanitaria,
    }));
  }

  /**
   * Actualiza el estado con el régimen destinado.
   * @param regimenDestinado El régimen destinado a establecer.
   */
  public setRegimenDestinado(regimenDestinado: string): void {
    this.update((state) => ({
      ...state,
      regimenDestinado,
    }));
  }

  /**
   * Actualiza el estado con la aduana.
   * @param aduana La aduana a establecer.
   */
  public setAduana(aduana: string): void {
    this.update((state) => ({
      ...state,
      aduana,
    }));
  }

  /**
   * Actualiza el estado con los datos del producto.
   * @param datosProducto Los datos del producto a establecer.
   */
  public setDatosProducto(datosProducto: string): void {
    this.update((state) => ({
      ...state,
      datosProducto,
    }));
  }

  /**
   * Actualiza el estado con la autorización IVA/IEPS.
   * @param autorizacionIVAIEPS La autorización IVA/IEPS a establecer.
   */
  public setAutorizacionIVAIEPS(autorizacionIVAIEPS: string): void {
    this.update((state) => ({
      ...state,
      autorizacionIVAIEPS,
    }));
  }

  /**
   * Actualiza el estado con la clave SCIAN.
   * @param claveScian La clave SCIAN a establecer.
   */
  public setClaveScian(claveScian: string): void {
    this.update((state) => ({
      ...state,
      claveScian,
    }));
  }

  /**
   * Actualiza el estado con la descripción SCIAN.
   * @param descripcionScian La descripción SCIAN a establecer.
   */
  public setDescripcionScian(descripcionScian: string): void {
    this.update((state) => ({
      ...state,
      descripcionScian,
    }));
  }

  /**
   * Actualiza el estado con la clasificación del producto.
   * @param clasificacionProducto La clasificación del producto a establecer.
   */
  public setClasificacionProducto(clasificacionProducto: string): void {
    this.update((state) => ({
      ...state,
      clasificacionProducto,
    }));
  }

  /**
   * Actualiza el estado con la especificación de la clasificación.
   * @param especificarClasificacion La especificación de la clasificación a establecer.
   */
  public setEspecificarClasificacion(especificarClasificacion: string): void {
    this.update((state) => ({
      ...state,
      especificarClasificacion,
    }));
  }

  /**
   * Actualiza el estado con la marca comercial.
   * @param marcaComercial La marca comercial a establecer.
   */
  public setMarcaComercial(marcaComercial: string): void {
    this.update((state) => ({
      ...state,
      marcaComercial,
    }));
  }

  /**
   * Actualiza el estado con la denominación genérica.
   * @param denominacionGenerica La denominación genérica a establecer.
   */
  public setDenominacionGenerica(denominacionGenerica: string): void {
    this.update((state) => ({
      ...state,
      denominacionGenerica,
    }));
  }

  /**
   * Actualiza el estado con el tipo de producto.
   * @param tipoProducto El tipo de producto a establecer.
   */
  public setTipoProducto(tipoProducto: string): void {
    this.update((state) => ({
      ...state,
      tipoProducto,
    }));
  }

  /**
   * Actualiza el estado con el estado físico.
   * @param estadoFisico El estado físico a establecer.
   */
  public setEstadoFisico(estadoFisico: string): void {
    this.update((state) => ({
      ...state,
      estadoFisico,
    }));
  }

  /**
   * Actualiza el estado con la fracción arancelaria.
   * @param fraccionArancelaria La fracción arancelaria a establecer.
   */
  public setFraccionArancelaria(fraccionArancelaria: string): void {
    this.update((state) => ({
      ...state,
      fraccionArancelaria,
    }));
  }

  /**
   * Actualiza el estado con la descripción de la fracción arancelaria.
   * @param descripcionFraccionArancelaria La descripción de la fracción arancelaria a establecer.
   */
  public setDescripcionFraccionArancelaria(descripcionFraccionArancelaria: string): void {
    this.update((state) => ({
      ...state,
      descripcionFraccionArancelaria,
    }));
  }

  /**
   * Actualiza el estado con la cantidad UMC.
   * @param cantidadUMC La cantidad UMC a establecer.
   */
  public setCantidadUMC(cantidadUMC: string): void {
    this.update((state) => ({
      ...state,
      cantidadUMC,
    }));
  }

  /**
   * Actualiza el estado con la unidad de medida comercial (UMC).
   * @param umc La unidad de medida comercial a establecer.
   */
  public setUmc(umc: string): void {
    this.update((state) => ({
      ...state,
      umc,
    }));
  }

  /**
   * Actualiza el estado con el porcentaje de concentración.
   * @param porcentajeConcentracion El porcentaje de concentración a establecer.
   */
  public setPorcentajeConcentracion(porcentajeConcentracion: string): void {
    this.update((state) => ({
      ...state,
      porcentajeConcentracion,
    }));
  }

  /**
   * Actualiza el estado con el valor comercial.
   * @param valorComercial El valor comercial a establecer.
   */
  public setValorComercial(valorComercial: string): void {
    this.update((state) => ({
      ...state,
      valorComercial,
    }));
  }

  /**
   * Actualiza el estado con la fecha de movimiento.
   * @param fechaMovimiento La fecha de movimiento a establecer.
   */
  public setFechaMovimiento(fechaMovimiento: string): void {
    this.update((state) => ({
      ...state,
      fechaMovimiento,
    }));
  }

  /**
   * Actualiza el estado con la presentación farmacéutica.
   * @param presentacionFarmaceutica La presentación farmacéutica a establecer.
   */
  public setPresentacionFarmaceutica(presentacionFarmaceutica: string): void {
    this.update((state) => ({
      ...state,
      presentacionFarmaceutica,
    }));
  }

  /**
   * Actualiza el estado con el país de destino.
   * @param paisDestino El país de destino a establecer.
   */
  public setPaisDestino(paisDestino: string): void {
    this.update((state) => ({
      ...state,
      paisDestino,
    }));
  }

  /**
   * Actualiza el estado con el país de procedencia.
   * @param paisProcedencia El país de procedencia a establecer.
   */
  public setPaisProcedencia(paisProcedencia: string): void {
    this.update((state) => ({
      ...state,
      paisProcedencia,
    }));
  }

  /**
   * Actualiza el estado con el RFC.
   * @param rfc El RFC a establecer.
   */
  public setRfc(rfc: string): void {
    this.update((state) => ({
      ...state,
      rfc,
    }));
  }
  /**
   * Actualiza el estado con el nombre o razón social del representante legal.
   * @param nombreRazonSocial El nombre o razón social a establecer.
   */
  public setNombreRazonSocial(nombreRazonSocial: string): void {
    this.update((state) => ({
      ...state,
      nombreRazonSocial,
    }));
  }
  /**
   * Actualiza el estado con el apellido paterno del representante legal.
   * @param apellidoPaterno El apellido paterno a establecer.
   */
  public setApellidoPaterno(apellidoPaterno: string): void {
    this.update((state) => ({
      ...state,
      apellidoPaterno,
    }));
  }

  /**
   * Actualiza el estado con el apellido materno del representante legal.
   * @param apellidoMaterno El apellido materno a establecer.
   */
  public setApellidoMaterno(apellidoMaterno: string): void {
    this.update((state) => ({
      ...state,
      apellidoMaterno,
    }));
  }

  /**
   * Actualiza el estado con el cumplimiento de obligaciones fiscales del representante legal.
   * @param cumplimiento El cumplimiento a establecer.
   */
  public setCumplimiento(cumplimiento: string): void {
    this.update((state) => ({
      ...state,
      cumplimiento,
    }));
  }

  /**
   * Actualiza el estado de selección del establecimiento.
   * @param establecimientoSeleccionado Indica si se ha seleccionado un establecimiento.
   */
  public setEstablecimientoSeleccionado(establecimientoSeleccionado: boolean): void {
    this.update((state) => ({
      ...state,
      establecimientoSeleccionado,
    }));
  }

  /**
   * Reinicia solo el estado de selección del establecimiento.
   */
  public resetEstablecimientoSeleccionado(): void {
    this.update((state) => ({
      ...state,
      establecimientoSeleccionado: false,
    }));
  }

  /**
   * Limpia los datos de la solicitud y restablece el estado inicial.
   */
  public limpiarSolicitud(): void {
    this.reset();
  }
}

