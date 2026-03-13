import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup, FormGroupDirective, FormControl } from '@angular/forms';
import { CapitalSocialComponent } from './capital-social.component';
import { Tramite30401Store } from '../../estados/tramites30401.store';
import { CommonModule } from '@angular/common';
import { TituloComponent } from '@libs/shared/data-access-user/src';

describe('CapitalSocialComponent', () => {
  let component: CapitalSocialComponent;
  let fixture: ComponentFixture<CapitalSocialComponent>;
  let mockTramite30401Store: jest.Mocked<Tramite30401Store>;
  let mockFormGroupDirective: Partial<FormGroupDirective>;

  beforeEach(async () => {
    mockTramite30401Store = {
      establecerDatos: jest.fn(),
    } as unknown as jest.Mocked<Tramite30401Store>;
    mockFormGroupDirective = {
      control: new FormGroup({}),
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule, TituloComponent, CapitalSocialComponent],
      providers: [
        { provide: Tramite30401Store, useValue: mockTramite30401Store },
        { provide: FormGroupDirective, useValue: mockFormGroupDirective },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CapitalSocialComponent);
    component = fixture.componentInstance;
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el grupo de formulario en ngOnInit', () => {
    const mockFormGroup = new FormGroup({});
    mockFormGroupDirective?.control?.addControl('testGroup', mockFormGroup);
    component.grupoDeFormulario = 'testGroup';

    component.ngOnInit();

    expect(component.inicializarFormulario).toBe(mockFormGroup);
  });

  it('Debería llamar a establecerDatos en setValoresStore', () => {
    const mockFormGroup = new FormGroup({});
    const mockField = 'testField';
    const mockValue = 'testValue';

    mockFormGroup.addControl(mockField, new FormControl(mockValue));
    component.setValoresStore(mockFormGroup, mockField);

    expect(mockTramite30401Store.establecerDatos).toHaveBeenCalledWith({ [mockField]: mockValue });
  });

  it('Debe devolver verdadero si un control no es válido y está tocado o sucio en esInvalido', () => {
    const mockFormGroup = new FormGroup({});
    const mockControlName = 'testControl';

    const mockControl = new FormControl(null);
    mockControl.setErrors({ required: true });
    mockControl.markAsTouched();

    mockFormGroup.addControl(mockControlName, mockControl);
    component.inicializarFormulario = mockFormGroup;

    const result = component.esInvalido(mockControlName);

    expect(result).toBe(true);
  });

  it('Debe devolver falso si un control es válido o no está tocado/sucio en esInvalido', () => {
    const mockFormGroup = new FormGroup({});
    const mockControlName = 'testControl';

    const mockControl = new FormControl(null);

    mockFormGroup.addControl(mockControlName, mockControl);
    component.inicializarFormulario = mockFormGroup;

    const result = component.esInvalido(mockControlName);

    expect(result).toBe(false);
  });

  it('Debería manejar con elegancia el control faltante en esInvalido', () => {
    const mockFormGroup = new FormGroup({});
    component.inicializarFormulario = mockFormGroup;

    const result = component.esInvalido('nonExistentControl');

    expect(result).toBe(false);
  });

  it('No se debe llamar a establecerDatos si el valor del control es nulo en setValoresStore', () => {
    const mockFormGroup = new FormGroup({});
    const mockField = 'testField';

    mockFormGroup.addControl(mockField, new FormControl(null));
    component.setValoresStore(mockFormGroup, mockField);

    expect(mockTramite30401Store.establecerDatos).not.toHaveBeenCalled();
  });

  it('Debería manejar el grupo de formato nulo en setValoresStore con elegancia', () => {
    component.setValoresStore(null as any, 'testField');

    expect(mockTramite30401Store.establecerDatos).not.toHaveBeenCalled();
  });

  it('Debería manejar el grupo de formato nulo en setValoresStore con elegancia', () => {
    component.setValoresStore(null, 'testField');

    expect(mockTramite30401Store.establecerDatos).not.toHaveBeenCalled();
  });
});