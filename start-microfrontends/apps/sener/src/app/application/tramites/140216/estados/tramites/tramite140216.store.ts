import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { PermisosVigentes } from '../../models/suspension-permiso.model';

/**
 * Creacion del estado inicial para la interfaz de tramite 140216
 * @interface BusquedaPermisos140216State
 * @returns {BusquedaPermisos140216State} Estado inicial de maniobras y mercancías
 */
export interface BusquedaPermisos140216State {
    /**
     * Folio del tramite a buscar
     * @type {string}
     */
    folioTramiteBusqueda?: string;

    /**
     * Motivo de la suspensión
     * @type {string}
     */
    motivoSuspension?: string;

    /**
     * Número de autorización
     * @type {string}
     */
    numAutorizacion?: string;

    /**
     * Fecha de la suspensión
     * @type {string}
     */
    fechaSuspension?: string;

    /**
     * Tabla de permisos vigentes
     * @type {PermisosVigentes[]}
     */
    permisosVigentesTabla?: PermisosVigentes[];

    /**
     * Denominación o razón social
     * @type {string}
     */
    denominacion?: string;

    /**
     * Actividad económica
     * @type {string}
     */
    actividadEconomica?: string;

    /**
     * Correo electrónico
     * @type {string}
     */
    correoElectronico?: string;

    /**
     * RFC
     * @type {string}
     */
    rfc?: string;

    /**
     * Calle
     * @type {string}
     */
    calle?: string;

    /**
     * Número exterior
     * @type {string}
     */
    numeroExterior?: string;

    /**
     * Número interior
     * @type {string}
     */
    numeroInterior?: string;

    /**
     * Código postal
     * @type {string}
     */
    codigoPostal?: string;

    /**
     * Colonia
     * @type {string}
     */
    colonia?: string;

    /**
     * País
     * @type {string}
     */
    pais?: string;

    /**
     * Estado
     * @type {string}
     */
    estado?: string;

    /**
     * Localidad
     * @type {string}
     */
    localidad?: string;

    /**
     * Municipio o alcaldía
     * @type {string}
     */
    municipioAlcaldia?: string;

    /**
     * Teléfono
     * @type {string}
     */
    telefono?: string;

    /**
     * Folio del permiso
     * @type {string}
     */
    folio?: string;

    /**
     * Tipo de solicitud
     * @type {string}
     */
    tipoSolicitud?: string;

    /**
     * Regimen
     * @type {string}
     */
    regimen?: string;

    /**
     * Clasificación de régimen
     * @type {string}
     */
    clasificacionRegimen?: string;

    /**
     * Periodo de vigencia
     * @type {string}
     */
    vigenciaPeriodo?: string;

    /**
     * Unidad de medida
     * @type {string}
     */
    unidadMedida?: string;

    /**
     * Cantidad
     * @type {string}
     */
    cantidad?: string;

    /**
     * Valor de la factura en USD
     * @type {string}
     */
    valorFacturaUSD?: string;

    /**
     * Saldo
     * @type {string}
     */
    saldo?: string;

    /**
     * Fracción arancelaria
     * @type {string}
     */
    fraccionArancelaria?: string;

    /**
     * NICO
     * @type {string}
     */
    nico?: string;

    /**
     * Descripción del NICO
     * @type {string}
     */
    nicoDescripcion?: string;

    /**
     * Acotación
     * @type {string}
     */
    acotacion?: string;

    /**
     * Descripción de la mercancía
     * @type {string}
     */
    descripcionMercancia?: string;

    /**
     * País de procedencia
     * @type {string}
     */
    paisProcedencia?: string;
}

/**
 * Crea el estado inicial para la interfaz de tramite 140216
 * @returns {BusquedaPermisos140216State} Estado inicial de maniobras y mercancías
 */
export function createInitialState(): BusquedaPermisos140216State {
    return {
        folioTramiteBusqueda: '',
        motivoSuspension: '',
        numAutorizacion: '',
        fechaSuspension: '',

        permisosVigentesTabla: [],

        denominacion: '',
        actividadEconomica: '',
        correoElectronico: '',
        rfc: '',
        calle: '',
        numeroExterior: '',
        numeroInterior: '',
        codigoPostal: '',
        colonia: '',
        pais: '',
        estado: '',
        localidad: '',
        municipioAlcaldia: '',
        telefono: '',
        folio: '',
        tipoSolicitud: '',
        regimen: '',
        clasificacionRegimen: '',
        vigenciaPeriodo: '',
        unidadMedida: '',
        cantidad: '',
        valorFacturaUSD: '',
        saldo: '',
        fraccionArancelaria: '',
        nico: '',
        nicoDescripcion: '',
        acotacion: '',
        descripcionMercancia: '',
        paisProcedencia: ''
    };
}

/**
 * Clase que representa el almacén de estado para el trámite 140216.
 */
@Injectable({
    providedIn: 'root',
})

/**
 * Clase que representa el almacén de estado para el trámite 140216.
 * @StoreConfig { name: 'tramite140216', resettable: true }
 * @class Tramite140216Store
 * @extends Store<BusquedaPermisos140216State>
 * @description Almacén de estado para el trámite 140216.
 */
@StoreConfig({ name: 'tramite140216', resettable: true })
export class Tramite140216Store extends Store<BusquedaPermisos140216State> {
    /**
     * Constructor de la clase Tramite140216Store.
     * @constructor
     */
    constructor() {
        super(createInitialState());
    }

    /**
     * Actualiza el estado de la propiedad 'folioTramiteBusqueda'.
     * @param folioTramiteBusqueda - Nuevo valor para 'folioTramiteBusqueda'.
     * @returns {void}
     */
    public setFolioTramiteBusqueda(folioTramiteBusqueda: string): void {
        this.update((state) => ({
            ...state,
            folioTramiteBusqueda,
        }));
    }

    /**
     * Actualiza el estado de la propiedad 'motivoSuspension'.
     * @param motivoSuspension - Nuevo valor para 'motivoSuspension'.
     * @returns {void}
     */
    public setMotivoSuspension(motivoSuspension: string): void {
        this.update((state) => ({
            ...state,
            motivoSuspension,
        }));
    }

    /**
     * Actualiza el estado de la propiedad 'numAutorizacion'.
     * @param numAutorizacion - Nuevo valor para 'numAutorizacion'.
     * @returns {void}
     */
    public setNumAutorizacion(numAutorizacion: string): void {
        this.update((state) => ({
            ...state,
            numAutorizacion,
        }));
    }

    /**
     * Actualiza el estado de la propiedad 'fechaSuspension'.
     * @param fechaSuspension - Nuevo valor para 'fechaSuspension'.
     * @returns {void}
     */
    public setFechaSuspension(fechaSuspension: string): void {
        this.update((state) => ({
            ...state,
            fechaSuspension,
        }));
    }

    /**
     * Actualiza el estado de la propiedad 'permisosVigentesTabla'.
     * @param permisosVigentesTabla - Nuevo valor para 'permisosVigentesTabla'.
     * @returns {void}
     */
    public setPermisosVigentesTabla(permisosVigentesTabla: PermisosVigentes[]): void {
        this.update((state) => ({
            ...state,
            permisosVigentesTabla,
        }));
    }

    /**
     * Actualiza el estado de la propiedad 'denominacion'.
     * @param denominacion - Nuevo valor para 'denominacion'.
     * @returns {void}
     */
    public setDenominacion(denominacion: string): void {
        this.update((state) => ({
            ...state,
            denominacion,
        }));
    }

    /**
     * Actualiza el estado de la propiedad 'actividadEconomica'.
     * @param actividadEconomica - Nuevo valor para 'actividadEconomica'.
     * @returns {void}
     */
    public setActividadEconomica(actividadEconomica: string): void {
        this.update((state) => ({
            ...state,
            actividadEconomica,
        }));
    }

    /**
     * Actualiza el estado de la propiedad 'correoElectronico'.
     * @param correoElectronico - Nuevo valor para 'correoElectronico'.
     * @returns {void}
     */
    public setCorreoElectronico(correoElectronico: string): void {
        this.update((state) => ({
            ...state,
            correoElectronico,
        }));
    }

    /**
     * Actualiza el estado de la propiedad 'rfc'.
     * @param rfc - Nuevo valor para 'rfc'.
     * @returns {void}
     */
    public setRfc(rfc: string): void {
        this.update((state) => ({
            ...state,
            rfc,
        }));
    }

    /**
     * Actualiza el estado de la propiedad 'calle'.
     * @param calle - Nuevo valor para 'calle'.
     * @returns {void}
     */
    public setCalle(calle: string): void {
        this.update((state) => ({
            ...state,
            calle,
        }));
    }

    /**
     * Actualiza el estado de la propiedad 'numeroExterior'.
     * @param numeroExterior - Nuevo valor para 'numeroExterior'.
     * @returns {void}
     */
    public setNumeroExterior(numeroExterior: string): void {
        this.update((state) => ({
            ...state,
            numeroExterior,
        }));
    }

    /**
     * Actualiza el estado de la propiedad 'numeroInterior'.
     * @param numeroInterior - Nuevo valor para 'numeroInterior'.
     * @returns {void}
     */
    public setNumeroInterior(numeroInterior: string): void {
        this.update((state) => ({
            ...state,
            numeroInterior,
        }));
    }

    /**
     * Actualiza el estado de la propiedad 'codigoPostal'.
     * @param codigoPostal - Nuevo valor para 'codigoPostal'.
     * @returns {void}
     */
    public setCodigoPostal(codigoPostal: string): void {
        this.update((state) => ({
            ...state,
            codigoPostal,
        }));
    }

    /**
     * Actualiza el estado de la propiedad 'colonia'.
     * @param colonia - Nuevo valor para 'colonia'.
     * @returns {void}
     */
    public setColonia(colonia: string): void {
        this.update((state) => ({
            ...state,
            colonia,
        }));
    }

    /**
     * Actualiza el estado de la propiedad 'pais'.
     * @param pais - Nuevo valor para 'pais'.
     * @returns {void}
     */
    public setPais(pais: string): void {
        this.update((state) => ({
            ...state,
            pais,
        }));
    }

    /**
     * Actualiza el estado de la propiedad 'estado'.
     * @param estado - Nuevo valor para 'estado'.
     * @returns {void}
     */
    public setEstado(estado: string): void {
        this.update((state) => ({
            ...state,
            estado,
        }));
    }

    /**
     * Actualiza el estado de la propiedad 'localidad'.
     * @param localidad - Nuevo valor para 'localidad'.
     * @returns {void}
     */
    public setLocalidad(localidad: string): void {
        this.update((state) => ({
            ...state,
            localidad,
        }));
    }

    /**
     * Actualiza el estado de la propiedad 'municipioAlcaldia'.
     * @param municipioAlcaldia - Nuevo valor para 'municipioAlcaldia'.
     * @returns {void}
     */
    public setMunicipioAlcaldia(municipioAlcaldia: string): void {
        this.update((state) => ({
            ...state,
            municipioAlcaldia,
        }));
    }

    /**
     * Actualiza el estado de la propiedad 'telefono'.
     * @param telefono - Nuevo valor para 'telefono'.
     * @returns {void}
     */
    public setTelefono(telefono: string): void {
        this.update((state) => ({
            ...state,
            telefono,
        }));
    }

    /**
     * Actualiza el estado de la propiedad 'folio'.
     * @param folio - Nuevo valor para 'folio'.
     * @returns {void}
     */
    public setFolio(folio: string): void {
        this.update((state) => ({
            ...state,
            folio,
        }));
    }

    /**
     * Actualiza el estado de la propiedad 'tipoSolicitud'.
     * @param tipoSolicitud - Nuevo valor para 'tipoSolicitud'.
     * @returns {void}
     */
    public setTipoSolicitud(tipoSolicitud: string): void {
        this.update((state) => ({
            ...state,
            tipoSolicitud,
        }));
    }

    /**
     * Actualiza el estado de la propiedad 'regimen'.
     * @param regimen - Nuevo valor para 'regimen'.
     * @returns {void}
     */
    public setRegimen(regimen: string): void {
        this.update((state) => ({
            ...state,
            regimen,
        }));
    }

    /**
     * Actualiza el estado de la propiedad 'clasificacionRegimen'.
     * @param clasificacionRegimen - Nuevo valor para 'clasificacionRegimen'.
     * @returns {void}
     */
    public setClasificacionRegimen(clasificacionRegimen: string): void {
        this.update((state) => ({
            ...state,
            clasificacionRegimen,
        }));
    }

    /**
     * Actualiza el estado de la propiedad 'vigenciaPeriodo'.
     * @param vigenciaPeriodo - Nuevo valor para 'vigenciaPeriodo'.
     * @returns {void}
     */
    public setVigenciaPeriodo(vigenciaPeriodo: string): void {
        this.update((state) => ({
            ...state,
            vigenciaPeriodo,
        }));
    }

    /**
     * Actualiza el estado de la propiedad 'unidadMedida'.
     * @param unidadMedida - Nuevo valor para 'unidadMedida'.
     * @returns {void}
     */
    public setUnidadMedida(unidadMedida: string): void {
        this.update((state) => ({
            ...state,
            unidadMedida,
        }));
    }

    /**
     * Actualiza el estado de la propiedad 'cantidad'.
     * @param cantidad - Nuevo valor para 'cantidad'.
     * @returns {void}
     */
    public setCantidad(cantidad: string): void {
        this.update((state) => ({
            ...state,
            cantidad,
        }));
    }

    /**
     * Actualiza el estado de la propiedad 'valorFacturaUSD'.
     * @param valorFacturaUSD - Nuevo valor para 'valorFacturaUSD'.
     * @returns {void}
     */
    public setValorFacturaUSD(valorFacturaUSD: string): void {
        this.update((state) => ({
            ...state,
            valorFacturaUSD,
        }));
    }

    /**
     * Actualiza el estado de la propiedad 'saldo'.
     * @param saldo - Nuevo valor para 'saldo'.
     * @returns {void}
     */
    public setSaldo(saldo: string): void {
        this.update((state) => ({
            ...state,
            saldo,
        }));
    }

    /**
     * Actualiza el estado de la propiedad 'fraccionArancelaria'.
     * @param fraccionArancelaria - Nuevo valor para 'fraccionArancelaria'.
     * @returns {void}
     */
    public setFraccionArancelaria(fraccionArancelaria: string): void {
        this.update((state) => ({
            ...state,
            fraccionArancelaria,
        }));
    }

    /**
     * Actualiza el estado de la propiedad 'nico'.
     * @param nico - Nuevo valor para 'nico'.
     * @returns {void}
     */
    public setNico(nico: string): void {
        this.update((state) => ({
            ...state,
            nico,
        }));
    }

    /**
     * Actualiza el estado de la propiedad 'nicoDescripcion'.
     * @param nicoDescripcion - Nuevo valor para 'nicoDescripcion'.
     * @returns {void}
     */
    public setNicoDescripcion(nicoDescripcion: string): void {
        this.update((state) => ({
            ...state,
            nicoDescripcion,
        }));
    }

    /**
     * Actualiza el estado de la propiedad 'acotacion'.
     * @param acotacion - Nuevo valor para 'acotacion'.
     * @returns {void}
     */
    public setAcotacion(acotacion: string): void {
        this.update((state) => ({
            ...state,
            acotacion,
        }));
    }

    /**
     * Actualiza el estado de la propiedad 'descripcionMercancia'.
     * @param descripcionMercancia - Nuevo valor para 'descripcionMercancia'.
     * @returns {void}
     */
    public setDescripcionMercancia(descripcionMercancia: string): void {
        this.update((state) => ({
            ...state,
            descripcionMercancia,
        }));
    }

    /**
     * Actualiza el estado de la propiedad 'paisProcedencia'.
     * @param paisProcedencia - Nuevo valor para 'paisProcedencia'.
     * @returns {void}
     */
    public setPaisProcedencia(paisProcedencia: string): void {
        this.update((state) => ({
            ...state,
            paisProcedencia,
        }));
    }

    /**
     * Actualiza el estado de la consulta de suspensión de permiso.
     * @param nuevoDatos - Nuevo estado para la consulta de suspensión de permiso.
     */
    public setConsultaSuspensionPermisoState(nuevoDatos: BusquedaPermisos140216State): void {
        this.update(nuevoDatos);
    }
}