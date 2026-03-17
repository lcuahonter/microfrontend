import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InformationGeneralSolicitanteState, Tramite32515Store } from '../../estados/tramite32515.store';
import { 
  CategoriaMensaje, 
  Notificacion, 
  NotificacionesComponent, 
  REG_X, 
  REGEX_CORREO_ELECTRONICO, 
  TipoNotificacionEnum 
} from '@libs/shared/data-access-user/src';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { REPRESENTANTE_LEGAL } from '../../constantes/modificacion-aviso-seguro-global.enum';
import { Tramite32515Query } from '../../estados/tramite32515.query';

@Component({
  selector: 'app-representante-legal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormasDinamicasComponent, NotificacionesComponent],
  templateUrl: './representante-legal.component.html',
  styleUrl: './representante-legal.component.scss',
})
export class RepresentanteLegalComponent implements OnInit, OnDestroy {

  /** Datos de configuración para el formulario del representante legal */
  public datosDelSolicitanteolFormData = REPRESENTANTE_LEGAL;

  /** Estado general del solicitante, provisto por el query */
  public informationGeneralState!: InformationGeneralSolicitanteState;

  /** Subject utilizado para cancelar suscripciones al destruir el componente */
  private destroy$ = new Subject<void>(); 
  
  /** Notificación para mostrar mensajes al usuario */
  public nuevaNotificacion: Notificacion | null = null;

  /** Flag to prevent duplicate RFC notifications */
  private rfcNotificationShown: boolean = false;

  /** Flag to prevent duplicate correo electronico notifications */
  private correoElectronicoNotificationShown: boolean = false;

/**
 * Indica si el formulario está en modo solo lectura.
 * Cuando es `true`, los campos del formulario no se pueden editar.
 */
  esFormularioSoloLectura: boolean = false;
  /** Formulario principal que contiene un subgrupo de controles */
  public forma: FormGroup = new FormGroup({
    /** Subformulario que puede contener datos específicos del representante legal */
    ninoFormGroup: new FormGroup({})
  });

  /**
   * Constructor del componente
   * @param tramiteQuery32515 Provee acceso reactivo al estado del trámite
   * @param tramiteStore32515 Permite modificar el estado del trámite
   * @param consultaQuery Provee acceso a la consulta de estado del usuario
   */
  constructor(
    private tramiteQuery32515: Tramite32515Query,
    public tramiteStore32515: Tramite32515Store,
    public consultaQuery: ConsultaioQuery
  ) {}

  /**
   * Getter para acceder al subformulario 'ninoFormGroup'
   * @returns FormGroup correspondiente al subgrupo
   */
  get ninoFormGroup(): FormGroup {
    return this.forma.get('ninoFormGroup') as FormGroup;
  }  
  
  /**
   * Maneja el evento de cambio en un campo del formulario dinámico
   * @param event Objeto con el nombre del campo y su nuevo valor
   */
  establecerCambioDeValor(event: { campo: string; valor: string }): void {
    if (event) {
      this.cambioEnValoresStore(event.campo, event.valor);
        // Verificar si es el campo RFC
      if (event.campo === 'rfc') {
        if (event.valor && event.valor.trim() !== '') {
          this.rfcNotificationShown = false;
        }
        
      }
      // Verificar si es el campo correoElectronico
      if (event.campo === 'correoElectronico') {
        if (event.valor && event.valor.trim() !== '') {
          this.correoElectronicoNotificationShown = false;
        }
        
      }
    }
  }

  /**
   * Actualiza el estado del store con el nuevo valor de un campo
   * @param campo Campo modificado
   * @param value Nuevo valor que se asigna
   */
  public cambioEnValoresStore(campo: string, value: unknown): void {
    this.tramiteStore32515.establecerDatos(campo, value);
  }

  /**
   * Configura el monitoreo del campo RFC con múltiples estrategias
   */  
  private configurarMonitoreoRfc(): void {
    const RFC_CONTROL = this.ninoFormGroup.get('rfc');
    if (RFC_CONTROL) {
      
      const ORIGINAL_MARK_AS_TOUCHED = RFC_CONTROL.markAsTouched.bind(RFC_CONTROL);      RFC_CONTROL.markAsTouched = (opts?: any) => {
        const RESULT = ORIGINAL_MARK_AS_TOUCHED(opts);
          setTimeout(() => {
          console.log('RFC errors:', RFC_CONTROL.errors);
          console.log('RFC value:', RFC_CONTROL.value);
          if (RFC_CONTROL.errors?.['required'] && !this.rfcNotificationShown) {
            this.mostrarNotificacionRfc();
          }          
          if (RFC_CONTROL.errors?.['pattern'] && !this.rfcNotificationShown) {
            console.log('Showing RFC format notification');
            this.mostrarNotificacionRfcFormato();
          }
          if (RFC_CONTROL.value && !REG_X.RFC_13_ALFANUM.test(RFC_CONTROL.value) && !this.rfcNotificationShown) {
            console.log('Showing RFC format notification - invalid RFC format detected');
            this.mostrarNotificacionRfcFormato();
          }
        }, 10);
        
        return RESULT;
      };
    } 
  }

  /**
   * Configura el monitoreo del campo correoElectronico con múltiples estrategias
   */  
  private configurarMonitoreoCorreoElectronico(): void {
    const CORREO_ELECTRONICO_CONTROL = this.ninoFormGroup.get('correoElectronico');
    if (CORREO_ELECTRONICO_CONTROL) {
      
      const ORIGINAL_MARK_AS_TOUCHED = CORREO_ELECTRONICO_CONTROL.markAsTouched.bind(CORREO_ELECTRONICO_CONTROL);      CORREO_ELECTRONICO_CONTROL.markAsTouched = (opts?: any) => {
        const RESULT = ORIGINAL_MARK_AS_TOUCHED(opts);
          setTimeout(() => {
          if (CORREO_ELECTRONICO_CONTROL.errors?.['required'] && !this.correoElectronicoNotificationShown) {
            this.mostrarNotificacionCorreoElectronico();
          }
          if (CORREO_ELECTRONICO_CONTROL.errors?.['pattern'] && !this.correoElectronicoNotificationShown) {
            this.mostrarNotificacionCorreoElectronicoFormato();
          }
          if (CORREO_ELECTRONICO_CONTROL.value && !REGEX_CORREO_ELECTRONICO.test(CORREO_ELECTRONICO_CONTROL.value) && !this.correoElectronicoNotificationShown) {
            this.mostrarNotificacionCorreoElectronicoFormato();
          }
        }, 10);
        
        return RESULT;
      };
    } 
  }

  /**
   * Muestra la notificación cuando el campo RFC es requerido pero está vacío
   */
  private mostrarNotificacionRfc(): void {    
    if (this.rfcNotificationShown) {
      return;
    }

    this.rfcNotificationShown = true;
    this.nuevaNotificacion = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ALERTA,
      modo: 'modal',
      titulo: '',
      mensaje: 'Debes ingresar un RFC',
      cerrar: true,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }

  /**
   * Muestra la notificación cuando el campo RFC no cumple con el formato
   */
  private mostrarNotificacionRfcFormato(): void {    
    if (this.rfcNotificationShown) {
      return;
    }

    this.rfcNotificationShown = true;
    this.nuevaNotificacion = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ALERTA,
      modo: 'modal',
      titulo: '',
      mensaje: 'Existen datos incorrectos que no cumplen con el formato esperado.',
      cerrar: true,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }
  /**
   * Muestra la notificación cuando el campo correoElectronico es requerido pero está vacío
   */
  private mostrarNotificacionCorreoElectronico(): void {    
    if (this.correoElectronicoNotificationShown) {
      return;
    }

    this.correoElectronicoNotificationShown = true;
    this.nuevaNotificacion = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ALERTA,
      modo: 'modal',
      titulo: '',
      mensaje: 'Debes ingresar un correo',
      cerrar: true,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }

  /**
   * Muestra la notificación cuando el campo correoElectronico no cumple con el formato
   */
  private mostrarNotificacionCorreoElectronicoFormato(): void {    
    if (this.correoElectronicoNotificationShown) {
      return;
    }

    this.correoElectronicoNotificationShown = true;
    this.nuevaNotificacion = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ALERTA,
      modo: 'modal',
      titulo: '',
      mensaje: 'Debes ingresar un correo válido',
      cerrar: true,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }
  
  /**
   * Cierra la notificación actual y resetea los flags de notificación
   */
  cerrarNotificacion(): void {
    this.nuevaNotificacion = null;
    this.rfcNotificationShown = false;
    this.correoElectronicoNotificationShown = false;
  }

  /**
   * Hook de ciclo de vida - se ejecuta al iniciar el componente
   * Se suscribe al estado general del solicitante
   */
  ngOnInit(): void {
    this.tramiteQuery32515.select$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.informationGeneralState = seccionState as InformationGeneralSolicitanteState;
        })
      )
      .subscribe();
            this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {          
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();
      setTimeout(() => {
      this.configurarMonitoreoRfc();
      this.configurarMonitoreoCorreoElectronico();
    }, 500);
  }

  /**
   * Hook de ciclo de vida - se ejecuta al destruir el componente
   * Cancela las suscripciones activas para evitar fugas de memoria
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
