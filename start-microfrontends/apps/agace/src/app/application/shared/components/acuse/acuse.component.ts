import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import {
  Subject,
  catchError,
  switchMap,
  throwError,
} from 'rxjs';
import { AlertComponent } from '@libs/shared/data-access-user/src/tramites/components/alert/alert.component';
import { manejarPdf } from '@libs/shared/data-access-user/src/core/utils/utilerias';
import { BodyTablaAcuse } from '@libs/shared/data-access-user/src/core/models/shared/catalogos.model';
import { CommonModule } from '@angular/common';

import { AcuseDetalleService } from '@libs/shared/data-access-user/src/core/services/shared/detalleAcuse.service';
import { DocumentosRequest } from '@libs/shared/data-access-user/src/core/models/shared/documentos-request.model';
import { Router } from '@angular/router';
import { DocumentoService } from '../../services/documento.service';

@Component({
  selector: 'lib-component-acuse',
  standalone: true,
  imports: [CommonModule, AlertComponent],
  templateUrl: './acuse.component.html',
  styleUrl: './acuse.component.scss',
})
export class AcuseComponent implements OnChanges, OnDestroy {
  /**
   * Título principal que se mostrará en el encabezado del componente.
   * Generalmente representa el nombre del trámite o sección.
   */
  @Input() titulo!: string;

  /**
   * Título opcional para la sección de resoluciones.
   */
  @Input() tituloResoluciones?: string;

  /**
   * Subject para manejar la destrucción del componente y evitar fugas de memoria.
   *
   */
  private destroyed$ = new Subject<void>();

  /**
   * Texto del mensaje de alerta que se mostrará en el componente.
   * Se utiliza para mostrar advertencias, errores o información relevante al usuario.
   */
  @Input() txtAlerta!: string;

  /**
   * Subtítulo que se mostrará debajo del título principal.
   * Usado para complementar la información del título o dar contexto adicional.
   */
  @Input() subtitulo!: string;

  /**
   * Folio único relacionado con el trámite o solicitud.
   * Puede usarse para mostrar información específica o para trazabilidad.
   */
  @Input() folio!: string;

  /**
   * URL relacionada con el trámite o documento generado.
   * Esta puede ser utilizada para redireccionar o mostrar documentos.
   */
  @Input() url!: string;

  /**
   * Identificador numérico de la solicitud asociada al trámite.
   * Este ID se utiliza para generar y obtener los documentos correspondientes.
   */
  @Input() idSolicitud!: number;

  /**
   * Datos que se muestran en la tabla de acuse.
   */
  @Input() datosTabla: BodyTablaAcuse[] = [];

  /**
   * @property {number} tramite
   * @description Identificador del trámite seleccionado.
   */
  @Input() tramite!: number;

  /**
   * Encabezados de la tabla de acuse.
   *
   * Cada elemento representa una columna de la tabla, con su clave asociada
   * al modelo `BodyTablaAcuse` y el valor que se muestra como encabezado en la UI.
   *
   */
  readonly encabezadoTablaAcuse: {
    valor: string;
    key: keyof BodyTablaAcuse;
  }[] = [
    {
      key: 'id',
      valor: 'No.',
    },
    {
      key: 'documento',
      valor: 'Documento',
    },
  ];

  /**
   * Datos que se muestran en la tabla de acuse.
   */
  datosTablaAcuse: BodyTablaAcuse[] = [];
  datosTablaResoluciones: BodyTablaAcuse[] = [];
  idLlaveArchivo!: string;
  @Input() procedure: number = 0;

  
  constructor(
    private router: Router,
    private documentosService: DocumentoService,
    private acuseDetalleService: AcuseDetalleService
  ) {}

  /**
   * Método que se ejecuta cuando uno o más inputs del componente cambian.
   *
   * @param changes - Objeto que contiene los cambios de los inputs del componente.
   * @returns void
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['txtAlerta']?.currentValue) {
      this.txtAlerta = changes['txtAlerta'].currentValue;
    }

    if (changes['datosTabla']?.currentValue) {
      this.datosTabla = changes['datosTabla'].currentValue;
      this.datosTablaAcuse = this.datosTabla;
    }

    if (changes['idSolicitud']?.currentValue) {
      this.generarYMostrarDocumentos();
    }
  }

  /**
   * Método que genera y muestra los documentos necesarios para el acuse.
   *
   * Utiliza el servicio `documentosService` para generar el documento basado en los parámetros proporcionados.
   * Luego, obtiene el contenido del documento generado y lo muestra en la tabla de acuse.
   */
  generarYMostrarDocumentos(): void {

      const BODY: DocumentosRequest = {
        tipo_dependencia: 'AGACE',
        tipo_tramite: this.procedure.toString(),
        tipo_documento: 1,
        parametros: {
          id_solicitud: Number(this.idSolicitud),
        },
      };

      this.documentosService
        .generarDoc(BODY)
        .pipe(
          switchMap((response) => {
            const DATOS = response.datos as { llave_archivo: string };
            const LLAVEARCHIVO = DATOS.llave_archivo;
            return this.documentosService.getVisualizarDoc(LLAVEARCHIVO);
          }),
          catchError((error) => {
            return throwError(() => error);
          })
        )
        .subscribe({
          next: (response) => {
            if (response?.datos) {
              this.datosTablaAcuse = [
                {
                  id: 1,
                  documento: response.datos.nombre_archivo,
                  urlPdf: AcuseComponent.crearUrlPdf(response.datos.contenido),
                  idDocumento: '1',
                },
              ];
            } else {
              this.datosTablaAcuse = [];
            }
          },
          error: (err) => {
            return throwError(() => err);
          }
        });
    
  }

  /**
   * Método que crea una URL para un PDF a partir de un string en base64.
   *
   * @param base64 - El contenido del PDF en formato base64.
   * @returns Una URL que puede ser utilizada para mostrar el PDF.
   */
  static crearUrlPdf(base64: string): string {
    // Decodificar el base64
    const BYTE_CHARACTERS = atob(base64);
    const BYTE_NUMBERS = new Array(BYTE_CHARACTERS.length);
    for (let i = 0; i < BYTE_CHARACTERS.length; i++) {
      BYTE_NUMBERS[i] = BYTE_CHARACTERS.charCodeAt(i);
    }
    const BYTE_ARRAY = new Uint8Array(BYTE_NUMBERS);

    // Crear el Blob y la URL
    const BLOB = new Blob([BYTE_ARRAY], { type: 'application/pdf' });
    return URL.createObjectURL(BLOB);
  }

  /**
   * Obtiene el contenido base64 de un archivo y realiza la acción especificada.
   * @param {string} uuid - Identificador único del archivo a obtener.
   * @param {'abrir' | 'descargar'} accion - Acción a realizar con el archivo.
   * @returns {void}
   * @example
   * // Abre el archivo en una nueva pestaña
   * base64Archivos('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'abrir');
   *
   * // Descarga el archivo
   * base64Archivos('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'descargar');
   */
  base64Archivos(uuid: string, accion: 'abrir' | 'descargar'): void {
    this.acuseDetalleService.getDescargarAcuse(this.tramite, uuid).subscribe({
      next: (data) => {
        if (data?.codigo === '00' && data?.datos?.contenido) {
          manejarPdf(
            data.datos.contenido,
            data.datos.nombre_archivo,
            accion
          );
        }
      },
    });
  }

  /**
   * Método que se ejecuta al hacer clic en un enlace para ver el PDF.
   *
   * @param url - La URL del PDF a visualizar.
   */
  // eslint-disable-next-line class-methods-use-this
  verPdf(url: string): void {
    window.open(url, '_blank');
  }

  /**
   * Método que se ejecutar descarga PDF.
   *
   * @param url - La URL del PDF.
   */
  descargarPdf(url: string): void {
    this.base64Archivos(url, 'descargar');
  }

  /**
   * Método que maneja la navegación al salir del componente.
   *
   * Si no hay datos en la tabla, redirige a la selección de trámite.
   * Si hay datos, redirige a la bandeja de tareas pendientes.
   */
  salir(): void {
    if (this.datosTabla.length === 0) {
      this.router.navigate(['/seleccion-tramite']);
    } else {
      this.router.navigate(['/bandeja-de-tareas-pendientes']);
    }
  }

  /**
   * Método que se ejecuta cuando el componente es destruido.
   * Se utiliza para limpiar recursos y evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}