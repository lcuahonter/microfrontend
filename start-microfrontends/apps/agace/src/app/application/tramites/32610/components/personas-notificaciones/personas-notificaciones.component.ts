import { Component, OnDestroy, OnInit } from '@angular/core';
import { PERSONAS_NOTIFICACIONES_PANELS, PERSONAS_NOTIFICACIONES_TABLA } from '../../constants/personas-notificaciones-tabla.enum';
import { PersonaRespuestaTabla, TablaPersonasNotificaciones } from '../../models/personas-notificaciones-tabla.model';
import { Subject, map, takeUntil } from 'rxjs';
import { TablaDinamicaComponent, TablaSeleccion } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { ConfiguracionColumna } from '@libs/shared/data-access-user/src';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { SolicitudService } from '../../services/solicitud.service';
import { TituloComponent } from '@ng-mf/data-access-user';

/**
 * Componente para la gestión de personas de notificaciones.
 * 
 * Este componente maneja la visualización y administración de las personas
 * que recibirán notificaciones relacionadas con el trámite 32610.
 * Proporciona una interfaz para mostrar datos en formato de tabla dinámica
 * y gestionar paneles colapsables.
 *
 */
@Component({
  selector: 'app-personas-notificaciones',
  standalone: true,
  imports: [CommonModule, TituloComponent, TablaDinamicaComponent],
  templateUrl: './personas-notificaciones.component.html',
  styleUrls: ['./personas-notificaciones.component.scss'],
})
export class PersonasNotificacionesComponent implements OnInit, OnDestroy {
  /**
   * Referencia al componente de selección de tabla.
   * 
   * Proporciona acceso a las funcionalidades de selección
   * de elementos en la tabla dinámica.
   * 
   * @type {TablaSeleccion}
   * @readonly
   */
  public readonly TablaSeleccion = TablaSeleccion;

  /**
   * Configuración de las columnas de la tabla de personas notificaciones.
   * 
   * Define la estructura y propiedades de cada columna que se mostrará
   * en la tabla dinámica, incluyendo tipos de datos, ordenamiento, etc.
   * 
   * @type {ConfiguracionColumna<TablaPersonasNotificaciones>[]}
   * @readonly
   */
  public readonly configuracionTabla: ConfiguracionColumna<TablaPersonasNotificaciones>[] = PERSONAS_NOTIFICACIONES_TABLA;

  /**
   * Datos de la tabla de personas notificaciones.
   * 
   * Contiene la información de todas las personas que pueden
   * recibir notificaciones, obtenida del servicio correspondiente.
   * 
   * @type {TablaPersonasNotificaciones[]}
   */
  public enlaceOperativoData: TablaPersonasNotificaciones[] = [];
  
  /**
   * Subject para gestionar la destrucción de suscripciones.
   * 
   * Utilizado para cancelar automáticamente todas las suscripciones
   * activas cuando el componente se destruye, evitando memory leaks.
   * 
   * @type {Subject<void>}
   * @private
   */
  private readonly destroyNotifier$: Subject<void> = new Subject();

  /**
   * Configuración de paneles colapsables de la interfaz de usuario.
   * 
   * Define el estado y comportamiento de los paneles que pueden
   * expandirse o contraerse en la interfaz.
   * 
   * @type {Panel[]}
   */
  panels = PERSONAS_NOTIFICACIONES_PANELS;

   /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Constructor del componente PersonasNotificacionesComponent. 
   * @param solicitudService - Servicio para obtener datos de personas notificaciones
   */
  constructor(
    private solicitudService: SolicitudService,
     private consultaioQuery: ConsultaioQuery
  ) {
    this.consultaioQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState) => {
        this.esFormularioSoloLectura = seccionState.readonly;
         if (this.esFormularioSoloLectura) {
             this.mostrar_colapsable(0);
          }
      })
    )
    .subscribe();
  }

  /**
   * Método del ciclo de vida OnInit.
   * 
   * Se ejecuta después de que Angular inicializa las propiedades
   * vinculadas a datos del componente. Inicia la carga de datos de la tabla.
   * 
   * @returns {void}
   */
  ngOnInit(): void {
    this.obtenerDatosTabla();
  }

  /**
   * Obtiene los datos de la tabla de personas notificadoras.
   * 
   * Realiza una petición al servicio para obtener la información
   * de las personas que pueden recibir notificaciones. Los datos
   * se procesan y almacenan en la propiedad enlaceOperativoData.
   * 
   * @throws {Error} Si ocurre un error en la petición al servicio
   * @returns {void}
   * 
   */

  obtenerDatosTabla(): void {
    this.solicitudService.obtenerPersonaTablaDatos()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((respuesta: PersonaRespuestaTabla) => {
        this.enlaceOperativoData = Array.isArray(respuesta.data)
          ? respuesta.data : [respuesta.data];      
      });
  }

  /**
   * Muestra u oculta el panel colapsable especificado.
   * 
   * Gestiona el estado de visibilidad de los paneles colapsables,
   * asegurando que solo un panel esté abierto a la vez. Si el panel
   * seleccionado ya está abierto, se cierra; si está cerrado, se abre
   * y todos los demás se cierran.
   * 
   * @param index - El índice del panel a mostrar u ocultar
   * @returns {void}
   * 
   */
 mostrar_colapsable(index: number): void {
    if (!this.esFormularioSoloLectura) {
    const IS_CURRENTLY_OPEN = this.panels[index].isCollapsed;
    this.panels.forEach((panel: { isCollapsed: boolean }, i: number) => {
      panel.isCollapsed = i === index ? !IS_CURRENTLY_OPEN : true;
    });
  }
  }

  /**
   * Método del ciclo de vida OnDestroy.
   * 
   * Se ejecuta cuando Angular destruye el componente. Cancela todas
   * las suscripciones activas para prevenir memory leaks y libera
   * los recursos utilizados por el componente.
   * 
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

}
