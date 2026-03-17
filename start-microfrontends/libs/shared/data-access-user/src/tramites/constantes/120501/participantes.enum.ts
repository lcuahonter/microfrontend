export interface Complementaria1 {
  registrofederaldecontribuyentes : string;
}

export const CONFIGURACION_ACCIONISTAS_TABLA1 = [
  {
    encabezado: 'Registro Federal de Contribuyentes ',
    clave: (ele: Complementaria1):string => ele.registrofederaldecontribuyentes,
    orden: 1
  },
]
 