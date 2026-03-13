import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, Inject, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Tramite32617Store, Tramites32617State } from '../../estados/tramites32617.store';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { FormGroup } from '@angular/forms';
import { InputRadioComponent } from '@libs/shared/data-access-user/src';
import { OPCIONES_DE_BOTON_DE_RADIO } from '../../enums/oea-tercerizacion-logistica-registro.enum';
import { OeaTercerizacionLogisticaRegistroService } from '../../services/oea-tercerizacion-logistica-registro.service';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { Tramite32617Query } from '../../estados/tramites32617.query';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';
/**
 * Componente que gestiona el formulario relacionado con la certificación CTPAT.
 * Utiliza radio buttons para capturar respuestas de sí/no relacionadas con la solicitud.
 */
@Component({
  selector: 'app-c-tpat',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputRadioComponent],
  providers: [OeaTercerizacionLogisticaRegistroService,BsModalService],
  templateUrl: './c-tpat.component.html',
  styleUrl: './c-tpat.component.scss',
})
/**
 * Componente que gestiona el formulario relacionado con la certificación CTPAT.
 * Utiliza radio buttons para capturar respuestas de sí/no relacionadas con la solicitud.
 */
export class CTPATComponent implements OnInit, OnDestroy {
  /** Formulario reactivo que contiene los campos de CTPAT identificados por sus IDs numéricos */
  ctpatForm!: FormGroup;

  /** Subject utilizado para cancelar las suscripciones activas al destruir el componente */
  public destroy$: Subject<void> = new Subject<void>();


  /** Estado actual de la solicitud obtenido desde el store */
  solicitud32617State: Tramites32617State = {} as Tramites32617State;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;
  /**
   * Referencia al modal de Bootstrap para mostrar mensajes informativos.
   */
  modalRef?: BsModalRef;
    /**
   * Referencia al template del modal de mensaje.
   */
  @ViewChild('template') template!: TemplateRef<void>;

  /**
   * Opciones disponibles para los botones de radio (Sí/No).
   * Utiliza las constantes definidas en `OPCIONES_DE_BOTON_DE_RADIO`.
   */
  opcionDeBotonDeRadio = OPCIONES_DE_BOTON_DE_RADIO;

    /**
   * Estado actual de la solicitud del trámite 32617.
   * Contiene toda la información del estado de la aplicación.
   */
  solicitudState!: Tramites32617State;

  /**
   * Bandera que controla la visualización de errores en el formulario.
   * Se activa cuando hay errores de validación que deben mostrarse.
   */
  mostrarError: boolean = false;

  /**
   * Constructor del componente. Inyecta dependencias necesarias y carga las opciones del radio button.
   */
  constructor(
    public fb: FormBuilder,
    public solicitudService: OeaTercerizacionLogisticaRegistroService,
    public solicitud32617Store: Tramite32617Store,
    public solicitud32617Query: Tramite32617Query,
    public consultaioQuery: ConsultaioQuery,
    @Inject(BsModalService)
    private modalService: BsModalService,
  ) {
    /**
     * Se suscribe al estado de `Consultaio` para obtener información actualizada del estado del formulario.
     *
     * - Asigna el valor de solo lectura (`readonly`) a la propiedad `esFormularioSoloLectura`.
     * - Llama a `inicializarEstadoFormulario()` para aplicar configuraciones basadas en el estado recibido.
     * - La suscripción se cancela automáticamente cuando `destroyNotifier$` emite un valor (para evitar fugas de memoria).
     */
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  /**
   * Inicializa el componente, crea el formulario y suscribe a los cambios en el estado de la solicitud.
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
  }

  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario(); // Llama al método para cargar los datos del formulario
    } else {
      this.inicializarFormulario();
    }
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.ctpatForm.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.ctpatForm.enable();
    }
  }

  /**
   * Inicializa el formulario `ctpatForm` con los valores actuales del estado `solicitud32617State`.
   *
   * Este método crea un formulario reactivo usando `FormBuilder`, asignando los valores
   * de los campos `'2089'`, `'2090'` y `'2091'`. Además, se suscribe al observable
   * `selectTramite32617$` para escuchar actualizaciones del estado y aplicar los valores
   * actualizados al formulario.
   *
   * También gestiona la destrucción de la suscripción usando `takeUntil` con `destroy$`.
   */
  inicializarFormulario(): void {
    this.obtenerEstadoSolicitud();
    this.ctpatForm = this.fb.group({
     autorizacionCBP:[this.solicitudState?.autorizacionCBP, Validators.required],
     instalacionesCertificadasCBP:[this.solicitudState?.instalacionesCertificadasCBP, Validators.required],
     suspensionCancelacionCBP:[this.solicitudState?.suspensionCancelacionCBP, Validators.required],
    });

   
  }

   /**
   * Obtiene el estado actual de la solicitud desde el store.
   * Se suscribe a los cambios del estado y actualiza la tabla de datos.
   * Mantiene sincronizada la información entre el store y el componente.
   */
  obtenerEstadoSolicitud(): void {
    this.solicitud32617Query.selectTramite32617$?.pipe(takeUntil(this.destroy$))
      .subscribe((data: Tramites32617State) => {
        this.solicitudState = data;
      });
  }
  
  /**
   * Establece valores en el store desde un control de formulario específico.
   * Actualiza el estado global con el valor del campo si no es nulo o indefinido.
   * 
   * param form - Formulario que contiene el control
   * param campo - Nombre del campo a actualizar en el store
   */
  setValoresStore(form: FormGroup | null, campo: string): void {
    if (!form) {
      return;
    }
    const CONTROL = form.get(campo);
    if (CONTROL && CONTROL.value !== null && CONTROL.value !== undefined) {
      this.solicitud32617Store.establecerDatos({ [campo]: CONTROL.value });
    }
  }
    /**
   * Maneja el cambio en el campo de suspensión/cancelación CBP.
   * Si se selecciona "Sí", muestra el modal con el mensaje informativo.
   * Actualiza el store con el nuevo valor seleccionado.
   * 
   * param valor - Valor seleccionado en el radio button ('1' para Sí, '0' para No)
   */
 manejarCambioSuspensionCancelacion(event: Event): void {
  const TARGET = event.target as HTMLInputElement;
  const VALOR = TARGET.value;
  
  this.setValoresStore(this.ctpatForm, 'suspensionCancelacionCBP');
  
  // Si se selecciona "Sí" (valor '1'), mostrar el modal
  if (VALOR === 'on') {
    this.mostrarModalMensaje();
  }
}

    /**
   * Muestra el modal con el mensaje informativo sobre el requisito CBP.
   * Configura el modal como no dismissible para asegurar que el usuario lea el mensaje.
   */
  mostrarModalMensaje(): void {
    const CONFIGURACION_MODAL = {
      animated: true,
      keyboard: false,
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-md'
    };

    this.modalRef = this.modalService.show(this.template, CONFIGURACION_MODAL);
  }

    /**
   * Cierra el modal de mensaje informativo.
   * Se ejecuta cuando el usuario hace clic en el botón "Aceptar".
   */
  cerrarModal(): void {
    this.modalRef?.hide();
  }

  /**
   * Valida que todos los campos de pago estén completos.
   * Actualiza la bandera de error según el estado de los campos requeridos.
   */
  validarCamposPago(): void {
    const FECHADEPAGE = this.ctpatForm.get('fechaDePago')?.value;
    const MONTO = this.ctpatForm.get('monto')?.value;
    const OPERACIONESBANCARIAS = this.ctpatForm.get(
      'operacionesBancarias'
    )?.value;
    const LLAVEPAGO = this.ctpatForm.get('llavePago')?.value;
    const CAMPOS_VACIOS =
      !FECHADEPAGE || !MONTO || !OPERACIONESBANCARIAS || !LLAVEPAGO;
    this.mostrarError = CAMPOS_VACIOS;
    if (CAMPOS_VACIOS) {
      this.ctpatForm.get('fechaDePago')?.markAsTouched();
      this.ctpatForm.get('monto')?.markAsTouched();
      this.ctpatForm.get('operacionesBancarias')?.markAsTouched();
      this.ctpatForm.get('llavePago')?.markAsTouched();
    }
  }

  /**
   * Valida el formulario completo, incluyendo los campos de pago.
   * Marca todos los campos como tocados si el formulario es inválido.
   * Retorna `true` si el formulario es válido y todos los campos requeridos están completos.
   *
   * @returns {boolean} `true` si el formulario es válido, `false` en caso contrario.
   */
  validarFormulario(): boolean {
    let esValido = true;
    if (this.ctpatForm.invalid) {
      this.ctpatForm.markAllAsTouched();
      esValido = false;
    }
    this.validarCamposPago();
    if (this.mostrarError) {
      esValido = false;
    }
    return esValido;
  }

  /**
   * Cancela todas las suscripciones activas al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
