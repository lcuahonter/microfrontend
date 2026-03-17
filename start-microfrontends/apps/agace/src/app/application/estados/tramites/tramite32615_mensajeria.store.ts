import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';


/**
 * Interfaz que representa el estado de Solicitud32615.
 */
export interface Solicitud32615MensajeriaState {
    /**
     * El valor de comercioExterior.
     */
    comercioExterior: string;
    /**
     * El valor de recintoFiscalizado.
     */
    recintoFiscalizado: string;
    /**
     * El valor de cancelacionRecintoFiscalizado.
     */
    cancelacionRecintoFiscalizado: string;
    /**
     * El valor de perfilRecintoFiscalizado.
     */
    perfilRecintoFiscalizado: string;
    /**
     * El valor de numeroDeOficio.
     */
    numeroDeOficio: string;
    /**
     * El valor de fechaDePresentacion.
     */
    fechaDePresentacion: string;
    /**
     * El valor de mensajeriaPaqueteria.
     */
    mensajeriaPaqueteria: string;
    /**
     * El valor de laSolicitanteInterna.
     */
    laSolicitanteInterna: string;
    /**
     * El valor de subsidiaria.
     */
    subsidiaria: string;
    /**
     * El valor de filiales.
     */
    filiales: string;
    /**
     * El valor de matrices.
     */
    matrices: string;
    /**
     * El valor de aeronauticaCivil.
     */
    aeronauticaCivil: string;
    /**
     * El valor de conformidadArticulos.
     */
    conformidadArticulos: string;
    /**
     * El valor de rfc.
     */
    rfc: string;
    /**
     * El valor de documentosMercancias.
     */
    documentosMercancias: string;
    /**
     * El valor de rfcLasEmpresas.
     */
    rfcLasEmpresas: string;
    /**
     * El valor de generalAeronauticaCivil.
     */
    generalAeronauticaCivil: string;
    /**
     * El valor de exteriorConformidad.
     */
    exteriorConformidad: string;
    /**
     * El valor de reconocimientoMutuo.
     */
    reconocimientoMutuo: string;
    /**
     * El valor de rfcListado.
     */
    rfcListado: string;
    /**
     * El valor de nombreRazonSocialListado.
     */
    nombreRazonSocialListado: string;
    /**
     * El valor de direccionFiscalListado.
     */
    direccionFiscalListado: string;
    /**
     * El valor de paginaElectronicaListado.
     */
    paginaElectronicaListado: string;
    /**
     * El valor de correoElectronicaListado.
     */
    correoElectronicaListado: string;
    /**
     * El valor de telefonoContactoListado.
     */
    telefonoContactoListado: string;
    /**
     * El valor de informacionProporcionada.
     */
    informacionProporcionada: string;
    /**
     * El valor de claveReferencia.
     */
    claveReferencia: string;
    /**
     * El valor de numeroOperacion.
     */
    numeroOperacion: string;
    /**
     * El valor de cadenaDependencia.
     */
    cadenaDependencia: string;
    /**
     * El valor de banco.
     */
    banco: string;
    /**
     * El valor de llavePago.
     */
    llavePago: string;
    /**
     * El valor de fechaFactura.
     */
    fechaFactura: string;
    /**
     * El valor de importePago.
     */
    importePago: string;
    /**
     * El valor de fechaInicioComercioExterior.
     */
    fechaInicioComercioExterior: string;
    /**
     * El valor de fechaVigencia.
     */
    fechaVigencia: string;
    /**
     * El valor de numeroAutorizacion.
     */
    numeroAutorizacion: string;

}
/**
 * Función para crear el estado inicial de Solicitud32615Mensajeria.
 * @returns {Solicitud32615MensajeriaState} El estado inicial de Solicitud32615Mensajeria.
 */
export function createInitialState(): Solicitud32615MensajeriaState {
    return {
        /**
         * El valor de comercioExterior.
         */
        comercioExterior: '',
        /**
         * El valor de recintoFiscalizado.
         */
        recintoFiscalizado: '',
        /**
         * El valor de cancelacionRecintoFiscalizado.
         */
        cancelacionRecintoFiscalizado: '',
        /**
         * El valor de perfilRecintoFiscalizado.
         */
        perfilRecintoFiscalizado: '',
        /**
         * El valor de numeroDeOficio.
         */
        numeroDeOficio: '',
        /**
         * El valor de fechaDePresentacion.
         */
        fechaDePresentacion: '',
        /**
         * El valor de mensajeriaPaqueteria.
         */
        mensajeriaPaqueteria: '', 
        /**
         * El valor de laSolicitanteInterna.
         */
        laSolicitanteInterna: '',
        /**
         * El valor de subsidiaria.
         */
        subsidiaria: '',
        /**
         * El valor de filiales.
         */
        filiales: '',
        /**
         * El valor de matrices.
         */
        matrices: '',
        /**
         * El valor de aeronauticaCivil.
         */
        aeronauticaCivil: '',
        /**
         * El valor de conformidadArticulos.
         */
        conformidadArticulos: '',
        /**
         * El valor de rfc.
         */
        rfc: '',
        /**
         * El valor de documentosMercancias.
         */
        documentosMercancias: '',
        /**
         * El valor de rfcLasEmpresas.
         */
        rfcLasEmpresas: '',
        /**
         * El valor de generalAeronauticaCivil.
         */
        generalAeronauticaCivil: '',
        /**
         * El valor de exteriorConformidad.
         */
        exteriorConformidad: '',
        /**
         * El valor de reconocimientoMutuo.
         */
        reconocimientoMutuo: '',
        /**
         * El valor de rfcListado.
         */
        rfcListado: '',
        /**
         * El valor de nombreRazonSocialListado.
         */
        nombreRazonSocialListado: '',
        /**
         * El valor de direccionFiscalListado.
         */
        direccionFiscalListado: '',
        /**
         * El valor de paginaElectronicaListado.
         */
        paginaElectronicaListado: '',
        /**
         * El valor de correoElectronicaListado.
         */
        correoElectronicaListado: '',
        /**
         * El valor de telefonoContactoListado.
         */
        telefonoContactoListado: '',
        /**
         * El valor de informacionProporcionada.
         */
        informacionProporcionada: '',
        /**
         * El valor de claveReferencia.
         */
        claveReferencia: '',
        /**
         * El valor de numeroOperacion.
         */
        numeroOperacion: '',
        /**
         * El valor de cadenaDependencia.
         */
        cadenaDependencia: '',
        /**
         * El valor de banco.
         */
        banco: '',
        /**
         * El valor de llavePago.
         */
        llavePago: '',
        /**
         * El valor de fechaFactura.
         */
        fechaFactura: '',
        /**
         * El valor de importePago.
         */
        importePago: '',
        /**
         * El valor de fechaInicioComercioExterior.
         */
        fechaInicioComercioExterior: '',
        /**
         * El valor de fechaVigencia.
         */
        fechaVigencia: '',
        /**
         * El valor de numeroAutorizacion.
         */
        numeroAutorizacion: '',
    };
}

 /**
 * Decorador Injectable para hacer que la tienda esté disponible a nivel raíz.
 */
@Injectable({
    providedIn: 'root',
})
/**
 * Decorador StoreConfig para configurar la tienda con un nombre y una opción de restablecimiento.
 * @param {Object} config - El objeto de configuración.
 * @param {string} config.name - El nombre de la tienda.
 * @param {boolean} config.resettable - Indica si la tienda es restablecible.
 */
@StoreConfig({ name: 'tramite32615Mensajeria', resettable: true })

export class Tramite32615MensajeriaStore extends Store<Solicitud32615MensajeriaState>{
    /**
     * Crea una instancia de Tramite32615Store.
     * Inicializa la tienda con el estado inicial.
     */
    constructor() {
        super(createInitialState());
    }

    /**
     * Establece el estado de comercioExterior.
     * @param comercioExterior - El valor de comercioExterior.
     */
    public setComercioExterior(comercioExterior: string):void {
        this.update((state) => ({
            ...state,
            comercioExterior,
        }));
    }
    /**
     * Establece el estado de recintoFiscalizado.
     * @param recintoFiscalizado - El valor de recintoFiscalizado.
     */
    public setRecintoFiscalizado(recintoFiscalizado: string):void {
        this.update((state) => ({
            ...state,
            recintoFiscalizado,
        }));
    }
    /**
     * Establece el estado de cancelacionRecintoFiscalizado.
     * @param cancelacionRecintoFiscalizado - El valor de cancelacionRecintoFiscalizado.
     */
    public setCancelacionRecintoFiscalizado(cancelacionRecintoFiscalizado: string):void {
        this.update((state) => ({
            ...state,
            cancelacionRecintoFiscalizado,
        }));
    }
    /**
     * Establece el estado de perfilRecintoFiscalizado.
     * @param perfilRecintoFiscalizado - El valor de perfilRecintoFiscalizado.
     */
    public setPerfilRecintoFiscalizado(perfilRecintoFiscalizado: string):void {
        this.update((state) => ({
            ...state,
            perfilRecintoFiscalizado,
        }));
    }
    /**
     * Establece el estado de numeroDeOficio.
     * @param numeroDeOficio - El valor de numeroDeOficio.
     */
    public setNumeroDeOficio(numeroDeOficio: string):void {
        this.update((state) => ({
            ...state,
            numeroDeOficio,
        }));
    }
    /**
     * Establece el estado de fechaDePresentacion.
     * @param fechaDePresentacion - El valor de fechaDePresentacion.
     */
    public setFechaDePresentacion(fechaDePresentacion: string):void {
        this.update((state) => ({
            ...state,
            fechaDePresentacion,
        }));
    }
    /**
     * Establece el estado de mensajeriaPaqueteria.
     * @param mensajeriaPaqueteria - El valor de mensajeriaPaqueteria.
     */
    public setMensajeriaPaqueteria(mensajeriaPaqueteria: string):void {
        this.update((state) => ({
            ...state,
            mensajeriaPaqueteria,
        }));
    }
    /**
     * Establece el estado de laSolicitanteInterna.
     * @param laSolicitanteInterna - El valor de laSolicitanteInterna.
     */
    public setLaSolicitanteInterna(laSolicitanteInterna: string):void {
        this.update((state) => ({
            ...state,
            laSolicitanteInterna,
        }));
    }
    /**
     * Establece el estado de subsidiaria.
     * @param subsidiaria - El valor de subsidiaria.
     */
    public setSubsidiaria(subsidiaria: string):void {
        this.update((state) => ({
            ...state,
            subsidiaria,
        }));
    }
    /**
     * Establece el estado de filiales.
     * @param filiales - El valor de filiales.
     */
    public setFiliales(filiales: string):void {
        this.update((state) => ({
            ...state,
            filiales,
        }));
    }
    /**
     * Establece el estado de matrices.
     * @param matrices - El valor de matrices.
     */
    public setMatrices(matrices: string):void {
        this.update((state) => ({
            ...state,
            matrices,
        }));
    }
    /**
     * Establece el estado de aeronauticaCivil.
     * @param aeronauticaCivil - El valor de aeronauticaCivil.
     */
    public setAeronauticaCivil(aeronauticaCivil: string):void {
        this.update((state) => ({
            ...state,
            aeronauticaCivil,
        }));
    }
    /**
     * Establece el estado de conformidadArticulos.
     * @param conformidadArticulos - El valor de conformidadArticulos.
     */
    public setConformidadArticulos(conformidadArticulos: string):void {
        this.update((state) => ({
            ...state,
            conformidadArticulos,
        }));
    }
    /**
     * Establece el estado de rfc.
     * @param rfc - El valor de rfc.
     */
    public setRfc(rfc: string):void {
        this.update((state) => ({
            ...state,
            rfc,
        }));
    }
    /**
     * Establece el estado de documentosMercancias.
     * @param documentosMercancias - El valor de documentosMercancias.
     */
    public setDocumentosMercancias(documentosMercancias: string):void {
        this.update((state) => ({
            ...state,
            documentosMercancias,
        }));
    }
    /**
     * Establece el estado de rfcLasEmpresas.
     * @param rfcLasEmpresas - El valor de rfcLasEmpresas.
     */
    public setRfcLasEmpresas(rfcLasEmpresas: string):void {
        this.update((state) => ({
            ...state,
            rfcLasEmpresas,
        }));
    }
    /**
     * Establece el estado de generalAeronauticaCivil.
     * @param generalAeronauticaCivil - El valor de generalAeronauticaCivil.
     */
    public setGeneralAeronauticaCivil(generalAeronauticaCivil: string):void {
        this.update((state) => ({
            ...state,
            generalAeronauticaCivil,
        }));
    }
    /**
     * Establece el estado de exteriorConformidad.
     * @param exteriorConformidad - El valor de exteriorConformidad.
     */
    public setExteriorConformidad(exteriorConformidad: string):void {
        this.update((state) => ({
            ...state,
            exteriorConformidad,
        }));
    }
    /**
     * Establece el estado de reconocimientoMutuo.
     * @param reconocimientoMutuo - El valor de reconocimientoMutuo.
     */
    public setReconocimientoMutuo(reconocimientoMutuo: string):void {
        this.update((state) => ({
            ...state,
            reconocimientoMutuo,
        }));
    }
    /**
     * Establece el estado de rfcListado.
     * @param rfcListado - El valor de rfcListado.
     */
    public setRfcListado(rfcListado: string):void {
        this.update((state) => ({
            ...state,
            rfcListado,
        }));
    }
    /**
     * Establece el estado de nombreRazonSocialListado.
     * @param nombreRazonSocialListado - El valor de nombreRazonSocialListado.
     */
    public setNombreRazonSocialListado(nombreRazonSocialListado: string):void {
        this.update((state) => ({
            ...state,
            nombreRazonSocialListado,
        }));
    }
    /**
     * Establece el estado de direccionFiscalListado.
     * @param direccionFiscalListado - El valor de direccionFiscalListado.
     */
    public setDireccionFiscalListado(direccionFiscalListado: string):void {
        this.update((state) => ({
            ...state,
            direccionFiscalListado,
        }));
    }
    /**
     * Establece el estado de paginaElectronicaListado.
     * @param paginaElectronicaListado - El valor de paginaElectronicaListado.
     */
    public setPaginaElectronicaListado(paginaElectronicaListado: string):void {
        this.update((state) => ({
            ...state,
            paginaElectronicaListado,
        }));
    }
    /**
     * Establece el estado de correoElectronicaListado.
     * @param correoElectronicaListado - El valor de correoElectronicaListado.
     */
    public setCorreoElectronicaListado(correoElectronicaListado: string):void {
        this.update((state) => ({
            ...state,
            correoElectronicaListado,
        }));
    }
    /**
     * Establece el estado de telefonoContactoListado.
     * @param telefonoContactoListado - El valor de telefonoContactoListado.
     */
    public setTelefonoContactoListado(telefonoContactoListado: string):void {
        this.update((state) => ({
            ...state,
            telefonoContactoListado,
        }));
    }
    /**
     * Establece el estado de informacionProporcionada.
     * @param informacionProporcionada - El valor de informacionProporcionada.
     */
    public setInformacionProporcionada(informacionProporcionada: string):void {
        this.update((state) => ({
            ...state,
            informacionProporcionada,
        }));
    }
    /**
     * Establece el estado de claveReferencia.
     * @param claveReferencia - El valor de claveReferencia.
     */
    public setClaveReferencia(claveReferencia: string):void {
        this.update((state) => ({
            ...state,
            claveReferencia,
        }));
    }
    /**
     * Establece el estado de numeroOperacion.
     * @param numeroOperacion - El valor de numeroOperacion.
     */
    public setNumeroOperacion(numeroOperacion: string):void {
        this.update((state) => ({
            ...state,
            numeroOperacion,
        }));
    }
    /**
     * Establece el estado de cadenaDependencia.
     * @param cadenaDependencia - El valor de cadenaDependencia.
     */
    public setCadenaDependencia(cadenaDependencia: string):void {
        this.update((state) => ({
            ...state,
            cadenaDependencia,
        }));
    }
    /**
     * Establece el estado de banco.
     * @param banco - El valor de banco.
     */
    public setBanco(banco: string):void {
        this.update((state) => ({
            ...state,
            banco,
        }));
    }
    /**
     * Establece el estado de llavePago.
     * @param llavePago - El valor de llavePago.
     */
    public setLlavePago(llavePago: string):void {
        this.update((state) => ({
            ...state,
            llavePago,
        }));
    }
    /**
     * Establece el estado de fechaFactura.
     * @param fechaFactura - El valor de fechaFactura.
     */
    public setFechaFactura(fechaFactura: string):void {
        this.update((state) => ({
            ...state,
            fechaFactura,
        }));
    }
    /**
     * Establece el estado de importePago.
     * @param importePago - El valor de importePago.
     */
    public setImportePago(importePago: string):void {
        this.update((state) => ({
            ...state,
            importePago,
        }));
    }
    /**
     * Establece el estado de fechaInicioComercioExterior.
     * @param fechaInicioComercioExterior - El valor de fechaInicioComercioExterior.
     */
    public setFechaInicioComercioExterior(fechaInicioComercioExterior: string):void {
        this.update((state) => ({
            ...state,
            fechaInicioComercioExterior,
        }));
    }
    /**
     * Establece el estado de fechaVigencia.
     * @param fechaVigencia - El valor de fechaVigencia.
     */
    public setFechaVigencia(fechaVigencia: string):void {
        this.update((state) => ({
            ...state,
            fechaVigencia,
        }));
    }
    /**
     * Establece el estado de numeroAutorizacion.
     * @param numeroAutorizacion - El valor de numeroAutorizacion.
     */
    public setNumeroAutorizacion(numeroAutorizacion: string):void {
        this.update((state) => ({
            ...state,
            numeroAutorizacion,
        }));
    }

}
