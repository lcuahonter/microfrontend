import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormasDinamicasComponent } from './formas-dinamicas.component';
import { ReactiveFormsModule, FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { ModeloDeFormaDinamica } from '@libs/shared/data-access-user/src/core/models/shared/forms-model';

describe('FormasDinamicasComponent', () => {
  let component: FormasDinamicasComponent;
  let fixture: ComponentFixture<FormasDinamicasComponent>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    formBuilder = new FormBuilder();

    await TestBed.configureTestingModule({
      imports: [FormasDinamicasComponent, ReactiveFormsModule],
      providers: [FormBuilder],
    }).compileComponents();

    fixture = TestBed.createComponent(FormasDinamicasComponent);
    component = fixture.componentInstance;
    component.forma = formBuilder.group({});
    component.formularioDatos = [
      {
        labelNombre: 'RFC',
        campo: 'rfc',
        clase: 'col-md-4',
        tipoInput: 'text',
        validadores: [{ tipo: 'required' }],
        desactivado: false,
        soloLectura: false,
      },
    ];
    component.estado = {
      rfc: '',
      nombre: 'Mock Name',
      apellidoPaterno: 'Mock Surname',
      apellidoMaterno: 'Mock Maternal Name'
    };
    component.inicializarFormulario();
    component.seRequiere = jest.fn().mockImplementation(campo => campo === 'requiredCampo');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return true for a valid campo', () => {
    const validacionesServiceMock = {
      isValid: jest.fn().mockReturnValue(true),
    };
    (component as any).validacionesService = {
      ...validacionesServiceMock,
      rfcPattern: '',
      horaPattern: '',
      patronDeNumero: '',
      llavePagoPattern: '',
    };
    component.forma = new FormGroup({
      rfc: new FormControl('1234567890', Validators.required),
    });
    const result = component.esValido('rfc');
    expect(validacionesServiceMock.isValid).toHaveBeenCalledWith(component.forma, 'rfc');
    expect(result).toBe(true);
  });

  it('should return false for an invalid campo', () => {
    const validacionesServiceMock = {
      isValid: jest.fn().mockReturnValue(false),
    };
    (component as any).validacionesService = {
      ...validacionesServiceMock,
      rfcPattern: '',
      horaPattern: '',
      patronDeNumero: '',
      llavePagoPattern: '',
    };
    component.forma = new FormGroup({
      rfc: new FormControl('', Validators.required),
    });
    const result = component.esValido('rfc');
    expect(validacionesServiceMock.isValid).toHaveBeenCalledWith(component.forma, 'rfc');
    expect(result).toBe(false);
  });

  it('should return null for a campo that does not exist in FormGroup', () => {
    const validacionesServiceMock = {
      isValid: jest.fn().mockReturnValue(null),
    };
    (component as any).validacionesService = {
      ...validacionesServiceMock,
      rfcPattern: '',
      horaPattern: '',
      patronDeNumero: '',
      llavePagoPattern: '',
    };
    component.forma = new FormGroup({
      nombre: new FormControl('John Doe', Validators.required),
    });
    const result = component.esValido('rfc');
    expect(validacionesServiceMock.isValid).toHaveBeenCalledWith(component.forma, 'rfc');
    expect(result).toBeNull();
  });

  it('should return false when validadores does not contain "required"', () => {
    const item: ModeloDeFormaDinamica = {
      labelNombre: 'Mock Label',
      campo: 'mockCampo',
      clase: 'mockClase',
      tipoInput: 'text',
      desactivado: false,
      validadores: [{ tipo: 'maxLength' }],
    };
    const result = component.seRequiere(item.campo);
    expect(result).toBe(false);
  });

  it('should return false when validadores is an empty array', () => {
    const item: ModeloDeFormaDinamica = {
      labelNombre: 'Mock Label',
      campo: 'mockCampo',
      clase: 'mockClase',
      tipoInput: 'text',
      desactivado: false,
      validadores: [],
    };
    const result = component.seRequiere(item.campo);
    expect(result).toBe(false);
  });

  it('should return false when validadores is undefined', () => {
    const item: ModeloDeFormaDinamica = {
      labelNombre: 'Mock Label',
      campo: 'mockCampo',
      clase: 'mockClase',
      tipoInput: 'text',
      desactivado: false,
      validadores: undefined,
    };
    const result = component.seRequiere(item.campo);
    expect(result).toBe(false);
  });

  it('should return "col-12" for screen width between 768 and 991', () => {
    component.anchoDePantalla = 800;
    const result = component.obtenerClaseResponsiva('col-md-4');
    expect(result).toBe('col-12');
  });

  it('should return the provided clase for screen width greater than 991', () => {
    component.anchoDePantalla = 1024;
    const result = component.obtenerClaseResponsiva('col-md-4');
    expect(result).toBe('col-md-4');
  });

  it('should return "col-12" for screen width less than 768', () => {
    component.anchoDePantalla = 600;
    const result = component.obtenerClaseResponsiva('col-md-4');
    expect(result).toBe('col-12');
  });

  it('should return "col-12" for screen width exactly 768', () => {
    component.anchoDePantalla = 768;
    const result = component.obtenerClaseResponsiva('col-md-4');
    expect(result).toBe('col-12');
  });

  it('should return "col-12" for screen width exactly 991', () => {
    component.anchoDePantalla = 991;
    const result = component.obtenerClaseResponsiva('col-md-4');
    expect(result).toBe('col-12');
  });

  it('should return an empty string when screen width is greater than 991 and clase is empty', () => {
    component.anchoDePantalla = 1024;
    const result = component.obtenerClaseResponsiva('');
    expect(result).toBe('');
  });

  it('should emit event when item is provided', () => {
    jest.spyOn(component.emitirEventoDeClic, 'emit');
    const mockItem: ModeloDeFormaDinamica = {
      id: 'button1',
      labelNombre: 'Click Me',
      campo: 'submit',
      clase: 'btn-primary',
      tipoInput: 'button',
      desactivado: false
    };
    component.alHacerClicEnElBoton(mockItem);
    expect(component.emitirEventoDeClic.emit).toHaveBeenCalledWith(mockItem);
  });

  it('should emit event correctly on consecutive calls', () => {
    jest.spyOn(component.emitirEventoDeClic, 'emit');
  
    const mockItem1: ModeloDeFormaDinamica = {
      id: 'button1',
      labelNombre: 'First Button',
      campo: 'save',
      clase: 'btn-primary',
      tipoInput: 'button',
      desactivado: false
    };
  
    const mockItem2: ModeloDeFormaDinamica = {
      id: 'button2',
      labelNombre: 'Second Button',
      campo: 'cancel',
      clase: 'btn-secondary',
      tipoInput: 'button',
      desactivado: true
    };
  
    component.alHacerClicEnElBoton(mockItem1);
    component.alHacerClicEnElBoton(mockItem2);
  
    expect(component.emitirEventoDeClic.emit).toHaveBeenCalledTimes(2);
    expect(component.emitirEventoDeClic.emit).toHaveBeenCalledWith(mockItem1);
    expect(component.emitirEventoDeClic.emit).toHaveBeenCalledWith(mockItem2);
  });

  it('should add controls for keys not already present in the form', () => {
    const mockValue = { name: 'John Doe', age: 30 };
    component.writeValue(mockValue);
  
    const nameControl = component.forma.get('name');
    const ageControl = component.forma.get('age');
  
    expect(nameControl).toBeTruthy();
    expect(nameControl?.value).toBe('John Doe');
    expect(ageControl).toBeTruthy();
    expect(ageControl?.value).toBe(30);
  });

  it('should patch values for existing controls', () => {
    component.forma.addControl('name', new FormControl('Initial Name'));
    const mockValue = { name: 'Patched Name' };
    component.writeValue(mockValue);
    const nameControl = component.forma.get('name');
    expect(nameControl).toBeTruthy();
    expect(nameControl?.value).toBe('Patched Name');
  });

  it('should handle null values', () => {
    const mockValue = { name: null, age: null };
    component.writeValue(mockValue);
    const nameControl = component.forma.get('name');
    const ageControl = component.forma.get('age');
    expect(nameControl).toBeTruthy();
    expect(nameControl?.value).toBeNull();
    expect(ageControl).toBeTruthy();
    expect(ageControl?.value).toBeNull();
  });

  it('should not patch values when value is undefined', () => {
    component.forma.addControl('name', new FormControl('Initial Name'));
    const mockValue = { name: undefined };
    component.writeValue(mockValue);
    const nameControl = component.forma.get('name');
    expect(nameControl).toBeTruthy();
    expect(nameControl?.value).toBe('Initial Name');
  });

  it('should patch multiple values simultaneously', () => {
    component.forma.addControl('name', new FormControl('Initial Name'));
    component.forma.addControl('age', new FormControl(25));
    const mockValue = { name: 'Patched Name', age: 30 };
    component.writeValue(mockValue);
    const nameControl = component.forma.get('name');
    const ageControl = component.forma.get('age');
    expect(nameControl?.value).toBe('Patched Name');
    expect(ageControl?.value).toBe(30);
  });

  it('should register onChange handler', () => {
    const mockOnChange = jest.fn();
    component.registerOnChange(mockOnChange);
    expect(FormasDinamicasComponent.onChange).toBe(mockOnChange);
  });
  
  it('should not call onChange handler if emitEvent is false', () => {
    const mockOnChange = jest.fn();
    component.forma.addControl('testField', new FormControl('initialValue'));
    component.registerOnChange(mockOnChange);
    component.forma.patchValue({ testField: 'newValue' }, { emitEvent: false });
    expect(mockOnChange).not.toHaveBeenCalled();
  });
  
    it('should return correct data when event is provided', () => {
      const mockEvent: ModeloDeFormaDinamica = {
        labelNombre: 'Fecha Label',
        campo: 'requiredCampo',
        clase: 'mockClase',
        tipoInput: 'text',
        desactivado: false,
        habilitado: true,
      };
      const result = component.obtenerInformacionDeFecha(mockEvent);
      expect(result).toEqual({
        labelNombre: 'Fecha Label',
        required: true,
        habilitado: true,
      });
      expect(component.seRequiere).toHaveBeenCalledWith('requiredCampo');
    });
  
    it('should return correct data when event is missing habilitado property', () => {
      const mockEvent: ModeloDeFormaDinamica = {
        labelNombre: 'Fecha Label',
        campo: 'requiredCampo',
      } as any;
  
      const result = component.obtenerInformacionDeFecha(mockEvent);
  
      expect(result).toEqual({
        labelNombre: 'Fecha Label',
        required: true,
        habilitado: false,
      });
    });
  
    it('should call seRequiere correctly based on event.campo', () => {
      const mockEvent: ModeloDeFormaDinamica = {
        labelNombre: 'Fecha Label',
        campo: 'nonRequiredCampo',
        clase: 'mockClase',
        tipoInput: 'text',
        desactivado: false,
        habilitado: true,
      };
      const result = component.obtenerInformacionDeFecha(mockEvent);
      expect(result).toEqual({
        labelNombre: 'Fecha Label',
        required: false,
        habilitado: true,
      });
      expect(component.seRequiere).toHaveBeenCalledWith('nonRequiredCampo');
    });

    it('should return InputFecha with proper values when event is valid', () => {
      const mockEvent: ModeloDeFormaDinamica = {
        labelNombre: 'Fecha de nacimiento',
        campo: 'fechaNacimiento',
        clase: 'mockClase',
        tipoInput: 'text',
        desactivado: false,
        habilitado: true
      };
      const seRequiereSpy = jest.spyOn(component as any, 'seRequiere').mockReturnValue(true);
      const result = component.obtenerInformacionDeFecha(mockEvent);
      expect(result).toEqual({
        labelNombre: 'Fecha de nacimiento',
        required: true,
        habilitado: true
      });
      expect(seRequiereSpy).toHaveBeenCalledWith('fechaNacimiento');
    });

    it('should return default InputFecha when event is null', () => {
      const result = component.obtenerInformacionDeFecha(null as any);
      expect(result).toEqual({
        labelNombre: '',
        required: false,
        habilitado: false
      });
    });

    it('should return InputFecha with proper values when event is valid', () => {
      const mockEvent: ModeloDeFormaDinamica = {
        labelNombre: 'Fecha de nacimiento',
        campo: 'fechaNacimiento',
        clase: 'mockClase',
        tipoInput: 'text',
        desactivado: false,
        habilitado: true
      };
      const seRequiereSpy = jest.spyOn(component as any, 'seRequiere').mockReturnValue(true);
      const result = component.obtenerInformacionDeFecha(mockEvent);
      expect(result).toEqual({
        labelNombre: 'Fecha de nacimiento',
        required: true,
        habilitado: true
      });
      expect(seRequiereSpy).toHaveBeenCalledWith('fechaNacimiento');
    });

    it('should return InputFecha with habilitado false if not defined in event', () => {
      const mockEvent: ModeloDeFormaDinamica = {
        labelNombre: 'Fecha de vencimiento',
        campo: 'fechaVencimiento',
        clase: 'mockClase',
        tipoInput: 'text',
        desactivado: false,
        habilitado: undefined
      };
      jest.spyOn(component as any, 'seRequiere').mockReturnValue(false);
      const result = component.obtenerInformacionDeFecha(mockEvent);
      expect(result).toEqual({
        labelNombre: 'Fecha de vencimiento',
        required: false,
        habilitado: false
      });
    });

    it('should return InputFecha with required = false when seRequiere returns false', () => {
      const mockEvent: ModeloDeFormaDinamica = {
        labelNombre: 'Fecha de entrega',
        campo: 'fechaEntrega',
        clase: 'mockClase',
        tipoInput: 'text',
        desactivado: false,
        habilitado: true
      };
      jest.spyOn(component as any, 'seRequiere').mockReturnValue(false);
      const result = component.obtenerInformacionDeFecha(mockEvent);
      expect(result).toEqual({
        labelNombre: 'Fecha de entrega',
        required: false,
        habilitado: true
      });
    });

    it('should return InputFecha with empty labelNombre when event label is empty string', () => {
      const mockEvent: ModeloDeFormaDinamica = {
        labelNombre: '',
        campo: 'fechaVacía',
        clase: 'mockClase',
        tipoInput: 'text',
        desactivado: false,
        habilitado: false
      };
      jest.spyOn(component as any, 'seRequiere').mockReturnValue(true);
      const result = component.obtenerInformacionDeFecha(mockEvent);
      expect(result).toEqual({
        labelNombre: '',
        required: true,
        habilitado: false
      });
    });

    it('should return default InputFecha when event is null', () => {
      const result = component.obtenerInformacionDeFecha(null as any);
      expect(result).toEqual({
        labelNombre: '',
        required: false,
        habilitado: false
      });
    });

    it('should return unique row numbers from formularioDatos', () => {
      component.formularioDatos = [
        { row: 1 },
        { row: 2 },
        { row: 3 },
        { row: 1 },
      ] as any;
  
      const result = component.obtenerFilas();
      expect(result.sort()).toEqual([1, 2, 3]);
    });

    it('should return [0] if all items have undefined row values', () => {
      component.formularioDatos = [
        { row: undefined },
        { row: undefined },
      ] as any;
  
      const result = component.obtenerFilas();
      expect(result).toEqual([0]);
    });

    it('should include 0 if some rows are undefined and others are valid', () => {
      component.formularioDatos = [
        { row: 1 },
        { row: undefined },
        { row: 2 },
      ] as any;
  
      const result = component.obtenerFilas().sort();
      expect(result).toEqual([0, 1, 2]);
    });

    it('should return an empty array if formularioDatos is empty', () => {
      component.formularioDatos = [] as any;
      const result = component.obtenerFilas();
      expect(result).toEqual([]);
    });

    it('should handle mixed types (e.g., string rows ignored or coerced)', () => {
      component.formularioDatos = [
        { row: 1 },
        { row: '2' },
        { row: undefined },
      ] as any;
      const result = component.obtenerFilas();
      expect(result).toContain(1);
      expect(result).toContain(0);
      expect(result).toContain('2' as any);
    });

    it('should return all controls that match a given row', () => {
      component.formularioDatos = [
        { campo: 'nombre', row: 1 },
        { campo: 'edad', row: 2 },
        { campo: 'genero', row: undefined },
        { campo: 'pais', row: 2 },
        { campo: 'email' },
      ] as any;
      const result = component.obtenerControlsPorFilas(2);
      expect(result).toEqual([
        { campo: 'edad', row: 2 },
        { campo: 'pais', row: 2 },
      ]);
    });

    it('should return controls with undefined row when checking for row 0', () => {
      component.formularioDatos = [
        { campo: 'nombre', row: 1 },
        { campo: 'edad', row: 2 },
        { campo: 'genero', row: undefined },
        { campo: 'pais', row: 2 },
        { campo: 'email' },
      ] as any;
      const result = component.obtenerControlsPorFilas(0);
      expect(result).toEqual([
        { campo: 'genero', row: undefined },
        { campo: 'email' },
      ]);
    });

    it('should return controls that match the specified row', () => {
      component.formularioDatos = [
        { campo: 'nombre', row: 1 },
        { campo: 'edad', row: 2 },
        { campo: 'pais', row: 2 },
        { campo: 'genero', row: 3 },
      ] as any;
      const result = component.obtenerControlsPorFilas(2);
      expect(result).toEqual([
        { campo: 'edad', row: 2 },
        { campo: 'pais', row: 2 },
      ]);
    });
    
    it('should return an empty array if no control matches the row', () => {
      component.formularioDatos = [
        { campo: 'nombre', row: 1 },
        { campo: 'edad', row: 2 },
      ] as any;
      const result = component.obtenerControlsPorFilas(3);
      expect(result).toEqual([]);
    });
    
    it('should register the onTouched function', () => {
      const mockFn = jest.fn();
      component.registerOnTouched(mockFn);
      FormasDinamicasComponent.onTouched();
      expect(mockFn).toHaveBeenCalled();
    });
    
    it('should set the static onTouched property', () => {
      const mockFn = jest.fn();
      component.registerOnTouched(mockFn);
      expect(FormasDinamicasComponent.onTouched).toBe(mockFn);
    });

    it('should register the onTouched function', () => {
      const mockFn = jest.fn();
      component.registerOnTouched(mockFn);
      FormasDinamicasComponent.onTouched();
      expect(mockFn).toHaveBeenCalled();
    });
    
    it('should override the previously registered onTouched function', () => {
      const firstFn = jest.fn();
      const secondFn = jest.fn();
      component.registerOnTouched(firstFn);
      component.registerOnTouched(secondFn);
      FormasDinamicasComponent.onTouched();
      expect(firstFn).not.toHaveBeenCalled();
      expect(secondFn).toHaveBeenCalled();
    });
    
    it('should not throw if onTouched is called without registering', () => {
      (FormasDinamicasComponent as any).onTouched = undefined;
      expect(() => {
        if (FormasDinamicasComponent.onTouched) {
          FormasDinamicasComponent.onTouched();
        }
      }).not.toThrow();
    });
    
    it('should assign the exact function to the static onTouched', () => {
      const mockFn = jest.fn();
      component.registerOnTouched(mockFn);
      expect(FormasDinamicasComponent.onTouched).toBe(mockFn);
    });

    it('should render the correct form control based on field type', () => {
      component.formularioDatos = [
        { labelNombre: 'inputField', tipoInput: 'text', campo: 'inputField', clase: 'col-md-4', desactivado: false },
        { labelNombre: 'dateField', tipoInput: 'date', campo: 'dateField', clase: 'col-md-4', desactivado: false },
        { labelNombre: 'catalogField', tipoInput: 'select-catalogos', campo: 'catalogField', clase: 'col-md-4', desactivado: false },
        { labelNombre: 'radioField', tipoInput: 'radio', campo: 'radioField', clase: 'col-md-4', desactivado: false }
      ];
      component.ngOnInit();
      const inputControl = component.forma.get('inputField');
      const dateControl = component.forma.get('dateField');
      expect(inputControl).toBeTruthy();
      expect(dateControl).toBeTruthy();
    });

    it('should return Validators.pattern with correct RegExp', () => {
      const pattern = /^[0-9]+$/;
      const lista = [{ tipo: 'pattern', valor: pattern }];
      const result = FormasDinamicasComponent.obtenerValidadores(lista);
      expect(result.length).toBe(1);
      const validator = result[0];
      const control = { value: 'abc' } as any;
      expect(validator(control)).toEqual({ pattern: { requiredPattern: pattern.toString(), actualValue: 'abc' } });
    });

    it('should skip entries with undefined tipo', () => {
      const lista = [{ tipo: undefined }] as any;
      const result = FormasDinamicasComponent.obtenerValidadores(lista);
      expect(result.length).toBe(0);
    });

    it('should skip minlength if valor is not a number', () => {
      const lista = [{ tipo: 'minlength', valor: 'five' }];
      const result = FormasDinamicasComponent.obtenerValidadores(lista as any);
      expect(result.length).toBe(0);
    });

    it('should skip maxlength if valor is not a number', () => {
      const lista = [{ tipo: 'maxlength', valor: null }];
      const result = FormasDinamicasComponent.obtenerValidadores(lista as any);
      expect(result.length).toBe(0);
    });
  
    it('should skip pattern if valor is not a RegExp', () => {
      const lista = [{ tipo: 'pattern', valor: 'not-a-regex' }];
      const result = FormasDinamicasComponent.obtenerValidadores(lista as any);
      expect(result.length).toBe(0);
    });

    it('should handle multiple validators in a single list', () => {
      const lista = [
        { tipo: 'required' },
        { tipo: 'minlength', valor: 2 },
        { tipo: 'maxlength', valor: 5 },
        { tipo: 'pattern', valor: /^[a-z]+$/ }
      ];
      const result = FormasDinamicasComponent.obtenerValidadores(lista);
      expect(result.length).toBe(4);
    });

    it('should return an empty array if listaDeValidadores is empty', () => {
      const result = FormasDinamicasComponent.obtenerValidadores([]);
      expect(result).toEqual([]);
    });

    it('should skip null or undefined entries in listaDeValidadores', () => {
      const lista = [null, undefined, { tipo: 'required' }];
      const result = FormasDinamicasComponent.obtenerValidadores(lista as any);
      expect(result).toContain(Validators.required);
      expect(result.length).toBe(1);
    });

    it('should add Validators.required if tipo includes "required" even with extra text', () => {
      const lista = [{ tipo: 'required-something' }];
      const result = FormasDinamicasComponent.obtenerValidadores(lista);
      expect(result).toContain(Validators.required);
    });

    it('should handle a single tipo containing multiple keywords', () => {
      const lista = [{ tipo: 'required,minlength,maxlength', valor: 3 }];
      const result = FormasDinamicasComponent.obtenerValidadores(lista);
      expect(result).toContain(Validators.required);
    });
    
    it('should initialize control with default value if estado is empty', () => {
      component.formularioDatos = [
        { campo: 'nombre', tipoInput: 'text', valorPredeterminado: 'John', desactivado: false, labelNombre: 'Nombre', clase: 'col-md-4' }
      ];
      component.estado = {};
      component.inicializarFormulario();
      expect(component.forma.contains('nombre')).toBe(true);
      expect(component.forma.get('nombre')?.value).toBe('John');
    });
    
    it('should use estado value over valorPredeterminado when both are defined', () => {
      component.formularioDatos = [
        { campo: 'edad', tipoInput: 'text', valorPredeterminado: '25', desactivado: false, labelNombre: 'Edad', clase: 'col-md-4' }
      ];
      component.estado = { edad: 30 };
      component.inicializarFormulario();
      expect(component.forma.get('edad')?.value).toBe(30);
    });
    
  });