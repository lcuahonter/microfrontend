import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { ConfiguracionColumna, InputFecha, InputFechaComponent, TablaDinamicaComponent } from "@libs/shared/data-access-user/src";
import { DetalleAutorizacion } from "../../../../core/models/lda/reportes/consultar-detalle-autorizaciones/response/detalle-autorizacion";

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
    templateUrl: './inicio.component.html',
    styleUrl: './inicio.component.scss',
    imports: [ReactiveFormsModule, InputFechaComponent, TablaDinamicaComponent]
})
export class ConsultarDetalleAutorizacionesComponent implements OnInit {
    /**
     * Formulario reactivo utilizado para la consulta de trámites.
     *
     * Contiene los campos necesarios para filtrar la información.
     */
    public FormConsulta!: FormGroup;
    /**
     * Patron de validacion para el rfc
     */
    readonly patronRFC = "^(([A-ZÑ&]{3})([0-9]{2})([0][13578]|[1][02])(([0][1-9]|[12][\\d])|[3][01])([A-Z0-9]{3}))|(([A-ZÑ&]{3})([0-9]{2})([0][13456789]|[1][012])(([0][1-9]|[12][\\d])|[3][0])([A-Z0-9]{3}))|(([A-ZÑ&]{3})([02468][048]|[13579][26])[0][2]([0][1-9]|[12][\\d])([A-Z0-9]{3}))|(([A-ZÑ&]{3})([0-9]{2})[0][2]([0][1-9]|[1][0-9]|[2][0-8])([A-Z0-9]{3}))$"
    readonly patronNumerosLetras = /^[\p{L}\p{N}]+$/u

    /**
     * Configuración para el campo de fecha inicial.
     */
    readonly fechaInicio = {
        labelNombre: 'Fecha inicio vigencia:',
        habilitado: true,
        required: false,
    };
    /**
     * Configuración para el campo de fecha inicial.
     */
    readonly fechaFin = {
        labelNombre: 'Fecha fin vigencia:',
        habilitado: true,
        required: false,
    };
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

    public collapsed: boolean = false;

    public domicilioActivo: boolean = false;

    public ubicacionActivo: boolean = false;

    public configuracionTabla: ConfiguracionColumna<DetalleAutorizacion>[] = [
        {
            encabezado: 'Folio del trámite',
            clave: (data) => data.folio_tramite,
            orden: 1
        },
        {
            encabezado: 'Tipo trámite',
            clave: (data)=> data.tipo_tramite,
            orden: 2
        },
        {
            encabezado: 'RFC',
            clave: (data)=> data.rfc,
            orden: 3
        },
        {
            encabezado: 'Vigencia',
            clave: (data)=> data.vigencia,
            orden: 4
        }
    ]

    constructor(
        private formBuilder: FormBuilder
    ) { }
    /**
     * Inicializa el formulario.
     *
     * Define la estructura del formulario y sus controles,
     * estableciendo valores iniciales vacíos.
     */
    private inicializarForm(): void {
        this.FormConsulta = this.formBuilder.group(
            {
                rfc_solicitante: ['', [Validators.pattern(this.patronRFC), Validators.maxLength(13)]],
                aduana: [],
                seccion_aduanera: [],
                fecha_inicio_vigencia: [''],
                fecha_fin_vigencia: [''],
                tipo_tramite: [],
                estado: [],
                lda: [],
                calle: ['', [Validators.pattern(this.patronNumerosLetras), Validators.maxLength(100)]],
                numero_exterior: ["", [Validators.pattern(this.patronNumerosLetras), Validators.maxLength(55)]],
                numero_interior: ["", [Validators.pattern(this.patronNumerosLetras), Validators.maxLength(55)]],
                codigo_postal: ["", [Validators.pattern(this.patronNumerosLetras), Validators.maxLength(12)]],
                colonia: ["", [Validators.pattern(this.patronNumerosLetras), Validators.maxLength(120)]],
                pais: [],
                enitidad: [],
                municipio: [],
                localidad: [],
                telefono: ["", [Validators.pattern(/^[0-9]+$/), Validators.maxLength(30)]],
                ubicacion: []
            }
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

    public colapsarAcordion(): void {
        this.collapsed = !this.collapsed
    }

    public cambiarLDA(
        valor: "UBICACION" | "DOMICILIO",
        event: Event
    ): void {
        const CHECKED = (event.target as HTMLInputElement).checked;

        if (!CHECKED) {
            this.FormConsulta.patchValue({ lda: null });
            this.ubicacionActivo = false;
            this.domicilioActivo = false;
            return;
        }

        this.FormConsulta.patchValue({ lda: valor });

        this.ubicacionActivo = valor === "UBICACION";
        this.domicilioActivo = valor === "DOMICILIO";
    }


    /**
     * Obtiene el tipo de ubicación
     */
    get lda(): 'UBICACION' | 'DOMICILIO' | null {
        return this.FormConsulta.get('lda')?.value;
    }
    /**
     * actualiza el valor del tipo de ubicacion en el formulario
     */
    set lda(valor: 'UBICACION' | 'DOMICILIO') {
        this.FormConsulta.patchValue({ lda: valor });
    }

        /**
     * Obtiene el control del formulario correspondiente al RFC del solicitante.
     */
    get rfcSolicitante(): AbstractControl | null {
        return this.FormConsulta.get('rfc_solicitante')
    }
    /**
     * Obtiene el control del formulario correspondiente a la calle.
     */
    get calle(): AbstractControl | null {
        return this.FormConsulta.get('calle')
    }
    /**
     * Obtiene el control del formulario correspondiente al número exterior.
     */
    get numeroExterior(): AbstractControl | null {
        return this.FormConsulta.get('numero_exterior')
    }
    /**
     * Obtiene el control del formulario correspondiente al número interior.
     */
    get numeroInterior(): AbstractControl | null {
        return this.FormConsulta.get('numero_interior')
    }
    /**
     * Obtiene el control del formulario correspondiente al código postal.
     */
    get codigoPostal(): AbstractControl | null {
        return this.FormConsulta.get('codigo_postal')
    }
    /**
     * Obtiene el control del formulario correspondiente a la colonia.
     */
    get colonia(): AbstractControl | null {
        return this.FormConsulta.get('colonia')
    }
    /**
     * Obtiene el control del formulario correspondiente al teléfono.
     */
    get telefono(): AbstractControl | null {
        return this.FormConsulta.get('telefono')
    }

    ngOnInit(): void {
        this.inicializarForm()
    }
}