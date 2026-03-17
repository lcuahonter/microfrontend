export interface PermisoFormInterface {
    folioTramite: string;
    tipoDeSolicitud: string;
    regimen: string;
    clasificacionDelRegimen: string;
    periodoDeVigencia: string;
    unidadDeMedida: string;
    fraccionArancelaria: string | number;
    cantidadAutorizada: string | number;
    valorAutorizado: string | number;
    nico: string | number;
    descripcionNico: string;
    acotacion: string;
    permisoValidoDesde: string;
    permisoValidoHasta: string;
    motivoRenunciaDeDerechos: string;
    controlar: boolean;
}