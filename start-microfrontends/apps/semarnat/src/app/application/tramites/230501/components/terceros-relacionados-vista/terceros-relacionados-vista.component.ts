import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfiguracionColumna, ConsultaioQuery, TablaDinamicaComponent, TablaSeleccion, TituloComponent } from '@ng-mf/data-access-user';
import { DESTINATARIO_ENCABEZADO_DE_TABLA, Destinatario, REPRESENTANTE_ENCABEZADO_DE_TABLA, Representante, USO_FINAL_ENCABEZADO_DE_TABLA, UsoFinal } from '../../models/terceros-relacionados.model';
import { Subject, map, takeUntil } from 'rxjs';
import { Tramite230501State, Tramite230501Store } from '../../estados/stores/tramite230501Store.store';
import { CommonModule } from '@angular/common';
import { Tramite230501Query } from '../../estados/queries/tramite230501Query.query';

/**
 * @component TercerosRelacionadosVistaComponent
 * @description Componente de solo lectura que muestra las tablas de terceros relacionados
 * (fabricantes, destinatarios finales, representante).
 * Consume observables del store para renderizar los datos en la vista mediante el componente
 * `TercerosRelacionadosComponent`.
 */
@Component({
  selector: 'app-terceros-relacionados-vista',
  standalone: true,
  imports: [CommonModule, TablaDinamicaComponent, TituloComponent],
  templateUrl: './terceros-relacionados-vista.component.html',
  styleUrls: ['./terceros-relacionados-vista.component.scss'],
})
export class TercerosRelacionadosVistaComponent implements OnInit, OnDestroy {

  /**
   * @property {Destinatario[]} destinatarioFinalFilaSeleccionada
   * Arreglo para almacenar los destinatarios finales seleccionados en la tabla.
   */
  destinatarioFinalFilaSeleccionada: Destinatario[] = [];

  /**
   * @property {Representante[]} representanteFilaSeleccionada
   * Arreglo para almacenar los representantes seleccionados en la tabla.
   */
  representanteFilaSeleccionada: Representante[] = [];

  /**
   * @property {UsoFinal[]} usoDeFilaSeleccionada
   * Arreglo para almacenar los usuarios finales seleccionados en la tabla.
   */
  usoDeFilaSeleccionada: UsoFinal[] = [];

  /**
   * @property {ConfiguracionColumna<Destinatario>[]} configuracionTablaDestinatarioFinal
   * Configuración de columnas para la tabla de destinatarios finales.
   * Define qué columnas se muestran en la tabla y cómo se deben renderizar.
   */
  configuracionTablaDestinatarioFinal: ConfiguracionColumna<Destinatario>[] =
    DESTINATARIO_ENCABEZADO_DE_TABLA;

  /**
   * @property {ConfiguracionColumna<Representante>[]} configuracionTablaRepresentante
   * Configuración de columnas para la tabla de representantes.
   * Define qué columnas se muestran en la tabla y cómo se deben renderizar.
   */
  configuracionTablaRepresentante: ConfiguracionColumna<Representante>[] =
    REPRESENTANTE_ENCABEZADO_DE_TABLA;

  /**
   * @property {Destinatario[]} destinatarioFinalTablaDatos
   * Arreglo que almacena los datos de la tabla de destinatarios finales.
   */
  destinatarioFinalTablaDatos: Destinatario[] = [];

  /**
   * @property {Representante[]} representanteLegalTablaDatos
   * Arreglo que almacena los datos de la tabla de representantes.
   */
  representanteLegalTablaDatos: Representante[] = [];

  /**
   * @property {UsoFinal[]} usuarioTablaDatos
   * Arreglo que almacena los datos de la tabla de usuarios finales.
   */
  usuarioTablaDatos: UsoFinal[] = [];

  /**
   * @property {Subject<void>} destroy$
   * Subject utilizado para cancelar suscripciones activas y evitar fugas de memoria.
   * Se completa en el hook `ngOnDestroy`.
   * @private
   */
  private destroy$ = new Subject<void>();

  /**
  * @public
  * @type {Tramite230501State}
  * @description Representa el estado actual del trámite 230501.
  */
  public tramiteState!: Tramite230501State;

  /**
* Indica si el formulario está en modo solo lectura.
* Cuando es `true`, los campos del formulario no se pueden editar.
*/
  esFormularioSoloLectura: boolean = false;

  /**
   * @property {ConfiguracionColumna<UsoFinal>[]} configuracionTablaFacturador
   * Configuración de columnas para la tabla de facturadores.
   * Define qué columnas se deben mostrar y cómo se deben renderizar.
   */
  configuracionTablaFacturador: ConfiguracionColumna<UsoFinal>[] =
    USO_FINAL_ENCABEZADO_DE_TABLA;

  /**
   * @property {TablaSeleccion} tipoSeleccionTabla
   * Tipo de selección que utiliza la tabla dinámica, en este caso `CHECKBOX`.
   * Controla si la selección es de un solo elemento o múltiples (checkbox).
   */
  tipoSeleccionTabla = TablaSeleccion.CHECKBOX;

  /**
   * @constructor
   * Inyecta los servicios necesarios para consultar y actualizar el estado del trámite.
   *
   * @param tramiteStore - Store que gestiona el estado de los datos del trámite.
   * @param tramiteQuery - Servicio de consulta que expone observables para leer los datos del store.
   * @param router - Servicio para navegar a rutas en la aplicación.
   * @param activatedRoute - Servicio para obtener la ruta activa y parámetros de la misma.
   * @param consultaQuery - Servicio de consulta que expone el estado de la sección de consulta.
   */
  constructor(
    private tramiteStore: Tramite230501Store,
    private tramiteQuery: Tramite230501Query,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public consultaQuery: ConsultaioQuery
  ) {
    // No hacer nada 
  }

  /**
   * @method ngOnInit
   * @description Hook del ciclo de vida que se ejecuta al inicializar el componente.
   * Suscribe los observables para mostrar los datos en la vista.
   */
  ngOnInit(): void {
    // Obtener el estado del trámite y suscribirse al observable
    this.tramiteQuery.selectTramiteState$
      .pipe(takeUntil(this.destroy$))
      .subscribe((tramiteState) => {
        this.tramiteState = tramiteState;
        this.destinatarioFinalTablaDatos = tramiteState.destinatarioFinalTablaDatos;
        this.representanteLegalTablaDatos = tramiteState.representanteLegalTablaDatos;
        this.usuarioTablaDatos = tramiteState.usuarioTablaDatos;
      });
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();
    this.pestanaValidar();

  }

  /**
   * @method irAAcciones
   * @description Navega a la ruta especificada.
   * Permite navegar dinámicamente a una ruta dada en el componente.
   *
   * @param {string} accionesPath - Ruta a la que se desea navegar.
   */
  irAAcciones(accionesPath: string): void {
    this.router.navigate([accionesPath], {
      relativeTo: this.activatedRoute,
    });
  }

  /**
   * @method modificarDestinatario
   * @description Navega a la página de modificación de destinatario final.
   * Si hay un destinatario final seleccionado, lo pasa al store para su edición.
   */
  modificarDestinatario(): void {
    this.irAAcciones('../destinatario-final');
    if (this.destinatarioFinalFilaSeleccionada.length) {
      this.representanteFilaSeleccionada = [];
      this.usoDeFilaSeleccionada = [];
      this.tramiteStore.update((state) => ({
        ...state,
        esDestinatarioFinalElModoDeEdicion: true
      }));
      this.tramiteStore.destinatarioSujeto.next(this.destinatarioFinalFilaSeleccionada[0]);
    }
  }

  /**
   * @method modificarRepresentanteLegal
   * @description Navega a la página de modificación de representante legal.
   * Si hay un representante seleccionado, lo pasa al store para su edición.
   */
  modificarRepresentanteLegal(): void {
    this.irAAcciones('../representante-legal');
    if (this.representanteFilaSeleccionada.length) {
      this.tramiteStore.update((state) => ({
        ...state,
        esRepresentanteLegalElModoDeEdicion: true
      }));
      this.tramiteStore.representanteSujeto.next(this.representanteFilaSeleccionada[0]);
    }
  }

  /**
   * @method modificarUsuarioFinal
   * @description Navega a la página de modificación de usuario final.
   * Si hay un usuario final seleccionado, lo pasa al store para su edición.
   */
  modificarUsuarioFinal(): void {
    this.irAAcciones('../uso-final');
    if (this.usoDeFilaSeleccionada.length) {
      this.tramiteStore.update((state) => ({
        ...state,
        esUsuarioElModoDeEdicion: true
      }));
      this.tramiteStore.usuarioSujeto.next(this.usoDeFilaSeleccionada[0]);
    }
  }

  /**
   * @method eliminarDestinatarioFinal
   * @description Elimina el primer destinatario final de la tabla de datos.
   * Si no hay destinatarios finales seleccionados, no realiza ninguna acción.
   */
  eliminarDestinatarioFinal(): void {
    if (this.destinatarioFinalFilaSeleccionada.length) {
      this.tramiteStore.eliminarDestinatarioFinal(this.destinatarioFinalFilaSeleccionada[0]);
    }
    this.pestanaValidar();
  }

  /**
   * @method eliminarRepresentanteLegal
   * @description Elimina el primer representante legal de la tabla de datos.
   * Si no hay representantes seleccionados, no realiza ninguna acción.
   */
  eliminarRepresentanteLegal(): void {
    if (this.representanteFilaSeleccionada.length) {
      this.tramiteStore.eliminarRepresentanteLegal(this.representanteFilaSeleccionada[0]);
    }
    this.pestanaValidar();
  }

  /**
   * @method eliminarUsuarioFinal
   * @description Elimina el primer usuario final de la tabla de datos.
   * Si no hay usuarios finales seleccionados, no realiza ninguna acción.
   */
  eliminarUsuarioFinal(): void {
    if (this.usoDeFilaSeleccionada.length) {
      this.tramiteStore.eliminarUsuarioFinal(this.usoDeFilaSeleccionada[0]);
    }
    this.pestanaValidar();
  }

  /**
   * @method ngOnDestroy
   * @description Hook del ciclo de vida que se ejecuta cuando el componente es destruido.
   * Cancela todas las suscripciones activas para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Valida si las tablas de datos relacionadas con el trámite contienen información.
   * 
   * Este método verifica si las tablas de datos `destinatarioFinalTablaDatos`, 
   * `representanteLegalTablaDatos` y `usuarioTablaDatos` tienen contenido. 
   * Si todas contienen datos, se considera que el formulario es válido y 
   * se actualiza el estado correspondiente.
   * 
   * @returns {void} No retorna ningún valor.
   */
  pestanaValidar(): void {
    const IS_VALIDA = Boolean(
      this.tramiteState?.destinatarioFinalTablaDatos?.length &&
      this.tramiteState?.representanteLegalTablaDatos?.length &&
      this.tramiteState?.usuarioTablaDatos?.length
    );

    this.setFormValida(IS_VALIDA);
  }

  /**
* Establece el estado de validación del formulario de formularioTotal.
* 
* @param valida - Un valor booleano que indica si el formulario de datos del formularioTotal es válido.
*/
  setFormValida(valida: boolean): void {
    this.tramiteStore.setFormValida({ formularioTotal: valida });
  }
}
