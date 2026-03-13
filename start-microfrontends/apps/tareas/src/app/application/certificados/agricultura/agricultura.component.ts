import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { AlertComponent, ConfiguracionColumna, TablaDinamicaComponent } from "@libs/shared/data-access-user/src";
import { Component, OnInit } from "@angular/core";
import { AgriculturaService } from "../../core/services/certificados/agricultura.service";
import { ConsultaTramiteAgricultura } from "../../core/models/certificados/agricultura/response/consulta-tramite";

@Component({
    standalone: true,
    templateUrl: './agricultura.component.html',
    styleUrl: './agricultura.component.scss',
    imports: [TablaDinamicaComponent, ReactiveFormsModule, AlertComponent],
})
export class AgriculturaComponent implements OnInit {
    /**
     * Almacena los datos resultantes de las peticiones de consulta de trámites.
     *
     * Contiene la lista de trámites obtenidos desde el servicio y es utilizada
     * como fuente de datos para la visualización en la tabla.
     *
     * @property {ConsultaTramiteAgricultura[]} datosConsultaTramite
     */
    public datosConsultaTramite: ConsultaTramiteAgricultura[] = []
    /**
     * Configuración de las columnas que se mostrarán en la tabla de consulta de trámites.
     *
     * Define el encabezado visible de cada columna, la clave utilizada para obtener
     * el valor desde el objeto `ConsultaTramiteAgricultura` y el orden en que se
     * renderizan dentro de la tabla.
     *
     * @property {ConfiguracionColumna<ConsultaTramiteAgricultura>[]} configuracionTabla
     * Arreglo que contiene la definición de cada columna de la tabla.
     */
    public configuracionTabla: ConfiguracionColumna<ConsultaTramiteAgricultura>[] = [
        {
            encabezado: "Tipo trámite",
            clave: (tramite) => tramite.tipo_tramite,
            orden: 0
        },
        {
            encabezado: 'Folio trámite',
            clave: (tramite) => tramite.folio_tramite,
            orden: 1
        },
        {
            encabezado: 'Estatus trámite',
            clave: (tramite) => tramite.estatus_tramite,
            orden: 2
        },
        {
            encabezado: 'No. Certificado',
            clave: (tramite) => tramite.num_certificado,
            orden: 3
        },
        {
            encabezado: 'Fecha resolución',
            clave: (tramite) => tramite.fecha_resolucion,
            orden: 4
        },
        {
            encabezado: 'Sentido de la resolución',
            clave: (tramite) => tramite.sentido_resolucion,
            orden: 5
        }
    ]
    /**
     * Formulario reactivo utilizado para la búsqueda de trámites.
     *
     * Contiene los campos necesarios para filtrar la información,
     * como folio y certificado.
     */
    public FormBusquedaTramite!: FormGroup;
    /**
     * Indica si la alerta debe mostrarse en la vista.
     *
     * Controla la visibilidad del componente o mensaje de alerta.
     *
     * @default false
     */
    public alertaVisible: boolean = false;

    /**
     * Mensaje que se mostrará dentro de la alerta.
     *
     * Contiene el texto informativo, de error o de advertencia
     * que se desea presentar al usuario.
     *
     * @default ""
     */
    public mensajeAlerta: string = "";

    /**
     * Clase CSS asociada a la alerta.
     *
     * Se utiliza para definir el estilo visual de la alerta
     * (por ejemplo: alert-info, alert-danger).
     *
     * @default ""
     */
    public claseAlerta: string = "alert-danger";

    /**
     * Constructor.
     * @param fb - FormBuilder para crear formularios reactivos.
     */
    constructor(
        private fb: FormBuilder,
        private agriculturaService: AgriculturaService
    ) { }
    /**
     * Inicializa el formulario de búsqueda de trámites.
     *
     * Define la estructura del formulario y sus controles,
     * estableciendo valores iniciales vacíos.
     */
    private inicializarForm(): void {
        this.FormBusquedaTramite = this.fb.group(
            {
                folio: [
                    '',
                    [
                        Validators.pattern(/^\d+$/),
                        Validators.minLength(25)
                    ]
                ],
                certificado: [
                    '',
                    [
                        Validators.pattern(/^\d+$/)
                    ]
                ]
            },
            {
                validators: this.alMenosUnCampoRequeridoValidator()
            }
        );
    }

    /**
     * Hook del ciclo de vida de Angular.
     *
     * Se ejecuta al inicializar el componente y se encarga
     * de crear el formulario de búsqueda.
     */
    ngOnInit(): void {
        this.inicializarForm()
    }
    /**
     * Ejecuta la búsqueda de trámites de agricultura.
     *
     * Consume el servicio de agricultura para obtener la lista de trámites
     * y asigna la información recibida a la variable de datos de consulta,
     * la cual normalmente se utiliza para mostrar los resultados en pantalla.
     */
    public buscarTramite(): void {
        this.alertaVisible = false;
        if (this.FormBusquedaTramite.invalid) {
            this.FormBusquedaTramite.markAllAsTouched();
            if (this.tieneErrorAlMenosUno()) {
                this.alertaVisible = true;
                this.mensajeAlerta = "Debe capturar al menos un dato para la búsqueda, ya sea Folio, No. de Certificado o ambos"
                return;
            }
            return;
        }
        this.agriculturaService.obtenerTramites()
            .subscribe(
                (res) => { this.datosConsultaTramite = res.data }
            )
    }


    private alMenosUnCampoRequeridoValidator(): ValidatorFn {
        return (group: AbstractControl): ValidationErrors | null => {
            const FOLIO = group.get('folio')?.value;
            const CERTIFICADO = group.get('certificado')?.value;

            if (!FOLIO && !CERTIFICADO) {
                return { alMenosUnoRequerido: true };
            }

            return null;
        };
    }

    tieneErrorAlMenosUno(): boolean {
        return Boolean(this.FormBusquedaTramite?.errors?.['alMenosUnoRequerido']);
    }

    get folio(): AbstractControl | null {
        return this.FormBusquedaTramite.get('folio');
    }

    get certificado(): AbstractControl | null {
        return this.FormBusquedaTramite.get('certificado');
    }

}