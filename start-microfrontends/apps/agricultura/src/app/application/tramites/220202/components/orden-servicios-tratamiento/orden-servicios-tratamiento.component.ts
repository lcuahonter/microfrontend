import { Catalogo, TituloComponent } from '@ng-mf/data-access-user';
import { Component, Input, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HojaTrabajoAgriculturaQuery } from '../../../../shared/queries/hoja-trabajo-agricultura.query';
import { HojaTrabajoAgriculturaStore } from '../../../../shared/estados/hoja-trabajo-agricultura.store';
import { HojaTrabajoService } from '../../services/220202/hoja-trabajo/hoja-trabajo.service';
import { ResponseHojaTrabajoModel } from '../../../../core/models/hoja-trabajo/response-hoja-trabajo.model';
import { Subscription } from 'rxjs';
import { ErrorRequeridoComponent } from '../../shared/error-requerido/error-requerido.component';

@Component({
  selector: 'app-orden-servicios-tratamiento',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    ErrorRequeridoComponent,
  ],
  templateUrl: './orden-servicios-tratamiento.component.html',
  styleUrl: './orden-servicios-tratamiento.component.scss',
})
/**
 * Class: OrdenServiciosTratamientoComponent
 *
 * Description:
 *  componente para tab orden de servicios tratamiento
 *
 *
 * @created 26 de noviembre 2025
 * @version 1.0
 * @category Componente
 */
export class OrdenServiciosTratamientoComponent implements OnInit {
  /**
   * Número de folio del trámite asociado a la orden de servicios de tratamiento.
   * Se recibe desde el componente padre.
   */
  @Input() numFolioTramite: string = '';
  /**
   * Nombre del dictaminador que interviene en la orden.
   * Se recibe desde el componente padre.
   */
  @Input() nombreDictaminador: string = '';
  /**
   * Catálogo de unidades de medida comerciales disponibles para seleccionar
   * en el formulario (por ejemplo, para un componente <select>).
   */
  @Input() unidadMedidaComercial: Catalogo[] = [];
  /**
   * Bandera que indica si el formulario se muestra deshabilitado (solo lectura)
   * o permite la edición de sus campos.
   */
  @Input() disabled: boolean = true;

  /**
   * Arreglo de suscripciones creadas en el componente.
   * Se utiliza para poder liberar las suscripciones, por ejemplo en ngOnDestroy.
   */
  subscription: Subscription[] = [];
  /**
   * Servicio FormBuilder inyectado para construir el formulario reactivo.
   */
  fb: FormBuilder = inject(FormBuilder);
  /**
   * Formulario reactivo que captura la información de la orden de servicios de tratamiento.
   * Cada control representa un campo visible en la UI.
   */
  formOrdenServiciosTratamiento: FormGroup = this.fb.group({
    descripcionProducto: ['', [Validators.required]],
    productoAplicado: ['', [Validators.required]],
    dosis: ['', [Validators.required]],
    cantidadTratar: ['', [Validators.required]],
    unidadMedida: ['', [Validators.required]],
    especificacionTratamiento: ['', [Validators.required]],
    tiempoExposicion: ['', [Validators.required]],
    aplicarA: ['', [Validators.required]],
    observacionesTratamiento: ['', [Validators.required]],
    nombreEmpresaAprobada: ['', [Validators.required]],
    orden_tratamiento: [],
  });

  /**
   * Servicio que gestiona las operaciones relacionadas con la hoja de trabajo,
   * incluyendo la visualización y descarga de la orden de servicios de tratamiento.
   */
  private hojaTrabajoService: HojaTrabajoService = inject(HojaTrabajoService);
  /**
   * Store encargado de administrar el estado de la hoja de trabajo de agricultura.
   */
  private hojaTrabajoAgriculturaStore: HojaTrabajoAgriculturaStore = inject(
    HojaTrabajoAgriculturaStore
  );
  /**
   * Query que permite observar y leer el estado de la hoja de trabajo de agricultura.
   */
  private hojaTrabajoAgriculturaQuery: HojaTrabajoAgriculturaQuery = inject(
    HojaTrabajoAgriculturaQuery
  );
  /**
   * variable para validacione de hoja de trabajo y remision de muestra
   * @private
   */
  private validaciones!: { hojaTrabajo: boolean; remisionMuestra: boolean };

  /**
   * Solicita al backend la generación/visualización de la orden de servicios de tratamiento
   * y dispara la descarga del archivo resultante (por ejemplo, un PDF).
   *
   * Utiliza el numFolioTramite y el nombreDictaminador recibidos como @Input.
   */
  visualizar(): void {
    this.subscription.push(
      this.hojaTrabajoService
        .visualizarOrdenServiciosTratamientoTrabajo(
          '220202',
          this.numFolioTramite,
          this.nombreDictaminador
        )
        .subscribe({
          next: (data: ResponseHojaTrabajoModel) => {
            HojaTrabajoService.descargarArchivo(
              data.datos.contenido ?? '',
              data.datos.nombre_archivo ?? ''
            );
          },
        })
    );
  }

  /**
   * - Suscribe al estado de la hoja de trabajo para precargar el formulario
   *   con los datos de orden de tratamiento almacenados en el store.
   * - Escucha los cambios del formulario y actualiza el store con los nuevos valores
   *   y con el estado de validación del formulario.
   */
  ngOnInit(): void {
    this.hojaTrabajoAgriculturaQuery.selectHojaTrabajo$.subscribe((next) => {
      this.formOrdenServiciosTratamiento.patchValue(
        {
          descripcionProducto:
            next.orden_tratamiento.descripcion_mercancia_tratada,
          productoAplicado: next.orden_tratamiento.producto_aplicado,
          dosis: next.orden_tratamiento.dosis_tratamiento,
          cantidadTratar: next.orden_tratamiento.cantidad_mercancia_tratada,
          unidadMedida: next.orden_tratamiento.clave_unidad_medida,
          especificacionTratamiento:
            next.orden_tratamiento.descripcion_tratamiento,
          tiempoExposicion: next.orden_tratamiento.tiempo_exposicion,
          aplicarA: next.orden_tratamiento.tipo_tratamiento,
          observacionesTratamiento: next.orden_tratamiento.observacion,
          nombreEmpresaAprobada: next.orden_tratamiento.nombre_empresa,
          orden_tratamiento: next.orden_tratamiento.orden_tratamiento,
        },
        { emitEvent: false }
      );
      this.validaciones = {
        hojaTrabajo: next.validaciones.hojaTrabajo,
        remisionMuestra: next.validaciones.remisionMuestra,
      };
      this.formOrdenServiciosTratamiento.markAllAsTouched();
      Object.keys(this.formOrdenServiciosTratamiento.controls).forEach((key) =>
        this.formOrdenServiciosTratamiento.get(key)?.markAsDirty()
      );
    });

    this.formOrdenServiciosTratamiento.valueChanges.subscribe((next) => {
      this.hojaTrabajoAgriculturaStore.setDatosOrdenTratamiento({
        orden_tratamiento: next.orden_tratamiento,
        descripcion_mercancia_tratada: next.descripcionProducto,
        producto_aplicado: next.productoAplicado,
        dosis_tratamiento: next.dosis,
        cantidad_mercancia_tratada: next.cantidadTratar,
        clave_unidad_medida: next.unidadMedida,
        descripcion_tratamiento: next.especificacionTratamiento,
        tiempo_exposicion: next.tiempoExposicion,
        tipo_tratamiento: next.aplicarA,
        observacion: next.observacionesTratamiento,
        nombre_empresa: next.nombreEmpresaAprobada,
      });
      this.hojaTrabajoAgriculturaStore.setVaidaciones({
        hojaTrabajo: this.validaciones.hojaTrabajo,
        remisionMuestra: this.validaciones.remisionMuestra,
        ordenTratamiento: this.formOrdenServiciosTratamiento.valid,
      });
    });
  }

  /**
   * validacion de formulario
   * @param controlName
   */
  isInvalid(controlName: string): boolean {
    const CONTROL: AbstractControl =
      this.formOrdenServiciosTratamiento.get(controlName)!;
    return CONTROL ? CONTROL.invalid && CONTROL.touched : false;
  }
}
