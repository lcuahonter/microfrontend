import { catchError, map, Subject, takeUntil } from 'rxjs';
import { Component, OnInit } from '@angular/core';
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
import { CONFIGURACION_ENCABEZADO_SOLICITUDES } from '../../core/constantes/constantes-bandejas.constants';
import { ListaSolicitudes } from '../../core/models/solicitudes.model';
import { TablerosService } from '../../core/service/tableros.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-bandeja-solicitudes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputFechaComponent, TablaDinamicaComponent, TablePaginationComponent],
  templateUrl: './bandeja-solicitudes.component.html',
  styleUrl: './bandeja-solicitudes.component.scss',
})
export class BandejaSolicitudesComponent implements OnInit {
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

  /** Indica si el bloque de filtros está colapsado */
  colapsable: boolean = false;
  /** Formulario de búsqueda */
  public FormBusqueda!: FormGroup;
  /** Configuración del input de fecha inicial */
  public fechaInicioInput: InputFecha = this.FECHA_INICIO;
  /** Configuración del input de fecha final */
  public fechaFinalInput: InputFecha = this.FECHA_FINAL;
  /** Acciones disponibles en la tabla */
  public accionesServcios: TablaAcciones[] = [];
  /** Lista completa de solicitudes obtenida del backend */
  public todasSolicitudes: ListaSolicitudes[] = [];
  /** Lista de solicitudes mostrada en la página actual */
  public listaSolicitudesPaginadas: ListaSolicitudes[] = [];
  /** Total de elementos (para paginación) */
  public totalItems: number = 0;
  /** Cantidad de elementos por página */
  public itemsPerPage: number = 5;
  /** Página actual */
  public currentPage: number = 1;
  /** Copia original de las solicitudes (sin filtros) */
  public todasSolicitudesOriginales: ListaSolicitudes[] = [];

  /** Configuración de columnas de la tabla */
  public configurarTabla: ConfiguracionColumna<ListaSolicitudes>[] = CONFIGURACION_ENCABEZADO_SOLICITUDES;
  /**
     * Notificador para destruir las suscripciones.
     */
  private destroyNotifier$: Subject<void> = new Subject();

  constructor(
    private fb: FormBuilder,
    private tableroService: TablerosService,
  ) {

  }

  /** Al inicializar el componente, se cargan las solicitudes */
  ngOnInit(): void {
    this.inicializaFormConsulta();
    this.getSolicitudesTabla();
  }

  /**
   * Inicialización del formulario de búsqueda 
   */
  inicializaFormConsulta(): void {
    this.FormBusqueda = this.fb.group({
      idSolicitud: [''],
      fechaInicio: [''],
      fechaFinal: ['']
    });
  }

  /** Alterna el estado del bloque colapsable (mostrar/ocultar filtros) */
  mostrar_colapsable(): void {
    this.colapsable = !this.colapsable;
  }

  /**
 * Actualiza el valor del campo 'fechaInicio' en el formulario reactivo `FormBusqueda`
 * @param nuevoValor_fechaInicio - Nuevo valor a establecer para el campo 'fechaInicio'.
 */
  public cambioFechaInicioFucion(nuevo_valor: string): void {
    this.FormBusqueda.get('fechaInicio')?.setValue(nuevo_valor);
    this.FormBusqueda.get('fechaInicio')?.markAsUntouched();
  }

  /**
 * Actualiza el valor del campo 'fechaFinal' en el formulario reactivo `FormBusqueda`
 * @param nuevoValor_fechaFinal - Nuevo valor a establecer para el campo 'fechaFinal'.
 */
  public cambioFechaFinalFuncion(nuevo_valor: string): void {
    this.FormBusqueda.get('fechaFinal')?.setValue(nuevo_valor);
    this.FormBusqueda.get('fechaFinal')?.markAsUntouched();
  }

  /** Obtiene todos las solicitudes desde el backend y aplica la paginación inicial */
  public getSolicitudesTabla(): void {
    this.accionesServcios = [TablaAcciones.VER];
    this.tableroService.getListaSolicitudes()
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((data) => {
          this.todasSolicitudesOriginales = data;
          this.todasSolicitudes = [...data];
          this.totalItems = data.length;
          this.updatePagination();
        }),
        catchError((_error) => {
          return _error;
        })
      )
      .subscribe();
  }

  /** Actualiza los elementos paginados según la página e ítems por página seleccionados */
  public updatePagination(): void {
    const STARTINDEX = (this.currentPage - 1) * this.itemsPerPage;
    const ENDINDEX = STARTINDEX + this.itemsPerPage;
    this.listaSolicitudesPaginadas = this.todasSolicitudes.slice(STARTINDEX, ENDINDEX);
  }

  /** Ejecuta la búsqueda de solicitudes con los filtros del formulario */
  buscarSolicitudes(): void {
    /**
     * Se salta la regla de UPPER_CASE, ya que los valores que se recuperan en la constante 
     * son valores predefinidos como el formulario fueron declarados
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { idSolicitud, fechaInicio, fechaFinal } = this.FormBusqueda.value;
    this.tableroService
      .getListaSolicitudes(idSolicitud || undefined, fechaInicio || undefined, fechaFinal || undefined)
      .pipe(
        takeUntilDestroyed(),
        map((data) => {
          this.todasSolicitudesOriginales = data;
          this.todasSolicitudes = [...data];
          this.totalItems = data.length;
          this.currentPage = 1;
          this.updatePagination();
        }),
        catchError((_error) => {
          return _error;
        })
      )
      .subscribe();
  }

  /**
   * Reseteo de valores de la busqueda
   */
  resetFiltros(): void {
    this.FormBusqueda.reset();
    this.todasSolicitudes = [...this.todasSolicitudesOriginales];
    this.totalItems = this.todasSolicitudes.length;
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
