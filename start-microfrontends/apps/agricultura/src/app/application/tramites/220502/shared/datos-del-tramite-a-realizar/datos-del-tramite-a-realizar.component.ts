import {
  ADUANA_DE_INGRESO,
  CERTIFICADOS_AUTORIZADOS,
  HORA_DE_INSPECCION,
  PUNTO_DE_INSPECCION,
  SANIDAD_AGROPECUARIA,
} from '../../constantes/constantes';
import {
  AbstractControl,
  ControlContainer,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Catalogo,
  CatalogosSelect,
  InputFecha,
  InputFechaComponent,
  TituloComponent,
} from '@ng-mf/data-access-user';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { Observable, Subject, firstValueFrom, map, takeUntil } from 'rxjs';
import {
  Solicitud220501State,
  Solicitud220501Store,
} from '../../../220501/estados/tramites220501.store';

import {
  Solicitud220502State,
  Solicitud220502Store,
} from '../../estados/tramites220502.store';
import { Solicitud220501Query } from '../../../220501/estados/tramites220501.query';

import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { DatosDelTramiteRealizar } from '../../models/solicitud-pantallas.model';
import { Solicitud220502Query } from '../../estados/tramites220502.query';
import { SolicitudPantallasService } from '../../services/solicitud-pantallas.service';
import { SolicitudQuery } from '../../../220501/estados/tramites.query';



/**
 * Componente para gestionar los datos del trámite a realizar.
 */
@Component({
  selector: 'app-datos-del-tramite-a-realizar',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    TituloComponent,
    CatalogoSelectComponent,
    InputFechaComponent,
  ],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: (): ControlContainer =>
        inject<ControlContainer>(ControlContainer, { skipSelf: true }),
    },
  ],
  providers: [SolicitudPantallasService],
  templateUrl: './datos-del-tramite-a-realizar.component.html',
  styleUrl: './datos-del-tramite-a-realizar.component.scss',
})
/** Componente para gestionar los datos del trámite a realizar */
export class DatosDelTramiteARealizarComponent implements OnInit, OnDestroy {

  // Arrays para almacenar los datos de los select: certificados pendientes, aduanas de ingreso y horas de inspección

  certificadosPendientes: Catalogo[] = [];
  aduanasIngreso:Catalogo[] = [];
  horasInspeccion:Catalogo[] = [];
  /**
   * Clave de entrada utilizada para identificar el control dentro del grupo de formulario principal.
   */
  @Input() claveDeControl: string = '';

  /**
   * Inyecta el contenedor de control del formulario principal.
   */
  parentContainer = inject(ControlContainer);

  /**
   * Getter para acceder al grupo de formularios principal.
   */
  get grupoFormularioPadre(): FormGroup {
    return this.parentContainer.control as FormGroup;
  }

  /**
   * Configuración del campo de fecha para la 'Fecha de Inicio de Vigencia'.
   *
   * Contiene las propiedades visuales y de validación del componente de entrada de fecha.
   */
  configuracionFechaFinVigencia: InputFecha = {
    labelNombre: 'Fecha de Inicio de Vigencia',
    required: false,
    habilitado: true,
  };

  /**
   * Configuración del campo de fecha para la 'Fecha de inspección'.
   */
  configuracionFechaInspeccion: InputFecha = {
    labelNombre: 'Fecha de inspección',
    required: true,
    habilitado: true,
  };

  /**
   * Opciones de selección de formulario para diferentes datos del catálogo.
   */
  certificadosAutorizados: CatalogosSelect = CERTIFICADOS_AUTORIZADOS;

  /** Opciones de selección de formulario para diferentes datos del catálogo. */
  horaDeInspeccion: CatalogosSelect = HORA_DE_INSPECCION;

  /** Opciones de selección de formulario para diferentes datos del catálogo. */
  aduanaDeIngreso: CatalogosSelect = ADUANA_DE_INGRESO;

  /** Opciones de selección de formulario para diferentes datos del catálogo. */
  sanidadAgropecuaria: CatalogosSelect = SANIDAD_AGROPECUARIA;

  /** Opciones de selección de formulario para diferentes datos del catálogo. */
  puntoDeInspeccion: CatalogosSelect = PUNTO_DE_INSPECCION;

  /**
   * Campo de entrada de fecha inicializado con la constante FECHA_INSPECCION.
   */
  fechaInicioInput: InputFecha = {
    labelNombre: 'Fecha de Inicio de Vigencia',
    required: false,
    habilitado: false,
  };

  /**
   * Subject para desuscribirse de los observables.
   * @type {Subject<void>}
   */
  private destroyed$ = new Subject<void>();

  /**
   * Estado de la solicitud para gestionar los datos relacionados con la solicitud 220502.
   * Se inicializa como un objeto vacío con la estructura de `Solicitud220502State`.
   */
  solicitud220502State: Solicitud220502State = {} as Solicitud220502State;
   solicitud220501State: Solicitud220502State = {} as Solicitud220501State;

  /**
   * Indica si el formulario está deshabilitado.
   */
  @Input() formularioDeshabilitado!: boolean;

  /**
   * Indica el número de procedimiento.
   */
  @Input() procedimiento!: number;

  /**
   * Indica si el formulario es válido.
   */
  @Input() formValida!: boolean;

  /**
   * Evento que emite un valor booleano indicando si los certificados han sido autorizados.
   *
   * @event certificadosAutorizEmitido
   * @type {boolean}
   * @default false
   */
  @Output() certificadosAutorizEmitido = new EventEmitter<boolean>(false);

  /**
   * @constructor
   * Constructor para inyectar los servicios y dependencias necesarias para el componente.
   *
   * @param solicitudService - Servicio para obtener y gestionar datos relacionados con las pantallas de solicitud.
   * @param solicitud220502Store - Store que gestiona y actualiza el estado de la solicitud 220502.
   * @param solicitud220502Query - Query para consultar el estado de la solicitud 220502.
   * @param cdRef - Referencia para detectar y aplicar cambios manualmente en el ciclo de detección de Angular.
   */
  constructor(
    private solicitudService: SolicitudPantallasService,
    private solicitud220502Store: Solicitud220502Store,
    private solicitud220501Store: Solicitud220501Store,
    private solicitud220502Query: Solicitud220502Query,
    private solicitud220501Query: Solicitud220501Query,
    private cdRef: ChangeDetectorRef,
    private solicitudQuery: Solicitud220502Query,
  ) {
    // Se puede agregar aquí el código de inicialización si es necesario en el futuro.
  }

  private getStore(): Solicitud220501Store | Solicitud220502Store {
    // Obtener el store correcto basado en el procedimiento
    if (this.procedimiento === 220501) {
      return this.solicitud220501Store;
    } 
    return this.solicitud220502Store;
    
  }

 private getQuery(): {
   selectSolicitud$: Observable< | Solicitud220502State>;
 } {
   return this.procedimiento === 220501
     ? this.solicitud220501Query
     : this.solicitud220502Query;
 }
  /**
   * Gancho de ciclo de vida que inicializa los controles de formulario cuando se carga el componente.
   */
async ngOnInit(): Promise<void> {

  if (this.claveDeControl) {

  const CURRENTQUERY = this.getQuery();
  const CURRENTSTATE =
    await firstValueFrom(CURRENTQUERY.selectSolicitud$);

  if (this.procedimiento === 220501) {
    this.solicitud220501State = CURRENTSTATE as Solicitud220501State;
  } else {
    this.solicitud220502State = CURRENTSTATE as Solicitud220502State;
  }

  const FORMGROUP = new FormGroup({
    certificadosAutorizados: new FormControl(
      CURRENTSTATE.certificadosAutorizados,
      [Validators.required]
    ),
    horaDeInspeccion: new FormControl(
      CURRENTSTATE.horaDeInspeccion,
      [Validators.required]
    ),
    aduanaDeIngreso: new FormControl(
      CURRENTSTATE.aduanaDeIngreso,
      [Validators.required]
    ),
    sanidadAgropecuaria: new FormControl(
      CURRENTSTATE.sanidadAgropecuaria,
      [Validators.required]
    ),
    puntoDeInspeccion: new FormControl(
      CURRENTSTATE.puntoDeInspeccion,
      [Validators.required]
    ),
    fechaDeInspeccion: new FormControl(
      CURRENTSTATE.fechaDeInspeccion
    ),
    fechaInspeccion: new FormControl(
      CURRENTSTATE.fechaInspeccion,
      [Validators.required]
    ),
  });

  this.grupoFormularioPadre.addControl(this.claveDeControl, FORMGROUP);
  if (this.procedimiento === 220502) {
    const CERTIFICADOS = Number(CURRENTSTATE.certificadosAutorizados);
    this.certificadosAutorizEmitido.emit(CERTIFICADOS > 0);
  }

  CURRENTQUERY.selectSolicitud$
    .pipe(takeUntil(this.destroyed$))
    .subscribe((res) => {

      if (this.procedimiento === 220501) 
        
    {
        this.solicitud220501State = res as Solicitud220501State;
        const CERTIFICADOS = Number(this.solicitud220501State.certificadosAutorizados);
        this.certificadosAutorizEmitido.emit(CERTIFICADOS > 0);

        FORMGROUP.patchValue({
          horaDeInspeccion: this.solicitud220501State.horaDeInspeccion,
          fechaDeInspeccion: this.solicitud220501State.fechaDeInspeccion,
          fechaInspeccion: this.solicitud220501State.fechaInspeccion,
        });
      }
      
      else {
        this.solicitud220502State = res as Solicitud220502State;
        const CERTIFICADOS = Number(this.solicitud220502State.certificadosAutorizados);
        this.certificadosAutorizEmitido.emit(CERTIFICADOS > 0);

        FORMGROUP.patchValue({
          horaDeInspeccion: this.solicitud220502State.horaDeInspeccion,
          fechaDeInspeccion: this.solicitud220502State.fechaDeInspeccion,
          fechaInspeccion: this.solicitud220502State.fechaInspeccion,
        });
      }
    });

  if (this.procedimiento === 220502 &&
      CURRENTQUERY instanceof Solicitud220502Query) {

    CURRENTQUERY.certificadosAutorizados$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((value) => {
        if (value) {
          
        FORMGROUP.patchValue({
          certificadosAutorizados:
            this.solicitud220502State.certificadosAutorizados ?? '',
        });
      }
        this.onCertificadosAutorizadosChangeInitial(
          String(this.solicitud220502State.certificadosAutorizados)
        );
      });
  }

   if (this.procedimiento === 220501 &&
      CURRENTQUERY instanceof Solicitud220501Query) {

    CURRENTQUERY.certificadosAutorizados$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((value) => {
        if (value) {
          
        FORMGROUP.patchValue({
          certificadosAutorizados:
            this.solicitud220501State.certificadosAutorizados ?? '',
        });
      }
        this.onCertificadosAutorizadosChangeInitial(
          String(this.solicitud220501State.certificadosAutorizados)
        );
      });
  }
  }

  if (this.formularioDeshabilitado) {
    this.grupoFormularioPadre.disable();
  } else {
    this.grupoFormularioPadre.enable();
  }

  await Promise.all([
    this.getCertificadosPendientes(),
    this.getAduanaDeIngreso(),
    this.getHoraDeInspeccion()
  ]);

  this.cargarDatosIniciales();
}
/**
   * Obtiene las aduanas de ingreso y prepara el objeto para el select.
   */

async getAduanaDeIngreso(): Promise<void> {
  const DATA = await firstValueFrom(
    this.solicitudService.getAduanaDeIngreso(
      this.procedimiento ? this.procedimiento.toString() : ''
    ).pipe(takeUntil(this.destroyed$))
  );

  if (Array.isArray(DATA)) {
    this.aduanasIngreso = DATA;

    const CATALOGOTEMPLATE = (
      label: string,
      required: boolean,
      catalogos: Catalogo[]
    ): CatalogosSelect => ({
      labelNombre: label,
      required,
      primerOpcion: 'Selecciona un valor',
      catalogos,
    });

    this.aduanaDeIngreso = CATALOGOTEMPLATE(
      'Aduana de ingreso',
      false,
      this.aduanasIngreso
    );
  }
}

  /**
   * Obtiene los certificados autorizados pendientes y prepara el objeto para el select.
   */

 async getCertificadosPendientes(): Promise<void> {
  const DATA = await firstValueFrom(
    this.solicitudService.getCertificadosPendientes(
      this.procedimiento ? this.procedimiento.toString() : ''
    ).pipe(takeUntil(this.destroyed$))
  );

  if (Array.isArray(DATA)) {
    this.certificadosPendientes = DATA;

    const CATALOGOTEMPLATE = (
      label: string,
      required: boolean,
      catalogos: Catalogo[]
    ): CatalogosSelect => ({
      labelNombre: label,
      required,
      primerOpcion: 'Selecciona un valor',
      catalogos,
    });

    this.certificadosAutorizados = CATALOGOTEMPLATE(
      'Certificados autorizados pendientes',
      true,
      this.certificadosPendientes
    );
  }
}

/**
   * Obtiene las horas de inspección y prepara el objeto para el select.
   */
async getHoraDeInspeccion(): Promise<void> {
  const DATA = await firstValueFrom(
    this.solicitudService.getHoraDeInspeccion(
      this.procedimiento ? this.procedimiento.toString() : ''
    ).pipe(takeUntil(this.destroyed$))
  );

  if (Array.isArray(DATA)) {
    this.horasInspeccion = DATA;

    const CATALOGOTEMPLATE = (
      label: string,
      required: boolean,
      catalogos: Catalogo[]
    ): CatalogosSelect => ({
      labelNombre: label,
      required,
      primerOpcion: 'Selecciona un valor',
      catalogos,
    });

    this.horaDeInspeccion = CATALOGOTEMPLATE(
      'Hora de inspección',
      true,
      this.horasInspeccion
    );
  }
}
// Maneja los cambios en el catálogo de certificados autorizados
  onCertificadosAutorizadosChange(data: Catalogo): void {
    this.setCertificadosAutorizados(data)
      this.solicitudService
      .onCertificadosAutorizadosChange(data?.clave ?? '',this.procedimiento ? this.procedimiento.toString() : '')
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (certificados) => {
            this.getOficinaInspeccionSanidadAgropecuaria(certificados?.aduana_de_ingreso?? '',certificados?.ofic_de_insp_agro?? '')
              this.getPntsInspecn(certificados?.ofic_de_insp_agro?? '',certificados?.punto_de_inspeccion?? '')
           const FORM_GROUP = this.grupoFormularioPadre.get(
              this.claveDeControl
            ) as FormGroup;
          FORM_GROUP.patchValue({
  aduanaDeIngreso: certificados?.aduana_de_ingreso ?? ''
});
    const FOUND_CATALOG= this.aduanaDeIngreso.catalogos
        ?.find(el => el.clave === certificados?.aduana_de_ingreso);
      if (FOUND_CATALOG) {
          this.setAduanaDeIngreso(FOUND_CATALOG);
}
        },
 });
  }
  /**
 * Maneja el cambio inicial de los certificados autorizados al cargar el formulario.
 * 
 * Esta función se ejecuta durante la carga inicial del componente para:
 * - Obtener los datos del certificado seleccionado.
 * - Cargar las oficinas de inspección de Sanidad Agropecuaria asociadas.
 * - Actualizar los campos del formulario con los valores iniciales (aduana, oficina, etc.).
 */
   onCertificadosAutorizadosChangeInitial(data: string): void {
       this.solicitudService
      .onCertificadosAutorizadosChange(data ?? '',this.procedimiento ? this.procedimiento.toString() : '')
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (certificados) => {
            this.getOficinaInspeccionSanidadAgropecuaria(certificados?.aduana_de_ingreso?? '',certificados?.ofic_de_insp_agro?? '')
            if(this.procedimiento === 220502){
this.getPntsInspecn(certificados?.ofic_de_insp_agro?? '', String(this.solicitud220502State.puntoDeInspeccion ?? '')?? '')
            }
            else{
this.getPntsInspecn(certificados?.ofic_de_insp_agro?? '', String(this.solicitud220501State.puntoDeInspeccion ?? '')?? '')
            }
  
           const FORM_GROUP = this.grupoFormularioPadre.get(
              this.claveDeControl
            ) as FormGroup;
          FORM_GROUP.patchValue({
  aduanaDeIngreso: certificados?.aduana_de_ingreso ?? ''
});
    const FOUND_CATALOG= this.aduanaDeIngreso.catalogos
        ?.find(el => el.clave === certificados?.aduana_de_ingreso);
      if (FOUND_CATALOG) {
          this.setAduanaDeIngreso(FOUND_CATALOG);
}
        },
         });
  }
/**
 * Obtiene las oficinas de inspección de Sanidad Agropecuaria según la clave proporcionada.
 */
 async getOficinaInspeccionSanidadAgropecuaria(clave: string, match: string): Promise<void> {
  const DATA = await firstValueFrom(
    this.solicitudService.getOficinaInspeccionSanidadAgropecuaria(
      clave,
      this.procedimiento ? this.procedimiento.toString() : ''
    ).pipe(takeUntil(this.destroyed$))
  );

  if (Array.isArray(DATA)) {
    const CATALOGOTEMPLATE = (
      label: string,
      required: boolean,
      catalogos: Catalogo[]
    ): CatalogosSelect => ({
      labelNombre: label,
      required,
      primerOpcion: 'Selecciona un valor',
      catalogos,
    });

    this.sanidadAgropecuaria = CATALOGOTEMPLATE(
      'Oficina de inspección de Sanidad Agropecuaria',
      false,
      DATA
    );

    const FOUND_CATALOG = DATA.find(el => el.clave === match);
    const FORM_GROUP = this.grupoFormularioPadre.get(this.claveDeControl) as FormGroup;

    FORM_GROUP.patchValue({
      sanidadAgropecuaria: FOUND_CATALOG?.clave
    });

    if (FOUND_CATALOG) {
      this.setSanidadAgropecuaria(FOUND_CATALOG);
    }
  }
}

   async getPntsInspecn(clave: string, match: string): Promise<void> {
  const DATA = await firstValueFrom(
    this.solicitudService.getPuntosInspeccion(
      clave,
      this.procedimiento ? this.procedimiento.toString() : ''
    ).pipe(takeUntil(this.destroyed$))
  );

  if (Array.isArray(DATA)) {
    const CATALOGOTEMPLATE = (
      label: string,
      required: boolean,
      catalogos: Catalogo[]
    ): CatalogosSelect => ({
      labelNombre: label,
      required,
      primerOpcion: 'Selecciona un valor',
      catalogos,
    });

    this.puntoDeInspeccion = CATALOGOTEMPLATE(
      'Punto de inspección',
      true,
      DATA
    );

    const FOUND_CATALOG = DATA.find(el => el.clave === match);
    const FORM_GROUP = this.grupoFormularioPadre.get(this.claveDeControl) as FormGroup;

    FORM_GROUP.patchValue({
      puntoDeInspeccion: FOUND_CATALOG?.clave
    });

    if (FOUND_CATALOG) {
      this.setPuntoDeInspeccion(FOUND_CATALOG);
    }
  }
}


  /**
   * Maneja la selección de 'Certificados Autorizados' y actualiza el control del formulario.
   * @param e El artículo del catálogo seleccionado.
   */
  certificadosSeleccion(e: Catalogo): void {
    this.actualizarFormValue('certificadosAutorizados', e.descripcion);
  }

  /**
   * Maneja la selección de 'Hora de Inspección' y actualiza el control del formulario.
   * @param e El artículo del catálogo seleccionado.
   */
  horaDeSeleccion(e: Catalogo): void {
    this.actualizarFormValue('horaDeInspeccion', e.descripcion);
  }

  /**
   * Maneja la selección de 'Aduana de Ingreso' y actualiza el control del formulario.
   * @param e El artículo del catálogo seleccionado.
   */
  aduanaDeSeleccion(e: Catalogo): void {
    this.actualizarFormValue('aduanaDeIngreso', e.descripcion);
  }

  /**
   * Maneja la selección de 'Sanidad Agropecuaria' y actualiza el control del formulario.
   * @param e El artículo del catálogo seleccionado.
   */
  sanidadSeleccion(e: Catalogo): void {
    this.actualizarFormValue('sanidadAgropecuaria', e.descripcion);
  }

  /**
   * Maneja la selección de 'Punto de Inspección' y actualiza el control del formulario.
   * @param e El artículo del catálogo seleccionado.
   */
  puntoDeSeleccion(e: Catalogo): void {
    this.actualizarFormValue('puntoDeInspeccion', e.descripcion);
  }

  /**
   * Actualiza un control de formulario específico con un nuevo valor.
   * @param nombreDeControl El nombre del control a actualizar.
   * @param value El nuevo valor a establecer.
   */
  private actualizarFormValue(nombreDeControl: string, value: string): void {
    if (
      this.claveDeControl &&
      this.grupoFormularioPadre?.contains(this.claveDeControl)
    ) {
      this.grupoFormularioPadre?.controls[this.claveDeControl].patchValue({
        [nombreDeControl]: value,
      });
    }
  }

  /**
   * Actualiza los datos iniciales de los campos del formulario según la información proporcionada.
   *
   * @param data - El objeto de datos que contiene valores para diferentes campos de catálogo.
   */
  actualizarDatosIniciales(data: DatosDelTramiteRealizar): void {
    const CATALOGOTEMPLATE = (
      label: string,
      required: boolean,
      catalogos: Catalogo[]
    ): CatalogosSelect => ({
      labelNombre: label,
      required,
      primerOpcion: 'Selecciona un valor',
      catalogos,
    });
 
    this.puntoDeInspeccion = CATALOGOTEMPLATE(
      'Punto de inspección',
      true,
      data.puntoInspeccion
    );
    this.cdRef.detectChanges();
  }

  /**
   * Carga datos del catálogo inicial para las selecciones de formulario.
   */
  cargarDatosIniciales(): void {
    this.solicitudService.getDataDatosDelTramite().pipe(takeUntil(this.destroyed$)).subscribe({
      next: (data: DatosDelTramiteRealizar) => {
        this.actualizarDatosIniciales(data);
      },
    });
  }

  /**
   * Getter para acceder al grupo de formularios 'datosServicio'.
   */
  get datosServicio(): FormGroup {
    return this.grupoFormularioPadre.get('datosServicio') as FormGroup;
  }

  /**
   * Maneja los cambios en el campo de fecha de inicio.
   * @param nuevo_valor El nuevo valor de fecha seleccionado.
   */
  cambioFechaInicio(nuevo_valor: string): void {
    (this.getStore() as Solicitud220502Store).setFechaDeInspeccion(nuevo_valor);
  }

  /**
   * Maneja los cambios en el campo de fecha de inspección
   * @param nuevo_valor El nuevo valor de fecha seleccionado.
   */
cambioFechaInspeccion(nuevo_valor: string): void {
  const STORE = this.getStore();

  if (this.procedimiento === 220501 && STORE instanceof Solicitud220501Store) {
    STORE.setFechaInspeccion(nuevo_valor);
  } else if (this.procedimiento === 220502 && STORE instanceof Solicitud220502Store) {
    STORE.setFechaInspeccion(nuevo_valor);
  }
}

  /**
   * Establece los certificados autorizados en el estado de la solicitud.
   * @param event Objeto de tipo Catalogo que contiene el ID del certificado autorizado.
   */
 setCertificadosAutorizados(event: Catalogo): void {
  const STORE = this.getStore();

  // Dynamically set certificadosAutorizados based on store type
  if (this.procedimiento === 220501 && STORE instanceof Solicitud220501Store) {
    STORE.setCertificadosAutorizados(event.clave ?? '');
  } else if (this.procedimiento === 220502 && STORE instanceof Solicitud220502Store) {
    STORE.setCertificadosAutorizados(event.clave ?? '');
  }
 }

  /**
   * Define la hora de inspección en la solicitud.
   * @param event Objeto de tipo Catalogo que contiene el ID de la hora de inspección.
   */
setHoraDeInspeccion(event: Catalogo): void {
  const STORE = this.getStore();

  if (this.procedimiento === 220501 && STORE instanceof Solicitud220501Store) {
    STORE.setHoraDeInspeccion(event.clave ?? '');
  } else if (this.procedimiento === 220502 && STORE instanceof Solicitud220502Store) {
    STORE.setHoraDeInspeccion(event.clave ?? '');
  }
}

  /**
   * Asigna la aduana de ingreso en el estado de la solicitud.
   * @param event Objeto de tipo Catalogo que contiene el ID de la aduana de ingreso.
   */
  setAduanaDeIngreso(event: Catalogo): void {
  const STORE = this.getStore();
  if (this.procedimiento === 220501 && STORE instanceof Solicitud220501Store) {
    STORE.setAduanaDeIngreso(event.clave ?? '');
  } else if (this.procedimiento === 220502 && STORE instanceof Solicitud220502Store) {
    STORE.setAduanaDeIngreso(event.clave ?? '');
  }
}

  /**
   * Establece la sanidad agropecuaria en la solicitud.
   * @param event Objeto de tipo Catalogo que contiene el ID de la sanidad agropecuaria.
   */
  setSanidadAgropecuaria(event: Catalogo): void {
  const STORE = this.getStore();

  if (this.procedimiento === 220501 && STORE instanceof Solicitud220501Store) {
    STORE.setSanidadAgropecuaria(event.clave ?? '');
  } else if (this.procedimiento === 220502 && STORE instanceof Solicitud220502Store) {
    STORE.setSanidadAgropecuaria(event.clave ?? '');
  }
}

  /**
   * Define el punto de inspección en la solicitud.
   * @param event Objeto de tipo Catalogo que contiene el ID del punto de inspección.
   */
 setPuntoDeInspeccion(event: Catalogo): void {
  const STORE = this.getStore();

  if (this.procedimiento === 220501 && STORE instanceof Solicitud220501Store) {
    STORE.setPuntoDeInspeccion(event.clave ?? '');
  } else if (this.procedimiento === 220502 && STORE instanceof Solicitud220502Store) {
    STORE.setPuntoDeInspeccion(event.clave ?? '');
  }
}
  /**
   * Gancho de ciclo de vida para limpiar los controles de formulario cuando se destruye el componente.
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Desuscribe el componente de todos los observables.
   * @returns {void}
   */

marcarControlesComoTocados(): void {
  const FORMGROUP = this.grupoFormularioPadre.get(this.claveDeControl) as FormGroup;

  if (!FORMGROUP) {
    return;
  }

  const CONTROLS = FORMGROUP.controls as { [key: string]: AbstractControl };

  Object.values(CONTROLS).forEach(control => {
    control.markAsTouched({ onlySelf: true });
    control.markAsDirty({ onlySelf: true });
    control.updateValueAndValidity();
  });
}


  ngOnDestroy(): void {
    if (
      this.claveDeControl &&
      this.grupoFormularioPadre?.contains(this.claveDeControl)
    ) {
      this.grupoFormularioPadre?.removeControl(this.claveDeControl);
    }
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
