import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { AlertComponent, ConfiguracionColumna, TablaDinamicaComponent } from "@libs/shared/data-access-user/src";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subject, take } from "rxjs";
import { AsyncPipe } from "@angular/common";
import { ConsultarGanadoresService } from "../../../../core/services/instrumentos/cupos/ganadores/consultar.service";
import { ListaGanadores } from "../../../../core/models/instrumentos/cupos/ganadores/response/lista-ganadores";
import { ListaLicitaciones } from "../../../../core/models/instrumentos/cupos/ganadores/response/lista-licitaciones";


@Component({
    standalone: true,
    templateUrl: './consultar.component.html',
    styleUrl: './consultar.component.scss',
    imports: [ReactiveFormsModule, AsyncPipe, AlertComponent, TablaDinamicaComponent]
})
export class ConsultarGanadoresComponent implements OnInit, OnDestroy {

    private _destory$ = new Subject<void>();
    /**
     * Formulario reactivo utilizado para la búsqueda de trámites.
     *
     * Contiene los campos necesarios para filtrar la información.
     */
    public FormBusquedaTramite!: FormGroup;
    /**
     * Lista de licitaciones para el select
     */
    public listaLicitaciones$!: Observable<ListaLicitaciones[]>;
    /**
     * lista de Ganadores 
     */
    public listaGanadores: ListaGanadores[] = [];
    /**
     * total de montos mostrados en la vista actual de lista ganadores.
     */
    public totalMontos: number = 0
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

    public configuracionTabla: ConfiguracionColumna<ListaGanadores>[] = [
        {
            encabezado: 'RFC',
            clave: (dato) => dato.rfc,
            orden: 0
        },
        {
            encabezado: 'EMPRESA',
            clave: (dato) => dato.empresa,
            orden: 1
        },
        {
            encabezado: 'MONTO ADJUDICADO',
            clave: (dato) => dato.monto_adjudicado,
            orden: 2
        },
    ]


    constructor(
        private fb: FormBuilder,
        private consultarGanadoresService: ConsultarGanadoresService
    ) { }

    /**
     * Obtener lista de licitaciones
     */
    public obtenerListaDeLicitaciones(): void {
        this.listaLicitaciones$ =
            this.consultarGanadoresService.obtenerListaLicitaciones();
    }
    /**
     * Inicializa el formulario de búsqueda de trámites.
     *
     * Define la estructura del formulario y sus controles,
     * estableciendo valores iniciales vacíos.
     */
    private inicializarForm(): void {
        this.FormBusquedaTramite = this.fb.group(
            {
                licitacion: ['', [Validators.required]],
                producto: [''],
                clasificacion: ['']
            },
        )
    }
    /**
     * 
     * @returns 
     */
    public buscarTramites(): void {
        this.controladorAlerta('', false)
        if (this.licitacionSeleccionada?.invalid) {
            this.FormBusquedaTramite.markAllAsTouched();
            return;
        }
        this.consultarGanadoresService.obtenerListaGanadores()
            .pipe(take(1))
            .subscribe({
                next: res => { 
                    
                    this.listaGanadores = res.datos.datos 
                    this.totalMontos = res.datos.total
                },
                error: () => this.controladorAlerta('No se encontró información', true)
            });

    }
    /**
     * Metodo para controlar la visibilidad y el mensaje de la alerta
     * @param mensaje 
     * @param visibilidadAlerta 
     */
    private controladorAlerta(mensaje: string, visibilidadAlerta: boolean): void {
        this.mensajeAlerta = mensaje;
        this.alertaVisible = visibilidadAlerta;
    }
    /**
     * getter para obtener la licitacion seleccionada
     */
    get licitacionSeleccionada(): AbstractControl | null {
        return this.FormBusquedaTramite.get('licitacion')
    }

    ngOnInit(): void {
        this.obtenerListaDeLicitaciones()
        this.inicializarForm()
    }

    ngOnDestroy(): void {
        this._destory$.next()
    }

}