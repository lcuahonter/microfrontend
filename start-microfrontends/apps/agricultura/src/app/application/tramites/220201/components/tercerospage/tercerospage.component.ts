/**
 * @fileoverview
 * Componente para la gestión de terceros relacionados en el trámite 220201 de agricultura.
 * Permite visualizar, actualizar y eliminar la lista de personas asociadas como terceros,
 * así como controlar el modo de solo lectura del formulario y cargar catálogos de países y estados.
 * Cobertura compodoc 100%: cada clase, método, propiedad y evento está documentada.
 * @module TercerospageComponent
 */
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DatosDeLaSolicitud, TercerosrelacionadosdestinoTable } from '../../../../shared/models/tercerosrelacionados.model';
import { Subject, takeUntil } from 'rxjs';
import { AgregardestinatarioComponent } from '../agregardestinatario/agregardestinatario.component';
import { AgregardestinatariofinalComponent } from '../agregardestinatariofinal/agregardestinatariofinal.component';
import { CatalogosService } from '../../services/220201/catalogos/catalogos.service'
import { CertificadoZoosanitarioServiceService } from '../../services/220201/certificado-zoosanitario.service';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DestinatarioForm } from '../../../220203/models/220203/importacion-de-acuicultura.module';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { TercerosrelacionadosComponent } from '../../../../shared/components/tercerosrelacionados/tercerosrelacionados.component';
import { TercerosrelacionadosService } from '../../../../shared/components/services/tercerosrelacionados/tercerosrelacionados.service';
import { ZoosanitarioStore } from '../../estados/220201/zoosanitario.store';

/**
 * Componente para la gestión de terceros relacionados en el trámite.
 * Permite visualizar, actualizar y eliminar la lista de personas asociadas como terceros,
 * así como controlar el modo de solo lectura del formulario y cargar catálogos de países y estados.
 *
 * @class TercerospageComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 * @implements {AfterViewInit}
 */
@Component({
  selector: 'app-tercerospage',
  standalone: true,
  imports: [
    CommonModule,
    TercerosrelacionadosComponent,
    ModalComponent
  ],
  templateUrl: './tercerospage.component.html',
  styleUrl: './tercerospage.component.scss',
})
export class TercerospageComponent implements OnInit, OnDestroy, AfterViewInit {
  /**
   * Subject utilizado como notificador para destruir suscripciones y evitar fugas de memoria.
   * Se emite cuando el componente se destruye, permitiendo cancelar las suscripciones a observables.
   * @type {Subject<void>}
   * @private
   */
  private destroyNotifier$ = new Subject<void>();

  /**
   * Lista de personas asociadas como terceros en el trámite actual.
   * @type {TercerosrelacionadosdestinoTable[]}
   */
  personas: TercerosrelacionadosdestinoTable[] = [];
  /**
   * Indica si el formulario debe mostrarse en modo solo lectura.
   * Cuando es verdadero, el formulario se presenta únicamente para visualización,
   * deshabilitando la edición de los campos.
   * @type {modalRef}
   */
  @ViewChild('modalRef') modalRef!: ModalComponent;

  /**
 * Referencia al componente de terceros relacionados.
 * Permite acceder a los métodos y propiedades del componente TercerosrelacionadosComponent.
 * 
 * @public
 * @type {TercerosrelacionadosComponent}
 * @memberof TercerospageComponent
 */
  @ViewChild('tercerosRelacionadosRef') tercerosRelacionados!: TercerosrelacionadosComponent;

  /**
   * Indica si el formulario se encuentra en modo solo lectura.
   * Determina si el formulario debe mostrarse únicamente para lectura, sin permitir modificaciones.
   * @type {boolean}
   * @default false
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Catálogos de datos de la solicitud, como países y estados.
   * @type {DatosDeLaSolicitud}
   */
  catalogosDatos: DatosDeLaSolicitud = {} as DatosDeLaSolicitud;

  /**
   * Arreglo que contiene los datos del formulario de destinatarios.
   * Cada elemento representa un destinatario con la información correspondiente.
   */
  datosForma: DestinatarioForm[] = [];

  /**
   * Arreglo que contiene los destinatarios finales.
   * Cada elemento representa un destinatario con su información correspondiente.
   * @type {DestinatarioForm[]}
   */
  destinatario: DestinatarioForm[] = [];

  /**
   * Constructor del componente.
   * @param consultaQuery Servicio para consultar el estado de solo lectura.
   * @param certificadoZoosanitarioServices Servicio para actualizar terceros relacionados.
   * @param certificadoZoosanitarioQuery Servicio para consultar el estado de terceros relacionados.
   * @param tercerosrelacionadosService Servicio para obtener catálogos de terceros relacionados.
   */
  constructor(
    private consultaQuery: ConsultaioQuery,
    private readonly certificadoZoosanitarioServices: CertificadoZoosanitarioServiceService,
    public tercerosrelacionadosService: TercerosrelacionadosService,
    public certificadoZoosanitarioStore: ZoosanitarioStore,
    private catalogoService: CatalogosService,

  ) { }

  /**
   * Ciclo de vida de Angular que se ejecuta al iniciar el componente.
   * Suscribe al estado de solo lectura y a la lista de terceros relacionados.
   * @method ngOnInit
   */
  ngOnInit(): void {

    this.consultaQuery.selectConsultaioState$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((seccionState) => {
        this.esFormularioSoloLectura = seccionState?.readonly;
      });
    this.certificadoZoosanitarioServices.getAllDatosForma()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datosDeLaSolicitud) => {
        if (datosDeLaSolicitud) {
          this.personas = datosDeLaSolicitud.tercerosRelacionados;
          this.datosForma = datosDeLaSolicitud.datosForma;
        }
      });
  }

  /**
   * Ciclo de vida de Angular que se ejecuta después de inicializar la vista.
   * Carga los catálogos de países y estados.
   * @method ngAfterViewInit
   */
  ngAfterViewInit(): void {
    this.pairsCatalogChange();
    this.estadoCatalogChange();
  }

  /**
   * Carga el catálogo de países y lo asigna a la propiedad catalogosDatos.paises.
   * @method pairsCatalogChange
   */
  pairsCatalogChange(): void {
    this.catalogoService.obtieneCatalogoConsultaPaises(220201).pipe(takeUntil(this.destroyNotifier$)).subscribe(data => {
      this.catalogosDatos.paises = data.datos ?? [];
    });
  }

  /**
   * Carga el catálogo de estados y lo asigna a la propiedad catalogosDatos.estados.
   * @method estadoCatalogChange
   */
  estadoCatalogChange(): void {
    this.catalogoService.obtieneCatalogoEntidadesFederativas(220201,'MEX').pipe(takeUntil(this.destroyNotifier$)).subscribe(data => {
      this.catalogosDatos.estados = data.datos ?? [];
    });
  }

  /**
   * Elimina todos los terceros relacionados y actualiza el servicio correspondiente.
   * @method handleEliminar
   */
  handleEliminar(): void {
    this.personas = [];
    this.certificadoZoosanitarioServices.updateTercerosRelacionado([] as TercerosrelacionadosdestinoTable[]);
  }
  /**
  * Elimina todos los terceros relacionados y actualiza el servicio correspondiente.
  * @method handleEliminar
  */
  handleEliminarExportador(): void {
    this.personas = [];
    this.certificadoZoosanitarioStore.updatedatosForma([] as DestinatarioForm[]);
  }

  /**
   * Ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Libera recursos y cancela las suscripciones.
   * @method ngOnDestroy
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Abre el modal para agregar o editar un destinatario.
   * 
   * Si se proporciona el parámetro `data`, actualiza el destinatario seleccionado en el store
   * antes de abrir el modal. Luego, muestra el componente `AgregardestinatarioComponent` en el modal.
   * 
   * @param data Opcional. Datos del destinatario relacionado que se desea editar.
   */
  abrirModalDestinatario(data?: TercerosrelacionadosdestinoTable): void {
    if (data) {
      this.certificadoZoosanitarioStore.actualizarSelectedTerceros(data);
    }
    this.modalRef.abrir(AgregardestinatarioComponent);
  }

  /**
   * Abre el modal para agregar o editar un exportador.
   * 
   * Si se proporciona el objeto `data`, actualiza el exportador seleccionado en el store
   * `certificadoZoosanitarioStore` mediante el método `actualizarSelectedExdora`.
   * Luego, abre el modal utilizando el componente `AgregardestinatariofinalComponent`.
   * 
   * @param data - Información del exportador a agregar o editar.
   */
  abrirModalExportador(data: DestinatarioForm): void {
    if (data) {
      this.certificadoZoosanitarioStore.actualizarSelectedExdora(data);
    }
    this.modalRef.abrir(AgregardestinatariofinalComponent);
  }

  /**
   * Método para validar el formulario de terceros relacionados.
   * Delega la validación al componente hijo TercerosrelacionadosComponent.
   * Retorna el estado de validación del formulario completo.
   * 
   * @public
   * @method validarFormulario
   * @memberof TercerospageComponent
   * @returns {boolean} - True si el formulario es válido, false en caso contrario
   */
  validarFormulario(): boolean {
    return this.tercerosRelacionados.validarFormulario();
  }

}