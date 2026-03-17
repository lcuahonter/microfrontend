import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputFecha, InputFechaComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user'
import { DatosGrupos } from '../../models/permiso-importacion-modification.model';
import { FECHA_DOCUMENTO } from '../../constants/permiso-importacion-modification.enum';
import { PermisoImportacionStore } from '../../estados/permiso-importacion.store';
import { Tramite130120Query } from '../../estados/permiso-importacion.query';

import { FormValidationService } from '../../services/formValidation.service';


/**
 * @component
 * @name DocumentoExportacionComponent
 * @description
 * Componente encargado de gestionar el formulario de datos del documento de exportación
 * para el trámite de permiso de importación 130120. Permite inicializar el formulario, obtener los datos
 * necesarios y actualizar el estado global mediante el store.
 * 
 * @method ngOnInit
 * @description Inicializa el componente, suscribe al estado y configura los formularios y datos.
 *
 * @method initActionFormBuild
 * @description Inicializa el formulario reactivo con los valores actuales del estado.
 *
 * @method fechaDocumento
 * @description Actualiza la fecha del documento en el formulario y en el store.
 * @param {string} evento - Nuevo valor de la fecha.
 *
 * @method setValoresStore
 * @description Actualiza el store con el valor de un campo del formulario usando el método correspondiente.
 * @param {FormGroup} form - Formulario reactivo.
 * @param {string} campo - Nombre del campo en el formulario.
 * @param {keyof PermisoImportacionStore} metodoNombre - Método del store a invocar.
 *
 * @method ngOnDestroy
 * @description Limpia las suscripciones activas cuando el componente es destruido.
 */
@Component({
  selector: 'app-documento-exportacion',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule, TituloComponent, InputFechaComponent],
  templateUrl: './documento-exportacion.component.html',
  styleUrl: './documento-exportacion.component.scss',
})
export class DocumentoExportacionComponent implements OnInit, OnDestroy {

  /**
   * @property {FormGroup} datosExporta 
   * @description Formulario reactivo que captura los datos del documento de exportación.
   */
  datosExporta!: FormGroup;

  /**
   * @property {boolean} esFormularioSoloLectura
   * @description Indica si el formulario está en modo solo lectura.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * @property {InputFecha} fechaDocumentoDatos
   * @description Configuración para el campo de fecha del documento.
   */
  fechaDocumentoDatos: InputFecha = FECHA_DOCUMENTO

  /**
   * @property {Subject<void>} destroyNotifier$
   * @description Subject para manejar la destrucción de suscripciones.
   */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * @property {DatosGrupos} datosState
   * @description Estado actual de los datos del trámite.
   */
  private datosState!: DatosGrupos


  /**
   * @constructor
   * @param {FormBuilder} fb - Servicio para construir formularios reactivos.
   * @param {PermisoImportacionStore} store - Store para manejar el estado global del permiso de importación.
   * @param {Tramite130120Query} query - Query para obtener el estado de los datos del trámite.
   * @param {ConsultaioQuery} consultaQuery - Query para obtener el estado de consulta y modo de solo lectura.
   */
  constructor(
    public fb: FormBuilder,
    public store: PermisoImportacionStore,
    public query: Tramite130120Query,
    public consultaQuery: ConsultaioQuery,
    private cdr: ChangeDetectorRef,
    private formValidation: FormValidationService
  ) {
  }

  /**
   * @method ngOnInit
   * @description Inicializa el componente, suscribe al estado y configura los formularios y datos.
   */
  async ngOnInit(): Promise<void> {
    this.query.selectDatos$
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((state) => {
        this.datosState = state as DatosGrupos;
      })
    )
    .subscribe();
    await this.initActionFormBuild();

    this.consultaQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState) => {
        this.esFormularioSoloLectura = seccionState.readonly;
      })
    )
    .subscribe();

    if(this.esFormularioSoloLectura){
      this.datosExporta.disable();
    }
  }

  /**
   * @method initActionFormBuild
   * @description Inicializa el formulario reactivo con los valores actuales del estado.
   */
  initActionFormBuild(): void {
    this.datosExporta = this.fb.group({
      numero_documento: [this.datosState.datosExporta.numero_documento, Validators.required],
      fecha_documento: [this.datosState.datosExporta.fecha_documento, Validators.required],
      descripcionExportacion: [this.datosState.datosExporta.descripcionExportacion, [Validators.required, Validators.maxLength(4000)]],
      codigo_arancelario: [this.datosState.datosExporta.codigo_arancelario, Validators.required],
      cantidad_umt: [this.datosState.datosExporta.cantidad_umt, Validators.required],
      valor_usd: [this.datosState.datosExporta.valor_usd, [Validators.required, Validators.pattern(/^(?:\d{1,14}|\d{1,14}\.\d{1,2})$/)]],
      precio_unitario_usd: [this.datosState.datosExporta.precio_unitario_usd, [Validators.required, Validators.pattern(/^(?:\d{1,14}|\d{1,14}\.\d{1,2})$/)]],
    });
  }

  /**
   * @method fechaDocumento
   * @description Actualiza la fecha del documento en el formulario y en el store.
   * @param {string} evento - Nuevo valor de la fecha.
   */
  fechaDocumento(evento: string): void {
    this.datosExporta.patchValue({
        fecha_documento: evento 
      });
    this.store.setFecha_documento(evento);
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

  validarFormulario(): boolean {
    this.formValidation.marcarFormularioComoTocado(this.datosExporta);
    this.cdr.detectChanges();
    return this.datosExporta.valid;
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
