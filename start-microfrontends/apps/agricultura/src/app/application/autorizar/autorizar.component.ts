import { AccuseComponentes, ListaComponentes, Tabulaciones } from '@libs/shared/data-access-user/src/core/models/lista-trimites.model';
import { Component, OnDestroy } from "@angular/core";
import { ConsultaioQuery, FECHA_DE_INICIO } from '@ng-mf/data-access-user';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { Subject } from 'rxjs';
import { Type } from "@angular/core";
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';

/**
 * @component
 * @name AutorizarComponent
 * @description Componente principal para la autorización de trámites en la aplicación AGA.
 * 
 * Este componente permite gestionar el flujo de autorización de un trámite, incluyendo la navegación entre pestañas,
 * la visualización de información relevante, la generación de dictámenes y la firma electrónica.
 * Utiliza servicios y stores para obtener y actualizar el estado del trámite.
 * 
 * @selector app-autorizar
 * @standalone true
 * @imports
 *  - CommonModule
 *  - ReviewersTabsComponent
 *  - EncabezadoRequerimientoComponent
 *  - FormsModule
 *  - ReactiveFormsModule
 *  - GenerarDictamenComponent
 *  - FirmaElectronicaComponent
 * @templateUrl ./autorizar.component.html
 * @styleUrl ./autorizar.component.scss
 */
@Component({
  selector: 'app-autorizar',
  standalone: true,
  imports: [CommonModule, ReviewersTabsComponent,
    EncabezadoRequerimientoComponent,
    FormsModule, ReactiveFormsModule,
    GenerarDictamenComponent,
    FirmaElectronicaComponent
  ],
  templateUrl: './autorizar.component.html',
  styleUrl: './autorizar.component.scss',
})
export class AutorizarComponent implements OnInit, OnDestroy {
  /**
 * @property {AccuseComponentes[]} listaTrimites
 * @description Lista de trámites disponibles para autorización, obtenida de la constante LISTA_TRIMITES.
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
   * @property {boolean} firmar
   * @description Indica si se debe mostrar la sección de firma electrónica.
   */
  firmar: boolean = false;
  /**
   * @property {Subject<void>} destroyNotifier$
   * @description Subject utilizado para cancelar las suscripciones y evitar fugas de memoria al destruir el componente.
   * @private
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * @property {ConsultaioState} guardarDatos
   * @description Estado actual del trámite consultado.
   */
  guardarDatos!: ConsultaioState;
  /**
   * @constructor
   * @description Constructor del componente. Inicializa los servicios y suscripciones necesarias para la autorización del trámite.
   * 
   * - Se suscribe al estado de consulta del trámite mediante `ConsultaioQuery` y actualiza la propiedad `guardarDatos` cada vez que cambia el estado.
   * - Inicializa el identificador del trámite (`tramite`) a partir del estado consultado.
   * - Llama al método `solicitanteConsultaio` del store para cargar los datos iniciales del trámite, utilizando el folio, la fecha de inicio y el estado del trámite.
   * 
   * @param {Router} router - Servicio de enrutamiento de Angular para navegación.
   * @param {ConsultaioStore} consultaioStore - Store para gestionar el estado de consulta del trámite.
   * @param {ConsultaioQuery} consultaioQuery - Query para observar el estado de consulta del trámite.
   */
  constructor(private router: Router,
    private consultaioStore: ConsultaioStore,
    private consultaioQuery: ConsultaioQuery,
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.guardarDatos = seccionState;
        })
      )
      .subscribe()
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
      console.error('Component not found in registry:');
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
        break;
      default:
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
      this.router.navigate([`confirmar-notificacion`], { state: { isAcuseRecibo: true } });
    }
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
