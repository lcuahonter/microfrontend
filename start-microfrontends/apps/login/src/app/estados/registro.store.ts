import { Store, StoreConfig } from "@datorama/akita";
import { ConsultaRegistro } from "../application/core/models/consulta-registro.model";
import { Injectable } from "@angular/core";

/**
 * Interfaz que define el estado del store de registro.
 * Contiene el RFC y la lista de personas para notificaciones.
 */
export interface RegistroStore {
    /** RFC de la persona registrada */
    rfc: string;
    /** Lista de personas que recibirán notificaciones */
    personasNotificaciones: ConsultaRegistro[];
    /** Persona notificador actualmente seleccionada o consultada */
    personaNotifcador: ConsultaRegistro;
    /** Indica si los datos han sido confirmados para registro */
    registrarDatos: boolean;
    /** Indica si la tabla de personas notificadoras debe mostrarse en la UI */
    visualizarTabla: boolean;
    /** Indica si se visualiza el botón eliminar */
    eliminar: boolean;
}

/**
 * Función que retorna el estado inicial del store de registro.
 * @returns Estado inicial con RFC vacío y lista vacía de notificaciones.
 */
export function createInitialState(): RegistroStore {
    return {
        rfc: '',
        personasNotificaciones: [],
        personaNotifcador: {
            idUsuario: 0,
            nombre: '',
            apellidoPaterno: '',
            apellidoMaterno: '',
            rfc: '',
        },
        registrarDatos: false,
        visualizarTabla: false,
        eliminar: false
    };
}

/**
 * Store de estado global para el registro de personas y notificaciones.
 * Utiliza Akita para la gestión reactiva del estado.
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'RegistroStates', resettable: true })
export class RegistroStates extends Store<RegistroStore> {
    /**
     * Constructor. Inicializa el store con el estado inicial.
     */
    constructor() {
        super(createInitialState());
    }

    /**
     * Resetea el store a su estado inicial.
     */
    resetStore() {
        this.reset();
    }

    /**
     * Actualiza el RFC en el estado global.
     * @param rfc RFC a establecer.
     */
    public setValorRFC(rfc: string): void {
        this.update((state) => ({
            ...state,
            rfc,
        }));
    }

    /**
     * Actualiza la lista de personas notificadoras en el estado global.
     * @param personasNotificaciones Lista de personas a establecer.
     */
    public setListaNotificadores(personasNotificaciones: ConsultaRegistro[]): void {
        this.update((state) => ({
            ...state,
            personasNotificaciones,
        }));
    }

    /**
     * Actualiza la persona notificador actualmente seleccionada o consultada en el estado global.
     * @param personaNotifcador Objeto de tipo ConsultaRegistro a establecer como notificador actual.
     */
    public setModeloNotificador(personaNotifcador: ConsultaRegistro): void {
        this.update((state) => ({
            ...state,
            personaNotifcador,
        }));
    }

    /**
     * Actualiza el valor que indica si los datos han sido confirmados para registro.
     * @param registrarDatos Valor booleano que indica si los datos están confirmados.
     */
    public setValorRegistro(registrarDatos: boolean): void {
        this.update((state) => ({
            ...state,
            registrarDatos,
        }));
    }

    /**
     * Actualiza el valor que indica si la tabla de personas notificadoras debe mostrarse en la UI.
     * @param visualizarTabla Valor booleano para mostrar u ocultar la tabla.
     */
    public setValorVisualizarTabla(visualizarTabla: boolean): void {
        this.update((state) => ({
            ...state,
            visualizarTabla,
        }));
    }

    /**
     * Actualiza el valor que indica si el botón de eliminar debe estar activo o visible en la UI.
     * @param eliminar Valor booleano para activar o desactivar el botón de eliminar.
     */
    public setBotonEliminar(eliminar: boolean): void {
        this.update((state) => ({
            ...state,
            eliminar,
        }));
    }
}