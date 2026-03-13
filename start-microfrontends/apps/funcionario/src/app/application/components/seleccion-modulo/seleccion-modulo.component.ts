import { catchError, map, Subject, takeUntil } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    ConfiguracionColumna,
    InputFecha,
    InputFechaComponent,
    TablaAcciones,
    TablaDinamicaComponent,
    TablePaginationComponent
} from '@libs/shared/data-access-user/src';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CONFIGURACION_ENCABEZADO_PENDIENTES } from '../../core/constantes/constantes-bandejas.constants';
import { ListaPendientes } from '../../core/models/pendientes.model';
import { TablerosService } from '../../core/service/tableros.service';

@Component({
    selector: 'app-seleccion-modulo',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, InputFechaComponent, TablaDinamicaComponent, TablePaginationComponent],
    templateUrl: './seleccion-modulo.component.html',
    styleUrl: './seleccion-modulo.component.scss',
})
export class BandejaPendientesComponent implements OnInit, OnDestroy {
    /** Configuración del campo de fecha inicial */
    FECHA_INICIO = {
        labelNombre: 'Fecha inicial',
        required: false,
        habilitado: true,
    };
    /** Configuración del campo de fecha final */
    FECHA_FINAL = {
        labelNombre: 'Fecha final',
        required: false,
        habilitado: true,
    };

    /** Indica si el bloque de filtros esté colapsado */
    colapsable: boolean = false;
    /** Formulario de búsqueda */
    public FormBusqueda!: FormGroup;
    /** Configuración del input de fecha inicial */
    public fechaInicioInput: InputFecha = this.FECHA_INICIO;
    /** Configuración del input de fecha final */
    public fechaFinalInput: InputFecha = this.FECHA_FINAL;
    /** Acciones disponibles en la tabla */
    public accionesServcios: TablaAcciones[] = [];
    /** Lista completa de pendientes obtenida del backend */
    public todosPendientes: ListaPendientes[] = [];
    /** Lista de pendientes mostrada en la página actual */
    public listaPendientesPaginados: ListaPendientes[] = [];
    /** Total de elementos (para paginación) */
    public totalItems: number = 0;
    /** Cantidad de elementos por página */
    public itemsPerPage: number = 5;
    /** página actual */
    public currentPage: number = 1;
    /** Copia original de los pendientes (sin filtros) */
    public todosPendientesOriginales: ListaPendientes[] = [];

    /** Configuración de columnas de la tabla */
    public configurarTabla: ConfiguracionColumna<ListaPendientes>[] = CONFIGURACION_ENCABEZADO_PENDIENTES;
    /** 
    * Subject para destruir las suscripciones.
    */
    private destruirSuscripcion$: Subject<void> = new Subject();

    constructor(
        private fb: FormBuilder,
        private servicioFuncionario: TablerosService
    ) {
    }

    /** Al inicializar el componente, se cargan los pendientes */
    ngOnInit(): void {
        this.inicializaFormConsulta();
        this.getPendientesTabla();
    }

    /**
     * Inicialización del formulario de búsqueda
     */
    inicializaFormConsulta(): void {
        this.FormBusqueda = this.fb.group({
            folio: [''],
            info: [''],
            fechaInicio: [''],
            fechaFinal: ['']
        });
    }

    /**
   * Actualiza el valor del campo 'fechaInicio' en el formulario reactivo `FormBusqueda`
   * @param nuevoValor_fechaInicio - Nuevo valor a establecer para el campo 'fechaInicio'.
   */
    public cambioFechaInicio(nuevoValor_fechaInicio: string): void {
        this.FormBusqueda.get('fechaInicio')?.setValue(nuevoValor_fechaInicio);
        this.FormBusqueda.get('fechaInicio')?.markAsUntouched();
    }

    /**
   * Actualiza el valor del campo 'fechaFinal' en el formulario reactivo `FormBusqueda`
   * @param nuevoValor_fechaFinal - Nuevo valor a establecer para el campo 'fechaFinal'.
   */
    public cambioFechaFinal(nuevoValor_fechaFinal: string): void {
        this.FormBusqueda.get('fechaFinal')?.setValue(nuevoValor_fechaFinal);
        this.FormBusqueda.get('fechaFinal')?.markAsUntouched();
    }

    /** Alterna el estado del bloque colapsable (mostrar/ocultar filtros) */
    mostrar_colapsable(): void {
        this.colapsable = !this.colapsable;
    }

    /** Obtiene todos los pendientes desde el backend y aplica la paginación inicial */
    public getPendientesTabla(): void {
        this.accionesServcios = [TablaAcciones.EDITAR];
        this.servicioFuncionario.getListaPendientes()
            .pipe(
                map((data) => {
                    this.todosPendientesOriginales = data;
                    this.todosPendientes = [...data];
                    this.totalItems = data.length;
                    this.updatePagination();
                }),
                catchError((_error) => {
                    return _error;
                }),
                takeUntil(this.destruirSuscripcion$) // Asegura que la suscripción se cancele al destruir el componente
            )
            .subscribe();
    }

    /** Actualiza los elementos paginados según la página e ítems por página seleccionados */
    public updatePagination(): void {
        const STARTINDEX = (this.currentPage - 1) * this.itemsPerPage;
        const ENDINDEX = STARTINDEX + this.itemsPerPage;
        this.listaPendientesPaginados = this.todosPendientes.slice(STARTINDEX, ENDINDEX);
    }

    /** Ejecuta la búsqueda de pendientes con los filtros del formulario */
    buscarPendiente(): void {
        //Se salta la regla de UPPER_CASE, ya que los valores que se recuperan en la constante 
        //son valores predefinidos como el formulario fueron declarados
        //eslint-disable-next-line @typescript-eslint/naming-convention
        const { folio, info, fechaInicio, fechaFinal } = this.FormBusqueda.value;
        this.servicioFuncionario
            .getListaPendientes(folio || undefined, info || undefined, fechaInicio || undefined, fechaFinal || undefined)
            .pipe(
                map((data) => {
                    this.todosPendientesOriginales = data;
                    this.todosPendientes = [...data];
                    this.totalItems = data.length;
                    this.currentPage = 1;
                    this.updatePagination();
                }),
                catchError((_error) => {
                    return _error;
                }),
                takeUntil(this.destruirSuscripcion$) // Asegura que la suscripción se cancele al destruir el componente
            )
            .subscribe();
    }

    /**
  * Se ejecuta al destruir el componente.
  * Emite un valor y completa el subject `destruirNotificador$` para cancelar las suscripciones.
  */
    ngOnDestroy(): void {
        this.destruirSuscripcion$.next();
        this.destruirSuscripcion$.complete();
    }

    /**
    * Reseteo de valores de la busqueda
    */
    resetFiltros(): void {
        this.FormBusqueda.reset();
        this.todosPendientes = [...this.todosPendientesOriginales];
        this.totalItems = this.todosPendientes.length;
        this.currentPage = 1;
        this.updatePagination();
    }

    /**
 * Maneja el cambio de página
 * @param page Página seleccionada
 */
    public cambioDePagina(page: number): void {
        this.currentPage = page;
        this.updatePagination();
    }

    /**
     * Maneja el cambio de número de ítems por página
     * @param itemsPerPage Nuevo valor de ítems por página
     */
    public elementosPorCambioDePagina(itemsPerPage: number): void {
        this.itemsPerPage = itemsPerPage;
        this.currentPage = 1;
        this.updatePagination();
    }
}
