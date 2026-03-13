import { AlertComponent, ConfiguracionColumna, InputFecha, InputFechaComponent, LoginQuery, TablaAcciones, TablaDinamicaComponent } from "@libs/shared/data-access-user/src";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ReplaySubject, map, takeUntil } from "rxjs";
import { Router, RouterModule } from "@angular/router";
import { AcusesYResolucionesFolioTramite } from "../models/acuses-y-resoluciones-folio-tramite.model";
import { AcusesYResolucionesService } from "../services/acuses-y-resoluciones.service";
import { CommonModule } from "@angular/common";

/**
 * Configuración para el campo de fecha inicial.
 */
export const FECHA_INICIO = {
    labelNombre: 'Fecha inicial',
    habilitado: true,
    required: false,
};

/**
 * Configuración para el campo de fecha final.
 */
export const FECHA_FINAL = {
    labelNombre: 'Fecha final',
    habilitado: true,
    required: false,
};

function obtenerRangoDeFechas(): [string, string] {
    const ACTUAL = new Date();

    // Fecha final = hoy + 1 día
    const FECHA_FINAL = new Date(ACTUAL);
    FECHA_FINAL.setDate(FECHA_FINAL.getDate() + 1);

    // Fecha inicial = fechaFinal - rango de días
    const FECHA_INICIO = new Date(FECHA_FINAL);
    FECHA_INICIO.setDate(FECHA_INICIO.getDate() - 3);

    // Formateo YYYY-MM-DD
    const FECHA_INICIO_FORMATED = FECHA_INICIO.toISOString().split("T")[0];
    const FECHA_FINAL_FORMATED = FECHA_FINAL.toISOString().split("T")[0];

    return [FECHA_INICIO_FORMATED, FECHA_FINAL_FORMATED];
}

/**
 * Convierte una fecha en formato DD/MM/YYYY a YYYY-MM-DD.
 * Valida la estructura y que la fecha sea correcta.
 * 
 * @param fechaStr Fecha en string: DD/MM/YYYY
 * @returns Fecha en formato YYYY-MM-DD
 */
export function convertirFechaDDMMYYYY(fechaStr: string): string {
    // Validación del patrón
    const REGEX = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const MATCH = fechaStr.match(REGEX);

    if (!MATCH) {
        return fechaStr;
    }

    const [, DD, MM, YYYY] = MATCH;

    // Crear fecha válida
    const FECHA = new Date(Number(YYYY), Number(MM) - 1, Number(DD));

    // Validar que la fecha sea real
    if (
        FECHA.getFullYear() !== Number(YYYY) ||
        FECHA.getMonth() !== Number(MM) - 1 ||
        FECHA.getDate() !== Number(DD)
    ) {
        throw new Error(`Fecha inválida: ${fechaStr}`);
    }

    // Formato final YYYY-MM-DD
    return FECHA.toISOString().split("T")[0];
}


/**
 * Componente para gestionar la búsqueda de acuses y resoluciones por folio de trámite de la vista solicitudes subsecuentes.
*/

@Component({
    selector: 'acuses-y-resoluciones-busqueda-folio',
    standalone: true,
    templateUrl: './acuses-y-resoluciones-busqueda-folio.component.html',
    styleUrl: './acuses-y-resoluciones-busqueda-folio.component.scss',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        InputFechaComponent,
        RouterModule,
        AlertComponent,
        TablaDinamicaComponent
    ]
})
export class AcusesYResolucionesBusquedaFolioComponent implements OnInit, OnDestroy {
    /**
   * @property {boolean} alertVisible
   * Maneja la visivilidad de la alerta
   */
    public alertVisible: boolean = false;
    /**
   * @property {string} classAlert
   * Clase CSS usada para mostrar alertas de Error.
   */
    public classAlert = 'alert-info';
    /*RFC de la persona loggeada */
    public rfcValor: string = '';

    /**
     * @property {string} alertMessage
     * Mensaje de alerta para la notificación
     */

    public alertMessage: string = ''

    /**
    * Notificador para destruir las suscripciones.
    */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /**
     * Formulario para la búsqueda de acuses y resoluciones.
     */
    public formBusqueda!: FormGroup;
    /**
    * Configuración del campo de fecha inicial.
    */
    public fechaInicioInput: InputFecha = FECHA_INICIO;
    /**
    * Configuración del campo de fecha final.
    */
    public fechaFinalInput: InputFecha = FECHA_FINAL;
    /* Acciones disponibles en la tabla (editar, etc.) */
    public tablaAcciones: TablaAcciones[] = [TablaAcciones.EDITAR];
    /**
   * Datos configurados para la tabla.
   */
    public configuracionTablaDatos: Array<AcusesYResolucionesFolioTramite> = []

    /**
    * Ruta para la navegación.
    */
    public ruta: string = '';

    /**
      * Constructor de la clase.
      * @param formBuilder Servicio para construir formularios reactivos.
      * @param router Servicio para la navegación entre rutas.
      */
    public constructor(
        protected readonly formBuilder: FormBuilder,
        public router: Router,
        public acusesYResolucionesService: AcusesYResolucionesService,
        public loginQuery: LoginQuery
    ) {
        // El constructor se utiliza para la inyección de dependencias.
    }


    /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   *
   * - Configura el formulario reactivo `formBusqueda` con los campos:
   *   - `solicitante`: Campo de texto vacío.
   *   - `rfc`: Campo de texto vacío.
   *   - `folio`: Campo prellenado con un valor predeterminado y habilitado.
   *   - `fechaInicial`: Campo vacío y habilitado.
   *   - `fechaFinal`: Campo vacío y habilitado.
   */
    ngOnInit(): void {
        this.loginQuery.selectLoginState$
            .pipe(
                takeUntil(this.destroyed$),
                map((state) => {
                    this.rfcValor = state.rfc
                })
            )
            .subscribe();
        this.formBusqueda = this.formBuilder.group({
            solicitante: 'INTEGRADORA DE URBANIZACIONES SIGNUM, S DE RL DE CV',
            rfc: '',
            folio: [
                { value: '', disabled: false },
                [Validators.maxLength(25), Validators.pattern(/^[0-9]*$/)],
            ],
            fechaInicial: [{ value: '', disabled: false }],
            fechaFinal: [{ value: '', disabled: false }],
        })
        const RANGO_DE_FECHAS = obtenerRangoDeFechas()
        this.getDatosAcusesYResolucionesPorFolioYFecha("", RANGO_DE_FECHAS[0], RANGO_DE_FECHAS[1])
    }
    /**
    * Método que se ejecuta al destruir el componente.
    * Libera los recursos y completa las suscripciones.
    */
    ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
    /**
     * Metodo para obtener el numero de folio del input.
     */
    public get folio(): FormControl {
        return this.formBusqueda.get('folio') as FormControl
    }
    getFechaInicial(): string {
        return this.formBusqueda.get('fechaInicial')?.value
    }
    getFechaFinal(): string {
        return this.formBusqueda.get('fechaFinal')?.value
    }
    /**
   * Maneja el cambio en el campo de fecha inicial.
   * @param nuevo_valor Nuevo valor para la fecha inicial.
   */
    public cambioFechaInicio(nuevo_valor: string): void {
        this.formBusqueda.get('fechaInicial')?.setValue(nuevo_valor);
        this.formBusqueda.get('fechaInicial')?.markAsUntouched();
    }

    /**
     * Maneja el cambio en el campo de fecha final.
     * @param nuevo_valor Nuevo valor para la fecha final.
     */
    public cambioFechaFinal(nuevo_valor: string): void {
        this.formBusqueda.get('fechaFinal')?.setValue(nuevo_valor);
        this.formBusqueda.get('fechaFinal')?.markAsUntouched();
    }

    /**
    * Configuración de las columnas de la tabla.
    */
    configuracionTabla: ConfiguracionColumna<AcusesYResolucionesFolioTramite>[] = [
        {
            encabezado: 'Folio',
            clave: (artículo) => artículo.tramite,
            orden: 0,
        },
        {
            encabezado: 'Tipo de trámite',
            clave: (artículo) => artículo.tipo_tramite,
            orden: 1,
        },
        {
            encabezado: 'Dependencia',
            clave: (artículo) => artículo.dependencia,
            orden: 2,
        },
        {
            encabezado: 'Fecha inicio trámite',
            clave: (artículo) => artículo.fecha_resolucion,
            orden: 3,
        },
    ];

    private hideAlert(): void { this.alertVisible = false; this.classAlert = ''; this.alertMessage = ''; }

    getDatosAcusesYResolucionesPorFolioYFecha(folio: string, fecha_inicio: string, fecha_fin: string): void {
        this.hideAlert();

        if (this.formBusqueda.get('fechaInicial')?.value !== "" && this.formBusqueda.get('fechaFinal')?.value === "") {
            setTimeout(() => {
                this.alertVisible = true;
                this.alertMessage = 'Falta un campo por capturar';
                this.classAlert = 'alert-danger';
            })
            return;
        }

        let FECHA_INICIAL = fecha_inicio;
        let FECHA_FINAL = fecha_fin;

        const REGEX = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/

        if (!fecha_inicio.match(REGEX)) {
            FECHA_INICIAL = convertirFechaDDMMYYYY(fecha_inicio)
        }
        if (!fecha_fin.match(REGEX)) {
            FECHA_FINAL = convertirFechaDDMMYYYY(fecha_fin)
        }

        this.acusesYResolucionesService.getAcusesYResoluciones({
            rfc_solicitante: this.rfcValor,
            cve_usuario: this.rfcValor,
            rol_actual: "CapturistaGubernamental",
            num_folio_tramite: folio,
            fecha_inicio: FECHA_INICIAL,
            fecha_fin: FECHA_FINAL,
            certificado: null
        }).subscribe({
            next: (res) => {
                this.configuracionTablaDatos = res.datos
            }
        })
    }

    obtenerDatosPorFolioYFecha(): void {
        this.getDatosAcusesYResolucionesPorFolioYFecha(this.formBusqueda.get('folio')?.value, this.formBusqueda.get('fechaInicial')?.value, this.formBusqueda.get('fechaFinal')?.value)
    }
    /**
     * Maneja el evento de clic en una fila de la tabla.
     * Navega a la URL del procedimiento.
     */
    onFilaClic(event: AcusesYResolucionesFolioTramite): void {
        const ROW_OBJETO = event;
        localStorage.setItem('id_solicitud', event.id_solicitud)
        this.router.navigate([`/${ROW_OBJETO.acronimo.toLocaleLowerCase()}/subsecuentes`]);
    }

}