/**
 * PermisoRenunciaDeDerechosComponent es un componente que maneja la renuncia de derechos de permisos.
 * @packageDocumentation
 * @module PermisoRenunciaDeDerechosComponent
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, TituloComponent } from '@ng-mf/data-access-user';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { Tramite140111State, Tramite140111Store } from '../../estados/tramite140111.store';
import { CommonModule } from '@angular/common';
import { MANIFIESTO_BAJO_PROTESTA } from '../../enums/permiso-renuncia-de-derechos.enum';
import { PermisoFormInterface } from '../../model/renuncia-de-derechos.model';
import { RenunciaDeDerechosAlServicio } from '../../services/renuncia-de-derechos-al.service';
import { Tramite140111Query } from '../../estados/tramite140111.query';


/**
 * PermisoRenunciaDeDerechosComponent es un componente que maneja la renuncia de derechos de permisos.
 */
@Component({
  selector: 'app-permiso-renuncia-de-derechos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TituloComponent],
  templateUrl: './permiso-renuncia-de-derechos.component.html',
  styleUrl: './permiso-renuncia-de-derechos.component.scss',
})
export class PermisoRenunciaDeDerechosComponent implements OnInit, OnDestroy {

  /**
   * Configuración del formulario de renuncia de derechos de permisos.
   */
  public formulario!: FormGroup;

   /**
   * Declaración bajo protesta de decir verdad.
   */
  public MANIFIESTO_BAJO_PROTESTA = MANIFIESTO_BAJO_PROTESTA;

  /**
   * Subject utilizado para manejar la destrucción del componente y evitar fugas de memoria.
   */
  public destroyed$ = new Subject<void>();

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Inicializa el componente PermisoRenunciaDeDerechosComponent.
   * @constructor
   * @param {FormBuilder} fb - El constructor de formularios.
   * @returns void
   * @description Inicializa el componente PermisoRenunciaDeDerechosComponent.
   */
  constructor(
    private fb:FormBuilder, 
    private Servicio: RenunciaDeDerechosAlServicio,
    private tramite140111Store:Tramite140111Store,
    private tramite140111Query:Tramite140111Query,
    private consultaQuery: ConsultaioQuery
  ) {
    this.crearpermisoForm();
     /**
    * Se suscribe al estado de `Consultaio` para obtener información actualizada del estado del formulario.
    *
    * - Asigna el valor de solo lectura (`readonly`) a la propiedad `esFormularioSoloLectura`.
    * - Llama a `inicializarEstadoFormulario()` para aplicar configuraciones basadas en el estado recibido.
    * - La suscripción se cancela automáticamente cuando `destroyNotifier$` emite un valor (para evitar fugas de memoria).
    */
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.actualizarEstadoCampos();
        })
      )
      .subscribe();
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * @returns void
   * @description Crea el formulario de renuncia de permisos y establece los valores iniciales.
   */
  ngOnInit(): void {
    this.enPatchForm();
    this.datosGuardadosParche();
  }

   /**
   * Crea el formulario de renuncia de derechos de permisos.
   * @returns void
   * @description Crea y configura el formulario de renuncia de derechos de permisos.
   */
  crearpermisoForm(): void {
    this.formulario = this.fb.group({
      mercanciaSolicitudFolioTramite: [{ value: '', disabled: true }],
      mercacniaSolicitudTipoSolicitud: [{ value: '', disabled: true }],
      mercacniaSolicitudRegimen: [{ value: '', disabled: true }],
      mercacniaSolicitudClasificacionRegimen: [{ value: '', disabled: true }],
      mercacniaSolicitudPeriodoDeVigencia: [{ value: '', disabled: true }],
      mercacniaSolicitudUnidadMedida: [{ value: '', disabled: true }],
      mercacniaSolicitudFraccionArancelaria: [{ value: '', disabled: true }],
      mercacniaSolicitudCantidadAutorizada: [{ value: '', disabled: true }],
      mercacniaSolicitudValorAutorizado: [{ value: '', disabled: true }],
      solicitudNicoSener: [{ value: '', disabled: true }],
      solicitudDescNicoSener: [{ value: '', disabled: true }],
      solicitudAcotacion: [{ value: '', disabled: true }],
      mercacniaSolicitudPermisoValidoDesde: [{ value: '', disabled: true }],
      mercacniaSolicitudPermisoValidoHasta: [{ value: '', disabled: true }],
      motivoRenunciaDeDerechos:['', [Validators.required, Validators.maxLength(255)]],
      mercacniaSolicitudControlar: [false, Validators.requiredTrue]
    });
  }


  /**
   * Establece los valores del formulario de renuncia de derechos de permisos.
   * @param {PermisoFormInterface} data - Los datos del formulario de renuncia de derechos de permisos.
   * @returns void
   * @description Establece los valores del formulario de renuncia de derechos de permisos a partir de los datos proporcionados.
   */
  enPatchForm(): void {
    this.Servicio.getDescripcionDelCupo()
    .pipe(takeUntil(this.destroyed$))
    .subscribe((data: PermisoFormInterface) => {
      this.formulario.patchValue({
        mercanciaSolicitudFolioTramite: data.folioTramite,
        mercacniaSolicitudTipoSolicitud: data.tipoDeSolicitud,
        mercacniaSolicitudRegimen: data.regimen,
        mercacniaSolicitudClasificacionRegimen: data.clasificacionDelRegimen,
        mercacniaSolicitudPeriodoDeVigencia: data.periodoDeVigencia,
        mercacniaSolicitudUnidadMedida: data.unidadDeMedida,
        mercacniaSolicitudFraccionArancelaria: data.fraccionArancelaria,
        mercacniaSolicitudCantidadAutorizada: data.cantidadAutorizada,
        mercacniaSolicitudValorAutorizado: data.valorAutorizado,
        solicitudNicoSener: data.nico,
        solicitudDescNicoSener: data.descripcionNico,
        solicitudAcotacion: data.acotacion,
        mercacniaSolicitudPermisoValidoDesde: data.permisoValidoDesde,
        mercacniaSolicitudPermisoValidoHasta: data.permisoValidoHasta,
      });
    });
  }

   /**
   * Obtiene el valor de un control en el formulario y lo pasa a un método del store para actualizar el estado.
   */
   setValoresStore(form: FormGroup, campo: string): void {
    const VALOR = form.get(campo)?.value;
    this.tramite140111Store.establecerDatos({[campo]: VALOR});
  }


  /**
   * Habilita o deshabilita dinámicamente los campos 'motivoRenunciaDeDerechos' y 'mercacniaSolicitudControlar'
   * según el estado de solo lectura del formulario.
   *
   * @returns void
   * @description Si el formulario está en modo solo lectura, deshabilita ambos campos; de lo contrario, los habilita.
   */
  actualizarEstadoCampos(): void {
    const CAMPOS = ['motivoRenunciaDeDerechos', 'mercacniaSolicitudControlar'];
    CAMPOS.forEach(campo => {
      const CONTROL = this.formulario.get(campo);
      if (CONTROL) {
        if (this.esFormularioSoloLectura) {
          CONTROL.disable();
        } else {
          CONTROL.enable();
        }
      }
    });
  }

  /**
   * Actualiza el formulario con datos del store
   */
  datosGuardadosParche(): void {
    this.tramite140111Query.selectTramite140111$
        .pipe(
          takeUntil(this.destroyed$),
          map((seccionState:Tramite140111State) => {
            this.formulario.patchValue(
                {
                  motivoRenunciaDeDerechos:seccionState.motivoRenunciaDeDerechos,
                  mercacniaSolicitudControlar:seccionState.mercacniaSolicitudControlar 
                }
              )
          })
        )
        .subscribe();
  }

   /**
   * Método para verificar si un control del formulario es inválido.
   * @param {string} nombreControl - Nombre del control del formulario.
   * @returns {boolean} - Retorna true si el control es inválido, de lo contrario false.
   */
   esInvalido(nombreControl: string): boolean {
    const CONTROL = this.formulario.get(nombreControl);
    return CONTROL
      ? CONTROL.invalid && (CONTROL.touched || CONTROL.dirty)
      : false;
  }

    /**
   * Método de ciclo de vida de Angular que se ejecuta al destruir el componente.
   */
    ngOnDestroy(): void {
      this.destroyed$.next();
      this.destroyed$.complete();
    }

}
