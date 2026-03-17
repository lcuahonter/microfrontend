import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    ViewChild,
} from "@angular/core";

export type AnchoModal = 'xs' | 'md' | 'lg' | 'xlg' | 'fit';
export type ButtonsPosition = 'start' | 'center' | 'end';

@Component({
    selector: 'libs-modal',
    templateUrl: './modal.component.html',
    styleUrl: './modal.component.scss',
    standalone: true
})
export class ModalComponent implements AfterViewInit {
    /**
     * Texto que se mostrará en el botón de cierre del modal.
     * Por defecto su valor es **"Cerrar"**.
     *
     * @property {string}
     */
    @Input() textoBotonCerrar: string = 'Cerrar';
    /**
     * Título que se mostrará en la barra superior del modal.
     *
     * @property {string}
     */
    @Input() tituloModal: string = '';
    /**
     * Indica si el modal debe permanecer fijo en pantalla.
     * Cuando está en `true`, el modal no se puede arrastrar.
     *
     * @property {boolean}
     */
    @Input() isFixed: boolean = false;
    /**
     * Posición en la que se mostrarán los botones del modal.
     * Puede ser: `'left' | 'center' | 'right'`.
     *
     * @property {ButtonsPosition}
     */
    @Input() buttonsPosition: ButtonsPosition = 'center';
    /**
     * Define el ancho del modal.
     * Puede ser `'xs' | 'md' | 'lg' | 'xlg' | 'fit'` para autoajuste o valores predeterminados definidos en el tipo `AnchoModal`.
     *
     * @property {AnchoModal}
     */
    @Input() anchoModal: AnchoModal = 'fit';
    /**
     * Evento emitido cuando el modal es cerrado.
     *
     * @event closed
     */
    @Output() closed = new EventEmitter<void>();
    /**
     * Referencia al contenedor principal del modal.
     * Utilizada para calcular posiciones y realizar el arrastre.
     *
     * @property {ElementRef<HTMLDivElement>}
     */
    @ViewChild('modalContainer') modal!: ElementRef<HTMLDivElement>;
    /**
     * Referencia a la barra superior del modal, usada como zona de arrastre.
     *
     * @property {ElementRef<HTMLDivElement>}
     */
    @ViewChild('dragHandle') titleBar!: ElementRef<HTMLDivElement>;
    /**
     * Indica si actualmente se está arrastrando el modal.
     *
     * @property {boolean}
     * @private
     */
    private isDragging = false;
    /**
     * Offset horizontal capturado al iniciar el arrastre del modal.
     *
     * @property {number}
     * @private
     */
    private offsetX = 0;
    /**
     * Offset vertical capturado al iniciar el arrastre del modal.
     *
     * @property {number}
     * @private
     */
    private offsetY = 0;

    /**
     * Decide si debe mostrarse el boton de cerrar posicionado en el pie del modal.
     */
    @Input() public showCloseButton: boolean = true;

    ngAfterViewInit(): void {
        if (!this.isFixed) {
            this.enableDragging();
        }
    }

    enableDragging(): void {
        const MODAL_CONTAINER_EL = this.modal.nativeElement;
        const MODAL_EL = MODAL_CONTAINER_EL.closest('.libs-modal') as HTMLElement;
        const HANDLE = this.titleBar.nativeElement;

        HANDLE.style.cursor = 'move';

        HANDLE.addEventListener('mousedown', (event: MouseEvent) => {
            if ((event.target as HTMLElement).tagName === 'BUTTON') { return }

            this.isDragging = true;

            const RECT = MODAL_EL.getBoundingClientRect();

            MODAL_EL.style.width = `${RECT.width}px`;
            MODAL_EL.style.maxWidth = 'none';

            this.offsetX = event.clientX - RECT.left;
            this.offsetY = event.clientY - RECT.top;

            MODAL_EL.style.left = `${RECT.left}px`;
            MODAL_EL.style.top = `${RECT.top}px`;
            MODAL_EL.style.transform = 'none';

            event.preventDefault();
        });

        window.addEventListener('mousemove', (event: MouseEvent) => {
            if (!this.isDragging) { return }

            const NEW_LEFT = event.clientX - this.offsetX;
            const NEW_TOP = event.clientY - this.offsetY;

            MODAL_EL.style.left = `${NEW_LEFT}px`;
            MODAL_EL.style.top = `${NEW_TOP}px`;
        });

        window.addEventListener('mouseup', () => {
            this.isDragging = false;
        });
    }


    close(): void {
        this.closed.emit();
    }
}