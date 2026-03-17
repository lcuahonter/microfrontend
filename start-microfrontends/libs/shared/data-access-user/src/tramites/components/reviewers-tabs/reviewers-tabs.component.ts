import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, Type, ViewChild, ViewContainerRef } from "@angular/core";
import { AcusesResolucionResponse } from "../../../core/models/shared/consulta-acuses-response.model";
import { BandejaAcusesComponent } from "../consulta-generica/bandeja-acuses/bandeja-acuses.component";
import { CommonModule } from "@angular/common";
import { DictamenesResponse } from "../../../core/models/shared/dictamenes-response.model";
import { DocumentoSolicitud } from "../../../core/models/shared/consulta-documentos-response.model";
import { DocumentosComponent } from "../consulta-generica/bandeja-documentos/documentos.component";
import { EnvioDigitalComponent } from "../consulta-generica/consulta-envio-digital/envio-digital.component";
import { EnvioDigitalResponse } from "../../../core/models/shared/envio-digital-response.model";
import { OpinionResponse } from "../../../core/models/shared/opinion-response.model";
import { RequerimientosResponse } from "../../../core/models/shared/requerimientos-response.model";
import { TabDictamenComponent } from "../consulta-generica/tab-dictamen/tab-dictamen.component";
import { TabOpinionComponent } from "../consulta-generica/tab-opinion/tab-opinion.component";
import { TabRequerimientoComponent } from "../../components/consulta-generica/tab-requerimiento/tab-requerimiento.component";
import { TabsResponse } from "../../../core/models/shared/consulta-tabs-response.model";
import { Tabulaciones } from "../../../core/models/lista-trimites.model";
import { TareasSolicitud } from "../../../core/models/shared/consulta-tareas-response.model";
import { TareasTramiteComponent } from "../consulta-generica/bandeja-tareas-tramite/tareas-tramite.component";
import tramiteDetailsData from '@libs/shared/theme/assets/json/shared/lista-trimites-tabs.json';





/**
 * @component
 * @name ReviewersTabsComponent
 * @description Componente para la visualización y navegación entre pestañas de revisión en el flujo de trámites.
 * 
 * Permite mostrar diferentes secciones o vistas mediante pestañas, facilitando la organización y acceso a la información relevante para los revisores.
 * 
 * @selector app-reviewers-tabs
 * @standalone true
 * @imports
 *  - CommonModule
 * @templateUrl ./reviewers-tabs.component.html
 * @styleUrl ./reviewers-tabs.component.scss
 */@Component({
  selector: 'app-reviewers-tabs',
  standalone: true,
  imports: [CommonModule, DocumentosComponent, TabDictamenComponent, TabRequerimientoComponent, TabOpinionComponent, BandejaAcusesComponent, TareasTramiteComponent, EnvioDigitalComponent],
  templateUrl: './reviewers-tabs.component.html',
  styleUrl: './reviewers-tabs.component.scss',
})
export class ReviewersTabsComponent implements OnChanges, OnInit {

   /**
   * @property {boolean} isAtenderRequerimiento
   * @description Indica si se está atendiendo un requerimiento.
   */
   @Input() isAtenderRequerimiento: boolean = false;
   
  /**
   * @property {boolean} isIniciado
   * @description Indica si el trámite ha sido iniciado.
   */
  @Input() isIniciado: boolean = false;
  /**
   * @property {number} indice
   * @description Índice de la pestaña actualmente seleccionada.
   */
  indice: number = 0;
  /**
   * @property {Tabulaciones[]} listaDeTabulaciones
   * @description Lista de objetos que representan las pestañas disponibles para navegación.
   */

  listaDeTabulaciones: Tabulaciones[] = tramiteDetailsData;
  /**
   * @property {number} tramite
   * @description Identificador del trámite asociado a las pestañas.
   */
  @Input() tramite!: number;
  /**
   * @property {Type<unknown>} viewChild
   * @description Referencia al componente hijo que se debe mostrar en la pestaña activa.
   */
  @Input() viewChild!: Type<unknown>;

  /**
   * @property {TabsResponse[]} tabs
   * @description Tabs de solicitud.
   */
  @Input() tabs!: TabsResponse;

  @Input() departamento: string='';

  /**
   * @property {DocumentoSolicitud[]} documentos
   * @description Documentos de solicitud.
   */
  @Input() documentos: DocumentoSolicitud[] = [];

  /**
   * @property {TareasSolicitud[]} tareasSolicitud
   * @description Tareas de solicitud.
   */
  @Input() tareasSolicitud: TareasSolicitud[] = [];

  /** Opiniones recibidas desde el componente padre */
  @Input() opinion: OpinionResponse[] = [];

  /**
   * @property {RequerimientosResponse[]} requerimientos
   * @description Requerimientos de solicitud.
   */
  @Input() requerimientos: RequerimientosResponse[] = [];

  /**
   * @property {DictamenesResponse[]} dictamenes
   * @description Dictamenes de solicitud.
   */
  @Input() dictamenes: DictamenesResponse[] = [];

  /**
   * @property {AcusesResolucionResponse[]} acusesResolucion
   * @description Acuses de resolución asociados al trámite.
   */
  @Input() acusesResolucion!: AcusesResolucionResponse;

  /**
   * @property {EnvioDigitalResponse} envioDigital
   * @description Respuesta del envío digital asociado al trámite.
   */
  @Input() envioDigital!: EnvioDigitalResponse;

  /**
   * @property {EventEmitter<number>} onTabSeleccionado
   * @description Evento emitido cuando se selecciona una pestaña, enviando el índice de la pestaña seleccionada.
   */
  @Output() tabSeleccionado = new EventEmitter<number>();

  /**
   * @property {EventEmitter<Tabulaciones>} viewChildcambioDePestana
   * @description Evento emitido cuando se cambia de pestaña, enviando el objeto de tabulación seleccionado.
   */
  @Output() viewChildcambioDePestana = new EventEmitter<Tabulaciones>();

  /**
   * @property {boolean} isFechasDetalleDictamenes
   * @description Indica si se deben mostrar las fechas en el detalle de los dictámenes.
   */
  @Input() isFechasDetalleDictamenes: boolean = false;

  /**
   * @property {ViewContainerRef} childContainer
   * @description Referencia al contenedor donde se insertan dinámicamente los componentes hijos.
   */
  @ViewChild('childContainer', { read: ViewContainerRef }) childContainer!: ViewContainerRef;

  /**
   * @property {Record<string, number>} TAB_INDEX
   * @description Mapeo de los identificadores de las pestañas a sus respectivos índices.
   */
  TAB_INDEX: Record<string, number> = {
    "solicitud": 0,
    "documentos": 1,
    "dictamen": 2,
    "requerimientos": 3,
    "opiniones": 4,
    "resoluciones": 5,
    "tareas": 6,
    "enviodigital": 7
  };
  /**
   * @method ngOnInit
   * @description Método del ciclo de vida que se ejecuta al inicializar el componente.
   * 
   * Filtra la lista de tabulaciones según el trámite recibido por input y selecciona la primera pestaña por defecto.
   * 
   * @returns {void}
   */
  ngOnInit(): void {
    if (this.listaDeTabulaciones) {
      this.seleccionaTab(0, this.listaDeTabulaciones[0]);
    }
  }
  /**
   * @method ngOnChanges
   * @description Método del ciclo de vida que se ejecuta cuando cambian las propiedades de entrada del componente.
   * 
   * Si cambia la propiedad `viewChild` y existe un nuevo valor, actualiza las pestañas llamando al método `updateTabs`.
   * 
   * @param {SimpleChanges} changes - Objeto que contiene los cambios de las propiedades de entrada.
   * @returns {void}
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['viewChild'] && this.viewChild) {
      this.updateTabs();
    }

    if (!this.tabs) { return; }

    // Mapper entre los nombres del servicio y los ids del JSON
    const TABSMAPPER: Record<string, string> = {
      solicitudes: "solicitud",
      documentos: "documentos",
      dictamenes: "dictamen",
      requerimientos: "requerimientos",
      opiniones: "opiniones",
      acusesResoluciones: "resoluciones",
      tareaTramite: "tareas",
      envioDigital: "enviodigital",
      estadoTransmision: ""
    };

    this.listaDeTabulaciones = tramiteDetailsData
      .map(tab => {
        // Buscar el nombre correspondiente en TabsResponse
        const TABKEY = Object.keys(TABSMAPPER).find(
          key => TABSMAPPER[key] === tab.id
        );

        if (!TABKEY) { return null; }

        const VALUE = this.tabs[TABKEY as keyof TabsResponse];

        if (VALUE === null) { return null; }
        return {
          ...tab,
          disabled: VALUE === false,
          visible: VALUE !== null
        };
      })
      .filter(Boolean) as Tabulaciones[];
  }
  /**
   * @method seleccionaTab
   * @description Cambia la pestaña seleccionada según el índice y la tabulación recibida. Si la pestaña está deshabilitada, no realiza ninguna acción.
   * Actualiza el índice de la pestaña activa, emite el evento de cambio de pestaña y actualiza las pestañas después de un breve retraso.
   * 
   * @param {number} i - Índice de la pestaña seleccionada.
   * @param {Tabulaciones} j - Objeto de tabulación correspondiente a la pestaña seleccionada.
   * @returns {void}
   */
  seleccionaTab(i: number, j: Tabulaciones): void {
    if (j?.disabled) { return }
    this.indice = i;
    this.viewChildcambioDePestana.emit(j);
    this.tabSeleccionado.emit(i);
    setTimeout(() => {
      this.updateTabs();
    }, 100);
  }
  /**
   * @method updateTabs
   * @description Actualiza el contenido del contenedor de vistas (`childContainer`) creando dinámicamente el componente hijo correspondiente a la pestaña seleccionada.
   * 
   * Si existen referencias válidas tanto para el contenedor como para el componente hijo, limpia el contenedor y crea el nuevo componente.
   * 
   * @returns {void}
   */
  updateTabs(): void {
    if (this.childContainer && this.viewChild) {
      this.childContainer.clear();
      this.childContainer.createComponent(this.viewChild);
    }
  }
}
