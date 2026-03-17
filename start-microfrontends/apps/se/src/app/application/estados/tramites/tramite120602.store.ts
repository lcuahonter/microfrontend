import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Creacion del estado inicial para la interfaz de tramite 120602
 * @returns Solicitud120602State
 */
export interface Solicitud120602State {
    estado: string,
    representacionFederal: string,
    tipoEmpresa: string|null,
    especifique: string,
    actividadEconomicaPreponderante:string,
    descripcion:string,
    pais:string,
    codigoPostal: string,
    estadoDomicilio: string,
    municipioAlcaldia:string,
    localidad: string,
    colonia: string,
    calle: string,
    numeroExterior: string,
    numeroInterior: string,
    lada: string,
    telefono: string,
    nacionalidad: string,
    tipoDePersona: string,
    taxId: string,
    denominacion: string,
    datosPais: string |null,
    datosCodigoPostal: string,
    datosEstado: string,
    correoElectronico: string,

}

export function createInitialState(): Solicitud120602State {
    return {
        estado: '',
        representacionFederal: '',
        tipoEmpresa: '',
        especifique: '',
        actividadEconomicaPreponderante:'',
        descripcion:'',
        pais:'',
        codigoPostal: '',
        estadoDomicilio: '',
        municipioAlcaldia:'',
        localidad: '',
        colonia: '',
        calle: '',
        numeroExterior: '',
        numeroInterior: '',
        lada: '',
        telefono: '',
        nacionalidad: '',
        tipoDePersona: '',
        taxId: '',
        denominacion: '',
        datosPais: '',
        datosCodigoPostal: '',
        datosEstado: '',
        correoElectronico: '',
    
    };
}

 /**
 * Injectable decorator to make the store available at the root level.
 */
@Injectable({
    providedIn: 'root',
})

@StoreConfig({ name: 'tramite120602', resettable: true })

export class Tramite120602Store extends Store<Solicitud120602State>{
    
    constructor() {
        super(createInitialState());
    }
  /**
   * Guarda el tipo de solicitud en el estado.
   *
   * @param estado - El estado que se va a guardar.
   */
    public setEstado(estado: string):void {
        this.update((state) => ({
            ...state,
            estado,
        }));
    }

    public setRepresentacionFederal(representacionFederal: string):void {
        this.update((state) => ({
            ...state,
            representacionFederal,
        }));
    }
    public setTipoEmpresa(tipoEmpresa: string):void {
        this.update((state) => ({
            ...state,
            tipoEmpresa,
        }));
    }
    public setEspecifique(especifique: string):void { 
        this.update((state) => ({
            ...state,
            especifique,
        }));
    }
    public setActividadEconomicaPreponderante(actividadEconomicaPreponderante: string):void {
        this.update((state) => ({
            ...state,
            actividadEconomicaPreponderante,
        }));
    }
    public setDescripcion(descripcion: string):void {
        this.update((state) => ({
            ...state,
            descripcion,
        }));
    }
    public setPais(pais: string):void {
        this.update((state) => ({
            ...state,
            pais,
        }));
    }
    public setCodigoPostal(codigoPostal: string):void {
        this.update((state) => ({
            ...state,
            codigoPostal,
        }));
    }
    public setEstadoDomicilio(estadoDomicilio: string):void {
        this.update((state) => ({
            ...state,
            estadoDomicilio,
        }));
    }
    public setMunicipioAlcaldia(municipioAlcaldia: string):void {
        this.update((state) => ({
            ...state,
            municipioAlcaldia,
        }));
    }
    public setLocalidad(localidad: string):void {
        this.update((state) => ({
            ...state,
            localidad,
        }));
    }
    public setColonia(colonia: string):void {
        this.update((state) => ({
            ...state,
            colonia,
        }));
    }
    public setCalle(calle: string):void {
        this.update((state) => ({
            ...state,
            calle,
        }));
    }
    public setNumeroExterior(numeroExterior: string):void {
        this.update((state) => ({
            ...state,
            numeroExterior,
        }));
    }
    public setNumeroInterior(numeroInterior: string):void {
        this.update((state) => ({
            ...state,
            numeroInterior,
        }));
    }
    public setLada(lada: string):void {
        this.update((state) => ({
            ...state,
            lada,
        }));
    }
    public setTelefono(telefono: string):void {
        this.update((state) => ({
            ...state,
            telefono,
        }));
    }
    public setNacionalidad(nacionalidad: string):void {
        this.update((state) => ({
            ...state,
            nacionalidad,
        }));
    }
    public setTipoDePersona(tipoDePersona: string):void {
        this.update((state) => ({
            ...state,
            tipoDePersona,
        }));
    }
    public setTaxId(taxId: string):void {
        this.update((state) => ({
            ...state,
            taxId,
        }));
    }
    public setDenominacion(denominacion: string):void {
        this.update((state) => ({
            ...state,
            denominacion,
        }));
    }
    public setDatosPais(datosPais: string):void {
        this.update((state) => ({
            ...state,
            datosPais,
        }));
    }
    public setDatosCodigoPostal(datosCodigoPostal: string):void {
        this.update((state) => ({
            ...state,
            datosCodigoPostal,
        }));
    }
    public setDatosEstado(datosEstado: string):void {
        this.update((state) => ({
            ...state,
            datosEstado,
        }));
    }
    public setCorreoElectronico(correoElectronico: string):void {
        this.update((state) => ({
            ...state,
            correoElectronico,
        }));
    }
    public limpiarDatosEmpresa():void {
        this.reset();
    }
} 
  