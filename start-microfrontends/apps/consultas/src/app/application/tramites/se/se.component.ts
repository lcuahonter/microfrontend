import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { AlertComponent, ConfiguracionColumna, LoginQuery, TablaDinamicaComponent } from "@libs/shared/data-access-user/src";
import { Component, OnInit } from "@angular/core";
import { Subject, map, takeUntil } from "rxjs";
import { BusquedaTramite } from "../../core/models/tramites/se/response/busquedaResponse";
import { ConsultasSeService } from "../../shared/services/consultaSE.service";
import { Router } from "@angular/router";

@Component({
    standalone: true,
    templateUrl: './se.component.html',
    styleUrl: './se.component.scss',
    imports: [AlertComponent, ReactiveFormsModule, TablaDinamicaComponent]
})
export class seComponent implements OnInit {
    /*
     * Subject utilizado para emitir un valor y completar las suscripciones activas 
     * cuando el componente se destruye, evitando fugas de memoria.
     */
    private destroyNotifier$: Subject<void> = new Subject();
    /**
     * Arreglo que contiene los resultados de la búsqueda de trámites.
     *
     * Almacena la lista de objetos `BusquedaTramite` obtenidos a partir
     * de la consulta realizada al servicio y se utiliza como fuente
     * de datos para renderizar la tabla de resultados en la vista.
     */
    datosBusquedaTramites: BusquedaTramite[] = []

    /**
     * Configuración de las columnas que se mostrarán en la tabla de búsqueda de trámites.
     *
     * Define el encabezado visible de cada columna, la función `clave` utilizada
     * para obtener el valor desde el objeto `BusquedaTramite` y el orden en que
     * las columnas se renderizan dentro de la tabla.
     *
     * @property {ConfiguracionColumna<BusquedaTramite>[]} configuracionTabla
     * Arreglo que contiene la definición de cada columna de la tabla.
     */
    public configuracionTabla: ConfiguracionColumna<BusquedaTramite>[] = [
        {
            encabezado: 'Tipo trámite',
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
            encabezado: 'No. Resolución/Programa',
            clave: (tramite) => tramite.no_resolucion_programa,
            orden: 3
        },
        {
            encabezado: 'Fecha resolución',
            clave: (tramite) => tramite.fecha_resolucion,
            orden: 4
        },
        {
            encabezado: 'Sentido resolución',
            clave: (tramite) => tramite.sentido_resolucion,
            orden: 5
        }
    ]

    /**
     * Formulario reactivo utilizado para la búsqueda de trámites.
     *
     * Contiene los campos necesarios para filtrar la información.
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

    private rfcLogin: string = ''

    constructor(
        private fb: FormBuilder,
        private consultasSeService: ConsultasSeService,
        public loginQuery: LoginQuery,
        private router: Router,
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
                programa: [
                    '',
                    [
                        Validators.pattern(/^\d+$/),
                    ]
                ],
                ano: [
                    '',
                    [
                        Validators.maxLength(4)
                    ]
                ],
                resolucion: [
                    '',
                    [
                        Validators.maxLength(19)
                    ]
                ],
                certificado: [
                    '',
                    [
                        Validators.maxLength(50)
                    ]
                ]
            },
            {
                validators: this.alMenosUnCampoRequeridoValidator()
            }
        )
    }

    private alMenosUnCampoRequeridoValidator(): ValidatorFn {
        return (group: AbstractControl): ValidationErrors | null => {
            const FOLIO = group.get('folio')?.value;
            const PROGRAMA = group.get('programa')?.value;
            const ANO = group.get('ano')?.value;
            const RESOLUCION = group.get('resolucion')?.value;
            const CERTIFICADO = group.get('certificado')?.value;

            if (!FOLIO && !CERTIFICADO && !PROGRAMA && !ANO && !RESOLUCION) {
                return { alMenosUnoRequerido: true };
            }
            return null;
        };
    }

    tieneErrorAlMenosUno(): boolean {
        return Boolean(this.FormBusquedaTramite?.errors?.['alMenosUnoRequerido']);
    }

    buscarTramite(): void {
        this.alertaVisible = false;
        if (this.FormBusquedaTramite.invalid) {
            this.FormBusquedaTramite.markAllAsTouched();
            if (this.tieneErrorAlMenosUno()) {
                this.alertaVisible = true;
                this.mensajeAlerta = "Debe capturar al menos un dato para la búsqueda, ya sea Foli, No. de Registro de Verificación, Programa y Año o Número de certificado.";
                return;
            }
            return;
        }
        this.consultasSeService.obtenerTramites()
            .subscribe(
                (res) => { this.datosBusquedaTramites = res.data }
            )
    }

    seleccionarTramite(datosRow:BusquedaTramite): void {
        this.consultasSeService.obtenerDetallesTramite({
            roles_usuario: ["AdministradorDependencia", "Dictaminador"],
            user_name: "MAVL621207C95",
            folio: datosRow.folio_tramite
        }).subscribe({
            next : (res) => {
                    if (res.codigo.length > 0 && res.codigo !== "00") {
                    this.alertaVisible = true;
                    this.mensajeAlerta = `<div style="text-align: center;"><p>Corrija los siguientes errores:</p><ol style="color: red;"><li>    ${res.causa}</li></ol></div>`;
                    return;
                    }
                const { datos: DATA } = res;

                const FOLIO = DATA.num_folio_tramite;
                const TIPO_TRAMITE = String(DATA.id_tipo_tramite);
                const ID_SOLICITUD = String(DATA.id_solicitud);
                const ACRONIMO = DATA.acronimo;
                const DIAS_HABILES = String(DATA.dias_habiles_transcurridos);

                const DEPARTAMENTO = ACRONIMO.toLowerCase();

                const TIPO_SOLICITUD = DATA.tipo_solicitud || '';
                const TAREAS_ACTIVAS = DATA.tareas_activas || [];

                localStorage.setItem('folioTramite', FOLIO);
                localStorage.setItem('tipoTramite', TIPO_TRAMITE);
                localStorage.setItem('idSolicitud', ID_SOLICITUD);
                localStorage.setItem('acronimo', ACRONIMO);
                localStorage.setItem('tipoSolicitud', TIPO_SOLICITUD);
                localStorage.setItem('diaHabilesTranscurridos', DIAS_HABILES);
                localStorage.setItem('tareasActivas', JSON.stringify(TAREAS_ACTIVAS));

                this.router.navigate([`${DEPARTAMENTO}/datos-generales-tramite`]);
            }    
        })
    }

    obtenerRFCLogin(): void {
        this.loginQuery.selectLoginState$
            .pipe(
                takeUntil(this.destroyNotifier$),
                map((state) => {
                    this.rfcLogin = state.rfc
                })
            )
            .subscribe();
    }

    get folio(): AbstractControl | null {
        return this.FormBusquedaTramite.get('folio')
    }
    get programa(): AbstractControl | null {
        return this.FormBusquedaTramite.get('programa')
    }
    get ano(): AbstractControl | null {
        return this.FormBusquedaTramite.get('ano')
    }
    get resolucion(): AbstractControl | null {
        return this.FormBusquedaTramite.get('resolucion')
    }
    get certificado(): AbstractControl | null {
        return this.FormBusquedaTramite.get('certificado')
    }
    /**
     * Hook del ciclo de vida de Angular.
     *
     * Se ejecuta al inicializar el componente y se encarga
     * de crear el formulario de búsqueda.
     */
    ngOnInit(): void {
        this.obtenerRFCLogin()
        this.inicializarForm()
    }

}