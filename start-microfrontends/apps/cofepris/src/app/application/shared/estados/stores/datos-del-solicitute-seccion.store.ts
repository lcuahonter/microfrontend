/**
 * @fileoverview Estado `DatosDelSolicituteSeccionStateStore`
 * Este archivo define el estado global para gestionar los datos relacionados con la solicitud,
 * incluyendo información del representante, establecimiento, y propietario.
 */

import { Injectable } from '@angular/core';

import { DatosDeLaProductoModel, MercanciasInfo, PropietarioModel, ScianModel } from '../../models/datos-de-la-solicitud.model';
import { Store, StoreConfig } from '@datorama/akita';

/**
 * @interface DatosDelSolicituteSeccionState
 * Representa la estructura del estado global para los datos de la solicitud.
 */
export interface DatosDelSolicituteSeccionState {
  /**
   * RFC del representante.
   */
  representanteRfc: string;

  /**
   * Nombre del representante.
   */
  representanteNombre: string;

  /**
   * Apellido paterno del representante.
   */
  apellidoPaterno: string;

  /**
   * Apellido materno del representante.
   */
  apellidoMaterno: string;

  /**
   * Denominación o razón social del establecimiento.
   */
  establecimientoDenominacionRazonSocial: string;

  /**
   * Correo electrónico del establecimiento.
   */
  establecimientoCorreoElectronico: string;

  /**
   * Código postal del domicilio del establecimiento.
   */
  establecimientoDomicilioCodigoPostal: string;

  /**
   * Estado del domicilio del establecimiento.
   */
  establecimientoDomicilioEstado: string;

  /**
   * Municipio o alcaldía del domicilio del establecimiento.
   */
  establecimientoMunicipioYAlcaldia: string;

  /**
   * Localidad del domicilio del establecimiento.
   */
  establecimientoDomicilioLocalidad: string;

  /**
   * Colonia del domicilio del establecimiento.
   */
  establecimientoDomicilioColonia: string;

  /**
   * Calle del domicilio del establecimiento.
   */
  establecimientoDomicilioCalle: string;

  /**
   * Lada del domicilio del establecimiento.
   */
  establecimientoDomicilioLada: string;

  /**
   * Teléfono del domicilio del establecimiento.
   */
  establecimientoDomicilioTelefono: string;

  /**
   * RFC del profesional responsable.
   */
  rfcDelProfesionalResponsable: string;

  /**
   * Nombre del profesional responsable.
   */
  nombreDelProfesionalResponsable: string;

  /**
   * Opción seleccionada para información confidencial.
   */
  informacionConfidencialRadio: string;

  /**
   * Lista de datos del propietario.
   */
  propietarioData: PropietarioModel[];


  /**
   * Lista de datos del establecimiento.
   */
  establecimientoData: DatosDeLaProductoModel[];

  /**
   * Identificador genérico.
   */
  ideGenerica: string;

  /**
   * Observaciones adicionales.
   */
  observaciones: string;

  /**
   * RFC del responsable sanitario del establecimiento.
   */
  establecimientoRFCResponsableSanitario: string;

  /**
   * Razón social del establecimiento.
   */
  establecimientoRazonSocial: string;

  /**
   * Estado del establecimiento.
   */
  establecimientoEstados: string;

  /**
   * Descripción del municipio.
   */
  descripcionMunicipio: string;

  /**
   * Localidad del establecimiento.
   */
  localidad: string;

  /**
   * Colonia del establecimiento.
   */
  colonias: string;

  /**
   * Calle del establecimiento.
   */
  calle: string;

  /**
   * Lada del establecimiento.
   */
  lada: string;

  /**
   * Teléfono del establecimiento.
   */
  telefono: string;

  /**
   * Código SCIAN del establecimiento.
   */
  scian: string;

  /**
   * Colonias del establecimiento.
   */
  establishomentoColonias: string;

  /**
   * Número de licencia sanitaria.
   */
  noLicenciaSanitaria: string;

  /**
   * Checkbox de aviso.
   */
  avisoCheckbox: string;

  /**
   * Licencia sanitaria.
   */
  licenciaSanitaria: string;

  /**
   * Régimen del establecimiento.
   */
  regimen: string;

  /**
   * Aduanas de entrada.
   */
  aduanasEntradas: string;

  /**
   * Checkbox de AIFA.
   */
  aifaCheckbox: string;
/**
 * * Descripción del SCIAN.
 */
  descripcionScian: string;
  noDeLicenciaSanitaria:string;
  noDeLicenciaSanitariaObservaciones:string;
  regimenAlQueSeDestinaraLaMercancía:string;
  aduanaDeSalida:string;
  manifests:string,
  personaparas: ScianModel[],
  avisoDeFuncionamiento:string,
  idSolicitud: number
  scianData:ScianModel[]
  mercanciaDatos: MercanciasInfo[];
  original?: string;
}

/**
 * @function createInitialState
 * Crea el estado inicial para `DatosDelSolicituteSeccionState`.
 * @returns {DatosDelSolicituteSeccionState} El estado inicial.
 */
export function createInitialState(): DatosDelSolicituteSeccionState {
  return {
    representanteRfc: '',
    representanteNombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    establecimientoDenominacionRazonSocial: '',
    establecimientoCorreoElectronico: '',
    establecimientoDomicilioCodigoPostal: '',
    establecimientoDomicilioEstado: '',
    establecimientoMunicipioYAlcaldia: '',
    establecimientoDomicilioLocalidad: '',
    establecimientoDomicilioColonia: '',
    establecimientoDomicilioCalle: '',
    establecimientoDomicilioLada: '',
    establecimientoDomicilioTelefono: '',
    rfcDelProfesionalResponsable: '',
    nombreDelProfesionalResponsable: '',
    informacionConfidencialRadio: '',
    propietarioData: [],
    personaparas: [],
    establecimientoData: [],
    scian: '',
    descripcionScian: '',
    ideGenerica: '',
    observaciones: '',
    establecimientoRFCResponsableSanitario: '',
    establecimientoRazonSocial:'',
    establishomentoColonias:'',
    establecimientoEstados :'',
    descripcionMunicipio: '',
    localidad :'',
    colonias:'',
    calle: '',
    lada: '',
    telefono:'',
  
    noLicenciaSanitaria: '',
    avisoCheckbox: '',
    licenciaSanitaria: '',
    regimen:'',
    aduanasEntradas: '',
    aifaCheckbox: '',
    noDeLicenciaSanitaria:'',
    noDeLicenciaSanitariaObservaciones:'',
    regimenAlQueSeDestinaraLaMercancía:'',
    aduanaDeSalida:'',
    manifests:'',
          scianData:[],
    mercanciaDatos: [],
    avisoDeFuncionamiento:'',
    idSolicitud: 0,
    original: ''
  };
}

/**
 * @class DatosDelSolicituteSeccionStateStore
 * @description
 * Clase que representa el estado global para los datos de la solicitud.
 * Utiliza Akita para gestionar el estado de manera reactiva.
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'datosDelSolicitute' })
export class DatosDelSolicituteSeccionStateStore extends Store<DatosDelSolicituteSeccionState> {
  /**
   * Constructor de la clase.
   * Inicializa el estado con los valores predeterminados.
   */
  constructor() {
    super(createInitialState());
  }

 
  /**
   * Actualiza el RFC del representante.
   * @param rfc Nuevo RFC del representante.
   */
  setRepresentanteRfc(rfc: string): void {
    this.update({ representanteRfc: rfc });
  }

  /**
   * Actualiza el nombre del representante.
   * @param nombre Nuevo nombre del representante.
   */
  setRepresentanteNombre(nombre: string): void {
    this.update({ representanteNombre: nombre });
  }

  /**
   * Actualiza los apellidos del representante.
   * @param apellidoPaterno Nuevo apellido paterno.
   * @param apellidoMaterno Nuevo apellido materno.
   */
  setRepresentanteApellidos(apellidoPaterno: string, apellidoMaterno: string): void {
    this.update({ apellidoPaterno, apellidoMaterno });
  }

  /**
   * Actualiza la opción seleccionada de información confidencial.
   * @param informacionConfidencial Nueva opción seleccionada.
   */
  setInformacionConfidencial(informacionConfidencial: string): void {
    this.update({ informacionConfidencialRadio: informacionConfidencial });
  }

  /**
   * Actualiza la denominación o razón social del establecimiento.
   * @param establecimientoDenominacionRazonSocial Nueva denominación o razón social del establecimiento.
   */
  setEstablecimientoDenominacionRazonSocial(establecimientoDenominacionRazonSocial: string): void {
    this.update({ establecimientoDenominacionRazonSocial });
  }

  /**
   * Actualiza el correo electrónico del establecimiento.
   * @param establecimientoCorreoElectronico Nuevo correo electrónico del establecimiento.
   */
  setEstablecimientoCorreoElectronico(establecimientoCorreoElectronico: string): void {
    this.update({ establecimientoCorreoElectronico });
  }

  /**
   * Actualiza el código postal del domicilio del establecimiento.
   * @param establecimientoDomicilioCodigoPostal Nuevo código postal del domicilio del establecimiento.
   */
  setEstablecimientoDomicilioCodigoPostal(establecimientoDomicilioCodigoPostal: string): void {
    this.update({ establecimientoDomicilioCodigoPostal });    
  }

  /**
   * Actualiza el estado del domicilio del establecimiento.
   * @param establecimientoDomicilioEstado Nuevo estado del domicilio del establecimiento.
   */
  setEstablecimientoDomicilioEstado(establecimientoDomicilioEstado: string): void {
    this.update({ establecimientoDomicilioEstado });
  }

  /**
   * Actualiza el municipio o alcaldía del domicilio del establecimiento.
   * @param establecimientoMunicipioYAlcaldia Nuevo municipio o alcaldía del domicilio del establecimiento.
   */
  setEstablecimientoMunicipioYAlcaldia(establecimientoMunicipioYAlcaldia: string): void {
    this.update({ establecimientoMunicipioYAlcaldia });
  }
  /**
   * Actualiza la localidad del domicilio del establecimiento.
   * @param establecimientoDomicilioLocalidad Nueva localidad del domicilio del establecimiento.
   */
  setEstablecimientoDomicilioLocalidad(establecimientoDomicilioLocalidad: string): void {
    this.update({ establecimientoDomicilioLocalidad });
  }

  /**
   * Actualiza la colonia del domicilio del establecimiento.
   * @param establecimientoDomicilioColonia Nueva colonia del domicilio del establecimiento.
   */
  setEstablecimientoDomicilioColonia(establecimientoDomicilioColonia: string): void {
    this.update({ establecimientoDomicilioColonia });
  }

  /**
   * Actualiza la calle del domicilio del establecimiento.
   * @param establecimientoDomicilioCalle Nueva calle del domicilio del establecimiento.
   */
  setEstablecimientoDomicilioCalle(establecimientoDomicilioCalle: string): void {
    this.update({ establecimientoDomicilioCalle });
  }

  /**
   * Actualiza la lada del domicilio del establecimiento.
   * @param establecimientoDomicilioLada Nueva lada del domicilio del establecimiento.
   */
  setEstablecimientoDomicilioLada(establecimientoDomicilioLada: string): void {
    this.update({ establecimientoDomicilioLada });
  }

  /**
   * Actualiza el teléfono del domicilio del establecimiento.
   * @param establecimientoDomicilioTelefono Nuevo teléfono del domicilio del establecimiento.
   */
  setEstablecimientoDomicilioTelefono(establecimientoDomicilioTelefono: string): void {
    this.update({ establecimientoDomicilioTelefono });
  }
  /**
   * Actualiza el RFC del profesional responsable.
   * @param rfcDelProfesionalResponsable Nuevo RFC del profesional responsable.
   */
  setRfcDelProfesionalResponsable(rfcDelProfesionalResponsable: string): void {
    this.update({ rfcDelProfesionalResponsable });
  }
  /**
   * Actualiza el nombre del profesional responsable.
   * @param nombreDelProfesionalResponsable Nuevo nombre del profesional responsable.
   */
  setNombreDelProfesionalResponsable(nombreDelProfesionalResponsable: string): void {
    this.update({ nombreDelProfesionalResponsable });
  }
  /**
   * Actualiza el número de licencia sanitaria.
   * @param noDeLicenciaSanitaria Nuevo número de licencia sanitaria.
   */
  setNoDeLicenciaSanitaria(noDeLicenciaSanitaria: string): void {
    this.update({ noDeLicenciaSanitaria });
  }
  /**
   * Actualiza las observaciones del número de licencia sanitaria.
   * @param noDeLicenciaSanitariaObservaciones Nuevas observaciones del número de licencia sanitaria.
   */
  setNoDeLicenciaSanitariaObservaciones(noDeLicenciaSanitariaObservaciones: string): void {
    this.update({ noDeLicenciaSanitariaObservaciones });
  }
  /**
   * Actualiza el régimen al que se destinará la mercancía.
   * @param regimenAlQueSeDestinaraLaMercancía Nuevo régimen al que se destinará la mercancía.
   */
  setRegimenAlQueSeDestinaraLaMercancía(regimenAlQueSeDestinaraLaMercancía: string): void {
    this.update({ regimenAlQueSeDestinaraLaMercancía });
  }
  /**
   * Establece el valor de la aduana de salida en el estado de la tienda.
   *
   * @param aduanaDeSalida - El nombre o identificador de la aduana de salida a establecer.
   */
  setAduanaDeSalida(aduanaDeSalida: string): void {
    this.update({ aduanaDeSalida });
  }
  /**
   * Actualiza el identificador genérico.
   * @param ideGenerica Nuevo identificador genérico.
   */
  setIdeGenerica(ideGenerica: string): void {
    this.update({ ideGenerica });
  }

  /**
   * Actualiza las observaciones del trámite.
   * @param observaciones Nuevas observaciones del trámite.
   */
  setObservaciones(observaciones: string): void {
    this.update({ observaciones });
  }
  /**
   * Actualiza el valor de la razón social del establecimiento en el estado.
   *
   * @param establecimientoRazonSocial - La nueva razón social del establecimiento a establecer.
   */
  setEstablecimientoRazonSocial(establecimientoRazonSocial: string): void {
    this.update({ establecimientoRazonSocial });
  }
  /**
   * Establece el valor del RFC del responsable sanitario del establecimiento.
   *
   * @param establecimientoRFCResponsableSanitario - El RFC del responsable sanitario que se asignará al establecimiento.
   */
  setEstablecimientoRFCResponsableSanitario(establecimientoRFCResponsableSanitario: string): void {
    this.update({ establecimientoRFCResponsableSanitario });
  }
  /**
   * Establece el valor de los estados del establecimiento en el store.
   *
   * @param establecimientoEstados - Una cadena que representa los estados del establecimiento a actualizar.
   */
  setEstablecimientoEstados(establecimientoEstados:string):void {
    this.update({establecimientoEstados})
  }
  /**
   * Establece la descripción del municipio en el estado de la tienda.
   *
   * @param descripcionMunicipio - La nueva descripción del municipio a asignar.
   */
  setDescripcionMunicipio(descripcionMunicipio: string): void {
    this.update({ descripcionMunicipio });
  }
  /**
   * Establece el valor de la localidad en el estado de la tienda.
   *
   * @param localidad - El nombre de la localidad a establecer.
   */
  setLocalidad(localidad: string): void {
    this.update({ localidad });
  }
  /**
   * Actualiza las colonias del establecimiento.
   * @param establishomentoColonias Nuevas colonias del establecimiento.
   */
  setEstablishomentoColonias(establishomentoColonias: string): void {
    this.update({ establishomentoColonias });
  }
  /**
   * Actualiza la calle del establecimiento.
   * @param calle Nueva calle del establecimiento.
   */
  setCalle(calle: string): void {
    this.update({ calle });
  }
  /**
   * Actualiza la lada del establecimiento.
   * @param lada Nueva lada del establecimiento.
   */
  setLada(lada: string): void {
    this.update({ lada });
  }
  /**
   * Actualiza el teléfono del establecimiento.
   * @param telefono Nuevo teléfono del establecimiento.
   */
  setTelefono(telefono: string): void {
    this.update({ telefono });
  }
  /**
   * Actualiza el régimen del establecimiento.
   * @param regimen Nuevo régimen del establecimiento.
   */
  setRegimen(regimen: string): void {
    this.update({ regimen });
  }
  /**
   * Actualiza las aduanas de entrada.
   * @param aduanasEntradas Nuevas aduanas de entrada.
   */
  setAduanasEntradas(aduanasEntradas: string): void {
    this.update({ aduanasEntradas });
  }
  /**
   * Actualiza el número de licencia sanitaria.
   * @param noLicenciaSanitaria Nuevo número de licencia sanitaria.
   */
  setNoLicenciaSanitaria(noLicenciaSanitaria: string): void {
    this.update({ noLicenciaSanitaria });
  }

  /**
   * Actualiza el valor de 'manifests' en el estado.
   * @param manifests Nuevo valor para 'manifests'.
   */
  setManifests(manifests: string): void {
    this.update({ manifests });
  }

  /** Asigna el aviso de funcionamiento en el estado  
 *  actualizando el store con el valor proporcionado. */
  setAvisoDeFuncionamiento(avisoDeFuncionamiento: string): void {
    this.update({ avisoDeFuncionamiento });
  }

  /** Establece el identificador de la solicitud en el estado.  
 *  Actualiza el store asignando el valor recibido. */
  setIdSolicitud(idSolicitud: number): void {
    this.update({ idSolicitud });
  }
  
  setScianTabla(scianData: ScianModel[]): void {
    this.update((state) => ({
      ...state,
      scianData
    }));
  }


  setMercanciaDatos(mercanciaDatos: MercanciasInfo[]): void {
    this.update({ mercanciaDatos });
  }

  /**
   * @method setDynamicFieldValue
   * @description Actualiza dinámicamente un campo específico en el estado del store.
   * @param fieldName - El nombre del campo que se desea actualizar.
   * @param value - El nuevo valor que se asignará al campo.
   */
  public setDynamicFieldValue(fieldName: string, value: unknown): void {
    this.update((state) => ({
      ...state,
      [fieldName]: value,
    }));
  }
}