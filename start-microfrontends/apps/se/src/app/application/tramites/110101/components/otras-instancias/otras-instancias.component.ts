import { AlertComponent, CatalogoSelectComponent, CategoriaMensaje, ConsultaioQuery, ConsultaioState, InputCheckComponent, Notificacion, NotificacionesComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { CatalogosTramiteService } from '../../services/catalogo.service';
import { CommonModule } from '@angular/common';

import { AcumulacionFraccionTratadosRequest } from '../../models/request/validacion-acumulacion-request.model';
import { CodigoRespuesta } from '../../../../core/enum/se-core-enum';
import { CriteriosOtrasInstanciasRequest } from '../../models/request/criterios-otras-instancias-request.model';

import { Component, Input, OnDestroy, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, map, takeUntil, tap } from 'rxjs';

import { Solicitante110101State, Tramite110101Store } from '../../estados/tramites/solicitante110101.store';
import { Solicitante110101Query } from '../../estados/queries/solicitante110101.query';
import { TratadosSolicitudService } from '../../services/tratados-solicitud.service';

@Component({
  selector: 'app-otras-instancias',
  standalone: true,
  imports: [
    TituloComponent,
    AlertComponent,
    InputCheckComponent,
    CatalogoSelectComponent,
    NotificacionesComponent,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './otras-instancias.component.html',
  styleUrl: './otras-instancias.component.scss',
})
export class OtrasInstanciasComponent implements OnInit, OnDestroy {

  /** País para el cual se muestran las otras instancias */
  @Input() pais!: string; 

  /** Texto dinámico del título */
  @Input() titulo = 'Otras Instancias';

  /** Texto dinámico de la alerta */
  @Input() mensajeAlerta = '';

  /** Bandera para activar catalogo */
  @Input() catalogo!: boolean;

  /** Bandera para modificar texto de select*/
  @Input() modificacionTxt?: boolean;

  /**
   * Notificación actual que se muestra en el componente.
   *
   * Esta propiedad almacena los datos de la notificación que se mostrará al usuario.
   * Se utiliza para configurar el tipo, categoría, mensaje y otros detalles de la notificación.
  */
  public nuevaNotificacion!: Notificacion;

  /**
   * Formulario reactivo para gestionar los tratados.
   * 
   * @property {FormGroup} formularioInstancias - El formulario reactivo que contiene los campos para otras instancias.
  */
  formularioInstancias!: FormGroup;

  /**
   * **Subject utilizado para manejar la destrucción de suscripciones**
   * 
   * Este `Subject` se emite en `ngOnDestroy` para notificar y completar todas las
   * suscripciones activas, evitando posibles fugas de memoria en el componente.
  */
  private destroy$ = new Subject<void>();

  /**
   * Catálogo de criterios otras instancias disponibles para selección en el componente.
  */
  public criteriosInstanciasCatalogo: Catalogo[] = [];

  /**
   * **Estado actual de la consulta de store**  
   */
  public consultaState!: ConsultaioState;

   /**
   * **Indica si se ha seleccionado un criterio de instancias**  
   */
  public criterioInstanciasSeleccionado: boolean = false;

  /**
   * Representa el estado actual del solicitante (Solicitante) para el trámite 110101.
   * Esta propiedad contiene toda la información relevante sobre los datos y el estado
   * del solicitante dentro del contexto del trámite.
 */
  public solicitudeState!: Solicitante110101State;

  /** Variable para validar el formulario */
  validarFormulario: boolean = false;

  /**
    * Inicializa el TratadosComponent.
    * @param fb - Servicio FormBuilder utilizado para crear y gestionar formularios reactivos.
    * @param tramite110101Store - Servicio store para gestionar el estado del Trámite 110101.
    * @param consultaioQuery - Servicio query para acceder al estado de consultaio.
    * 
    * Se suscribe al observable `selectConsultaioState$` para actualizar la propiedad `esFormularioSoloLectura`
    * e inicializar el formulario de tratados cada vez que cambia el estado de consultaio. La suscripción se
   * cancela automáticamente cuando el componente es destruido.
  */
  constructor(private fb: FormBuilder,
    private tramite110101Store: Tramite110101Store,
    private consultaioQuery: ConsultaioQuery,
    private catalogosTramiteService: CatalogosTramiteService,
    private solicitanteQuery: Solicitante110101Query,
    private tratadosSolicitudService: TratadosSolicitudService
  ) {
    this.consultaioQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroy$),
      tap(seccionState => {
        this.consultaState = seccionState;
      })
    )
    .subscribe();
    this.formularioInstancias = this.fb.group({
      criterioInstancias:[null],
      acumulacion: [false],
      bienes: [false],
      intermedio: [false],
    });
  }

  ngOnInit(): void {
    this.solicitanteQuery.selectSolicitante$.pipe(
      takeUntil(this.destroy$),
      map((seccionState) => {
        this.solicitudeState = seccionState;
    }),
    ).subscribe();
     
    if(this.catalogo){
      this.suscribirCambiosFormulario();
    }else{
      this.actualizarValidadoresCatalogo();
    }
   
    this.restaurarValoresFormulario();
   

    this.formularioInstancias.statusChanges
      .pipe(
        takeUntil(this.destroy$),
        tap((_value) => {
          this.validarFormulario = this.formularioInstancias.valid;
           const FRACCION = this.solicitudeState?.fraccionArancelaria;
            if (typeof FRACCION === 'string' && FRACCION.trim().length > 0) {
              this.validacionFraccion();
            }
        })
      )
      .subscribe();   
  }

/**
 * Restaura los valores guardados del store al formulario reactivo.
 */
private restaurarValoresFormulario(): void {
  if (this.solicitudeState.respuestaServicioDatosTabla.length === 0){
     return;
  }
  // Mapeo según país, igual que en setValoresStore
  const MAPA_PAISES: Record<string, string> = {
    'INSTANCIASURUGUAY': 'uruguay',
    'INSTANCIASPERU': 'peru',
    'INSTANCIASPACIFICO': 'ap',
    'OTRASINSTANCIAS': 'instancias',
  };

  const PAIS_NORMALIZADO =
    MAPA_PAISES[this.pais?.toUpperCase() ?? ''] ?? this.pais?.toLowerCase();

  // Intentar leer los valores según país
  const ACUMULACION =this.solicitudeState[`acumulacion_${PAIS_NORMALIZADO}` as keyof Solicitante110101State];

  const BIENES =this.solicitudeState[`materiales_fungibles_${PAIS_NORMALIZADO}` as keyof Solicitante110101State];

  const INTERMEDIO = this.solicitudeState[`materiales_intermedios_${PAIS_NORMALIZADO}` as keyof Solicitante110101State];

  const CRITERIO = this.solicitudeState[`criterio_origen_${PAIS_NORMALIZADO}` as keyof Solicitante110101State];

  // Asignar al formulario (sin emitir valueChanges)
  this.formularioInstancias.patchValue(
    {
      acumulacion: ACUMULACION ?? false,
      bienes: BIENES ?? false,
      intermedio: INTERMEDIO ?? false,
      criterioInstancias: CRITERIO ?? null,
    },
    { emitEvent: false }
  );
  // Si hay valores, actualizar el catálogo
  if (ACUMULACION || BIENES || INTERMEDIO) {
    const INSTANCIAS: string[] = [];
    if (ACUMULACION){
      INSTANCIAS.push('ACU');
    } 
    if (BIENES){
      INSTANCIAS.push('BMF');
    } 
    if (INTERMEDIO){
      INSTANCIAS.push('MAI');
    } 
    this.criteriosOtrasInstancias(INSTANCIAS);
  }
}


  /**
 * @method suscribirCambiosFormulario
 * @description Observa los cambios en los checkboxes y ejecuta la petición dinámica.
 */
private suscribirCambiosFormulario(): void {
  this.formularioInstancias.valueChanges
    .pipe(
      debounceTime(100),
      map(value => ({
        acumulacion: value.acumulacion,
        bienes: value.bienes,
        intermedio: value.intermedio
      })),
      distinctUntilChanged((a, b) => 
        a.acumulacion === b.acumulacion && 
        a.bienes === b.bienes && 
        a.intermedio === b.intermedio
      ),
      takeUntil(this.destroy$)
    )
    .subscribe(({acumulacion, bienes, intermedio}) => {
      const INSTANCIAS: string[] = [];

      if (acumulacion){
        INSTANCIAS.push('ACU');
      } 
      if (bienes){
        INSTANCIAS.push('BMF');
      } 
      if (intermedio){
        INSTANCIAS.push('MAI');
      }
      
      if (INSTANCIAS.length > 0) {
        this.criteriosOtrasInstancias(INSTANCIAS);
      } else {
        this.criteriosInstanciasCatalogo = []; 
      }
    });
}

  /** 
 * @method criteriosOtrasInstancias
 * @description Realiza una petición para obtener criterios de otras instancias.
 * @param otrasInstancias - lista de instancias seleccionadas (e.g., ['ACU', 'BMF'])
 */
  public criteriosOtrasInstancias(otrasInstancias: string[]): void {
    const MAPA_PAISES: Record<string, string> = {
      'INSTANCIASURUGUAY': 'URY',
      'INSTANCIASPERU': 'PER',
    };
    const PAIS_FINAL = MAPA_PAISES[this.pais] || this.pais; 
    const PAYLOAD: CriteriosOtrasInstanciasRequest = {
      paises: [PAIS_FINAL],
      otras_instancias: otrasInstancias
    };
    this.catalogosTramiteService.postCatCriteriosOtrasInstancias(PAYLOAD)
      .subscribe({
        next: (resp) => {
          if (resp.codigo !== CodigoRespuesta.EXITO) {
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: '',
              mensaje: resp.error || 'Error criterio instancias.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
          }
          this.criteriosInstanciasCatalogo = (resp.datos || []).map((item, index) => ({
            id: index + 1,
            descripcion: item,
          }));
          
          const VALOR_GUARDADO = this.formularioInstancias.get('criterioInstancias')?.value;
          if (VALOR_GUARDADO) {
          
            const OPCION = this.criteriosInstanciasCatalogo.find(
              (c) => c.descripcion === VALOR_GUARDADO || c.id === VALOR_GUARDADO
            );
            if (OPCION) {
              // Reasignar el valor sin disparar valueChanges
              this.formularioInstancias
                .get('criterioInstancias')
                ?.patchValue(OPCION.id, { emitEvent: false });
            }
          }
        },
        error: (error) => {
          const MENSAJE = error?.error?.error || 'Error de criterio instancias';
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
   * Establece el valor de un campo en el store de Tramite31601.
   * @param form - El grupo de formularios que contiene el campo.
   * @param campo - El nombre del campo cuyo valor se va a establecer.
   * @param metodoNombre - El nombre del método en el store que se utilizará para establecer el valor.
   * @param valorExterno - Valor externo opcional, usualmente un catálogo.
  */
  public setValoresStore(form: FormGroup, campo: string, valorExterno?:Catalogo): void {
    const VALOR = valorExterno?.descripcion ?? form.get(campo)?.value;
  if (VALOR === undefined || VALOR === null){
    return;
  } 

  // Mapear el campo base con su equivalente en el store
  const MAPEO_CAMPOS: Record<string, string> = {
    acumulacion: 'acumulacion',
    bienes: 'materiales_fungibles',
    intermedio: 'materiales_intermedios',
    criterioInstancias: 'criterio_origen'
  };

  const BASE = MAPEO_CAMPOS[campo];
  if (!BASE){
    return;
  } 

   // Normalizar el país
  const MAPA_PAISES: Record<string, string> = {
    'INSTANCIASURUGUAY': 'uruguay',
    'INSTANCIASPERU': 'peru',
    'INSTANCIASPACIFICO': 'ap',
    'OTRASINSTANCIAS': 'instancias',
  };

  // Tomar el país normalizado si existe en el mapa
  const PAIS_NORMALIZADO = MAPA_PAISES[this.pais?.toUpperCase() ?? ''] ?? this.pais?.toLowerCase();
  
 // Construir el campo final del store
  const CAMPO_FINAL =
    PAIS_NORMALIZADO === 'peru' || PAIS_NORMALIZADO === 'uruguay' || PAIS_NORMALIZADO === 'ap' || PAIS_NORMALIZADO === 'instancias'
      ? `${BASE}_${PAIS_NORMALIZADO}`
      : BASE;

  // Guardar en el store de forma genérica
  this.tramite110101Store.setValor(
    CAMPO_FINAL as keyof Solicitante110101State,
    VALOR
  );
  }

  /** 
 * Agrega o quita el validador "required" de criterioInstancias 
 * dependiendo del valor del input `catalogo`.
 */
private actualizarValidadoresCatalogo(): void {
  const CTRL = this.formularioInstancias.get('criterioInstancias');
  if (!CTRL){
   return;
  } 

  if (this.catalogo) {
    CTRL.setValidators([Validators.required]);
  } else {
    CTRL.clearValidators();
    CTRL.setValue(null, { emitEvent: false });
  }
  CTRL.updateValueAndValidity({ emitEvent: false });
}

/**
 * Ejecuta la validación de acumulación de fracción llamando al servicio
 * `postValidarAcumalacion` **solo si se cumplen las condiciones definidas en
 * `debeEjecutarValidacion()`**.
 *
 * - Construye el payload requerido por el backend.
 * - Maneja correctamente el flujo `next` y `error` del observable.
 * - Si la respuesta no es exitosa, genera una notificación de error.
 */
  public validacionFraccion(): void {
    if (!this.validacionFraccionCampos()) { return; }
    const PAYLOAD: AcumulacionFraccionTratadosRequest = {
      clave_fraccion_arancelaria: this.solicitudeState?.fraccionArancelaria,
      tratados_seleccionados: this.solicitudeState.respuestaServicioDatosTabla.map(item => ({
        cve_grupo_criterio: item.cve_grupo_criterio,
        cve_tratado_acuerdo: item.cve_tratado_acuerdo,
        id_tratado_acuerdo: item.id_tratado_acuerdo
      })),
    };
    this.tratadosSolicitudService.postValidarAcumalacion(PAYLOAD)
      .subscribe({
        next: (resp) => {
          if (resp.codigo === CodigoRespuesta.EXITO) {
              this.tramite110101Store.setValor(
                'cumple_acumulacion',
                resp.datos?.cumple_acumulacion ?? null
              );
          } else {
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: '',
              mensaje: resp.error || 'Error validacion Acumulacion fraccion.',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
          }
        },
        error: (error) => {
          const MENSAJE = error?.error?.error || 'Error validacion Acumulacion fraccion.';
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
 * Determina si debe ejecutarse la validación de acumulación.
 *
 * La validación solo procede cuando:
 * - El título corresponde exactamente a "Otras Instancias para el Acuerdo alianza del pacifico".
 * - El checkbox `acumulacion` está marcado (true).
 * - El checkbox `bienes` está marcado (true).
 *
 * @returns `true` si se cumplen todas las condiciones necesarias, de lo contrario `false`.
 */
private validacionFraccionCampos(): boolean {
  const TITULO_VALIDO = this.titulo ==="Otras Instancias para el Acuerdo alianza del pacifico";

  const ACUMULACION = this.formularioInstancias.get('acumulacion')?.value === true;
  const BIENES = this.formularioInstancias.get('bienes')?.value === true;

  return TITULO_VALIDO && ACUMULACION && BIENES;
}


  /**
   * **Ciclo de vida: OnDestroy**
   * 
   * Este método se ejecuta cuando el componente se destruye. 
   * Se utiliza para limpiar las suscripciones y evitar fugas de memoria.
   * 
   * - Envía un valor a `destroy$` para notificar a los observables que deben completarse.
   * - Completa `destroy$` para liberar los recursos asociados.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
