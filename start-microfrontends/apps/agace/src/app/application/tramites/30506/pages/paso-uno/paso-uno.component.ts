import { Component, OnDestroy, OnInit} from '@angular/core';
import { ConsultaioQuery, ConsultaioState,FormularioDinamico } from '@ng-mf/data-access-user';
import { ReplaySubject, map, takeUntil } from 'rxjs';
import { RegistroService } from '../../services/registro.service';

/**
 * Componente que representa el primer paso del trámite.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styles: ``,

})
export class PasoUnoComponent implements OnInit, OnDestroy {
  /**
   * Indica si se deben mostrar los datos de respuesta.
   * Inicialmente es falso, lo que significa que no se muestran.
   */
  public esDatosRespuesta: boolean = false; 
  /**
   * Subject para manejar la destrucción del componente y evitar fugas de memoria.
   * Se utiliza para notificar a las suscripciones que deben finalizarse.
   */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  /**
   * Estado de la consulta, que se obtiene a través del ConsultaioQuery.
   * Este estado contiene información sobre la consulta actual.
   */
  public consultaState!: ConsultaioState; 
  /**
   * Datos de respuesta que se pueden utilizar en el componente.
   * Inicialmente es de tipo desconocido, lo que significa que no se ha definido aún.
   */
  public datosRespuesta: unknown; 
 
  /**
   * Tipo de persona seleccionada.
   */
  tipoPersona!: number;

  /**
   * Configuración del formulario dinámico para la persona.
   */
  persona: FormularioDinamico[] = [];

  /**
   * Configuración del formulario dinámico para el domicilio fiscal.
   */
  domicilioFiscal: FormularioDinamico[] = [];

  /**
   * Índice del paso actual.
   */
  indice: number = 1;

   /**
   * Constructor del componente PasoUnoComponent.
   * @param router Inyecta el servicio Router para la navegación.
   */
  constructor(
    private consultaioQuery: ConsultaioQuery,
    private registroService: RegistroService
  ) { }


    /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Suscribe al estado de consulta y carga datos si es necesario.
   */
  ngOnInit(): void {
     this.consultaioQuery.selectConsultaioState$.pipe(
      takeUntil(this.destroyed$),
      map((seccionState) => {
        this.consultaState = seccionState;
      })
    ).subscribe();
    if (this.consultaState.update) {
      this.guardarDatosFormularios();
    } else {
      this.esDatosRespuesta = true;
    }
  }


  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormularios(): void {
    this.registroService
      .getRegistroTomaMuestrasMercanciasData().pipe(
        takeUntil(this.destroyed$)
      )
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.registroService.actualizarEstadoFormulario(resp);
        }
      });
  }
  /**
   * Selecciona una pestaña del asistente.
   * @param i Índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }
  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   *
   * Emite un valor y completa el subject `destroyNotifier$` para notificar a todas las suscripciones
   * que deben finalizarse, evitando así fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
