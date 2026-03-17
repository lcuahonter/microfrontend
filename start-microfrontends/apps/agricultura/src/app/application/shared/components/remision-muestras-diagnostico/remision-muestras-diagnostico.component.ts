import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  Catalogo,
  InputFechaComponent,
  TituloComponent,
  formatearFechaDdMmYyyy,
  formatearFechaYyyyMmDd,
} from '@ng-mf/data-access-user';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorRequeridoComponent } from '../../../shared/components/error-requerido/error-requerido.component';
import { HojaTrabajoAgriculturaQuery } from '../../../shared/queries/hoja-trabajo-agricultura.query';
import { HojaTrabajoAgriculturaStore } from '../../../shared/estados/hoja-trabajo-agricultura.store';
import { HojaTrabajoService } from '../../services/hoja-trabajo/hoja-trabajo.service';
import { ResponseHojaTrabajoModel } from '../../../core/models/hoja-trabajo/response-hoja-trabajo.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-remision-muestras-diagnostico',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TituloComponent,
    ErrorRequeridoComponent,
    InputFechaComponent,
  ],
  templateUrl: './remision-muestras-diagnostico.component.html',
  styleUrl: './remision-muestras-diagnostico.component.scss',
})
export class RemisionMuestrasDiagnosticoComponent implements OnInit, OnDestroy {
  /**
   * Servicio que gestiona las operaciones de hoja de trabajo,
   * incluyendo la obtención de vistas previas y descargas.
   */
  private hojaTrabajoService: HojaTrabajoService = inject(HojaTrabajoService);
  /**
   * Arreglo de suscripciones creadas en el componente.
   * Se utiliza para poder cancelarlas en ngOnDestroy y evitar fugas de memoria.
   */
  subscription: Subscription[] = [];
  /**
   * FormBuilder inyectado para construir el formulario reactivo
   * de remisión de muestras para diagnóstico.
   */
  fb: FormBuilder = inject(FormBuilder);
  /**
   * Formulario reactivo que captura los datos de la remisión de muestras para diagnóstico.
   */
  formRemisionMuestrasDiagnostico: FormGroup = this.fb.group({
    tipoLaboratorio: [''],
    nombreLaboratorio: [''],
    analisisSolicitado: [''],
    tamanoMuestra: [''],
    unidadMedida: [''],
    fechaTomaMuestra: [''],
    loteNumero: [''],
    observaciones: [''],
    datosGenerales: [''],
    id_remision_muestra: [],
    remision_muestra: [],
  });
  /**
   * Número de folio del trámite asociado a la remisión de muestras.
   * Se recibe desde el componente padre.
   */
  @Input() numFolioTramite: string = '';
  /**
   * Nombre del dictaminador que genera la remisión de muestras.
   * Se recibe desde el componente padre.
   */
  @Input() nombreDictaminador: string = '';
  /**
   * Catálogo de tipos de laboratorio disponibles
   * (por ejemplo, autorizado/aprobado u oficial).
   */
  @Input() tiposLaboratorio: Catalogo[] = [];
  /**
   * Catálogos de nombres de laboratorio agrupados por tipo:
   * - autorizadoAprobado: laboratorios autorizados/aprobados.
   * - oficial: laboratorios oficiales.
   */
  @Input() nombresLaboratorios!: {
    autorizadoAprobado: Catalogo[];
    oficial: Catalogo[];
  };
  /**
   * Catálogo de unidades de medida comerciales disponibles
   * para la captura del tamaño de la muestra.
   */
  @Input() unidadMedidaComercial: Catalogo[] = [];
  /**
   * Bandera que indica si el formulario debe estar deshabilitado (solo lectura)
   * o permitir edición de sus campos.
   */
  @Input() disabled: boolean = true;
  /**
   * Lista de nombres de laboratorio que se muestra en el formulario,
   * calculada en función del tipo de laboratorio seleccionado.
   */
  nombresLaboratorio: Catalogo[] = [];
  /**
   * Query que permite leer/observar el estado de la hoja de trabajo de agricultura.
   */
  private hojaTrabajoAgriculturaQuery: HojaTrabajoAgriculturaQuery = inject(
    HojaTrabajoAgriculturaQuery
  );
  /**
   * Store que administra y actualiza el estado de la hoja de trabajo de agricultura.
   */
  private hojaTrabajoAgriculturaStore: HojaTrabajoAgriculturaStore = inject(
    HojaTrabajoAgriculturaStore
  );
  private validaciones!: { hojaTrabajo: boolean; ordenTratamiento: boolean };

  /**
   * Maneja el cambio de tipo de laboratorio en el formulario.
   * Obtiene el valor seleccionado y actualiza el catálogo de nombres de laboratorio.
   */
  cambioLaboratorio(): void {
    const IDETIPOLABORATORIO: string =
      this.formRemisionMuestrasDiagnostico.get('tipoLaboratorio')?.value;
    this.buscaCatalogo(IDETIPOLABORATORIO);
  }

  /**
   * Solicita al backend la vista previa del documento de remisión de muestras
   * para diagnóstico y dispara la descarga del archivo generado.
   */
  visualizar(): void {
    this.subscription.push(
      this.hojaTrabajoService
        .visualizarRemisionMuestrasDiagnosticoTrabajo(
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
   * Busca y asigna el catálogo de nombres de laboratorio correspondiente
   * al tipo de laboratorio seleccionado.
   *
   * @param valor Clave del tipo de laboratorio seleccionado.
   */
  private buscaCatalogo(valor: string): void {
    if (valor === 'TILA.AU') {
      this.nombresLaboratorio = this.nombresLaboratorios.autorizadoAprobado;
    } else {
      this.nombresLaboratorio = this.nombresLaboratorios.oficial;
    }
  }

  /**
   * - Carga la información inicial de remisión de muestras desde el store.
   * - Ajusta el catálogo de nombres de laboratorio según el tipo almacenado.
   * - Sincroniza los cambios del formulario hacia el store.
   */
  ngOnInit(): void {
    this.hojaTrabajoAgriculturaQuery.selectHojaTrabajo$.subscribe((next) => {
      if (next.remision_muestra.tipo_laboratorio !== undefined) {
        this.buscaCatalogo(next.remision_muestra.tipo_laboratorio);
      }
      this.formRemisionMuestrasDiagnostico.patchValue(
        {
          tipoLaboratorio: next?.remision_muestra?.tipo_laboratorio,
          nombreLaboratorio: next?.remision_muestra?.id_laboratorio_tipo_tramite,
          analisisSolicitado:
            next?.remision_muestra?.descripcion_analisis_solicitado,
          tamanoMuestra: next?.remision_muestra?.tamano_muestra,
          unidadMedida: next?.remision_muestra?.clave_unidad_medida,
          fechaTomaMuestra: next?.remision_muestra?.fecha_toma_muestra,
          loteNumero: next?.remision_muestra?.numero_lote,
          observaciones: next?.remision_muestra?.observaciones,
          datosGenerales: next?.remision_muestra?.nombre_responsable_mercancia,
          id_remision_muestra: next?.remision_muestra?.id_remision_muestra,
          remision_muestra: next?.remision_muestra?.remision_muestra,
        },
        { emitEvent: false }
      );
      this.validaciones = {
        hojaTrabajo: next.validaciones.hojaTrabajo,
        ordenTratamiento: next.validaciones.ordenTratamiento,
      };
      this.formRemisionMuestrasDiagnostico.markAllAsTouched();
      Object.keys(this.formRemisionMuestrasDiagnostico.controls).forEach(
        (key) => this.formRemisionMuestrasDiagnostico.get(key)?.markAsDirty()
      );
    });

    this.formRemisionMuestrasDiagnostico.valueChanges.subscribe((next) => {
      const TIPOLABORATORIO: string =
        this.nombresLaboratorio.find((f) => f.clave === next.nombreLaboratorio)
          ?.descripcion || '';
      this.hojaTrabajoAgriculturaStore.setDatosRemisionMuestra({
        id_remision_muestra: next.id_remision_muestra,
        remision_muestra: next.remision_muestra,
        tipo_laboratorio: next.tipoLaboratorio,
        id_laboratorio_tipo_tramite: next.nombreLaboratorio,
        descripcion_laboratorio: TIPOLABORATORIO,
        descripcion_analisis_solicitado: next.analisisSolicitado,
        tamano_muestra: next.tamanoMuestra,
        clave_unidad_medida: next.unidadMedida,
        fecha_toma_muestra: next.fechaTomaMuestra,
        numero_lote: next.loteNumero,
        observaciones: next.observaciones,
        nombre_responsable_mercancia: next.datosGenerales,
      });
      this.hojaTrabajoAgriculturaStore.setVaidaciones({
        hojaTrabajo: this.validaciones.hojaTrabajo,
        remisionMuestra: this.formRemisionMuestrasDiagnostico.valid,
        ordenTratamiento: this.validaciones.ordenTratamiento,
      });
    });
  }

  /**
   * Cancela todas las suscripciones almacenadas para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.subscription.forEach((sub: Subscription) => sub.unsubscribe());
  }

  /**
   * validacion de formulario
   * @param controlName
   */
  isInvalid(controlName: string): boolean {
    const CONTROL = this.formRemisionMuestrasDiagnostico.get(controlName);
    return CONTROL ? CONTROL.invalid && CONTROL.touched : false;
  }

  /**
   * parseo de fecha
   * @param event
   */
  setFecha(event: string): void {
    const FECHAPARSE: string = formatearFechaYyyyMmDd(event);
    this.formRemisionMuestrasDiagnostico
      .get('fechaTomaMuestra')
      ?.setValue(FECHAPARSE);
  }

  /**
 * parseo de fecha
 * @param event
 */
  setFechaddMMYY(): string {
    const FECHAPARSE: string = formatearFechaDdMmYyyy(this.formRemisionMuestrasDiagnostico.get('fechaTomaMuestra')?.value);
    return FECHAPARSE;
  }
}
