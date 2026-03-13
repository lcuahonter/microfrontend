import { Store, StoreConfig } from '@datorama/akita';
import { TipoPersona } from '@libs/shared/data-access-user/src';

/**
 * Interfaz que define la estructura del estado de recuperación de cuenta
 * @interface FormularioRecuperacion
 */
/**
 * Interfaz para los datos del formulario
 */
export interface FormularioRecuperacion {
    /** Tab activa actual */
    activeTab: 'nacional' | 'extranjero';
    /** Indica si el usuario es de nacionalidad mexicana */
    nacionalidad: boolean | null;
    /** Tipo de documento de identificación */
    tipoDocumento: 'RFC' | 'CURP' | null;
    /** Tipo de persona (física o moral) */
    personaTipo: TipoPersona | null;
    /** Identificador único del usuario (RFC/CURP) */
    usuario: string;
    /** Nombre del usuario */
    nombre?: string;
    /** Primer apellido */
    primerApellido?: string;
    /** Segundo apellido */
    segundoApellido?: string;
    /** Razón social para personas morales */
    razonSocial?: string;
    /** Código postal */
    codigoPostal?: string;
    /** Estado */
    estado?: string;
    /** País */
    pais?: string;
}

/**
 * Store para manejar el estado de recuperación de cuenta
 * Extiende de Store<RecuperacionState>
 * @class RecuperacionStore
 */
@StoreConfig({ name: 'recuperacion' })
export class RecuperacionStore extends Store<FormularioRecuperacion> {
   /**
   * Constructor de RecuperacionStore
   * Inicializa el estado con valores por defecto
   * @constructor
   */
  constructor() {
    super({
      activeTab: 'nacional',
      //formData: {
        nacionalidad: null,
        tipoDocumento: null,
        personaTipo: null,
        usuario: ''
      //}
    });
  }
}