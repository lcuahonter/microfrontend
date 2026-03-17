import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DatosDeLaSolicitud, TercerosrelacionadosdestinoTable } from '../../../../shared/models/tercerosrelacionados.model';
import { Subject, takeUntil } from 'rxjs';
import { AgregardestinatarioComponent } from '../agregardestinatario/agregardestinatario.component';
import { AgregardestinatariofinalComponent } from '../agregardestinatariofinal/agregardestinatariofinal.component';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DestinatarioForm } from '../../../220203/models/220203/importacion-de-acuicultura.module';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { NotificacionesService } from '@libs/shared/data-access-user/src/core/services/shared/notificaciones.service';
import { Solicitud220503Store } from '../../estados/tramites220503.store';
import { Solocitud220503Service } from '../../services/service220503.service';
import { TercerosrelacionadosComponent } from '../../../../shared/components/tercerosrelacionados/tercerosrelacionados.component';
import { TercerosrelacionadosService } from '../../../../shared/components/services/tercerosrelacionados/tercerosrelacionados.service';

import { RevisionService } from '../../services/revision.service';
import { Solicitud220503Query } from '../../estados/tramites220503.query';
import { TercerosrelacionadosTableComponent } from '../../components/tercerosrelacionados/tercerosrelacionados.component';

@Component({
  selector: 'app-terceros-relacionados',
  templateUrl: './terceros-relacionados.component.html',
  styleUrl: './terceros-relacionados.component.scss',
  standalone: true,
  imports: [ CommonModule,
     TercerosrelacionadosComponent,
     ModalComponent,TercerosrelacionadosTableComponent], // Importa los módulos necesarios aquí
})
export class TercerosRelacionadosComponent implements OnInit, OnDestroy,AfterViewInit,OnChanges {
  @Input() isActive: boolean = false;
  /**
    * Sujeto para manejar la destrucción de observables y evitar fugas de memoria.
    * Se utiliza con el operador takeUntil para completar suscripciones al destruir el componente.
    * 
    * @private
    * @type {Subject<void>}
    * @memberof TercerospageComponent
    */
   private DESTROY_NOTIFIER$ = new Subject<void>();
 
   /**
    * Lista de personas asociadas como terceros relacionados en el trámite actual.
    * Contiene información de destinatarios y otros terceros involucrados en la importación.
    * 
    * @public
    * @type {TercerosrelacionadosdestinoTable[]}
    * @memberof TercerospageComponent
    */
   personas: TercerosrelacionadosdestinoTable[] = [];
 
   /**
    * Referencia al componente modal para mostrar formularios de destinatarios.
    * Permite abrir y cerrar modales para agregar o editar información de terceros.
    * 
    * @public
    * @type {ModalComponent}
    * @memberof TercerospageComponent
    */
   @ViewChild('modalRef') modalRef!: ModalComponent;
    /**
   * Subject para desuscribirse de los observables.
   * @type {Subject<void>}
   */
  private destroyed$ = new Subject<void>();
 
   /**
    * Indica si el formulario se encuentra en modo solo lectura.
    * Cuando es verdadero, deshabilita la edición de campos y funciones de modificación.
    * 
    * @public
    * @type {boolean}
    * @default false
    * @memberof TercerospageComponent
    */
   esFormularioSoloLectura: boolean = false;
 
   /**
    * Catálogos de datos de la solicitud incluyendo países, estados y otros elementos de selección.
    * Contiene las opciones disponibles para los campos de selección en los formularios.
    * 
    * @public
    * @type {DatosDeLaSolicitud}
    * @memberof TercerospageComponent
    */
   catalogosDatos: DatosDeLaSolicitud = {} as DatosDeLaSolicitud;
 
   /**
    * Datos del formulario relacionados con destinatarios finales.
    * Almacena la información específica de los destinatarios exportadores.
    * 
    * @public
    * @type {DestinatarioForm[]}
    * @memberof TercerospageComponent
    */
   datosForma: DestinatarioForm[] = [];
 
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
    * Constructor del componente TercerospageComponent.
    * Inicializa las dependencias necesarias para el funcionamiento del componente de terceros relacionados.
    * Configura los servicios para consultas, manejo de datos y operaciones con terceros.
    * 
    * @constructor
    * @param {ConsultaioQuery} consultaQuery - Query para consultas del estado de solo lectura
    * @param {ImportacionDeAcuiculturaService} certificadoZoosanitarioServices - Servicio para operaciones de importación de acuicultura
    * @param {TercerosrelacionadosService} tercerosrelacionadosService - Servicio para obtener catálogos de terceros relacionados
    * @param {AcuiculturaStore} certificadoZoosanitarioStore - Store para el manejo del estado de acuicultura
    * @memberof TercerospageComponent
    */
   constructor(
     private consultaQuery: ConsultaioQuery,
     private readonly certificadoZoosanitarioServices: Solocitud220503Service,
     public tercerosrelacionadosService: TercerosrelacionadosService,
     public certificadoZoosanitarioStore: Solicitud220503Store,
        public solicitud220503Query: Solicitud220503Query,
          private NOTIF: NotificacionesService,
           private revisionService: RevisionService,
 
   ) { }
 
   /**
    * Método del ciclo de vida OnInit de Angular.
    * Inicializa las suscripciones para el estado de solo lectura y los datos de terceros relacionados.
    * Configura la observación de cambios en el estado del formulario y los datos del trámite.
    * 
    * @public
    * @method ngOnInit
    * @memberof TercerospageComponent
    * @returns {void}
    */
   ngOnInit(): void {
     this.consultaQuery.selectConsultaioState$
       .pipe(takeUntil(this.DESTROY_NOTIFIER$))
       .subscribe((seccionState) => {
         this.esFormularioSoloLectura = seccionState?.readonly;
       });
     this.certificadoZoosanitarioServices.getAllDatosForma()
       .pipe(takeUntil(this.DESTROY_NOTIFIER$))
       .subscribe((datosDeLaSolicitud) => {
         if (datosDeLaSolicitud) {
      
           this.datosForma = datosDeLaSolicitud.datosForma;
         }
       });


     
   }
 
   /**
    * Método del ciclo de vida AfterViewInit de Angular.
    * Se ejecuta después de que la vista del componente se ha inicializado completamente.
    * Carga los catálogos necesarios para los campos de selección de países y estados.
    * 
    * @public
    * @method ngAfterViewInit
    * @memberof TercerospageComponent
    * @returns {void}
    */
   ngAfterViewInit(): void {
     this.pairsCatalogChange();
     this.estadoCatalogChange();
   }

   ngOnChanges():void {
  if (this.isActive) {
    const IDSOLICITUD = String(this.solicitud220503Query.getValue().id_solicitud);
   this.getTercerosPorTipo('220503', IDSOLICITUD,'DES')
   this.getTercerosPorTipo('220503', IDSOLICITUD,'EXP')
   
  }
}
 
   /**
    * Método para cargar el catálogo de países de procedencia.
    * Obtiene la lista de países disponibles desde el servicio de terceros relacionados.
    * Asigna los datos del catálogo a la propiedad catalogosDatos.paises para su uso en formularios.
    * 
    * @public
    * @method pairsCatalogChange
    * @memberof TercerospageComponent
    * @returns {void}
    */
   pairsCatalogChange(): void {
     this.tercerosrelacionadosService.obtenerSelectorList('paisprocedencia.json')
       .pipe(takeUntil(this.DESTROY_NOTIFIER$))
       .subscribe(data => {
         this.catalogosDatos.paises = data;
       });
   }
 
   /**
    * Método para cargar el catálogo de estados o entidades federativas.
    * Obtiene la lista de estados disponibles desde el servicio de terceros relacionados.
    * Asigna los datos del catálogo a la propiedad catalogosDatos.estados para su uso en formularios.
    * 
    * @public
    * @method estadoCatalogChange
    * @memberof TercerospageComponent
    * @returns {void}
    */
   estadoCatalogChange(): void {
     this.tercerosrelacionadosService.obtenerSelectorList('estados.json')
       .pipe(takeUntil(this.DESTROY_NOTIFIER$))
       .subscribe(data => {
         this.catalogosDatos.estados = data;
       });
   }
 
   /**
    * Método para eliminar todos los terceros relacionados.
    * Limpia la lista de personas y actualiza el servicio correspondiente con una lista vacía.
    * Se utiliza para resetear completamente los terceros relacionados del trámite.
    * 
    * @public
    * @method handleEliminar
    * @memberof TercerospageComponent
    * @returns {void}
    */
   handleEliminar(): void {
     this.personas = [];
     this.certificadoZoosanitarioServices.updateTercerosRelacionado([] as TercerosrelacionadosdestinoTable[]);
   }
 
   /**
    * Método para eliminar todos los exportadores/destinatarios finales.
    * Limpia la lista de datos del formulario y actualiza el store correspondiente con una lista vacía.
    * Se utiliza para resetear completamente los destinatarios finales del trámite.
    * 
    * @public
    * @method handleEliminarExportador
    * @memberof TercerospageComponent
    * @returns {void}
    */
   handleEliminarExportador(): void {
     this.personas = [];
     this.certificadoZoosanitarioStore.updatedatosForma([] as DestinatarioForm[]);
   }
 
 
   /**
    * Método del ciclo de vida OnDestroy de Angular.
    * Limpia las suscripciones para evitar fugas de memoria al destruir el componente.
    * Completa el subject DESTROY_NOTIFIER$ para cancelar todas las suscripciones activas.
    * 
    * @public
    * @method ngOnDestroy
    * @memberof TercerospageComponent
    * @returns {void}
    */
   ngOnDestroy(): void {
     this.DESTROY_NOTIFIER$.next();
     this.DESTROY_NOTIFIER$.complete();
   }
 
   /**
    * Método para abrir el modal de agregar/editar destinatario.
    * Si se proporciona data, actualiza el store con la información del tercero seleccionado.
    * Abre el modal con el componente AgregardestinatarioComponent.
    * 
    * @public
    * @method abrirModalDestinatario
    * @param {TercerosrelacionadosdestinoTable} [data] - Datos del tercero a editar (opcional)
    * @memberof TercerospageComponent
    * @returns {void}
    */
   abrirModalDestinatario(data?: TercerosrelacionadosdestinoTable): void {
     if (data) {
       this.certificadoZoosanitarioStore.actualizarSelectedTerceros(data);
     }
     this.modalRef.abrir(AgregardestinatarioComponent);
   }
 
   /**
    * Método para abrir el modal de agregar/editar exportador final.
    * Actualiza el store con la información del destinatario seleccionado.
    * Abre el modal con el componente AgregardestinatariofinalComponent.
    * 
    * @public
    * @method abrirModalExportador
    * @param {DestinatarioForm} data - Datos del destinatario a editar
    * @memberof TercerospageComponent
    * @returns {void}
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


getTercerosPorTipo(
  tramite: string,
  codigo: string,
  tipoTercero: string
): void {
  this.revisionService
    .getTercerosPorTipoData(tramite, codigo, tipoTercero)
    .pipe(takeUntil(this.destroyed$))
    .subscribe((resp) => {
      if (resp.codigo !== '00') {
        this.NOTIF.showNotification({
          tipoNotificacion: 'toastr',
          categoria: 'danger',
          mensaje: resp.mensaje ?? '',
          titulo: 'Error',
          modo: '',
          cerrar: true,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: 'Cancelar',
        });
        return;
      }

      const DATA = resp.datos;

    
      if (tipoTercero === 'DES') {
        this.personas = DATA.map((item) => ({
       
          tipoMercancia: '',
          nombre: '',
          primerApellido: '',
          numeroExterior: '',
          razonSocial: item.nombre_razon_social,
          pais: item.pais,
          calle: item.calle,
          colonia: item.colonia,
          municipio: item.municipio_alcaldia,
          estado: item.entidad_federativa,
          codigoPostal: item.codigo_postal,
          correo: item.correo_electronico,
        }));
      } 
      else {
        this.datosForma = DATA.map((item) => ({
          tipoMercancia: 'no', // valor por defecto
          nombre: '',
          primerApellido: '',
          segundoApellido: '',
          razonSocial: item.nombre_razon_social,
          pais: item.pais,
          domicilio: item.domicilio,
          lada: '',
          telefono: '',
          correo: item.correo_electronico,
        }));
      }
    });
  }
}
