
export interface EnlaceConfiguracionItem {
    id:string,
    registroFederal: string,
    rfc: string,
    nombre: string,
    apellidoPaterno: string,
    apellidoMaterno: string,
    cargo: string,
    estadoResidencia: string,
    telefono: string,
    correo: string,
    suplente: string,
}

/**
 * Configuración de las columnas para la tabla de mercancías.
 */
export const ENLACE_TABLA_CONFIGURACION = [
    {
        encabezado: 'RFC',
        clave: (item: EnlaceConfiguracionItem): string => item.rfc,
        orden: 1,
    },
    {
        encabezado: 'Nombre',
        clave: (item: EnlaceConfiguracionItem): string => item.nombre,
        orden: 2,
    },
    {
        encabezado: 'Apellido Paterno',
        clave: (item: EnlaceConfiguracionItem): string => item.apellidoPaterno,
        orden: 3,
    },
    {
        encabezado: 'Apellido Materno',
        clave: (item: EnlaceConfiguracionItem): string => item.apellidoMaterno,
        orden: 4,
    },
    {
        encabezado: 'Ciudad o Estado de Residencia',
        clave: (item: EnlaceConfiguracionItem): string => item.estadoResidencia,
        orden: 5,
    },
    {
        encabezado: 'Cargo o Puesto',
        clave: (item: EnlaceConfiguracionItem): string => item.cargo,
        orden: 6,
    },
    {
        encabezado: 'Teléfono',
        clave: (item: EnlaceConfiguracionItem): string => item.telefono,
        orden: 7,
    },
    {
        encabezado: 'Correo Electrónico',
        clave: (item: EnlaceConfiguracionItem): string => item.correo,
        orden: 8,
    },
    {
        encabezado: 'Suplente',
        clave: (item: EnlaceConfiguracionItem): string => item.suplente ? 'Sí' : 'No',
        orden: 9,
    },
];