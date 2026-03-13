/**
 * El `Ampliacion3RsComponent` es un componente de Angular diseñado para gestionar la funcionalidad del módulo "Ampliación de Servicios".
 * Maneja formularios reactivos, catálogos y la interacción con el estado para la gestión de datos relacionados con sectores y servicios.
 * 
 * Este componente proporciona funcionalidad para la ampliación de servicios, incluyendo la inicialización de formularios, 
 * la obtención de datos y la interacción con el estado para la gestión de sectores y reglas.
 */

import {
  Catalogo,
  SeccionLibStore,
  TablaSeleccion,
  doDeepCopy,
  esValidObject,
} from '@ng-mf/data-access-user';

import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { AmpliacionServiciosQuery } from '../../estados/tramite80206.query';
import { AmpliacionServiciosService } from '../../services/ampliacion-servicios.service';
import { AmpliacionServiciosState } from '../../estados/tramite80206.store';
import { CONFIGURACION_SECTOR } from "../../constantes/modificacion.constants";
import { CatalogoServices } from'@ng-mf/data-access-user';
import { Component } from '@angular/core';
import { ConfiguracionColumna } from '../../models/configuracion-columna.model';
import { Input } from '@angular/core';
import { Sector } from "../../models/datos-info.model";
import { Tramite80206Store } from '../../estados/tramite80206.store';

/**
 * Componente Angular para la gestión de la ampliación de servicios 3Rs en el trámite 80206.
 * Este componente permite seleccionar reglas, sectores y gestionar la información relacionada
 * con la ampliación de servicios, incluyendo la validación de formularios, la interacción con
 * servicios y el manejo de la interfaz de usuario (modales de alerta, selección de domicilios, etc.).
 */
@Component({
  selector: 'app-ampliacion-3rs',
  templateUrl: './ampliacion-3rs.component.html',
  styleUrl: './ampliacion-3rs.component.scss',
})
export class Ampliacion3RsComponent implements OnInit, OnDestroy {
  /**
   * Indica si una regla ha sido seleccionada.
   */
  isSelectedRegla: boolean = false;

  /**
   * Formulario reactivo para la información de registro.
   */
  formularioInfoRegistro!: FormGroup;

  /**
   * Tipo de selección de tabla (checkbox).
   */
  tablaSeleccion: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * Configuración de la tabla para sectores.
   */
  configuracionTablaSector: ConfiguracionColumna<Sector>[] = CONFIGURACION_SECTOR;

  /**
   * Lista de datos de sectores.
   */
  datosSector: Sector[] = [];

  /**
   * Lista de domicilios seleccionados.
   */
  domiciliosSeleccionados: Sector[] = [];

  /**
   * Formulario reactivo para datos adicionales.
   */
  forma!: FormGroup;

  /**
   * Lista de reglas seleccionadas.
   */
  reglaSeleccionada!: Catalogo[];

  /**
   * Lista desplegable de sectores.
   */
  sectorDesplegable!: Catalogo[];

  /**
   * Estado actual del trámite.
   */
  tramiteState: AmpliacionServiciosState = {} as AmpliacionServiciosState;

  /**
   * Notificador para gestionar la destrucción o desuscripción de observables.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
     * Indica si el formulario está en modo solo lectura.
     * Cuando es `true`, los campos del formulario no se pueden editar.
     */
    @Input() esFormularioSoloLectura: boolean = false;

    /**
   * Controla la visibilidad del modal de alerta.
   */
  mostrarAlerta: boolean = false;

  /**
   * Identificador del trámite asociado a la ampliación de 3Rs.
   */
  tramiteID: string = '80206';

/**
   * Mensaje mostrado en el modal de alerta.
   */
  mensajeDeAlerta: string = '';  
    /**
     * Suscripción para manejar observables.
     */
    private subscription: Subscription = new Subscription();
    /**
   * Valor predeterminado para la selección de aduanas.
   */
  predeterminado=-1;
   

  /**
   * Constructor del componente.
   */
  constructor(
    private fb: FormBuilder,
    private ampliacionServiciosService: AmpliacionServiciosService,
    private ampliacionServiciosQuery: AmpliacionServiciosQuery,
    private tramite80206Store: Tramite80206Store,
    private catalogoServices: CatalogoServices,
    private seccionStore: SeccionLibStore
  ) {
    this.inicializarFormularioInfoRegistro();
   
  }

  /**
   * Método de inicialización del componente.
   */
  ngOnInit(): void {
    this.obtenerReglaSelectList(this.tramiteID);
    this.inicializarFormularioDesdeAlmacen();
    this.obtenerSectorSelectList();
    
   
  }

  /**
   * Activa el modal de alerta.
   */
  activarModal(): void {
    this.mostrarAlerta = true;
  }

  /**
   * Cierra el modal de alerta.
   */
  aceptar(): void {
    this.mostrarAlerta = false;
  }

    /**
   * Cierra el modal de alerta.
   */
  cerrarModal():void{
    this.mostrarAlerta = false;
  }


  /**
   * Inicializa el formulario con datos del store.
   */
  inicializarFormularioDesdeAlmacen(): void {
    this.ampliacionServiciosQuery.selectSolicitudTramite$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((datos: AmpliacionServiciosState) => {
          this.tramiteState = datos;
          this.datosSector = datos.datosSector;
          this.isSelectedRegla = datos.isSelectedRegla;
          this.ampliacionServiciosService.enviarDeberiaMostrar(this.isSelectedRegla);

          this.formularioInfoRegistro.patchValue({
            seleccionaLaModalidad: this.tramiteState.seleccionaLaModalidad || '',
            seleccionarRegla: this.tramiteState.seleccionarRegla || '',
            sector: this.tramiteState.sector || '',
          });
        })
      )
      .subscribe();
  }

  /**
   * Inicializa el formulario de información de registro.
   */
  inicializarFormularioInfoRegistro(): void {
  this.formularioInfoRegistro = this.fb.group({
    seleccionaLaModalidad: [
      { value: 'Ampliación 3RS',disabled: true }, 
    ],
    seleccionarRegla: [
      { value: this.tramiteState.seleccionarRegla || '' }, 
      [Validators.required]
    ],
    sector: [
      { value: this.tramiteState.sector || '' }
    ],
  });
  }

  /**
   * Obtiene la lista de reglas para selección.
   */
  obtenerReglaSelectList(tramite: string): void {
  this.isSelectedRegla = false;
    this.subscription.add(this.catalogoServices.seleccionarReglaCatalogo(tramite).pipe(
      takeUntil(this.destroyNotifier$)
    ).subscribe((data) => {
      const DATOS = data.datos as Catalogo[];
      this.tramite80206Store.setReglaSeleccionada(DATOS);
      
      this.ampliacionServiciosQuery.selectSolicitudTramite$
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((sector: AmpliacionServiciosState) => {
          this.reglaSeleccionada = sector.reglaSeleccionada;
         
        });
    }));
    
  }

  /**
   * Obtiene la lista de sectores para selección.
   */
  obtenerSectorSelectList(): void {
    this.subscription.add(this.catalogoServices.sectoresCatalogo(this.tramiteID).pipe(
      takeUntil(this.destroyNotifier$)
    ).subscribe((data) => {
      const DATOS = data.datos as Catalogo[];
      this.tramite80206Store.setSectorDesplegable(DATOS);
      this.ampliacionServiciosQuery.selectSolicitudTramite$
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((sector: AmpliacionServiciosState) => {
          this.sectorDesplegable = sector.sectorDesplegable;
        });
    }));
  }
  
  /**
   * Elimina servicios seleccionados del grid.
   */
  eliminarServiciosGrid(): void {
      if (this.domiciliosSeleccionados.length === 0) {
      this.mostrarAlerta = true;
      this.mensajeDeAlerta = 'Seleccione la(s) Fracción(es) de Importación a eliminar.';
      return;
    }
    const DATOS_IMMEX_ACTUALIZADOS = [...this.datosSector];
    this.domiciliosSeleccionados.forEach((selectedItem) => {
      const INDICE = DATOS_IMMEX_ACTUALIZADOS.findIndex(
        (item: Sector) => item.descripcion === selectedItem['descripcion']
      );
      if (INDICE !== -1) {
        DATOS_IMMEX_ACTUALIZADOS.splice(INDICE, 1);
      }
    });
    this.tramite80206Store.setDatosSector(DATOS_IMMEX_ACTUALIZADOS);
    this.domiciliosSeleccionados = [];
  }

  /**
   * Agrega servicios a la ampliación.
   */
agregarServiciosAmpliacion(): void {
  const SECTOR_SELECCIONADO = this.formularioInfoRegistro.get('sector')?.value;
  
  if (!SECTOR_SELECCIONADO) {
    this.mostrarAlerta = true;
    this.mensajeDeAlerta = 'Debe seleccionar un sector.';
    return;
  }

  const SECTOR_EXISTENTE = this.datosSector.some(sector => sector.clave === SECTOR_SELECCIONADO);
  if (SECTOR_EXISTENTE) {
    this.mostrarAlerta = true;
    this.mensajeDeAlerta = 'El sector que intenta ingresar ya existe en la lista de sectores capturados.';
    return;
  }

  const PAYLOAD = {
    "sectorImmex": SECTOR_SELECCIONADO
  };

  this.ampliacionServiciosService
    .obtenerSectoresImmex(PAYLOAD)
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe({
      next: (response) => {
        if (esValidObject(response)) {
          const API_DATOS = doDeepCopy(response);
          
          if (API_DATOS.codigo !== "00") {
            this.mostrarAlerta = true;
            this.mensajeDeAlerta = API_DATOS.error || API_DATOS.mensaje || 'Error al obtener información del sector.';
            return;
          }

          if (esValidObject(API_DATOS.datos)) {
            try {
              const SECTOR_ENCONTRADO = this.sectorDesplegable.find(sector => sector.clave === SECTOR_SELECCIONADO);
              
              const NUEVO_SECTOR: Sector = {
                clave: SECTOR_SELECCIONADO,
                descripcion: SECTOR_ENCONTRADO?.descripcion || ''
              };
              
              const DATOS_ACTUALIZADOS = [...this.datosSector, NUEVO_SECTOR];
              this.tramite80206Store.setDatosSector(DATOS_ACTUALIZADOS);
              
              this.formularioInfoRegistro.get('sector')?.setValue('');
              
              const ISVALID = this.validarFormulario();
              this.seccionStore.establecerSeccion([ISVALID]);
              this.seccionStore.establecerFormaValida([ISVALID]);
              
            } catch (mappingError) {
              console.error('Error al procesar respuesta:', mappingError);
              this.mostrarAlerta = true;
              this.mensajeDeAlerta = 'Error al procesar la información del sector.';
            }
          } else {
            this.mostrarAlerta = true;
            this.mensajeDeAlerta = 'No se encontraron datos para el sector especificado.';
          }
        }
      },
      error: (error) => {
        console.error('Error al obtener información del sector:', error);
        this.mostrarAlerta = true;
        this.mensajeDeAlerta = 'Error al conectar con el servidor. Intente nuevamente.';
      }
    });
}

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Limpia las suscripciones.
   */
  ngOnDestroy(): void {
    this.ampliacionServiciosService.enviarDeberiaMostrar(true);
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Maneja los datos recibidos del componente hijo.
   */
  procesarDatosDelHijo(): void {
  const DATA = this.formularioInfoRegistro.get('seleccionarRegla')?.value;
  
  if (!DATA || DATA === '' || DATA === -1 || DATA === '-1' || DATA === this.predeterminado) {
    this.isSelectedRegla = false;
    this.ampliacionServiciosService.enviarDeberiaMostrar(this.isSelectedRegla);
    this.tramite80206Store.setIsSelectedRegla(this.isSelectedRegla);
    this.tramite80206Store.setSeleccionarRegla(DATA);
    
    const ISVALID = this.validarFormulario();
    this.seccionStore.establecerSeccion([ISVALID]);
    this.seccionStore.establecerFormaValida([ISVALID]);
    return; 
  }
  
  if (DATA === '3.2.25') {
    this.isSelectedRegla = true;
  } else {
    this.isSelectedRegla = false;
    this.mensajeDeAlerta = "El programa que solicita la ampliación no está asociado a la zona fronteriza norte.";
    this.activarModal();
  }
  
  this.ampliacionServiciosService.enviarDeberiaMostrar(this.isSelectedRegla);
  this.tramite80206Store.setIsSelectedRegla(this.isSelectedRegla);
  this.tramite80206Store.setSeleccionarRegla(DATA);

  const ISVALID = this.validarFormulario();
  this.seccionStore.establecerSeccion([ISVALID]);
  this.seccionStore.establecerFormaValida([ISVALID]);
}

  /**
   * Actualiza el sector seleccionado basado en la entrada del usuario.
   */
  cambioDeSector(): void {
    const DATA = this.formularioInfoRegistro.get('sector')?.value;
    this.tramite80206Store.setSector(DATA);
  }

  /**
   * Actualiza la lista de domicilios seleccionados.
   */
  seleccionarDomicilios(domicilios: Sector[]): void {
    this.domiciliosSeleccionados = [...domicilios];
  }

   /**
   * Valida todos los controles del formulario.
   *
   * Marca todos los controles como tocados y actualiza su estado de validación
   * para mostrar los errores correspondientes en la interfaz de usuario.
   * También valida los formularios de los componentes hijo.
   *
   */
validarFormulario(): boolean {
  let isValid = true;

  if (this.formularioInfoRegistro) {
    this.formularioInfoRegistro.markAllAsTouched();
    this.formularioInfoRegistro.updateValueAndValidity();

    const SELECCIONA_LA_MODALIDA = this.formularioInfoRegistro.get('seleccionaLaModalidad')?.value;
    const SELECCIONAR_REGLA = this.formularioInfoRegistro.get('seleccionarRegla')?.value;

    if (!SELECCIONA_LA_MODALIDA || SELECCIONA_LA_MODALIDA.trim() === '') {
      isValid = false;
    }

    if (!SELECCIONAR_REGLA || SELECCIONAR_REGLA === '' || SELECCIONAR_REGLA === -1 || SELECCIONAR_REGLA === '-1') {
      isValid = false;
    }

    if (SELECCIONAR_REGLA === '3.2.25' && this.isSelectedRegla) {
      if (this.datosSector.length === 0) {
        isValid = false;
      } 
    }

  } else {
    isValid = false;
  }

  return isValid;
}
}