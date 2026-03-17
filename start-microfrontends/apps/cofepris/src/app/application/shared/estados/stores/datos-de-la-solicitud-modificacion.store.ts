import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Representa el estado de una solicitud en la aplicación.
 */
export interface DatosSolicitudState {
    /**
     * Genericos relacionados con la solicitud.
     */
    genericos: string;

    /**
     * Observaciones adicionales sobre la solicitud.
     */
    observaciones: string;

    /**
     * Razón social del establecimiento.
     */
    establecimientoRazonSocial: string;

    /**
     * Correo electrónico del establecimiento.
     */
    establecimientoCorreoElectronico: string;

    /**
     * Código postal del domicilio del establecimiento.
     */
    establecimientoDomicilioCodigoPostal: string;

    /**
     * Estados relacionados con el establecimiento.
     */
    establecimientoEstados: string;

    /**
     * Descripción del municipio del establecimiento.
     */
    descripcionMunicipio: string;

    /**
     * Localidad del establecimiento.
     */
    localidad: string;

    /**
     * Colonias del establecimiento.
     */
    establishomentoColonias: string;

    /**
     * Calle del establecimiento.
     */
    calle: string;

    /**
     * Lada telefónica del establecimiento.
     */
    lada: string;

    /**
     * Teléfono del establecimiento.
     */
    telefono: string;

    /**
     * Indica si el checkbox de aviso está marcado.
     */
    avisoCheckbox: boolean;

    /**
     * Número de licencia sanitaria del establecimiento.
     */
    noLicenciaSanitaria: string;

    /**
     * Régimen del establecimiento.
     */
    regimen: string;

    /**
     * Aduanas de entrada relacionadas con la solicitud.
     */
    aduanasEntradas: string;

    /**
     * Indica si el checkbox de AIFA está marcado.
     */
    aifaCheckbox: boolean;

    /**
     * Indica si los manifiestos están presentes.
     */
    manifests: boolean;

    /**
     * Valor del radio de información confidencial.
     */
    informacionConfidencialRadio: string;

    /**
     * Código SCIAN relacionado con la solicitud.
     */
    scian: string;

    /**
     * Descripción del código SCIAN.
     */
    descripcionScian: string;
}

/**
 *
 * Esta función crea y devuelve el estado inicial para la entidad `Solicitud260603State`.
 * Proporciona valores predeterminados vacíos para todas las propiedades del estado.
 */
export function createInitialState(): DatosSolicitudState {
  return {
    genericos: '', // Estado inicial para la propiedad 'genericos'
    observaciones: '', // Estado inicial para la propiedad 'observaciones'
    establecimientoRazonSocial: '', // Estado inicial para la propiedad 'establecimientoRazonSocial'
    establecimientoCorreoElectronico: '', // Estado inicial para la propiedad 'establecimientoCorreoElectronico'
    establecimientoDomicilioCodigoPostal: '', // Estado inicial para la propiedad 'establecimientoDomicilioCodigoPostal'
    establecimientoEstados: '', // Estado inicial para la propiedad 'establecimientoEstados'
    descripcionMunicipio: '', // Estado inicial para la propiedad 'descripcionMunicipio'
    localidad: '', // Estado inicial para la propiedad 'localidad'
    establishomentoColonias: '', // Estado inicial para la propiedad 'establishomentoColonias'
    calle: '', // Estado inicial para la propiedad 'calle'
    lada: '', // Estado inicial para la propiedad 'lada'
    telefono: '', // Estado inicial para la propiedad 'telefono'
    avisoCheckbox: false, // Estado inicial para la propiedad 'avisoCheckbox'
    noLicenciaSanitaria: '', // Estado inicial para la propiedad 'noLicenciaSanitaria'
    regimen: '', // Estado inicial para la propiedad 'regimen'
    aduanasEntradas: '', // Estado inicial para la propiedad 'aduanasEntradas'
    aifaCheckbox: false, // Estado inicial para la propiedad 'aifaCheckbox'
    manifests: false, // Estado inicial para la propiedad 'manifests'
    informacionConfidencialRadio: '', // Estado inicial para la propiedad 'informacionConfidencialRadio'
    scian: '', // Estado inicial para la propiedad 'scian'
    descripcionScian: '', // Estado inicial para la propiedad 'descripcionScian'
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

@StoreConfig({ name: 'DatosSolicitudState' })

/**
 * Clase que representa el store para gestionar el estado de la solicitud.
 * Extiende la clase base `Store` para manejar el estado de tipo `Solicitud260603State`.
 */
export class DatosSolicitudStore extends Store<DatosSolicitudState> {
  /**
   * Constructor de la clase que inicializa el estado con valores predeterminados.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Actualiza el estado con el RFC.
   * @param rfc El RFC a establecer.
   */
  public setGenericos(genericos: string): void {
    this.update((state) => ({
      ...state,
      genericos,
    }));
  }

    /**
     * Actualiza el estado con las observaciones.
     * @param observaciones Las observaciones a establecer.
     */
    public setObservaciones(observaciones: string): void {
        this.update((state) => ({
            ...state,
            observaciones,
        }));
    }

    /**
     * Actualiza el estado con la razón social del establecimiento.
     * @param establecimientoRazonSocial La razón social a establecer.
     */
    public setEstablecimientoRazonSocial(establecimientoRazonSocial: string): void {
        this.update((state) => ({
            ...state,
            establecimientoRazonSocial,
        }));
    }

    /**
     * Actualiza el estado con el correo electrónico del establecimiento.
     * @param establecimientoCorreoElectronico El correo electrónico a establecer.
     */
    public setEstablecimientoCorreoElectronico(establecimientoCorreoElectronico: string): void {
        this.update((state) => ({
            ...state,
            establecimientoCorreoElectronico,
        }));
    }

    /**
     * Actualiza el estado con el código postal del domicilio del establecimiento.
     * @param establecimientoDomicilioCodigoPostal El código postal a establecer.
     */
    public setEstablecimientoDomicilioCodigoPostal(establecimientoDomicilioCodigoPostal: string): void {
        this.update((state) => ({
            ...state,
            establecimientoDomicilioCodigoPostal,
        }));
    }

    /**
     * Actualiza el estado con los estados del establecimiento.
     * @param establecimientoEstados Los estados a establecer.
     */
    public setEstablecimientoEstados(establecimientoEstados: string): void {
        this.update((state) => ({
            ...state,
            establecimientoEstados,
        }));
    }

    /**
     * Actualiza el estado con la descripción del municipio.
     * @param descripcionMunicipio La descripción del municipio a establecer.
     */
    public setDescripcionMunicipio(descripcionMunicipio: string): void {
        this.update((state) => ({
            ...state,
            descripcionMunicipio,
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
     * Actualiza el estado con las colonias del establecimiento.
     * @param establishomentoColonias Las colonias a establecer.
     */
    public setEstablishomentoColonias(establishomentoColonias: string): void {
        this.update((state) => ({
            ...state,
            establishomentoColonias,
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
     * Actualiza el estado con el valor del checkbox de aviso.
     * @param avisoCheckbox El valor del checkbox a establecer.
     */
    public setAvisoCheckbox(avisoCheckbox: boolean): void {
        this.update((state) => ({
            ...state,
            avisoCheckbox,
        }));
    }

    /**
     * Actualiza el estado con el número de licencia sanitaria.
     * @param noLicenciaSanitaria El número de licencia a establecer.
     */
    public setNoLicenciaSanitaria(noLicenciaSanitaria: string): void {
        this.update((state) => ({
            ...state,
            noLicenciaSanitaria,
        }));
    }

    /**
     * Actualiza el estado con el régimen.
     * @param regimen El régimen a establecer.
     */
    public setRegimen(regimen: string): void {
        this.update((state) => ({
            ...state,
            regimen,
        }));
    }

    /**
     * Actualiza el estado con las aduanas de entrada.
     * @param aduanasEntradas Las aduanas a establecer.
     */
    public setAduanasEntradas(aduanasEntradas: string): void {
        this.update((state) => ({
            ...state,
            aduanasEntradas,
        }));
    }

    /**
     * Actualiza el estado con el valor del checkbox de AIFA.
     * @param aifaCheckbox El valor del checkbox a establecer.
     */
    public setAifaCheckbox(aifaCheckbox: boolean): void {
        this.update((state) => ({
            ...state,
            aifaCheckbox,
        }));
    }

    /**
     * Actualiza el estado con el valor de los manifiestos.
     * @param manifests El valor de los manifiestos a establecer.
     */
    public setManifests(manifests: boolean): void { 
        this.update((state) => ({
            ...state,
            manifests,
        }));
    }
    /**
     * Actualiza el estado con el valor del radio de información confidencial.
     * @param informacionConfidencialRadio El valor del radio a establecer.
     */
    public setInformacionConfidencialRadio(informacionConfidencialRadio: string): void {
        this.update((state) => ({
            ...state,
            informacionConfidencialRadio,
        }));
    }
    /**
     * Actualiza el estado con el código SCIAN.
     * @param scian El código SCIAN a establecer.
     */
    public setScian(scian: string): void {
        this.update((state) => ({
            ...state,   
            scian,
        }));
    }
    /**
     * Actualiza el estado con la descripción del código SCIAN.
     * @param descripcionScian La descripción a establecer.
     */
    public setDescripcionScian(descripcionScian: string): void {
        this.update((state) => ({
            ...state,
            descripcionScian,
        }));
    }
    

  /**
   * Limpia los datos de la solicitud y restablece el estado inicial.
   */
  public limpiarSolicitud(): void {
    this.reset();
  }
}

