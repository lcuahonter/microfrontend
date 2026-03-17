import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * @interface DestruccionState
 * @description 
 * Representa el estado del formulario de destrucción.
 */
export interface DestruccionState {
/**
 * @property {string} tipoDeAviso
 * @descripcion 
 * Tipo de aviso relacionado con la destrucción.
 */
tipoDeAviso: string;

/**
 * @property {string} nombre
 * @descripcion 
 * Nombre del solicitante.
 */
nombre: string;

/**
 * @property {string} rfc
 * @descripcion 
 * RFC del solicitante.
 */
rfc: string;

/**
 * @property {string} entidadFederativa
 * @descripcion 
 * Entidad federativa del solicitante.
 */
entidadFederativa: string;

/**
 * @property {string} alcaldiaMunicipo
 * @descripcion 
 * Alcaldía o municipio del solicitante.
 */
alcaldiaMunicipo: string;

/**
 * @property {string} colonia
 * @descripcion 
 * Colonia del solicitante.
 */
colonia: string;

/**
 * @property {string} calle
 * @descripcion 
 * Calle del solicitante.
 */
calle: string;

/**
 * @property {string} numeroExterior
 * @descripcion 
 * Número exterior del domicilio del solicitante.
 */
numeroExterior: string;

/**
 * @property {string} numeroInterior
 * @descripcion 
 * Número interior del domicilio del solicitante.
 */
numeroInterior: string;

/**
 * @property {string} codigoPostal
 * @descripcion 
 * Código postal del domicilio del solicitante.
 */
codigoPostal: string;

/**
 * @property {string} cartaCupo
 * @descripcion 
 * Carta cupo asociada al trámite.
 */
cartaCupo: string;

/**
 * @property {string} numeraDeAcuse
 * @descripcion 
 * Número de acuse del trámite.
 */
numeraDeAcuse: string;

/**
 * @property {string} destruccionMercancia
 * @descripcion 
 * Información sobre la destrucción de mercancía.
 */
destruccionMercancia: string;

/**
 * @property {string} merccanciaEntidadFederativa
 * @descripcion 
 * Entidad federativa donde se encuentra la mercancía.
 */
merccanciaEntidadFederativa: string;

/**
 * @property {string} merccanciaAlcaldiaMunicipo
 * @descripcion 
 * Alcaldía o municipio donde se encuentra la mercancía.
 */
merccanciaAlcaldiaMunicipo: string;

/**
 * @property {string} merccanciaColonia
 * @descripcion 
 * Colonia donde se encuentra la mercancía.
 */
merccanciaColonia: string;

/**
 * @property {string} merccanciaCalle
 * @descripcion 
 * Calle donde se encuentra la mercancía.
 */
merccanciaCalle: string;

/**
 * @property {string} merccanciaNumeroExterior
 * @descripcion 
 * Número exterior del lugar donde se encuentra la mercancía.
 */
merccanciaNumeroExterior: string;

/**
 * @property {string} merccanciaNumeroInterior
 * @descripcion 
 * Número interior del lugar donde se encuentra la mercancía.
 */
merccanciaNumeroInterior: string;

/**
 * @property {string} merccanciaCodigoPostal
 * @descripcion 
 * Código postal del lugar donde se encuentra la mercancía.
 */
merccanciaCodigoPostal: string;

/**
 * @property {string} destruir
 * @descripcion 
 * Información sobre la acción de destruir la mercancía.
 */
destruir: string;

/**
 * @property {string} tarifa
 * @descripcion 
 * Tarifa asociada al trámite.
 */
tarifa: string;

/**
 * @property {string} destruccionEntidadFederativa
 * @descripcion 
 * Entidad federativa donde se llevará a cabo la destrucción.
 */
destruccionEntidadFederativa: string;

/**
 * @property {string} destruccionAlcaldiaMunicipo
 * @descripcion 
 * Alcaldía o municipio donde se llevará a cabo la destrucción.
 */
destruccionAlcaldiaMunicipo: string;

/**
 * @property {string} destruccionColonia
 * @descripcion 
 * Colonia donde se llevará a cabo la destrucción.
 */
destruccionColonia: string;

/**
 * @property {string} destruccionCalle
 * @descripcion 
 * Calle donde se llevará a cabo la destrucción.
 */
destruccionCalle: string;

/**
 * @property {string} destruccionNumeroExterior
 * @descripcion 
 * Número exterior del lugar donde se llevará a cabo la destrucción.
 */
destruccionNumeroExterior: string;

/**
 * @property {string} destruccionNumeroInterior
 * @descripcion 
 * Número interior del lugar donde se llevará a cabo la destrucción.
 */
destruccionNumeroInterior: string;

/**
 * @property {string} destruccionCodigoPostal
 * @descripcion 
 * Código postal del lugar donde se llevará a cabo la destrucción.
 */
destruccionCodigoPostal: string;

/**
 * @property {string} destruccionHora
 * @descripcion 
 * Hora en la que se llevará a cabo la destrucción.
 */
destruccionHora: string;

/**
 * @property {string} desturccionProceso
 * @descripcion 
 * Proceso de destrucción de la mercancía.
 */
desturccionProceso: string;

/**
 * @property {string} casofortuito
 * @descripcion 
 * Información sobre el caso fortuito relacionado con la destrucción.
 */
casofortuito: string;

/**
 * @property {string} donoMercancia
 * @descripcion 
 * Información sobre la donación de mercancía.
 */
donoMercancia: string;

/**
 * @property {string} condicionesMateriales
 * @descripcion 
 * Condiciones materiales relacionadas con la destrucción.
 */
condicionesMateriales: string;

/**
 * @property {string} caboDestruccionFecha
 * @descripcion 
 * Fecha en la que se llevó a cabo la destrucción.
 */
caboDestruccionFecha: string;
}

/**
 * Este estado inicial contiene todos los campos necesarios para el formulario, con valores por defecto.
 * @function createInitialState
 * @description 
 * Crea el estado inicial del formulario de destrucción.
 * @returns {DestruccionState} Estado inicial.
 */
export function createInitialState(): DestruccionState {
    return {
        tipoDeAviso: '',
        nombre: '',
        rfc: '',
        entidadFederativa: '',
        alcaldiaMunicipo: '',
        colonia: '',
        calle: '',
        numeroExterior: '',
        numeroInterior: '',
        codigoPostal: '',
        cartaCupo: '',
        numeraDeAcuse: '',
        destruccionMercancia: '',
        merccanciaEntidadFederativa: '',
        merccanciaAlcaldiaMunicipo: '',
        merccanciaColonia: '',
        merccanciaCalle: '',
        merccanciaNumeroExterior: '',
        merccanciaNumeroInterior: '',
        merccanciaCodigoPostal: '',
        destruir: '',
        tarifa: '',
        destruccionEntidadFederativa: '',
        destruccionAlcaldiaMunicipo: '',
        destruccionColonia: '',
        destruccionCalle: '',
        destruccionNumeroExterior: '',
        destruccionNumeroInterior: '',
        destruccionCodigoPostal: '',
        destruccionHora: '',
        desturccionProceso: '',
        casofortuito: '',
        donoMercancia: '',
        condicionesMateriales: '',
        caboDestruccionFecha: '',
    };
}


/**
 * @descripcion
 * Store encargado de gestionar el estado global del formulario de destrucción para el trámite 32509.
 * Permite actualizar y consultar los datos de los diferentes campos del formulario, así como el estado de cada sección.
 * Utiliza Akita para la gestión reactiva del estado.
 *
 * Cada método con el decorador `@method` actualiza una propiedad específica del estado, permitiendo un manejo centralizado y reactivo de los datos del formulario.
 * @export
 * @class DestruccionStore
 * @extends {Store<DestruccionState>}
 */
@Injectable({
    providedIn: 'root',
})
@StoreConfig({ name: 'Destruccion', resettable: true })
export class DestruccionStore extends Store<DestruccionState> {
    /**
     * @constructor
     * @description 
     * Inicializa el estado del almacén.
     */
    constructor() {
        super(createInitialState());
    }

    /**
     * @method setTipoDeAviso
     * @description 
     * Actualiza el tipo de aviso en el estado.
     * @param {string} tipoDeAviso - Tipo de aviso.
     */
    public setTipoDeAviso(tipoDeAviso: string): void {
        this.update((state) => ({
            ...state,
            tipoDeAviso,
        }));
    }

    /**
     * @method setNombre
     * @description 
     * Actualiza el nombre en el estado.
     * @param {string} nombre - Nombre del solicitante.
     */
    public setNombre(nombre: string): void {
        this.update((state) => ({
            ...state,
            nombre,
        }));
    }

    /**
     * @method setRfc
     * @description 
     * Actualiza el RFC en el estado.
     * @param {string} rfc - RFC del solicitante.
     */
    public setRfc(rfc: string): void {
        this.update((state) => ({
            ...state,
            rfc,
        }));
    }

    /**
     * @method setEntidadFederativa
     * @description 
     * Actualiza la entidad federativa en el estado.
     * @param {string} entidadFederativa - Entidad federativa.
     */
    public setEntidadFederativa(entidadFederativa: string): void {
        this.update((state) => ({
            ...state,
            entidadFederativa,
        }));
    }

    /**
     * @method setAlcaldiaMunicipo
     * @description 
     * Actualiza la alcaldía o municipio en el estado.
     * @param {string} alcaldiaMunicipo - Alcaldía o municipio.
     */
    public setAlcaldiaMunicipo(alcaldiaMunicipo: string): void {
        this.update((state) => ({
            ...state,
            alcaldiaMunicipo,
        }));
    }

    /**
     * @method setColonia
     * @description 
     * Actualiza la colonia en el estado.
     * @param {string} colonia - Colonia.
     */
    public setColonia(colonia: string): void {
        this.update((state) => ({
            ...state,
            colonia,
        }));
    }

    /**
     * @method setCalle
     * @description 
     * Actualiza la calle en el estado.
     * @param {string} calle - Calle.
     */
    public setCalle(calle: string): void {
        this.update((state) => ({
            ...state,
            calle,
        }));
    }

    /**
     * @method setNumeroExterior
     * @description 
     * Actualiza el número exterior en el estado.
     * @param {string} numeroExterior - Número exterior.
     */
    public setNumeroExterior(numeroExterior: string): void {
        this.update((state) => ({
            ...state,
            numeroExterior,
        }));
    }

    /**
     * @method setNumeroInterior
     * @description 
     * Actualiza el número interior en el estado.
     * @param {string} numeroInterior - Número interior.
     */
    public setNumeroInterior(numeroInterior: string): void {
        this.update((state) => ({
            ...state,
            numeroInterior,
        }));
    }

    /**
     * @method setCodigoPostal
     * @description 
     * Actualiza el código postal en el estado.
     * @param {string} codigoPostal - Código postal.
     */
    public setCodigoPostal(codigoPostal: string): void {
        this.update((state) => ({
            ...state,
            codigoPostal,
        }));
    }

    /**
     * @method setCartaCupo
     * @description 
     * Establece el valor de la propiedad `cartaCupo` en el estado de la tienda.
     * @param cartaCupo {string} - El nuevo valor de la carta cupo que se asignará al estado.
     * @example
     * // Ejemplo de uso:
     * store.setCartaCupo('nuevoValorCartaCupo');
     */
    public setCartaCupo(cartaCupo: string): void {
        this.update((state) => ({
            ...state,
            cartaCupo,
        }));
    }

    /**
     * @method setNumeraDeAcuse
     * @description 
     * Establece el valor de la propiedad `numeraDeAcuse` en el estado de la tienda.
     * @param numeraDeAcuse {string} - El nuevo valor del número de acuse que se asignará al estado.
     * @example
     * // Ejemplo de uso:
     * store.setNumeraDeAcuse('nuevoValorNumeraDeAcuse');
     */
    public setNumeraDeAcuse(numeraDeAcuse: string): void {
        this.update((state) => ({
            ...state,
            numeraDeAcuse,
        }));
    }

    /**
     * @method setDestruccionMercancia
     * @description 
     * Establece el valor de la propiedad `destruccionMercancia` en el estado de la tienda.
     * @param destruccionMercancia {string} - El nuevo valor de la destrucción de mercancía que se asignará al estado.
     * @example
     * // Ejemplo de uso:
     * store.setDestruccionMercancia('nuevoValorDestruccionMercancia');
     */
    public setDestruccionMercancia(destruccionMercancia: string): void {
        this.update((state) => ({
            ...state,
            destruccionMercancia,
        }));
    }

    /**
     * @method setMerccanciaEntidadFederativa
     * @description 
     * Establece el valor de la propiedad `merccanciaEntidadFederativa` en el estado de la tienda.
     * @param merccanciaEntidadFederativa {string} - El nuevo valor de la entidad federativa de la mercancía que se asignará al estado.
     * @example
     * // Ejemplo de uso:
     * store.setMerccanciaEntidadFederativa('nuevoValorEntidadFederativa');
     */
    public setMerccanciaEntidadFederativa(merccanciaEntidadFederativa: string): void {
        this.update((state) => ({
            ...state,
            merccanciaEntidadFederativa,
        }));
    }

    /**
     * @method setMerccanciaAlcaldiaMunicipo
     * @description 
     * Establece el valor de la propiedad `merccanciaAlcaldiaMunicipo` en el estado de la tienda.
     * @param merccanciaAlcaldiaMunicipo {string} - El nuevo valor de la alcaldía o municipio de la mercancía que se asignará al estado.
     * @example
     * // Ejemplo de uso:
     * store.setMerccanciaAlcaldiaMunicipo('nuevoValorAlcaldiaMunicipo');
     */
    public setMerccanciaAlcaldiaMunicipo(merccanciaAlcaldiaMunicipo: string): void {
        this.update((state) => ({
            ...state,
            merccanciaAlcaldiaMunicipo,
        }));
    }
    
    /**
     * @method setMerccanciaColonia
     * @description 
     * Establece el valor de la propiedad `merccanciaColonia` en el estado de la tienda.
     * @param merccanciaColonia {string} - El nuevo valor de la colonia de la mercancía que se asignará al estado.
     * @example
     * // Ejemplo de uso:
     * store.setMerccanciaColonia('nuevoValorColonia');
     */
    public setMerccanciaColonia(merccanciaColonia: string): void {
        this.update((state) => ({
            ...state,
            merccanciaColonia,
        }));
    }

    /**
     * @method setMerccanciaCalle
     * @description 
     * Establece el valor de la propiedad `merccanciaCalle` en el estado de la tienda.
     * @param merccanciaCalle {string} - El nuevo valor de la calle de la mercancía que se asignará al estado.
     * @example
     * // Ejemplo de uso:
     * store.setMerccanciaCalle('nuevoValorCalle');
     */
    public setMerccanciaCalle(merccanciaCalle: string): void {
        this.update((state) => ({
            ...state,
            merccanciaCalle,
        }));
    }

    /**
     * @method setMerccanciaNumeroExterior
     * @description 
     * Establece el valor de la propiedad `merccanciaNumeroExterior` en el estado de la tienda.
     * @param merccanciaNumeroExterior {string} - El nuevo valor del número exterior de la mercancía que se asignará al estado.
     * @example
     * // Ejemplo de uso:
     * store.setMerccanciaNumeroExterior('nuevoValorNumeroExterior');
     */
    public setMerccanciaNumeroExterior(merccanciaNumeroExterior: string): void {
        this.update((state) => ({
            ...state,
            merccanciaNumeroExterior,
        }));
    }

    /**
     * @method setMerccanciaNumeroInterior
     * @description 
     * Establece el valor de la propiedad `merccanciaNumeroInterior` en el estado de la tienda.
     * @param merccanciaNumeroInterior {string} - El nuevo valor del número interior de la mercancía que se asignará al estado.
     * @example
     * // Ejemplo de uso:
     * store.setMerccanciaNumeroInterior('nuevoValorNumeroInterior');
     */
    public setMerccanciaNumeroInterior(merccanciaNumeroInterior: string): void {
        this.update((state) => ({
            ...state,
            merccanciaNumeroInterior,
        }));
    }

    /**
     * @method setMerccanciaCodigoPostal
     * @description 
     * Establece el valor de la propiedad `merccanciaCodigoPostal` en el estado de la tienda.
     * @param merccanciaCodigoPostal {string} - El nuevo valor del código postal de la mercancía que se asignará al estado.
     * @example
     * // Ejemplo de uso:
     * store.setMerccanciaCodigoPostal('nuevoValorCodigoPostal');
     */
    public setMerccanciaCodigoPostal(merccanciaCodigoPostal: string): void {
        this.update((state) => ({
            ...state,
            merccanciaCodigoPostal,
        }));
    }

    /**
     * @method setDestruir
     * @description 
     * Actualiza el estado con el valor proporcionado para la propiedad `destruir`.
     * @param destruir {string} - El nuevo valor para la propiedad `destruir`.
     * @example
     * // Ejemplo de uso:
     * store.setDestruir('nuevoValor');
     */
    public setDestruir(destruir: string): void {
        this.update((state) => ({
            ...state,
            destruir,
        }));
    }

    /**
     * @method setTarifa
     * @description 
     * Establece el valor de la propiedad `tarifa` en el estado de la tienda.
     * @param tarifa {string} - El nuevo valor de la tarifa que se asignará al estado.
     * @example
     * // Ejemplo de uso:
     * store.setTarifa('nuevoValorTarifa');
     */
    public setTarifa(tarifa: string): void {
        this.update((state) => ({
            ...state,
            tarifa,
        }));
    }

    /**
     * @method setDestruccionEntidadFederativa
     * @description 
     * Establece el valor de la propiedad `destruccionEntidadFederativa` en el estado de la tienda.
     * @param destruccionEntidadFederativa {string} - El nuevo valor de la entidad federativa de destrucción que se asignará al estado.
     * @example
     * // Ejemplo de uso:
     * store.setDestruccionEntidadFederativa('nuevoValorEntidadFederativa');
     */
    public setDestruccionEntidadFederativa(destruccionEntidadFederativa: string): void {
        this.update((state) => ({
            ...state,
            destruccionEntidadFederativa,
        }));
    }

    /**
     * @method setDestruccionAlcaldiaMunicipo
     * @description Establece el valor de la propiedad `destruccionAlcaldiaMunicipo` en el estado de la tienda.
     * @param destruccionAlcaldiaMunicipo {string} - El nuevo valor de la alcaldía o municipio de destrucción que se asignará al estado.
     * @example
     * // Ejemplo de uso:
     * store.setDestruccionAlcaldiaMunicipo('nuevoValorAlcaldiaMunicipo');
     */
    public setDestruccionAlcaldiaMunicipo(destruccionAlcaldiaMunicipo: string): void {
        this.update((state) => ({
            ...state,
            destruccionAlcaldiaMunicipo,
        }));
    }

    /**
     * @method setDestruccionColonia
     * @description Establece el valor de la propiedad `destruccionColonia` en el estado de la tienda.
     * @param destruccionColonia {string} - El nuevo valor de la colonia de destrucción que se asignará al estado.
     * @example
     * // Ejemplo de uso:
     * store.setDestruccionColonia('nuevoValorColonia');
     */
    public setDestruccionColonia(destruccionColonia: string): void {
        this.update((state) => ({
            ...state,
            destruccionColonia,
        }));
    }

    /**
     * @method setDestruccionCalle
     * @description Actualiza el estado con el valor proporcionado para la propiedad `destruccionCalle`.
     * @param {string} destruccionCalle - El nuevo valor para la propiedad `destruccionCalle`.
     * @memberof Tramite32509Store
     */
    public setDestruccionCalle(destruccionCalle: string): void {
        this.update((state) => ({
            ...state,
            destruccionCalle,
        }));
    }

    /**
     * @method setDestruccionNumeroExterior
     * @description Establece el valor de la propiedad `destruccionNumeroExterior` en el estado de la tienda.
     * @param destruccionNumeroExterior {string} - El nuevo valor del número exterior de destrucción que se asignará al estado.
     * @example
     * // Ejemplo de uso:
     * store.setDestruccionNumeroExterior('nuevoValorNumeroExterior');
     */
    public setDestruccionNumeroExterior(destruccionNumeroExterior: string): void {
        this.update((state) => ({
            ...state,
            destruccionNumeroExterior,
        }));
    }

    /**
     * @method setDestruccionNumeroInterior
     * @description Establece el valor de la propiedad `destruccionNumeroInterior` en el estado de la tienda.
     * @param destruccionNumeroInterior {string} - El nuevo valor del número interior de destrucción que se asignará al estado.
     * @example
     * // Ejemplo de uso:
     * store.setDestruccionNumeroInterior('nuevoValorNumeroInterior');
     */
    public setDestruccionNumeroInterior(destruccionNumeroInterior: string): void {
        this.update((state) => ({
            ...state,
            destruccionNumeroInterior,
        }));
    }

    /**
     * @method setDestruccionCodigoPostal
     * @description Establece el valor de la propiedad `destruccionCodigoPostal` en el estado de la tienda.
     * @param destruccionCodigoPostal {string} - El nuevo valor del código postal de destrucción que se asignará al estado.
     * @example
     * // Ejemplo de uso:
     * store.setDestruccionCodigoPostal('nuevoValorCodigoPostal');
     */
    public setDestruccionCodigoPostal(destruccionCodigoPostal: string): void {
        this.update((state) => ({
            ...state,
            destruccionCodigoPostal,
        }));
    }

    /**
     * @method setDestruccionHora
     * @description Establece el valor de la propiedad `destruccionHora` en el estado de la tienda.
     * @param destruccionHora {string} - El nuevo valor de la hora de destrucción que se asignará al estado.
     * @example
     * // Ejemplo de uso:
     * store.setDestruccionHora('nuevoValorHora');
     */
    public setDestruccionHora(destruccionHora: string): void {
        this.update((state) => ({
            ...state,
            destruccionHora,
        }));
    }

    /**
     * @method setDesturccionProceso
     * @description Establece el valor de la propiedad `desturccionProceso` en el estado de la tienda.
     * @param desturccionProceso {string} - El nuevo valor del proceso de destrucción que se asignará al estado.
     * @example
     * // Ejemplo de uso:
     * store.setDesturccionProceso('nuevoValorProceso');
     */
    public setDesturccionProceso(desturccionProceso: string): void {
        this.update((state) => ({
            ...state,
            desturccionProceso,
        }));
    }

    /**
     * @method setCasofortuito
     * @description Establece el valor de la propiedad `casofortuito` en el estado de la tienda.
     * @param casofortuito {string} - El nuevo valor del caso fortuito que se asignará al estado.
     * @example
     * // Ejemplo de uso:
     * store.setCasofortuito('nuevoValorCasoFortuito');
     */
    public setCasofortuito(casofortuito: string): void {
        this.update((state) => ({
            ...state,
            casofortuito,
        }));
    }

    /**
     * @method setDonoMercancia
     * @description Establece el valor de la propiedad `donoMercancia` en el estado de la tienda.
     * @param donoMercancia {string} - El nuevo valor de la donación de mercancía que se asignará al estado.
     * @example
     * // Ejemplo de uso:
     * store.setDonoMercancia('nuevoValorDonoMercancia');
     */
    public setDonoMercancia(donoMercancia: string): void {
        this.update((state) => ({
            ...state,
            donoMercancia,
        }));
    }

    /**
     * @method setCondicionesMateriales
     * @description Establece el valor de la propiedad `condicionesMateriales` en el estado de la tienda.
     * @param condicionesMateriales {string} - El nuevo valor de las condiciones materiales que se asignará al estado.
     * @example
     * // Ejemplo de uso:
     * store.setCondicionesMateriales('nuevoValorCondicionesMateriales');
     */
    public setCondicionesMateriales(condicionesMateriales: string): void {
        this.update((state) => ({
            ...state,
            condicionesMateriales,
        }));
    }

    /**
     * @method setCaboDestruccionFecha
     * @description Establece el valor de la propiedad `caboDestruccionFecha` en el estado de la tienda.
     * @param caboDestruccionFecha {string} - El nuevo valor de la fecha en que se llevó a cabo la destrucción que se asignará al estado.
     * @example
     * // Ejemplo de uso:
     * store.setCaboDestruccionFecha('nuevoValorFecha');
     */
    public setCaboDestruccionFecha(caboDestruccionFecha: string): void {
        this.update((state) => ({
            ...state,
            caboDestruccionFecha,
        }));
    }
    
}