/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable sort-imports */
/**
 * @module TramiteStore
 * @description
 * Este servicio administra el estado de `TramiteState` utilizando Akita.
 */
import { Store, StoreConfig } from '@datorama/akita';
import { DatosDeLaSolicitudInt, FormularioPagoInt, PagosDeDerechosFormInt } from '../modelos/datos-de-interfaz.model';
import { InternaDatosGeneralesInt } from '../modelos/datos-de-interfaz.model'
import { Injectable } from '@angular/core';

/**
 * @interface TramiteState
 * @description
 * Representa el estado de la modalidad de cambio.
 */
export interface TramiteState {
    SolicitudState: DatosDeLaSolicitudInt;
    InternaDatosGeneralesState: InternaDatosGeneralesInt;
    FormularioPagoState: FormularioPagoInt;
    PagosDeDerechosState: PagosDeDerechosFormInt;
}

/**
 * @function createInitialState
 * @description
 * Inicializa el estado con valores predeterminados.
 * @returns {TramiteState} Estado inicial.
 */
export function createInitialState(): TramiteState {
    return {
        SolicitudState: {
            justificacion: '',
            certificadosAutorizados: '',
            fechaInicio: '',
            horaDeInspeccion: '',
            aduanaDeIngreso: '',
            sanidadAgropecuaria: '',
            puntoDeInspeccion: '',
            nombreInspector: '',
            primerApellido: '',
            segundoApellido: '',
            cantidadContenedores: '',
            tipoContenedor: '',
            medioDeTransporte: '',
            identificacionTransporte: '',
            esSolicitudFerros: '0',
        },
        InternaDatosGeneralesState: {
            folioControlUnico: 0,
            aduanaIngreso: '',
            oficinaInspeccion: '',
            puntoInspeccion: '',
            claveControlUnico: '',
            establecimientoTIFs: '',
            nombreVeterinario: '',
            numeroGuia: '',
            regimen: '',
            capturaMercancia: '',
            animalesVivos: '',
            coordenadas: '',
            movilizacionNacional: '',
            identTransporte: '',
            puntoVerificacion: '',
            empresaTransportista: '',
            tipoMercancia: 'subproductos', 
        },
        FormularioPagoState: {
            exentoPago: '',
            justificacion: '',
            claveReferencia: '',
            cadenaDependencia: '',
            banco: '',
            llavePago: '',
            fechaFactura: '',
            importePago: '',
        },
        PagosDeDerechosState: {
            claveDeReferencia: '',
            cadenaDependencia: '',
            banco: '',
            exentoPago: '',
            llaveDePago: '',
            fechaInicio: '',
            importeDePago: '',
            claveDeReferenciaRevision: '',
            bancoRevision: '',
            llaveDePagoRevision: '',
            fechaInicioRevision: '',
            importeDePagoRevision: '',
            exentoPagoRevision: '',
        }
    };
}

/**
 * @class TramiteStore
 * @description
 * Administra el estado de la modalidad de cambio utilizando Akita.
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'cambio-modalidad' })
export class TramiteStore extends Store<TramiteState> {
    constructor() {
        super(createInitialState());
    }

    /**
     * @method setSolicitudTramite
     * @description
     * Actualiza el estado de `SolicitudState` con nuevos valores.
     * @param {DatosDeLaSolicitudInt} SolicitudState - Datos del formulario de cambio de modalidad.
     */
    public setSolicitudTramite(SolicitudState: DatosDeLaSolicitudInt): void {
        this.update((state) => ({
            ...state,
            SolicitudState,
        }));
    }

    /**
 * @method setSolicitudTramite
 * @description
 * Actualiza el estado de `InternaDatosGeneralesInt` con nuevos valores.
 * @param {InternaDatosGeneralesInt} InternaDatosGeneralesState - Datos del formulario de cambio de modalidad.
 */
    public setInternaDatosGeneralesTramite(InternaDatosGeneralesState: InternaDatosGeneralesInt): void {
        this.update((state) => ({
            ...state,
            InternaDatosGeneralesState,
        }));
    }

    /**
    * @method setInternaPagoDeDerechosTramite
    * @description
    * Actualiza el estado de `FormularioPagoInt` con nuevos valores.
    * @param {FormularioPagoInt} FormularioPagoState - Datos del formulario de cambio de modalidad.
    */
    public setInternaPagoDeDerechosTramite(FormularioPagoState: FormularioPagoInt): void {
        this.update((state) => ({
            ...state,
            FormularioPagoState,
        }));
    }

    /**
     * @method setPagoDeDerechosTramite
     * @description
     * Actualiza el estado de `PagosDeDerechosFormInt` con nuevos valores.
     * @param {PagosDeDerechosFormInt} PagosDeDerechosState - Datos del formulario de cambio de modalidad.
     */
    public setPagoDeDerechosTramite(PagosDeDerechosState: PagosDeDerechosFormInt): void {
        this.update((state) => ({
            ...state,
            PagosDeDerechosState,
        }));
    }
}