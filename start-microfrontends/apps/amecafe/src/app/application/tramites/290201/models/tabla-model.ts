import { LoteResponseDto } from "../components/datos-de-la-solicitud/datos-de-la-solicitud.component";
import { TerceroResponseDto } from "../components/datosTramite.component";

export interface Solicitud {
id_solicitud: string |number;
  /** Fecha de creación */
  fecha_creacion?: string;

  /** Nombre o identificador de la mercancía */
  mercancia?: string;

  /** Cantidad solicitada */
  cantidad?: string;

  /** Proveedor de la mercancía */
  proovedor?: string;

  /** Formas del café */
  formasdelcafe?: string;

  /** Tipos */
  tipos?: string;

  /** Calidad */
  calidad?: string;

  /** Procesos */
  procesos?: string;

  /** Nombre de la agencia */
  nombredeagencia?: string;

  /** Certificaciones */
  certifications?: string;

  /** Aduana de salida */
  adunadesalida?: string;

  /** País destino */
  paisdestino?: string;

  /** Entidad de procedencia */
  entidaddeprocedencia?: string;

  /** Ciclo cafetalero */
  ciclocafetalero?: string;
  descripcionGenerica1?:string
 lote?: LoteResponseDto[]
 terceros?: TerceroResponseDto[]
}