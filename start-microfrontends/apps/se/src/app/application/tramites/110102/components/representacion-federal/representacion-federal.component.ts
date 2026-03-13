/**
 * @description
 * Este componente maneja la representación federal, incluyendo la interacción con el estado global y la validación de formularios.
 */

import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil, tap } from 'rxjs';

import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';

import { CategoriaMensaje, ConsultaioQuery, Notificacion, PROTESTA, TituloComponent } from '@ng-mf/data-access-user';
import { Catalogo } from '@ng-mf/data-access-user';
import { CatalogosTramiteService } from '../../service/catalogo.service';
import { CodigoRespuesta } from '../../../../core/enum/se-core-enum';
import { REQUERIDO } from '@libs/shared/data-access-user/src/tramites/constantes/mensajes-error-formularios';
import { Tramite110102Query } from '../../estados/queries/tramite110102.query';

import { Tramite110102State, Tramite110102Store } from '../../estados/store/tramite110102.store';

/**
 * @description
 * Componente que gestiona la representación federal, incluyendo la selección de entidades federativas y unidades administrativas.
 */
@Component({
  selector: 'app-representacion-federal',
  standalone: true,
  imports: [CommonModule, TituloComponent, CatalogoSelectComponent, ReactiveFormsModule],
  templateUrl: './representacion-federal.component.html',
  styleUrls: ['./representacion-federal.component.scss'],
})
export class RepresentacionFederalComponent implements OnInit, OnDestroy {
  /**
   * @description
   * Indica si el formulario está en modo de solo lectura.
   */
  esSoloLectura!: boolean;

  /**
   * @description
   * Formulario reactivo para gestionar los datos de la representación federal.
   */
  formularioRepresentacionFederal!: FormGroup;

  /**
    * Estado actual del trámite.
  */
  estadoTramite!: Tramite110102State;

  /**
   * @description
   * Subject que emite un evento cuando el componente es destruido, permitiendo la desuscripción de observables.
   */
  private destruido$ = new Subject<void>();

  /**
   * Representa la entidad seleccionada del catálogo.
   * Se espera que esta propiedad sea del tipo 'CatalogosSelect'.
   *
   * @property {CatalogosSelect} entidad - La entidad seleccionada.
   */
  public entidad!: Catalogo[];

  /**
   * Representa la representación seleccionada del catálogo.
   * Se espera que esta propiedad sea del tipo 'CatalogosSelect'.
   *
   * @property {CatalogosSelect} representacion - La representación seleccionada.
  */ 
  public representacion!: Catalogo[];

  /**
   * Notificación actual que se muestra en el componente.
   *
   * Esta propiedad almacena los datos de la notificación que se mostrará al usuario.
   * Se utiliza para configurar el tipo, categoría, mensaje y otros detalles de la notificación.
  */
  public nuevaNotificacion!: Notificacion;

 /**  
  * Una constante que contiene textos adicionales para el componente.
  * Se utiliza para almacenar datos adicionales relacionados con el componente.
  */
  public textos?: string;

  /**
   * Una constante que contiene la cadena de mensaje requerida.
   * Este mensaje se utiliza para indicar que un campo es obligatorio.
   */
  public MENSAJE_REQUERIDO = REQUERIDO;

  /** Variable para validar el formulario */
  validarFormularioRepresentacion: boolean = false;

  /**
   * @description
   * Constructor del componente.
   * @param {FormBuilder} formBuilder - Servicio para la creación de formularios reactivos.
   * @param {RepresentacionfederalService} servicioRepresentacionFederal - Servicio para obtener datos de la representación federal.
   * @param {Tramite110102Store} estadoTramite - Servicio para manejar el estado del trámite.
   * @param {Tramite110102Query} consultaTramite - Servicio para consultar el estado del trámite.
   */
  constructor(
    private formBuilder: FormBuilder,
    private consultaQuery: ConsultaioQuery,
    private consultaTramite: Tramite110102Query,
    private catalogoTramiteService: CatalogosTramiteService,
    private estadoGuardadoAkite: Tramite110102Store,
    private cd: ChangeDetectorRef
  ) {
    this.consultaQuery.selectConsultaioState$
      .pipe(takeUntil(this.destruido$))
      .subscribe((estadoSeccion) => {
        this.esSoloLectura = estadoSeccion.readonly;
      });

      this.consultaTramite.selectTramite110102$
      .pipe(takeUntil(this.destruido$))
      .subscribe((estado) => {
        this.estadoTramite = estado;
      });
  }

  /**
   * @description
   * Hook del ciclo de vida que se llama después de que las propiedades enlazadas a datos de una directiva se inicializan.
   * Inicializa el formulario y configura las suscripciones necesarias.
   */
  ngOnInit(): void {
    this.inicializarFormulario();
    this.getEntidadFederativa();
    this.getDeclaracionDatos();
    this.formularioRepresentacionFederal.statusChanges
      .pipe(
        takeUntil(this.destruido$),
        tap((_value) => {
          this.validarFormularioRepresentacion = this.formularioRepresentacionFederal.valid;
        })
      )
      .subscribe(); 
  }

  /**
   * @method getEntidadFederativa
   * @description Obtiene el catálogo de la entidad federativa
   *
   * Recupera y establece la información de la entidad federativa.
   * El objeto de entidad incluye el nombre de la etiqueta, el estado requerido, la opción predeterminada,
   * y un catálogo de opciones disponibles.
   *
   * @returns {void}
  */
  public getEntidadFederativa(): void {
    this.catalogoTramiteService.getCatEntidadesFederativas()
      .pipe(takeUntil(this.destruido$))
      .subscribe({
        next: (response) => {
          if (response.codigo === CodigoRespuesta.EXITO) {
            // El backend manda "datos"
            const DATOS = response.datos || [];

            // Transformación a tu respuesta a response Catalogo
            this.entidad = DATOS.map((item, index) => ({
              id: index + 1,
              descripcion: item.descripcion,
              clave: item.clave,
            }));

            const VALOR_GUARDADO = this.formularioRepresentacionFederal.get('claveEntidadFederativa')?.value;
            if (VALOR_GUARDADO) {
              const OPCION = this.entidad.find(
                (c) => c.clave === VALOR_GUARDADO || c.id === VALOR_GUARDADO);

              this.formularioRepresentacionFederal.patchValue({
                claveEntidadFederativa: OPCION?.id,
              }, { emitEvent: false }); // IMPORTANTE: evitar bucles
              this.getRepresentacionFederal(OPCION?.clave || '');


            }
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: response.error || 'Error catálogo de entidad federativa.',
              mensaje: response.causa || response.mensaje || 'Error catálogo de entidad federativa',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            };
          }
        },
        error: (err) => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: 'Error al obtener catálogo de entidad federativa.',
            mensaje: err?.mensaje || 'Error al obtener catálogo de entidad federativa.',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
        }
      });
  }

  /**
   * @method getRepresentacionFederal
   * @description Obtiene el catálogo de la representación federal.
   * @param cveEntidad - Clave de la entidad federativa para filtrar la representación federal.
   * 
   * Recupera y establece la información de la entidad federativa.
   * El objeto de entidad incluye el nombre de la etiqueta, el estado requerido, la opción predeterminada,
   * y un catálogo de opciones disponibles.
   *
   * @returns {void}
   */
  public getRepresentacionFederal(cveEntidad: string): void {
     this.estadoGuardadoAkite.establecerDatos({ ["claveEntidadFederativa"]: cveEntidad });
    this.catalogoTramiteService.getCatRepresentacionFederal(cveEntidad)
      .pipe(takeUntil(this.destruido$))
      .subscribe({
        next: (response) => {
          if (response.codigo === CodigoRespuesta.EXITO) {
            // El backend manda "datos"
            const DATOS = response.datos || [];

            // Transformación a tu respuesta a response Catalogo
            this.representacion = DATOS.map((item, index) => ({
              id: index + 1,
              descripcion: item.descripcion,
              clave: item.clave,
            }));
            const VALOR_GUARDADO_REPRESENTACION = this.formularioRepresentacionFederal.get('claveUnidadAdministrativa')?.value;
            const OPCION_REPRESENTACION = this.representacion.find(
              (c) => c.clave === VALOR_GUARDADO_REPRESENTACION || c.id === VALOR_GUARDADO_REPRESENTACION
            );
            this.formularioRepresentacionFederal.patchValue({
              claveUnidadAdministrativa: OPCION_REPRESENTACION?.id
            }, { emitEvent: false }); // IMPORTANTE: evitar bucles
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: response.error || 'Error catálogo de representación federal.',
              mensaje: response.causa || response.mensaje || 'Error catálogo de representación federal',
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            }
          }
        },
        error: (err) => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: 'Error al obtener catálogo de representación federal.',
            mensaje: err?.mensaje || 'Error al obtener catálogo de representación federal.',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
        }
      });
  }

  /**
   * @method onRepresentacionFederal
   * @description Maneja el evento de selección de una representación federal.
   * @param {Catalogo} selectedOption - La opción seleccionada de representación federal.
   * @returns {void} No retorna ningún valor.
   */
  onRepresentacionFederal(selectedOption: Catalogo): void {
    this.getRepresentacionFederal(selectedOption.clave || '');
  }


  /**
   * @description
   * Inicializa el formulario con los valores predeterminados y obtiene datos del estado global.
   */
  inicializarFormulario(): void {
    this.formularioRepresentacionFederal = this.formBuilder.group({
      claveEntidadFederativa: [this.estadoTramite.claveEntidadFederativa, Validators.required],
      claveUnidadAdministrativa: [this.estadoTramite.claveUnidadAdministrativa, Validators.required],
      protestoDecirVerdad: [this.estadoTramite.protestoDecirVerdad,Validators.requiredTrue],
    });
  }


  /**
   * @description
   * Establece los valores en el estado global a partir del formulario.
   * @param {FormGroup} formulario - El formulario del cual se obtienen los valores.
   * @param {string} campo - El nombre del campo del formulario cuyo valor se va a guardar.
   */
  establecerValoresEnEstado(formulario: FormGroup, campo: string): void {
    const VALOR = formulario.get(campo)?.value;
    this.estadoGuardadoAkite.establecerDatos({ [campo]: VALOR });
  }

    /**
   * Maneja el cambio de selección de representación federal y 
   * actualiza el estado del store con la clave seleccionada.
   *
   * @method onRepresentacionChange
   * @param {Catalogo} event - Objeto del catálogo que representa la opción seleccionada.
   * @returns {void} No retorna ningún valor.
   */
  onRepresentacionChange(event: Catalogo): void {
     this.estadoGuardadoAkite.establecerDatos({ ["claveUnidadAdministrativa"]: event.clave });
  }

   /**
     * @method getDeclaracionDatos
     * @description Obtiene el catálogo de la declaración de datos.
     * Recupera y establece la información de la declaración de datos.
     * El objeto de declaración de datos incluye el nombre de la etiqueta y la descripción.
     *
     * @returns {void}
     */
    public getDeclaracionDatos(): void {
      this.catalogoTramiteService.getCatDeclaracionDatos("110102")
        .pipe(takeUntil(this.destruido$))
        .subscribe((response) => {
          if (response.codigo === CodigoRespuesta.EXITO) {          
           this.textos = response.datos?.[0]?.descripcion ?? undefined;
           this.estadoGuardadoAkite.clearDeclaraciones();
           this.estadoGuardadoAkite.addDeclaraciones(response.datos ?? []); 
          }else {
          this.textos = PROTESTA.ADJUNTAR;}
        });
    }

/**
 * @description Valida el formulario principal y el de otras instancias antes de continuar.
 * @method validarFormulario
 * @returns {boolean} Retorna `true` si todos los formularios son válidos, de lo contrario `false`.
 */
 validarFormulario(): boolean {
    if (this.formularioRepresentacionFederal.valid === false) {
     this.formularioRepresentacionFederal.markAllAsTouched();
     this.cd.detectChanges();
      return false;
    }
    return true
  }

  /**
   * @description
   * Hook del ciclo de vida que se llama cuando la directiva se destruye.
   * Completa el subject `destruido$` para desuscribirse de todos los observables.
   */
  ngOnDestroy(): void {
    this.destruido$.next();
    this.destruido$.complete();
  }
}