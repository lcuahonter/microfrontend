import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL, PERSONA_MORAL_NACIONAL } from '@libs/shared/data-access-user/src/tramites/constantes/solicitante-constantes.enum';

import { ConsultaioQuery, ConsultaioState, FormularioDinamico, TIPO_PERSONA } from '@ng-mf/data-access-user';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src';

import { Subject,map,takeUntil } from 'rxjs';

import { Solicitud261601State, Solicitud261601Store } from '../../estados/tramites261601.store';
import { Solicitud261601Query } from '../../estados/tramites261601.query';

import { CorreccionInternaDeLaCofeprisService } from '../../services/correccion-interna-de-la-cofepris.service';


/**
 * Componente que representa el primer paso del trámite.
 *
 * Este componente agrupa los subcomponentes de solicitante, datos de la solicitud,
 * pago de derechos, terceros relacionados y trámites asociados, y administra la
 * navegación entre las pestañas del asistente.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styles: ``,
  
})
export class PasoUnoComponent implements AfterViewInit,OnInit,OnDestroy {

  /**
   * Referencia al componente de Solicitante.
   *
   * Se utiliza para acceder a métodos y propiedades del SolicitanteComponent.
   */
  @ViewChild(SolicitanteComponent)
  solicitante!: SolicitanteComponent;

  /**
   * Tipo de persona seleccionada.
   *
   * Representa el tipo de persona (por ejemplo, física o moral) que se selecciona.
   */
  tipoPersona!: number;

  /**
   * Configuración del formulario dinámico para la persona.
   *
   * Es un arreglo de objetos de tipo FormularioDinamico que define los campos y validaciones
   * para el formulario de persona.
   */
  persona: FormularioDinamico[] = [];

  /**
   * Configuración del formulario dinámico para el domicilio fiscal.
   *
   * Es un arreglo de objetos de tipo FormularioDinamico que define los campos y validaciones
   * para el formulario del domicilio fiscal.
   */
  domicilioFiscal: FormularioDinamico[] = [];

  /**
   * Índice de la pestaña actual del asistente.
   */
  indice: number = 1;

  public esDatosRespuesta: boolean = false;

  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();

  /** Estado de la consulta que se obtiene del store. */
  public consultaState!:ConsultaioState;

  constructor(
    public solicitud261601Store: Solicitud261601Store,
    public solicitud261601Query: Solicitud261601Query,
    private correccionService: CorreccionInternaDeLaCofeprisService,
    public consultaQuery: ConsultaioQuery,
  ) {
     
  }

  /**
   * Método del ciclo de vida que se ejecuta después de la inicialización de la vista.
   *
   * Inicializa las configuraciones de los formularios dinámicos y establece el tipo de persona
   * en el componente Solicitante.
   */
  ngAfterViewInit(): void {
    // Asigna las configuraciones de formulario para persona y domicilio fiscal.
    this.persona = PERSONA_MORAL_NACIONAL;
    this.domicilioFiscal = DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL;
    // Llama al método del componente Solicitante para establecer el tipo de persona.
    this.solicitante.obtenerTipoPersona(TIPO_PERSONA.MORAL_NACIONAL);
  }

  
   /**
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   * Suscribe al estado de consulta y verifica si se deben guardar los datos del formulario
   * o si los datos de respuesta están disponibles.
   */
   ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$), map((seccionState) => {
          this.consultaState = seccionState;
      })).subscribe();
    if(this.consultaState.update) {
      this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }
  }

  /**
   * Método para guardar los datos del formulario.
   * Obtiene los datos de consulta desde el servicio y actualiza el estado del formulario.
   */
  guardarDatosFormulario(): void {
    this.correccionService
      .getConsultaData().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp: Solicitud261601State) => {
        if(resp){    
        this.esDatosRespuesta = true;
        this.correccionService.actualizarEstadoFormulario(resp);
        }
      });
  }

  /**
   * Selecciona una pestaña del asistente.
   *
   * @param i Índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

ngOnDestroy(): void {
  this.destroyNotifier$.next(); 
  this.destroyNotifier$.complete(); 
}
}