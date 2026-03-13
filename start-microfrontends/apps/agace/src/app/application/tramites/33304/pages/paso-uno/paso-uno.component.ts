import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, SolicitanteComponent, TIPO_PERSONA } from '@ng-mf/data-access-user';
import { DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL, PERSONA_MORAL_NACIONAL } from '@libs/shared/data-access-user/src/tramites/constantes/solicitante-constantes.enum';
import { OnDestroy, OnInit } from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';
import { FormularioDinamico } from '@ng-mf/data-access-user';
import { SolicitudService } from '../../services/solicitud.service';

@Component({
  selector: 'paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss'
})
export class PasoUnoComponent implements OnInit, OnDestroy, AfterViewInit {

  /**
   * Referencia al componente `SolicitanteComponent` dentro de la vista.
   * 
   * Esta propiedad utiliza el decorador `@ViewChild` para obtener una instancia
   * del componente `SolicitanteComponent` que se encuentra en la plantilla del
   * componente actual. Permite interactuar directamente con los métodos y 
   * propiedades del componente hijo.
   */
  @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;

  /**
   * Representa el tipo de persona asociado.
   * 
   * @type {number}
   * @remarks
   * Este valor se utiliza para identificar si la persona es física o moral.
   * Los valores específicos deben ser definidos según los requisitos del sistema.
   */
  tipoPersona!: number;
  /**
   * Representa un arreglo de objetos de tipo FormularioDinamico.
   * 
   * @remarks
   * Este arreglo se utiliza para almacenar información dinámica relacionada con el formulario.
   */
  persona: FormularioDinamico[] = [];
  /**
   * Arreglo que almacena los datos del formulario dinámico relacionados con el domicilio fiscal.
   * 
   * Cada elemento del arreglo es una instancia de `FormularioDinamico`, que representa
   * un conjunto de campos dinámicos configurados para capturar información específica.
   */
  domicilioFiscal: FormularioDinamico[] = [];
  /**
   * Índice que representa el número actual o posición en un proceso o lista.
   * Se inicializa con el valor 1.
   */
  indice: number = 1;
   /**
   * Indica si los datos de respuesta del servidor están disponibles para actualizar el formulario.
   */
  public esDatosRespuesta: boolean = false;

  /**
   * Subject para notificar la destrucción del componente y cancelar suscripciones activas.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado de la consulta actual, obtenido desde el store.
   */
  public consultaState!: ConsultaioState;
  
  constructor(
    private solicitudService: SolicitudService,
    private consultaQuery: ConsultaioQuery
  ) {
    // Constructor vacío: La inicialización se realizará en métodos específicos según sea necesario.
  }

  /**
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   * Suscribe al estado de la consulta y decide si cargar datos o mostrar respuesta.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
        })
      )
      .subscribe();
    if (this.consultaState.update) {
      this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.solicitudService
      .obtenerDatos()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        this.esDatosRespuesta = true;
        this.solicitudService.actualizarEstadoFormulario(resp);
       
      });
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta después de que la vista del componente ha sido inicializada.
   * 
   * En este método:
   * - Se inicializa la propiedad `persona` con los datos de una persona moral nacional.
   * - Se establece el domicilio fiscal correspondiente a una persona moral o física nacional.
   * - Se invoca el método `obtenerTipoPersona` del servicio `solicitante` para definir el tipo de persona como moral nacional.
   */
  ngAfterViewInit(): void {

    this.persona = PERSONA_MORAL_NACIONAL;
    this.domicilioFiscal = DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL;
    this.solicitante.obtenerTipoPersona(TIPO_PERSONA.MORAL_NACIONAL);
  }

  /**
   * Selecciona una pestaña específica estableciendo el índice correspondiente.
   *
   * @param i - El índice de la pestaña que se desea seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Método del ciclo de vida que se ejecuta al destruir el componente.
   * Libera las suscripciones activas para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

}
