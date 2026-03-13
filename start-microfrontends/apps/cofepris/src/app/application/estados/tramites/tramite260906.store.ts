import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Interfaz que representa el estado de Solicitud260906.
 */
export interface Solicitud260906State {
  /**
   * El valor de rfcResponsableSanitario.
   */
  rfcResponsableSanitario: string;
  /**
   * El valor de denominacion.
   */
  denominacion: string;
  /**
   * El valor de correo.
   */
  correo: string;
  /**
   * El valor de tipoOperacionJustificacion.
   */
  tipoOperacionJustificacion: string;
  /**
   * El valor de codigoPostal.
   */
  codigoPostal: string;
  /**
   * El valor de estado.
   */
  estado: string;
  /**
   * El valor de muncipio.
   */
  muncipio: string;
  /**
   * El valor de localidad.
   */
  localidad: string;
  /**
   * El valor de colonia.
   */
  colonia: string;
  /**
   * El valor de calle.
   */
  calle: string;
  /**
   * El valor de lada.
   */
  lada: string;
  /**
   * El valor de telefono.
   */
  telefono: string;
  /**
   * El valor de claveScianModal.
   */
  claveScianModal: string;
  /**
   * El valor de claveDescripcionModal.
   */
  claveDescripcionModal: string;
  /**
   * El valor de avisoCheckbox.
   */
  avisoCheckbox: boolean;
  /**
   * El valor de licenciaSanitaria.
   */
  licenciaSanitaria: string;
  /**
   * El valor de regimen.
   */
  regimen: string;
  /**
   * El valor de aduanasEntradas.
   */
  aduanasEntradas: string;
  /**
   * El valor de numeroPermiso.
   */
  numeroPermiso: string;
  /**
   * El valor de tiempoPrograma.
   */
  tiempoPrograma: number;
  /**
   * El valor de clasificacion.
   */
  clasificacion: string;
  /**
   * El valor de especificarClasificacionProducto.
   */
  especificarClasificacionProducto: string;
  /**
   * El valor de denominacionEspecifica.
   */
  denominacionEspecifica: string;
  /**
   * El valor de denominacionDistintiva.
   */
  denominacionDistintiva: string;
  /**
   * El valor de denominacionComun.
   */
  denominacionComun: string;
  /**
   * El valor de tipoDeProducto.
   */
  tipoDeProducto: string;
  /**
   * El valor de formaFarmaceutica.
   */
  formaFarmaceutica: string;
  /**
   * El valor de estadoFisico.
   */
  estadoFisico: string;
  /**
   * El valor de fraccionArancelaria.
   */
  fraccionArancelaria: string;
  /**
   * El valor de descripcionFraccion.
   */
  descripcionFraccion: string;
  /**
   * El valor de cantidadUMT.
   */
  cantidadUMT: string;
  /**
   * El valor de UMT.
   */
  UMT: string;
  /**
   * El valor de cantidadUMC.
   */
  cantidadUMC: string;
  /**
   * El valor de UMC.
   */
  UMC: string;
  /**
   * El valor de presentacion.
   */
  presentacion: string;
  /**
   * El valor de numeroRegistro.
   */
  numeroRegistro: string;
  /**
   * El valor de fechaCaducidad.
   */
  fechaCaducidad: string;
  /**
   * El valor de cumplimiento.
   */
  cumplimiento: string;
  /**
   * El valor de rfc.
   */
  rfc: string;
  /**
   * El valor de nombre.
   */
  nombre: string;
  /**
   * El valor de apellidoPaterno.
   */
  apellidoPaterno: string;
  /**
   * El valor de apellidoMaterno.
   */
  apellidoMaterno: string;
  /** Acción relacionada con la solicitud ("tipoOperacion"). */
  tipoOperacion: string | number;
  /**
   * El valor de informacionConfidencial.
   */
  informacionConfidencial: string | number;
  /** Indicador sobre si se ha presentado un manifiesto. */
  manifesto: boolean;
}

/**
 * Función para crear el estado inicial de Solicitud260906State.
 * @returns {Solicitud260906State} El estado inicial de Solicitud260906State.
 */
export function createInitialState(): Solicitud260906State {
  return {
    rfcResponsableSanitario: '',
    denominacion: '',
    correo: '',
    tipoOperacionJustificacion: '',
    codigoPostal: '',
    estado: '',
    muncipio: '',
    localidad: '',
    colonia: '',
    calle: '',
    lada: '',
    telefono: '',
    claveScianModal: '',
    claveDescripcionModal: '',
    avisoCheckbox: false,
    licenciaSanitaria: '',
    regimen: '',
    aduanasEntradas: '',
    numeroPermiso: '',
    tiempoPrograma: 0,
    clasificacion: '',
    especificarClasificacionProducto: '',
    denominacionEspecifica: '',
    denominacionDistintiva: '',
    denominacionComun: '',
    tipoDeProducto: '',
    formaFarmaceutica: '',
    estadoFisico: '',
    fraccionArancelaria: '',
    descripcionFraccion: '',
    cantidadUMT: '',
    UMT: '',
    cantidadUMC: '',
    UMC: '',
    presentacion: '',
    numeroRegistro: '',
    fechaCaducidad: '',
    cumplimiento: '',
    rfc: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    tipoOperacion: '',
    informacionConfidencial: '',
    manifesto: false
  };
}

/**
 * Decorador Injectable para hacer que la tienda esté disponible a nivel raíz.
 */
@Injectable({
  providedIn: 'root'
})
@StoreConfig({ name: 'tramite260906', resettable: true })
export class Tramite260906Store extends Store<Solicitud260906State> {
  /**
   * Crea una instancia de Tramite260906Store.
   * Inicializa la tienda con el estado inicial.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Establece el estado de rfcResponsableSanitario.
   * @param rfcResponsableSanitario - El valor de rfcResponsableSanitario.
   */
  public setRfcResponsableSanitario(rfcResponsableSanitario: string): void {
    this.update((state) => ({
      ...state,
      rfcResponsableSanitario
    }));
  }

  /**
   * Establece el estado de denominacion.
   * @param denominacion - El valor de denominacion.
   */
  public setDenominacion(denominacion: string): void {
    this.update((state) => ({
      ...state,
      denominacion
    }));
  }

  /**
   * Establece el estado de correo.
   * @param correo - El valor de correo.
   */
  public setCorreo(correo: string): void {
    this.update((state) => ({
      ...state,
      correo
    }));
  }

  /**
   * Establece el estado de tipoOperacionJustificacion.
   * @param tipoOperacionJustificacion - El valor de tipoOperacionJustificacion.
   */
  public setTipoOperacionJustificacion(tipoOperacionJustificacion: string): void {
    this.update((state) => ({
      ...state,
      tipoOperacionJustificacion
    }));
  }

  /**
   * Establece el estado de codigoPostal.
   * @param codigoPostal - El valor de codigoPostal.
   */
  public setCodigoPostal(codigoPostal: string): void {
    this.update((state) => ({
      ...state,
      codigoPostal
    }));
  }

  /**
   * Establece el estado de estado.
   * @param estado - El valor de estado.
   */
  public setEstado(estado: string): void {
    this.update((state) => ({
      ...state,
      estado
    }));
  }

  /**
   * Establece el estado de muncipio.
   * @param muncipio - El valor de muncipio.
   */
  public setMuncipio(muncipio: string): void {
    this.update((state) => ({
      ...state,
      muncipio
    }));
  }

  /**
   * Establece el estado de localidad.
   * @param localidad - El valor de localidad.
   */
  public setLocalidad(localidad: string): void {
    this.update((state) => ({
      ...state,
      localidad
    }));
  }

  /**
   * Establece el estado de colonia.
   * @param colonia - El valor de colonia.
   */
  public setColonia(colonia: string): void {
    this.update((state) => ({
      ...state,
      colonia
    }));
  }

  /**
   * Establece el estado de calle.
   * @param calle - El valor de calle.
   */
  public setCalle(calle: string): void {
    this.update((state) => ({
      ...state,
      calle
    }));
  }

  /**
   * Establece el estado de lada.
   * @param lada - El valor de lada.
   */
  public setLada(lada: string): void {
    this.update((state) => ({
      ...state,
      lada
    }));
  }

  /**
   * Establece el estado de telefono.
   * @param telefono - El valor de telefono.
   */
  public setTelefono(telefono: string): void {
    this.update((state) => ({
      ...state,
      telefono
    }));
  }

  /**
   * Establece el estado de claveScianModal.
   * @param claveScianModal - El valor de claveScianModal.
   */
  public setClaveScianModal(claveScianModal: string): void {
    this.update((state) => ({
      ...state,
      claveScianModal
    }));
  }

  /**
   * Establece el estado de claveDescripcionModal.
   * @param claveDescripcionModal - El valor de claveDescripcionModal.
   */
  public setClaveDescripcionModal(claveDescripcionModal: string): void {
    this.update((state) => ({
      ...state,
      claveDescripcionModal
    }));
  }

  /**
   * Establece el estado de avisoCheckbox.
   * @param avisoCheckbox - El valor de avisoCheckbox.
   */
  public setAvisoCheckbox(avisoCheckbox: boolean): void {
    this.update((state) => ({
      ...state,
      avisoCheckbox
    }));
  }

  /**
   * Establece el estado de licenciaSanitaria.
   * @param licenciaSanitaria - El valor de licenciaSanitaria.
   */
  public setLicenciaSanitaria(licenciaSanitaria: string): void {
    this.update((state) => ({
      ...state,
      licenciaSanitaria
    }));
  }

  /**
   * Establece el estado de regimen.
   * @param regimen - El valor de regimen.
   */
  public setRegimen(regimen: string): void {
    this.update((state) => ({
      ...state,
      regimen
    }));
  }

  /**
   * Establece el estado de aduanasEntradas.
   * @param aduanasEntradas - El valor de aduanasEntradas.
   */
  public setAduanasEntradas(aduanasEntradas: string): void {
    this.update((state) => ({
      ...state,
      aduanasEntradas
    }));
  }

  /**
   * Establece el estado de numeroPermiso.
   * @param numeroPermiso - El valor de numeroPermiso.
   */
  public setNumeroPermiso(numeroPermiso: string): void {
    this.update((state) => ({
      ...state,
      numeroPermiso
    }));
  }

  /**
   * Establece el estado de tiempoPrograma.
   * @param tiempoPrograma - El valor de tiempoPrograma.
   */
  public setTiempoPrograma(tiempoPrograma: number): void {
    this.update((state) => ({
      ...state,
      tiempoPrograma
    }));
  }

  /**
   * Establece el estado de clasificacion.
   * @param clasificacion - El valor de clasificacion.
   */
  public setClasificacion(clasificacion: string): void {
    this.update((state) => ({
      ...state,
      clasificacion
    }));
  }

  /**
   * Establece el estado de especificarClasificacionProducto.
   * @param especificarClasificacionProducto - El valor de especificarClasificacionProducto.
   */
  public setEspecificarClasificacionProducto(especificarClasificacionProducto: string): void {
    this.update((state) => ({
      ...state,
      especificarClasificacionProducto
    }));
  }

  /**
   * Establece el estado de denominacionEspecifica.
   * @param denominacionEspecifica - El valor de denominacionEspecifica.
   */
  public setDenominacionEspecifica(denominacionEspecifica: string): void {
    this.update((state) => ({
      ...state,
      denominacionEspecifica
    }));
  }

  /**
   * Establece el estado de denominacionDistintiva.
   * @param denominacionDistintiva - El valor de denominacionDistintiva.
   */
  public setDenominacionDistintiva(denominacionDistintiva: string): void {
    this.update((state) => ({
      ...state,
      denominacionDistintiva
    }));
  }

  /**
   * Establece el estado de denominacionComun.
   * @param denominacionComun - El valor de denominacionComun.
   */
  public setDenominacionComun(denominacionComun: string): void {
    this.update((state) => ({
      ...state,
      denominacionComun
    }));
  }

  /**
   * Establece el estado de tipoDeProducto.
   * @param tipoDeProducto - El valor de tipoDeProducto.
   */
  public setTipoDeProducto(tipoDeProducto: string): void {
    this.update((state) => ({
      ...state,
      tipoDeProducto
    }));
  }

  /**
   * Establece el estado de formaFarmaceutica.
   * @param formaFarmaceutica - El valor de formaFarmaceutica.
   */
  public setFormaFarmaceutica(formaFarmaceutica: string): void {
    this.update((state) => ({
      ...state,
      formaFarmaceutica
    }));
  }

  /**
   * Establece el estado de estadoFisico.
   * @param estadoFisico - El valor de estadoFisico.
   */
  public setEstadoFisico(estadoFisico: string): void {
    this.update((state) => ({
      ...state,
      estadoFisico
    }));
  }

  /**
   * Establece el estado de fraccionArancelaria.
   * @param fraccionArancelaria - El valor de fraccionArancelaria.
   */
  public setFraccionArancelaria(fraccionArancelaria: string): void {
    this.update((state) => ({
      ...state,
      fraccionArancelaria
    }));
  }

  /**
   * Establece el estado de descripcionFraccion.
   * @param descripcionFraccion - El valor de descripcionFraccion.
   */
  public setDescripcionFraccion(descripcionFraccion: string): void {
    this.update((state) => ({
      ...state,
      descripcionFraccion
    }));
  }

  /**
   * Establece el estado de cantidadUMT.
   * @param cantidadUMT - El valor de cantidadUMT.
   */
  public setCantidadUMT(cantidadUMT: string): void {
    this.update((state) => ({
      ...state,
      cantidadUMT
    }));
  }

  /**
   * Establece el estado de UMT.
   * @param UMT - El valor de UMT.
   */
  public setUMT(UMT: string): void {
    this.update((state) => ({
      ...state,
      UMT
    }));
  }

  /**
   * Establece el estado de cantidadUMC.
   * @param cantidadUMC - El valor de cantidadUMC.
   */
  public setCantidadUMC(cantidadUMC: string): void {
    this.update((state) => ({
      ...state,
      cantidadUMC
    }));
  }

  /**
   * Establece el estado de UMC.
   * @param UMC - El valor de UMC.
   */
  public setUMC(UMC: string): void {
    this.update((state) => ({
      ...state,
      UMC
    }));
  }

  /**
   * Establece el estado de presentacion.
   * @param presentacion - El valor de presentacion.
   */
  public setPresentacion(presentacion: string): void {
    this.update((state) => ({
      ...state,
      presentacion
    }));
  }

  /**
   * Establece el estado de numeroRegistro.
   * @param numeroRegistro - El valor de numeroRegistro.
   */
  public setNumeroRegistro(numeroRegistro: string): void {
    this.update((state) => ({
      ...state,
      numeroRegistro
    }));
  }

  /**
   * Establece el estado de fechaCaducidad.
   * @param fechaCaducidad - El valor de fechaCaducidad.
   */
  public setFechaCaducidad(fechaCaducidad: string): void {
    this.update((state) => ({
      ...state,
      fechaCaducidad
    }));
  }

  /**
   * Establece el estado de cumplimiento.
   * @param cumplimiento - El valor de cumplimiento.
   */
  public setCumplimiento(cumplimiento: string): void {
    this.update((state) => ({
      ...state,
      cumplimiento
    }));
  }

  /**
   * Establece el estado de rfc.
   * @param rfc - El valor de rfc.
   */
  public setRfc(rfc: string): void {
    this.update((state) => ({
      ...state,
      rfc
    }));
  }

  /**
   * Establece el estado de nombre.
   * @param nombre - El valor de nombre.
   */
  public setNombre(nombre: string): void {
    this.update((state) => ({
      ...state,
      nombre
    }));
  }

  /**
   * Establece el estado de apellidoPaterno.
   * @param apellidoPaterno - El valor de apellidoPaterno.
   */
  public setApellidoPaterno(apellidoPaterno: string): void {
    this.update((state) => ({
      ...state,
      apellidoPaterno
    }));
  }

  /**
   * Establece el estado de apellidoMaterno.
   * @param apellidoMaterno - El valor de apellidoMaterno.
   */
  public setApellidoMaterno(apellidoMaterno: string): void {
    this.update((state) => ({
      ...state,
      apellidoMaterno
    }));
  }

  /**
   * Actualiza el valor relacionado con la acción "tipoOperacion".
   * @param tipoOperacion - Nuevo valor para "tipoOperacion" (cadena o número).
   */
  public setTipoOperacion(tipoOperacion: string | number): void {
    this.update((state) => ({
      ...state,
      tipoOperacion
    }));
  }

  /**
   * Establece el estado de informacionConfidencial.
   * @param informacionConfidencial - El valor de informacionConfidencial.
   */
  public setInformacionConfidencial(informacionConfidencial: string | number): void {
    this.update((state) => ({
      ...state,
      informacionConfidencial
    }));
  }

  /**
   * Actualiza el estado del manifiesto en el estado.
   * @param manifesto - Nuevo valor para el estado del manifiesto.
   */
  public setManifesto(manifesto: boolean): void {
    this.update((state) => ({
      ...state,
      manifesto
    }));
  }
}
