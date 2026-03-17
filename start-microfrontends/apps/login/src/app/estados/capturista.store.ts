import { Store, StoreConfig } from "@datorama/akita";
import { Capturista } from "../application/core/models/capturista.model";
import { Injectable } from "@angular/core";

/**
 * Interfaz que define la estructura del estado para el manejo de capturistas.
 */
export interface CapturistaStore {
    rfc: string;
    curp: string;
    listaCapturistas: Capturista[];
    consultaCapturista: Capturista;
    registrarDatos: boolean;
    visualizarTabla: boolean;
}

/**
 * Crea el estado inicial del store de capturistas.
 * Inicializa los valores por defecto para cada propiedad.
 */
export function createInitialState(): CapturistaStore {
    return {
        rfc: '',
        curp: '',
        listaCapturistas: [],
        consultaCapturista: {
            idCapturista: 0,
            nombre: '',
            apellidoPaterno: '',
            apellidoMaterno: '',
            rfc: '',
            curp: ''
        },
        registrarDatos: false,
        visualizarTabla: false
    };
}

/**
 * Servicio que gestiona el estado global de capturistas usando Akita Store.
 * Permite actualizar y consultar los valores relacionados con capturistas.
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'CapturistaStore', resettable: true })
export class CapturistaStoreService extends Store<CapturistaStore> {
    /** Estado interno del store */
    private state: CapturistaStore = createInitialState();

    constructor() {
        super(createInitialState());
    }

    /**
     * Obtiene el estado actual del store.
     * @returns Estado actual de CapturistaStore.
     */
    getState(): CapturistaStore {
        return this.state;
    }

    /**
     * Actualiza el estado del store con los valores proporcionados.
     * @param newState Objeto parcial con los valores a actualizar.
     */
    setState(newState: Partial<CapturistaStore>): void {
        this.state = { ...this.state, ...newState };
    }

    /**
     * Restaura el estado del store a sus valores iniciales.
     */
    resetStore(): void {
        this.state = createInitialState();
    }

    /**
     * Actualiza el valor del RFC en el estado.
     * @param rfc Nuevo valor de RFC.
     */
    public setValorRFC(rfc: string): void {
        this.update((state) => ({
            ...state,
            rfc,
        }));
    }

    /**
     * Actualiza el valor del CURP en el estado.
     * @param curp Nuevo valor de CURP.
     */
    public setValorCURP(curp: string): void {
        this.update((state) => ({
            ...state,
            curp,
        }));
    }

    /**
     * Actualiza el capturista consultado en el estado.
     * @param consultaCapturista Objeto Capturista consultado.
     */
    public setConsultaCapturista(consultaCapturista: Capturista): void {
        this.update((state) => ({
            ...state,
            consultaCapturista,
        }));
    }

    /**
     * Actualiza la bandera que indica si se deben registrar los datos.
     * @param registrarDatos Valor booleano para registrar datos.
     */
    public setRegistraDatos(registrarDatos: boolean): void {
        this.update((state) => ({
            ...state,
            registrarDatos,
        }));
    }

    /**
     * Actualiza la lista de capturistas en el estado.
     * @param listaCapturistas Nueva lista de capturistas.
     */
    public setListaCapturistas(listaCapturistas: Capturista[]): void {
        this.update((state) => ({
            ...state,
            listaCapturistas,
        }));
    }

    /**
     * Actualiza la bandera para visualizar la tabla de capturistas.
     * @param visualizarTabla Valor booleano para mostrar la tabla.
     */
    public setVisualizarTabla(visualizarTabla: boolean): void {
        this.update((state) => ({
            ...state,
            visualizarTabla,
        }));
    }
}