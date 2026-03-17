import { Component, Input, OnDestroy } from '@angular/core';
import { ConfiguracionColumna, InputFecha, InputFechaComponent, TablaDinamicaComponent, TituloComponent, ValidacionesFormularioService, formatearFechaCalendar } from '@libs/shared/data-access-user/src';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PRORROGAS_TABLA, ProrrogasForma, ProrrogasInfo } from '@libs/shared/data-access-user/src/core/models/130301/solicitud-prorroga.model';
import { Solicitud130301State, Tramite130301Store } from '../../../../estados/tramites/tramite130301.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { FECHA_DE_PAGO } from '../constantes/aviso-enum';
import { SolicitudProrrogaService } from '../../services/solicitudProrroga/solicitud-prorroga.service';
import { Tramite130301Query } from '../../../../estados/queries/tramite130301.query';


/**
 * Componente para gestionar las prorrogas del trámite.
 */
@Component({
  selector: 'app-prorrogas',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    InputFechaComponent,
    ReactiveFormsModule,
    TablaDinamicaComponent
  ],
  templateUrl: './prorrogas.component.html',
  styleUrl: './prorrogas.component.scss',
})
export class ProrrogasComponent implements OnDestroy {
  /**
   * Formulario reactivo para las prorrogas.
   */
  prorrogasForm!: FormGroup;

  @Input() soloDosPuntosRequeridos: boolean = false;

    /**
   * @property {boolean} formularioDeshabilitado - Indica si el formulario está deshabilitado.
   */
  @Input() public formularioDeshabilitado: boolean = false;
  
    /**
     * @property {InputFecha} fechaInicioInput
     * Objeto con la configuración de la fecha inicial del componente.
     */
    fechaInicioInput: InputFecha = FECHA_DE_PAGO;

  /**
   * Determina si el formulario debe estar en modo solo lectura.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Configuración de las columnas de la tabla de prorrogas.
   */
  prorrogasTabla: ConfiguracionColumna<ProrrogasInfo>[] = PRORROGAS_TABLA;

  /**
   * Datos de la tabla de prorrogas obtenidos del servicio.
   */
  prorrogasTablaDatos: ProrrogasInfo[] = [];

  /**
   * Notificador para destruir observables activos y evitar pérdidas de memoria.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Datos del formulario de prorrogas obtenidos del servicio.
   */
  prorrogasFormDatos: ProrrogasForma[] = [];

  /**
   * Estado actual de la solicitud.
   */
  public solicitudState!: Solicitud130301State;

  /**
   * Constructor del componente.
   * @param fb Constructor de formularios reactivos.
   * @param tramite130301Store Almacén de estado para el trámite 130301.
   * @param tramite130301Query Consulta de estado para el trámite 130301.
   * @param consultaioQuery Consulta de estado para la aplicación.
   * @param solicitudProrrogaService Servicio para obtener los datos de las prorrogas.
   * @param validacionesService Servicio para validar formularios.
   */
  constructor(
    private fb: FormBuilder,
    public tramite130301Store: Tramite130301Store,
    private tramite130301Query: Tramite130301Query,
    private consultaioQuery: ConsultaioQuery,
    private solicitudProrrogaService: SolicitudProrrogaService,
    private validacionesService: ValidacionesFormularioService,
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

    /**
   * Inicializa el formulario con datos del store y aplica validaciones.
   * También aplica configuración de solo lectura si es necesario.
   * @method inicializarEstadoFormulario
   */
    inicializarEstadoFormulario(): void {
      this.tramite130301Query
      .selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
      this.crearFormulario();
      if (this.esFormularioSoloLectura) {
        Object.keys(this.prorrogasForm.controls).forEach((key) => {
          this.prorrogasForm.get(key)?.disable();
        });
      } else {
        const CLAVES_AHABILITAR = ['prorrogaAl','motivoJustificacion', 'otrasDeclaraciones'];
        CLAVES_AHABILITAR.forEach((key) => {
          this.prorrogasForm.get(key)?.enable();
        });
      }
    }
  /**
   * Crea y configura un formulario reactivo para gestionar las prorrogas del trámite con campos deshabilitados y validaciones requeridas.
   */
  crearFormulario():void{
    this.prorrogasForm = this.fb.group({
      folioResolucion: [{ value: '', disabled: true }],
      cantidad: [{ value: '', disabled: true }],
      prorrogaDel: [{ value: '', disabled: true }],
      prorrogaAl: [{ value: '', disabled: true }, Validators.required],
      motivoJustificacion: [{ value: this.solicitudState?.motivoJustificacion, disabled: true }, Validators.required],
      otrasDeclaraciones: [{ value: this.solicitudState?.otrasDeclaraciones, disabled: true }, Validators.required],
    });
  }

  /**
   * Obtiene los datos del formulario de prorrogas desde el servicio.
   */
  obtenerFormDatos(): void {
    this.prorrogasForm.patchValue({
      folioResolucion: this.solicitudState?.folioPermiso,
      cantidad: this.solicitudState?.cantidad,
      prorrogaDel: this.solicitudState?.fechaInicioProrroga,
      prorrogaAl: this.solicitudState?.fechaFinProrroga
    });

    this.solicitudProrrogaService.obtenerProrrogaTablaDatos(this.solicitudState?.folioPermiso)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos) => {
        const DATOS = datos?.datos;
        this.prorrogasTablaDatos = DATOS.map((item) => ({
          ...item,
          fechaCreacion: formatearFechaCalendar(item.fechaCreacion),
          fechaInicio: formatearFechaCalendar(item.fechaInicio),
          fechaFin: formatearFechaCalendar(item.fechaFin),
        })) || [];
      });
  }

  /**
   * Método para validar el formulario.
   * @param form Formulario a validar.
   * @param field Campo a validar.
   * @returns {boolean} Regresa un booleano si el campo es válido o no.
   */
  esValida(form: FormGroup, field: string): boolean {
    return this.validacionesService.isValid(form, field) === true;
  }

  /**
   * Establece valores en el store del trámite.
   * @param form Formulario reactivo.
   * @param campo Nombre del campo en el formulario.
   * @param metodoNombre Nombre del método en el store.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite130301Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite130301Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * Libera los recursos y destruye los observables activos.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Marca todos los campos del formulario como tocados para mostrar errores de validación.
   */
  public markAllAsTouched(): void {
    if (this.prorrogasForm) {
      this.prorrogasForm.markAllAsTouched();
    }
  }

  /**
   * @method onFechaCambiada
   * @description Actualiza la fecha de pago en el formulario.
   *
   * @param {string} fecha - Fecha seleccionada en el componente `InputFecha`.
   */
  onFechaCambiada(fecha: string): void {
    this.prorrogasForm.patchValue({ fechaPago: fecha });
    this.prorrogasForm.get('fechaPago')?.markAsTouched();
    this.prorrogasForm.get('fechaPago')?.markAsDirty();
    // Use a valid method name from Tramite130301Store, for example 'setFechaPagoProrroga' if it exists
    this.setValoresStore(this.prorrogasForm, 'fechaPago', 'setFechaPago');
  }

    /**
   * Handler to update prorrogaAl form control when input-fecha changes
   */
  onProrrogaAlChange(value: string): void {
    this.prorrogasForm.get('prorrogaAl')?.setValue(value);
    this.prorrogasForm.get('prorrogaAl')?.markAsDirty();
    this.prorrogasForm.get('prorrogaAl')?.markAsTouched();
  }
}