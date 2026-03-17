import { AfterViewInit, Component , OnDestroy,OnInit ,ViewChild} from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { SolicitanteComponent, TIPO_PERSONA } from '@libs/shared/data-access-user/src';
import {Subject, map, takeUntil } from 'rxjs';
import {SolicitudDeRegistroInvocarService} from '../../services/solicitudDeRegistroInvocar/solicitud-de-registro-invocar.service';
/**
 * Componente correspondiente al primer paso del flujo del trámite.
 * Se encarga de gestionar la selección de pestañas y la configuración del solicitante.
 *
 * @export
 * @class PasoUnoComponent
 * @implements {AfterViewInit}
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
})
export class PasoUnoComponent implements AfterViewInit ,OnInit, OnDestroy {

  /**
   * Índice para manejar la pestaña seleccionada.
   * Este valor determina cuál pestaña está activa en la interfaz de usuario.
   *
   * @type {number}
   * @memberof PasoUnoComponent
   */
  indice: number = 1;

 /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

/** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado actual de la consulta de información.
   * 
   * Esta propiedad almacena el estado relacionado con la consulta de datos
   * de tipo `ConsultaioState`, permitiendo gestionar y acceder a la información
   * relevante durante el ciclo de vida del componente.
   */
  public consultaState!: ConsultaioState;

constructor(private consultaQuery: ConsultaioQuery,private solicitudDeRegistroInvocarService: SolicitudDeRegistroInvocarService) {
    // Constructor vacío, la inicialización se realizará en métodos específicos según sea necesario.
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
        this.guardarDatosperfiless();
        this.guardarDatosperfilesMensajerias();
        this.guardarDatosTercerosStore();
        this.guardarDatostramite32616DataStore();
      } else {
        this.esDatosRespuesta = true;
      }
    })).subscribe();

  }




 /**
     * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
     * Luego reinicializa el formulario con los valores actualizados desde el store.
     */
  guardarDatosperfiless(): void {
    this.solicitudDeRegistroInvocarService
      .getRegistroperfilessData().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.solicitudDeRegistroInvocarService.actualizarTodosCampos(resp);
        }
      });
  }

  /**
     * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
     * Luego reinicializa el formulario con los valores actualizados desde el store.
     */
  guardarDatosFormulario(): void {
    this.solicitudDeRegistroInvocarService
      .getRegistroTomaMuestrasMercanciasData().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.solicitudDeRegistroInvocarService.setRegistroTomaMuestrasMercanciasData(resp);
        }
      });
  }

guardarDatosperfilesMensajerias(): void {
    this.solicitudDeRegistroInvocarService
      .getRegistroTperfilesMensajeriassData().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.solicitudDeRegistroInvocarService.actualizarTodosCamposPerfilesMensajeria(resp);
        }
      });
  }


 guardarDatosTercerosStore(): void {
    this.solicitudDeRegistroInvocarService
      .getRegistroTotercerosData().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.solicitudDeRegistroInvocarService.actualizarTodosCamposTerceros(resp);
        }
      });
  }

 guardarDatostramite32616DataStore(): void {
    this.solicitudDeRegistroInvocarService
      .getRegistroTotramite32616Data().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.solicitudDeRegistroInvocarService.actualizarTodosCamposTramite(resp);
        }
      });
  }

  /**
   * Decorador `ViewChild` para acceder a la instancia del componente `SolicitanteComponent`.
   * Este componente se utiliza para gestionar información relacionada con el solicitante.
   *
   * @type {SolicitanteComponent}
   * @memberof PasoUnoComponent
   */
  @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;

  /**
   * Método del ciclo de vida de Angular que se ejecuta después de que la vista ha sido inicializada.
   * En este método se llama al componente `SolicitanteComponent` para establecer el tipo de persona.
   *
   * @memberof PasoUnoComponent
   */
  ngAfterViewInit(): void {
    // Llama al método para obtener el tipo de persona (en este caso, una persona moral nacional)
    this.solicitante.obtenerTipoPersona(TIPO_PERSONA.MORAL_NACIONAL);
  }

  /**
   * Permite que el usuario seleccione una pestaña cambiando el valor de `indice`.
   * 
   * @param {number} indice - El índice de la pestaña seleccionada.
   * @memberof PasoUnoComponent
   */
  seleccionaTab(indice: number): void {
    // Establece el índice de la pestaña seleccionada
    this.indice = indice;
  }

  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
