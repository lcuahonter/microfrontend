import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { SolicitanteComponent, TIPO_PERSONA } from '@libs/shared/data-access-user/src';
import { AvisoComponent } from '../../components/aviso/aviso.component';
import { AvisoTrasladoService } from '../../services/aviso-traslado.service';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { Tramite32503Query } from '../../../../estados/queries/tramite32503.query';
import { Tramite32503State } from '../../../../estados/tramites/tramite32503.store';
import { Tramite32503Store } from '../../../../estados/tramites/tramite32503.store';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';

/**
 * Componente para gestionar el paso uno del trámite 32503.
 * 
 * Este componente permite al usuario navegar entre las pestañas del trámite y gestionar
 * los datos del solicitante y del aviso.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
  standalone: true,
  imports: [CommonModule, SolicitanteComponent, AvisoComponent]
})
export class PasoUnoComponent implements OnInit, OnDestroy, AfterViewInit {

  /**
   * Referencia al componente `SolicitanteComponent`.
   * 
   * Esta propiedad utiliza `@ViewChild` para obtener una referencia al componente
   * del solicitante dentro de la plantilla.
   */
  @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;

  /**
   * Referencia al componente `AvisoComponent`.
   * 
   * Esta propiedad utiliza `@ViewChild` para obtener una referencia al componente
   * del aviso dentro de la plantilla.
   */
  @ViewChild(AvisoComponent) aviso!: AvisoComponent;

  /**
   * Índice de la pestaña activa.
   * 
   * Esta propiedad indica la pestaña actual seleccionada en el componente.
   */
  indice: number = 1;

  /**
   * Estado actual del trámite 32503.
   * 
   * Esta propiedad almacena el estado del trámite obtenido desde el store.
   */
  public tramiteState!: Tramite32503State;

  /**
   * Notificador para destruir las suscripciones y evitar fugas de memoria.
   * 
   * Este `Subject` se utiliza para cancelar las suscripciones activas cuando
   * el componente se destruye.
   */
  destroyNotifier$: Subject<void> = new Subject();
  /**
   * @property {ConsultaioState} consultaDatos
   * @description Estado actual de la consulta, que contiene información relacionada con el trámite y el solicitante.
   */
  public consultaDatos!: ConsultaioState;
  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;
  /**
   * Constructor del componente.
   * 
   * @param {Tramite32503Store} store - Store para gestionar el estado del trámite.
   * @param {Tramite32503Query} tramiteQuery - Query para obtener el estado del trámite.
   */
  constructor(
    public store: Tramite32503Store,
    public tramiteQuery: Tramite32503Query,
    private consultaioQuery: ConsultaioQuery,
    public avisoTrasladoService: AvisoTrasladoService,
  ) {
    // El constructor se utiliza para la inyección de dependencias.
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * 
   * Este método suscribe al estado del trámite y actualiza la propiedad `tramiteState`
   * con los datos obtenidos. También inicializa el índice de la pestaña activa.
   */
  ngOnInit(): void {
    this.tramiteQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.tramiteState = seccionState;
        })
      )
      .subscribe();
    this.indice = this.tramiteState.pestanaActiva;
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.esDatosRespuesta = this.consultaDatos.readonly;
        })
      )
      .subscribe();
    if (this.consultaDatos.update) {
      this.fetchGetDatosConsulta();
    } else {
      this.esDatosRespuesta = true;
    }
  }

  /**
   * Obtiene los datos de consulta desde el servicio y actualiza el estado del store.
   * 
   * Este método realiza una solicitud al servicio `AvisoTrasladoService` para obtener
   * los datos de consulta relacionados con el trámite. Si la respuesta es exitosa, actualiza
   * el estado del store con los datos del formulario de aviso y la tabla de datos.
   */
  public fetchGetDatosConsulta(): void {
    this.avisoTrasladoService
      .getDatosConsulta()
      .pipe(takeUntil(this.destroyNotifier$)).subscribe((respuesta) => {
        if (respuesta.success) {
          this.esDatosRespuesta = true;
          this.store.setAvisoFormulario(respuesta.datos.avisoFormulario);
          this.store.setTablaDeDatos(respuesta.datos.tablaDeDatos);
        }
      });
  }
  /**
  * Gancho de ciclo de vida angular que se llama después de que la vista del componente se haya inicializado por completo.
  */
  ngAfterViewInit(): void {
    this.obtenerTipoPersona();
  }
  /**
  * @method obtenerTipoPersona
  * @description Obtiene el tipo de persona y lo establece en el componente `SolicitanteComponent`.
  * 
  * Este método utiliza un `setTimeout` para ejecutar la función `obtenerTipoPersona` del componente `SolicitanteComponent` con el valor `TIPO_PERSONA.MORAL_NACIONAL`.
  * 
  * @returns {void}
  */
  obtenerTipoPersona(): void {
    setTimeout(() => {
      if (this.solicitante) {
        this.solicitante.obtenerTipoPersona(TIPO_PERSONA.MORAL_NACIONAL);
      }
    }, 50);
  }
  /**
   * Cambia la pestaña activa.
   * 
   * Este método actualiza el índice de la pestaña activa y llama al método correspondiente
   * del store para actualizar el estado.
   * 
   * @param {number} i - Índice de la pestaña seleccionada.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
    this.store.setPestanaActiva(this.indice);
    this.obtenerTipoPersona();
  }

  /**
   * @method triggerValidation
   * @description Método público para activar la validación en todos los componentes del paso.
   * @returns {boolean} true si todos los formularios son válidos, false en caso contrario.
   */
  public triggerValidation(): boolean {
    let IS_VALID = true;

    // Validar el componente Solicitante si está disponible
    if (this.solicitante) {
      const SOLICITANTE_VALID = PasoUnoComponent.validateSolicitanteData(this.tramiteState);
      IS_VALID = IS_VALID && SOLICITANTE_VALID;
    }

    // Validar el componente Aviso si está disponible
    if (this.aviso) {
      const AVISO_VALID = this.aviso.activarValidacionFormulario();
      IS_VALID = IS_VALID && AVISO_VALID;

      // If validation fails and we're not on the Aviso tab, switch to it
      if (!AVISO_VALID && this.indice !== 2) {
        this.seleccionaTab(2);
      }
    }

    return IS_VALID;
  }

  /**
   * @method validateSolicitanteData
   * @description Método estático para validar los datos del solicitante desde el estado.
   * @param {Tramite32503State} tramiteState - Estado del trámite con los datos del solicitante.
   * @returns {boolean} true si los datos del solicitante son válidos, false en caso contrario.
   */
  static validateSolicitanteData(tramiteState: Tramite32503State): boolean {
    if (!tramiteState?.datosSolicitante) {
      return false;
    }

    const SOLICITANTE = tramiteState.datosSolicitante;

    // Verificar campos obligatorios del solicitante
    const REQUIRED_FIELDS = ['tipoPersona', 'rfc', 'nombres', 'apellidoPaterno'];

    for (const FIELD of REQUIRED_FIELDS) {
      const VALUE = SOLICITANTE[FIELD as keyof typeof SOLICITANTE];
      if (!VALUE || (typeof VALUE === 'string' && VALUE.trim() === '')) {
        return false;
      }
    }

    return true;
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * 
   * Este método emite un valor al `destroyNotifier$` y lo completa para cancelar
   * todas las suscripciones activas y evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}