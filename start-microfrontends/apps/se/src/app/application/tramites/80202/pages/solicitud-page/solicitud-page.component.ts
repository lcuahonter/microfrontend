import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import {
  DatosPasos,
  RegistroSolicitudService,
  Usuario,
  esValidObject,
  getValidDatos,
} from '@ng-mf/data-access-user';
import {
  MENSAJE_DE_EXITO_ETAPA_UNO,
  PASOS,
  USUARIO_INFO,
} from '../../constants/immex-ampliacion-sensibles.enums';
import { Subject, takeUntil } from 'rxjs';
import { ImmexAmpliacionSensiblesQuery } from '../../estados/immex-ampliacion-sensibles.query';
import { ImmexAmpliacionSensiblesStore } from '../../estados/immex-ampliacion-sensibles.store';
import { ImmexRegistroState } from '../../estados/immex-ampliacion-sensibles.store';
import { ListaPasosWizard } from '../../models/immex-ampliacion-sensibles.model';
import { ToastrService } from 'ngx-toastr';
import { WizardComponent } from '@libs/shared/data-access-user/src';
import { buildGuardarPayload } from '../../mappers/guardar.mapper';

/**
 * Interfaz para la acción de los botones
 */
interface AccionBoton {
  accion: string;
  valor: number;
}
/**
 * Componente principal para el formulario de solicitud IMMEX modalidad ampliación sensibles.
 */

/**
 * @component SolicitudPageComponent
 * @description Componente principal para el formulario de solicitud IMMEX modalidad ampliación sensibles. Gestiona los pasos, carga de documentos y guardado de datos.
 * @author Ultrasist
 * @date 2025-09-30
 */
@Component({
  selector: 'app-solicitud-page',
  templateUrl: './solicitud-page.component.html',
  styleUrl: './solicitud-page.component.scss',
  providers: [ToastrService],
})
export class SolicitudPageComponent implements OnInit {
  /** Información del usuario actual. */
  datosUsuario: Usuario = USUARIO_INFO;
  /** Evento para cargar archivos en el formulario. */
  cargarArchivosEvento = new EventEmitter<void>();
  /** Indica si el botón de carga de archivos está activo. */
  activarBotonCargaArchivos: boolean = false;
  /** Indica si la sección de carga de documentos está visible. */
  seccionCargarDocumentos: boolean = true;
  /** Indica si la carga está en progreso. */
  cargaEnProgreso: boolean = true;

  /** Título principal del formulario. */
  tituloMensaje: string | null = 'Registro de solicitud IMMEX modalidad ampliación sensibles';
  /** Estado actual de la solicitud. */
  public solicitudState!: ImmexRegistroState;
  /** Mensaje de éxito para el primer paso. */
  mensajeDeTextoDeExito: string = MENSAJE_DE_EXITO_ETAPA_UNO;
  /** Pasos del asistente de la solicitud. */
  pasos: ListaPasosWizard[] = PASOS;
  /** Índice del paso actual. */
  indice: number = 1;
  /** Referencia al componente Wizard para navegación. */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;
  /** Subject para manejar la desuscripción de observables. */
  private destroyNotifier$: Subject<void> = new Subject();
  /** Estado interno del registro IMMEX. */
  private immexRegistroState!: ImmexRegistroState;
  /** Configuración de los botones del asistente. */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };
  /** Folio temporal del trámite. */
  public folioTemporal: number = 0;

  /** Constructor con inyección de servicios. */
  constructor(
    private immexRegistroStore: ImmexAmpliacionSensiblesStore,
    private Query: ImmexAmpliacionSensiblesQuery,
    public registroSolicitudService: RegistroSolicitudService,
    private toastrService: ToastrService
  ) { }

  /**
   * Mantiene la suscripción al estado de CambioModalidadQuery para tener siempre el estado actualizado.
   */
  ngOnInit(): void {
    this.Query.selectSolicitud$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((state: ImmexRegistroState) => {
        this.solicitudState = state;
      });
  }

  /**
   * Updates the `indice` and `tituloMensaje` properties based on the value of the provided `AccionBoton` object.
   * If the `valor` property of `AccionBoton` is between 1 and 4 (inclusive), it sets the `indice` to `e.valor`
   * and updates the `tituloMensaje` using the `obtenerNombreDelTítulo` method.
   * Depending on the `accion` property of `AccionBoton`, it either moves the wizard component forward or backward.
   *
   * @param {AccionBoton} e - The action button object containing the `valor` and `accion` properties.
   */
  getValorIndice(e: AccionBoton): void {

    if (e.valor > 0 && e.valor < 5) {
      this.indice = e.valor;
      this.tituloMensaje = SolicitudPageComponent.obtenerNombreDelTítulo(
        e.valor
      );

      if (e.accion === 'cont') {
        this.wizardComponent.siguiente();
      } else {
        this.wizardComponent.atras();
      }
    }
  }
  /**
   * Obtiene el nombre del título basado en el valor proporcionado.
   *
   * @param {number} valor - El valor numérico que determina el título a retornar.
   * @returns {string} El nombre del título correspondiente al valor proporcionado.
   *
   *
   */
  static obtenerNombreDelTítulo(valor: number): string {
    switch (valor) {
      case 1:
        return 'Registro de solicitud IMMEX modalidad ampliación sensibles';
      case 2:
        return 'Cargar archivos';
      case 3:
        return 'Cargar archivos';
      case 4:
        return 'Firmar';
      default:
        return 'Registro de solicitud IMMEX modalidad ampliación sensibles';
    }
  }

  /**
   * Cambia el título del mensaje según la pestaña seleccionada.
   * @method enTabChange
   * @param {number} selectedTab - El índice de la pestaña seleccionada.
   *
   * */
  enTabChange(selectedTab: number): void {
    switch (selectedTab) {
      case 1:
        this.tituloMensaje = 'Zoosanitario para importación';
        break;
      case 2:
        this.tituloMensaje =
          'Captura del certificado zoosanitario para importación';
        break;
      case 3:
        this.tituloMensaje = 'Zoosanitario para importación';
        break;
      case 4:
        this.tituloMensaje = 'Zoosanitario para importación';
        break;
      case 5:
        this.tituloMensaje =
          'Captura del certificado zoosanitario para importación';
        break;
      default:
        this.tituloMensaje = 'Zoosanitario para importación';
        break;
    }
  }

  /**
   * Obtiene los datos del store y los guarda utilizando el servicio.
   */
  obtenerDatosDelStore(e: AccionBoton): void {
    const PAYLOAD = buildGuardarPayload(this.solicitudState);
    let shouldNavigate = false;
    this.registroSolicitudService
      .postGuardarDatos('80202', PAYLOAD)
      .subscribe((response) => {
        shouldNavigate = response.codigo === '00';
        if (shouldNavigate) {
          if (esValidObject(response) && esValidObject(response.datos)) {
            const DATOS = response.datos as { id_solicitud?: number };
            if (getValidDatos(DATOS.id_solicitud)) {
              this.immexRegistroStore.setIdSolicitud(DATOS.id_solicitud ?? 0);
            } else {
              this.immexRegistroStore.setIdSolicitud(0);
            }
            if (e.valor > 0 && e.valor < 5) {
              this.indice = e.valor;
              this.tituloMensaje =
                SolicitudPageComponent.obtenerNombreDelTítulo(e.valor);

              if (e.valor > 0 && e.valor < 5) {
                this.indice = e.valor;
                this.tituloMensaje = SolicitudPageComponent.obtenerNombreDelTítulo(
                  e.valor
                );

                if (e.accion === 'cont') {
                  this.wizardComponent.siguiente();
                } else {
                  this.wizardComponent.atras();
                }
              }
            }
          }
          this.toastrService.success(response.mensaje);
        } else {
          this.toastrService.error(response.mensaje);
        }
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
   * @method onClickCargaArchivos
   * @description
   * Método de manejo de eventos para el click en botón de carga de archivos.
   * Emite evento que notifica a componentes interesados que deben activar
   * la funcionalidad de carga de documentos.
   * 
   * @event_emission
   * Emite evento:
   * - `cargarArchivosEvento`: Sin parámetros (void)
   * - Notifica inicio de proceso de carga
   * - Activa funcionalidad en componentes suscritos
   * 
   * @component_communication
   * Facilita comunicación:
   * - Entre componente padre e hijos
   * - Con servicios de carga de archivos
   * - Con sistemas de gestión de documentos
   * 
   * @user_interaction
   * Responde a:
   * - Click en botón de carga
   * - Acción intencional del usuario
   * - Iniciación de flujo de documentos
   * 
   * @workflow_trigger
   * Desencadena:
   * - Apertura de dialogo de archivos
   * - Activación de componentes de carga
   * - Inicio de proceso de validación de documentos
   * 
   * @void
   * @event_handler
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
   * Método para manejar el evento de cambio en la carga en progreso.
   * Actualiza el estado de la carga en progreso.
   * carga - Indica si la carga está en progreso o no.
   * {void} No retorna ningún valor.
   */
  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
  }
}
