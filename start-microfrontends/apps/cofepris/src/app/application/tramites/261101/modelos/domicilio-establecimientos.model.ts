export interface DomicilioData {
    code: number;
    data: Domicilio[]
    message: string;
  }

  export interface Domicilio {
    id:number
    descripcion : string;
  }