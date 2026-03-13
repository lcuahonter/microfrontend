export interface AccionBoton {
  accion: string;
  valor: number;
}
export interface ProductoOpción {
  label: string;
  value: string;
}

export interface ProductoResponse {
  options: ProductoOpción[];
  defaultSelect: string;
}
export interface Pais {
  id: number;
  descripcion: string;
}
