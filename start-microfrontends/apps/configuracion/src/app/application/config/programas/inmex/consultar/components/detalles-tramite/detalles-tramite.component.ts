import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { ConfiguracionColumna, TablaDinamicaComponent } from "@libs/shared/data-access-user/src";
import { Bitacora } from "../../../../../../core/models/agregar-fraccion/response/bitcora-response";
import { CargarArchivoComponent } from "../../../registrar/cargar-archivo/cargar-archivo.component";
import { ConsultaInmexService } from "../../../../../../core/services/consulta-inmex.service";
import { ConsultarFraccionComponent } from "../../../registrar/consultar-fraccion/consultar-fraccion.component";
import { EliminarFraccionComponent } from "../../../registrar/eliminar-fraccion/eliminar-fraccion.component";
import { FraccionesResponse } from "../../../../../../core/models/agregar-fraccion/response/agregar-fraccion";
import { RegistrosResponse } from "../../../../../../core/models/agregar-fraccion/response/registros-response";
import { Subscription } from "rxjs";

@Component({
    standalone: true,
    selector : 'detalles-tramite-inmex',
    templateUrl: "./detalles-tramite.component.html",
    styleUrls: ["./detalles-tramite.component.scss", "../consultar.component.scss"],
    imports: [EliminarFraccionComponent, ConsultarFraccionComponent, CargarArchivoComponent, TablaDinamicaComponent]
})
export class DetallesDelTramiteComponent implements OnInit, OnDestroy {
    private subscripcion = new Subscription()
    /**
     * variable que recibe el tramite seleccionado obligatorio para inicializar el componente
     */

    @Input({ required: true }) tramiteSeleccionado: RegistrosResponse | undefined = undefined;
    /**
     * variable que almacena las fracciones obtenidas de la request
     */
    public datosFracciones: FraccionesResponse[] = []
    /**
     * almacena la fecha de inicio de la vigencia del tramite
     */
    public fechaInicioVigencia: string = ""
    /**
     * almacena la fecha de fin de vigencia del tramite 
     */
    public fechaFinVigencia: string = ""
    /**
     * almacena las bitacoras ontenidas de la response
     */
    public bitacora: Bitacora[] = []
    /**
     * 
     * @param consultaRegistroService - servicio para las consultas de menú consultar
     */

    /**
    * Controla la visibilidad del modal "Eliminar Fracción".
    *
    * @property {boolean} mostrarModalEliminarFraccion - Indica si el modal debe mostrarse (true).
    */
    public mostrarModalEliminarFraccion: boolean = false;

    /**
     * Controla la visibilidad del modal "Consultar Fracción".
     *
     * @property {boolean} mostrarModalConsultarFraccion - Indica si el modal debe mostrarse (true).
     */
    public mostrarModalConsultarFraccion: boolean = false;
    /**
     * Controla la visibilidad del modal para cargar un archivo relacionado.
     *
     * @property {boolean} mostrarCargarArchivo - Determina si el modal de carga debe presentarse.
     */
    public mostrarCargarArchivo: boolean = false;
    /**
     * Controla la visibilidad del modal documentos
     * @property {boolean} mostrarDocumentos - Determina si el modal de Documentos debe presentarse.
     */
    public mostrarDocumentos: boolean = false;

    configuracionTablaBitacoras: ConfiguracionColumna<Bitacora>[] = [
        {
            encabezado: 'Fracción',
            clave: (bitacora) => bitacora.fraccion,
            orden: 1
        },
        {
            encabezado: "Fecha de última modificación",
            clave: (bitacora) => bitacora.fecha_modificacion,
            orden: 2
        },
        {
            encabezado: "Activo",
            clave: (bitacora) => bitacora.activo ? "si" : "no",
            orden: 3
        }
    ]

    @Output() accionRegresar = new EventEmitter<void>()


    constructor(
        public consultaRegistroService: ConsultaInmexService
    ) { }

    /**
     * 
     */
    private ObtenerRegistros(): void {
        this.consultaRegistroService.obtenerConfiguracionDelPrograma().subscribe(
            (res) => {
                this.actualizarFracciones(res.fracciones)
                this.fechaFinVigencia = res.fecha_fin_vigencia;
                this.fechaInicioVigencia = res.fecha_inicio_vigencia;
                this.bitacora = res.bitacora
            }
        )
    }

    /**
     * 
     * @param nuevasFracciones - fracciones recibidas para ser actualizadas.
     */
    public actualizarFracciones(nuevasFracciones: FraccionesResponse[]): void {
        this.datosFracciones = nuevasFracciones;
    }
    /**
     * Muestra el modal correspondiente según el identificador recibido.
     *
     * @method abrirModal
     * @param {number} id - Identificador del modal que debe abrirse:
     *  - `2` => Modal Eliminar Fracción
     *  - `3` => Modal Consultar Fracción
     *  - `4` => Modal Cargar Archivo
     *  - `5` => Modal mostrar Documentos
     */
    abrirModal(id: number): void {
        switch (id) {
            case 2:
                this.mostrarModalEliminarFraccion = true;
                break;
            case 3:
                this.mostrarModalConsultarFraccion = true;
                break;
            case 4:
                this.mostrarCargarArchivo = true
                break;
            case 5:
                this.mostrarDocumentos = true;
                break
            default: break;
        }
    }
    public regresarALaBusqueda():void {
        this.accionRegresar.emit()
    }
    ngOnInit(): void {
        this.ObtenerRegistros()
    }


    ngOnDestroy(): void {
        this.subscripcion.unsubscribe()
    }
}