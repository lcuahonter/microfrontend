import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ConfiguracionColumna, Destinatario, Fabricante260701,Notificacion,NotificacionesComponent,Pedimento,TERCEROS,TITULO_MODAL_AVISO, TablaDinamicaComponent, TablaSeleccion } from '@libs/shared/data-access-user/src';
import { Subject,map, takeUntil } from 'rxjs';
import { AlertComponent } from '@libs/shared/data-access-user/src/tramites/components/alert/alert.component';
import { CertificadosLicenciasService } from '../../services/certificados-licencias.service';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { TercerosRelacionadosModalComponent } from '../terceros-relacionados-modal/terceros-relacionados-modal.component';
import { TituloComponent } from '@libs/shared/data-access-user/src/tramites/components/titulo/titulo.component';

/**
 * Componente `TercerosRelacionadosComponent` que gestiona la visualización y manipulación
 * de datos relacionados con terceros y fabricantes en el contexto de la aplicación.
 * 
 * Este componente incluye funcionalidades para:
 * - Mostrar tablas dinámicas con datos de destinatarios y fabricantes.
 * - Gestionar la selección de filas en las tablas.
 * - Abrir y controlar cuadros de diálogo modales.
 * - Suscribirse a servicios para obtener datos de destinatarios y fabricantes.
 * - Limpiar recursos al destruir el componente.
 * ```
 */
@Component({
  selector: 'app-terceros-relacionados',
  standalone: true,
  providers: [BsModalService],
  imports: [CommonModule, TituloComponent, TablaDinamicaComponent, AlertComponent,NotificacionesComponent],
  templateUrl: './terceros-relacionados.component.html',
  styleUrl: './terceros-relacionados.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class TercerosRelacionadosComponent implements OnInit,OnDestroy {

  /**
   * Una constante que contiene la referencia al objeto `TERCEROS`.
   * Esto se utiliza para gestionar o mostrar texto relacionado con terceros
   * en el contexto de la aplicación.
   */
  TEXTOS = TERCEROS;

  /**
   * Representa una nueva instancia de notificación asociada con el componente.
   * Esta propiedad se utiliza para gestionar y almacenar datos de notificaciones.
   */
  public nuevaNotificacion!: Notificacion;
  /**
   * Representa el identificador de un elemento a eliminar.
   * Esta propiedad se utiliza para almacenar el ID o índice del elemento específico
   * que está marcado para ser eliminado dentro de una colección o lista.
   */
  public elementoParaEliminar!: number;
  public pedimentos: Array<Pedimento> = [];
  /**
   * Una referencia a la instancia del modal de Bootstrap.
   * Esto se utiliza para controlar e interactuar con el cuadro de diálogo modal.
   * Es opcional y puede ser indefinido si no hay ningún modal activo actualmente.
   */
  modalRef?: BsModalRef;
  /**
   * Un subject utilizado como notificador para señalar la destrucción del componente.
   * Esto se utiliza típicamente para desuscribirse de observables y prevenir fugas de memoria.
   * Emite un valor `void` cuando el componente es destruido.
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * Un arreglo que contiene los datos de los destinatarios.
   * Cada elemento en el arreglo es de tipo `Destinatario`.
   * Esta propiedad se utiliza para gestionar y almacenar información sobre los destinatarios relacionados.
   */
  public destinatarioDatos: Destinatario[] = [];
  /**
   * Un arreglo que contiene datos relacionados con los fabricantes (Fabricante260701).
   * Esto se utiliza para gestionar y mostrar información sobre los fabricantes
   * asociados con el proceso o aplicación actual.
   */
  public fabricanteTablaDatos: Fabricante260701[] = [];
  /** Configuración de la tabla de sectores */
  public configuracionTabla: ConfiguracionColumna<Destinatario>[] = [
    { encabezado: 'Nombre/denominación o razón social', clave: (item: Destinatario) => item.nombre, orden: 1 },
    { encabezado: 'R.F.C', clave: (item: Destinatario) => item.rfc, orden: 2 },
    { encabezado: 'CURP', clave: (item: Destinatario) => item.curp, orden: 3 },
    { encabezado: 'Teléfono', clave: (item: Destinatario) => item.telefono, orden: 4 },
    { encabezado: 'Correo electrónico', clave: (item: Destinatario) => item.correoElectronico, orden: 5 },
    { encabezado: 'Calle', clave: (item: Destinatario) => item.calle, orden: 6 },
    { encabezado: 'Número exterior', clave: (item: Destinatario) => item.numeroExterior, orden: 7 },
    { encabezado: 'Número interior', clave: (item: Destinatario) => item.numeroInterior, orden: 8 },
    { encabezado: 'País', clave: (item: Destinatario) => item.pais, orden: 9 },
    { encabezado: 'Colonia', clave: (item: Destinatario) => item.colonia, orden: 10 },
    { encabezado: 'Localidad', clave: (item: Destinatario) => item.localidad, orden: 11 },
    { encabezado: 'Municipio o alcaldía', clave: (item: Destinatario) => item.municipio, orden: 12 },
    { encabezado: 'Entidad federativa', clave: (item: Destinatario) => item.entidadFederativa, orden: 13 },
    { encabezado: 'Estado/localidad', clave: (item: Destinatario) => item.estado, orden: 14 },
    { encabezado: 'Código postal', clave: (item: Destinatario) => item.codigoPostal, orden: 15 },
    { encabezado: 'Colonia o equivalente', clave: (item: Destinatario) => item.coloniaEquivalente, orden: 16 }
  ];

  /** Configuración de la tabla de sectores */
  public configuracionTablaFabricante: ConfiguracionColumna<Fabricante260701>[] = [
    { encabezado: 'Nombre/denominación o razón social', clave: (item: Fabricante260701) => item.nombre, orden: 1 },
    { encabezado: 'R.F.C', clave: (item: Fabricante260701) => item.rfc, orden: 2 },
    { encabezado: 'CURP', clave: (item: Fabricante260701) => item.curp, orden: 3 },
    { encabezado: 'Teléfono', clave: (item: Fabricante260701) => item.telefono, orden: 4 },
    { encabezado: 'Correo electrónico', clave: (item: Fabricante260701) => item.correoElectronico, orden: 5 },
    { encabezado: 'Calle', clave: (item: Fabricante260701) => item.calle, orden: 6 },
    { encabezado: 'Número exterior', clave: (item: Fabricante260701) => item.numeroExterior, orden: 7 },
    { encabezado: 'Número interior', clave: (item: Fabricante260701) => item.numeroInterior, orden: 8 },
    { encabezado: 'País', clave: (item: Fabricante260701) => item.pais, orden: 9 },
    { encabezado: 'Colonia', clave: (item: Fabricante260701) => item.colonia, orden: 10 },
    { encabezado: 'Localidad', clave: (item: Fabricante260701) => item.localidad, orden: 11 },
    { encabezado: 'Municipio o alcaldía', clave: (item: Fabricante260701) => item.municipio, orden: 12 },
    { encabezado: 'Entidad federativa', clave: (item: Fabricante260701) => item.entidadFederativa, orden: 13 },
    { encabezado: 'Estado/localidad', clave: (item: Fabricante260701) => item.estado, orden: 14 },
    { encabezado: 'Código postal', clave: (item: Fabricante260701) => item.cp, orden: 15 }
  ];

  /**
   * Representa el modo de selección con casillas de verificación para la tabla.
   * Esta propiedad se asigna con el valor de `TablaSeleccion.CHECKBOX`,
   * que probablemente define una constante o enumeración para habilitar
   * la funcionalidad de casillas de verificación en un componente de tabla.
   */
  public checkbox = TablaSeleccion.CHECKBOX;
  /**
   * Indica si una fila está seleccionada en el contexto actual.
   * Esta propiedad se utiliza para rastrear el estado de selección de una fila.
   * 
   * @type {boolean}
   */
  public tieneFilaSeleccionada: boolean = false;
  /**
   * Indica si una fila está seleccionada para el fabricante.
   * Esta propiedad se utiliza para rastrear el estado de selección en la interfaz de usuario.
   */
  public tieneFilaSeleccionadaFabricante: boolean = false;
  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
    public esFormularioSoloLectura: boolean = false;

  /**
   * Constructor del componente TercerosRelacionadosComponent.
   * @param certificadosLicenciasSvc - Servicio para manejar operaciones relacionadas con certificados y licencias.
   * @param modalService - Servicio para gestionar cuadros de diálogo modales.
   */
  constructor(
      private certificadosLicenciasSvc: CertificadosLicenciasService,
      private consultaioQuery: ConsultaioQuery,
      @Inject(BsModalService)
    public modalService: BsModalService,
  ) {
      this.consultaioQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$),map((seccionState) => {
            this.esFormularioSoloLectura = seccionState.readonly;
        })
      ).subscribe();
  }

  /**
   * Gancho del ciclo de vida que se llama después de que Angular ha inicializado todas las propiedades enlazadas a datos de una directiva.
   * 
   * En esta implementación:
   * - Se suscribe a `getDestinatarioDatos` de `certificadosLicenciasSvc` para obtener y asignar datos de destinatarios (`destinatarioDatos`).
   * - Se suscribe a `getFabricanteDatos` de `certificadosLicenciasSvc` para obtener y asignar datos de fabricantes (`fabricanteTablaDatos`).
   * - Ambas suscripciones se gestionan utilizando `takeUntil` con `destroyNotifier$` para garantizar una limpieza adecuada y evitar fugas de memoria.
   */
  ngOnInit(): void {
    this.certificadosLicenciasSvc.getDestinatarioDatos().pipe(takeUntil(this.destroyNotifier$)).subscribe((response) => {
        const DATOS = JSON.parse(JSON.stringify(response));
        this.destinatarioDatos = DATOS;
    });

    this.certificadosLicenciasSvc.getFabricanteDatos().pipe(takeUntil(this.destroyNotifier$)).subscribe((response) => {
        const DATOS = JSON.parse(JSON.stringify(response));
        this.fabricanteTablaDatos = DATOS;
    });
  }

  /**
   * Actualiza el estado de si una fila está seleccionada en la tabla de destinatarios.
   */
  public setTablaSeleccionDestinatario(rowSeleccion: Destinatario[]): void {
    this.tieneFilaSeleccionada = rowSeleccion.length > 0 ? true : false;
  }

  /**
   * Actualiza el estado que indica si hay filas seleccionadas en la tabla de "Fabricante".
   */
  public setTablaSeleccionFabricante(rowSeleccion: Fabricante260701[]): void {
    this.tieneFilaSeleccionadaFabricante = rowSeleccion.length > 0 ? true : false;
  }

  /**
   * Abre un cuadro de diálogo modal para gestionar fabricantes relacionados.
   *
   * @param titulo - El título que se mostrará en el cuadro de diálogo modal.
   * 
   * Este método inicializa el modal con el título especificado y lo muestra
   * utilizando el componente `TercerosRelacionadosModalComponent`. El modal se configura
   * con un tamaño extra grande (`modal-xl`) para una mejor visibilidad.
   */
  public abrirFabricanteModal(titulo: string): void {
    const INITIAL_STATE: ModalOptions = {
      class: 'modal-xl',
      initialState: {
        titulo: titulo
      }
    };
    this.modalRef = this.modalService.show(TercerosRelacionadosModalComponent, INITIAL_STATE);
    this.modalRef.content.onClose.pipe(takeUntil(this.destroyNotifier$)).subscribe((result: Destinatario) => {
      if (result) {
        const FORM_VALOR = {
            nombre: result?.nombre,
            rfc: result?.rfc,
            curp: result?.curp,
            telefono: result?.telefono,
            correoElectronico: result?.correoElectronico,
            calle: result?.calle,
            numeroExterior: result.numeroExterior,
            numeroInterior: result.numeroInterior,
            pais: result.pais,
            colonia: result.colonia,
            municipio: result.municipio,
            localidad: result.localidad,
            entidadFederativa: result.entidadFederativa,
            estado: result.estado,
            codigoPostal: result.codigoPostal,
            coloniaEquivalente: result.coloniaEquivalente,
        }
        if(titulo === 'Destinatario (destino final)') {
          this.destinatarioDatos = [...this.destinatarioDatos, FORM_VALOR];
        }
      }
    });
  }

    /**
   * Elimina un elemento de la lista de pedimentos en la posición especificada.
   * 
   * @param {number} i - El índice del elemento a eliminar.
   * 
   * @remarks
   * Después de eliminar el elemento, se actualiza el título y mensaje del modal,
   * y se abre el modal para mostrar un aviso al usuario.
   */
    public abrirModal(i: number = 0): void {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: TITULO_MODAL_AVISO,
        mensaje: '¿Confirma la eliminación?',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      }
  
      this.elementoParaEliminar = i;
    }

  /**
   * Elimina un elemento de la tabla de pedimento, si se confirma la acción.
   * @param borrar Indica si se debe proceder con la eliminación.
   * @returns {void}
   */
  public eliminarPedimento(borrar: boolean): void {
    if (borrar) {
      this.pedimentos.splice(this.elementoParaEliminar, 1);
    }
    if(this.tieneFilaSeleccionada) {
      this.destinatarioDatos.pop();
    }
    if(this.tieneFilaSeleccionadaFabricante) {
      this.fabricanteTablaDatos.pop();
    }
  }


/**
 * Método para actualizar el banco seleccionado.
 * @param e {Catalogo} Banco seleccionado.
 */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

}
