import { Component, Input, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HojaTrabajoAgriculturaQuery } from '../../../../shared/queries/hoja-trabajo-agricultura.query';
import { HojaTrabajoAgriculturaStore } from '../../../../shared/estados/hoja-trabajo-agricultura.store';
import { HojaTrabajoService } from '../../services/220202/hoja-trabajo/hoja-trabajo.service';
import { ResponseHojaTrabajoModel } from '../../../../core/models/hoja-trabajo/response-hoja-trabajo.model';
import { Subscription } from 'rxjs';
import { TituloComponent } from '@ng-mf/data-access-user';
import { TooltipDirective } from 'ngx-bootstrap/tooltip';
import { ErrorRequeridoComponent } from '../../shared/error-requerido/error-requerido.component';

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
export class HojaTrabajoComponent implements OnInit {
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
  private validaciones: {
    remisionMuestra: boolean;
    ordenTratamiento: boolean;
  } = {
    remisionMuestra: false,
    ordenTratamiento: false,
  };

  /**
   * Solicita al backend la vista previa de la hoja de trabajo asociada
   * al trámite y folio indicados, y dispara la descarga del archivo generado.
   */
  visualizar(): void {
    this.subscription.push(
      this.hojaTrabajoService
        .visualizarHojaTrabajo('220202', this.numFolioTramite)
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
   * - Carga en el formulario los datos existentes de la hoja de trabajo desde el store.
   * - Sincroniza los cambios del formulario hacia el store y actualiza
   *   el estado de validación correspondiente.
   */
  ngOnInit(): void {
    this.hojaTrabajoAgriculturaQuery.selectHojaTrabajo$.subscribe((next) => {
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
    });
    this.formHojaTrabajo.valueChanges.subscribe((next) => {
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
   * Validacion de forms
   * @param controlName
   */
  isInvalid(controlName: string): boolean {
    const CONTROL: AbstractControl = this.formHojaTrabajo.get(controlName)!;
    return CONTROL ? CONTROL.invalid && CONTROL.touched : false;
  }
}
