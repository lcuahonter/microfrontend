import { Catalogo } from './catalogos.model';
import { FormGroup } from '@angular/forms';

export interface CampoForm {
  labelNombre: string;
  campo: string;
  class: string;
  tipo_input: string;
}

export interface DatosAgregarFormulario {
  form: FormGroup;
  field: string;
  valor: string;
}

export interface FormularioDinamico {
  labelNombre: string;
  campo: string;
  class: string;
  visibility?: string;
  tipo_input: string;
  disabled: boolean;
  readonly?: boolean;
  validators: string[];
  tooltip?: string | boolean;
  tooltipTxt?: string;
  placeholder?: string;
  AvailableRadioOptions?: string[];
  listaDesplegable?: Catalogo[];
}

export interface ModeloDeFormaDinamica {
  id?: string; // id
  labelNombre: string; // label name
  campo: string; // field
  clase: string; // class
  tipoInput: string; // field type
  desactivado: boolean; // disabled
  soloLectura?: boolean; // readonly
  validadores?: Validadores[]; // validators
  marcadorDePosicion?: string; // placeholder
  valorPredeterminado?: string | boolean | number; // default value
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  opciones?: any[]; // opciones for select dropdown, radio
  marginTop?: number; // margin-top
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  layout?: any; // layout for radio options
  mostrar?: boolean; // show or hide the field
  habilitado?: boolean; // enable or disable the field
  row?: number; // row number for the corresponding control
  tooltipQuestionCircle?: boolean; // tooltip icon
  gridLayout?: boolean; // grid layout for radio
  tooltipTxt?: string;
  templateKey?: string; // for injecting dynamic content
  maxlength?: number | null; // maximum length for input fields
  esRequerido?: boolean; // is required field
  marginLeft?:string,
  divWidth?:string,         
  buttonWidth?:string
  inputFilter?: RegExp; 
}

export interface Validadores {
  tipo: string; // type
  valor?: number | string | RegExp; // value
  mensaje?: string; // message
}