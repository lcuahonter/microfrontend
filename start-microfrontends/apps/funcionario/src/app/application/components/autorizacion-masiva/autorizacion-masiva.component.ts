import { catchError, map, Subject, takeUntil } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputFecha, InputFechaComponent, TableBodyData, TableComponent, TableData, TablePaginationComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import data from '@libs/shared/theme/assets/json/funcionario/lista-masivas.json'
import { TablerosService } from '../../core/service/tableros.service';
import { Tramites } from '../../core/models/tramites.model';


@Component({
  selector: 'app-autorizacion-masiva',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputFechaComponent, TableComponent, TablePaginationComponent],
  templateUrl: './autorizacion-masiva.component.html',
  styleUrl: './autorizacion-masiva.component.scss',
})
export class AutorizacionMasivaComponent implements OnInit, OnDestroy {
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
  /** Lista de trámites cargados masivamente */
  listaCargaMasiva!: Tramites[];
  /** Configuración de los inputs de fecha inicio*/
  public fechaInicioInput: InputFecha = this.FECHA_INICIO;
  /** Configuración de los inputs de fecha fin*/
  public fechaFinalInput: InputFecha = this.FECHA_FINAL;
  /** Cabecera de la tabla de carga masiva */
  public cargaMasivaTableHeaderData: string[] = [];
  /** Datos visibles en la tabla paginada */
  public cargaMasivaTableBodyData: TableBodyData[] = [];
  /** Datos completos originales (sin paginar) */
  public allCargaMasivaTableBodyData: TableBodyData[] = [];
  /** Datos de catálogo obtenidos del archivo JSON */
  public getRegimenTableData = data;
  /** Número total de elementos en la tabla. */
  public totalItems: number = 0;
  /** Cantidad de elementos por página.*/
  public itemsPerPage: number = 5;
  /** Página actual de la tabla paginada. */
  public currentPage: number = 1;
  /** Subject para destruir las suscripciones.*/
  private destruirSuscripcion$: Subject<void> = new Subject();

  /**
    * Constructor del componente.
    * @param fb FormBuilder para construir formularios reactivos.
    * @param servicioFuncionario Servicio para la consulta de trámites.
    */
  constructor(
    private fb: FormBuilder,
    private servicioFuncionario: TablerosService
  ) {
  }
  /**
    * Método de ciclo de vida de Angular.
    * Se ejecuta al inicializar el componente.
    */
  ngOnInit(): void {
    this.inicializaFormConsulta();
    this.cargarDatos();
  }

  /**
   * Inicializa el formulario de búsqueda con sus respectivos validadores.
   */
  inicializaFormConsulta(): void {
    this.FormBusqueda = this.fb.group({
      catalogoDependencia: ['', Validators.required],
      servicio: ['', Validators.required],
      subServicio: ['', Validators.required],
      modalidad: ['', Validators.required],
      tarea: ['', Validators.required],
      fechaInicio: [''],
      fechaFinal: [''],
      observacion: ['']
    });
  }
  /**
    * Cambia el estado del filtro colapsable (mostrar/ocultar filtros).
    */
  mostrar_colapsable(): void {
    this.colapsable = !this.colapsable;
  }
  /**
    * Actualiza el campo de fecha inicial en el formulario.
    * @param nuevo_valor Nueva fecha seleccionada.
    */
  public cambioFechaInicio(nuevo_valor: string): void {
    this.FormBusqueda.get('fechaInicio')?.setValue(nuevo_valor);
    this.FormBusqueda.get('fechaInicio')?.markAsUntouched();
  }
  /**
    * Actualiza el campo de fecha final en el formulario.
    * @param nuevo_valor Nueva fecha seleccionada.
    */
  public cambioFechaFinal(nuevo_valor: string): void {
    this.FormBusqueda.get('fechaFinal')?.setValue(nuevo_valor);
    this.FormBusqueda.get('fechaFinal')?.markAsUntouched();
  }
  /**
    * Carga los datos iniciales desde un archivo JSON simulado.
    * Inicializa la paginación.
    */
  private cargarDatos(): void {
    this.cargaMasivaTableHeaderData = data.tableHeader;
    this.allCargaMasivaTableBodyData = data.tableBody;
    this.totalItems = this.allCargaMasivaTableBodyData.length;
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
  /**
    * Actualiza los datos visibles de la tabla según la paginación actual.
    */
  private updatePagination(): void {
    const STARTINDEX = (this.currentPage - 1) * this.itemsPerPage;
    const ENDINDEX = STARTINDEX + this.itemsPerPage;
    this.cargaMasivaTableBodyData = this.allCargaMasivaTableBodyData.slice(STARTINDEX, ENDINDEX);
  }
  /**
    * Ejecuta la búsqueda de trámites pendientes basado en el formulario actual.
    * Valida los campos obligatorios antes de llamar al servicio.
    */
  buscarPendiente(): void {
    //Se salta la regla de UPPER_CASE, ya que los valores que se recuperan en la constante 
    //son valores predefinidos como el formulario fueron declarados
    //eslint-disable-next-line @typescript-eslint/naming-convention
    const { catalogoDependencia, servicio, subServicio, modalidad, tarea, fechaInicio, fechaFinal, observacion
    } = this.FormBusqueda.value;
    // Verifica que los 5 campos obligatorios estén presentes
    if (!catalogoDependencia || !servicio || !subServicio || !modalidad || !tarea) {
      console.warn('Faltan campos obligatorios para la búsqueda.');
      return;
    }
    this.servicioFuncionario
      .getListaCargaMasiva(
        catalogoDependencia,
        servicio,
        subServicio,
        modalidad,
        tarea,
        {
          fechaInicio: fechaInicio || undefined,
          fechaFinal: fechaFinal || undefined,
          observacion: observacion || undefined,
        }
      )
      .pipe(
        map((data) => {
          // Asignar los datos recibidos
          this.cargaMasivaTableHeaderData = data.tableHeader;
          this.allCargaMasivaTableBodyData = data.tableBody;
          this.totalItems = this.allCargaMasivaTableBodyData.length;
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
}
