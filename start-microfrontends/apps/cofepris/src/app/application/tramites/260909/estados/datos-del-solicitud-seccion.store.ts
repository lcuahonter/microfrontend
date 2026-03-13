/**
 * @fileoverview Estado `DatosDelSolicituteSeccionStateStore`
 * Este archivo define el estado global para gestionar los datos relacionados con la solicitud,
 * incluyendo información del representante, establecimiento, y propietario.
 */

import { Injectable } from '@angular/core';


import { Store, StoreConfig } from '@datorama/akita';

/**
 * @interface DatosDelSolicituteSeccionState
 * Representa la estructura del estado global para los datos de la solicitud.
 */
export interface DatosDelSolicituteSeccionStateInterface {
    manifests:string
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
   * Correo electrónico del establecimiento.
   */
  establecimientoCorreoElectronico: string;

  /**
   * Código postal del domicilio del establecimiento.
   */
  establecimientoDomicilioCodigoPostal: string;

  /**
   * Identificador genérico.
   */
  ideGenerica1: string;

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
 * * Descripción del SCIAN.
 */
  descripcionScian: string;
  /**
   * Descripción Información confidencial.
   */
  informacionConfidencialRadio: string;
}

/**
 * @function createInitialState
 * Crea el estado inicial para `DatosDelSolicituteSeccionState`.
 * @returns {DatosDelSolicituteSeccionState} El estado inicial.
 */
export function createInitialState(): DatosDelSolicituteSeccionStateInterface {
  return {
      manifests:'',
     representanteRfc: '',
    representanteNombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    establecimientoCorreoElectronico: '',
    establecimientoDomicilioCodigoPostal: '',
     scian: '',
          descripcionScian: '',
     ideGenerica1: '',
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
          informacionConfidencialRadio: '',

  };
}

/**
 * @class DatosDelSolicituteSeccionStateStore
 * @description
 * Clase que representa el estado global para los datos de la solicitud.
 * Utiliza Akita para gestionar el estado de manera reactiva.
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'datosDelSolicitud' })
export class DatosDelSolicituteSeccionStateStoreI extends Store<DatosDelSolicituteSeccionStateInterface> {
  /**
   * Constructor de la clase.
   * Inicializa el estado con los valores predeterminados.
   */
  constructor() {
    super(createInitialState());
  }
   /**
   * Actualiza el valor de 'manifests' en el estado.
   * @param manifests Nuevo valor para 'manifests'.
   */
 public setManifests(manifests: string): void {
    this.update(state => ({
      ...state,
      manifests,
    }));
  }
    /**
   * Actualiza los apellidos del representante.
   * @param apellidoPaterno Nuevo apellido paterno.
   * @param apellidoMaterno Nuevo apellido materno.
   */
public setRepresentanteApellidos(apellidoPaterno: string, apellidoMaterno: string): void {
    this.update(state => ({
      ...state,
      apellidoPaterno,
      apellidoMaterno,
    }));
  }

  /**
   * Actualiza el RFC del representante.
   * @param rfc Nuevo RFC del representante.
   */
public setRepresentanteRfc(rfc: string): void {
    this.update(state => ({
      ...state,
      representanteRfc: rfc,
    }));
  }
   /**
   * Actualiza el nombre del representante.
   * @param nombre Nuevo nombre del representante.
   */
public setRepresentanteNombre(representanteNombre: string): void {
    this.update(state=>({
      ...state,
      representanteNombre: representanteNombre,
    }))
    
  }
/**
 * 
 * @param establecimientoCorreoElectronico Nuevo correo electrónico del establecimiento.
 */
  public setEstablecimientoCorreoElectronico(establecimientoCorreoElectronico: string): void {
  this.update(state => ({
    ...state,
    establecimientoCorreoElectronico,
  }));
}
/**
 * Actualiza el código postal del domicilio del establecimiento.
 * @param establecimientoDomicilioCodigoPostal Nuevo código postal del domicilio del establecimiento.
 */
public setEstablecimientoDomicilioCodigoPostal(establecimientoDomicilioCodigoPostal: string): void {
  this.update(state => ({
    ...state,
    establecimientoDomicilioCodigoPostal,
  }));
}
/**
 * Actualiza el identificador genérico en el estado.
 * @param ideGenerica1 Nuevo identificador genérico.
 */
public setIdeGenerica1(ideGenerica1: string): void {
  this.update(state => ({
    ...state,
    ideGenerica1,
  }));
}
/**
 * 
 * @param observaciones 
 */
public setObservaciones(observaciones: string): void {
  this.update(state => ({
    ...state,
    observaciones,
  }));
}
/**
 * 
 * @param establecimientoRFCResponsableSanitario Nuevo RFC del responsable sanitario del establecimiento.
 */
public setEstablecimientoRFCResponsableSanitario(establecimientoRFCResponsableSanitario: string): void {
  this.update(state => ({
    ...state,
    establecimientoRFCResponsableSanitario,
  }));
}
/**
 * Actualiza el valor de la razón social del establecimiento.
 * @param establecimientoRazonSocial Nuevo valor de la razón social del establecimiento.
 */
public setEstablecimientoRazonSocial(establecimientoRazonSocial: string): void {
  this.update(state => ({
    ...state,
    establecimientoRazonSocial,
  }));
}
/**
 * 
 * @param establecimientoEstados 
 */
public setEstablecimientoEstados(establecimientoEstados: string): void {
  this.update(state => ({
    ...state,
    establecimientoEstados,
  }));
}
/**
 * Actualiza el valor de la descripción del municipio en el estado.
 * @param descripcionMunicipio Nuevo valor de la descripción del municipio.
 */
public setDescripcionMunicipio(descripcionMunicipio: string): void {
  this.update(state => ({
    ...state,
    descripcionMunicipio,
  }));
}
/** 
  * Actualiza el valor de la localidad en el estado.
  * @param localidad Nuevo valor de la localidad.
  */
public setLocalidad(localidad: string): void {
  this.update(state => ({
    ...state,
    localidad,
  }));
}
/**
 * Actualiza el valor de las colonias en el estado.
 * @param colonias Nuevo valor de las colonias.
 */
public setColonias(colonias: string): void {
  this.update(state => ({
    ...state,
    colonias,
  }));
}
/**
 * Actualiza el valor de la calle en el estado.
 * @param calle Nuevo valor de la calle.
 */
public setCalle(calle: string): void {
  this.update(state => ({
    ...state,
    calle,
  }));
}
/**
 * * Actualiza el valor de la lada en el estado. 
 * @param lada 
 */
public setLada(lada: string): void {
  this.update(state => ({
    ...state,
    lada,
  }));
}
/**
 *  @deprecated
 * @param telefono Nuevo número de teléfono.
 */
public setTelefono(telefono: string): void {
  this.update(state => ({
    ...state,
    telefono,
  }));
}
/**
 *  Actualiza el valor del SCIAN en el estado.
 * @param scian Nuevo valor del SCIAN.
 */
public setScian(scian: string): void {
  this.update(state => ({
    ...state,
    scian,
  }));
}
/**
 * Actualiza el valor de las colonias del establecimiento.
 * @param establishomentoColonias 
 */
public setEstablishomentoColonias(establishomentoColonias: string): void {
  this.update(state => ({
    ...state,
    establishomentoColonias,
  }));
}
/**
 *  Actualiza el número de licencia sanitaria en el estado.
 * @param noLicenciaSanitaria 
 */
public setNoLicenciaSanitaria(noLicenciaSanitaria: string): void {
  this.update(state => ({
    ...state,
    noLicenciaSanitaria,
  }));
}
/**
 * Actualiza el valor del checkbox de aviso en el estado.
 * @param avisoCheckbox Nuevo valor del checkbox de aviso.
 */
public setAvisoCheckbox(avisoCheckbox: string): void {
  this.update(state => ({
    ...state,
    avisoCheckbox,
  }));
}
/**
 * Actualiza el valor de la licencia sanitaria en el estado.
 * @param licenciaSanitaria Nuevo valor de la licencia sanitaria.
 */
public setLicenciaSanitaria(licenciaSanitaria: string): void {
  this.update(state => ({
    ...state,
    licenciaSanitaria,
  }));
}
/**
 * Actualiza el régimen del establecimiento.
 * @param regimen Nuevo régimen del establecimiento.
 */
public setRegimen(regimen: string): void {
  this.update(state => ({
    ...state,
    regimen,
  }));
}
/**
 * 
 * @param aduanasEntradas 
 */
public setAduanasEntradas(aduanasEntradas: string): void {
  this.update(state => ({
    ...state,
    aduanasEntradas,
  }));
}
/**
 * 
 * @param descripcionScian Nueva descripción del SCIAN.
 */
public setDescripcionScian(descripcionScian: string): void {
  this.update(state => ({
    ...state,
    descripcionScian,
  }));
}

  /**
   * Establece la información confidencial en el estado.
   * @param informacionConfidencialRadio Nueva información confidencial.
   */
  public setInformacionConfidencial(informacionConfidencialRadio: string): void {
    this.update(state => ({
      ...state,
      informacionConfidencialRadio,
    }));
  }
}