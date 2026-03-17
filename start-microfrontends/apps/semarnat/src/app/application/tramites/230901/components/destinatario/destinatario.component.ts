import { Component, OnInit, inject, input, output, signal } from '@angular/core';

import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal';

import { DestinatarioConfiguracionItem } from '../../enum/destinatario-tabla.enum';
import { Tramite230901Store } from '../../estados/store/tramite230901.store';
import { DatosTramite230902Service } from '../../services/datos-tramite-230901.service';
import { SHARED_MODULES } from '../../shared-imports';
import { UtilidadesService } from '../../services/utilidades.service';

/*
 * Componente que gestiona los datos de la solicitud, incluyendo la configuración de formularios,
 * tablas dinámicas y la interacción con servicios relacionados con autorizaciones de vida silvestre.
 */
@Component({
    selector: 'destinatario',
    templateUrl: './destinatario.component.html',
    standalone: true,
    imports: [SHARED_MODULES]
})
export class DestinatarioComponent implements OnInit {
    /** 
  * Inyección de dependencia para construir formularios reactivos. 
 */
    private formBuilder = inject(FormBuilder);
    /**
     * Inyección de dependencia de servicio para invocar el storage.
     */
    public store = inject(Tramite230901Store);
    /**
   * Utilidades a reutilizar dentro del tramite
   */
    public utils = inject(UtilidadesService);

    /** Datos de Catalogos */
    public datosService = inject(DatosTramite230902Service);

    /** 
    * Inicializa el estado del formulario 
    */
    public solicitudState = this.utils.solicitud;

    /** 
     * Estado actual de la consulta gestionado por el store `ConsultaioQuery`. 
    */
    public consultaState = this.utils.consultaState;

    /** Referencia al elemento del modal de Bootstrap. */
    modalRef!: BsModalRef | null;

    /** Formulario reactivo para capturar los datos generales originales del destinatario. */
    formularioGeneral!: FormGroup;

    /**
     * @property {Array<{label: string, value: string}>} radioPatentes
     * Opciones para el componente de radio buttons que permite seleccionar entre patentes nacionales o extranjeras.
     * Define las etiquetas y valores disponibles para la selección.
     */
    radioPatentes = [
        { label: 'Nacional', value: 'nacional' },
        { label: 'Extranjero', value: 'extranjero' }
    ];

    /** Indica si el formulario está en modo solo lectura. */
    esFormularioSoloLectura = signal<boolean>(this.consultaState().readonly);

    /** Evento de Cancelar */
    cancelEvent = output<void>();

    /** Evento de Cancelar */
    onClose = output<DestinatarioConfiguracionItem[]>();

    disableLabels = signal<string[]>(this.radioPatentes.map(item => item.label));

    esImportacion = signal<boolean>(this.solicitudState().cve_clasificacion_regimen === '01');

    /**  Lista de filas seleccionadas en la tabla de mercancías. */
    listaFilaSeleccionada = input<DestinatarioConfiguracionItem[]>([]);

    /** Puede definir explícitamente el tipo de acceso de control dinámico */
    get formControls(): { [key: string]: AbstractControl } { return this.formularioGeneral.controls; };
    /** Obtiene el grupo de formulario de la ciudad */
    get ciudad() { return this.formControls['ciudad'] };
    /** Obtiene el grupo de formulario de la cve entidad federativa */
    get entidadFederativa() { return this.formControls['cve_entidad_federativa'] };
    /** Obtiene el grupo de formulario de la cve Pais*/
    get pais() { return this.formControls['cve_pais'] };
    /** Obtiene el grupo de formulario del codigo postal */
    get codigoPostal() { return this.formControls['codigo_postal'] };
    /** Obtiene el grupo de formulario del codigo postal */
    get domicilio() { return this.formControls['domicilio'] };

    /**  Método del ciclo de vida de Angular que se ejecuta al inicializar el componente. */
    ngOnInit(): void {
        this.crearNuevoFormularioGeneral();
        if (this.esImportacion()) {
            this.pais.patchValue('MEX');
            this.ciudad.clearValidators();
            this.ciudad.updateValueAndValidity({ emitEvent: false });
        } else {
            this.pais.patchValue('')
            this.entidadFederativa.clearValidators();
            this.entidadFederativa.updateValueAndValidity({ emitEvent: false });
        }
    }

    /**
         * Crea un nuevo formulario de mercancía con valores predeterminados o datos proporcionados.
         * Si se proporcionan datos, estos sobrescriben los valores predeterminados.
         */
    crearNuevoFormularioGeneral(): void {
        this.formularioGeneral = this.formBuilder.group({
            codigo_postal: ['', [Validators.required, Validators.maxLength(16)]],
            cve_pais: ['', [Validators.required]],
            cve_entidad_federativa: ['', [Validators.required]],
            domicilio: ['', [Validators.required, Validators.maxLength(1000)]],
            ciudad: ['', [Validators.required]]
        })

        const OBJECT_LENGTH: number = this.listaFilaSeleccionada().length;

        if (OBJECT_LENGTH > 0) {
            const [FILA_SELECCIONADA] = this.listaFilaSeleccionada();
            this.utils.setFormValores(this.formularioGeneral, FILA_SELECCIONADA)
        }
    }

    cerrarModal(): void {
        this.modalRef?.hide();
        this.cancelEvent.emit();
    }

    enviarFormularioGeneral(): void {

        if (this.formularioGeneral.invalid) {
            this.formularioGeneral.markAllAsTouched();
            return;
        }

        const DATOS_FORMULARIO_GENERAL = [this.formularioGeneral.value].map((item) => ({
            ...item,
            es_nuevo: true,
            pais: this.datosService.listaPaises().find((list) => list.clave === item.cve_pais)?.descripcion || '',
            id_direccion: ''
        }))

        this.store.setDestinatario(DATOS_FORMULARIO_GENERAL);
        this.onClose.emit(DATOS_FORMULARIO_GENERAL);
        this.cerrarModal()
    }

}
