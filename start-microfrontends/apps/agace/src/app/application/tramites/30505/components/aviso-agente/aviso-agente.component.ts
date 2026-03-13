import { ActivatedRoute, Router } from '@angular/router';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Subject, map, takeUntil } from 'rxjs';
import { TablaAcciones, TablaDinamicaComponent, TablaSeleccion, TituloComponent } from '@libs/shared/data-access-user/src';

import { Solicitud30505State, Solicitud30505Store } from '../../../../estados/tramites/tramites30505.store';
import { AVISO_AGENTE_DE_TABLA } from '../../../../core/enums/30505/aviso-de-modificacion.enum';
import { AgregarAgenteComponent } from '../agregar-agente/agregar-agente.component';
import { AvisoAgente } from '../../../../core/models/30505/aviso-modificacion.model';
import { CommonModule } from '@angular/common';
import { Solicitud30505Query } from '../../../../estados/queries/tramites30505.query';
import { TercerosRelacionadosService } from '../../services/terceros-relacionados.service';

/**
 * Componente encargado de gestionar el aviso de agente dentro del trámite 30505.
 * 
 * Este componente permite visualizar, agregar y administrar los avisos de agente,
 * mostrando la información en una tabla dinámica y utilizando formularios reactivos
 * para la captura y validación de datos.
 * 
 * @remarks
 * Utiliza módulos y componentes auxiliares como `TablaDinamicaComponent`, `TituloComponent`
 * y `AgregarAgenteComponent` para estructurar la interfaz de usuario.
 * 
 * @example
 * <app-aviso-agente></app-aviso-agente>
 */
@Component({
  selector: 'app-aviso-agente',
  templateUrl: './aviso-agente.component.html',
  styleUrls: ['./aviso-agente.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    TablaDinamicaComponent,
    TituloComponent,
    AgregarAgenteComponent
  ]
})
export class AvisoAgenteComponent implements OnInit, OnDestroy {

  /**
   * Nombre de la clase CSS utilizada para mostrar u ocultar el modal.
   * Por defecto, el valor es 'modal'.
   */
  modal: string = 'modal';

  /**
   * Arreglo que contiene los datos de los avisos de agente.
   * Cada elemento es una instancia de la interfaz AvisoAgente.
   */
  avisoAgenteDatos: AvisoAgente[] = [];

  /**
   * Configuración de la tabla utilizada para mostrar los datos del aviso de agente.
   * 
   * Esta constante define la estructura, columnas y opciones de visualización
   * de la tabla en el componente de aviso de agente.
   * 
   * @see AVISO_AGENTE_DE_TABLA - Objeto de configuración importado que contiene los detalles de la tabla.
   */
  CONFIGURACION_TABLA_AGENTE = AVISO_AGENTE_DE_TABLA;

  /**
   * Arreglo que contiene las acciones disponibles para la tabla.
   * Cada elemento representa una acción que puede realizar el usuario en la interfaz.
   * 
   * @type {TablaAcciones[]}
   */
  acciones: TablaAcciones[] = [];

  /**
   * Notificador utilizado para destruir suscripciones y evitar fugas de memoria.
   * Se emite un valor cuando el componente es destruido, permitiendo que las suscripciones
   * se cancelen de manera segura utilizando el operador `takeUntil`.
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * Representa el estado actual del aviso en el trámite 30505.
   * 
   * @type {Solicitud30505State}
   * @public
   */
  private avisoState!: Solicitud30505State;

  /**
  * Arreglo que contiene los agentes seleccionados de tipo AvisoAgente.
  * 
  * @remarks
  * Esta propiedad almacena la lista de agentes que han sido seleccionados por el usuario
  * en el componente de aviso de agente.
  */
  selectedAgente: AvisoAgente[] = [];

  
/**
 * Define el tipo de selección utilizado en la tabla de mercancías.
 * 
 * En este caso, se utiliza la selección de tipo CHECKBOX, lo que permite
 * seleccionar múltiples elementos en la tabla de manera simultánea.
 * 
 * @type {TablaSeleccion}
 */
tipoSeleccionsoliMercancias: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * Indica si el componente debe estar en modo solo lectura.
   * Cuando es `true`, los campos y acciones estarán deshabilitados para evitar modificaciones.
   * Valor predeterminado: `false`.
   */
  @Input() soloLectura: boolean = false;

  /**
   * Constructor de la clase AvisoAgenteComponent.
   * 
   * @param fb Instancia de FormBuilder para la creación y gestión de formularios reactivos.
   * @param router Instancia de Router para la navegación entre rutas.
   * @param route Instancia de ActivatedRoute para acceder a información sobre la ruta actual.
   */
  constructor(private router: Router, private route: ActivatedRoute, private tercerosService: TercerosRelacionadosService, private tramite30505Store: Solicitud30505Store, private tramiteQuery: Solicitud30505Query) {

  }


  /**
   * Navega a la ruta relativa '../agregar-agente' para agregar un nuevo agente de transporte.
   * Utiliza el enrutador de Angular para cambiar la vista actual.
   *
   * @remarks
   * Este método se utiliza cuando el usuario desea agregar un nuevo agente de transporte
   * desde el componente actual. La navegación es relativa a la ruta activa.
   */
  AgregarTransportias(): void {
    this.router.navigate(['../agregar-agente'], {
      relativeTo: this.route

    });
  }

  /**
   * Maneja la selección de datos de agentes a partir de un evento.
   * 
   * @param evento - Un arreglo de objetos de tipo AvisoAgente que contiene los datos seleccionados del agente.
   * 
   * Si existen datos previos en `avisoAgenteDatos`, actualiza la propiedad `selectedAgente` con el evento recibido
   * y pasa esta información al servicio compartido `tercerosService` mediante el método `setAgente`.
   */
  getAgenteDatos(evento: AvisoAgente[]): void {
    if (evento && evento.length > 0) {
      this.selectedAgente = evento;
      this.tercerosService.setAgente(this.selectedAgente); 
    } else {
      console.error('No agent data selected or event is empty.');
    }
  }

  /**
   * Elimina el agente seleccionado de la lista.
   *
   * Si hay al menos un agente seleccionado, llama al método `eliminarAgento`
   * del store `tramite30505Store` pasando el primer agente seleccionado.
   */
  eliminarAgente(): void {
    if (this.selectedAgente.length > 0) {
      this.tramite30505Store.eliminarAgento(this.selectedAgente[0]);
    }
  }

  /**
   * Navega a la ruta relativa para modificar un agente.
   *
   * Utiliza el enrutador de Angular para redirigir al usuario a la pantalla de modificación de agente,
   * manteniendo el contexto de la ruta actual.
   */
  modificarAgente(): void {
    if (Array.isArray(this.selectedAgente) && this.selectedAgente.length > 0) {
      this.tercerosService.setAgente(this.selectedAgente); 
      this.router.navigate(['../modificar-agente'], { relativeTo: this.route });
    } else {
      console.error('No agent selected for modification.');
    }
  }

  /**
  * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
  * Llama al método `inicializarFormulario` para configurar el formulario inicial.
  */
  ngOnInit(): void {
    this.inicializarFormulario();
    this.getAvisoAgenteData();
  }

  /**
   * Inicializa el formulario del componente, configurando los datos de los agentes
   * y estableciendo el estado inicial del formulario.
   * 
   * Este método se llama al iniciar el componente para preparar el formulario
   * con los datos necesarios y establecer la configuración inicial.
   */
  inicializarFormulario(): void {
    this.tramiteQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.avisoState = seccionState;
        })
      )
      .subscribe()
    this.avisoAgenteDatos = this.avisoState?.agenteDatos || [];
  }


  /**
 * Obtiene los datos de los agentes desde el servicio `TercerosRelacionadosService`.
 *
 * Este método realiza una suscripción al observable `getAvisoAgenteData` del servicio,
 * recuperando los datos de los agentes y asignándolos a la propiedad `avisoAgenteDatos`.
 * 
 * @remarks
 * La suscripción se gestiona con `takeUntil(this.destroyNotifier$)` para evitar fugas de memoria.
 * 
 * @example
 * this.getAvisoAgenteData();
 */
getAvisoAgenteData(): void {
  this.tercerosService
    .getAvisoAgenteData()
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe((data) => {
      this.avisoAgenteDatos = data as unknown as AvisoAgente[];
    });
}
 
  /**
   * Método del ciclo de vida de Angular que se ejecuta cuando el componente es destruido.
   * Emite una notificación y completa el observable `destroyNotifier$` para limpiar suscripciones y evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}