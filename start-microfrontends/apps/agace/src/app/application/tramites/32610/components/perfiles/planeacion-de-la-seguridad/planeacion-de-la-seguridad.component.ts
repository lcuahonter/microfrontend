import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Solicitud32610State,
  Solicitud32610Store
} from '../../../estados/solicitud32610.store';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { InputRadioComponent } from '@libs/shared/data-access-user/src';
import { OPCIONES_DE_BOTON_DE_RADIO } from '@libs/shared/data-access-user/src/tramites/constantes/31616/datos-comunes.enum';
import { Solicitud32610Query } from '../../../estados/solicitud32610.query';
import { TEXTOS_ESTATICOS_PLANEACION } from '../../../constants/texto-estatico-dos.enum';
/**
 * @component ProfilesDomocilioDelaComponent
 * @description
 * Componente que gestiona el formulario de contingencia relacionado con los perfiles de domicilio.
 * Permite la captura y validación de datos relacionados con seguridad, auditorías y planes de emergencia.
 */
@Component({
  selector: 'app-planeacion-de-la-seguridad',
  standalone: true,
  imports: [InputRadioComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './planeacion-de-la-seguridad.component.html',
  styleUrls: ['./planeacion-de-la-seguridad.component.scss'],
})
export class PlaneacionDelaSeguridadComponent implements OnInit, OnDestroy {
  /**
 * Contiene los textos estáticos utilizados en la vista, definidos en el archivo de constantes.
 */
  public textos = TEXTOS_ESTATICOS_PLANEACION
  /**
   * @property {string[]} opcionDeBotonDeRadio
   * @description
   * Opciones disponibles para los botones de radio en el formulario.
   */
  opcionDeBotonDeRadio = OPCIONES_DE_BOTON_DE_RADIO;

  /**
   * @property {FormGroup} contingencyForm
   * @description
   * Formulario reactivo que contiene los campos relacionados con la contingencia.
   */
  contingencyForm!: FormGroup;

  /**
   * @property {Solicitud32610State} solicitudState
   * @description
   * Estado actual de la solicitud, obtenido desde el store.
   * Contiene los valores iniciales para los campos del formulario.
   */
  private solicitudState!: Solicitud32610State;

  /**
   * @property {Subject<void>} destroyNotifier$
   * @description
   * Notificador utilizado para gestionar la destrucción de suscripciones y evitar fugas de memoria.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @constructor
   * @description
   * Constructor que inicializa los servicios necesarios para el componente.
   * @param {FormBuilder} fb - Servicio para construir formularios reactivos.
   * @param {Solicitud32610Store} tramite32610Store - Store para gestionar el estado de la solicitud.
   * @param {Solicitud32610Query} tramite32610Query - Query para obtener datos del estado de la solicitud.
   */
  constructor(
    private fb: FormBuilder,
    private tramite32610Store: Solicitud32610Store,
    private tramite32610Query: Solicitud32610Query
  ) {
    //Añade lógica aquí
  }

  /**
   * @method ngOnInit
   * @description
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Configura el formulario y suscribe al estado de la solicitud.
   */
  ngOnInit(): void {
    this.tramite32610Query.selectSolicitud$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((seccionState) => {
        this.solicitudState = seccionState;
        this.actualizarFormularioConEstado();
      });
  }

  /**
   * Actualiza el formulario con el estado actual si está disponible.
   */
  private actualizarFormularioConEstado(): void {
    if (this.solicitudState) {
      this.crearContingencyFormulario();
    }
  }

  /**
   * @method crearContingencyFormulario
   * @description
   * Crea y configura el formulario reactivo con los campos necesarios para la contingencia.
   * Los valores iniciales se obtienen del estado de la solicitud.
   */
  crearContingencyFormulario(): void {
    const PERFILES = this.solicitudState?.perfiles || {};
    
    this.contingencyForm = this.fb.group({
      ...PlaneacionDelaSeguridadComponent.crearControlesBasicos(PERFILES),
      ...PlaneacionDelaSeguridadComponent.crearControlesAuditoria(PERFILES),
      ...PlaneacionDelaSeguridadComponent.crearControlesEmergencia(PERFILES)
    });
  }

  /**
   * Crea los controles básicos del formulario de planeación.
   */
  private static crearControlesBasicos(perfiles: Record<string, unknown>): Record<string, unknown[]> {
    return {
      comiteSeguridad: [perfiles['comiteSeguridad'] || '', Validators.required],
      fuentesInformacion: [perfiles['fuentesInformacion'] || '', Validators.required],
      politica: [perfiles['politica'] || '', Validators.required],
      indique: [perfiles['indique'] || '', Validators.required],
      periodicidadDos: [perfiles['periodicidadDos'] || '', Validators.required],
      programa: [perfiles['programa'] || '', Validators.required],
      capacitacion: [perfiles['capacitacion'] || '', Validators.required],
      procedimiento: [perfiles['procedimiento'] || '', Validators.required],
      descripcionProcedimiento: [perfiles['descripcionProcedimiento'] || '', Validators.required],
      nombreProcedimiento: [perfiles['nombreProcedimiento'] || '', Validators.required]
    };
  }

  /**
   * Crea los controles de auditoría del formulario de planeación.
   */
  private static crearControlesAuditoria(perfiles: Record<string, unknown>): Record<string, unknown[]> {
    return {
      programacionAuditoria: [perfiles['programacionAuditoria'] || '', Validators.required],
      participantesAuditoria: [perfiles['participantesAuditoria'] || '', Validators.required],
      enfoqueAuditoria: [perfiles['enfoqueAuditoria'] || '', Validators.required],
      procesosAuditados: [perfiles['procesosAuditados'] || '', Validators.required],
      registrosAuditoria: [perfiles['registrosAuditoria'] || '', Validators.required],
      programacion: [perfiles['programacion'] || '', Validators.required],
      registrosNombre: [perfiles['registrosNombre'] || '', Validators.required],
      registrosEmpresa: [perfiles['registrosEmpresa'] || '', Validators.required]
    };
  }

  /**
   * Crea los controles de emergencia del formulario de planeación.
   */
  private static crearControlesEmergencia(perfiles: Record<string, unknown>): Record<string, unknown[]> {
    return {
      planEmergencia: [perfiles['planEmergencia'] || '', Validators.required],
      situacionesContempladas: [perfiles['situacionesContempladas'] || '', Validators.required],
      mecanismosContinuidad: [perfiles['mecanismosContinuidad'] || '', Validators.required],
      simulacrosDocumentacion: [perfiles['simulacrosDocumentacion'] || '', Validators.required]
    };
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
      this.tramite32610Store.actualizarEstado({ perfiles: { [campo]: CONTROL.value } });
    }
  }

  /**
   * @property {boolean} anexe
   * @description
   * Propiedad booleana que indica si se debe anexar información adicional.
   * Se actualiza en función del valor de un checkbox mediante el método `inputChecked`.
   * Valor inicial: `false`.
   */
  public anexe = false;

  /**
   * @method inputChecked
   * @description
   * Método que verifica el valor de un checkbox y actualiza la propiedad `anexe` en función de este.
   * Si el valor del checkbox es `'1'`, establece `anexe` como `true`. En caso contrario, lo establece como `false`.
   * @param {string | number} checkBoxValue - Valor del checkbox que se evalúa.
   */
  public inputChecked(checkBoxValue: string | number): void {
    if (checkBoxValue === '1') {
      this.anexe = true;
    } else {
      this.anexe = false;
    }
  }

  /**
   * @method ngOnDestroy
   * @description
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Libera las suscripciones para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
