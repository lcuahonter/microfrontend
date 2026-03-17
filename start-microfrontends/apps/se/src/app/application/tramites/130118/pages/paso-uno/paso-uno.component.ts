/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { FormularioDinamico } from '@ng-mf/data-access-user';
import { PeximService } from '../../services/pexim.service';
import { SolicitudComponent } from '../../components/solicitud/solicitud.component';

/**
 * Componente para gestionar el paso uno del trámite 130118.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss'
})
export class PasoUnoComponent implements OnInit, OnDestroy {

  /**
   * RFC del usuario.
   */
  @Input() rfc!: string;

  /**
   * Referencia al componente SolicitudComponent.
   * Permite interactuar con el formulario de solicitud principal.
   */
  @ViewChild(SolicitudComponent) solicitudComponent!: SolicitudComponent;

  /**
   * Tipo de persona seleccionada (física o moral).
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
   * Índice de la pestaña seleccionada en la interfaz de usuario.
   */
  indice: number = 1;

  /**
   * Subject para notificar la destrucción del componente y cancelar suscripciones.
   */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado de la consulta obtenido desde el store.
   */
  public consultaState!: ConsultaioState;

  /**
   * Indica si existen datos de respuesta del servidor para actualizar el formulario.
   */
  public esDatosRespuesta: boolean = false;

  /**
   * Evento para cargar archivos.
   * Se utiliza para notificar a otros componentes que se debe realizar una acción de carga de archivos.
   */
  cargaArchivosEvento = new Subject<any>();

  ocultarForm: boolean = false;

  /**
   * Constructor del componente.
   * @param consultaQuery Consulta para obtener el estado de la consulta.
   * @param peximService Servicio para manejar la lógica de negocio relacionada con el trámite.
   */
  constructor(
    public consultaQuery: ConsultaioQuery,
    private peximService: PeximService
  ) { }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Suscribe al estado de consulta y carga datos si es necesario.
   */
  ngOnInit(): void {
    // Suscribirse al estado de consulta para obtener datos actualizados
    this.consultaQuery.selectConsultaioState$.pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState) => {
        this.consultaState = seccionState;
      })
    ).subscribe();

    if(this.consultaState.readonly === true){
      this.ocultarForm = true;
    }
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormularios(): void {
    this.peximService
      .getRegistroTomaMuestrasMercanciasData().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.peximService.actualizarEstadoFormulario(resp);
        }
      });
  }

  /**
  * Cambia la pestaña seleccionada en la UI.
  * @param i Índice de la pestaña a activar.
  */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  
  /**
   * Este método se utiliza para validar el formulario antes de proceder con la solicitud.
   * @returns Devuelve true si el formulario de solicitud es válido, false en caso contrario.
   */
  validarFormulario(): boolean {
  return this.solicitudComponent?.validarFormulario() ?? false;
}

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Cancela todas las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}