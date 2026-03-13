import { AccuseComponentes, ListaComponentes, Tabulaciones } from "../../../core/models/lista-trimites.model";
import { Component, Input, OnDestroy, OnInit, Type } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Subject, filter, take } from "rxjs";
import { AcusesResolucionResponse } from "../../../core/models/shared/consulta-acuses-response.model";
import { CommonModule } from "@angular/common";
import { DictamenesResponse } from "../../../core/models/shared/dictamenes-response.model";
import { DocumentoSolicitud } from "../../../core/models/shared/consulta-documentos-response.model";
import { EnvioDigitalResponse } from "../../../core/models/shared/envio-digital-response.model";
import { OpinionResponse } from "../../../core/models/shared/opinion-response.model";
import { RequerimientosResponse } from "../../../core/models/shared/requerimientos-response.model";
import { ReviewersTabsComponent } from "../reviewers-tabs/reviewers-tabs.component";
import { TabsResponse } from "../../../core/models/shared/consulta-tabs-response.model";
import { TabsSolicitudService } from "../../../core/services/tabsSolicitud.service";
import { TareasActivas } from "../../../core/models/consulta-tramite.model";
import { TareasSolicitud } from "../../../core/models/shared/consulta-tareas-response.model";

import { ConsultaioQuery, ConsultaioStore, TabsConfigService } from "@libs/shared/data-access-user/src";

import { CategoriaMensaje, Notificacion } from "../notificaciones/notificaciones.component";
import { TabsConfiguracion } from "../../../core/models/tabs-config/tabs-config.model";
@Component({
    selector: 'lib-datos-generales-del-tramite-component',
    standalone: true,
    styleUrl: "./datos-generales-del-tramite.component.scss",
    templateUrl: "./datos-generales-del-tramite.component.html",
    imports: [CommonModule, ReactiveFormsModule, ReviewersTabsComponent]
})
export class DatosGeneralesDelTramiteComponent implements OnInit, OnDestroy {
    /** 
    * Subject para destruir las suscripciones.
    */
    private destroy$: Subject<void> = new Subject()
    /** Formulario de tramite */
    public FormTramite!: FormGroup;

    /** Lista de tareas activas */
    tareas: TareasActivas[] = [];

    /**
     * @property {boolean} isFechasDetalleDictamenes
     * @description Indica si se deben mostrar las fechas en el detalle de los dictámenes.
     */
    @Input() isFechasDetalleDictamenes!: boolean;

    constructor(
        private fb: FormBuilder,
        private tabsSolicitudServiceTsService: TabsSolicitudService,
        private consultaioStore: ConsultaioStore,
        private consultaioQuery: ConsultaioQuery,
        private tabsConfigService: TabsConfigService,
    ) { }


    /**TABS */
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
    folioTramite: string = ''
    /**
     * @property {TabsResponse} tabs
     * @description Almacena la respuesta de pestañas disponibles.
     */
    tabs!: TabsResponse;
    /**
     * @property {DocumentoSolicitud[]} documentos
     * @description Documentos de solicitud.
     */
    documentosSolicitud: DocumentoSolicitud[] = [];
    /**
     * @property {TareasSolicitud[]} tareasSolicitud
     * @description Tareas de solicitud.
     */
    tareasSolicitud: TareasSolicitud[] = [];
    /**
     * @property {DictamenesResponse[]} dictamenesSolicitud
     * @description Dictamenes de solicitud.
     */
    dictamenesSolicitud: DictamenesResponse[] = [];
    /**
     * @property {EnvioDigitalResponse} envioDigital
     * @description Respuesta del envío digital asociado al trámite.
     */
    envioDigital!: EnvioDigitalResponse;
    /** Listado de opiniones registradas para el trámite. */
    opinion: OpinionResponse[] = [];
    /**
     * @property {RequerimientosResponse[]} requerimientosSolicitud
     * @description Requerimientos de solicitud.
     */
    requerimientosSolicitud: RequerimientosResponse[] = [];
    /**
     * @property {AcusesResolucionResponse[]} acusesResolucion
     * @description Acuses de resolución asociados al trámite.
     */
    acusesResolucion!: AcusesResolucionResponse;
    /**
     * @property {AccuseComponentes | undefined} slectTramite
     * @description Objeto que representa el trámite seleccionado actualmente.
     */
    slectTramite!: AccuseComponentes | undefined;
    /**
     * @property {boolean} yaCargoDocumentos
     * @description Indica si los documentos de la solicitud ya han sido cargados.
     */
    yaCargoDocumentos = false;
    /**
   * @property {boolean} yaCargoTareas
   * @description Indica si las tareas de la solicitud ya han sido cargadas.
   */
    yaCargoTareas = false;
    /** Nueva notificación a gestionar */
    nuevaNotificacion!: Notificacion;

    /**
  * @property {boolean} yaCargoDictamenes
  * @description Indica si los dictamenes ya han sido cargados.
  */
    yaCargoDictamenes = false;

    /**
 * @property {boolean} yaCaegoRequerimientos
 * @description Indica si los requerimientos ya han sido cargados.
 */
    yaCargoRequerimientos = false;

    /**
     * @property {boolean} yaCargoEnvioDigital
     * @description Indica si el envío digital ya ha sido cargado.
     */
    yaCargoEnvioDigital = false;

    /** Indica si la opinión ya ha sido cargada. */
    yaCargoOpinion = false;
    /**
 * @property {boolean} yaCargoAcuses
 * @description Indica si los acuses de resolución ya han sido cargados.
 */
    yaCargoAcuses = false;

    idSolicitud: string = '';
    onIniyaCargoOpinion: boolean = false;

    /**
     * @property {AccuseComponentes[] } listaTramites
     * @description Lista de trámites disponibles para evaluación, obtenida de la constante LISTA_TRIMITES.
     */
    @Input() listaTramites: AccuseComponentes[] = [];

    /**
     * @property {TabsConfiguracion} tabsConfig
     * @description Configuración de las pestañas específicas del trámite, obtenida del servicio TramiteConfigService.
     */
    tabsConfig!: TabsConfiguracion;

    inicializaFormTramite(): void {
        this.FormTramite = this.fb.group({
            numeroDeTramite: [{ value: '', disabled: true }],
            tipoDeSolicitud: [{ value: '', disabled: true }],
            diasHabilesTranscurridos: [{ value: '', disabled: true }],
            tareasActivas: [[]]
        });
    }
    /**
    * Consulta los datos generales del tramite
    * @returns {void}
    */
    consultarDetalleDelTramite(): void {

        const FOLIO_TRAMITE = localStorage.getItem('folioTramite') || '';
        const TIPO_TRAMITE = localStorage.getItem('tipoTramite') || '';
        const ID_SOLICITUD = localStorage.getItem('idSolicitud') || '';
        const TIPO_SOLICITUD = localStorage.getItem('tipoSolicitud') || '';
        const DIAS_HABILES_TRANSCURRIDOS = localStorage.getItem('diaHabilesTranscurridos') || '';
        const TAREAS_ACTIVAS = JSON.parse(localStorage.getItem('tareasActivas') || '[]');
        const ACRONIMO = localStorage.getItem('acronimo') || '';

        this.FormTramite.patchValue({
            numeroDeTramite: FOLIO_TRAMITE,
            tipoDeSolicitud: TIPO_SOLICITUD,
            diasHabilesTranscurridos: DIAS_HABILES_TRANSCURRIDOS,
            tareasActivas: TAREAS_ACTIVAS
        });

        this.tramite = Number(TIPO_TRAMITE);
        this.folioTramite = FOLIO_TRAMITE;
        this.idSolicitud = ID_SOLICITUD;
        this.selectTramite(this.tramite)
        this.tareas = TAREAS_ACTIVAS;
        

        this.consultaioStore.establecerConsultaio(
            TIPO_TRAMITE,
            "consulta-tramite",
            ACRONIMO,
            FOLIO_TRAMITE,
            String(this.tramite),
            "",
            true,
            false,
            true,
            "",
            "",
            this.idSolicitud
        );
        this.consultaioQuery.selectConsultaioState$
            .pipe(
                filter(state => Boolean(state.folioTramite) && state.folioTramite.trim().length > 0),
                take(1)
            )
            .subscribe((state) => {
                this.getTabs();
            });
        setTimeout(() => {
            [
                'folioTramite',
                'tipoTramite',
                'idSolicitud',
                'acronimo',
                'tipoSolicitud',
                'diaHabilesTranscurridos',
                'tareasActivas'
            ].forEach(key => localStorage.removeItem(key));
        },500)
    }


    /**
     * METODOS PARA TABS
    */
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
        this.slectTramite = this.listaTramites.find((v) => v.tramite === i);
    }
    /**
 * @method getTabs
 * @description Obtiene las pestañas disponibles para el trámite
 * 
 * Realiza una petición al servicio para recuperar las pestañas habilitadas
 * para el trámite actual. Asigna las pestañas a la variable tabs si la respuesta
 * es exitosa (código '00'), o muestra un error en caso contrario.
 * 
 * @returns {void}
*/
    getTabs(): void {

        this.tabsSolicitudServiceTsService.getTabs(this.tramite, this.idSolicitud)
            .subscribe({
                next: (response) => {
                    if (response.codigo === '00') {
                        this.tabs = response.datos ?? {} as TabsResponse;
                    } else {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        this.nuevaNotificacion = {
                            tipoNotificacion: 'toastr',
                            categoria: CategoriaMensaje.ERROR,
                            modo: 'action',
                            titulo: response.error || 'Error en solicitud estado.',
                            mensaje:
                                response.causa ||
                                response.mensaje ||
                                response.error ||
                                'Error en opciones solicitud estado.',
                            cerrar: false,
                            txtBtnAceptar: '',
                            txtBtnCancelar: '',
                        };
                    }
                },
                error: (error) => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    this.nuevaNotificacion = {
                        tipoNotificacion: 'toastr',
                        categoria: CategoriaMensaje.ERROR,
                        modo: 'action',
                        titulo: '',
                        mensaje: error?.error?.error || 'Error inesperado en solicitud estado.',
                        cerrar: false,
                        txtBtnAceptar: '',
                        txtBtnCancelar: '',
                    };
                }
            });
    }


    /**
     * @method getDocumentosSolicitud
     * @description Método para obtener los documentos asociados a una solicitud.
     * 
     * Realiza una petición al servicio tabsSolicitudServiceTsService para recuperar los documentos
     * vinculados al ID de solicitud proporcionado. Asigna los documentos a la variable documentosSolicitud
     * si la respuesta es exitosa (código '00'), o muestra un error en caso contrario.
     * 
     * @returns {void}
    */
    getDocumentosSolicitud(): void {

        this.tabsSolicitudServiceTsService.getDocumentosSolicitud(this.tramite, this.idSolicitud)
            .subscribe({
                next: (response) => {
                    if (response.codigo === '00') {
                        this.documentosSolicitud = response.datos ?? [];
                    } else {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        this.nuevaNotificacion = {
                            tipoNotificacion: 'toastr',
                            categoria: CategoriaMensaje.ERROR,
                            modo: 'action',
                            titulo: response.error || 'Error en documentos.',
                            mensaje:
                                response.causa ||
                                response.mensaje ||
                                response.error ||
                                'Error en documentos.',
                            cerrar: false,
                            txtBtnAceptar: '',
                            txtBtnCancelar: '',
                        };
                    }
                },
                error: (error) => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    this.nuevaNotificacion = {
                        tipoNotificacion: 'toastr',
                        categoria: CategoriaMensaje.ERROR,
                        modo: 'action',
                        titulo: '',
                        mensaje: error?.error?.error || 'Error inesperado en documentos.',
                        cerrar: false,
                        txtBtnAceptar: '',
                        txtBtnCancelar: '',
                    };
                }
            });
    }
    /**
 * @method TareasSolicitud
 * @description Método para obtener las tareas asociadas a una solicitud.
 * 
 * Realiza una petición al servicio tabsSolicitudServiceTsService para recuperar las tareas
 * vinculados al ID de solicitud proporcionado. Asigna las tareas a la variable tareasSolicitud
 * si la respuesta es exitosa (código '00'), o muestra un error en caso contrario.
 * 
 * @returns {void}
*/
    getTareasSolicitud(): void {

        this.tabsSolicitudServiceTsService.getTareasSolicitud(this.tramite, this.folioTramite)
            .subscribe({
                next: (response) => {
                    if (response.codigo === '00') {
                        this.tareasSolicitud = response.datos ?? [];
                    } else {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        this.nuevaNotificacion = {
                            tipoNotificacion: 'toastr',
                            categoria: CategoriaMensaje.ERROR,
                            modo: 'action',
                            titulo: response.error || 'Error en tareas.',
                            mensaje:
                                response.causa ||
                                response.mensaje ||
                                response.error ||
                                'Error en tareas.',
                            cerrar: false,
                            txtBtnAceptar: '',
                            txtBtnCancelar: '',
                        };
                    }
                },
                error: (error) => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    this.nuevaNotificacion = {
                        tipoNotificacion: 'toastr',
                        categoria: CategoriaMensaje.ERROR,
                        modo: 'action',
                        titulo: '',
                        mensaje: error?.error?.error || 'Error inesperado en tareas.',
                        cerrar: false,
                        txtBtnAceptar: '',
                        txtBtnCancelar: '',
                    };
                }
            });
    }
    /**
   * @method getDictamenes
   * @description Método para obtener los dictámenes asociados a un trámite.
   *
   * Realiza una petición al servicio tabsSolicitudServiceTsService para recuperar los dictámenes
   * vinculados al número de folio proporcionado. Procesa la respuesta si es exitosa (código '00'),
   * o muestra un error en caso contrario.
   *
   * @returns {void}
   */
    getDictamenes(): void {

        this.tabsSolicitudServiceTsService.getDictamenes(this.tramite, this.folioTramite)
            .subscribe({
                next: (response) => {
                    if (response.codigo === '00') {
                        this.dictamenesSolicitud = response.datos ?? [];
                    } else {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        this.nuevaNotificacion = {
                            tipoNotificacion: 'toastr',
                            categoria: CategoriaMensaje.ERROR,
                            modo: 'action',
                            titulo: response.error || 'Error en dictamenes.',
                            mensaje:
                                response.causa ||
                                response.mensaje ||
                                response.error ||
                                'Error en dictamenes.',
                            cerrar: false,
                            txtBtnAceptar: '',
                            txtBtnCancelar: '',
                        };
                    }
                },
                error: (error) => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    this.nuevaNotificacion = {
                        tipoNotificacion: 'toastr',
                        categoria: CategoriaMensaje.ERROR,
                        modo: 'action',
                        titulo: '',
                        mensaje: error?.error?.error || 'Error inesperado en dictamenes.',
                        cerrar: false,
                        txtBtnAceptar: '',
                        txtBtnCancelar: '',
                    };
                }
            });
    }

    /**
 * @method getRequerimientos
 * @description Método para obtener los requerimientos asociados a un trámite.
 *
 * Realiza una petición al servicio tabsSolicitudServiceTsService para recuperar los requerimientos
 * vinculados al número de folio proporcionado. Asigna los requerimientos a la variable requerimientosSolicitud
 * si la respuesta es exitosa (código '00'), o muestra un error en caso contrario.
 *
 * @returns {void}
 */
    getRequerimientos(): void {

        this.tabsSolicitudServiceTsService.getRequerimientos(this.tramite, this.folioTramite)
            .subscribe({
                next: (response) => {
                    if (response.codigo === '00') {
                        this.requerimientosSolicitud = response.datos ?? [];
                    } else {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        this.nuevaNotificacion = {
                            tipoNotificacion: 'toastr',
                            categoria: CategoriaMensaje.ERROR,
                            modo: 'action',
                            titulo: response.error || 'Error en requerimientos.',
                            mensaje:
                                response.causa ||
                                response.mensaje ||
                                response.error ||
                                'Error en requerimientos.',
                            cerrar: false,
                            txtBtnAceptar: '',
                            txtBtnCancelar: '',
                        };
                    }
                },
                error: (error) => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    this.nuevaNotificacion = {
                        tipoNotificacion: 'toastr',
                        categoria: CategoriaMensaje.ERROR,
                        modo: 'action',
                        titulo: '',
                        mensaje: error?.error?.error || 'Error inesperado en requerimientos.',
                        cerrar: false,
                        txtBtnAceptar: '',
                        txtBtnCancelar: '',
                    };
                }
            });
    }

    /**
   * Obtiene las opiniones asociadas al trámite actual usando un folio predefinido.
   * Maneja la respuesta del servicio y actualiza la propiedad 'opinion' del componente.
   * En caso de error, lo registra en la consola.
   * 
   * @returns {void}
   */
    getOpiniones(): void {

        this.tabsSolicitudServiceTsService.getOpiniones(this.tramite, this.folioTramite)
            .subscribe({
                next: (response) => {
                    if (response.codigo === '00') {
                        this.opinion = response.datos ?? [];
                    } else {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        this.nuevaNotificacion = {
                            tipoNotificacion: 'toastr',
                            categoria: CategoriaMensaje.ERROR,
                            modo: 'action',
                            titulo: response.error || 'Error en opiniones.',
                            mensaje:
                                response.causa ||
                                response.mensaje ||
                                response.error ||
                                'Error en opiniones.',
                            cerrar: false,
                            txtBtnAceptar: '',
                            txtBtnCancelar: '',
                        };
                    }
                },
                error: (error) => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    this.nuevaNotificacion = {
                        tipoNotificacion: 'toastr',
                        categoria: CategoriaMensaje.ERROR,
                        modo: 'action',
                        titulo: '',
                        mensaje: error?.error?.error || 'Error inesperado en opiniones.',
                        cerrar: false,
                        txtBtnAceptar: '',
                        txtBtnCancelar: '',
                    };
                }
            });
    }

    /**
   * @method getEnvioDigital
   * @description Método para obtener el envío digital asociado a un trámite.
   */
    getEnvioDigital(): void {

        this.tabsSolicitudServiceTsService.getEnvioDigital(this.tramite, this.folioTramite)
            .subscribe({
                next: (response) => {
                    if (response.codigo === '00') {
                        this.envioDigital = response.datos ?? {} as EnvioDigitalResponse;
                    } else {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        this.nuevaNotificacion = {
                            tipoNotificacion: 'toastr',
                            categoria: CategoriaMensaje.ERROR,
                            modo: 'action',
                            titulo: response.error || 'Error en envio digital',
                            mensaje:
                                response.causa ||
                                response.mensaje ||
                                response.error ||
                                'Error en envio digital.',
                            cerrar: false,
                            txtBtnAceptar: '',
                            txtBtnCancelar: '',
                        };
                    }
                },
                error: (error) => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    this.nuevaNotificacion = {
                        tipoNotificacion: 'toastr',
                        categoria: CategoriaMensaje.ERROR,
                        modo: 'action',
                        titulo: '',
                        mensaje: error?.error?.error || 'Error inesperado en envio digital.',
                        cerrar: false,
                        txtBtnAceptar: '',
                        txtBtnCancelar: '',
                    };
                }
            });
    }

    /**
   * @method ngOnDestroy
   * @description Método del ciclo de vida que se ejecuta al destruir el componente.
   * 
   * Cancela todas las suscripciones activas para evitar fugas de memoria.
   * 
   * @returns {void}
   */
    getAcusesResolucion(): void {

        this.tabsSolicitudServiceTsService.getAcusesResolucion(this.tramite, this.folioTramite)
            .subscribe({
                next: (response) => {
                    if (response.codigo === '00') {
                        this.acusesResolucion = response.datos ?? {} as AcusesResolucionResponse;
                    } else {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        this.nuevaNotificacion = {
                            tipoNotificacion: 'toastr',
                            categoria: CategoriaMensaje.ERROR,
                            modo: 'action',
                            titulo: response.error || 'Error en acuse.',
                            mensaje:
                                response.causa ||
                                response.mensaje ||
                                response.error ||
                                'Error en acuse.',
                            cerrar: false,
                            txtBtnAceptar: '',
                            txtBtnCancelar: '',
                        };
                    }
                },
                error: (error) => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    this.nuevaNotificacion = {
                        tipoNotificacion: 'toastr',
                        categoria: CategoriaMensaje.ERROR,
                        modo: 'action',
                        titulo: '',
                        mensaje: error?.error?.error || 'Error inesperado en acuse.',
                        cerrar: false,
                        txtBtnAceptar: '',
                        txtBtnCancelar: '',
                    };
                }
            });
    }

    /**
     * @method ngOnDestroy
     * @description Método del ciclo de vida que se ejecuta al destruir el componente.
     * 
     * Cancela todas las suscripciones activas para evitar fugas de memoria.
     * 
     * @returns {void}
     */
    onTabSeleccionado(indice: number): void {
        if (indice === 1 && !this.yaCargoDocumentos) {
            this.yaCargoDocumentos = true;
            this.getDocumentosSolicitud();
        }

        if (indice === 6 && !this.yaCargoTareas) {
            this.yaCargoTareas = true;
            this.getTareasSolicitud();
        }

        if (indice === 2 && !this.yaCargoDictamenes) {
            this.yaCargoDictamenes = true;
            this.getDictamenes();
        }

        if (indice === 3 && !this.yaCargoRequerimientos) {
            this.yaCargoRequerimientos = true;
            this.getRequerimientos();
        }

        if (indice === 4 && !this.yaCargoOpinion) {
            this.yaCargoOpinion = true;
            this.getOpiniones();
        }

        if (indice === 7 && !this.yaCargoEnvioDigital) {
            this.yaCargoEnvioDigital = true;
            this.getEnvioDigital();
        }

        if (indice === 5 && !this.yaCargoAcuses) {
            this.yaCargoAcuses = true;
            this.getAcusesResolucion();
        }
    }
    /** Ciclo De vida del componente */
    ngOnInit(): void {
        this.inicializaFormTramite();
        this.consultarDetalleDelTramite()
        this.tabsConfig = this.tabsConfigService.getTabsConfiguracion(this.tramite);
    }


    /**
    * Se ejecuta al destruir el componente.
    * Emite un valor y completa el subject `destruirNotificador$` para cancelar las suscripciones.
    */
    ngOnDestroy(): void {
        this.consultaioStore.reset();
        this.destroy$.next();
        this.destroy$.complete();
    }

}