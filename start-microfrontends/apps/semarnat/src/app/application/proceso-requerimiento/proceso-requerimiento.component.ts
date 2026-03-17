/**
 * @fileoverview Componente encargado de gestionar el proceso completo de atención a un requerimiento.
 * ...
 */
import {
  AccionBoton,
  AcuseComponent,
  AnexarDocumentosComponent,
  AtenderRequerimientoService,
  BtnContinuarComponent,
  CATALOGOS_ID,
  Catalogo,
  CatalogosService,
  ConsultaioQuery,
  ConsultaioState,
  ConsultaioStore,
  DatosPasos,
  DesplazarseHaciaArribaService,
  EncabezadoRequerimientoComponent,
  FirmaElectronicaComponent,
  ListaPasosWizard,
  PASOS_REQUERIMIENTOS,
  RequerimientoInformacionComponent,
  TITULO_ACUSE,
  TXT_ALERTA_ACUSE,
  TramiteFolioQueries,
  WizardComponent,
} from '@ng-mf/data-access-user';
import {
  AccuseComponentes,
  ListaComponentes,
  Tabulaciones,
} from '@libs/shared/data-access-user/src/core/models/lista-trimites.model';
import { Component, OnDestroy, ViewChild, forwardRef } from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { LISTA_TRIMITES } from '../shared/constantes/lista-trimites.enums';
import { OnInit } from '@angular/core';
import { ReviewersTabsComponent } from '@libs/shared/data-access-user/src/tramites/components/reviewers-tabs/reviewers-tabs.component';
import { Router } from '@angular/router';
import { Type } from '@angular/core';



/**
 * Componente principal para el proceso de requerimiento.
 *
 * Este componente gestiona el flujo del requerimiento de información,
 * incluyendo anexar documentos, firma electrónica, y generación de acuse.
 *
 * @selector proceso-requerimiento
 * @standalone Este componente es autónomo (standalone).
 * @imports Importa módulos y componentes necesarios para el proceso.
 * @providers Proveedor del servicio `AtenderRequerimientoService`.
 * @templateUrl Ruta al archivo de plantilla HTML del componente.
 * @styleUrl Ruta al archivo de estilos SCSS del componente.
 */
@Component({
  selector: 'proceso-requerimiento',
  standalone: true,
  imports: [
    CommonModule,
    ReviewersTabsComponent,
    WizardComponent,
    BtnContinuarComponent,
    AnexarDocumentosComponent,
    FirmaElectronicaComponent,
    AcuseComponent,
    forwardRef(() => EncabezadoRequerimientoComponent),
    forwardRef(() => RequerimientoInformacionComponent),
  ],
  providers: [AtenderRequerimientoService],
  templateUrl: './proceso-requerimiento.component.html',
  styleUrl: './proceso-requerimiento.component.scss',
})
export class ProcesoRequerimientoComponent implements OnInit, OnDestroy {
   /**
   * Lista de pasos del wizard de requerimientos.
   */
  pasos: ListaPasosWizard[] = PASOS_REQUERIMIENTOS;

  /**
   * Índice actual del paso en el wizard.
   */
  indice: number = 1;

  /**
   * Lista de trámites disponibles.
   */
  listaTrimites = LISTA_TRIMITES;

  /**
   * Trámite seleccionado.
   */
  slectTramite!: AccuseComponentes | undefined;

  /**
   * Componente dinámico a mostrar.
   */
  viewChild!: Type<unknown>;

  /**
   * Identificador del trámite actual.
   */
  tramite: number = 0;

  /**
   * Fecha del requerimiento.
   */
  fechaRequerimiento!: string;

  /**
   * Justificación del requerimiento.
   */
  justificacionRequerimiento!: string;

  /**
   * Estado actual de la consulta.
   */
  guardarDatos!: ConsultaioState;

  /**
   * Departamento asociado al trámite.
   */
  departamento!: string;

  /**
   * Indica si el servicio de requerimiento está cargado.
   */
  esRequerimientoServiceLoaded: boolean = false;

  /**
   * Texto de alerta mostrado en el componente.
   */
  txtAlerta!: string;

  /**
   * Subtítulo mostrado en el componente.
   */
  subtitulo = TITULO_ACUSE;

  /**
   * Folio del trámite.
   */
  folio!: string;

  /**
   * URL actual.
   */
  url!: string;

  /**
   * Indica si se muestra el acuse.
   */
  esAcuse: boolean = false;

  /**
   * Catálogo de documentos disponibles.
   */
  catalogoDocumentos: Catalogo[] = [];

  /**
   * Referencia al componente Wizard.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Datos de los pasos del wizard.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Subject para notificar la destrucción del componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor del componente.
   * Inicializa servicios y suscripciones necesarias.
   */
  constructor(
    private router: Router,
    private consultaioStore: ConsultaioStore,
    private consultaioQuery: ConsultaioQuery,
    private catalogosServices: CatalogosService,
    private requerimientoService: AtenderRequerimientoService,
    private tramiteQueries: TramiteFolioQueries,
    private desplazarseHaciaArribaService: DesplazarseHaciaArribaService
  ) {
    /**
     * Suscripción al estado de consulta.
     * Guarda los datos actuales del estado en `guardarDatos`.
     */
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.guardarDatos = seccionState;
        })
      )
      .subscribe();

    /**
     * Obtiene la información del requerimiento desde el servicio.
     * Extrae y asigna la fecha y justificación del requerimiento.
     */
    this.requerimientoService.informacionRequisitos()
    .pipe(
      takeUntil(this.destroyNotifier$)
    ).subscribe({
      next: (resp): void => {
        const DATOS = resp.data;
        this.fechaRequerimiento = DATOS.fechaRequerimiento;
        this.justificacionRequerimiento = DATOS.justificacionRequerimiento;
      },
    });

    /**
     * Asigna valores a propiedades locales a partir de `guardarDatos`.
     * - `tramite`: ID del procedimiento.
     * - `departamento`: Nombre del departamento en minúsculas.
     */
    this.tramite = Number(this.guardarDatos?.procedureId);
    this.departamento = this.guardarDatos?.department.toLowerCase();
  }

  /**
   * Método del ciclo de vida OnInit.
   * Inicializa el componente y obtiene datos necesarios.
   */
  ngOnInit(): void {
    /**
     * Verifica si existe un trámite previamente seleccionado.
     * Si existe, se selecciona automáticamente.
     * En caso contrario, redirige al usuario a la pantalla de selección de trámite.
     */
    if (this.tramite) {
      this.selectTramite(this.tramite);
    } else {
      this.router.navigate([`/${this.departamento}/seleccion-tramite`]);
    }

    /**
     * Obtiene los tipos de documentos necesarios para el trámite actual.
     */
    this.getTiposDocumentos();

    /**
     * Obtiene la URL actual desde el router.
     * Extrae la primera sección de la URL para asignarla a la propiedad `url`.
     */
    const URL_ACTUAL = this.router.url;
    this.url = URL_ACTUAL.split('/')[1];
    
    /**
     * Obtiene el folio del trámite actual desde el servicio `tramiteQueries`.
     */
    this.folio = this.tramiteQueries.getTramite();
      /**
   * Genera el texto de alerta de acuse con el folio del trámite.
   */
    this.txtAlerta = TXT_ALERTA_ACUSE(this.folio);

    /**
     * Realiza un desplazamiento suave hacia la parte superior de la página usando el servicio.
     *
     * Se utiliza para mejorar la experiencia de usuario al cambiar de paso o al inicializar el componente.
     */
    this.desplazarseHaciaArribaService.desplazarArriba();
  }

  /**
   * Carga dinámicamente un componente según el parámetro recibido.
   * @param li - Objeto de tipo ListaComponentes que contiene la ruta del componente a cargar.
   */
  async loadComponent(li: ListaComponentes): Promise<void> {
    if (!li.componentPath) {
      console.error('Component not found in registry:');
      return;
    }
    this.viewChild = (await li.componentPath()) as Type<unknown>;
  }

  /**
   * Cambia la pestaña activa en el wizard según el id recibido.
   * @param id - Objeto de tipo Tabulaciones que indica la pestaña a mostrar.
   */
  viewChildcambioDePestana(id: Tabulaciones): void {
    const LI = this.slectTramite?.listaComponentes.find(
      (v: ListaComponentes) => v.id === id.id
    );
    if (LI) {
      this.loadComponent(LI);
    }
  }
  /**
   * Selecciona un trámite según el identificador recibido.
   * @param i - Identificador del trámite a seleccionar.
   */
  selectTramite(i: number): void {
    this.tramite = i;
    this.slectTramite = LISTA_TRIMITES.find((v) => v.tramite === i);
  }

  /**
   * Actualiza el índice basado en el valor de la acción proporcionada y navega en el componente wizard.
   *
   * @param e - Objeto de tipo `AccionBoton` que contiene el valor y la acción a realizar.
   *   - `valor`: Número que debe estar entre 1 y 4 (inclusive).
   *   - `accion`: Cadena que indica la acción a realizar ('cont' para siguiente, cualquier otro valor para atrás).
   * @return {void}
   */
  getValorIndice(e: AccionBoton): void {
    if (e?.valor && e.valor > 0 && e.valor < 5) {
      this.indice = e.valor;
      if (this.indice !== 2) {
          this.consultaioStore.establecerConsultaio(
          this.guardarDatos?.procedureId,
          this.guardarDatos?.parameter,
          this.guardarDatos?.department,
          this.guardarDatos?.folioTramite,
          this.guardarDatos?.tipoDeTramite,
          this.guardarDatos?.estadoDeTramite,
          true,false,false);
      } else {
        this.consultaioStore.establecerConsultaio(
          this.guardarDatos?.procedureId,
          this.guardarDatos?.parameter,
          this.guardarDatos?.department,
          this.guardarDatos?.folioTramite,
          this.guardarDatos?.tipoDeTramite,
          this.guardarDatos?.estadoDeTramite,
          false,false,true);
      }
      if (e.accion === 'cont') {
        this.wizardComponent.siguiente();
      } else {
        this.wizardComponent.atras();
      }

      this.desplazarseHaciaArribaService.desplazarArriba();
    }
  }

  /**
   * Obtiene el catálogo de los tipos de documentos disponibles para el trámite.
   */
  getTiposDocumentos(): void {
    this.catalogosServices
      .getCatalogo(CATALOGOS_ID.CAT_TIPO_DOCUMENTO)
      .subscribe({
        next: (resp): void => {
          if (resp.length > 0) {
            this.catalogoDocumentos = resp;
          }
        },
        error: (_error): void => {
          // Manejo de errores si es necesario
        },
      });
  }

  /**
   * Recibe la firma electrónica y redirige a la página de acuse si la firma es válida.
   * @param ev - Cadena que representa la firma electrónica obtenida.
   */
  obtieneFirma(ev: string): void {
    const FIRMA: string = ev;
    if (FIRMA) {
      this.esAcuse = true;
    }
  }

  /**
   * Método que se ejecuta cuando el componente es destruido.
   * Este método se encarga de limpiar las suscripciones a eventos y notificar la destrucción del componente.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
    this.consultaioStore.establecerConsultaio('', '', '', '', '', '', false, true, false);
  }
}
