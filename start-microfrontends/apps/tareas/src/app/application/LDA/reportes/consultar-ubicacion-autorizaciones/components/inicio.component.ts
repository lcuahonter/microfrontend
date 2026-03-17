import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { ConfiguracionColumna, TablaDinamicaComponent } from "@libs/shared/data-access-user/src";
import { UbicacionDeAutorizacion } from "../../../../core/models/lda/reportes/consultar-ubicacion-autorizaciones/response/ubicacion";

@Component({
    standalone: true,
    templateUrl: './inicio.component.html',
    styleUrl: './inicio.component.scss',
    imports: [ReactiveFormsModule, TablaDinamicaComponent]
})
export class ConsultarUbicacionAutorizacionesComponent implements OnInit {
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
    /**
     * Patron de validación para admitir solo numeros y letras con soporte a letras en español
     */
    readonly patronNumerosLetras = /^[\p{L}\p{N}]+$/u
    /**
     * Indica si el acordeón del componente se encuentra colapsado.
     *
     * Controla la visibilidad del contenido asociado al acordeón.
     *
     * @default false
     */
    public collapsed: boolean = false;
    /**
     * Indica si la opción de domicilio se encuentra activa.
     *
     * Se utiliza para mostrar u ocultar los campos relacionados
     * con la captura de domicilio.
     *
     * @default false
     */
    public domicilioActivo: boolean = false;
    /**
     * Indica si la opción de ubicación se encuentra activa.
     *
     * Se utiliza para mostrar u ocultar los campos relacionados
     * con la captura de ubicación.
     *
     * @default false
     */
    public ubicacionActivo: boolean = false;
    /**
     * Configuración de las columnas que se mostrarán en la tabla
     * de ubicaciones de autorización.
     *
     * Define el encabezado visible de cada columna, la función
     * utilizada para obtener el valor desde el objeto
     * `UbicacionDeAutorizacion` y el orden de renderizado.
     *
     * @property {ConfiguracionColumna<UbicacionDeAutorizacion>[]} configuracionTabla
     * Arreglo que contiene la definición de cada columna.
     */
    public configuracionTabla: ConfiguracionColumna<UbicacionDeAutorizacion>[] = [
        {
            encabezado: 'RFC',
            clave: (data) => data.rfc,
            orden: 1
        },
        {
            encabezado: 'Aduana',
            clave: (data) => data.aduana,
            orden: 2
        },
        {
            encabezado: 'Ubicación',
            clave: (data) => data.ubicacion,
            orden: 3
        }
    ]

    public seleccionados : UbicacionDeAutorizacion[] = []
    /**
     * Constructor del componente.
     *
     * @param formBuilder Servicio FormBuilder utilizado para la
     * creación y gestión de formularios reactivos.
     */
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
     * Maneja el cambio de selección del tipo de LDA.
     *
     * Actualiza el valor del formulario y controla la activación
     * de las secciones de ubicación o domicilio según la opción
     * seleccionada.
     *
     * @param valor Tipo de LDA seleccionado ("UBICACION" | "DOMICILIO").
     * @param event Evento del input tipo checkbox.
     */
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
     * Colapsa o expande el acordeón del componente.
     *
     * Alterna el estado de la propiedad `collapsed` para mostrar
     * u ocultar el contenido asociado.
     */
    public colapsarAcordion(): void {
        this.collapsed = !this.collapsed
    }

    public filaSeleccionada(event: UbicacionDeAutorizacion): void {
        this.seleccionados.push(event)
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