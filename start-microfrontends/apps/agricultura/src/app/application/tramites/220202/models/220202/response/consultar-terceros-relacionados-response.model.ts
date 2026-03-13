/**
 * interface para respuesta de consulta de terceros relacionados
 */
export interface ConsultarTercerosRelacionadosResponse {
  terceros_exportador: TercerosExportador[];
  terceros_destinatario: TercerosDestinatario[];
}

/**
 * interface para objeto de tercerosExportador
 */
interface TercerosExportador {
  id_solicitud: number;
  extranjero: boolean;
  id_persona_sol: number;
  id_direccion_sol: number;
  tipo_persona_sol: string;
  persona_moral: boolean;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  razon_social: string | null;
  pais: string;
  descripcion_ubicacion: string;
  lada: string;
  telefonos: string;
  correo: string;
}

/**
 * interface para objeto de tercerosDestinatario
 */
interface TercerosDestinatario {
  id_solicitud: number;
  id_persona_sol: number;
  id_direccion_sol: number;
  tipo_persona_sol: string;
  persona_moral: boolean;
  num_establ_tif: string;
  nom_establ_tif: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  razon_social: string | null;
  pais: string;
  codigo_postal: string;
  cve_entidad: string;
  cve_deleg_mun: string;
  cve_colonia: string;
  calle: string;
  num_exterior: string;
  num_interior: string | null;
  lada: string;
  telefonos: string;
  correo: string;
}