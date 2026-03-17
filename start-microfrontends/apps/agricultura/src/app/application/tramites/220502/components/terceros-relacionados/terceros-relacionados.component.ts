import {
  AlertComponent,
  TablaDinamicaComponent,
  TablaSeleccion,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  DESTINATARIO_CONFIGURACION_TABLA,
  EXPORTADOR_CONFIGURACION_TABLA,
} from '../../enums/sagarpa.enum';
import { Destinatario, Exportador } from '../../models/pago-de-derechos.model';
import {
  ITEMS,
  PERSONA,
  TERCEROS_TEXTO_DE_ALERTA,
} from '../../constantes/constantes';
import { ReplaySubject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { NotificacionesService } from '@libs/shared/data-access-user/src/core/services/shared/notificaciones.service';
import { ReactiveFormsModule } from '@angular/forms';
import { SolicitudPantallasService } from '../../services/solicitud-pantallas.service';

/**
 * Componente para gestionar los terceros relacionados.
 */
@Component({
  selector: 'app-terceros-relacionados',
  templateUrl: './terceros-relacionados.component.html',
  styleUrl: './terceros-relacionados.component.scss',
  standalone: true,
  imports: [
    TituloComponent,
    CommonModule,
    ReactiveFormsModule,
    AlertComponent,
    TablaDinamicaComponent,
  ],
})
export class TercerosRelacionadosComponent implements OnInit, OnDestroy {
  /**
   * Texto de alerta utilizado en el componente.
   */
  TEXTO_DE_ALERTA: string = TERCEROS_TEXTO_DE_ALERTA;

  /**
   * Indica si la barra de desplazamiento está habilitada.
   */
  @Input() enableScrollbar: boolean = false;

  /**
   * Lista de elementos de tipo Row.
   */
  items = ITEMS;

  /**
   * Lista de elementos de tipo Rows.
   */
  persona = PERSONA;

  /**
   * Constante para la selección de la tabla.
   */
  TablaSeleccion = TablaSeleccion;

  /**
   * Configuración de la tabla de exportadores.
   */
  public exportadorConfiguracionTabla = EXPORTADOR_CONFIGURACION_TABLA;

  /**
   * Configuración de la tabla de destinatarios.
   */
  public destinatarioConfiguracionTabla = DESTINATARIO_CONFIGURACION_TABLA;

  /**
   * Datos de exportadores que se muestran en la tabla.
   */
  public exportadorDatos: Exportador[] = [];

  /**
   * Datos de destinatarios que se muestran en la tabla.
   */
  public destinatarioDatos: Destinatario[] = [];

  /**
   * Subject para manejar la destrucción del componente y evitar fugas de memoria.
   */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /**
   * Tabla auxiliar de exportadores.
   */
  exportadorTabla: Exportador[] = [];

  /**
   * Tabla auxiliar de destinatarios.
   */
  destinatarioTabla: Destinatario[] = [];

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  formularioDeshabilitado: boolean = false;

  /**
   * @constructor
   * Inyecta los servicios necesarios para el funcionamiento del componente.
   *
   * @param solicitudPantallasService - Servicio encargado de gestionar la lógica y operaciones relacionadas con las pantallas de solicitud.
   * @param consultaioQuery - Servicio para consultar y obtener el estado actual de la consulta.
   */
  constructor(
    private solicitudPantallasService: SolicitudPantallasService,
    private consultaioQuery: ConsultaioQuery,
    private NOTIF: NotificacionesService
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.formularioDeshabilitado = seccionState.readonly;
        })
      )
      .subscribe();
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Obtiene los datos de exportadores y destinatarios.
   */
  ngOnInit(): void {
    this.obtenerTablaExportador();
    this.obtenerTablaDestinatario();
  }

  /**
   * Obtiene los datos de exportadores desde el servicio y los asigna a la propiedad correspondiente.
   */
  public obtenerTablaExportador(): void {
    this.solicitudPantallasService
      .obtenerTablaExportador()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        if(data.codigo!=='00'){
         this.NOTIF.showNotification({
          tipoNotificacion: 'toastr',
          categoria: 'danger',
          mensaje: data.mensaje ? data.mensaje : '',
          titulo: 'Error',
          modo: '',
          cerrar: true,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: 'Cancelar',
        });
        }
        this.exportadorDatos = data.datos;
      });
  }

  /**
   * Obtiene los datos de destinatarios desde el servicio y los asigna a la propiedad correspondiente.
   */
  public obtenerTablaDestinatario(): void {
    this.solicitudPantallasService
      .obtenerTablaDestinatario()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
          if(data.codigo!=='00'){
         this.NOTIF.showNotification({
          tipoNotificacion: 'toastr',
          categoria: 'danger',
          mensaje: data.mensaje ? data.mensaje : '',
          titulo: 'Error',
          modo: '',
          cerrar: true,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: 'Cancelar',
        });
        }
        this.destinatarioDatos = data.datos;
      });
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Libera los recursos y cancela las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
