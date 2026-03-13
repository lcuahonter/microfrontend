import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { ConfiguracionColumna, InputFecha, InputFechaComponent, TablaDinamicaComponent } from "@libs/shared/data-access-user/src";
import { AutorizacionLDA } from "../../core/models/lda/consultar-autorizaciones-por-autoridad/response/autorizacionesLDA";
import { Tracking } from "../../core/models/lda/consultar-autorizaciones-por-autoridad/response/tracking";

/**
 * Configuración para el campo de fecha inicial.
 */
export const FECHA_INICIO = {
    labelNombre: 'Fecha inicio vigencia:',
    habilitado: true,
    required: false,
};
/**
 * Configuración para el campo de fecha inicial.
 */
export const FECHA_FIN = {
    labelNombre: 'Fecha fin vigencia:',
    habilitado: true,
    required: false,
};

@Component({
    standalone: true,
    templateUrl: './consultar-autorizaciones.component.html',
    styleUrl: './consultar-autorizaciones.component.scss',
    imports: [ReactiveFormsModule, InputFechaComponent, TablaDinamicaComponent]
})
export class ConsultaAutorizacionesPorAutoridadComponent implements OnInit {
    /**
     * Formulario reactivo utilizado para la búsqueda de trámites.
     *
     * Contiene los campos necesarios para filtrar la información.
     */
    public FormConsulta!: FormGroup;
    /**
     * Patron de validacion para el rfc
     */
    readonly patronRFC = /^([A-ZÑ\x26]{3,4})?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01]))?([A-Z\d]{2})?([A\d])?$/
    /**
     * Configuración del input de fecha de inicio.
     *
     * Define las propiedades y comportamiento del componente
     * de fecha utilizado para capturar la fecha inicial.
     */
    public fechaInicioInput: InputFecha = FECHA_INICIO;
    /**
     * Configuración del input de fecha final.
     *
     * Define las propiedades y comportamiento del componente
     * de fecha utilizado para capturar la fecha final.
     */
    public fechaFinalInput: InputFecha = FECHA_FIN;

    public datosAutorizacionLDA: AutorizacionLDA[] = []

    public configuracionTablaAutorizacionLDA: ConfiguracionColumna<AutorizacionLDA>[] = [
        {
            encabezado: 'Folio VUCEM',
            clave: (data) => data.folio_vucem,
            orden: 0
        },
        {
            encabezado: 'Tipo de tramite',
            clave: (data) => data.tipo_tramite,
            orden: 1
        },
        {
            encabezado: 'RFC',
            clave: (data) => data.rfc,
            orden: 2
        },
        {
            encabezado: 'Resolución',
            clave: (data) => data.resolucion,
            orden: 3
        },
        {
            encabezado: 'Estado Actual',
            clave: (data) => data.estado_actual,
            orden: 4
        },
        {
            encabezado: 'Vigencia',
            clave: (data) => data.vigencia,
            orden: 5
        }
    ]

    public datosTablaTracking: Tracking[] = []

    public configuracionTablaTracking: ConfiguracionColumna<Tracking>[] = [
        {
            encabezado: 'Folio VUCEM',
            clave: (data) => data.folio_vucem,
            orden: 1
        },
        {
            encabezado: 'tipo de trámaite',
            clave: (data) => data.tipo_tramite,
            orden: 2
        },
        {
            encabezado: 'RFC',
            clave: (data) => data.rfc,
            orden: 3
        },
        {
            encabezado: 'Resolución',
            clave: (data) => data.resolucion,
            orden: 4
        },
        {
            encabezado: 'Estado actual',
            clave: (data) => data.estado_actual,
            orden: 5
        },
        {
            encabezado: 'Aduana',
            clave: (data) => data.aduana,
            orden: 6
        },
        {
            encabezado: 'Vigencia',
            clave: (data) => data.vigencia,
            orden: 7
        }
    ]

    public collapsed: boolean = false;

    constructor(
        private fb: FormBuilder,
    ) { }

    /**
     * Inicializa el formulario de consultar autorizaciones.
     *
     * Define la estructura del formulario y sus controles,
     * estableciendo valores iniciales vacíos.
     */
    private inicializarForm(): void {
        this.FormConsulta = this.fb.group(
            {
                tipo_ubicacion: [null],
                fecha_inicio_vigencia: [''],
                fecha_fin_vigencia: [''],
                mostrar_lda: [false],
                folio_vucem: ['', [Validators.pattern(/^[0-9]*$/), Validators.minLength(25)]],
                folio_interno: ['', [Validators.pattern(/^[a-zA-Z0-9]*$/), Validators.maxLength(16)]],
                tipo_tramite: [''],
                estado: [''],
                rfc_solicitante: ['', [Validators.pattern(this.patronRFC), Validators.maxLength(13)]],
                rfc_tercero: ['', [Validators.pattern(this.patronRFC), Validators.maxLength(13)]],
                patente: ['', [Validators.pattern(/^[0-9]*$/), Validators.maxLength(4)]],
                aduana: [''],
                seccion_aduanera: [''],
                capitulo_fraccion: [''],
                fraccion_arancelaria: ['']
            },
        )
    }
    /**
     * Maneja el cambio de la fecha de inicio.
     *
     * Actualiza el valor de fecha de inicio en el formulario con el nuevo
     * valor seleccionado por el usuario.
     *
     * @param nuevoValor Nueva fecha seleccionada.
     */
    public cambioFechaInicio(nuevoValor: string): void {
        this.FormConsulta.patchValue({ fecha_inicio_vigencia: nuevoValor })
    }
    /**
     * Maneja el cambio de la fecha de inicio.
     *
     * Actualiza el valor de fecha de inicio en el formulario con el nuevo
     * valor seleccionado por el usuario.
     *
     * @param nuevoValor Nueva fecha seleccionada.
     */
    public cambioFechaFin(nuevoValor: string): void {
        this.FormConsulta.patchValue({ fecha_fin_vigencia: nuevoValor })
    }
    get folioVucem(): AbstractControl | null {
        return this.FormConsulta.get('folio_vucem')
    }
    get folioInterno(): AbstractControl | null {
        return this.FormConsulta.get('folio_interno')
    }
    get rfcSolicitante(): AbstractControl | null {
        return this.FormConsulta.get('rfc_solicitante')
    }
    get rfcTercero(): AbstractControl | null {
        return this.FormConsulta.get('rfc_tercero')
    }
    get patente(): AbstractControl | null {
        return this.FormConsulta.get('patente')
    }

    /**
     * Obtiene el tipo de ubicación
     */
    get tipoUbicacion(): 'UBICACION' | 'DOMICILIO' | null {
        return this.FormConsulta.get('tipo_ubicacion')?.value;
    }
    /**
     * actualiza el valor del tipo de ubicacion en el formulario
     */
    set tipoUbicacion(valor: 'UBICACION' | 'DOMICILIO') {
        this.FormConsulta.patchValue({ tipo_ubicacion: valor });
    }

    public colapsarAcordion(): void {
        this.collapsed = !this.collapsed
    }

    ngOnInit(): void {
        this.inicializarForm()
    }
}