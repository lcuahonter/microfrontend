import { CategoriaMensaje, ConsultaioQuery, ConsultaioState, Notificacion } from '@ng-mf/data-access-user';
import { CodigoRespuesta } from '../../../../core/enum/se-core-enum';

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'
import { ExportadorAutorizadoService } from '../../services/exportador-autorizado.service';

import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RADIO_OPCIONS_EXP_AUT } from '../constante110101.enum';

import { Subject, map, takeUntil } from 'rxjs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

/**
* Este componente se utiliza para mostrar la forma del exportado autorizado. - 110101
*/
@Component({
  selector: 'app-exportador-autorizado',
  standalone: true,
  imports: [CommonModule, TooltipModule, ReactiveFormsModule],
  templateUrl: './exportador-autorizado.component.html',
  styleUrl: './exportador-autorizado.component.scss'
})


export class ExportadorAutorizadoComponent implements OnInit {

  /**
   * Define el formulario reactivo que contiene los controles y valores relacionados 
   * con la información del exportador autorizado.
   * @property {FormGroup}
  */
  public formularioExpAut!: FormGroup;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  public esFormularioSoloLectura: boolean = false;

  /**
   * Opciones disponibles para el grupo de radio.
   */
  public radioOpcionsExpAut = RADIO_OPCIONS_EXP_AUT;

  /**
   * **Subject para manejar la destrucción del componente**
   * 
   * Este `Subject` se utiliza para cancelar suscripciones y evitar 
   * fugas de memoria cuando el componente es destruido.
   * Se usa comúnmente en el operador `takeUntil` dentro de los observables.
   */
  private destroy$ = new Subject<void>();

  /**
   * Notificación actual que se muestra en el componente.
   *
   * Esta propiedad almacena los datos de la notificación que se mostrará al usuario.
   * Se utiliza para configurar el tipo, categoría, mensaje y otros detalles de la notificación.
   */
  public nuevaNotificacion!: Notificacion ;

  /**
   * Almacena el resultado de la calificación del sistema para el exportador autorizado, 
   * indicando si fue aprobado, rechazado o aún no evaluado (null).
   */
  calificacionSistema: boolean | null = null;

  /**
   * Estado actual de la consulta.
   *
   * Almacena toda la información relacionada con la sección de consulta
   * que se obtiene desde el store `ConsultaioQuery`.
   */
  public consultaState!: ConsultaioState;

  /**
   * Tipo de exportador autorizado a evaluar.
   * Puede ser 'UE' para Unión Europea o 'JPN' para Japón.
   */
  @Input() tipo: 'UE' | 'JPN' = 'UE';

  /**
   * Inicializa el componente inyectando las dependencias necesarias
   * @param fb Constructor del componente exportador-autorizado
   */
  constructor(private fb: FormBuilder,
    private consultaioQuery: ConsultaioQuery,
    private exportadorAutorizadoService: ExportadorAutorizadoService
  ){
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => { 
          this.consultaState= seccionState;
        })
      )
      .subscribe();
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * @returns {void}
   */
  ngOnInit(): void { 
      this.inicializarFormulario();
      this.getExportadorAutorizado();
  }
  /**
   * Método que inicializa el formulario
   * @returns {void}
   */
  public inicializarFormulario(): void{
    this.formularioExpAut = this.fb.group({
      informacionRadios: [{ value: '', disabled: false }]
    })
  }

  /**
   * @method getExportadorAutorizado
   * @description 
   * Consulta los datos del exportador autorizado por medio del servicio, actualiza 
   * el formulario con la información obtenida, deshabilita el campo correspondiente 
   * y muestra una notificación en caso de error.
   * @param id_solicitud 
   */
  getExportadorAutorizado(): void {
    this.exportadorAutorizadoService.getExportadorAutorizado(this.consultaState.id_solicitud)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.codigo === CodigoRespuesta.EXITO && response?.datos) {

          const CLAVE = this.tipo === 'UE'
            ? response.datos.clave_condicion_exportador
            : response.datos.clave_condicion_exportador_jpn;

          const CALIFICACION = this.tipo === 'UE'
            ? response.datos.calificacion_exp_aut_sistema
            : response.datos.calificacion_exp_aut_sistema_jpn;

          this.formularioExpAut.patchValue({
            informacionRadios: CLAVE
          });

          this.calificacionSistema = CALIFICACION;

          this.formularioExpAut.get('informacionRadios')?.disable({ emitEvent: false });

        }else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: response?.error || 'Error exportador autorizado.',
            mensaje: response?.causa || response?.mensaje || 'Error exportador autorizado',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
        }
      },
      error: (err) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const MENSAJE = err?.error?.error || 'Error exportador autorizado.';
        this.nuevaNotificacion = {
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
}
