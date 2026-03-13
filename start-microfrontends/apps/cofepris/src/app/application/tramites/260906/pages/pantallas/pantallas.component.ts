import { AVISO, Datos, DatosPasos, JSONResponse, ListaPasosWizard, LoginQuery } from '@libs/shared/data-access-user/src';
import { Component, EventEmitter, OnInit, viewChild, ViewChild } from '@angular/core';
import { Sanitario260906Store, Solicitud260906State } from '../../../../estados/tramites/sanitario260906.store';
import { Subject, map, take, takeUntil } from 'rxjs';
import { AccionBoton } from '@libs/shared/data-access-user/src/core/models/31601/servicios-pantallas.model';
import { DatosDelSolicituteSeccionQuery } from '../../../../shared/estados/queries/datos-del-solicitute-seccion.query';
import { DatosDelSolicituteSeccionState } from '../../../../shared/estados/stores/datos-del-solicitute-seccion.store';
import { GuardarAdapter_260906 } from '../../adapters/guardar-payload.adapter';
import { PANTA_PASOS } from '@libs/shared/data-access-user/src/core/services/31601/servicios-pantallas.enum';
import { Permiso260906Query } from '../../../../estados/queries/permiso260906.query';
import { PermisoImportacionBiologicaQuery } from '../../../../shared/estados/permiso-importacion-biologica.query';
import { PermisoImportacionBiologicaState } from '../../../../shared/estados/permiso-importacion-biologica.store';
import { SanitarioService } from '../../services/sanitario.service';
import { TercerosRelacionadasState } from '../../../../shared/estados/stores/terceros-relacionados.stores';
import { TercerosRelacionadosQuery } from '../../../../shared/estados/queries/terceros-relacionados.query';
import { ToastrService } from 'ngx-toastr';
import { WizardComponent } from '@ng-mf/data-access-user';
import { DatosComponent } from '../datos/datos.component';
import { ERROR_FORMA_ALERT } from '../../constantes/certificado-sgp.enum';
 
/**
 * @component
 * @name PantallasComponent
 * @description
 * Componente que gestiona la visualización de pantallas y permite cambiar entre diferentes pasos o pestañas.
 */
@Component({
  selector: 'app-pantallas',
  templateUrl: './pantallas.component.html',
})
export class PantallasComponent implements OnInit{
  /**
   * Lista de pasos del wizard.
   * @type {ListaPasosWizard[]}
   */
  public pantallasPasos: ListaPasosWizard[] = PANTA_PASOS;
 
  /**
   * Índice del paso actual.
   * @type {number}
   * @default 1
   */
  public indice: number = 1;
 
  /**
   * Referencia al componente Wizard para controlar la navegación entre pasos.
   * @type {WizardComponent}
   */
  @ViewChild(WizardComponent)
  public wizardComponent!: WizardComponent;
 
  /**
   * Datos utilizados para el control del wizard.
   * @type {DatosPasos}
   */
  public datosPasos: DatosPasos = {
    nroPasos: this.pantallasPasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Notificador para destruir los observables y evitar posibles fugas de memoria.
   * @private
   * @type {Subject<void>}
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * Indica si el botón para cargar archivos está habilitado.
   */
  activarBotonCargaArchivos: boolean = false;

  /**
   * Evento que se emite para cargar archivos.
   * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de
   */
  cargarArchivosEvento = new EventEmitter<void>();

  /**
   * Estado actual de la solicitud 110219.
   *
   * Esta propiedad mantiene la información de la solicitud en curso y
   * se sincroniza de manera reactiva con el store correspondiente.
   * Contiene los datos necesarios para representar y manipular
   * la solicitud dentro del componente.
   *
   * @type {Solicitud110219State}
   * @public
   */
  public solicitudState!: Solicitud260906State;
  public datosState!: DatosDelSolicituteSeccionState;
  public tercerosState!:TercerosRelacionadasState;
  public pagoDerechos!: PermisoImportacionBiologicaState;
  
  seccionCargarDocumentos: boolean = false;
  cargaEnProgreso: boolean = false;

  /**
   * @property {boolean} esFormaValido
   * @description
   * Indica si el formulario del paso actual es válido.
   * Se utiliza para mostrar mensajes de error o controlar la navegación en el asistente.
   */
  esFormaValido: boolean = false;

  loginRfc: string = '';

  @ViewChild('datosComponent') datosComponent!: DatosComponent;

  /**
   * @property {boolean} isSaltar
   * @description
   * Indica si se debe saltar al paso de firma. Controla la navegación
   * directa al paso de firma en el wizard.
   * @default false - No salta por defecto
   */
  isSaltar: boolean = false;

    /**
   * @property {string} TEXTOS
   * @description
   * Texto de aviso utilizado en el componente.
   */
  TEXTOS: string = AVISO.Aviso;

  /**
   * @property {string} infoAlert
   * @description
   * Clase CSS para aplicar estilos a los mensajes de información.
   */
  public infoAlert = 'alert-info  text-center';

  /**
   * @property {Object} formErrorAlert
   * @description
   * Objeto que contiene la configuración del mensaje de error para formularios inválidos.
   * Utiliza la constante `ERROR_FORMA_ALERT` definida en las enumeraciones del certificado SGP.
   * Define el título, mensaje y opciones de visualización para la alerta de error de validación de formularios.
   */
  public formErrorAlert = ERROR_FORMA_ALERT;

  /**
   * Identificador numérico de la solicitud actual.
   * Se inicializa en 0 y se utiliza para referenciar la solicitud en curso.
   */
  idSolicitudState: number = 0;

  /**
   * Constructor del componente.
   */
  constructor(
    public sanitarioService: SanitarioService,
    private query: Permiso260906Query,
    private datosQuery: DatosDelSolicituteSeccionQuery,
    private pagoQuery: PermisoImportacionBiologicaQuery,
    private tercerosQuery: TercerosRelacionadosQuery,
    private store: Sanitario260906Store,
    private toastr: ToastrService,
    private loginQuery: LoginQuery
  ) {
    this.query.selectSolicitud$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((solicitud) => {
        this.solicitudState = solicitud;
      });

    this.loginQuery.selectLoginState$.pipe(takeUntil(this.destroyNotifier$),
      map((seccionState) => {
        this.loginRfc = seccionState.rfc;
      })).subscribe();
  }

  ngOnInit(): void {
    this.query.selectSolicitud$.pipe().subscribe((data) => {
      this.solicitudState = data;
    });

    this.datosQuery.selectSolicitud$.pipe().subscribe((data) => {
      this.datosState = data;
    });

    this.pagoQuery.selectSolicitud$.pipe().subscribe((data) => {
      this.pagoDerechos = data;
    });

    this.tercerosQuery.selectSolicitud$.pipe().subscribe((data) => {
      this.tercerosState = data;
    });
  }

  /**
   * Método para actualizar el índice del paso actual en el asistente.
   * También navega al siguiente o al paso anterior según la acción especificada.
   *
   * Objeto de tipo `AccionBoton` que contiene:
   *  - `valor`: El nuevo índice del paso.
   *  - `accion`: La acción a realizar ('cont' para continuar o 'ant' para retroceder).
   */
  getValorIndice(e: AccionBoton): void {
    this.esFormaValido = false;
    if (this.indice === 1 && e.accion === 'cont') {
      this.datosPasos.indice = 1;
       const ISVALID = this.datosComponent?.validarDatos();
       if (!ISVALID) {
         this.esFormaValido = true;
         return;
       }
      this.obtenerDatosDelStore();
    } else if (e.valor > 0 && e.valor <= this.pantallasPasos.length) {
      this.pasoNavegarPor(e);
    }
  }

  /**
   * Actualiza el índice del paso y maneja la navegación hacia adelante o atrás.
   *
   * @param {AccionBoton} e - Objeto que contiene el valor del paso y la acción a realizar.
   * @returns {void}
   */
  public pasoNavegarPor(e: AccionBoton): void {
    this.indice = e.valor;
    this.datosPasos.indice = e.valor;
    if (e.valor > 0 && e.valor < 5) {
      if (e.accion === 'cont') {
        this.wizardComponent.siguiente();
      } else {
        this.wizardComponent.atras();
      }
    }
  }

  /**
   * Obtiene los datos del store y los guarda utilizando el servicio.
   */
  obtenerDatosDelStore(): void {
    this.sanitarioService
      .getAllState()
      .pipe(take(1))
      .subscribe((data) => {
        this.guardar(data);
      });
  }

  guardar(item: Solicitud260906State): Promise<JSONResponse> {
    const PAYLOAD = GuardarAdapter_260906.toFormPayload(
      this.solicitudState,
      this.datosState,
      this.tercerosState,
      this.pagoDerechos
    );
  
    return this.sanitarioService
      .guardarDatosPost(PAYLOAD as Record<string, unknown>)
      .pipe(take(1))
      .toPromise()
      .then((respuesta: any) => {
  
        if (respuesta?.codigo === '00') {
          this.toastr.success('Datos guardados correctamente', 'Éxito');
        const DATOS = respuesta?.datos as { id_solicitud?: number };
        const ID_SOLICITUD = DATOS?.id_solicitud ?? 0;

        this.esFormaValido = false;
        this.idSolicitudState = ID_SOLICITUD;
        this.store.setIdSolicitud(ID_SOLICITUD); 
          this.indice = 2;
          this.datosPasos.indice = 2;
  
          this.wizardComponent.siguiente();
  
          return {
            id: respuesta?.datos?.id_solicitud || 0,
            descripcion: respuesta?.mensaje || '',
            codigo: respuesta?.codigo,
            mensaje: 'Operación exitosa.',
            data: respuesta?.datos || null
          } as JSONResponse;
        }
  
        this.toastr.error('Error al guardar los datos', 'Error');
        throw new Error(respuesta?.mensaje || 'Error al guardar');
      })
      .catch((error) => {
        this.toastr.error('Error al guardar los datos', 'Error');
        throw error;
      });
  }

  /**
   * Método para manejar el evento de carga de documentos.
   * Actualiza el estado del botón de carga de archivos.
   *  carga - Indica si la carga de documentos está activa o no.
   * {void} No retorna ningún valor.
   */
  manejaEventoCargaDocumentos(carga: boolean): void {
    this.activarBotonCargaArchivos = carga;
  }

  /**
   * Emite un evento para cargar archivos.
   * {void} No retorna ningún valor.
   */
  onClickCargaArchivos(): void {
    this.cargarArchivosEvento.emit();
  }

  /**
   * Método para manejar el evento de carga de documentos.
   * Actualiza el estado de la sección de carga de documentos.
   *  cargaRealizada - Indica si la carga de documentos se realizó correctamente.
   * {void} No retorna ningún valor.
   */
  cargaRealizada(cargaRealizada: boolean): void {
    this.seccionCargarDocumentos = cargaRealizada ? false : true;
  }

  /**
   * Actualiza el estado de la carga en progreso.
   *
   * @param carga - Indica si la carga está en progreso (`true`) o no (`false`).
   */
  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
  }

  /**
   * @method anterior
   * @description
   * Método para navegar programáticamente al paso anterior del wizard.
   * Ejecuta la transición backward en el componente wizard y actualiza los
   * índices correspondientes para mantener sincronización de estado.
   * 
   * @navigation_backward
   * Realiza navegación que:
   * - Retrocede al paso anterior usando `wizardComponent.atras()`
   * - Actualiza índice local basado en nueva posición del wizard
   * - Sincroniza datos de pasos con posición actualizada
   * - Mantiene consistencia de estado durante retroceso
   * 
   * @wizard_synchronization
   * Mantiene sincronización entre:
   * - Índice local del componente
   * - Índice actual del wizard component  
   * - Datos de configuración de pasos
   * - Estado visual de navegación
   * 
   * @state_preservation
   * Durante retroceso:
   * - Preserva datos capturados en pasos anteriores
   * - Mantiene validaciones ya realizadas
   * - Conserva estado de formularios
   * 
   * @state_update
   * Actualiza:
   * - `indice`: Nueva posición actual + 1
   * - `datosPasos.indice`: Sincronización con datos de pasos
   * 
   * @void
   * @backward_navigation
   */
  anterior(): void {
    this.wizardComponent.atras();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }

  /**
   * @method saltar
   * @description
   * Método para saltar directamente al paso de firma en el wizard.
   * Actualiza los índices correspondientes y ejecuta la transición
   * forward en el componente wizard.
   */
  saltar(): void {
    this.indice = 3;
    this.datosPasos.indice = 3;
    this.wizardComponent.siguiente();
  }

  /**
   * @method siguiente
   * @description
   * Método para navegar programáticamente al siguiente paso del wizard.
   * Ejecuta la transición forward en el componente wizard y actualiza los
   * índices correspondientes para mantener sincronización de estado.
   * 
   * @navigation_forward
   * Realiza navegación que:
   * - Ejecuta validación de documentos cargados (comentario indica validación futura)
   * - Avanza al siguiente paso usando `wizardComponent.siguiente()`
   * - Actualiza índice local basado en posición del wizard
   * - Sincroniza datos de pasos con nueva posición
   * 
   * @wizard_synchronization
   * Mantiene sincronización entre:
   * - Índice local del componente
   * - Índice actual del wizard component
   * - Datos de configuración de pasos
   * - Estado visual de la UI
   * 
   * @future_validation
   * Comentario indica que se implementará:
   * - Validación de documentos cargados
   * - Verificación de completitud de adjuntos
   * - Control de calidad de archivos
   * 
   * @state_update
   * Actualiza:
   * - `indice`: Posición actual + 1
   * - `datosPasos.indice`: Sincronización con datos de pasos
   * 
   * @void
   * @programmatic_navigation
   */
  siguiente(): void {
    // Aqui se hara la validacion de los documentos cargdados
    this.wizardComponent.siguiente();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }
}
 