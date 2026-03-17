import { AccuseComponentes, ListaComponentes, Tabulaciones } from '@libs/shared/data-access-user/src/core/models/lista-trimites.model';
import { Component, OnDestroy } from "@angular/core";
import { ConsultaioQuery, FECHA_DE_INICIO, MenuFuncionarioComponent } from '@ng-mf/data-access-user';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CapturarRequerimientoComponent } from '@libs/shared/data-access-user/src/tramites/components/capturar-requerimiento/capturar-requerimiento.component';
import { CommonModule } from "@angular/common";
import { ConsultaioState } from '@ng-mf/data-access-user';
import { ConsultaioStore } from '@ng-mf/data-access-user';
import { EncabezadoRequerimientoComponent } from '@libs/shared/data-access-user/src/tramites/components/encabezado-requerimiento/encabezado-requerimiento.component';
import { FirmaElectronicaComponent } from '@libs/shared/data-access-user/src/tramites/components/firma-electronica/firma-electronica.component';
import { GenerarDictamenComponent } from '@libs/shared/data-access-user/src/tramites/components/generar-dictamen/generar-dictamen.component';
import { LISTA_TRIMITES } from '../shared/constantes/lista-trimites.enums';
import { OnInit } from "@angular/core";
import { ReviewersTabsComponent } from '@libs/shared/data-access-user/src/tramites/components/reviewers-tabs/reviewers-tabs.component';
import { Router } from '@angular/router';
import { SolicitarDocumentosEvaluacionComponent } from '@libs/shared/data-access-user/src/tramites/components/solicitar-documentos-evaluacion/solicitar-documentos-evaluacion.component';
import { SolicitarOpinionComponent } from '@libs/shared/data-access-user/src/tramites/components/solicitar-opinion/solicitar-opinion.component';
import { SolicitudRequerimientoQuery } from '@libs/shared/data-access-user/src/core/queries/requerimientos.query';
import { SolicitudRequerimientosState } from '@libs/shared/data-access-user/src/core/estados/requerimientos.store';
import { Subject } from 'rxjs';
import { Type } from "@angular/core";
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';

/**
 * @component
 * @name EvaluarComponent
 * @description Componente principal para la evaluación de trámites en la aplicación AGA.
 * 
 * Este componente permite gestionar el flujo de evaluación de un trámite, incluyendo la navegación entre pestañas,
 * la visualización y captura de requerimientos, la generación de dictámenes y la firma electrónica.
 * Utiliza servicios y stores para obtener y actualizar el estado del trámite y los requerimientos asociados.
 * 
 * @selector app-evaluar
 * @standalone true
 * @imports
 *  - CommonModule
 *  - ReviewersTabsComponent
 *  - EncabezadoRequerimientoComponent
 *  - FormsModule
 *  - ReactiveFormsModule
 *  - GenerarDictamenComponent
 *  - FirmaElectronicaComponent
 *  - CapturarRequerimientoComponent
 *  - SolicitarDocumentosEvaluacionComponent
 * @templateUrl ./evaluar.component.html
 * @styleUrl ./evaluar.component.scss
 */
@Component({
  selector: 'app-evaluar',
  standalone: true,
  imports: [CommonModule, ReviewersTabsComponent,
    EncabezadoRequerimientoComponent,
    FormsModule, ReactiveFormsModule,
    GenerarDictamenComponent,
    FirmaElectronicaComponent,
    CapturarRequerimientoComponent,
    SolicitarDocumentosEvaluacionComponent,
    SolicitarOpinionComponent,
    MenuFuncionarioComponent
  ],
  templateUrl: './evaluar.component.html',
  styleUrl: './evaluar.component.scss',
})
export class EvaluarComponent implements OnInit, OnDestroy {
  /**
  * @property {AccuseComponentes[] } listaTrimites
  * @description Lista de trámites disponibles para evaluación, obtenida de la constante LISTA_TRIMITES.
  */
  listaTrimites = LISTA_TRIMITES;
  /**
   * @property {AccuseComponentes | undefined} slectTramite
   * @description Objeto que representa el trámite seleccionado actualmente.
   */
  slectTramite!: AccuseComponentes | undefined;
  /**
   * @property {Type<unknown>} viewChild
   * @description Referencia dinámica al componente hijo que se carga según la pestaña seleccionada.
   */
  viewChild!: Type<unknown>;
  /**
   * @property {number} tramite
   * @description Identificador del trámite seleccionado.
   */
  tramite: number = 0;
  /**
   * @property {number} indice
   * @description Índice de la pestaña principal seleccionada.
   */
  indice: number = 0;
  /**
   * @property {boolean} firmar
   * @description Indica si se debe mostrar la sección de firma electrónica.
   */
  firmar: boolean = false;
  /**
   * @property {ConsultaioState} guardarDatos
   * @description Estado actual del trámite consultado.
   */
  guardarDatos!: ConsultaioState;
  /**
   * @property {Subject<void>} destroyNotifier$
   * @description Subject utilizado para cancelar las suscripciones y evitar fugas de memoria al destruir el componente.
   * @private
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * @property {number} indiceDictamen
   * @description Índice de la pestaña de dictamen seleccionada.
   */
  indiceDictamen: number = 1;
  /**
   * @property {SolicitudRequerimientosState} requerimientoState
   * @description Estado actual de los requerimientos asociados al trámite.
   */
  public requerimientoState!: SolicitudRequerimientosState;
  /**
 * @constructor
 * @description Constructor del componente. Inicializa los servicios y suscripciones necesarias para la evaluación del trámite.
 * 
 * - Se suscribe al estado de consulta del trámite mediante `ConsultaioQuery` y actualiza la propiedad `guardarDatos` cada vez que cambia el estado.
 * - Se suscribe al estado de requerimientos mediante `SolicitudRequerimientoQuery` y actualiza la propiedad `requerimientoState` cada vez que cambia el estado.
 * - Inicializa el identificador del trámite (`tramite`) a partir del estado consultado.
 * - Llama al método `solicitanteConsultaio` del store para cargar los datos iniciales del trámite, utilizando el folio, la fecha de inicio y el estado del trámite.
 * 
 * @param {Router} router - Servicio de enrutamiento de Angular para navegación.
 * @param {ConsultaioStore} consultaioStore - Store para gestionar el estado de consulta del trámite.
 * @param {ConsultaioQuery} consultaioQuery - Query para observar el estado de consulta del trámite.
 * @param {SolicitudRequerimientoQuery} solicitudRequerimientoQuery - Query para observar el estado de los requerimientos asociados al trámite.
 */
  constructor(private router: Router,
    private consultaioStore: ConsultaioStore,
    private consultaioQuery: ConsultaioQuery,
    private solicitudRequerimientoQuery: SolicitudRequerimientoQuery,
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.guardarDatos = seccionState;
        })
      )
      .subscribe()
    this.solicitudRequerimientoQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.requerimientoState = seccionState;
        })
      )
      .subscribe();
    this.tramite = Number(this.guardarDatos?.procedureId);
    this.consultaioStore.solicitanteConsultaio({
      folioDelTramite: this.guardarDatos?.folioTramite,
      fechaDeInicio: FECHA_DE_INICIO,
      estadoDelTramite: this.guardarDatos?.estadoDeTramite,
      tipoDeTramite: this.guardarDatos?.tipoDeTramite
    });
  }
  /**
   * @method ngOnInit
   * @description Método del ciclo de vida que se ejecuta al inicializar el componente.
   * 
   * Si existe un trámite seleccionado (`this.tramite`), selecciona el trámite y establece el estado de consulta
   * llamando a `establecerConsultaio` en el store con los datos actuales del trámite.
   * Si no existe un trámite seleccionado, redirige al usuario a la pantalla de selección de trámite correspondiente
   * al departamento actual.
   * 
   * @returns {void}
   */
  ngOnInit(): void {
    if (this.tramite) {
      this.selectTramite(this.tramite);
    } else {
      this.router.navigate([`/${this.guardarDatos?.department.toLowerCase()}/seleccion-tramite`]);
    }
  }
  /**
   * @method loadComponent
   * @description Carga dinámicamente un componente hijo según la ruta especificada en el objeto recibido.
   * @param {ListaComponentes} li - Objeto que contiene la información y la ruta del componente a cargar.
   * @returns {Promise<void>}
   */
  async loadComponent(li: ListaComponentes): Promise<void> {
    if (!li.componentPath) {
      return;
    }
    this.viewChild = await li.componentPath() as Type<unknown>;
  }
  /**
   * @method viewChildcambioDePestana
   * @description Cambia el componente hijo mostrado según la pestaña seleccionada.
   * @param {Tabulaciones} id - Identificador de la pestaña seleccionada.
   * @returns {void}
   */
  viewChildcambioDePestana(id: Tabulaciones): void {
    const LI = this.slectTramite?.listaComponentes.find((v: ListaComponentes) => v.id === id.id);
    if (LI) {
      this.loadComponent(LI);
    }
  }
  /**
   * @method selectTramite
   * @description Selecciona el trámite a evaluar y actualiza la referencia del trámite seleccionado.
   * @param {number} i - Identificador del trámite.
   * @returns {void}
   */
  selectTramite(i: number): void {
    this.tramite = i;
    this.slectTramite = LISTA_TRIMITES.find((v) => v.tramite === i);
  }
  /**
   * @method seleccionaTab
   * @description Cambia la pestaña principal seleccionada.
   * @param {number} i - Índice de la pestaña.
   * @returns {void}
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }
  /**
   * @method seleccionaTabRequerimiento
   * @description Cambia la pestaña de dictamen seleccionada.
   * @param {number} i - Índice de la pestaña de dictamen.
   * @returns {void}
   */
  seleccionaTabRequerimiento(i: number): void {
    this.indiceDictamen = i;
  }
  /**
   * @method guardarFirmar
   * @description Activa la sección de firma electrónica.
   * @returns {void}
   */
  guardarFirmar(): void {
    this.firmar = true;
  }
  /**
   * @method enviarEvento
   * @description Maneja los eventos de guardar y cancelar provenientes de componentes hijos.
   * @param {{ events: string, datos: unknown }} e - Objeto con el tipo de evento y los datos asociados.
   * @returns {void}
   */
  enviarEvento(e: { events: string, datos: unknown }): void {
    switch (e.events) {
      case 'guardar':
        this.guardarFirmar();
        break;
      case 'cancelar':
        this.indice = 1;
        break;
      default:
    }
  }

  /**
   * @method continuar
   * @description Controla el flujo de avance entre pestañas y activa la firma si corresponde.
   * @returns {void}
   */
  continuar(): void {
    const DATOS = 3;
    if (this.indiceDictamen === 2 || Number(this.requerimientoState.idTipoRequerimiento) === DATOS) {
      this.guardarFirmar();
    } else {
      this.indiceDictamen = 2;
    }
  }
  /**
    * @method obtieneFirma
    * @description Navega a la bandeja de tareas pendientes tras obtener la firma electrónica.
    * @param {string} ev - Cadena que representa la firma obtenida.
    * @returns {void}
    */
  obtieneFirma(ev: string): void {
    const FIRMA: string = ev;
    if (FIRMA) {
      this.router.navigate(['bandeja-de-tareas-pendientes']);
    }
  }
  /**
   * @method cancelar
   * @description Método para restablecer los índices de las pestañas principales y de dictamen.
   * 
   * Este método se utiliza para reiniciar el flujo de navegación en el componente:
   * - Establece el índice de la pestaña principal (`indice`) en 1.
   * - Establece el índice de la pestaña de dictamen (`indiceDictamen`) en 1.
   * 
   * @returns {void}
   */
  cancelar(): void {
    this.indice = 1;
    this.indiceDictamen = 1;
  }
  /**
   * @method ngOnDestroy
   * @description Método del ciclo de vida que se ejecuta al destruir el componente.
   * 
   * Libera los recursos utilizados por el componente:
   * - Emite un valor en el `destroyNotifier$` para cancelar las suscripciones activas y evitar fugas de memoria.
   * - Completa el `destroyNotifier$`.
   * - Limpia el estado del trámite llamando a `solicitanteConsultaio` y `establecerConsultaio` en el store.
   * 
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
    this.consultaioStore.solicitanteConsultaio(null);
    this.consultaioStore.establecerConsultaio('', '', '', '', '', '', false, true, false);
  }

}
