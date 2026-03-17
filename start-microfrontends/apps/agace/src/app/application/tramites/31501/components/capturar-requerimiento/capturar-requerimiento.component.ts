import { Catalogo, CatalogoSelectComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Solicitud31501State, Tramite31501Store } from '../../../../estados/tramites/tramite31501.store';
import { Subject, map, takeUntil } from 'rxjs';
import { AutoridadService } from '../../services/autoridad.service';
import { CommonModule } from '@angular/common';
import { SolicitanteComponent } from '../solicitante/solicitante.component';
import { Tramite31501Query } from '../../../../estados/queries/tramite31501.query';
import { TramiteList } from '../../models/datos-tramite.model';

@Component({
  selector: 'app-capturar-requerimiento',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TituloComponent,
    CatalogoSelectComponent,
    SolicitanteComponent,
  ],
  templateUrl: './capturar-requerimiento.component.html',
  styleUrl: './capturar-requerimiento.component.scss',
})
export class CapturarRequerimientoComponent implements OnInit, OnDestroy {
  tramiteList: {
    catalogos: TramiteList[];
    labelNombre: string;
    primerOpcion: string;
  };

  /**
   * Lista de aduanas.
   */
  aduana: {
    catalogos: Catalogo[];
    labelNombre: string;
    primerOpcion: string;
  };

  /**
   * Formulario reactivo utilizado para capturar los datos del requerimiento.
   * Este formulario se utiliza en el componente `capturar-requerimiento`.
   */
  capturarRequirementoForm!: FormGroup;

  /**
   * Estado de la solicitud.
   */
  public solicitud31501State!: Solicitud31501State;

  /**
   * Sujeto utilizado como notificador para la destrucción del componente.
   * Se emite un valor cuando el componente se destruye, permitiendo cancelar
   * suscripciones o liberar recursos asociados.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado de la solicitud.
   */
  public solicitudState!: Solicitud31501State;

  /**
   * Índice del paso actual en el wizard.
   *
   * Esta propiedad indica el índice del paso actual en el wizard, comenzando desde 1.
   */
  indice: number = 1;
  
    /**
   * @property {ConsultaioState} consultaDatos
   * @description Estado actual de la consulta, que contiene información relacionada con el trámite y el solicitante.
   */
  consultaDatos!: ConsultaioState;

    /**
   * @property {boolean} soloLectura
   * @description Indica si el formulario o los campos están en modo de solo lectura.
   * @default false
   */
  soloLectura: boolean = false;

  constructor(
    private autoridadService: AutoridadService,
    private fb: FormBuilder,
    public tramite31501Store: Tramite31501Store,
    private tramite31501Query: Tramite31501Query,
    private consultaioQuery: ConsultaioQuery,
  ) {
    this.tramiteList = {
      catalogos: [],
      labelNombre: 'Tipo de trámite',
      primerOpcion: 'Seleccione un valor',
    };
    this.aduana = {
      catalogos: [],
      labelNombre: 'Tipo de requerimiento',
      primerOpcion: 'Selecciona el tipo de Trámite',
    };
  }

  ngOnInit(): void {
    this.tramite31501Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
      this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.soloLectura = this.consultaDatos.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
      this.inicializarFormulario();
    this.fetchAduanaList();
  }

  /**
   * Inicializa el formulario `capturarRequirementoForm` con los valores predeterminados
   * obtenidos del estado `solicitud31501State`. Configura los controles del formulario
   * con validadores requeridos para garantizar que los campos obligatorios sean completados.
   * 
   * Controles del formulario:
   * - `motivoCancelacion`: Campo obligatorio que toma su valor inicial de `solicitud31501State.motivoCancelacion`.
   * - `tipoDeRequerimiento`: Campo obligatorio que toma su valor inicial de `solicitud31501State.tipoDeRequerimiento`.
   */
  inicializarFormulario(): void {
    this.capturarRequirementoForm = this.fb.group({
      motivoCancelacion: [
        {value: this.solicitud31501State?.motivoCancelacion, disabled: this.soloLectura},
        Validators.required,
      ],
      tipoDeRequerimiento: [
        this.solicitud31501State?.tipoDeRequerimiento,
        Validators.required,
      ],
    });
    this.inicializarEstadoFormulario();
  }

    /**
  * @method inicializarEstadoFormulario
  * @description Inicializa el estado del formulario según el modo de solo lectura.
  * 
  * Si la propiedad `soloLectura` es verdadera, deshabilita todos los controles del formulario.
  * En caso contrario, habilita los controles del formulario.
  * 
  * @returns {void}
  */
  inicializarEstadoFormulario(): void {
    if (this.soloLectura) {
      this.capturarRequirementoForm?.disable();
    } else {
      this.capturarRequirementoForm?.enable();
    }
  }

  /**
   * Obtiene la lista de aduanas desde el servicio de autoridad y actualiza el catálogo de trámites.
   * 
   * @remarks
   * Este método realiza una solicitud al servicio `autoridadService` para obtener 
   * una lista de trámites bajo el identificador 'menuDesplegable'. Una vez que se 
   * recibe la respuesta, actualiza la propiedad `catalogos` de `tramiteList` con los datos obtenidos.
   * 
   * @returns {void} Este método no retorna ningún valor.
   */
  public fetchAduanaList(): void {
    this.autoridadService
      .getTramiteList('menuDesplegable').pipe(takeUntil(this.destroyNotifier$))
      .subscribe((respuesta) => {
        this.tramiteList.catalogos = respuesta.data;
      });
  }

  /**
   * Establecer valores en el store del trámite.
   * @param form Formulario reactivo.
   * @param campo Nombre del campo.
   * @param metodoNombre Nombre del método en el store.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite31501Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite31501Store[metodoNombre] as (valor: unknown) => void)(VALOR);
  }

  /**
   * Selecciona una pestaña.
   * @param i El índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

      /**
   * Método del ciclo de vida de Angular que se ejecuta cuando el componente se destruye.
   * Aquí se utiliza para emitir un valor en el observable `destroy$` y completar su emisión,
   * asegurando la limpieza de suscripciones y evitando posibles fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
