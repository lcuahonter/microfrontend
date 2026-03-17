import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription, debounceTime, distinctUntilChanged, take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Detalle } from '../../../core/models/hoja-trabajo/hoja-trabajo.model';
import { ErrorRequeridoComponent } from '../error-requerido/error-requerido.component';
import { HojaTrabajoAgriculturaQuery } from '../../queries/hoja-trabajo-agricultura.query';
import { HojaTrabajoAgriculturaStore } from '../../estados/hoja-trabajo-agricultura.store';
import { HojaTrabajoService } from '../../services/hoja-trabajo/hoja-trabajo.service';
import { ResponseHojaTrabajoModel } from '../../../core/models/hoja-trabajo/response-hoja-trabajo.model';
import { TituloComponent } from '@ng-mf/data-access-user';
import { TooltipDirective } from 'ngx-bootstrap/tooltip';

interface Entrada {
  id_mercancia: number;
  cve_seccion: string;
  numero_requisito: number;
  descripcion_requisito: string;
  id_restriccion_tipo_tramite: number;
  descripcion_restriccion: string;
  requisitos: string;
}

interface Agrupado {
  id_mercancia: number;
  cve_seccion: string;
  id_restriccion_tipo_tramite: number;
  descripcion_restriccion: string;
  requisitos: string;
  descripciones: {
    numero_requisito: number;
    descripcion_requisito: string;
    aplica_entrega_documentos: number | null;
  }[];
}

@Component({
  selector: 'app-hoja-trabajo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TituloComponent,
    TooltipDirective,
    ErrorRequeridoComponent,
  ],
  templateUrl: './hoja-trabajo.component.html',
  styleUrl: './hoja-trabajo.component.scss',
})
/**
 * Class: HojaTrabajoComponent
 *
 * Description:
 *  Contiene la vista y funcionamiento de la tab hoja de trabajo
 *
 *
 * @created 28 de noviembre de 2025
 * @version 1.0
 * @category Componente
 */
export class HojaTrabajoComponent implements OnInit, OnDestroy {
  /**
   * Servicio que gestiona las operaciones de hoja de trabajo,
   * incluyendo la obtención de vistas previas y descargas.
   */
  private hojaTrabajoService: HojaTrabajoService = inject(HojaTrabajoService);
  /**
   * FormBuilder inyectado para crear el formulario reactivo de datos generales
   * de la hoja de trabajo (toma de muestra, tratamiento y fleje).
   */
  fb: FormBuilder = inject(FormBuilder);
  /**
   * Formulario reactivo que captura los datos generales de la hoja de trabajo.
   */
  formHojaTrabajo: FormGroup = this.fb.group({
    requiereToma: [false, []],
    requiereTratamiento: [false, []],
    fleje: ['', [Validators.required]],
    detallesGroup: this.fb.array([]),
  });
  /**
   * Índice de la pestaña.
   */
  indice: number = 1;
  /**
   * Mensaje informativo mostrado cuando no es posible consultar automáticamente
   * los requisitos y se solicita al usuario apoyarse en la documentación anexada.
   */
  mensaje: string = `Por el momento no es posible consultar los requisitos. Para la revisión documental deberá apoyarse de los requisitos anexados por el solicitante o verificar en el módulo correspondiente.`;
  /**
   * Arreglo de suscripciones creadas en el componente.
   * Se utiliza para poder cancelarlas en ngOnDestroy y evitar fugas de memoria.
   */
  subscription: Subscription[] = [];
  /**
   * Query que permite observar el estado de la hoja de trabajo de agricultura.
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
  /**
   * Número de folio del trámite asociado a la hoja de trabajo.
   * Se recibe desde el componente padre.
   */
  @Input() numFolioTramite: string = '';
  /** numero de tramite */
  @Input() tramite: string = '0';

  /**
   * guarda las validaciones de las otras secciones
   */
  private validaciones: {
    remisionMuestra: boolean;
    ordenTratamiento: boolean;
  } = {
    remisionMuestra: false,
    ordenTratamiento: false,
  };
  /**
   * se almacenan los detalles
   */
  detallesHojaTrabajo: Detalle[] = [];
  /**
   * se almacena id de la hoja de trabajo
   */
  idHojaTrabajo: number = 0;

  /**
   * Solicita al backend la vista previa de la hoja de trabajo asociada
   * al trámite y folio indicados, y dispara la descarga del archivo generado.
   */
  visualizar(): void {
    this.subscription.push(
      this.hojaTrabajoService
        .visualizarHojaTrabajo(this.tramite, this.numFolioTramite)
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
   * recupera el elemento formArray del formgruop
   */
  get getDetallesGrupo(): FormArray {
    return this.formHojaTrabajo.get('detallesGroup') as FormArray;
  }

  /**
   * recupera el elemento formArray del formgruop
   */
  getDescripciones(i: number): FormArray {
    return this.getDetallesGrupo.at(i).get('descripciones') as FormArray;
  }

  /**
   * Validacion de forms
   * @param controlName
   */
  isInvalid(controlName: string): boolean {
    const CONTROL: AbstractControl | null =
      this.formHojaTrabajo.get(controlName);
    return CONTROL ? CONTROL.invalid && CONTROL.touched : false;
  }

  /**
   * Agrupa los requisitos pra acumplir con estructura
   * @params data
   */
  static agruparRequisitos(data: Detalle[]): Agrupado[] {
    const MAPA = new Map<string, Agrupado>();

    data.forEach((item) => {
      const KEY = `${item.cve_seccion}|${item.requisitos}`;

      if (!MAPA.has(KEY)) {
        MAPA.set(KEY, {
          id_mercancia: item.id_mercancia,
          cve_seccion: item.cve_seccion,
          id_restriccion_tipo_tramite: item.id_restriccion_tipo_tramite,
          descripcion_restriccion: item.descripcion_restriccion,
          requisitos: item.requisitos,
          descripciones: [],
        });
      }

      MAPA.get(KEY)!.descripciones.push({
        numero_requisito: item.numero_requisito,
        descripcion_requisito: item.descripcion_requisito,
        aplica_entrega_documentos: null,
      });
    });

    return Array.from(MAPA.values());
  }

  /**
   * Crea el segmento del formulario para descripciones
   * @params desc
   */
  crearDescripcion(desc: {
    numero_requisito: number;
    descripcion_requisito: string;
    aplica_entrega_documentos: number | null;
  }): FormGroup {
    return this.fb.group({
      numero_requisito: [desc.numero_requisito],
      descripcion_requisito: [desc.descripcion_requisito],
      aplica_entrega_documentos: [desc.aplica_entrega_documentos],
    });
  }

  /**
   * Crea el segmento de secciones
   * @params secdata
   */
  crearSeccion(sec: Agrupado): FormGroup {
    return this.fb.group({
      id_mercancia: [sec.id_mercancia],
      cve_seccion: [sec.cve_seccion],
      id_restriccion_tipo_tramite: [sec.id_restriccion_tipo_tramite],
      descripcion_restriccion: [sec.descripcion_restriccion],
      requisitos: [sec.requisitos],
      descripciones: this.fb.array([]),
    });
  }

  /**
   * Genera el array form
   * @params data
   */
  cargarDatos(data: Agrupado[]): void {
    this.getDetallesGrupo.clear();

    data.forEach((seccion: Agrupado) => {
      const DETALLESGRUPO = this.crearSeccion(seccion);

      const DESCRIPCIONESFA = DETALLESGRUPO.get('descripciones') as FormArray;

      seccion.descripciones.forEach((d) => {
        DESCRIPCIONESFA.push(this.crearDescripcion(d));
      });

      this.getDetallesGrupo.push(DETALLESGRUPO);
    });
  }

  /**
   * aplica respuesta seleccionada
   * @params data
   */
  aplicaRespuesta(respuesta: number, numeroRequisito: number): void {
    const INDEX: number = this.detallesHojaTrabajo.findIndex(
      (f) => f.numero_requisito === numeroRequisito
    );
    if (INDEX !== -1) {
      this.detallesHojaTrabajo[INDEX].aplica_entrega_documentos = respuesta;
    }
  }

  /**
   * - Carga en el formulario los datos existentes de la hoja de trabajo desde el store.
   * - Sincroniza los cambios del formulario hacia el store y actualiza
   *   el estado de validación correspondiente.
   */
  ngOnInit(): void {
    this.hojaTrabajoAgriculturaQuery.selectHojaTrabajo$
      .pipe(take(1))
      .subscribe((next) => {
        this.idHojaTrabajo = next.id_hoja_trabajo;
        this.formHojaTrabajo.patchValue(
          {
            requiereToma: next.requiere_toma_muestra,
            requiereTratamiento: next.requiere_tratamiento,
            fleje: next.numero_fleje,
          },
          { emitEvent: false }
        );
        this.validaciones = {
          remisionMuestra: next.validaciones.remisionMuestra,
          ordenTratamiento: next.validaciones.ordenTratamiento,
        };
        this.detallesHojaTrabajo = next.detalles;
        const AGRUPADO: Agrupado[] = HojaTrabajoComponent.agruparRequisitos(
          next.detalles
        );
        this.cargarDatos(AGRUPADO);
      });

    this.formHojaTrabajo.valueChanges
      .pipe(debounceTime(200), distinctUntilChanged())
      .subscribe((next) => {
        this.hojaTrabajoAgriculturaStore.setParteDatosHojaTrabajo({
          requiere_tratamiento: next.requiereTratamiento,
          requiere_toma_muestra: next.requiereToma,
          numero_fleje: next.fleje,
        });
        this.hojaTrabajoAgriculturaStore.setVaidaciones({
          hojaTrabajo: this.formHojaTrabajo.valid,
          remisionMuestra: this.validaciones.remisionMuestra,
          ordenTratamiento: this.validaciones.ordenTratamiento,
        });
        this.formHojaTrabajo.markAllAsTouched();
        Object.keys(this.formHojaTrabajo.controls).forEach((key) =>
          this.formHojaTrabajo.get(key)?.markAsDirty()
        );
      });
  }

  /**
   * - Cancela todas las suscripciones creadas en ngOnInit.
   * */
  ngOnDestroy(): void {
    const DATAFORM = this.formHojaTrabajo.getRawValue();
    this.hojaTrabajoAgriculturaStore.setParteDatosHojaTrabajo({
      requiere_tratamiento: DATAFORM.requiereTratamiento,
      requiere_toma_muestra: DATAFORM.requiereToma,
      numero_fleje: DATAFORM.fleje,
    });
    this.hojaTrabajoAgriculturaStore.setVaidaciones({
      hojaTrabajo: this.formHojaTrabajo.valid,
      remisionMuestra: this.validaciones.remisionMuestra,
      ordenTratamiento: this.validaciones.ordenTratamiento,
    });
    this.hojaTrabajoAgriculturaStore.setDetalles(this.detallesHojaTrabajo);

    this.subscription.forEach((sub) => sub.unsubscribe());
  }
}
