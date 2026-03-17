import { TestBed } from '@angular/core/testing';
import { DireccionEmpresaComponent } from './direccion-empresa.component';
import { FormGroup, FormGroupDirective, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Tramite30401Store } from '../../estados/tramites30401.store';

describe('DireccionEmpresaComponent', () => {
  let component: DireccionEmpresaComponent;
  let formGroupDirective: FormGroupDirective;
  let tramite30401Store: Tramite30401Store;

  beforeEach(() => {
    tramite30401Store = {
      establecerDatos: jest.fn(),
    } as unknown as Tramite30401Store;

    formGroupDirective = {
      control: new FormGroup({}),
    } as unknown as FormGroupDirective;

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, DireccionEmpresaComponent],
      providers: [
        { provide: FormGroupDirective, useValue: formGroupDirective },
        { provide: Tramite30401Store, useValue: tramite30401Store },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(DireccionEmpresaComponent);
    component = fixture.componentInstance;
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el grupo de formulario en ngOnInit', () => {
    const mockFormGroup = new FormGroup({});
    jest.spyOn(formGroupDirective.control, 'get').mockReturnValue(mockFormGroup);

    component.grupoDeFormulario = 'testGroup';
    component.ngOnInit();

    expect(formGroupDirective.control.get).toHaveBeenCalledWith('testGroup');
    expect(component.inicializarFormulario).toBe(mockFormGroup);
  });

  it('Debería llamar a establecerDatos en setValoresStore', () => {
    const mockFormGroup = new FormGroup({});
    jest.spyOn(mockFormGroup, 'get').mockReturnValue({ value: 'testValue' } as any);

    component.setValoresStore(mockFormGroup, 'testField');

    expect(tramite30401Store.establecerDatos).toHaveBeenCalledWith({ testField: 'testValue' });
  });

  it('Debe devolver verdadero si un control no es válido, está tocado o sucio en esInvalido', () => {
    const mockControl = {
      invalid: true,
      touched: true,
      dirty: false,
    };

    component.inicializarFormulario = new FormGroup({
      testControl: new FormControl(),
    });

    jest.spyOn(component.inicializarFormulario, 'get').mockReturnValue(mockControl as any);

    const result = component.esInvalido('testControl');
    expect(result).toBe(true);
  });

  it('Debe devolver falso si un control es válido en esInvalido', () => {
    const mockControl = {
      invalid: false,
      touched: false,
      dirty: false,
    };

    component.inicializarFormulario = new FormGroup({
      testControl: new FormControl(),
    });

    jest.spyOn(component.inicializarFormulario, 'get').mockReturnValue(mockControl as any);

    const result = component.esInvalido('testControl');
    expect(result).toBe(false);
  });
});