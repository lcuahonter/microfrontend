import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ConsultaioQuery, ConsultaioState, SolicitudState } from '@ng-mf/data-access-user';
import {
  DISCRIMINATOR_VALUE,
  LISTA_DE_SECTORS,
} from '../../constantes/constantes90303.enum';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';
import { ReplaySubject, map, takeUntil } from 'rxjs';
import {
  Solicitud90303State,
  Tramite90303Store,
} from '../../state/Tramite90303.store';
import {
  TablaDinamicaComponent,
  TablaSeleccion,
  TituloComponent,
  ValidacionesFormularioService,
} from '@ng-mf/data-access-user';
import { CatalogosService } from '../../service/catalogos.service';
import { CommonModule } from '@angular/common';
import { ListaSectoresTabla } from '../../models/registro.model';
import { SolicitudQuery } from '@libs/shared/data-access-user/src';
import { Tramite90303Query } from '../../state/Tramite90303.query';

/**
 * Componente para gestionar la modificación de datos en el trámite 90303.
 * Este componente incluye tablas dinámicas para sectores, plantas, mercancías y productores indirectos.
 */
@Component({
  selector: 'app-modificacion',
  standalone: true,
  imports: [
    CommonModule,
    TablaDinamicaComponent,
    TituloComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './modificacion.component.html',
  styleUrl: './modificacion.component.scss',
})
export class ModificacionComponent implements OnInit, OnDestroy {
  /**
   * Formulario de modificación
   * @type {FormGroup}
   */
  modificacionForm!: FormGroup;

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
   * ReplaySubject utilizado para gestionar la destrucción de observables.
   * Se emite un valor cuando el componente se destruye para cancelar las suscripciones activas.
   */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /**
   * Indica si la tabla está en modo "Baja".
   */
  isBaja: boolean = true;

  /**
   * Enumeración que define las opciones de selección para las tablas dinámicas.
   */
  tablaSeleccion = TablaSeleccion;

  /**
   * Lista de datos para la tabla de sectores activos.
   */
  listaTabla = LISTA_DE_SECTORS;

  /**
   * Datos de la tabla de sectores activos.
   */
  listaSectoresDatos: ListaSectoresTabla[] = [];

  /**
   * Estado actual de la solicitud.
   */
  public solicitudState!: Solicitud90303State;

  /**
   * Estado actual de la solicitud.
   */
  solicitud!: SolicitudState;

  /**
   * Constructor del componente.
   * @param catalogo Servicio utilizado para obtener los datos de las tablas.
   * @param consultaioQuery Query para obtener el estado de consultaio.
   * @param fb FormBuilder para crear formularios reactivos.
   * @param store Store para manejar el estado del trámite 90303.
   * @param query Query para obtener el estado del trámite 90303.
   * @param validacionesService Servicio para validar formularios.
   * @param solicitudQuery Query para obtener el estado de la solicitud.
   */
  constructor(
    private catalogo: CatalogosService,
    private consultaioQuery: ConsultaioQuery,
    public fb: FormBuilder,
    public store: Tramite90303Store,
    private query: Tramite90303Query,
    private validacionesService: ValidacionesFormularioService,
    private solicitudQuery: SolicitudQuery
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.soloLectura = this.consultaDatos.readonly;
        })
      )
      .subscribe();

    this.solicitudQuery.selectSolicitudState$
      .pipe(
        takeUntil(this.destroyed$),
        map((solicitudState) => {
          this.solicitud = solicitudState;
        })
      )
      .subscribe();
  }

  /**
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   * Llama a los métodos para obtener los datos de las tablas.
   */
  ngOnInit(): void {
    this.modificacionForm = this.fb.group({
      registroFederalContribuyentes: [{ value: '', disabled: true }, []],
      representacionFederal: [{ value: '', disabled: true }, []],
      tipoModificacion: [{ value: '', disabled: true }, []],
      modificacionPrograma: [{ value: '', disabled: true }, []],
    });

    this.query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.solicitudState = seccionState;
          this.actualizarDonanteDomicilio();
        })
      )
      .subscribe(); 

    this.obtenerListaSectores();
    this.inicializarEstadoFormulario();
  }  

  /**
   * Actualiza el formulario de modificación con los datos del donante.
   * Obtiene los datos de la solicitud y los asigna a los campos correspondientes del formulario.
   * @returns {void}
   */
  actualizarDonanteDomicilio(): void {
    const DATOS = this.solicitud?.solicitud?.datos as {
      solicitud?: {
        unidadAdministrativaDto?: {
          nombre?: string;
        };
      };
    } | undefined;

    this.modificacionForm.patchValue({
      registroFederalContribuyentes: this.solicitudState?.loginRfc || '',
      representacionFederal: DATOS?.solicitud?.unidadAdministrativaDto?.nombre || '',
      tipoModificacion: this.solicitudState?.tipoModificacion,
      modificacionPrograma: ''
    });
  }

  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   * Además, obtiene la información del catálogo de mercancía.
   */
  inicializarEstadoFormulario(): void {
    if (this.soloLectura) {
      this.modificacionForm.disable();
    } else {
      this.modificacionForm.enable();
    }
  }

  /**
   * Obtiene la lista de sectores desde el servicio y actualiza la lista de datos.
   */
  public obtenerListaSectores(): void {
    const PAYLOAD = {
      idSolicitud:
        this.solicitudState?.idSolicitud && this.solicitudState.idSolicitud > 0
          ? this.solicitudState.idSolicitud
          : '',
      discriminatorValue: DISCRIMINATOR_VALUE,
      rfc: this.solicitudState.loginRfc || '',
      folioPrograma: this.solicitudState.selectedFolioPrograma || '',
      tipoPrograma: this.solicitudState.selectedTipoPrograma || '',
      idPrograma: this.solicitudState.selectedIdPrograma || '',
    };

    this.catalogo
      .obtenerListaSectores(PAYLOAD)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((respuesta) => {
        this.listaSectoresDatos = respuesta.datos?.map((sector) => ({
          cvSectorCatalogo: sector.cvSectorCatalogo,
          sector: sector.sector,
          descripcionTestado: sector.descripcionTestado,
          visible: sector.visible,
          cveSector: sector.cveSector,
        })) || [];
        this.store.setListaSectorTablaDatos(this.listaSectoresDatos);
      });
  }

  /**
   * Maneja el evento de clic en una fila de la tabla.
   * @param event Objeto que contiene la información de la fila y la columna clicada.
   */
  onFilaClic(event: { row: unknown; column: string }): void {
    const ROW = event.row as ListaSectoresTabla;
    this.listaSectoresDatos = this.listaSectoresDatos.map((item) => {
      if(item.cveSector === ROW.cveSector) {
        return {
          ...item,
          descripcionTestado: ROW.descripcionTestado
        }
      }
      return item;
    });
    
    this.actualizarGridProsec(ROW);

    this.store.setListaSectorTablaDatos(this.listaSectoresDatos);
  }

  /**
   * Actualiza la tabla Prosec con los datos modificados.
   * @param row Fila modificada de la tabla de sectores.
   * @return {void}
   */
  actualizarGridProsec(row: ListaSectoresTabla): void {
    const PAYLOAD = {
      idFraccion: row.cveSector,
      tipoFraccion: 'Sector',
      status: row.visible,
      idSolicitud: '',
      fechaIniVigencia: '',
      fracciones: [],
      sector: this.listaSectoresDatos
    }

    this.catalogo.actualizarGridProsec(PAYLOAD)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((respuesta) => {
        // Manejar la respuesta si es necesario
      });
  }

  /**
   * Valida el formulario del destinatario.
   * Marca todos los campos como tocados si el formulario es inválido.
   */
  validarDestinatarioFormulario(): void {
    if (this.modificacionForm.invalid) {
      this.modificacionForm.markAllAsTouched();
    }
  }

  /**
   * Verifica si un campo del formulario es válido.
   * @param form Formulario reactivo.
   * @param field Nombre del campo a validar.
   * @returns `true` si el campo es válido, de lo contrario `false`.
   */
  isValid(form: FormGroup, field: string): boolean {
    return this.validacionesService.isValid(form, field) || false;
  }
  
  /**
   * Establece valores en el estado de la tienda.
   * @param form Formulario reactivo.
   * @param campo Nombre del campo del formulario.
   * @param metodoNombre Método de la tienda para actualizar el estado.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite90303Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Método del ciclo de vida que se ejecuta al destruir el componente.
   * Emite un valor en `destroyed$` para cancelar las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
