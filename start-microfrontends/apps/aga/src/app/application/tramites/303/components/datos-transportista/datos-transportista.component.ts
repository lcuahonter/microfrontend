import { Component, OnDestroy, OnInit } from '@angular/core';
import { Notificacion, TablaSeleccion, Transportista } from '@libs/shared/data-access-user/src';
import { Subject, map, takeUntil } from 'rxjs';
import { Tramite303Store, Tramite303StoreService } from '../../../../core/estados/tramites/tramite303.store';
import { CONFIGURACION_ENCABEZADO_TRASPORTISTA } from '../../../../core/enums/303/trasportistas.enum';
import { Router } from '@angular/router';
import { Tramite303Query } from '../../../../core/queries/tramite303.query';

@Component({
  selector: 'datos-transportista',
  templateUrl: './datos-transportista.component.html',
  styleUrls: ['./datos-transportista.component.scss']
})
export class DatosTransportistaComponent implements OnDestroy, OnInit {
  /** Configuración de la tabla de selección */
  tablaSeleccion = TablaSeleccion;
  /** Configuración de la tabla de transportistas */
  encabezadoDeTablaTrasportista = CONFIGURACION_ENCABEZADO_TRASPORTISTA;
  /** Lista de transportistas seleccionados */
  personasTrasportistas: Transportista[] = [];
  /** Lista de transportistas seleccionados */
  trasportistasSeleccionados: Transportista[] = [];
  /** Notificador para destruir las suscripciones y evitar fugas de memoria */
  private destroyNotifier$: Subject<void> = new Subject();
  /** Estado del trámite 303 consultado */
  public tramiteConsultado?: Tramite303Store;
  /** Notificación a mostrar al usuario */
  public nuevaNotificacion!: Notificacion;
  /** Estado del modal de registro de transportista */
  registrarTrasportistaModal = false;
  /**
   * Constructor para el componente de datos del transportista.
   * @param tramite303Query - Consulta para el trámite 303.
   * @param router - Router para la navegación.
   * @param tramite303State - Estado del trámite 303.
   */
  constructor(private tramite303Query: Tramite303Query,
    private router: Router,
    private tramite303State: Tramite303StoreService,
  ) { }
  /**
   * Método para inicializar el componente.
   */
  ngOnInit(): void {
    this.tramite303Query.selectSolicitud$
      .pipe(
        map((seccionState) => {
          this.tramiteConsultado = seccionState;
          this.personasTrasportistas = seccionState?.listaTransportistas || [];
        }),
        takeUntil(this.destroyNotifier$)
      )
      .subscribe();
  }

  /**
   * Método para agregar un nuevo transportista.
   * Redirige al usuario a la página de registro de transportista.
   */
  agregarTransportista(): void {
    this.registrarTrasportistaModal = true;
  }

  /**
   * Método para destruir el componente y liberar recursos.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Método para eliminar un transportista.
   * Elimina un transportista de la lista de transportistas.
   */
  eliminarTransportista(): void {
    const IDS_TO_DELETE = this.trasportistasSeleccionados.map(trasportista => trasportista.idPersonaTransportista);
    this.personasTrasportistas = this.personasTrasportistas.filter(trasportista => !IDS_TO_DELETE.includes(trasportista.idPersonaTransportista));
    this.trasportistasSeleccionados = [];
    this.tramite303State.setListaTransportistas(this.personasTrasportistas);
  }

  /**
   * Método para modificar un transportista.
   * Redirige al usuario a la página de registro de transportista.
   */
  modificarTransportista(): void {
    if (this.trasportistasSeleccionados.length === 0) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'warning',
        modo: 'action',
        titulo: 'Aviso',
        mensaje: 'Debe seleccionar un transportista para modificar.',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }
    if (this.trasportistasSeleccionados.length > 1) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'warning',
        modo: 'action',
        titulo: 'Aviso',
        mensaje: 'Solo puede modificar un transportista a la vez.',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }
    const TRANSPORTISTA_SELECCIONADO = this.trasportistasSeleccionados[0];
    this.tramite303State.trasportistaModificar(TRANSPORTISTA_SELECCIONADO);
    this.router.navigate(['aga/despacho-mercancias/registro-trasportista']);
  }
}