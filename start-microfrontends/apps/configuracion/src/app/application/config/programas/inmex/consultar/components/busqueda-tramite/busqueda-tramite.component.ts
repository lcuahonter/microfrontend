import { Component, EventEmitter, OnDestroy, Output } from "@angular/core";
import { ConfiguracionColumna, TablaDinamicaComponent } from "@libs/shared/data-access-user/src";
import { ConsultaInmexService } from "../../../../../../core/services/consulta-inmex.service";
import { FormsModule } from "@angular/forms";
import { RegistrosResponse } from "../../../../../../core/models/agregar-fraccion/response/registros-response";
import { Subscription } from "rxjs";

@Component({
    standalone: true,
    selector: 'busqueda-tramite-inmex',
    templateUrl: "./busqueda-tramite.component.html",
    styleUrls: ["./busqueda-tramite.component.scss", "../consultar.component.scss"],
    imports: [FormsModule, TablaDinamicaComponent]
})
export class BusquedaTramiteComponent implements OnDestroy {
    private subscripcion = new Subscription()
    /**
     * Variable donde se almacena el tratamiento seleccionado
     */
    public tratamientoEspecialSeleccionado: string = "-1";

    /**
     * lista de opciones para el select de tratamiento especial
     */
    public listaTratamientoEspecial = [
        { id: "-1", name: "Seleccione" },
        { id: "1", name: "Sensible Azúcar" },
        { id: "2", name: "Sensible Acero" },
        { id: "3", name: "Sensible Llantas" },
        { id: "4", name: "3R's" },
        { id: "5", name: "Prohibidos" },
        { id: "6", name: "Textiles" },
        { id: "100", name: "Anexo 1" },
        { id: "104", name: "Servicios" },
        { id: "101", name: "Ampliación" },
        { id: "103", name: "Sensible Subsecuente" },
        { id: "102", name: "Cambio Modalidad" },
        { id: "0", name: "Generales" },
        { id: "7", name: "Sensibles nuevo" },
        { id: "8", name: "Prohibidas nuevo" },
        { id: "9", name: "Prohibidas exportación programa nuevo" },
        { id: "203", name: "Prueba fracciones" },
        { id: "202", name: "QAS" },
        { id: "10", name: "Prohibidas exportación sensibles" },
        { id: "11", name: "QWERT" }
    ]

    configuracionTabla: ConfiguracionColumna<RegistrosResponse>[] = [
        {
            encabezado: 'Tratamiento Especial',
            clave: (documento) => documento.tratamiento,
            orden: 0,
        },
        {
            encabezado: 'Fecha Inicio',
            clave: (documento) => documento.fecha,
            orden: 1,
        },
        {
            encabezado: 'Activo',
            clave: (documento) => documento.activo,
            orden: 2
        }
    ]

    /**
     * variable en donde se almacenan los tramites obtenidos de la request
     */
    public tramitesConsultados: RegistrosResponse[] = []

    /**
     * 
     */
    @Output() tramiteSeleccionado = new EventEmitter<RegistrosResponse>()
    /**
     * 
     * @param consultaRegistroService - servicio para las consultas de menú consultar
     */
    constructor(
        public consultaRegistroService: ConsultaInmexService
    ) { }
    /**
     * Metodo que llama al servicio para obtener los registros de acuerdo al tratamiento 
     */
    public buscarTratamientos(): void {
        this.consultaRegistroService.obtenerRegistros().subscribe(
            (res) => {
                this.tramitesConsultados = res
            }
        )
    }

    onFilaClic(event: RegistrosResponse): void {
        this.tramiteSeleccionado.emit(event);
    }
    ngOnDestroy(): void {
        this.subscripcion.unsubscribe()
    }
}