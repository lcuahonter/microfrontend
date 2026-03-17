/**
 * Componente que representa la sección de datos de la solicitud.
 * Este componente es standalone y utiliza ReactiveFormsModule y CommonModule.
 */
import { CommonModule } from '@angular/common';

import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ConsultaioQuery, ConsultaioState, RegistroSolicitudService } from '@ng-mf/data-access-user';

import { ValidacionesFormularioService } from '@libs/shared/data-access-user/src';

import { PropietarioComponent } from '../../../../shared/components/propietario/propietario.component';
import { Solicitud2614State } from '../../../../estados/tramites/tramite2614.store';
import { Tramite2614Query } from '../../../../estados/queries/tramite2614.query';
import { Tramite2614Store } from '../../../../estados/tramites/tramite2614.store';

import { Tramite261401Store} from '../../../../tramites/261401/estados/tramite261401.store';

import { Tramite261401Query } from '../../../../tramites/261401/estados/tramite261401.query';

import { SolicitudModificacionPermisoInternacionService } from '../../../../shared/services/shared2614/solicitud-modificacion-permiso-internacion.service';

import { Catalogo, CatalogoServices } from '@libs/shared/data-access-user/src';
import { Subject, map, takeUntil } from 'rxjs';

/**
 * Componente que representa la sección de datos de la solicitud.
 * Este componente es standalone y utiliza ReactiveFormsModule y CommonModule.
 * Gestiona el formulario reactivo para los datos de la solicitud y actualiza el estado del store.
 */
@Component({
  selector: 'app-datos-de-la-solicitud',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PropietarioComponent],
  providers: [CatalogoServices, Tramite261401Store, Tramite261401Query],
  templateUrl: './datos-de-la-solicitud.component.html',
  styleUrl: './datos-de-la-solicitud.component.scss',
})
/**
 * Clase que representa el componente Angular para la sección de datos de la solicitud.
 * Implementa las interfaces OnInit, OnChanges, AfterViewInit y OnDestroy para gestionar el ciclo de vida del componente.
 */
export class DatosDeLaSolicitudComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * Formulario reactivo para gestionar los datos de la solicitud.
   */
  formulario!: FormGroup;

  /**
   * Catálogo de estados para el domicilio del establecimiento.
   */
  estadoDomicillio: Catalogo[] = [];

  /**
   * Subject utilizado para manejar la destrucción de suscripciones.
   */
  private destroy$ = new Subject<void>();

  /**
   * Estado actual de la solicitud.
   */
  private seccionState!: Solicitud2614State;

    /**
     * Estado actual de la consulta gestionado por el store `ConsultaioQuery`.
     * Este input permite pasar el estado de consulta desde el componente contenedor.
     * Se utiliza para controlar el modo de solo lectura y otros comportamientos dependientes del estado de la consulta.
     * @type {ConsultaioState}
     * @Input
     */
    @Input() consultaState!: ConsultaioState;
  /**
   * Indica si el formulario debe mostrarse solo en modo lectura.
   * Cuando es verdadero, los campos del formulario no pueden ser editados por el usuario.
   */
  @Input() esFormularioSoloLectura: boolean = false;

  /**
   * Identificador de la sección de permisos específica para este procedimiento.
   */
  @Input() permisoSeccion!: number;

  /**
   * Identificador del procedimiento actual.
   * Este valor se utiliza para mostrar o configurar secciones específicas del formulario según el trámite.
   */
  @Input() public idProcedimiento!: number;

  /**
 * @property
 * @name permisoDefinitivoTitulo
 * @type @type {string}
 * @description Identificador único del procedimiento actual. Este valor se utiliza para asociar el componente con un trámite específico en el sistema.
 */
  @Input() permisoDefinitivoTitulo!: number;

  /**
   * Constructor del componente.
   * Param fb FormBuilder para la creación de formularios reactivos.
   * Param tramite2614Store Store para gestionar el estado del trámite.
   * Param tramite2614Query Query para obtener datos del estado del trámite.
   * Param service Servicio para manejar solicitudes relacionadas con permisos de salida del territorio.
   */
  constructor(
    private fb: FormBuilder,
    private tramite2614Store: Tramite2614Store,
    private tramite2614Query: Tramite2614Query,
    private service: SolicitudModificacionPermisoInternacionService,
    private consultaioQuery: ConsultaioQuery,
    private validacionesService: ValidacionesFormularioService,
    private catalogoService: CatalogoServices,
    private registroSolicitudService: RegistroSolicitudService,
    private tramite261401Store: Tramite261401Store
  ) {
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
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Suscribe al estado de la solicitud y crea el formulario.
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
    
    // Si idProcedimiento está disponible en init, llama a la API del catálogo
    if (this.idProcedimiento && !isNaN(this.idProcedimiento)) {
      this.obtenerEstadosCatalogo();
    } else {
      // Verifica nuevamente después de un breve retraso en caso de problemas de sincronización
      setTimeout(() => {
        if (this.idProcedimiento && !isNaN(this.idProcedimiento)) {
          this.obtenerEstadosCatalogo();
        } 
      }, 100);
    }

    // Suscríbete para cambios de formulario para persistencia
    setTimeout(() => {
      const OBSERVACIONES_CONTROL = this.formulario?.get('observaciones');
      if (OBSERVACIONES_CONTROL) {
        OBSERVACIONES_CONTROL.valueChanges
          .pipe(takeUntil(this.destroy$))
          .subscribe((valor) => {
            if (!this.esFormularioSoloLectura) {
              this.tramite2614Store.actualizarEstado({ observaciones: valor || '' });
            }
          });
      }
    }, 100);
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta cuando cambian las propiedades de entrada.
   * Se encarga de obtener el catálogo de estados cuando se recibe el idProcedimiento del componente padre.
   */
  ngOnChanges(changes: SimpleChanges): void {
    
    if (changes['idProcedimiento']) {
      const CAMBIAR = changes['idProcedimiento'];
      if (CAMBIAR.currentValue && !isNaN(CAMBIAR.currentValue)) {
        this.obtenerEstadosCatalogo();
      }
    }
  }


  /**
   * Obtiene el catálogo de estados y lo asigna a la propiedad estadoDomicillio
   */
  obtenerEstadosCatalogo(): void {
    const TRAMITE = (this.idProcedimiento !== undefined && this.idProcedimiento !== null) ? String(this.idProcedimiento) : '';
    if (!TRAMITE || TRAMITE === 'undefined' || TRAMITE === 'null' || isNaN(Number(TRAMITE))) {
      return; // Exit early if no valid procedure ID is available
    }
    this.catalogoService.estadosCatalogo(TRAMITE)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        if (response && Array.isArray(response.datos)) {
          this.estadoDomicillio = response.datos;
        }
      });
  }
  /**
   * Suscribe al observable `selectSolicitud$` del query `tramiteQuery` para obtener el estado actual de la solicitud y actualizar la propiedad `seccionState` con los datos recibidos. La suscripción se mantiene activa hasta que se emite un valor en `destroyed$`, evitando fugas de memoria.
   */
  obtenerEstadoSolicitud(): void {
     this.tramite2614Query.selectSolicitud$?.pipe(takeUntil(this.destroy$))
      .subscribe((data: Solicitud2614State) => {
        this.seccionState = data;
      });
  }
  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Completa el Subject para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Establece valores en el store a partir de un campo del formulario.
   * Param form Formulario reactivo.
   * Param campo Nombre del campo del formulario.
   */
  setValoresStore(form: FormGroup, campo: string): void {
    const VALOR = form.get(campo)?.value;
    this.tramite2614Store.actualizarEstado({ [campo]: VALOR });
    if (this.tramite261401Store && typeof this.tramite261401Store.establecerDatos === 'function') {
      this.tramite261401Store.establecerDatos({ [campo]: VALOR });
    }
  }

  /**
   * Crea el formulario reactivo con los campos necesarios.
   */
  crearFormulario(): void {
    this.obtenerEstadoSolicitud();
    this.tramite2614Query.selectSolicitud$
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        const INITIAL_OBSERVACIONES = (state && typeof state.observaciones === 'string') ? state.observaciones : '';
        if (!this.formulario) {
          this.formulario = this.fb.group({
            observaciones: [INITIAL_OBSERVACIONES, [Validators.required]],
          });
          // Suscríbete para cambios de formulario para persistencia
          const OBSERVACIONES_CONTROL = this.formulario.get('observaciones');
          if (OBSERVACIONES_CONTROL) {
            OBSERVACIONES_CONTROL.valueChanges
              .pipe(takeUntil(this.destroy$))
              .subscribe(() => {
                if (!this.esFormularioSoloLectura) {
                  this.setValoresStore(this.formulario, 'observaciones');
                }
              });
          }
        } else {
          // Si el formulario ya existe, simplemente actualice el valor.
          const OBSERVACIONES_CONTROL = this.formulario.get('observaciones');
          if (OBSERVACIONES_CONTROL && OBSERVACIONES_CONTROL.value !== INITIAL_OBSERVACIONES) {
            OBSERVACIONES_CONTROL.setValue(INITIAL_OBSERVACIONES, { emitEvent: false });
          }
        }
      });
  }

   /**
 * Inicializa el estado de los formularios según el modo de solo lectura.
 *
 * Si el formulario está en modo solo lectura (`esFormularioSoloLectura`), llama a `guardarDatosFormulario()`
 * para deshabilitar todos los controles. En caso contrario, inicializa los formularios normalmente.
 */
   inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario(); 
    } else {
      this.crearFormulario();
    }
  }

  /**
   * Valida si un campo específico del formulario es válido.
   * Utiliza el servicio de validaciones para determinar el estado de validez del campo.
   */
  isValid(form: FormGroup, field: string): boolean | null {
    return this.validacionesService.isValid(form, field);
  }

    /**
 * Guarda y actualiza el estado de los formularios según el modo de solo lectura.
 *
 * Inicializa los formularios y luego los deshabilita si el formulario está en modo solo lectura,
 * o los habilita si está en modo edición.
 */
  guardarDatosFormulario(): void {
    this.crearFormulario();
    if (this.esFormularioSoloLectura) {
      this.formulario.disable();
     
    } else {
      this.formulario.enable();
     
    } 
}
}