import { Store, StoreConfig } from "@datorama/akita";
import { ConsultaSocioExtranjero } from "../application/core/models/consulta-socio-extranjero.model";
import { ConsultaSocioNacional } from "../application/core/models/consulta-socio-nacional.model";
import { Injectable } from "@angular/core";

/**
 * Interfaz que define el estado del store de accionistas.
 */
export interface AccionistaStore {
    /** Indica si el accionista es nacional o extranjero */
    tipoNacionalidad: boolean;
    /** Tipo de persona nacional (física o moral) */
    personaNacional: string;
    /** RFC del accionista */
    rfc: string;
    /** Nombre del accionista */
    nombre: string;
    /** Apellido paterno del accionista */
    apellidoPaterno: string;
    /** Apellido materno del accionista (opcional) */
    apellidoMaterno?: string;
    /** País del accionista */
    pais: string;
    /** Código postal del accionista */
    codigoPostal: string;
    /** Estado del accionista */
    estado: string;
    /** Razón social del accionista */
    razonSocial: string;
    /** Objeto con datos del accionista nacional */
    accionistaNacional: ConsultaSocioNacional;
    /** Lista de accionistas nacionales */
    listaAccionistasNacionales: ConsultaSocioNacional[];
    /** Datos de accionista extranjero persona física */
    accionistaExtranjeroFisica: ConsultaSocioExtranjero;
    /** Lista de accionistas extranjeros físicos */
    listaAccionistasExtranjeros: ConsultaSocioExtranjero[];
    /** Datos de accionista extranjero persona moral */
    accionistaExtranjeroMoral: ConsultaSocioExtranjero;
    /** Lista de accionistas extranjeros morales (opcional) */
    listaAccionistasExtranjerosMoral?: ConsultaSocioExtranjero[];
    /** Indica si se deben visualizar las tablas */
    visaulizarTablas: boolean;
    /** Indica si se están registrando datos */
    registrarDatos: boolean;
    /** Selección de accionistas nacionales */
    accionistaNacionalSeleccionado: ConsultaSocioExtranjero[];
    /** Selección de accionistas extranjeros */
    accionistaExtranjeroSeleccionado: ConsultaSocioExtranjero[];
}

/**
 * Retorna el estado inicial del store de accionistas.
 * @returns {AccionistaStore} Estado inicial
 */
export function createInitialState(): AccionistaStore {
    return {
        tipoNacionalidad: true,
        personaNacional: 'fisica',
        rfc: '',
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        pais: '',
        codigoPostal: '',
        estado: '',
        razonSocial: '',
        accionistaNacional: {
            rfc: '',
            nombre: '',
            apellidoPaterno: '',
            apellidoMaterno: '',
            nacionalidad: '',
            tipoPersona: ''
        },
        listaAccionistasNacionales: [],
        accionistaExtranjeroFisica: {
            razonSocial: '',
            nombre: '',
            apellidoPaterno: '',
            apellidoMaterno: '',
            pais: '',
            codigoPostal: '',
            estado: '',
            calle: '',
            numeroInterior: '',
            numeroExterior: '',
            numeroSeguroSocial: '',
            numeroIdentificacionFiscal: ''
        },
        listaAccionistasExtranjeros: [],
        accionistaExtranjeroMoral: {
            razonSocial: '',
            nombre: '',
            apellidoPaterno: '',
            apellidoMaterno: '',
            pais: '',
            codigoPostal: '',
            estado: '',
            calle: '',
            numeroInterior: '',
            numeroExterior: '',
            numeroSeguroSocial: '',
            numeroIdentificacionFiscal: ''
        },
        listaAccionistasExtranjerosMoral: [],
        visaulizarTablas: false,
        registrarDatos: false,
        accionistaNacionalSeleccionado: [],
        accionistaExtranjeroSeleccionado: []
    }
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'AccionistaStore', resettable: true })
/**
 * Servicio que administra el estado de los accionistas usando Akita.
 */
export class AccionistaStoreService extends Store<AccionistaStore> {
    /** Estado local del store */
    private state: AccionistaStore = createInitialState();

    constructor() {
        super(createInitialState());
    }

    /**
     * Obtiene el estado actual del store.
     * @returns {AccionistaStore} Estado actual
     */
    getState(): AccionistaStore {
        return this.state;
    }

    /**
     * Actualiza el estado local con los nuevos valores proporcionados.
     * @param {Partial<AccionistaStore>} newState - Nuevos valores para actualizar el estado
     */
    updateState(newState: Partial<AccionistaStore>): void {
        this.state = { ...this.state, ...newState };
    }

    /**
     * Restaura el estado a los valores iniciales.
     */
    resetState(): void {
        this.state = createInitialState();
        this.update(this.state);
    }

    /**
     * Actualiza el accionista nacional en el estado.
     * @param {ConsultaSocioNacional} accionistaNacional - Datos del accionista nacional
     */
    public setsocioAccionistaNacional(accionistaNacional: ConsultaSocioNacional): void {
        this.update((state) => ({
            ...state,
            accionistaNacional,
        }));
    }

    /**
     * Cambia el valor de visualización de tablas.
     * @param {boolean} visualizarTabla - Nuevo valor para visualizar tablas
     */
    public setVisualizarTabla(visualizarTabla: boolean): void {
        this.update((state) => ({
            ...state,
            visualizarTabla,
        }));
    }

    /**
     * Cambia el valor de registro de datos para nacionales.
     * @param {boolean} registrarDatos - Nuevo valor para registrar datos
     */
    public setRegistraDatosNacional(registrarDatos: boolean): void {
        this.update((state) => ({
            ...state,
            registrarDatos,
        }));
    }

    /**
     * Actualiza la lista de accionistas nacionales.
     * @param {ConsultaSocioNacional[]} listaAccionistasNacionales - Nueva lista de accionistas nacionales
     */
    public setListaSociosNacionales(listaAccionistasNacionales: ConsultaSocioNacional[]): void {
        this.update((state) => ({
            ...state,
            listaAccionistasNacionales,
        }));
    }

    /**
     * Actualiza el accionista extranjero persona física.
     * @param {ConsultaSocioExtranjero} accionistaExtranjeroFisica - Datos del accionista extranjero físico
     */
    public setsocioAccionistaExtranjero(accionistaExtranjeroFisica: ConsultaSocioExtranjero): void {
        this.update((state) => ({
            ...state,
            accionistaExtranjeroFisica,
        }));
    }

    /**
     * Actualiza el accionista extranjero persona moral.
     * @param {ConsultaSocioExtranjero} accionistaExtranjeroMoral - Datos del accionista extranjero moral
     */
    public setsocioAccionistaExtranjeroMoral(accionistaExtranjeroMoral: ConsultaSocioExtranjero): void {
        this.update((state) => ({
            ...state,
            accionistaExtranjeroMoral,
        }));
    }

    /**
     * Actualiza la lista de accionistas extranjeros físicos.
     * @param {ConsultaSocioExtranjero[]} listaAccionistasExtranjeros - Nueva lista de accionistas extranjeros físicos
     */
    public setListaSociosExtrajero(listaAccionistasExtranjeros: ConsultaSocioExtranjero[]): void {
        this.update((state) => ({
            ...state,
            listaAccionistasExtranjeros,
        }));
    }

    /**
     * Cambia el valor de registro de datos para extranjeros.
     * @param {boolean} registrarDatos - Nuevo valor para registrar datos
     */
    public setRegistraDatosExtranjero(registrarDatos: boolean): void {
        this.update((state) => ({
            ...state,
            registrarDatos,
        }));
    }
}