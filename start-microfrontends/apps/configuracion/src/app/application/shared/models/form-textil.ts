import { FormControl } from "@angular/forms";
import { FraccionesArancelariasOutput } from "./fracciones-arancelarias.model";

export interface FormTextil {
    categoriaTextil: string
    tipoFraccion: string
    fraccionesArancelarias: FraccionesArancelariasOutput[]
}

export interface FormTextilControls {
    categoriaTextil: FormControl<string>
    tipoFraccion: FormControl<string>
    fraccionesArancelarias: FormControl<FraccionesArancelariasOutput[]>
}