import { Catalogo, CatalogoSelectComponent, CatalogosService, CategoriaMensaje, Notificacion, SeccionLibState, SeccionLibStore, TituloComponent } from '@libs/shared/data-access-user/src';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user'
import { DatosGrupos } from '../../models/permiso-importacion-modification.model';
import { PermisoImportacionService } from '../../services/permiso-importacion.service';
import { PermisoImportacionStore } from '../../estados/permiso-importacion.store';
import { Tramite130120Query } from '../../estados/permiso-importacion.query';

import { CatalogosTramiteService } from '../../services/catalogosTramite.service';
import { CodigoRespuesta } from '../../../../core/enum/se-core-enum';
import { FormValidationService } from '../../services/formValidation.service';

/**
 * @component
 * @name TramiteRealizerComponent
 * @description
 * Componente encargado de gestionar el formulario de selección de régimen y clasificación de régimen
 * para el trámite de permiso de importación 130120. Permite inicializar el formulario, obtener los catálogos
 * necesarios y actualizar el estado global mediante el store.
 *
 * @method ngOnInit
 * @description Inicializa el componente, suscribe al estado y configura los formularios y catálogos.
 *
 * @method initActionFormBuild
 * @description Inicializa el formulario reactivo con los valores actuales del estado.
 *
 * @method setValoresStore
 * @description Actualiza el store con el valor de un campo del formulario usando el método correspondiente.
 * @param {FormGroup} form - Formulario reactivo.
 * @param {string} campo - Nombre del campo en el formulario.
 * @param {keyof PermisoImportacionStore} metodoNombre - Método del store a invocar.
 *
 * @method obtenerRegimenSelectList
 * @description Obtiene las opciones del catálogo de régimen desde el servicio y las asigna al arreglo local.
 *
 * @method obtenerClassificionRegimenSelectList
 * @description Obtiene las opciones del catálogo de clasificación de régimen desde el servicio y las asigna al arreglo local.
 *
 * @method ngOnDestroy
 * @description Limpia las suscripciones activas cuando el componente es destruido.
 */
@Component({
  selector: 'app-tramite-realizer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TituloComponent],
  templateUrl: './tramite_realizer.component.html',
  styleUrl: './tramite_realizer.component.scss',
})
export class TramiteRealizerComponent implements OnInit, OnDestroy {

  /**
   * @property {FormGroup} datosRealizer
   * @description Formulario reactivo que captura los datos de régimen y clasificación de régimen.
   */
  datosRealizer!: FormGroup;

  /**
    * Nueva notificación para mostrar mensajes de error o información al usuario.
    */
  nuevaNotificacion: Notificacion | null = null;

  /**
   * @property {Catalogo[]} regimenOpciones
   * @description Opciones disponibles para el campo de régimen.
   */
  regimenOpciones: Catalogo[] = [];

  /**
   * @property {Catalogo[]} classificationRegimenOpciones
   * @description Opciones disponibles para el campo de clasificación de régimen.
   */
  classificationRegimenOpciones: Catalogo[] = [];

  /**
   * @property {boolean} esFormularioSoloLectura
   * @description Indica si el formulario está en modo solo lectura.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * @property {Subject<void>} destroyNotifier$
   * @description Subject para manejar la destrucción de suscripciones.
   */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * @property {DatosGrupos} realizarState
   * @description Estado actual de los datos del trámite.
   */
  private seccionState!: SeccionLibState;

  /**
   * @property {DatosGrupos} realizarState
   * @description Estado actual de los datos del trámite.
   */
  public realizarState!: DatosGrupos

  constructor(
    public readonly fb: FormBuilder,
    public store: PermisoImportacionStore,
    public query: Tramite130120Query,
    public seccionStore: SeccionLibStore,
    public catalogosServicios: CatalogosService,
    public permisoImportacionService: PermisoImportacionService,
    public consultaQuery: ConsultaioQuery,
    private catalogosService: CatalogosTramiteService,
    private cdr: ChangeDetectorRef,
    private formValidation: FormValidationService
  ) { }

  /**
   * @method ngOnInit
   * @description Inicializa el componente, suscribe al estado y configura los formularios y catálogos.
   */
  ngOnInit(): void {
    this.query.selectDatos$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((state) => {
          this.realizarState = state as DatosGrupos;
        })
      )
      .subscribe();
    this.initActionFormBuild();
    this.cargarRegimenes();
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();
    const CVEREGIMEN = this.datosRealizer.get('regimen')?.value;
    if (CVEREGIMEN) {
      this.onRegimenSeleccionado();
    }
    if (this.esFormularioSoloLectura) {
      this.datosRealizer.disable();
    }
  }

  /**
   * @method initActionFormBuild
   * @description Inicializa el formulario reactivo con los valores actuales del estado.
   */
  initActionFormBuild(): void {
    this.datosRealizer = this.fb.group({
      regimen: [this.realizarState.datosRealizer.regimen || null, Validators.required],
      classificion_regimen: [this.realizarState.datosRealizer.classificion_regimen || null, Validators.required],
    });
  }

  /**
   * @method setValoresStore
   * @description Actualiza el store con el valor de un campo del formulario usando el método correspondiente.
   * @param {FormGroup} form - Formulario reactivo.
   * @param {string} campo - Nombre del campo en el formulario.
   * @param {keyof PermisoImportacionStore} metodoNombre - Método del store a invocar.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof PermisoImportacionStore,
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.store[metodoNombre] as (value: string) => void)(
      VALOR
    );
  }

  /**
   * @method obtenerRegimenSelectList
   * @description Obtiene las opciones del catálogo de régimen desde el servicio y las asigna al arreglo local.
   */
  cargarRegimenes(): void {
    this.catalogosService.getCatRegimenes().subscribe({
      next: (resp) => {
        if (resp.codigo === CodigoRespuesta.EXITO) {
          this.regimenOpciones = resp.datos ?? [];
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.nuevaNotificacion = {
            tipoNotificacion: 'toastr',
            categoria: CategoriaMensaje.ERROR,
            modo: 'action',
            titulo: resp.error || 'Error al mostrar la firma.',
            mensaje:
              resp.causa ||
              resp.mensaje ||
              'Ocurrió un error al mostrar la firma.',
            cerrar: false,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };
        }
      },
      error: (err) => {
        console.error('Error al cargar los regímenes', err);
      }
    });
  }

  /**
   * @method onRegimenSeleccionado
   * @description Maneja el evento de selección de régimen, actualiza el store y carga las opciones de clasificación de régimen.
   */
  onRegimenSeleccionado(): void {
    const CVEREGIMEN = this.datosRealizer.get('regimen')?.value;
    this.store.setregimen(CVEREGIMEN);
    if (CVEREGIMEN) {
      this.cargarClasificacionRegimen(CVEREGIMEN);
    } else {
      this.classificationRegimenOpciones = [];
      this.datosRealizer.get('classificion_regimen')?.reset();
      if (this.esFormularioSoloLectura) {
        this.datosRealizer.get('classificion_regimen')?.disable();
      }
    }
  }

  /**
   * @method obtenerClassificionRegimenSelectList
   * @description Obtiene las opciones del catálogo de clasificación de régimen desde el servicio y las asigna al arreglo local.
   */
  cargarClasificacionRegimen(cveRegimen: string): void {
    this.catalogosService.getCatCveRegimen(cveRegimen)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (resp) => {
          if (resp.codigo === CodigoRespuesta.EXITO && resp.datos && resp.datos.length > 0) {
            this.classificationRegimenOpciones = resp.datos;
            if (!this.esFormularioSoloLectura) {
              this.datosRealizer.get('classificion_regimen')?.enable();
            } else {
              this.datosRealizer.get('classificion_regimen')?.disable();
            }
          } else {
            this.classificationRegimenOpciones = [];
            this.datosRealizer.get('classificion_regimen')?.reset();
            if (this.esFormularioSoloLectura) {
              this.datosRealizer.get('classificion_regimen')?.disable();
            }
          }
        },
        error: (err) => {
          console.error('Error al cargar clasificación de régimen', err);
          this.classificationRegimenOpciones = [];
          this.datosRealizer.get('classificion_regimen')?.reset();
          if (this.esFormularioSoloLectura) {
            this.datosRealizer.get('classificion_regimen')?.disable();
          }
        }
      });
  }

  validarFormulario(): boolean {
    this.formValidation.marcarFormularioComoTocado(this.datosRealizer);
    this.cdr.detectChanges();
    return this.datosRealizer.valid;
  }

  /**
   * @method ngOnDestroy
   * @description Limpia las suscripciones activas cuando el componente es destruido.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}