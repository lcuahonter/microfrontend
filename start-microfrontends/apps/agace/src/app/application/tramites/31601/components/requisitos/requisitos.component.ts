import { CATALOGOS_ID } from '@ng-mf/data-access-user';
import { Catalogo } from '@libs/shared/data-access-user/src/core/models/shared/catalogos.model';
import { CatalogoSelectComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConfiguracionColumna } from '@libs/shared/data-access-user/src/core/models/shared/configuracion-columna.model';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ServiciosPantallaService } from '@libs/shared/data-access-user/src/core/services/31601/servicios-pantalla.service';
import { Solicitud31601State } from '../../../../estados/tramites/tramite31601.store';
import { Subject } from 'rxjs';
import { Subscription } from 'rxjs';
import { TablaDinamicaComponent } from '@ng-mf/data-access-user';
import { TableBodyData } from '@ng-mf/data-access-user';
import { TableComponent } from '@ng-mf/data-access-user';
import { Tipos } from '@libs/shared/data-access-user/src/core/models/31601/servicios-pantallas.model';
import { TituloComponent } from '@ng-mf/data-access-user';
import { Tramite31601Query } from '../../../../estados/queries/tramite31601.query';
import { Tramite31601Store } from '../../../../estados/tramites/tramite31601.store';
import { Validators } from '@angular/forms';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';


/**
 * @component RequisitosComponent
 * @description
 * Componente encargado de gestionar los requisitos del trámite 31601.
 * Permite seleccionar tipos de documentos desde catálogos y visualizar la información en una tabla.
 * Utiliza servicios para obtener la configuración y los datos desde archivos JSON, así como estado de la aplicación desde el store.
 * 
 * ### Funcionalidades:
 * - Selección de tipos de documento mediante `CatalogoSelectComponent`.
 * - Visualización de datos en tabla con `TableComponent`.
 * - Control de estado de formulario: lectura o edición.
 * 
 * ### Subcomponentes:
 * - `TituloComponent`
 * - `CatalogoSelectComponent`
 * - `TableComponent`
 * - `TablaDinamicaComponent`
 * 
 * @selector app-requisitos
 * @styleUrls ['./requisitos.component.scss']
 * @templateUrl './requisitos.component.html'
 * @standalone true
 * 
 * @imports [
 *   HttpClientModule,
 *   FormsModule,
 *   ReactiveFormsModule,
 *   CommonModule,
 *   TituloComponent,
 *   TableComponent,
 *   CatalogoSelectComponent,
 *   TablaDinamicaComponent
 * ]
 */
@Component({
  selector: 'app-requisitos',
  templateUrl: './requisitos.component.html',
  styleUrl: './requisitos.component.scss',
  standalone: true,
  imports: [
    HttpClientModule,
    FormsModule,
    CommonModule,
    TituloComponent,
    TableComponent,
    CatalogoSelectComponent,
    ReactiveFormsModule,
    TablaDinamicaComponent,
  ],
})
export class RequisitosComponent implements OnInit, OnDestroy {
  /**
   * Formulario reactivo que contiene los controles para el componente.
   */
  requisitos!: FormGroup;

  /**
   * Determina si el formulario debe estar en modo solo lectura.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Objeto para cancelar observables al destruir el componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Lista de tipos de documentos cargados desde JSON.
   */
  tipos: Tipos[] = [];

  /**
   * Configuración de columnas para la tabla de tipos de documentos.
   */
  configuracionTabla: ConfiguracionColumna<Tipos>[] = [
    {
      encabezado: 'Tipo de Documento',
      clave: (item: Tipos) => item.tiposData,
      orden: 1,
    },
  ];

  /**
   * Suscripción para manejar la carga de catálogos.
   */
  private tiposCatalogSubscription: Subscription = new Subscription();

  /**
   * Encabezados de la tabla que se muestran en la vista.
   */
  public tipoHeaderData: string[] = [];

  /**
   * Datos del cuerpo de la tabla.
   */
  public tipoBodyData: TableBodyData[] = [];

  /**
   * Catálogo de tipos de documento cargado por ID.
   */
  public tipocatlog: Catalogo[] = [];

  /**
   * Estado completo de la solicitud del trámite 31601.
   */
  public solicitudState!: Solicitud31601State;

  /**
   * Estructura que contiene los encabezados y cuerpo de la tabla.
   */
  public tipoTableData = {
    tableHeader: ['Tipo de Documento'],
    tableBody: [],
  };

  /**
   * Controla la visibilidad del contenido adicional.
   */
  showContent = false;

  /**
   * Alterna la visibilidad del contenido adicional en la vista.
   * @method toggleContent
   */
  toggleContent(): void {
    this.showContent = !this.showContent;
  }

  /**
   * Constructor del componente.
   * Se inyectan servicios y se suscribe al estado de solo lectura de la sección actual.
   * @param http Cliente HTTP para peticiones REST
   * @param pantallaSvc Servicio de pantalla para obtener catálogos y datos
   * @param tramite31601Store Store para manejar el estado de la solicitud
   * @param tramite31601Query Query para obtener el estado del trámite
   * @param fb FormBuilder para construir formularios
   * @param consultaioQuery Query que proporciona el estado de lectura del formulario
   */
  constructor(
    public http: HttpClient,
    private pantallaSvc: ServiciosPantallaService,
    private tramite31601Store: Tramite31601Store,
    private tramite31601Query: Tramite31601Query,
    private fb: FormBuilder,
    private consultaioQuery: ConsultaioQuery,
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  /**
   * Hook de inicialización del componente.
   * Llama a la carga de tipos de documentos y a la inicialización del estado del formulario.
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
    this.loadTipos();
  }

  /**
   * Inicializa el formulario con datos del store y aplica validaciones.
   * También aplica configuración de solo lectura si es necesario.
   * @method inicializarEstadoFormulario
   */
  inicializarEstadoFormulario(): void {
    this.tramite31601Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();

    this.requisitos = this.fb.group({
      tipoDocumento: [this.solicitudState?.tipoDocumento, Validators.required]
    });

    if (this.esFormularioSoloLectura) {
      Object.keys(this.requisitos.controls).forEach((key) => {
        this.requisitos.get(key)?.disable();
      });
    } else {
      Object.keys(this.requisitos.controls).forEach((key) => {
        this.requisitos.get(key)?.enable();
      });
    }
  }

  /**
   * Carga los tipos de documento desde el servicio de pantalla y el catálogo por ID.
   * Asigna los resultados a variables del componente.
   * @method loadTipos
   */
  loadTipos(): void {
    const TIPOS$ = this.pantallaSvc
      .getTiposCatalog()
      .pipe(map((resp) => (this.tipos = resp)));

    this.tiposCatalogSubscription = TIPOS$.subscribe();
    this.tipoHeaderData = this.tipoTableData.tableHeader;

    const TIPOSCATALOG$ = this.pantallaSvc
      .getTipoCatalog(CATALOGOS_ID.CAT_TIPO_DOCUMENTO)
      .pipe(map((resp) => (this.tipocatlog = resp.data)));

    this.tiposCatalogSubscription = TIPOSCATALOG$.subscribe();
  }

  /**
   * Actualiza un valor en el store de Tramite31601.
   * @param form Formulario reactivo que contiene el valor
   * @param campo Campo a actualizar
   * @param metodoNombre Nombre del método del store que se usará
   */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite31601Store): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite31601Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Hook de destrucción del componente.
   * Cancela todas las suscripciones y libera recursos.
   * @method ngOnDestroy
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
    if (this.tiposCatalogSubscription) {
      this.tiposCatalogSubscription.unsubscribe();
    }
  }
}
