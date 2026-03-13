declare module 'bootstrap' {
    export interface ModalOptions {
        backdrop?: boolean | 'static';
        keyboard?: boolean;
        focus?: boolean;
        show?: boolean;
        // Puedes agregar más opciones según lo que soporte Bootstrap
    }

    export class Modal {
        constructor(element: HTMLElement, options?: ModalOptions);
        show(): void;
        hide(): void;
        dispose(): void;
    }

    // Aquí puedes agregar más clases y tipos según lo necesites.
}