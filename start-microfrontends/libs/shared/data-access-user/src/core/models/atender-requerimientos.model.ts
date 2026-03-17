export interface Tabulaciones {
    titulo: string;
    id: string;
    disabled: boolean
}
export interface AccuseComponentes {
    tramite: number;
    listaComponentes: ListaComponentes[];
}
export interface ListaComponentes {
    id: string;
    componentPath: () => Promise<unknown>;
    componentName: string;
}