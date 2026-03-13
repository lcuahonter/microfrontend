import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { TramiteState, TramiteStore } from '../../../core/estados/tramite.store';
import { CommonModule } from '@angular/common';
import { ConfiguracionColumna } from '../../../core/models/shared/configuracion-columna.model';
import { ConsultaioStore } from '../../../core/estados/consulta.store';
import { Router } from '@angular/router';
import { TramiteQuery } from '../../../core/queries/tramite.query';

import { REG_X } from '../../constantes/regex.constants';

import { BandejaDeTareasPendientes, SeleccionadoDepartamento } from '../../../core/models/shared/bandeja-de-tareas-pendientes.model';
import { TablaAcciones } from '../../../core/enums/tabla-seleccion.enum';
import { TablaDinamicaComponent } from '../tabla-dinamica/tabla-dinamica.component';
import { TablePaginationComponent } from '../table-pagination/table-pagination.component';
import { TramiteDetails } from '../../../core/models/tramiteDetails';

import { ModeloDeFormaDinamica } from '../../../core/models/shared/forms-model';


/**
 * Interfaz que representa un objeto con número de procedimiento y datos asociados a un trámite.
 */
@Component({
  selector: 'app-consulta-tramite',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TablaDinamicaComponent, TablePaginationComponent,],
  templateUrl: './consulta-tramite.component.html',
  styleUrl: './consulta-tramite.component.scss',
})

export class ConsultaTramiteComponent<T extends { id: string | number }> implements OnInit {
  /** 
   * Formulario de búsqueda 
   */
  public FormBuscaTramite!: FormGroup;

  /**
    * Estado de la solicitud.
    */
  public solicitudTramiteState!: TramiteState;

  /**
    * Notificador para destruir las suscripciones.
    */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Indica si la configuración de datos de la tabla está disponible.
   */
  public tieneConfiguracionTablaDatos: boolean = false;

   /* Indica si la bandeja debe mostrar el formulario dinámico */
  @Input() public tieneBandeja: boolean = false;
   /* Título de la tabla dentro de la bandeja */
  @Input() public tablaTitulo!: string;
  /* Configuración de columnas para la tabla */
  @Input() configuracionTabla: ConfiguracionColumna<T>[] = [];
  /* Datos que se muestran en la tabla */
  @Input() configuracionTablaDatos: T[] = [];
   /* Datos que se usan en el formulario de la bandeja */
  @Input() public bandejaSolicitudeDatos: ModeloDeFormaDinamica[] = [];
  /**
   * Propiedad de entrada que contiene un arreglo de objetos de datos a duplicar.
   */
  @Input() public duplicarDatos: T[] = [];
  /**
   * EventEmitter que emite un evento cada vez que un valor cambia en el componente.
   */
  @Output() obtenerNombreDelDepartamento: EventEmitter<{ campo: string; valor: string}> = new EventEmitter<{ campo: string; valor: string}>();
  /**
   * Propiedad de entrada que contiene la información del departamento actualmente seleccionado.
   */
  @Input() public seleccionadoDepartamento: SeleccionadoDepartamento = {
    tieneDepartamento: false,
    numeroDeProcedimiento: '',
    nombreDelDepartamento: '',
  };

  /* URL a la que se navega al seleccionar un trámite */
  public procedureUrl!: string;
  /* Indica si el formulario es válido */
  public hasValidForm: boolean = false;
 /* Formulario reactivo principal que contiene otro formGroup */
  public dinamicasBandejaForma: FormGroup = new FormGroup({
    bandejaSolicitudeFormGroup: new FormGroup({}),
  });
  
  /* Acciones disponibles en la tabla (editar, etc.) */
  public tablaAcciones: TablaAcciones[] = [TablaAcciones.EDITAR];
  /* Copia original de la configuración de la tabla */
  public originalConfiguracionTabla: T[] = [];
   /* Lista de detalles de trámite desde JSON */
  public tramiteData: TramiteDetails[] = [];
  /* Controla si la sección de país de origen está colapsada o no */
  public paisDeOriginColapsable = false;
  /* Total de elementos en la tabla */
  public totalItems: number = 0;
   /* Página actual en la paginación */
  public currentPage: number = 1;
  /* Cantidad de elementos por página */
  public itemsPerPage: number = 5;
  /* Datos del cuerpo para miembros de la empresa paginados */
  public miembroDeLaEmpresaBodyData: unknown[] = [];


  constructor(private router: Router,
    private fb: FormBuilder,
    private tramiteStates: TramiteStore,
    private solicitudtramiteQuery: TramiteQuery,
    private consultaioStore: ConsultaioStore
  ) {
    /**
     * Constructor de la clase ConsultaTramiteComponent.
     * @param router - Router para la navegación.
     * @param fb - FormBuilder para crear formularios reactivos.
     * @param tramiteStates - Store para manejar el estado del trámite.
     * @param solicitudtramiteQuery - Query para obtener el estado de la solicitud del trámite.
     */
  }

  /** 
   * Método para inicializar el formulario 
   */
  ngOnInit(): void {
    this.solicitudtramiteQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudTramiteState = seccionState;
        })
      )
      .subscribe();
    /** 
     * Inicializa el formulario de búsqueda al iniciar el componente
     */ 
    this.inicializaFormConsulta();
  }

  /** 
   * Método para inicializar el formulario de búsqueda 
   */
  inicializaFormConsulta(): void {
    this.FormBuscaTramite = this.fb.group({
      idTramite: ['', [Validators.required, Validators.pattern(REG_X.SOLO_NUMEROS)]],
    });
  }

  /**
   * Busca el trámite filtrando los datos duplicados por el número de procedimiento ingresado en el formulario.
   * Si encuentra resultados, actualiza la bandera de configuración de la tabla; si no, marca todos los controles como tocados.
   */
  buscarTramite(): void {
    if (this.FormBuscaTramite.invalid) {
      this.FormBuscaTramite.markAllAsTouched();
      this.tieneConfiguracionTablaDatos = true;
    }
    const IDTRAMITE = this.FormBuscaTramite.get('idTramite')?.value?.toString();
    this.configuracionTablaDatos = this.duplicarDatos;
    this.tieneConfiguracionTablaDatos = true;
    if(IDTRAMITE !== '') {
      this.configuracionTablaDatos = this.configuracionTablaDatos.filter(
        item => item.id?.toString() === IDTRAMITE
      );
    }
  }

  /**
   * Maneja la selección de un trámite actualizando el store con los valores del formulario proporcionado.
   *
   * @param {FormGroup} form - El FormGroup que contiene los datos del formulario relacionados con el trámite.
   * @param {string} campo - El nombre del campo asociado con la selección del trámite.
   * @param {string} metodoNombre - El nombre del método que se utilizará para procesar la selección del trámite.
   * @returns {void}
   */
  tramiteSeleccionado(form: FormGroup, campo: string, metodoNombre: string): void {
    this.setValoresStore(form, campo, metodoNombre);
  }

  /**
     * Establece los valores en el store.
     *
     * @param {FormGroup} form - El formulario del cual se obtiene el valor.
     * @param {string} campo - El nombre del campo del formulario cuyo valor se va a obtener.
     * @param {string} metodoNombre - El nombre del método en el store que se va a invocar con el valor del campo.
     * @returns {void}
     */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: string): void {
    const VALOR = form.get(campo)?.value;
    /**
     *  Suponiendo que TramiteStore tiene un método 'update' o similar para actualizar el estado
     *  Reemplaza 'update' por el método correcto si es diferente
     */ 
    this.tramiteStates.update({ [metodoNombre]: VALOR });
  }
/*
   * Cambia la página actual en la tabla
   */
  public onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }
  /*
   * Actualiza los datos visibles de la tabla según la paginación
   */
  public updatePagination(): void {
    const START_INDEX = (this.currentPage - 1) * this.itemsPerPage;
    this.miembroDeLaEmpresaBodyData = this.miembroDeLaEmpresaBodyData.slice(
      START_INDEX,
      START_INDEX + this.itemsPerPage
    );
  }
  /*
   * Cambia el número de elementos por página y reinicia la página actual
   */
  public onItemsPerPageChange(itemsPerPage: number): void {
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    this.updatePagination();
  }

/*
   * Maneja el clic sobre una fila de la tabla.
   * Navega a la ruta correspondiente dependiendo del origen del trámite
   */
  public onFilaClic(event:T): void {
    const ROW_OBJETO = event as unknown as BandejaDeTareasPendientes;
    const PROCEDURE: unknown | number = Number(
      ROW_OBJETO.numeroDeProcedimiento
    );
    const ORIGIN: string = ROW_OBJETO.origin; // Inicializar ORIGEN con un valor predeterminado
    const DEPARTMENTO: string = ROW_OBJETO.departamento.toLowerCase();
    
    this.consultaioStore.establecerConsultaio(
      String(PROCEDURE),
      ORIGIN,
      ROW_OBJETO.numeroDeProcedimiento,
      ROW_OBJETO.folioTramite,
      ROW_OBJETO.tipoDeTramite,
      ROW_OBJETO.estadoDeTramite,
      true,
      false,
      true
    );
    
    this.router.navigate([`${DEPARTMENTO}/datos-generales-tramite`]);
  }


/**
   * Verifica si un control del formulario es inválido, tocado o modificado.
   * @param nombreControl - Nombre del control a verificar.
   * @returns True si el control es inválido, de lo contrario false.
   */
  public esInvalido(nombreControl: string): boolean {
    const CONTROL = this.FormBuscaTramite.get(nombreControl);
    return CONTROL
      ? CONTROL.invalid && (CONTROL.touched || CONTROL.dirty)
      : false;
  }

}
