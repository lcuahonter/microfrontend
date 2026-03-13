import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, FormularioDinamico } from '@ng-mf/data-access-user';
import { DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL, PERSONA_MORAL_NACIONAL } from '@libs/shared/data-access-user/src/tramites/constantes/solicitante-constantes.enum';
import { Subject, map, takeUntil } from 'rxjs';
import { JuntaTecnicaRegistroService } from '../../service/junta-tecnica-registro.service';
import { SolicitanteComponent } from '@ng-mf/data-access-user';
import { Solicitud6102Store } from '../../estados/solicitud6102.store';
@Component({
  selector: 'paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss'
})
export class PasoUnoComponent implements OnInit, AfterViewInit, OnDestroy {

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
  * Sujeto utilizado como notificador para la destrucción del componente.
  * Se emite un valor cuando el componente se destruye, permitiendo cancelar
  * suscripciones o liberar recursos asociados.
  */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @property {ConsultaioState} consultaDatos
   * @description Estado actual de la consulta, que contiene información relacionada con el trámite y el solicitante.
   */
  consultaDatos!: ConsultaioState;

    /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esDatosRespuesta: boolean = false;

  constructor(
    private consultaioQuery: ConsultaioQuery,
    private juntaTecnicaRegistroService: JuntaTecnicaRegistroService,
    private solicitud6102Store: Solicitud6102Store
  ) {}

  /**
   * Método que se ejecuta al inicializar el componente.
   * Suscribe a los cambios de estado y carga datos si es necesario.
   */
  ngOnInit(): void {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
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
   * Obtiene los datos de consulta del servicio y actualiza el store.
   */
  public fetchGetDatosConsulta(): void {
    this.juntaTecnicaRegistroService
      .getDatosConsulta()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((respuesta) => {
        if (respuesta.success) {
          this.esDatosRespuesta = true;
          this.solicitud6102Store.setContenedores(respuesta?.datos?.tecnicaForm.contenedores);
          this.solicitud6102Store.setAduana(respuesta?.datos?.tecnicaForm.aduana);
         this.solicitud6102Store.setObservaciones(respuesta?.datos?.tecnicaForm.observaciones);
        }
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
  }

    /**
   * Método que se ejecuta al destruir el componente.
   * Limpia las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Selecciona una pestaña específica estableciendo el índice correspondiente.
   *
   * @param i - El índice de la pestaña que se desea seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

}
