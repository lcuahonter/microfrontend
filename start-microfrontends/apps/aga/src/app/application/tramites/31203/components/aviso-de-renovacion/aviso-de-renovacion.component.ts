import { AvisoValor, FECHA_DE_PAGO,PreOperativo } from '../../models/aviso.model';
import { Catalogo, CatalogoSelectComponent, CatalogosSelect, ConsultaioQuery, ConsultaioState, InputCheckComponent, InputFecha, InputFechaComponent, InputRadioComponent, TituloComponent } from '@ng-mf/data-access-user';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,ReactiveFormsModule } from '@angular/forms';
import { Subject, map,takeUntil } from 'rxjs';
import { UnicoState,UnicoStore } from '../../estados/renovacion.store';
import { AvisoUnicoService } from '../../services/aviso-unico.service';
import { CommonModule } from '@angular/common';
import { UnicoQuery } from '../../estados/queries/unico.query';

/**
 * Componente que representa el aviso de renovación.
 * Este componente es responsable de inicializar el formulario, cargar datos desde servicios y manejar el estado de la aplicación.
 */
@Component({
  selector: 'app-aviso-de-renovacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TituloComponent, InputFechaComponent, CatalogoSelectComponent, InputRadioComponent, InputCheckComponent],
  templateUrl: './aviso-de-renovacion.component.html',
  styleUrls: ['./aviso-de-renovacion.component.scss'],
})
export class AvisoDeRenovacionComponent implements OnInit, OnDestroy {
  /**
   * Indica si el formulario es de solo lectura.
   * Si es verdadero, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;
  /**
   * Fecha inicial para el campo de fecha.
   */
  fechaInicioInput: InputFecha = FECHA_DE_PAGO;

  /**
   * Lista de localidades obtenidas desde el servicio.
   */
  public localidadList!: Catalogo[];

  /**
   * Observable para manejar la destrucción del componente.
   */
  private destroyed$ = new Subject<void>();

  /**
   * Opciones de tipo de persona obtenidas desde el servicio.
   */
  tipoPersonaOptions: PreOperativo[] = [];

  /**
   * Formulario reactivo para el aviso de renovación.
   */
  avisoForm!: FormGroup;

  /**
   * Estado actual de la solicitud.
   */
  public solicitudState!: UnicoState;

  /**
 * Notificador para destruir observables.
 */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
  * Subject para destruir notificador.
  */
  consultaDatos!: ConsultaioState;

  /**
* Configuración para el catálogo de bancos.
*/
  public bancoCatalogo: CatalogosSelect = {
    labelNombre: 'Banco',
    required: false,
    primerOpcion: 'Selecciona un valor',
    catalogos: [],
  };

  /**
   * Constructor del componente.
   * @param fb Constructor de formularios reactivos.
   * @param service Servicio para obtener datos relacionados con el aviso único.
   * @param unicoStore Almacén para manejar el estado de la aplicación.
   * @param unicoQuery Consultas para obtener el estado actual de la aplicación.
   */
  constructor(
    private fb: FormBuilder,
    private consultaioQuery: ConsultaioQuery,
    private service: AvisoUnicoService,
    private unicoStore: UnicoStore,
    private unicoQuery: UnicoQuery
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.esFormularioSoloLectura = this.consultaDatos.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe()
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * Configura el formulario, carga datos iniciales y suscribe al estado de la aplicación.
   */
  ngOnInit(): void {
    this.unicoQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
    this.donanteDomicilio()
    this.loadLocalidad();
    this.loadAsignacionData();
    this.cargarRadio();
  }

  /**
 * Inicializa el estado del formulario según si es de solo lectura o no.
 * Si es de solo lectura, guarda los datos del formulario; de lo contrario, inicializa el formulario con los datos del donante y domicilio.
 */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosDelFormulario();
    } else {
      this.datosDeAvisoForm()
    }
  }

  /**
   * Inicializa el formulario reactivo con valores predeterminados.
   */
  private donanteDomicilio(): void {
    this.avisoForm = this.fb.group({
      mapTipoTramite: [this.solicitudState?.mapTipoTramite],
      mapDeclaracionSolicitud: [this.solicitudState?.mapDeclaracionSolicitud],
      envioAviso: [this.solicitudState?.envioAviso],
      numeroAviso: [this.solicitudState?.numeroAviso],
      claveReferencia: [{ value: '', disabled: true }],
      numeroOperacion: [this.solicitudState?.numeroOperacion],
      cadenaDependencia: [{ value: '', disabled: true }],
      banco: [this.solicitudState?.banco],
      llavePago: [this.solicitudState?.llavePago],
      fechaPago: [this.solicitudState?.fechaPago],
      importePago: [{ value: '', disabled: true }],
    });
    this.inicializarEstadoFormulario();
  }

  /**
   * Carga datos de asignación desde el servicio y actualiza el formulario.
   */
  loadAsignacionData(): void {
    this.service.getSolicitante()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data: AvisoValor) => {
        this.avisoForm.patchValue({
          claveReferencia: data.claveReferencia,
          cadenaDependencia: data.cadenaDependencia,
          importePago: data.importePago,
        });

      });
  }

  /**
   * Carga la lista de localidades desde el servicio.
   */
  loadLocalidad(): void {
    this.service.obtenerDatosLocalidad()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data): void => {
        this.localidadList = data as Catalogo[];
      });
  }

  /**
   * Carga las opciones de tipo de persona desde el servicio.
   */
  cargarRadio(): void {
    this.service.obtenerRadio()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((resp) => {
        this.tipoPersonaOptions = resp;
      });
  }

  /**
   * Maneja el cambio de valor en el campo de fecha.
   * @param nuevo_valor Nuevo valor de la fecha.
   */
  public onFechaCambiada(nuevo_valor: string): void {
    this.avisoForm.get('fechaPago')?.setValue(nuevo_valor);
    this.avisoForm.get('fechaPago')?.markAsUntouched();
    this.unicoStore.setfechaPago(nuevo_valor);
  }

  /**
   * Resetea los datos relacionados con el pago en el formulario.
   */
  resetPagoDatos(): void {
    this.avisoForm.patchValue({
      numeroOperacion: '',
      banco: '',
      llavePago: '',
      fechaPago: '',
    });
  }

/**
 * Habilita o deshabilita el formulario según el modo de solo lectura.
 * 
 * Si el formulario está en modo solo lectura (`esFormularioSoloLectura` es `true`), 
 * deshabilita todos los controles del formulario para evitar modificaciones.
 * Si no está en modo solo lectura, habilita todos los controles del formulario para permitir la edición.
 */
guardarDatosDelFormulario(): void {
  if (this.esFormularioSoloLectura) {
    this.avisoForm.disable();
  } else {
    this.avisoForm.enable();
  }
}

  /**
   * Establece valores en el almacén desde el formulario.
   * @param form Formulario reactivo.
   * @param campo Nombre del campo en el formulario.
   * @param metodoNombre Nombre del método en el almacén.
   */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof UnicoStore): void {
    const VALOR = form.get(campo)?.value;
    (this.unicoStore[metodoNombre] as (value: string) => void)(VALOR);
  }



  /**
   * datosDeltrimiteForm los campos del formulario si es de solo lectura.
   * Si el formulario es de solo lectura, deshabilita los campos del formulario de importador/exportador.
   */
  datosDeAvisoForm(): void {
    if (this.esFormularioSoloLectura && this.avisoForm) {
      this.avisoForm.get('mapTipoTramite')?.disable();
      this.avisoForm.get('cadenaDependencia');
      this.avisoForm.get('mapDeclaracionSolicitud')?.disable();
      this.avisoForm.get('envioAviso')?.disable();
      this.avisoForm.get('numeroAviso')?.disable();
      this.avisoForm.get('claveReferencia')?.disable();
      this.avisoForm.get('numeroOperacion')?.disable();
      this.avisoForm.get('correoEledctronico')?.disable();
      this.avisoForm.get('banco')?.disable();
      this.avisoForm.get('llavePago')?.disable();
      this.avisoForm.get('fechaPago')?.disable();
      this.avisoForm.get('importePago')?.disable();
    }

  }


  /**
   * Método que se ejecuta al destruir el componente.
   * Libera recursos y cancela suscripciones.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
