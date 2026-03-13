/**
 * Este componente maneja los datos de la mercancía, incluyendo la validación y la interacción con el estado global.
 */

import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { CodigoRespuesta } from '../../../../core/enum/se-core-enum';
import { CommonModule } from '@angular/common';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil, tap } from 'rxjs';

import { CategoriaMensaje, ConsultaioQuery, Notificacion, NotificacionesComponent, REG_X, TituloComponent } from '@ng-mf/data-access-user';
import { Tramite110102Query } from '../../estados/queries/tramite110102.query';

import { Tramite110102State, Tramite110102Store } from '../../estados/store/tramite110102.store';
import { CriterioConfiguracionRequest } from '../../models/request/tratado-configuracion-request.model';
import { CriterioConfiguracionResponse } from '../../models/response/tratado-configuracion-response.model';
import { DatosMercanciaService } from '../../service/datos-mercancia.service';

import { ComercializadoresProductosResponse } from '../../models/response/comercializadores-productos-response.model';
import { MercanciaStateService } from '../../service/mercancia-state.service';

/**
 * Componente que gestiona los datos de la mercancía, incluyendo la validación de formularios y la interacción con el estado global.
 */
@Component({
  selector: 'app-datos-de-la-mercancia',
  standalone: true,
  imports: [CommonModule, TituloComponent, ReactiveFormsModule, NotificacionesComponent],
  templateUrl: './datos-de-la-mercancia.component.html',
  styleUrls: ['./datos-de-la-mercancia.component.scss'],
})
export class DatosDeLaMercanciaComponent implements OnInit, OnDestroy {
  /**
   * Indica si el formulario está en modo de solo lectura.
   */
  esSoloLectura!: boolean;

  /**
   * Formulario reactivo para gestionar los datos de la mercancía.
   */
  formularioDatosMercancia!: FormGroup;

  /**
   * Subject que emite un evento cuando el componente es destruido, permitiendo la desuscripción de observables.
   */
  private destruido$ = new Subject<void>();

  /**
   * Estado actual del trámite.
   */
  estadoTramite!: Tramite110102State;

  /**
   * Notificación para mostrar alertas al usuario.
   */
  alertaNotificacion!: Notificacion;

  /**
   * Un array de objetos `CriterioConfiguracionResponse` que representa los datos para la la configuracion de los tratados agregados.
  */
  public respuestaTratadosConfiguracion?: CriterioConfiguracionResponse;

  /**
   * Respuesta del registro de productos del comercializador.
   */
  public respuestaRegistroProductos?: ComercializadoresProductosResponse;

  /**
   * Emite la mercancía del comercializador de productos.
   */
  @Output() mercancia = new EventEmitter<ComercializadoresProductosResponse>();

  /** Variable para validar el formulario */
  validarFormulario: boolean = false;

  /**
   * Constructor del componente.
   * @param {FormBuilder} formBuilder - Servicio para la creación de formularios reactivos.
   * @param {Tramite110102Store} tramiteStore - Servicio para manejar el estado del trámite.
   * @param {ConsultaioQuery} consultaQuery - Servicio para consultar el estado de la consulta.
   * @param {Tramite110102Query} tramiteQuery - Servicio para consultar el estado del trámite.
   */
  constructor(
    private formBuilder: FormBuilder,
    private tramiteStore: Tramite110102Store,
    private consultaQuery: ConsultaioQuery,
    private tramiteQuery: Tramite110102Query,
    private datosMercanciaService: DatosMercanciaService,
    private mercanciaState: MercanciaStateService,
    private cd: ChangeDetectorRef,
  ) {
      this.tramiteQuery.selectTramite110102$
      .pipe(takeUntil(this.destruido$))
      .subscribe((estado) => {
        this.estadoTramite = estado;
      });
  }

  /**
   * Hook del ciclo de vida que se llama después de que las propiedades enlazadas a datos de una directiva se inicializan.
   * Inicializa el formulario y configura las suscripciones necesarias.
   */
  ngOnInit(): void {
    this.inicializarFormulario();
    if(this.estadoTramite?.cveRegistroProductor){
      this.registroProductosElegibles();
    }
    this.consultaQuery.selectConsultaioState$
      .pipe(takeUntil(this.destruido$))
      .subscribe((estadoConsulta) => {
        this.esSoloLectura = estadoConsulta.readonly;
      });

    this.formularioDatosMercancia.statusChanges
      .pipe(
        takeUntil(this.destruido$),
        tap((_value) => {
          this.validarFormulario = this.formularioDatosMercancia.valid;
        })
      )
      .subscribe();
  }

  /**
   * Inicializa el formulario con los valores del estado global.
   */
  inicializarFormulario(): void {
    this.formularioDatosMercancia = this.formBuilder.group({
      cveRegistroProductor: [
        this.estadoTramite?.cveRegistroProductor,
        [Validators.required, Validators.pattern(REG_X.SOLO_NUMEROS)],
      ],
    });
  }

  /**
   * Establece los valores en el estado global a partir de un campo específico del formulario.
   * @param {FormGroup} formulario - El formulario reactivo del cual se obtiene el valor.
   * @param {string} campo - El nombre del campo del formulario cuyo valor se establecerá en el estado.
   */
  establecerValoresEnEstado(formulario: FormGroup, campo: string): void {
    const VALOR = formulario.get(campo)?.value;
    this.tramiteStore.establecerDatos({ [campo]: VALOR });
  }


  /**
   * Verifica si un control del formulario es inválido.
   * @param {string} nombreControl - Nombre del control del formulario.
   * @returns {boolean} - Retorna true si el control es inválido, de lo contrario false.
   */
  esControlInvalido(nombreControl: string): boolean {
    const CONTROL = this.formularioDatosMercancia.get(nombreControl);
    return CONTROL ? CONTROL.invalid && (CONTROL.touched || CONTROL.dirty) : false;
  }

  /**
   * Actualiza el estado del grid de comercializadores de productos.
   */
  actualizarGridComercializadores(): void {
    const REGISTRO_PRODUCTOR = this.formularioDatosMercancia.get('cveRegistroProductor');

    if (REGISTRO_PRODUCTOR?.value === '') {
      if (REGISTRO_PRODUCTOR?.hasError('pattern')) {
        this.alertaNotificacion = {
          tipoNotificacion: 'alert',
          categoria: 'danger',
          modo: 'action',
          titulo: '',
          mensaje: 'Debe introducir la clave de registro.',
          cerrar: false,
          tiempoDeEspera: 2000,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: '',
        };
      } else if (REGISTRO_PRODUCTOR?.value === '254023028961') {
        this.alertaNotificacion = {
          tipoNotificacion: 'alert',
          categoria: 'danger',
          modo: 'action',
          titulo: '',
          mensaje:
            'El número de registro proporcionado no existe, no se encuentra vigente o no tiene dado de alta el RFC del comercializador. Favor de verificar.',
          cerrar: false,
          tiempoDeEspera: 2000,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: '',
        };
      }
    }else{
      this.registroProductosElegibles();
    }
  }

  /**
   * @method registroProductosElegibles
   * @description
   * Obtiene los productos elegibles depeneidendo del numero ingresado.
   *
   * @param 
   * @returns {void}
 */
  registroProductosElegibles(): void {
    this.tramiteStore.setValor(
      'cveRegistroProductor',
      this.formularioDatosMercancia.get('cveRegistroProductor')?.value ?? null
    );
    this.datosMercanciaService.getComercializadoresProductos(this.formularioDatosMercancia.get('cveRegistroProductor')?.value, "AAL0409235E6")
      .pipe(takeUntil(this.destruido$))
      .subscribe({
        next: (response) => {
          if (response.codigo === CodigoRespuesta.EXITO) {
            this.respuestaRegistroProductos = response.datos;
            if (this.respuestaRegistroProductos) {
              this.mercanciaState.setMercancia(this.respuestaRegistroProductos);
            }
            const PAYLOADRESPUESTA: CriterioConfiguracionRequest[] = 
             this.respuestaRegistroProductos?.criterios_tratado ? this.respuestaRegistroProductos.criterios_tratado.map(item => ({
                cve_grupo_criterio: item.cve_grupo_criterio,
                cve_tratado_acuerdo: item.tratado_acuerdo.cve_tratado_acuerdo,
                cve_pais: item.cve_pais,
                id_tratado_acuerdo: item.id_tratado_acuerdo
              }))
              : [];
           
            this.mercancia.emit(this.respuestaRegistroProductos);
            
            this.configuracion(PAYLOADRESPUESTA);
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.alertaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: response.error || 'Error en la consulta de la fracción arancelaria.',
              mensaje: response.causa || response.mensaje || 'Error en la consulta de la fracción arancelaria.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
          }
        },
        error: (error) => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          const MENSAJE = error?.error?.error || 'Error en la consulta de la fracción arancelaria.';
          this.alertaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: '',
            mensaje: MENSAJE,
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
        }
      });
  }

  /**
   * @method configuracion
   * @description Realiza la configuración adicional de criterios para los tratados.
   *              Envía una solicitud POST con los datos de configuración y maneja la respuesta.
   * @param {CriterioConfiguracionRequest[]} datos - Array de objetos con datos de configuración de criterios
   * @return {void}
  */
  configuracion(datos: CriterioConfiguracionRequest[]): void {
    const PAYLOAD: CriterioConfiguracionRequest[] = datos.map(item => ({
      cve_grupo_criterio: item.cve_grupo_criterio,
      cve_tratado_acuerdo: item.cve_tratado_acuerdo,
      cve_pais: item.cve_pais,
      id_tratado_acuerdo: item.id_tratado_acuerdo
    }));
    this.datosMercanciaService.postTratadoConfiguracion(PAYLOAD)
      .subscribe({
        next: (resp) => {
          if (resp.codigo === CodigoRespuesta.EXITO) {
            this.respuestaTratadosConfiguracion = resp.datos;
            this.tramiteStore.clearRespuestaServicioDatosConfiguracion();
            this.tramiteStore.setRespuestaServicioDatosConfiguracion(this.respuestaTratadosConfiguracion ?? {} as CriterioConfiguracionResponse);
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.alertaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: resp.error || 'Error configuracion tratado.',
              mensaje:
                resp.causa ||
                resp.mensaje ||
                'Error configuracion tratado.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
          }

        },
        error: (error) => {
          const MENSAJE = error?.error?.error || 'Error configuracion tratado';
          this.alertaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: 'error',
            modo: 'action',
            titulo: '',
            mensaje: MENSAJE,
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          }
        }
      });
  }

  /**
 * @description Valida el formulario principal y el de otras instancias antes de continuar.
 * Verifica que existan datos en la tabla y que los formularios asociados sean válidos.
 * @method validarFormulario
 * @returns {boolean} Retorna `true` si todos los formularios son válidos, de lo contrario `false`.
 */
  validarFormularioMercancia(): boolean {
    if(this.formularioDatosMercancia.valid === false){
      this.formularioDatosMercancia.markAllAsTouched();
      this.cd.detectChanges();
      return false;
    }
    return true;
  }

  /**
   * Hook del ciclo de vida que se llama cuando la directiva se destruye.
   * Completa el subject `destruido$` para desuscribirse de todos los observables.
   */
  ngOnDestroy(): void {
    this.destruido$.next();
    this.destruido$.complete();
  }
}