import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, SolicitanteComponent } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { InvoCarService } from '../../services/invocar.service';
import { TIPO_PERSONA } from '@libs/shared/data-access-user/src/tramites/constantes/constantes';
import { DatosDelTramiteDosComponent } from '../../components/datos-del-tramite-dos/datos-del-tramite-dos.component';
import { DatosDelTramiteUnoComponent } from '../../components/datos-del-tramite-uno/datos-del-tramite-uno.component';

/**
 * Este componente se utiliza para mostrar el subtítulo del asistente - 220401
 * Establecer el índice del subtítulo
 */
@Component({
  selector: 'app-pantalla-datos',
  standalone: false,
  templateUrl: './datos.component.html',
})
export class DatosComponent implements AfterViewInit, OnInit, OnDestroy {
  /**
   * Referencia al componente SolicitanteComponent para acceder a sus métodos y propiedades.
   */
  @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;

  /**
   * Referencia al componente DatosDelTramiteDosComponent para acceder a sus métodos y propiedades.
   */
  @ViewChild(DatosDelTramiteDosComponent) datosDelTramiteDosComponent!: DatosDelTramiteDosComponent;
  /**
   * Referencia al componente DatosDelTramiteDosComponent para acceder a sus métodos y propiedades.
   */
  @ViewChild(DatosDelTramiteUnoComponent) datosDelTramiteUnoComponent!: DatosDelTramiteUnoComponent;

  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /**
   * Estado actual de la consulta de información.
   * 
   * Esta propiedad almacena el estado relacionado con la consulta de datos
   * de tipo `ConsultaioState`, permitiendo gestionar y acceder a la información
   * relevante durante el ciclo de vida del componente.
   */
  public consultaState!: ConsultaioState;

  /**
   * Constructor de la clase.
   * 
   * @param consultaQuery Servicio utilizado para realizar consultas relacionadas con la entidad Consultaio.
   * @param invoCarService Servicio encargado de gestionar operaciones relacionadas con InvoCar.
   * 
   * La inicialización de las propiedades se realizará en métodos específicos según sea necesario.
   */
  constructor(private consultaQuery: ConsultaioQuery, private invoCarService: InvoCarService) {
    // Constructor vacío: La inicialización se realizará en métodos específicos según sea necesario.
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * 
   * - Suscribe al observable `selectConsultaioState$` para obtener el estado de la consulta y actualizar la propiedad `consultaState`.
   * - Si la propiedad `update` de `consultaState` es verdadera, llama al método `guardarDatosFormulario()`.
   * - Si no, establece la bandera `esDatosRespuesta` en `true`.
   * 
   * @returns void
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$), map((seccionState) => {
      this.consultaState = seccionState;
      if (this.consultaState.update) {
        this.guardarDatosFormulario();
      } else {
        this.esDatosRespuesta = true;
      }
    })).subscribe();

  }


  /**
     * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
     * Luego reinicializa el formulario con los valores actualizados desde el store.
     */
  guardarDatosFormulario(): void {
    this.invoCarService
      .getRegistroTomaMuestrasMercanciasData().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.invoCarService.actualizarEstadoFormulario(resp);
        }
      });
  }

  /**
   * Se ejecuta después de que la vista ha sido inicializada.
   * Llama al método `obtenerTipoPersona` del componente SolicitanteComponent
   * para establecer el tipo de persona como MORAL_NACIONAL.
   */
  ngAfterViewInit(): void {
    this.solicitante?.obtenerTipoPersona(TIPO_PERSONA.MORAL_NACIONAL);
  }
  /**
   * Esta variable se utiliza para almacenar el índice del subtítulo.
   */
  indice: number = 1;
  /**
   * Este método se utiliza para establecer el índice del subtítulo.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Lógica para validar el formulario del paso dos solo si el componente está presente.
   */
public validarDatosDelTramiteDos(): any {
  this.esDatosRespuesta = true;
  if (this.datosDelTramiteDosComponent) {
    this.datosDelTramiteDosComponent.validarFormularios();
  }
}

 /**
   * Lógica para validar el formulario del paso dos solo si el componente está presente.
   */
public validarDatosDelTramiteUno(): any {
  this.esDatosRespuesta = true;
  if (this.datosDelTramiteUnoComponent) {
   this.datosDelTramiteUnoComponent.validarFormularios();
  }
 
}

  /**
   * @method ngOnDestroy
   * @description Limpia las suscripciones activas y restablece el estado del modal al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
