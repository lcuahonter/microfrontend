import {
  Catalogo,
  CatalogoSelectComponent,
  REG_X,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, Subscription, map, takeUntil } from 'rxjs';
import { CancelacionesQuery } from '../../estados/cancelaciones.query';
import { CancelacionesService } from '../../services/cancelaciones.service';
import { CancelacionesStore } from '../../estados/cancelaciones.store';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

/**
 * Componente DireccionDeNotificacionesComponent
 *
 * Este componente es responsable de manejar el formulario de notificación de domicilio
 * para el trámite 140201. Permite la actualización de los datos de entidad federativa,
 * colonia, localidad, municipio, país, número interior, código postal y teléfono.
 */
@Component({
  selector: 'app-direccion-de-notificaciones',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    ReactiveFormsModule,
    CatalogoSelectComponent,
  ],
  templateUrl: './direccion-de-notificaciones.component.html',
  styleUrl: './direccion-de-notificaciones.component.scss',
})
/***
 *  DireccionDeNotificacionesComponent */
export class DireccionDeNotificacionesComponent implements OnInit, OnDestroy {
  /**
   * Observable para la entidad federativa
   */
  entidadFederativa$ = this.cancelacionesQuery.entidadFederativa$;
  /**
   * Observable para la colonia
   */
  colonia$ = this.cancelacionesQuery.colonia$;
  /**
   * Observable para la localidad
   */
  localidad$ = this.cancelacionesQuery.localidad$;
  /**
   * Observable para el municipio
   */
  municipio$ = this.cancelacionesQuery.municipio$;
  /**
   * Observable para el país
   */
  paisInput$ = this.cancelacionesQuery.paisInput$;
  /**
   * Observable para el número interior
   */
  numeroInterior$ = this.cancelacionesQuery.numeroInterior$;
  /**
   * Observable para el código postal
   */
  codigoPostal$ = this.cancelacionesQuery.codigoPostal$;
  /**
   * Observable para el telefono
   */
  telefono$ = this.cancelacionesQuery.telefono$;

  /**
   * Formulario reactivo para la notificación de domicilio
   */
  direccionNotificacionesForm!: FormGroup;
  /**
   * Subject para manejar la destrucción de las suscripciones
   */
  private destroy$ = new Subject<void>();
  /**
   * Lista de entidades federativas
   */
  entidadFederativa: Catalogo[] = [];
  /**
   * Lista de colonias
   */
  colonia: Catalogo[] = [];
  /**
   * Lista de localidades
   */
  localidad: Catalogo[] = [];
  /**
   * Lista de municipios o alcaldías
   */
  municipioAlcaldia: Catalogo[] = [];

  /**
    * Suscripción a los cambios en el formulario react
    */
  private subscription: Subscription = new Subscription();

  /**
 * Indica si el formulario está en modo solo lectura.
 * Cuando es `true`, los campos del formulario no se pueden editar.
 */
  esFormularioSoloLectura: boolean = false;

  /**
   * Constructor */
  constructor(
    private fb: FormBuilder,
    private cancelacionService: CancelacionesService,
    private cancelacionesStore: CancelacionesStore,
    private cancelacionesQuery: CancelacionesQuery,
    private consultaioQuery: ConsultaioQuery
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe()
  }

  /**
   * Método ngOnInit
   *
   * Inicializa el formulario y carga la información de entidad, colonia, municipio y localidad.
   */
  ngOnInit(): void {
    this.loadInfo();
    this.loadEntidad();
    this.loadColonia();
    this.loadMunicipiosOalcaldia();
    this.loadLocalidad();
    this.direccionNotificacionesForm = this.fb.group({
      entidadFederativa: ['', [Validators.required]],
      calle: [{ value: '', disabled: true }],
      numeroExterior: [{ value: '', disabled: true }],
      numeroInterior: [null],
      codigoPostal: [
        '',
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.pattern(REG_X.SOLO_NUMEROS),
        ],
      ],
      pais: [null],
      municipioAlcaldia: [null],
      colonia: [null],
      telefono: ['', [Validators.maxLength(15)]],
      localidad: [null],
    });
    this.inicializarEstadoFormulario();
  }
  /**
 * Evalúa si se debe inicializar o cargar datos en el formulario.  
 * Además, obtiene la información del catálogo de mercancía.
 */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.estadoActualizacion();
    }
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.estadoActualizacion();
    if (this.direccionNotificacionesForm && this.esFormularioSoloLectura) {
      this.direccionNotificacionesForm.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.direccionNotificacionesForm.enable();
    } 
  }
  /**
   * Método estadoActualizacion
   *
   * Actualiza el estado del formulario suscribiéndose a los observables de entidad federativa,
   * colonia, localidad, municipio, país, número interior, código postal y teléfono.
   */
  estadoActualizacion(): void {
    this.entidadFederativa$
      .pipe(takeUntil(this.destroy$))
      .subscribe((entidadFederativa) => {
        if (entidadFederativa) {
          this.direccionNotificacionesForm?.get('entidadFederativa')?.setValue(entidadFederativa);
        }
      });
    this.colonia$.pipe(takeUntil(this.destroy$)).subscribe((colonia) => {
      if (colonia) {
        this.direccionNotificacionesForm?.get('colonia')?.setValue(colonia);
      }
    });
    this.localidad$.pipe(takeUntil(this.destroy$)).subscribe((localidad) => {
      if (localidad) {
        this.direccionNotificacionesForm?.get('localidad')?.setValue(localidad);
      }
    });

    this.municipio$.pipe(takeUntil(this.destroy$)).subscribe((municipio) => {
      if (municipio) {
        this.direccionNotificacionesForm?.get('municipioAlcaldia')?.setValue(municipio);
      }
    });
    this.paisInput$.pipe(takeUntil(this.destroy$)).subscribe((pais) => {
      if (pais) {
        this.direccionNotificacionesForm?.get('pais')?.setValue(pais);
      }
    });
    this.numeroInterior$
      .pipe(takeUntil(this.destroy$))
      .subscribe((numeroInterior) => {
        if (numeroInterior) {
          this.direccionNotificacionesForm?.get('numeroInterior')
            ?.setValue(numeroInterior);
        }
      });
    this.codigoPostal$
      .pipe(takeUntil(this.destroy$))
      .subscribe((codigoPostal) => {
        if (codigoPostal) {
          this.direccionNotificacionesForm?.get('codigoPostal')?.setValue(codigoPostal);
        }
      });
    this.telefono$.pipe(takeUntil(this.destroy$)).subscribe((telefono) => {
      if (telefono) {
        this.direccionNotificacionesForm?.get('telefono')?.setValue(telefono);
      }
    });
  }

  /**
   * Método loadEntidad
   *
   * Carga la información de las entidades federativas desde el servicio.
   */
  loadEntidad(): void {
    this.cancelacionService
      .getEntidades()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: Catalogo[]) => {
        this.entidadFederativa = data;
      });
  }

  /**
   * Método loadColonia
   *
   * Carga la información de las colonias desde el servicio.
   */
  loadColonia(): void {
    this.cancelacionService
      .getColonia()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.colonia = data;
      });
  }

  /**
   * Método loadMunicipiosOalcaldia
   *
   * Carga la información de los municipios o alcaldías desde el servicio.
   */
  loadMunicipiosOalcaldia(): void {
    this.cancelacionService
      .getmunicipio()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.municipioAlcaldia = data;
      });
  }

  /**
   * Método loadLocalidad
   *
   * Carga la información de las localidades desde el servicio.
   */
  loadLocalidad(): void {
    this.cancelacionService
      .getLocalidad()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.localidad = data;
      });
  }

  /**
   * Método getEntidad
   *
   * Actualiza la entidad federativa en el store.
   */
  getEntidad(): void {
    const ENTIDAD_FED = this.direccionNotificacionesForm.get('entidadFederativa')?.value;
    this.cancelacionesStore.setEntidadFed(ENTIDAD_FED);
  }

  /**
   * Método getMunicipiosOalcaldia
   *
   * Actualiza los municipios o alcaldías en el store.
   */
  getMunicipiosOalcaldia(): void {
    const MUNICIPIOS_ALCALDIA =
      this.direccionNotificacionesForm.get('municipioAlcaldia')?.value;
    this.cancelacionesStore.setMunicipiosAlcaldia(MUNICIPIOS_ALCALDIA);
  }

  /**
   * Método getColonia
   *
   * Actualiza la colonia en el store.
   */
  getColonia(): void {
    const COLONIA = this.direccionNotificacionesForm.get('colonia')?.value;
    this.cancelacionesStore.setColonia(COLONIA);
  }

  /**
   * Método getLocalidad
   *
   * Actualiza la localidad en el store.
   */
  getLocalidad(): void {
    const LOCALIDAD = this.direccionNotificacionesForm.get('localidad')?.value;
    this.cancelacionesStore.setLocalidad(LOCALIDAD);
  }

  /**
   * Método updatePais
   *
   * Actualiza el país en el store.
   */
  updatePais(): void {
    const PAIS = this.direccionNotificacionesForm.get('pais')?.value;
    this.cancelacionesStore.setPaisInput(PAIS);
  }

  /**
   * Método updateNumeroInterior
   *
   * Actualiza el número interior en el store.
   */
  updateNumeroInterior(): void {
    const NUMERO_INTERIOR = this.direccionNotificacionesForm.get('numeroInterior')?.value;
    this.cancelacionesStore.setNumeroInterior(NUMERO_INTERIOR);
  }

  /**
   * Método updateCodigoPostal
   *
   * Actualiza el código postal en el store.
   */
  updateCodigoPostal(): void {
    const CODIGO_POSTAL = this.direccionNotificacionesForm.get('codigoPostal')?.value;
    this.cancelacionesStore.setCodigoPostal(CODIGO_POSTAL);
  }

  /**
   * Método updateTelefono
   *
   * Actualiza el teléfono en el store.
   */
  updateTelefono(): void {
    const TELEFONO = this.direccionNotificacionesForm.get('telefono')?.value;
    this.cancelacionesStore.setTelefono(TELEFONO);
  }

  /**
   * Método loadInfo
   *
   * Carga la información adicional desde el servicio y actualiza el formulario.
   */
  loadInfo(): void {
    this.cancelacionService
      .getInfo()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.direccionNotificacionesForm.patchValue({
          calle: data.calle,
          numeroExterior: data.numeroExterior,
        });
      });
  }

  /**
   * Método ngOnDestroy
   *
   * Limpia las suscripciones al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
