import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Creacion del estado inicial para la interfaz de tramite 32511
 * @interface Avisos32511State
 * @returns {Avisos32511State} Estado inicial de renovacion
 */
export interface Avisos32511State {
    /**
     * Opción seleccionada del botón de radio
     * @type { string }
     */
    rgceOpcion?: string;

    /**
     * Fecha de inicio del evento
     * @type { string }
     */
    fechaInicioEvento?: string;

    /**
     * Calle donde se llevará a cabo el evento
     * @type { string }
     */
    calle?: string;

    /**
     * Número exterior de la calle
     * @type { string }
     */
    numeroExterior?: string;

    /**
     * Número interior de la calle
     * @type { string }
     */
    numeroInterior?: string;

    /**
     * Código postal de la ubicación del evento
     * @type { string }
     */
    codigoPostal?: string;

    /**
     * Estado de la entidad federativa
     * @type { string }
     */
    entidadFederativa?: string;

    /**
     * Estado de la alcaldía o municipio
     * @type { string }
     */
    alcaldiaMunicipio?: string;

    /**
     * Estado de la colonia
     * @type { string }
     */
    colonia?: string;

    /**
     * Estado de la fecha de conclusión del evento
     * @type { string }
     */
    fechaConclusionEvento?: string;

    /**
     * Fecha de destrucción del aviso
     * @type { string }
     */
    fechaDestruccion?: string;

    /**
     * Hora de destrucción del aviso
     * @type { string }
     */
    destruccionHora?: string;

    /**
     * Calle de destrucción de mercancías
     * @type { string }
     */
    dmCalle?: string;

    /**
     * Número exterior de la calle de destrucción de mercancías
     * @type { string }
     */
    dmNumeroExterior?: string;

    /**
     * Número interior de la calle de destrucción de mercancías
     * @type { string }
     */
    dmNumeroInterior?: string;

    /**
     * Código postal de la ubicación de destrucción de mercancías
     * @type { string }
     */
    dmCodigoPostal?: string;

    /**
     * Estado de la entidad federativa de destrucción de mercancías
     * @type { string }
     */
    dmEntidadFederativa?: string;

    /**
     * Estado de la alcaldía o municipio de destrucción de mercancías
     * @type { string }
     */
    dmAlcaldiaMunicipio?: string;

    /**
     * Estado de la colonia de destrucción de mercancías
     * @type { string }
     */
    dmColonia?: string;
}

/**
 * Crea el estado inicial para la interfaz de tramite 32511
 * @returns {Avisos32511State} Estado inicial de avisos
 */
export function createInitialState(): Avisos32511State {
    return {
        rgceOpcion: '',
        fechaInicioEvento: '',
        calle: '',
        numeroExterior: '',
        numeroInterior: '',
        codigoPostal: '',
        entidadFederativa: '',
        alcaldiaMunicipio: '',
        colonia: '',
        fechaConclusionEvento: '',
        fechaDestruccion: '',
        destruccionHora: '',
        dmCalle: '',
        dmNumeroExterior: '',
        dmNumeroInterior: '',
        dmCodigoPostal: '',
        dmEntidadFederativa: '',
        dmAlcaldiaMunicipio: '',
        dmColonia: ''
    };
}

/**
 * Clase que representa el almacén de estado para el trámite 32511.
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Clase que representa el almacén de estado para el trámite 32511.
 * @StoreConfig { name: 'tramite32511', resettable: true }
 * @class Tramite32511Store
 * @extends Store<Avisos32511State>
 * @description Almacén de estado para el trámite 32511.
 */
@StoreConfig({ name: 'tramite32511', resettable: true })
export class Tramite32511Store extends Store<Avisos32511State> {
    constructor() {
        super(createInitialState());
    }

    /**
     * Método para establecer la opción seleccionada del botón de radio en el estado.
     * @param {string} rgceOpcion - Opción seleccionada del botón de radio.
     */
    public setRgceOpcion(rgceOpcion: string): void {
        this.update((state) => ({
            ...state,
            rgceOpcion
        }));
    }

    /**
     * Método para establecer la fecha de inicio del evento en el estado.
     * @param {string} fechaInicioEvento - Fecha de inicio del evento.
     */
    public setFechaInicioEvento(fechaInicioEvento: string): void {
        this.update((state) => ({
            ...state,
            fechaInicioEvento
        }));
    }

    /**
     * Método para establecer la calle donde se llevará a cabo el evento en el estado.
     * @param {string} calle - Calle donde se llevará a cabo el evento.
     */
    public setCalle(calle: string): void {
        this.update((state) => ({
            ...state,
            calle
        }));
    }

    /**
     * Método para establecer el número exterior de la calle en el estado.
     * @param {string} numeroExterior - Número exterior de la calle.
     */
    public setNumeroExterior(numeroExterior: string): void {
        this.update((state) => ({
            ...state,
            numeroExterior
        }));
    }

    /**
     * Método para establecer el número interior de la calle en el estado.
     * @param {string} numeroInterior - Número interior de la calle.
     */
    public setNumeroInterior(numeroInterior: string): void {
        this.update((state) => ({
            ...state,
            numeroInterior
        }));
    }

    /**
     * Método para establecer el código postal de la ubicación del evento en el estado.
     * @param {string} codigoPostal - Código postal de la ubicación del evento.
     */
    public setCodigoPostal(codigoPostal: string): void {
        this.update((state) => ({
            ...state,
            codigoPostal
        }));
    }

    /**
     * Método para establecer el estado de la entidad federativa en el estado.
     * @param {string} entidadFederativa - Estado de la entidad federativa.
     */
    public setEntidadFederativa(entidadFederativa: string): void {
        this.update((state) => ({
            ...state,
            entidadFederativa
        }));
    }

    /**
     * Método para establecer el estado de la alcaldía o municipio en el estado.
     * @param {string} alcaldiaMunicipio - Estado de la alcaldía o municipio.
     */
    public setAlcaldiaMunicipio(alcaldiaMunicipio: string): void {
        this.update((state) => ({
            ...state,
            alcaldiaMunicipio
        }));
    }

    /**
     * Método para establecer el estado de la colonia en el estado.
     * @param {string} colonia - Estado de la colonia.
     */
    public setColonia(colonia: string): void {
        this.update((state) => ({
            ...state,
            colonia
        }));
    }

    /**
     * Método para establecer la fecha de conclusión del evento en el estado.
     * @param {string} fechaConclusionEvento - Fecha de conclusión del evento.
     */
    public setFechaConclusionEvento(fechaConclusionEvento: string): void {
        this.update((state) => ({
            ...state,
            fechaConclusionEvento
        }));
    }

    /**
     * Método para establecer la fecha de destrucción del aviso en el estado.
     * @param {string} fechaDestruccion - Fecha de destrucción del aviso.
     */
    public setFechaDestruccion(fechaDestruccion: string): void {
        this.update((state) => ({
            ...state,
            fechaDestruccion
        }));
    }

    /**
     * Método para establecer la hora de destrucción del aviso en el estado.
     * @param {string} destruccionHora - Hora de destrucción del aviso.
     */
    public setDestruccionHora(destruccionHora: string): void {
        this.update((state) => ({
            ...state,
            destruccionHora
        }));
    }

    /**
     * Método para establecer la calle de destrucción de mercancías en el estado.
     * @param {string} dmCalle - Calle de destrucción de mercancías.
     */
    public setDmCalle(dmCalle: string): void {
        this.update((state) => ({
            ...state,
            dmCalle
        }));
    }

    /**
     * Método para establecer el número exterior de la calle de destrucción de mercancías en el estado.
     * @param {string} dmNumeroExterior - Número exterior de la calle de destrucción de mercancías.
     */
    public setDmNumeroExterior(dmNumeroExterior: string): void {
        this.update((state) => ({
            ...state,
            dmNumeroExterior
        }));
    }

    /**
     * Método para establecer el número interior de la calle de destrucción de mercancías en el estado.
     * @param {string} dmNumeroInterior - Número interior de la calle de destrucción de mercancías.
     */
    public setDmNumeroInterior(dmNumeroInterior: string): void {
        this.update((state) => ({
            ...state,
            dmNumeroInterior
        }));
    }

    /**
     * Método para establecer el código postal de la ubicación de destrucción de mercancías en el estado.
     * @param {string} dmCodigoPostal - Código postal de la ubicación de destrucción de mercancías.
     */
    public setDmCodigoPostal(dmCodigoPostal: string): void {
        this.update((state) => ({
            ...state,
            dmCodigoPostal
        }));
    }

    /**
     * Método para establecer el estado de la entidad federativa de destrucción de mercancías en el estado.
     * @param {string} dmEntidadFederativa - Estado de la entidad federativa de destrucción de mercancías.
     */
    public setDmEntidadFederativa(dmEntidadFederativa: string): void {
        this.update((state) => ({
            ...state,
            dmEntidadFederativa
        }));
    }

    /**
     * Método para establecer el estado de la alcaldía o municipio de destrucción de mercancías en el estado.
     * @param {string} dmAlcaldiaMunicipio - Estado de la alcaldía o municipio de destrucción de mercancías.
     */
    public setDmAlcaldiaMunicipio(dmAlcaldiaMunicipio: string): void {
        this.update((state) => ({
            ...state,
            dmAlcaldiaMunicipio
        }));
    }

    /**
     * Método para establecer el estado de la colonia de destrucción de mercancías en el estado.
     * @param {string} dmColonia - Estado de la colonia de destrucción de mercancías.
     */
    public setDmColonia(dmColonia: string): void {
        this.update((state) => ({
            ...state,
            dmColonia
        }));
    }

    /**
     * Actualiza el estado de los avisos de destrucción de mercancías.     
     * @param nuevoDatos - Nuevo estado de los avisos de destrucción de mercancías.
     * @type {Avisos32511State}
     * @return {void}
     */
    public setAvisosState(nuevoDatos: Avisos32511State): void {
    this.update(nuevoDatos);
  }
}