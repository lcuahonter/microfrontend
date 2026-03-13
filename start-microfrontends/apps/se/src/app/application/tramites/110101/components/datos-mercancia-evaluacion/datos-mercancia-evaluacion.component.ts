import { CategoriaMensaje, ConsultaioQuery, ConsultaioState, Notificacion, TituloComponent } from '@ng-mf/data-access-user';
import { Component, OnInit } from '@angular/core';
import { EvaluarMercanciaResponse } from '../../models/response/mercancia-response.model';
import { MercanciaSolicitudService } from '../../services/mercancia-solicitud.service';

import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { map, takeUntil } from 'rxjs';
import { Subject } from 'rxjs';

import { CodigoRespuesta } from '../../../../core/enum/se-core-enum';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-datos-mercancia-evaluacion',
  standalone: true,
  imports: [CommonModule, TituloComponent, ReactiveFormsModule],
  templateUrl: './datos-mercancia-evaluacion.component.html',
  styleUrl: './datos-mercancia-evaluacion.component.scss',
})
export class DatosMercanciaEvaluacionComponent implements OnInit {

  /**
   * Propiedad que mantiene el estado actual de la consulta dentro del componente.
   */
  public consultaState!: ConsultaioState;
  
  /**
   * **Subject para manejar la destrucción del componente**
   * 
   * Este `Subject` se utiliza para cancelar suscripciones y evitar 
   * fugas de memoria cuando el componente es destruido.
   * Se usa comúnmente en el operador `takeUntil` dentro de los observables.
   */
  private destroy$ = new Subject<void>();

  /**
   * Una instancia de FormGroup que representa el formulario para evaluar Mercancia (bienes).
   * Este formulario se utiliza para capturar y validar los datos relacionados con Mercancia.
   */
  public formEvaluarMercancia!: FormGroup;

  /**
   * Datos de la mercancía obtenidos del servicio de respuesta.
   */
  public mercanciaEvaluarData!: EvaluarMercanciaResponse;

  /**
   * Notificación actual que se muestra en el componente.
   *
   * Esta propiedad almacena los datos de la notificación que se mostrará al usuario.
   * Se utiliza para configurar el tipo, categoría, mensaje y otros detalles de la notificación.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  public esFormularioSoloLectura: boolean = false;

  /**
   * Inicializa el componente inyectando las dependencias necesarias
   * @param fb Constructor del componente datos mercancia evaluar
   */
  constructor(private fb: FormBuilder,
    private mercanciaSolcitudService: MercanciaSolicitudService,
    private consultaioQuery: ConsultaioQuery,
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
   * @method ngOnInit
   * @description
   * Método que se ejecuta al inicializar el componente.
   */
  ngOnInit(): void {

    this.inicializarFormularioEvaluar();
    this.mercanciaEvaluar();
  }

  /**
   * @method inicializarFormularioEvaluar
   * @description
   * Inicializa el formulario reactivo `formEvaluarMercancia`, el cual se utiliza para
   * capturar y evaluar la información relacionada con una mercancía.  
   * Cada control representa un campo específico de la ficha técnica o clasificación del producto.
   */
  public inicializarFormularioEvaluar(): void {
    this.formEvaluarMercancia = this.fb.group({
      nombreComercialEvaluar: [{value: '', disabled: true}],
      nombreInglesEvaluar: [{value: '', disabled: true}],
      fraccionArancelariaEvaluar: [{value: '', disabled: true}],
      nombreTecnicoEvaluar: [{value: '', disabled: true}],
      precioFrancoFabricaEvaluar: [{value: '', disabled: true}],
      valorTransaccionEvaluar: [{value: '', disabled: true}],
      costoNetoEvaluar: [{value: '', disabled: true}],
      costoNetoAPEvaluar: [{value: '', disabled: true}],
      descripcionJuegoEvaluar: [{value: '', disabled: true}],
      tipoExportadorEvaluar: [{value: '', disabled: true}],
      separacionContableEvaluar: [{value: null, disabled: true}],
      calificacion_fraccion_aladi: [{value: null, disabled: true}],
      tiene_fraccion_aladi: [{value: null, disabled: true}],
      valorTransaccionalFOBEvaluar: [{value: '', disabled: true}],
      clasificacionNALADIEvaluar: [{value: '', disabled: true}],
      descripcionNALADIEvaluar: [{value: '', disabled: true}],
      clasificacionNALADISA1993Evaluar: [{value: '', disabled: true}],
      descripcionNALADISA1993Evaluar: [{value: '', disabled: true}],
      clasificacionNALADISA1996Evaluar: [{value: '', disabled: true}],
      descripcionNALADISA1996Evaluar: [{value: '', disabled: true}],
      clasificacionNALADISA2002Evaluar: [{value: '', disabled: true}],
      descripcionNALADISA2002Evaluar: [{value: '', disabled: true}]
    });
  }

  /**
  * @method mercanciaEvaluar
  * @description Consulta la mercancía asociada a la solicitud actual y maneja la respuesta del servidor.
  * @returns {void}
  */
  mercanciaEvaluar(): void {
    this.mercanciaSolcitudService.getMercanciaEvaluar(this.consultaState.id_solicitud)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.codigo === CodigoRespuesta.EXITO) {
            this.formEvaluarMercancia.patchValue({
              nombreComercialEvaluar: response.datos?.nombre_comercial,
              nombreInglesEvaluar: response.datos?.nombre_en_ingles,
              fraccionArancelariaEvaluar: response.datos?.cve_fraccion,
              nombreTecnicoEvaluar: response.datos?.nombre_tecnico,
              precioFrancoFabricaEvaluar: response.datos?.precio_franco_fabrica,
              valorTransaccionEvaluar: response.datos?.valor_transaccion,
              costoNetoEvaluar: response.datos?.costo_neto,
              costoNetoAPEvaluar: response.datos?.costo_neto_ap,
              descripcionJuegoEvaluar: response.datos?.descripcion_juego,
              tipoExportadorEvaluar: response.datos?.tipo_exportador,
              separacionContableEvaluar: response.datos?.separacion_contable,
              valorTransaccionalFOBEvaluar: response.datos?.valor_transaccion,
              calificacion_fraccion_aladi: response.datos?.calificacion_fraccion_aladi,
              tiene_fraccion_aladi: response.datos?.tiene_fraccion_aladi,
              clasificacionNALADIEvaluar: response.datos?.cve_fraccion_naladi,
              descripcionNALADIEvaluar: response.datos?.descripcion_naladi,
              clasificacionNALADISA1993Evaluar: response.datos?.cve_fraccion_naladisa_93,
              descripcionNALADISA1993Evaluar: response.datos?.descripcion_naladisa_93,
              clasificacionNALADISA1996Evaluar: response.datos?.cve_fraccion_naladisa_96,
              descripcionNALADISA1996Evaluar: response.datos?.descripcion_naladisa_96,
              clasificacionNALADISA2002Evaluar: response.datos?.cve_fraccion_naladisa_02,
              descripcionNALADISA2002Evaluar: response.datos?.descripcion_naladisa_02
            });
            this.mercanciaEvaluarData = response.datos ?? {} as EvaluarMercanciaResponse;
        }else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: response?.error || 'Error en la consultar mercancia.',
            mensaje: response?.causa || response?.mensaje || 'Error en la consultar mercancia.',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
        }
      },
      error: (err) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const MENSAJE = err?.error?.error || 'Error en la consultar mercancia.';
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

  /**
   * @method hasAladiData
   * @description
   * Verifica si el formulario contiene datos relacionados con ALADI.
   * Con el objetivo de decidir si se debe mostrar o no la sección correspondiente en la interfaz.
   * @returns 
   */
  hasAladiData(): boolean {
    if (!this.formEvaluarMercancia) {
      return false;
    }
    const TIENE_FRACCION = this.formEvaluarMercancia.get('tiene_fraccion_aladi')?.value;

    if (TIENE_FRACCION === false) {
      return false;
    }
    const KEYS = [
      'valorTransaccionalFOBEvaluar',
      'calificacion_fraccion_aladi',
      'tiene_fraccion_aladi',
      'clasificacionNALADIEvaluar',
      'descripcionNALADIEvaluar',
      'clasificacionNALADISA1993Evaluar',
      'descripcionNALADISA1993Evaluar',
      'clasificacionNALADISA1996Evaluar',
      'descripcionNALADISA1996Evaluar',
      'clasificacionNALADISA2002Evaluar',
      'descripcionNALADISA2002Evaluar'
    ];

    return KEYS.some(key => {
      const CONTROL = this.formEvaluarMercancia.get(key);
      if (!CONTROL) {
        return false;
      }
      const V = CONTROL.value;
      if (key === 'tiene_fraccion_aladi' && V === false) {
        return false;
      }
      if (key === 'tiene_fraccion_aladi' && V === true) {
        return true;
      }
      if (typeof V === 'boolean') {
        return true;
      }
      return V !== null && V !== undefined && String(V).trim() !== '';
    });
  }
}