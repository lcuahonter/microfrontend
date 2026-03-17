import { Catalogo } from '@libs/shared/data-access-user/src';
import {ConsultaioQuery} from '@ng-mf/data-access-user';
import {map} from 'rxjs'; 

import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src';

import { CatalogosSelect } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Domicilios } from '../../models/solicitud.model';
import { EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { InputRadio } from '../../models/solicitud.model';
import { InputRadioComponent } from '@libs/shared/data-access-user/src';

import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SolicitudCatologoSelectLista } from '../../models/solicitud.model';
import { SolicitudQuery } from '../../estados/solicitud.query';
import { SolicitudRadioLista } from '../../models/solicitud.model';

import { SolicitudState, SolicitudStore } from '../../estados/solicitud.store';
import { SolicitudeService } from '../../services/solicitude.service';
import { Subject } from 'rxjs';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import { Validators } from '@angular/forms';
import { takeUntil } from 'rxjs';


/**
 * Componente para manejar las instalaciones principales.
 * Se encarga de gestionar el formulario de las instalaciones principales y emitir los cambios.
 */
@Component({
  selector: 'app-instalaciones-principales',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CatalogoSelectComponent,
    TituloComponent,
    InputRadioComponent,
  ],
  templateUrl: './instalaciones-principales.component.html',
  
})
/**
 * Componente para manejar las instalaciones principales.
 * Se encarga de gestionar el formulario de las instalaciones principales y emitir los cambios.
 */
export class InstalacionesPrincipalesComponent implements OnInit, OnDestroy {
  /**
   * Formulario reactivo para las instalaciones principales.
   * Contiene los campos necesarios para almacenar la información de las instalaciones.
   */
  instalacionesPrincipalesForm!: FormGroup;

  /**
   * Subject para manejar el ciclo de vida del componente y evitar fugas de memoria.
   */
  private destroy$: Subject<void> = new Subject<void>();

  /**
   * Opción seleccionada en los radio buttons (sino opción).
   * Esta variable contiene la respuesta de los requisitos en el formulario.
   */
  sinoOpcion: InputRadio = {} as InputRadio;

  /**
   * Catálogo de tipos de instalación.
   * Se utiliza para la selección del tipo de instalación en el formulario.
   */
  tipoDeInstalacion: CatalogosSelect = {} as CatalogosSelect;

  /**
   * Estado de la solicitud.
   * Se utiliza para obtener y gestionar el estado actual de la solicitud en el formulario.
   */
  SolicitudState: SolicitudState = {} as SolicitudState;

  /**
   * Emisor de eventos para emitir los datos de las instalaciones principales.
   * Se utiliza para enviar la información del formulario cuando se acepta.
   */
  @Output() instalacionesPrincipales = new EventEmitter<Domicilios>();

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Constructor del componente.
   * Se inicializan los servicios necesarios para obtener las opciones del formulario.
   */
  constructor(
    private fb: FormBuilder,
    private solicitudService: SolicitudeService,
    private solicitudStore: SolicitudStore,
    private SolicitudQuery: SolicitudQuery,
    private consultaioQuery: ConsultaioQuery
  ) {
    /**
     * Se suscribe al estado de `Consultaio` para obtener información actualizada del estado del formulario.
     *
     * - Asigna el valor de solo lectura (`readonly`) a la propiedad `esFormularioSoloLectura`.
     * - Llama a `inicializarEstadoFormulario()` para aplicar configuraciones basadas en el estado recibido.
     * - La suscripción se cancela automáticamente cuando `destroyNotifier$` emite un valor (para evitar fugas de memoria).
     */
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
    this.conseguirOpcionDeRadio();
    this.conseguirSolicitudCatologoSelectLista();
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * Inicializa el formulario con los valores actuales del estado de la solicitud.
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
  }

  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario(); // Llama al método para cargar los datos del formulario
    } else {
      this.inicializarFormulario();
    }
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.instalacionesPrincipalesForm.disable();
    } else {
      this.instalacionesPrincipalesForm.enable();
    } 
  }

  /**
   * Inicializa el formulario `instalacionesPrincipalesForm` con los datos del estado actual `SolicitudState`.
   *
   * Este formulario recopila información sobre las instalaciones principales de la empresa, incluyendo:
   * - Ubicación geográfica (municipio, entidad federativa, código postal).
   * - Detalles del inmueble y su uso (proceso productivo, tipo de instalación, goce del inmueble).
   * - Datos comerciales y fiscales (registro SESAT, comercio exterior, empresa, mutuo).
   *
   * Algunos campos son obligatorios y tienen la validación `Validators.required`.
   *
   * El método también se suscribe al observable `selectSolicitud$` para mantener los valores del formulario
   * actualizados con el estado global. La suscripción se cancela automáticamente mediante `takeUntil`
   * para evitar fugas de memoria.
   */
  inicializarFormulario(): void {
    this.instalacionesPrincipalesForm = this.fb.group({
      principales: [
        this.SolicitudState.principales,
        [Validators.required],
      ],
      municipio: [this.SolicitudState.municipio],
      tipoDeInstalacion: [
        this.SolicitudState.tipoDeInstalacion,
        [Validators.required],
      ],
      entidadFederativa: [this.SolicitudState.entidadFederativa],
      registroSESAT: [this.SolicitudState.entidadFederativa],
      descripcion: [this.SolicitudState.descripcion],
      codigoPostal: [this.SolicitudState.codigoPostal],
      procesoProductivo: [
        this.SolicitudState.procesoProductivo,
        [Validators.required],
      ],
      goceDelInmueble: [
        this.SolicitudState.goceDelInmueble,
        [Validators.required],
      ],
      empresa: [this.SolicitudState.empresa],
      comercioExterior: [
        this.SolicitudState.comercioExterior,
        [Validators.required],
      ],
      mutuo: [this.SolicitudState.mutuo, [Validators.required]],
    });

    this.SolicitudQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroy$),
        map((respuesta: SolicitudState) => {
          this.SolicitudState = respuesta;
          this.instalacionesPrincipalesForm.patchValue({
            principales: this.SolicitudState.principales,
            municipio: this.SolicitudState.municipio,
            tipoDeInstalacion: this.SolicitudState.tipoDeInstalacion,
            entidadFederativa: this.SolicitudState.entidadFederativa,
            registroSESAT: this.SolicitudState.registroSESAT,
            descripcion: this.SolicitudState.descripcion,
            codigoPostal: this.SolicitudState.codigoPostal,
            procesoProductivo: this.SolicitudState.procesoProductivo,
            goceDelInmueble: this.SolicitudState.goceDelInmueble,
            empresa: this.SolicitudState.empresa,
            comercioExterior: this.SolicitudState.comercioExterior,
            mutuo: this.SolicitudState.mutuo,
          });
        })
      )
      .subscribe();
  }

  /**
   * Obtiene las opciones de los requisitos a partir del servicio.
   * Se suscribe a la respuesta para asignar el valor a `sinoOpcion`.
   */
  conseguirOpcionDeRadio(): void {
    this.solicitudService
      .conseguirOpcionDeRadio()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (respuesta: SolicitudRadioLista) => {
          this.sinoOpcion = respuesta.requisitos;
        },
      });
  }

  /**
   * Obtiene la lista de catálogos de selección para los tipos de instalación.
   * Se suscribe a la respuesta y asigna el valor a `tipoDeInstalacion`.
   */
  conseguirSolicitudCatologoSelectLista(): void {
    this.solicitudService
      .conseguirSolicitudCatologoSelectLista()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (respuesta: SolicitudCatologoSelectLista) => {
          this.tipoDeInstalacion = respuesta.tipoDeInstalacion;
        },
      });
  }

  /**
   * Actualiza el valor de "principales" en el estado de la solicitud.
   * Se utiliza para reflejar el cambio en el formulario.
   */
  actualizarPrincipales(valor: string | number): void {
    this.solicitudStore.actualizarPrincipales(valor);
  }

  /**
   * Actualiza el valor del municipio en el estado de la solicitud.
   * Se obtiene el valor del campo de entrada y se actualiza el estado.
   */
  actualizarMunicipio(valor: Event): void {
    const VALOR = (valor.target as HTMLInputElement).value;
    this.solicitudStore.actualizarMunicipio(VALOR);
  }

  /**
   * Actualiza el valor del tipo de instalación en el estado de la solicitud.
   * Se utiliza para reflejar el cambio en el formulario.
   */
  actualizarTipoDeInstalacion(evento: Catalogo): void {
    this.solicitudStore.actualizarTipoDeInstalacion(evento.id);
  }

  /**
   * Actualiza el valor de la entidad federativa en el estado de la solicitud.
   * Se obtiene el valor del campo de entrada y se actualiza el estado.
   */
  actualizarEntidadFederativa(valor: Event): void {
    const VALOR = (valor.target as HTMLInputElement).value;
    this.solicitudStore.actualizarEntidadFederativa(VALOR);
  }

  /**
   * Actualiza el valor del registro SESAT en el estado de la solicitud.
   * Se obtiene el valor del campo de entrada y se actualiza el estado.
   */
  actualizarRegistroSESAT(valor: Event): void {
    const VALOR = (valor.target as HTMLInputElement).value;
    this.solicitudStore.actualizarRegistroSESAT(VALOR);
  }

  /**
   * Actualiza el valor de la descripción en el estado de la solicitud.
   * Se obtiene el valor del campo de entrada y se actualiza el estado.
   */
  actualizarDescripcion(valor: Event): void {
    const VALOR = (valor.target as HTMLInputElement).value;
    this.solicitudStore.actualizarDescripcion(VALOR);
  }

  /**
   * Actualiza el valor del código postal en el estado de la solicitud.
   * Se obtiene el valor del campo de entrada y se actualiza el estado.
   */
  actualizarCodigoPostal(valor: Event): void {
    const VALOR = (valor.target as HTMLInputElement).value;
    this.solicitudStore.actualizarCodigoPostal(VALOR);
  }

  /**
   * Actualiza el valor del proceso productivo en el estado de la solicitud.
   * Se utiliza para reflejar el cambio en el formulario.
   */
  actualizarProcesoProductivo(valor: string | number): void {
    this.solicitudStore.actualizarProcesoProductivo(valor);
  }

  /**
   * Actualiza el valor del goce del inmueble en el estado de la solicitud.
   * Se utiliza para reflejar el cambio en el formulario.
   */
  actualizarGoceDelInmueble(valor: string | number): void {
    this.solicitudStore.actualizarGoceDelInmueble(valor);
  }

  /**
   * Actualiza el valor de la empresa en el estado de la solicitud.
   * Se utiliza para reflejar el cambio en el formulario.
   */
  actualizarEmpresa(valor: string | number): void {
    this.solicitudStore.actualizarEmpresa(valor);
  }

  /**
   * Actualiza el valor del comercio exterior en el estado de la solicitud.
   * Se utiliza para reflejar el cambio en el formulario.
   */
  actualizarComercioExterior(valor: string | number): void {
    this.solicitudStore.actualizarComercioExterior(valor);
  }

  /**
   * Actualiza el valor del mutuo en el estado de la solicitud.
   * Se utiliza para reflejar el cambio en el formulario.
   */
  actualizarMutuo(valor: string | number): void {
    this.solicitudStore.actualizarMutuo(valor);
  }

  /**
   * Emitir los datos de las instalaciones principales.
   * Se construye un objeto con los valores del formulario y se emite al componente padre.
   */
  aceptarInstalacionesPrincipales(): void {
    const OBJETO_JSON: Domicilios = {
      instalacionPrincipal:
        this.instalacionesPrincipalesForm.get('principales')?.value,
      tipoInstalacion:
        this.instalacionesPrincipalesForm.get('tipoDeInstalacion')?.value,
      entidadFederativa:
        this.instalacionesPrincipalesForm.get('entidadFederativa')?.value,
      municipioDelegacion:
        this.instalacionesPrincipalesForm.get('municipio')?.value,
      direccion: this.instalacionesPrincipalesForm.get('descripcion')?.value,
      codigoPostal:
        this.instalacionesPrincipalesForm.get('codigoPostal')?.value,
      registroSESAT:
        this.instalacionesPrincipalesForm.get('registroSESAT')?.value,
      procesoProductivo:
        this.instalacionesPrincipalesForm.get('procesoProductivo')?.value,
      acreditaInmueble:
        this.instalacionesPrincipalesForm.get('goceDelInmueble')?.value,
      operacionesCExt:
        this.instalacionesPrincipalesForm.get('comercioExterior')?.value,
      instalacionCtpat: '',
      instalacionPerfil: '',
      instalacionPerfilRFE: '',
      instalacionPerfilAuto: '',
      instalacionPerfilFerro: '',
      instalacionPerfilRf: '',
      instalacionPerfilMensajeria: '',
    };

    this.instalacionesPrincipales.emit(OBJETO_JSON);
  }

  /**
   * Método que se ejecuta cuando el componente se destruye.
   * Limpia el observable `destroy$` para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
