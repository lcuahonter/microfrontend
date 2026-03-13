// Interfaz que representa una entidad Antecesor
export interface Antecesor {
    ensucaracterde: string; // Rol o carácter del antecesor
    rfc: string; // Registro Federal de Contribuyentes (RFC)
    obligadoaTributarenMexico: string; // Si está obligado a tributar en México
    nacionalidad: string; // Nacionalidad
    registroFederaldeContribuyentes: string; // Registro Federal de Contribuyentes
    nombreCompleto: string; // Nombre completo

    // Campos opcionales para detalles del miembro
    tipoDePersonaMiembro?: string; // Tipo de persona del miembro
    nombreMiembro?: string; // Nombre del miembro
    apellidoPaternoMiembro?: string; // Apellido paterno del miembro
    apellidoMaternoMiembro?: string; // Apellido materno del miembro
    nombreDeLaEmpresaMiembro?: string; // Nombre de la empresa del miembro
}
// Interfaz para representar los datos de empleados por bimestre
export interface EmpleadoBimestre {
  denominacionSocial: string;
  rfc: string;
  numeroEmpleadoBimestre1: number;
  primerBimestre: string;
  numeroEmpleadoBimestre2: number;
  segundoBimestre: string;
  numeroEmpleadoBimestre3: number;
  tercerBimestre: string;
}