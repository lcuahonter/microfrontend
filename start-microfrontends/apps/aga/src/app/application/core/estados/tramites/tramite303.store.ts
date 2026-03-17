import { Store, StoreConfig } from "@datorama/akita";
import { AgenteAduanal } from "../../models/303/agente-aduanal.model";
import { ControlInventario } from "../../models/303/control-inventario.model";
import { EnlaceOperativo } from "../../models/303/enlace-operativo.model";
import { Injectable } from "@angular/core";
import { RepresentanteLegal } from "../../models/303/representante-legal.model";
import { Transportista } from "@libs/shared/data-access-user/src";

export interface Tramite303Store {
    /**
     * Indica el índice del trámite 303.
     */
    indice: number;
    /**
     * Indica si el trámite 303 está en cumplimiento.
     */
    cumplimiento: string;
    /**
     * Indica si se requiere autorización para el trámite 303.
     */
    autorizar: string;
    /**
     * Indica si se debe mostrar un listado de agentes aduanales.
     */
    listado: string;
    /**
     * Indica si se deben mostrar certificados relacionados con el trámite 303.
     */
    certificados: string;
    /**
     * Indica si se debe cumplir con el artículo 17 de la Ley Aduanera.
     */
    art17: string;
    /**
     * Indica si se debe utilizar un buzón para el trámite 303.
     */
    buzon: string;
    /**
     * Indica si se debe utilizar una cuenta IMMEX para el trámite 303.
     */
    cuentaImmex: string;
    /**
     * Indica si se debe mostrar un checkbox para importación 1.
     */
    checkboxImportacion1?: boolean;
    /**
     * Indica si se debe mostrar un checkbox para importación 2.
     */
    checkboxImportacion2?: boolean;
    /**
     * Tipo de figura aduanal seleccionada.
     */
    tipoFigura: string;
    /**
     * Lista de figuras aduanales asociadas al trámite 303.
     */
    listaFiguras?: AgenteAduanal[];
    /**
     * Indica si se deben mostrar radios para la selección de figuras aduanales.
     */
    mostrarCheckboxesImmex?: boolean;
    /**
     * Indica si se debe mostrar un select para la selección de números IMMEX.
     */
    mostrarSelectImmex?: boolean;
    /**
     * Lista de transportistas asociados al trámite 303.
     */
    listaTransportistas?: Transportista[];
    /**
     * Transportista a modificar en el trámite 303.
     */
    transportistaModificar?: Transportista;
    /**
     * Indica si se debe mostrar un campo para el número IMMEX.
     */
    immex: string;
    /**
     * Indica si se debe mostrar un campo para el padrón de importadores.
     */
    padron: string;
    /**
     * Indica si se debe mostrar un campo para el control de inventarios.
     */
    controlInventarios: string;
    /**
     * Indica si se debe mostrar un campo para el control de inventarios.
     */
    listaInventarios: ControlInventario[];
    /**
     * Indica si se debe mostrar un campo para la contabilidad.
     */
    contabilidad: string;
    /**
     * Indica si se debe mostrar un campo para el lugar de radicación.
     */
    lugarRadicacion: string;
    /**
     * Indica si se debe mostrar un campo para la interposición.
     */
    interposicion: string;
    /**
     * Indica si se debe mostrar un campo para el manifiesto 1.
     */
    checkboxManifiesto1: boolean;
    /**
     * Indica si se debe mostrar un campo para el manifiesto 2.
     */
    checkboxManifiesto2: boolean;
    /**
     * Indica si se debe mostrar un campo para el ingreso de informes.
     */
    ingresoInforme: string;
    /**
     * Lista de enlaces operativos asociados al trámite 303.
     */
    listaEnlaces: EnlaceOperativo[];
    /**
     * Representa el enlace operativo a modificar en el estado del trámite 303.
     */
    enlaceOperativoModificar?: EnlaceOperativo;
    /**
     * Representa al representante legal asociado al trámite 303.
     */
    representanteLegal?: RepresentanteLegal;
}
export function createInitialState(): Tramite303Store {
    return {
        indice: 1,
        cumplimiento: '',
        autorizar: '',
        listado: '',
        certificados: '',
        art17: '',
        buzon: '',
        cuentaImmex: '',
        checkboxImportacion1: false,
        checkboxImportacion2: false,
        tipoFigura: '',
        listaFiguras: [],
        mostrarCheckboxesImmex: false,
        mostrarSelectImmex: true,
        listaTransportistas: [],
        transportistaModificar: undefined,
        immex: '',
        padron: '',
        controlInventarios: '',
        listaInventarios: [],
        contabilidad: '',
        lugarRadicacion: '',
        interposicion: '',
        checkboxManifiesto1: false,
        checkboxManifiesto2: false,
        ingresoInforme: '',
        listaEnlaces: [],
        enlaceOperativoModificar: undefined,
        representanteLegal: undefined
    };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'Tramite303Store', resettable: true })
export class Tramite303StoreService extends Store<Tramite303Store> {
    private state: Tramite303Store = createInitialState();

    /**
     * Constructor del servicio Tramite303StoreService.
     * Inicializa el estado del trámite 303 con los valores por defecto.
     */
    constructor() {
        super(createInitialState());
    }

    /**
     * 
     * @returns Estado actual del trámite 303.
     * Este método devuelve el estado actual del trámite 303, que incluye información sobre el cumplimiento
     */
    getState(): Tramite303Store {
        return this.state;
    }

    /**
     * 
     * @param state Estado parcial del trámite 303 a establecer.
     * Este método actualiza el estado del trámite 303 con los valores proporcionados.
     */
    setState(state: Partial<Tramite303Store>): void {
        this.state = { ...this.state, ...state };
        this.update(this.state);
    }

    /**
     * 
     * @param indice Índice del trámite 303 a establecer en el estado.
     * Este método actualiza el estado del índice del trámite 303.
     */
    public setIndice(indice: number): void {
        this.update((state) => ({
            ...state,
            indice,
        }));
    }
    /**
     * 
     * @param tipoFigura Tipo de figura aduanal a establecer en el estado.
     * Este método actualiza el estado del tipo de figura aduanal seleccionado.
     */
    public setSeleccionarFigura(tipoFigura: string): void {
        this.update((state) => ({
            ...state,
            tipoFigura,
        }));
    }

    /**
     * 
     * @param listaFiguras Lista de figuras aduanales a establecer en el estado.
     */
    public setListaFiguras(listaFiguras: AgenteAduanal[]): void {
        this.update((state) => ({
            ...state,
            listaFiguras,
        }));
    }

    /**
     * Establece el valor de cumplimiento en el estado del trámite 303.
     * @param cumplimiento Valor de cumplimiento a establecer.
     */
    setCumplimientoValue(cumplimiento: string): void {
        this.update((state) => ({
            ...state,
            cumplimiento,
        }));
    }

    /**
     * Establece el valor de autorización en el estado del trámite 303.
     * @param autorizar Valor de autorización a establecer.
     */
    setAutorizarValue(autorizar: string): void {
        this.update((state) => ({
            ...state,
            autorizar,
        }));
    }

    /**
     * Establece el valor del listado en el estado del trámite 303.
     * @param listado Valor del listado a establecer.
     */
    setListadoValue(listado: string): void {
        this.update((state) => ({
            ...state,
            listado,
        }));
    }

    /**
     * Establece el valor de los certificados en el estado del trámite 303.
     * @param certificados Valor de los certificados a establecer.
     */
    setCertificadosValue(certificados: string): void {
        this.update((state) => ({
            ...state,
            certificados,
        }));
    }

    /**
     * Establece el valor del artículo 17 en el estado del trámite 303.
     * @param art17 Valor del artículo 17 a establecer.
     */
    setArt17Value(art17: string): void {
        this.update((state) => ({
            ...state,
            art17,
        }));
    }

    /**
     * Establece el valor del buzón en el estado del trámite 303.
     * @param buzon Valor del buzón a establecer.
     */
    setBuzonValue(buzon: string): void {
        this.update((state) => ({
            ...state,
            buzon,
        }));
    }

    /**
     * Establece el valor de la cuenta IMMEX en el estado del trámite 303.
     * @param cuentaImmex Valor de la cuenta IMMEX a establecer.
     */
    setCuentaImmexValue(cuentaImmex: string): void {
        this.update((state) => ({
            ...state,
            cuentaImmex,
        }));
    }

    /**
     * Establece el valor del checkbox de importación 1 en el estado del trámite 303.
     * @param checkboxImportacion1 Valor del checkbox de importación 1 a establecer.
     */
    setCheckboxImportacion1Value(checkboxImportacion1: boolean): void {
        this.update((state) => ({
            ...state,
            checkboxImportacion1,
        }));
    }

    /**
     * Establece el valor del checkbox de importación 2 en el estado del trámite 303.
     * @param checkboxImportacion2 Valor del checkbox de importación 2 a establecer.
     */
    setCheckboxImportacion2Value(checkboxImportacion2: boolean): void {
        this.update((state) => ({
            ...state,
            checkboxImportacion2,
        }));
    }
    /**
     * Establece si se deben mostrar radios para la selección de figuras aduanales.
     * @param mostrarRadios Valor booleano que indica si se deben mostrar radios.
     */
    setCheckboxesImmex(mostrarCheckboxesImmex: boolean): void {
        this.update((state) => ({
            ...state,
            mostrarCheckboxesImmex,
        }));
    }
    /**
     * Establece si se debe mostrar el select de IMMEX.
     * @param mostrarSelectImmex Valor booleano que indica si se debe mostrar el select de IMMEX.
     */
    setSelectImmex(mostrarSelectImmex: boolean): void {
        this.update((state) => ({
            ...state,
            mostrarSelectImmex,
        }));
    }
    /**
     * Establece la lista de transportistas en el estado del trámite 303.
     * @param listaTransportistas Lista de transportistas a establecer.
     */
    public setListaTransportistas(listaTransportistas: Transportista[]): void {
        this.update((state) => ({
            ...state,
            listaTransportistas,
        }));
    }

    /**
     * Establece el transportista a modificar en el estado del trámite 303.
     * @param transportista Transportista a modificar.
     */
    public trasportistaModificar(transportistaModificar: Transportista): void {
        this.update((state) => ({
            ...state,
            transportistaModificar: transportistaModificar,
        }));
    }

    /**
     * Establece el enlace operativo a modificar en el estado del trámite 303.
     * @param enlaceOperativoModificar Enlace operativo a modificar.
     */
    public enlaceOperativoModificar(enlaceOperativoModificar: EnlaceOperativo): void {
        this.update((state) => ({
            ...state,
            enlaceOperativoModificar: enlaceOperativoModificar,
        }));
    }

    /**
     * Establece el valor del padrón en el estado del trámite 303.
     * @param padron Valor del padrón a establecer.
     */
    setPadronValue(padron: string): void {
        this.update((state) => ({
            ...state,
            padron,
        }));
    }

    /**
     * Establece el valor del control de inventarios en el estado del trámite 303.
     * @param controlInventarios Valor del control de inventarios a establecer.
     */
    setControlInventariosValue(controlInventarios: string): void {
        this.update((state) => ({
            ...state,
            controlInventarios,
        }));
    }

    /**
     * Establece la lista de inventarios en el estado del trámite 303.
     * @param listaInventarios Lista de inventarios a establecer.
     */
    setListaInventarios(listaInventarios: ControlInventario[]): void {
        this.update((state) => ({
            ...state,
            listaInventarios,
        }));
    }

    /**
     * Establece el valor de la contabilidad en el estado del trámite 303.
     * @param contabilidad Valor de la contabilidad a establecer.
     */
    setContabilidadValue(contabilidad: string): void {
        this.update((state) => ({
            ...state,
            contabilidad,
        }));
    }

    /**
     * Establece el valor del ingreso de informe en el estado del trámite 303.
     * @param ingresoInforme Valor del ingreso de informe a establecer.
     */
    setIngresoInformeValue(ingresoInforme: string): void {
        this.update((state) => ({
            ...state,
            ingresoInforme,
        }));
    }

    /**
     * Establece el valor de la interposición en el estado del trámite 303.
     * @param interposicion Valor de la interposición a establecer.
     */
    setInterposicionValue(interposicion: string): void {
        this.update((state) => ({
            ...state,
            interposicion,
        }));
    }

    /**
     * Establece el valor del checkbox de manifiesto 1 en el estado del trámite 303.
     * @param checkboxManifiesto1 Valor del checkbox de manifiesto 1 a establecer.
     */
    setCheckboxManifiesto1Value(checkboxManifiesto1: boolean): void {
        this.update((state) => ({
            ...state,
            checkboxManifiesto1,
        }));
    }

    /**
     * Establece el valor del checkbox de manifiesto 2 en el estado del trámite 303.
     * @param checkboxManifiesto2 Valor del checkbox de manifiesto 2 a establecer.
     */
    setCheckboxManifiesto2Value(checkboxManifiesto2: boolean): void {
        this.update((state) => ({
            ...state,
            checkboxManifiesto2,
        }));
    }

    /**
     * Establece el representante legal en el estado del trámite 303.
     * @param representanteLegal Representante legal a establecer.
     */
    setRepresentanteLegal(representanteLegal: RepresentanteLegal): void {
        this.update((state) => ({
            ...state,
            representanteLegal,
        }));
    }

    /**
     * Establece la lista de enlaces operativos en el estado del trámite 303.
     * @param listaEnlaces Lista de enlaces operativos a establecer.
     */
    setListaEnlaces(listaEnlaces: EnlaceOperativo[]): void {
        this.update((state) => ({
            ...state,
            listaEnlaces,
        }));
    }

}