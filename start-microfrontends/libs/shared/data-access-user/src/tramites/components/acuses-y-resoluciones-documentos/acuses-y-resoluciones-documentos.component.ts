import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from "@angular/core";
import { AcuseDetalleService } from "../../../core/services/shared/detalleAcuse.service";
import { DocumentoInterfaz } from "../../../core/models/botonDeAccion";
import { Subject } from "rxjs";
import { manejarPdf } from "../../../core/utils/utilerias";

interface BodyTablaDocumentos {
  id: number,
  documento: string
}

@Component({
  selector: 'lib-acuses-resoluciones-documentos',
  standalone: true,
  templateUrl: './acuses-y-resoluciones-documentos.component.html',
  styleUrl: './acuses-y-resoluciones-documentos.component.scss'
})
export class AcusesYResolucionesDocumentosComponent implements OnDestroy, OnChanges {
  /**
   * Subject para manejar la destrucción del componente y evitar fugas de memoria.
   *
   */
  private destroyed$ = new Subject<void>();

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
   * @property {number} tramite
   * @description Identificador del trámite seleccionado.
   */
  @Input() tramite!: number;
  /**
   * Indica cuando hay datos acuse para el renderizado de la tabla dinamica
   */
  tieneDatosAcuse: boolean = false;
  /**
   * Indica cuando hay datos de resoluciones para el renderizado de la tabla dinamica
   */
  tieneDatosResoluciones: boolean = false;
  /**
   * Datos que se muestran en la tabla de acuse.
   */
  @Input() datosAcuse: DocumentoInterfaz[] = [];
  /**
   * Datos que se muestran en la tabla de resoluciones.
   */
  @Input() datosResoluciones: DocumentoInterfaz[] = [];

  /**
    * Encabezados de la tabla de acuse.
    *
    * Cada elemento representa una columna de la tabla, con su clave asociada
    * al modelo `BodyTablaDocumentos` y el valor que se muestra como encabezado en la UI.
    *
    */
  readonly encabezadoTabla: {
    valor: string;
    key: keyof BodyTablaDocumentos;
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
  constructor(
    private acuseDetalleService: AcuseDetalleService
  ) { }

  base64Archivos(uuid: string): void {
    this.acuseDetalleService.getDescargarAcuse(this.tramite, uuid).subscribe({
      next: (data) => {
        if (data?.codigo === "00" && data?.datos?.contenido) {
          manejarPdf(
            data.datos.contenido,
            data.datos.nombre_archivo,
            "descargar"
          );
        }
      },
    });
  }

  descargarDocumentoPdf(minio: string | null): void {
    if(minio !== null){
      this.base64Archivos(minio)
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['datosAcuse'] && !changes['datosAcuse'].firstChange) {
      this.tieneDatosAcuse = true;
    }

    if (changes['datosResoluciones'] && !changes['datosResoluciones'].firstChange) {
      this.tieneDatosResoluciones = true;
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