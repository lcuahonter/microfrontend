import { CategoriaMensaje, ConsultaioQuery, ConsultaioState, Notificacion, TituloComponent } from '@ng-mf/data-access-user';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvaluarMercanciaResponse } from '../../models/response/mercancia-response.model';
import { MercanciaSolicitudService } from '../../service/mercancia-solicitud.service';

import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { map, takeUntil } from 'rxjs';
import { CodigoRespuesta } from '../../../../core/enum/se-core-enum';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-mercancia-evaluacion',
  standalone: true,
  imports: [CommonModule, TituloComponent, ReactiveFormsModule],
  templateUrl: './mercancia-evaluacion.component.html',
  styleUrl: './mercancia-evaluacion.component.scss',
})
export class MercanciaEvaluacionComponent implements OnInit {

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
   * Notificación actual que se muestra en el componente.
   *
   * Esta propiedad almacena los datos de la notificación que se mostrará al usuario.
   * Se utiliza para configurar el tipo, categoría, mensaje y otros detalles de la notificación.
   */
  public nuevaNotificacion!: Notificacion;
  
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
   * Inicializa el componente inyectando las dependencias necesarias
   * @param fb Constructor del componente datos mercancia evaluar
   */
  constructor(private fb: FormBuilder,
    private mercanciaSolicitudService: MercanciaSolicitudService,
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
      tipoExportadorEvaluar: [{value: '', disabled: true}],
    });
  }

  /**
  * @method mercanciaEvaluar
  * @description Consulta la mercancía asociada a la solicitud actual y maneja la respuesta del servidor.
  * @returns {void}
  */
  mercanciaEvaluar(): void {
    this.mercanciaSolicitudService.getMercanciaEvaluar(this.consultaState.id_solicitud)
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
              tipoExportadorEvaluar: response.datos?.tipo_exportador
            });
            this.mercanciaEvaluarData = response.datos ?? {} as EvaluarMercanciaResponse;
        }else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: response?.error || 'Error al consultar mercancia.',
            mensaje: response?.causa || response?.mensaje || 'Error al consultar mercancia.',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
        }
      },
      error: (err) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const MENSAJE = err?.error?.error || 'Error al consultar mercancia.';
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
