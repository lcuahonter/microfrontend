/**
 * @module TramiteStore
 * @description
 * Este servicio administra el estado de `TramiteState` utilizando Akita.
 */
import { Store, StoreConfig } from '@datorama/akita';

import { Injectable } from '@angular/core';

/**
 * @interface TramiteState
 * @description
 * Representa el estado de la modalidad de cambio.
 */
export interface TramiteState {
    fechaInspeccionInput: string;
    fechaPagoDeDerechos: string;
    fechaDePago: string;
    aduanaDeIngreso: number;
    tipoContenedor: number;
    identificacionTransporte: string;
    justificacion: string;
    esSolicitudFerros: string;
    oficinaDeInspeccion: number,
    puntoDeInspeccion: number,
    regimenAlQueDestina: number,
    datosParaMovilizacion: number,
    puntoDeVerificacion: number,
    banco: number,
    fechaPagoDeDerechosRevision: string;
    llaveDePago: string;
    claveDeReferencia: string;
    importeDePago: string;
    cadenaDependencia: string;
    fechaDeInspeccion: string;
    certificadosAutorizados: string,
    horaDeInspeccion: string;
    nombreInspector: string,
    primerApellido: string,
    segundoApellido: string,
    cantidadContenedores: string,
    medioDeTransporte: string;
    numeroDeGuia: string;
    identificacionDelTransporte: string; 
    nombreDeLaEmpresaTransportista: string;
    folioDelTramite: string;
    cadenaDependenciaRevision: string;
    claveDeReferenciaRevision: string;
    bancoRevision: string;
    llaveDePagoRevision: string;
    importeDePagoRevision: string;
}

/**
 * @function createInitialState
 * @description
 * Inicializa el estado con valores predeterminados.
 * @returns {TramiteState} Estado inicial.
 */
export function createInitialState(): TramiteState {
    return {
        fechaInspeccionInput: '',
        fechaPagoDeDerechos: '',
        fechaDePago: '',
        aduanaDeIngreso: 1,
        tipoContenedor: 1,
        identificacionTransporte: '',
        justificacion: '',
        esSolicitudFerros: '',
        oficinaDeInspeccion: 1,
        puntoDeInspeccion: 1,
        regimenAlQueDestina: 1,
        datosParaMovilizacion: 1,
        puntoDeVerificacion: 1,
        banco: 0,
        fechaPagoDeDerechosRevision: '',
        llaveDePago: '',
        claveDeReferencia: '',
        importeDePago: '',
        cadenaDependencia: '',
        fechaDeInspeccion: '',
        certificadosAutorizados: '',
        horaDeInspeccion: '1',
        nombreInspector: '',
        primerApellido: '',
        segundoApellido: '',
        cantidadContenedores: '',
        medioDeTransporte: "1",
        numeroDeGuia: '',
        identificacionDelTransporte:'',
        nombreDeLaEmpresaTransportista: '',
        folioDelTramite: '',
        claveDeReferenciaRevision: '',
        cadenaDependenciaRevision: '',
        bancoRevision: '',
        llaveDePagoRevision: '',
        importeDePagoRevision: '',
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
     * Actualiza la fecha de inicio en el estado del trámite.
     * @param {string} fechaInspeccionInput - La fecha de inicio en formato de texto.
     * @returns {void}
     */
    public setFechaInicio(fechaInspeccionInput: string): void {
        this.update((state) => ({
            ...state,
            fechaInspeccionInput,
        }));
    }

    /**
     * @method setFechaDeInspeccion
     * @description
     * Actualiza el estado de `fechaDeInspeccion` con un nuevo valor.
     * @param {string} fechaDeInspeccion - Fecha de inspección.
     */
    public setFechaDeInspeccion(fechaDeInspeccion: string): void {
        this.update((state) => ({
            ...state,
            fechaDeInspeccion,
        }));
    }

    /**
     * @method setCertificadosAutorizados
     * @description
     * Actualiza el estado de `certificadosAutorizados` con un nuevo valor.
     * @param {string} certificadosAutorizados - Certificados autorizados.
     */
    public setCertificadosAutorizados(certificadosAutorizados: string): void {
        this.update((state) => ({
            ...state,
            certificadosAutorizados,
        }));
    }

    /**
     * @method setHoraDeInspeccion
     * @description
     * Actualiza el estado de `horaDeInspeccion` con un nuevo valor.
     * @param {string} horaDeInspeccion - Hora de inspección.
     */
    public setHoraDeInspeccion(horaDeInspeccion: string): void {
        this.update((state) => ({
            ...state,
            horaDeInspeccion,
        }));
    }

    /**
     * @method setNombreInspector
     * @description
     * Actualiza el estado de `nombreInspector` con un nuevo valor.
     * @param {string} nombreInspector - Nombre del inspector.
     */
    public setNombreInspector(nombreInspector: string): void {
        this.update((state) => ({
            ...state,
            nombreInspector,
        }));
    }


    /**
     * @method setPrimerApellido
     * @description
     * Actualiza el estado de `primerApellido` con un nuevo valor.
     * @param {string} primerApellido - Primer apellido.
     */
    public setPrimerApellido(primerApellido: string): void {
        this.update((state) => ({
            ...state,
            primerApellido,
        }));
    }


    /**
     * @method setSegundoApellido
     * @description
     * Actualiza el estado de `segundoApellido` con un nuevo valor.
     * @param {string} segundoApellido - Segundo apellido.
     */
    public setSegundoApellido(segundoApellido: string): void {
        this.update((state) => ({
            ...state,
            segundoApellido,
        }));
    }

    /**
     * @method setCantidadContenedores
     * @description
     * Actualiza el estado de `cantidadContenedores` con un nuevo valor.
     * @param {string} cantidadContenedores - Cantidad de contenedores.
     */
    public setCantidadContenedores(cantidadContenedores: string): void {
        this.update((state) => ({
            ...state,
            cantidadContenedores,
        }));
    }

    /**
     * @method setMedioDeTransporte
     * @description
     * Actualiza el estado de `medioDeTransporte` con un nuevo valor.
     * @param {string} medioDeTransporte - Medio de transporte.
     */
    public setMedioDeTransporte(medioDeTransporte: string): void {
        this.update((state) => ({
            ...state,
            medioDeTransporte,
        }));
    }

    /**
     * @method setNumeroDeGuia
     * @description
     * Actualiza el estado de `numeroDeGuia` con un nuevo valor.
     * @param {string} numeroDeGuia - Número de guía.
     */
    public setNumeroDeGuia(numeroDeGuia: string): void {
        this.update((state) => ({
            ...state,
            numeroDeGuia,
        }));
    }

    /**
     * @method setIdentificacionDelTransporte
     * @description
     * Actualiza el estado de `identificacionDelTransporte` con un nuevo valor.
     * @param {string} identificacionDelTransporte - Identificación del transporte.
     */
    public setIdentificacionDelTransporte(identificacionDelTransporte: string): void {
        this.update((state) => ({
            ...state,
            identificacionDelTransporte,
        }));
    }

    /**
     * @method setNombreDeLaEmpresaTransportista
     * @description
     * Actualiza el estado de `nombreDeLaEmpresaTransportista` con un nuevo valor.
     * @param {string} nombreDeLaEmpresaTransportista - Nombre de la empresa transportista.
     */
    public setNombreDeLaEmpresaTransportista(nombreDeLaEmpresaTransportista: string): void {
        this.update((state) => ({
            ...state,
            nombreDeLaEmpresaTransportista,
        }));
    }

    /**
     * @method setFolioDelTramite
     * @description
     * Actualiza el estado de `folioDelTramite` con un nuevo valor.
     * @param {string} folioDelTramite - Folio del trámite.
     */
    public setFolioDelTramite(folioDelTramite: string): void {
        this.update((state) => ({
            ...state,
            folioDelTramite,
        }));
    }

    /**
     * @method setClaveDeReferenciaRevision
     * @description
     * Actualiza el estado de `claveDeReferenciaRevision` con un nuevo valor.
     * @param {string} claveDeReferenciaRevision - Clave de referencia de revisión.
     */
    public setClaveDeReferenciaRevision(claveDeReferenciaRevision: string): void {
        this.update((state) => ({
            ...state,
            claveDeReferenciaRevision,
        }));
    }

    /**
     * @method setCadenaDependenciaRevision
     * @description
     * Actualiza el estado de `cadenaDependenciaRevision` con un nuevo valor.
     * @param {string} cadenaDependenciaRevision - Cadena de dependencia de revisión.
     */
    public setCadenaDependenciaRevision(cadenaDependenciaRevision: string): void {
        this.update((state) => ({
            ...state,
            cadenaDependenciaRevision,
        }));
    }

    /**
     * @method setBancoRevision
     * @description
     * Actualiza el estado de `bancoRevision` con un nuevo valor.
     * @param {string} bancoRevision - Banco de revisión.
     */
    public setBancoRevision(bancoRevision: string): void {
        this.update((state) => ({
            ...state,
            bancoRevision,
        }));
    }

    /**
     * @method setLlaveDePagoRevision
     * @description
     * Actualiza el estado de `llaveDePagoRevision` con un nuevo valor.
     * @param {string} llaveDePagoRevision - Llave de pago de revisión.
     */
    public setLlaveDePagoRevision(llaveDePagoRevision: string): void {
        this.update((state) => ({
            ...state,
            llaveDePagoRevision,
        }));
    }

    /**
     * @method setImporteDePagoRevision
     * @description
     * Actualiza el estado de `importeDePagoRevision` con un nuevo valor.
     * @param {string} importeDePagoRevision - Importe de pago de revisión.
     */
    public setImporteDePagoRevision(importeDePagoRevision: string): void {
        this.update((state) => ({
            ...state,
            importeDePagoRevision,
        }));
    }

    /**
     * Actualiza la aduana de ingreso en el estado del trámite.
     * @param {number} aduanaDeIngreso - El ID de la aduana de ingreso.
     * @returns {void}
     */
    public setAduanaDeIngreso(aduanaDeIngreso: number): void {
        this.update((state) => ({
            ...state,
            aduanaDeIngreso,
        }));
    }

    /**
     * Actualiza el tipo de contenedor en el estado del trámite.
     * @param {number} tipoContenedor - El ID del tipo de contenedor.
     * @returns {void}
     */
    public setTipoContenedor(tipoContenedor: number): void {
        this.update((state) => ({
            ...state,
            tipoContenedor,
        }));
    }

    /**
     * Actualiza la identificación del transporte en el estado del trámite.
     * @param {string} identificacionTransporte - La identificación del transporte.
     * @returns {void}
     */
    public setIdentificacionTransporte(identificacionTransporte: string): void {
        this.update((state) => ({
            ...state,
            identificacionTransporte,
        }));
    }

    /**
     * Actualiza la justificación en el estado del trámite.
     * @param {string} justificacion - La justificación proporcionada.
     * @returns {void}
     */
    public setJustificacion(justificacion: string): void {
        this.update((state) => ({
            ...state,
            justificacion,
        }));
    }

    /**
     * Actualiza si es una solicitud Ferros en el estado del trámite.
     * @param {string} esSolicitudFerros - Indica si es una solicitud Ferros.
     * @returns {void}
     */
    public setEsSolicitudFerros(esSolicitudFerros: string): void {
        this.update((state) => ({
            ...state,
            esSolicitudFerros,
        }));
    }

    /**
     * Actualiza la oficina de inspección en el estado del trámite.
     * @param {number} oficinaDeInspeccion - El ID de la oficina de inspección.
     * @returns {void}
     */
    public setOficinaDeInspeccion(oficinaDeInspeccion: number): void {
        this.update((state) => ({
            ...state,
            oficinaDeInspeccion,
        }));
    }

    /**
     * Actualiza el punto de inspección en el estado del trámite.
     * @param {number} puntoDeInspeccion - El ID del punto de inspección.
     * @returns {void}
     */
    public setPuntoDeInspeccion(puntoDeInspeccion: number): void {
        this.update((state) => ({
            ...state,
            puntoDeInspeccion,
        }));
    }

    /**
     * Actualiza el régimen al que se destina en el estado del trámite.
     * @param {number} regimenAlQueDestina - El ID del régimen al que se destina.
     * @returns {void}
     */
    public setRegimenAlQueDestina(regimenAlQueDestina: number): void {
        this.update((state) => ({
            ...state,
            regimenAlQueDestina,
        }));
    }

    /**
     * Actualiza los datos para la movilización en el estado del trámite.
     * @param {number} datosParaMovilizacion - El ID de los datos para la movilización.
     * @returns {void}
     */
    public setDatosParaMovilizacion(datosParaMovilizacion: number): void {
        this.update((state) => ({
            ...state,
            datosParaMovilizacion,
        }));
    }

    /**
     * Actualiza el punto de verificación en el estado del trámite.
     * @param {number} puntoDeVerificacion - El ID del punto de verificación.
     * @returns {void}
     */
    public setPuntoDeVerificacion(puntoDeVerificacion: number): void {
        this.update((state) => ({
            ...state,
            puntoDeVerificacion,
        }));
    }

    /**
     * Actualiza el banco en el estado del trámite.
     * @param {number} banco - El ID del banco.
     * @returns {void}
     */
    public setBanco(banco: number): void {
        this.update((state) => ({
            ...state,
            banco,
        }));
    }

    /**
     * Establece la fecha de pago de derechos en el estado.
     * @param {string} fechaPagoDeDerechos - La nueva fecha de pago de derechos.
     * @returns {void} No retorna ningún valor.
     */
    public setFechaPagoDeDerechos(fechaPagoDeDerechos: string): void {
        this.update((state) => ({
            ...state,
            fechaPagoDeDerechos,
        }));
    }

    /**
     * Establece la fecha de pago de derechos de revisión en el estado.
     * @param {string} fechaPagoDeDerechosRevision - La nueva fecha de pago de derechos de revisión.
     * @returns {void} No retorna ningún valor.
     */
    public setFechaPagoDeDerechosRevision(fechaPagoDeDerechosRevision: string): void {
        this.update((state) => ({
            ...state,
            fechaPagoDeDerechosRevision,
        }));
    }

    /**
     * Establece la llave de pago en el estado.
     * @param {string} llaveDePago - La nueva llave de pago.
     * @returns {void} No retorna ningún valor.
     */
    public setLlaveDePago(llaveDePago: string): void {
        this.update((state) => ({
            ...state,
            llaveDePago,
        }));
    }

    /**
     * Establece la clave de referencia en el estado.
     * @param {string} claveDeReferencia - La nueva clave de referencia.
     * @returns {void} No retorna ningún valor.
     */
    public setClaveDeReferencia(claveDeReferencia: string): void {
        this.update((state) => ({
            ...state,
            claveDeReferencia,
        }));
    }

    /**
     * Establece el importe de pago en el estado.
     * @param {string} importeDePago - El nuevo importe de pago.
     * @returns {void} No retorna ningún valor.
     */
    public setImporteDePago(importeDePago: string): void {
        this.update((state) => ({
            ...state,
            importeDePago,
        }));
    }

    /**
     * Establece la cadena de dependencia en el estado.
     * @param {string} cadenaDependencia - La nueva cadena de dependencia.
     * @returns {void} No retorna ningún valor.
     */
    public setCadenaDependencia(cadenaDependencia: string): void {
        this.update((state) => ({
            ...state,
            cadenaDependencia,
        }));
    }

    /**
     * Establece la fecha de pago en el estado.
     * @param {string} fechaDePago - La nueva fecha de pago.
     * @returns {void} No retorna ningún valor.
     */
    public setFechaDePago(fechaDePago: string): void {
        this.update((state) => ({
            ...state,
            fechaDePago,
        }));
    }

}