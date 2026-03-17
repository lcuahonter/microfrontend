import { 
  Catalogo, 
  CatalogoSelectComponent, 
  CatalogosSelect, 
  InputFecha, 
  InputFechaComponent, 
  TituloComponent, 
  ValidacionesFormularioService 
} from "@libs/shared/data-access-user/src";
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReplaySubject, map, takeUntil } from 'rxjs';
import { Solicitud260704State, Tramite260704Store } from '../../estados/Tramite260704.store';
import { CommonModule } from '@angular/common';
import { ConsultaService } from '../../service/consulta.service';
import { FECHA_PAGO } from '../../models/consulta.model';
import { Tramite260704Query } from '../../estados/Tramite260704.query';

/**
 * Componente para gestionar el pago de derechos.
 *
 * Este componente se encarga de inicializar y manejar el formulario reactivo para el pago de derechos,
 * cargar los datos necesarios y actualizar el store de Tramite260704.
 */
@Component({
  selector: 'app-pago-de-derechos',
  standalone: true,
  imports: [CommonModule, CatalogoSelectComponent, TituloComponent, InputFechaComponent, ReactiveFormsModule],
  templateUrl: './pago-de-derechos.component.html',
  styleUrls: ['./pago-de-derechos.component.css'],
})
export class PagoDeDerechosComponent implements OnInit, OnDestroy {
/**
   * Subject para destruir notificador.
   */
  consultaDatos!: ConsultaioState;
   /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  soloLectura: boolean = false;
  /**
   * Estado actual de la solicitud.
   */
  public solicitudState!: Solicitud260704State;

  /**
   * Subject para gestionar la destrucción del componente y evitar fugas de memoria.
   */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /**
   * Configuración de la fecha de pago.
   */
  fechaPagoInput: InputFecha = FECHA_PAGO;

  /**
   * Formulario reactivo para el pago de derechos.
   */
  pagoDeDerechosForm!: FormGroup;

  /**
   * Catálogo de bancos utilizado en el formulario.
   */
  public bancoCatalogo: CatalogosSelect = {
    labelNombre: 'Banco',
    required: false,
    primerOpcion: 'Selecciona un valor',
    catalogos: [],
  };

  /**
   * Constructor que inyecta los servicios necesarios.
   * @param consulta Servicio para realizar consultas.
   * @param store Store para actualizar el estado de Tramite260704.
   * @param query Consulta para obtener el estado de Tramite260704.
   * @param fb FormBuilder para construir formularios reactivos.
   * @param validacionesService Servicio para validaciones de formularios.
   */
  constructor(
    private consulta: ConsultaService,
    public store: Tramite260704Store,
    private query: Tramite260704Query,
    public fb: FormBuilder,
    private validacionesService: ValidacionesFormularioService,
    private consultaioQuery: ConsultaioQuery
  ) { 
   this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.soloLectura = this.consultaDatos.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe()
  }

  /**
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   *
   * Se suscribe al estado de la solicitud, inicializa el formulario y carga los datos del catálogo de bancos.
   */
  ngOnInit(): void {
     this.donanteDomicilio();
    this.query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
   
    this.obtenerDatosBanco();
    this.inicializarEstadoFormulario();
  }
/**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   * Además, obtiene la información del catálogo de mercancía.
   */
  inicializarEstadoFormulario(): void {
    if (this.soloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.donanteDomicilio();
    }
  }
  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.donanteDomicilio();
    if (this.soloLectura) {
      this.pagoDeDerechosForm.disable();
    } else {
      this.pagoDeDerechosForm.enable();
    }
  }
  /**
   * Obtiene los datos del catálogo de bancos a través del servicio de consulta.
   */
  obtenerDatosBanco(): void {
    this.consulta
      .obtenerDatosBanco()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((resp): void => {
        this.bancoCatalogo.catalogos = resp as Catalogo[];
      });
  }

  /**
   * Actualiza la fecha de pago en el formulario y en el store.
   * @param nuevo_fechaPago Nueva fecha de pago en formato string.
   */
  cambioFechaPago(nuevo_fechaPago: string): void {
    this.pagoDeDerechosForm.patchValue({
      fechaPago: nuevo_fechaPago,
    });
    this.setValoresStore(this.pagoDeDerechosForm, 'fechaPago', 'setFechaPago');
  }

  /**
   * Valida si un campo específico del formulario es válido.
   * @param form Formulario a validar.
   * @param field Nombre del campo.
   * @returns True si el campo es válido; de lo contrario, false.
   */
  isValid(form: FormGroup, field: string): boolean {
    return this.validacionesService.isValid(form, field) || false;
  }

  /**
   * Establece un valor en el store llamando al método correspondiente.
   * @param form Formulario del cual se extrae el valor.
   * @param campo Nombre del campo cuyo valor se quiere obtener.
   * @param metodoNombre Nombre del método del store que se debe llamar.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite260704Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Inicializa el formulario 'pagoDeDerechosForm' con sus controles y validaciones.
   *
   * Utiliza el estado actual de la solicitud para inicializar los valores del formulario.
   */
  donanteDomicilio(): void {
  this.pagoDeDerechosForm = this.fb.group({
    claveDeReferencia: [{ value: this.solicitudState?.claveDeReferencia, disabled: this.soloLectura }, [Validators.required]],
    cadenaDependecia: [{ value: this.solicitudState?.cadenaDependecia, disabled: this.soloLectura }, [Validators.required]],
    fechaPago: [{ value: this.solicitudState?.fechaPago, disabled: this.soloLectura }, [Validators.required]],
    banco: [{ value: this.solicitudState?.banco, disabled: this.soloLectura }, [Validators.required]],
    liaveDePago: [{ value: this.solicitudState?.claveDeReferencia, disabled: this.soloLectura }, [Validators.required]],
    importeDePago: [{ value: this.solicitudState?.importeDePago, disabled: this.soloLectura }, [Validators.required]],
  });
}
  /**
   * Método del ciclo de vida que se ejecuta al destruir el componente.
   *
   * Emite la señal de destrucción para cancelar suscripciones y evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
