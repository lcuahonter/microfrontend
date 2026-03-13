import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, FormularioDinamico, PAGO_DE_DERECHOS, SolicitanteComponent, TIPO_PERSONA } from '@ng-mf/data-access-user';
import { DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL, PERSONA_MORAL_NACIONAL } from '@libs/shared/data-access-user/src/tramites/constantes/solicitante-constantes.enum';
import { Subject, map, takeUntil } from 'rxjs';
import { Tramite110202Store, TramiteState } from '../../estados/tramite110202.store';
import { CertificadoOrigenComponent } from '../../components/certificado-origen/certificado-origen.component';
import { CertificadoValidacionService } from '../../services/certificado-validacion.service';
import { CommonModule } from '@angular/common';
import { DatosCertificadoComponent } from '../../components/datos-certificado/datos-certificado.component';
import { DestinatarioDeComponent } from '../../components/destinatario-de/destinatario-de.component';

@Component({
  selector: 'app-paso-uno',
  standalone: true,
  imports: [
    CommonModule,
    SolicitanteComponent,
    DestinatarioDeComponent,
    CertificadoOrigenComponent,
    DatosCertificadoComponent
  ],
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss'
})

export class PasoUnoComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild(DestinatarioDeComponent) destinatarioDeComponent!: DestinatarioDeComponent;

  @ViewChild(CertificadoOrigenComponent) certificadoOrigenComponent!: CertificadoOrigenComponent;
  // Decorador ViewChild para acceder a la instancia del componente SolicitanteComponent
  @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;

  // Variable que almacena el tipo de persona: física o moral
  tipoPersona!: number;

  // Arreglo que contiene los formularios dinámicos relacionados con la persona
  persona: FormularioDinamico[] = [];

  // Arreglo que contiene los formularios dinámicos relacionados con el domicilio fiscal
  domicilioFiscal: FormularioDinamico[] = [];

  // Índice para manejar la pestaña seleccionada
  indice: number = 1;
  /**
  * Evento que emite un valor booleano al componente padre.
  * Se activa cuando el subíndice del child componente cambia.
  * - true: el subíndice es 3 (mostrar alerta)
  * - false: cualquier otro valor de subíndice
  */
  @Output() alertaEvento = new EventEmitter<boolean>();

  /**
   * Clase CSS utilizada para mostrar alertas informativas.
   * Esta clase se aplica a los mensajes de información que se muestran en el componente.
   */
  public infoAlert = 'alert-info';

  /**
   * Una constante que contiene el valor del objeto 'PAGO_DE_DERECHOS'.
   * Esta constante se usa para almacenar textos y valores relacionados con el pago de derechos.
   */
  TEXTOS = PAGO_DE_DERECHOS;
  /**
    * Esta variable se utiliza para almacenar el índice del subtítulo.
    */
  public consultaState!: ConsultaioState;

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Referencia al componente `DatosCertificadoComponent` dentro de la vista.
   * 
   * Esta propiedad permite acceder a los métodos y propiedades públicos del componente
   * hijo `DatosCertificadoComponent` desde el componente padre, facilitando la interacción
   * y manipulación de sus datos o comportamientos.
   * 
   * @see DatosCertificadoComponent
   */
  @ViewChild(DatosCertificadoComponent) datosCertificadoComponent!: DatosCertificadoComponent;

  /**
   * Constructor de la clase PasoUnoComponent.
   * 
   * @param cdr Referencia al ChangeDetectorRef para controlar la detección de cambios manualmente.
   * @param consultaQuery Servicio para realizar consultas relacionadas con el trámite.
   * @param certificadoValidacionService Servicio público para la validación de certificados.
   */
  constructor(
    private cdr: ChangeDetectorRef,
    private consultaQuery: ConsultaioQuery,
    private tramite110202Store: Tramite110202Store,
    public certificadoValidacionService: CertificadoValidacionService
  ) {
    // Constructor no realiza ninguna acción en este caso
  }

  /**
   * Este método se ejecuta después de que la vista del componente ha sido inicializada.
   * Inicializa los arreglos `persona` y `domicilioFiscal` con constantes predefinidas.
   * Además, llama a `obtenerTipoPersona` para establecer el tipo de persona y activa la detección de cambios.
   */
  ngAfterViewInit(): void {
    // Inicializa los arreglos `persona` y `domicilioFiscal` con datos predefinidos
    this.persona = PERSONA_MORAL_NACIONAL;
    this.domicilioFiscal = DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL;

    // Llama al método para obtener el tipo de persona (en este caso, una persona moral nacional)
    this.solicitante.obtenerTipoPersona(TIPO_PERSONA.MORAL_NACIONAL);

    // Detecta los cambios realizados en la vista después de la inicialización
    this.cdr.detectChanges();
  }

  /**
   * Este método permite que el usuario seleccione una pestaña cambiando el valor de `indice`.
   * 
   * @param indice El índice de la pestaña seleccionada.
   */
  seleccionaTab(indice: number): void {
    // Establece el índice de la pestaña seleccionada
    this.indice = indice;
    /**
* Verifica si el subíndice actual es 3 y emite un valor booleano al padre.
* - true: mostrar alerta
* - false: ocultar alerta
*/
    this.alertaEvento.emit(this.indice === 3);
  }
  /**
   * @inheritdoc
   * 
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Suscribe al observable del estado de consulta, actualiza el estado local y 
   * realiza acciones según si hay una actualización pendiente.
   * 
   * @remarks
   * - Si existe un estado de consulta y requiere actualización, guarda los datos del formulario.
   * - Si no, establece la bandera de datos de respuesta como verdadera.
   * 
   * @override
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$), map((seccionState) => {
      this.consultaState = seccionState;
    })).subscribe();
    if (this.consultaState && this.consultaState.procedureId === '110202' &&
      this.consultaState.update) {
     this.guardarDatosFormulario(this.consultaState?.id_solicitud);
            this.tramite110202Store.setIdSolicitud(Number(this.consultaState?.id_solicitud));
    } else {
      this.esDatosRespuesta = true;
    }

  }

  /** Método público para validar todos los formularios del paso uno */
  public validateAll(): boolean {
    let isValid = true;
    if (this.solicitante?.form) {
      if (this.solicitante.form.invalid) {
        this.solicitante.form.markAllAsTouched();
        isValid = false;
      }
    } else {
      isValid = false;
    }
    if(this.certificadoOrigenComponent){
      if (!this.certificadoOrigenComponent.validateAll()) {
        isValid = false
      }
    }
    else{
      isValid = false
    }
    if (this.destinatarioDeComponent) {
      if (!this.destinatarioDeComponent.validateAll()) {
        isValid = false;
      }
    } else {
      isValid = false;
    }
    if (this.datosCertificadoComponent) {
      if (!this.datosCertificadoComponent.validateAll()) {
        isValid = false;
      }
    } else {
      isValid = false;
    }
    return isValid;
  }

  /**
* Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
* Luego reinicializa el formulario con los valores actualizados desde el store.
*/
  guardarDatosFormulario(id_solicitud: string): void {
    this.certificadoValidacionService
      .getMostrarSolicitud(id_solicitud)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp?.datos) {
          const DATOS = Array.isArray(resp.datos) ? resp.datos[0] : resp.datos;
          if (DATOS) {
            const MAPPED_DATA = this.certificadoValidacionService.reverseBuildSolicitud110202(DATOS as Record<string, unknown>);
            this.certificadoValidacionService.actualizarEstadoFormulario(MAPPED_DATA as TramiteState);
            this.esDatosRespuesta = true;
          }
        }
      });
  }
  /**
   * @method ngOnDestroy
   * @description Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Utiliza el Subject `destroyNotifier$` para notificar la destrucción y completar las suscripciones.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
