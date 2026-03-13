import {
  AlertComponent,
  ConsultaioQuery,
  ConsultaioState,
} from '@ng-mf/data-access-user';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Input } from '@angular/core';
import { Solicitud } from '../../models/pantallas-captura.model';
import { TEXTOS } from '../../constantes/certificado-zoosanitario.enum';
import { TituloComponent } from '@ng-mf/data-access-user';

import { Subject, map, takeUntil } from 'rxjs';
import { SOLICITUD_HEADER } from '../../constantes/disponibles-constante.enum';

/**
 * Componente que representa los datos de la solicitud.
 */
@Component({
  selector: 'app-solicitud-datos',
  standalone: true,
  imports: [TituloComponent, AlertComponent],
  templateUrl: './solicitud-datos.component.html',
  styleUrl: './solicitud-datos.component.scss',
})
/**
 * Componente que representa los datos de la solicitud
 */
export class SolicitudDatosComponent implements OnInit, OnDestroy {
  /**
   * Obtiene los datos de enumeración y establece valores de TEXTOS
   */
  TEXTOS = TEXTOS;
  /**
   * Controla la visibilidad del panel plegable.
   * El valor predeterminado está establecido en verdadero (ampliado)
   */
  colapsable: boolean = true;
  /**
   * Contiene los datos del encabezado de la tabla, definidos en `SOLICITUD_HEADER.hSolicitud`.
   */
  tablaHeadData = SOLICITUD_HEADER.hSolicitud;
  /**
   * Recibe la lista de solicitudes como datos de fila de la tabla.
   */
  @Input() tablaFilaDatos: Solicitud[] = [];

  /**
   * Indica si el formulario es de solo lectura.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Sujeto que actúa como notificador para destruir suscripciones activas.
   * Se utiliza en combinación con operadores como `takeUntil` para evitar fugas de memoria
   * al cancelar automáticamente las suscripciones cuando el componente se destruye.
   */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * Evento de salida que emite la fila seleccionada de la tabla.
   * Se utiliza para notificar a componentes padres cuando una fila es seleccionada.
   */
  @Output() filaSeleccionada: EventEmitter<Solicitud> = new EventEmitter<Solicitud>();
    
  /**
   * Objeto de tipo `Solicitud` que actúa como un ejemplo o datos simulados (mock).
   * Este objeto contiene información predeterminada para representar una solicitud,
   * incluyendo detalles como el régimen, tipo de producto, país de procedencia,
   * clasificación de mercancía, fracción arancelaria, descripción del producto, entre otros.
   * Se utiliza para pruebas o inicialización de datos en el componente.
   */
  MOCK_SOLICITUD: Solicitud = {
    regimen: 'definitivos',
    tipoProducto: '1',
    paisProcedencia: '1',
    clasificacionMercancia: '1',
    fraccionArancelaria: '1',
    descFraccionArancelaria: '100',
    cantidadLetra: '10',
    genero: '1',
    especie: '1',
    nombreComun: '1',
    descripcionProducto: '1',
    cantidadUMC: '1',
    manifiestosYdesc: true,
    fechaCreacion: '',
    mercancia: '',
    cantidad: '1',
    proovedor: 'Example Proveedor',
    seleccionarsRangoDias: 'ANGUILLA',
    seleccionarsRangoDiasAduanas: 'ANGUILLA',
    seleccionarsRangoDiasPaisOrigen: 'ANGUILLA',
    seleccionarsRangoDiasDestino: 'ANGUILLA',
  };
  /**
   * Estado de los datos de consulta.
   */
  consultaDatos!: ConsultaioState;

  /** Estado de la consulta que se obtiene del store. */
  public consultaState!: ConsultaioState;
  constructor(private consultaioQuery: ConsultaioQuery) {}
  ngOnInit(): void {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState: ConsultaioState) => {
          this.consultaState = seccionState;
          this.esFormularioSoloLectura = this.consultaState.readonly || false;
          if (this.esFormularioSoloLectura) {
            this.colapsable = false;
          }
        })
      )
      .subscribe();
  }

  /**
   * Método que se ejecuta al hacer clic en una fila de la tabla.
   * Emite el objeto `MOCK_SOLICITUD` a través del evento de salida `filaSeleccionada`
   * para notificar al componente padre sobre la fila seleccionada.
   */
  enFilahacerClic(): void {
    this.filaSeleccionada.emit(this.MOCK_SOLICITUD);
  }
  /**
   * Alterna el panel plegable (expandir/contraer)
   */
  mostrarColapsable(): void {
    if (!this.esFormularioSoloLectura) {
      this.colapsable = !this.colapsable;
    }
  }

 /**
 * Método que se ejecuta cuando el componente se destruye.
 * Envía una notificación a través de `destroyNotifier$` para cancelar
 * todas las suscripciones activas y liberar recursos, evitando fugas de memoria.
 */
ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
}
}
