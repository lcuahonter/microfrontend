import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CatalogoSelectComponent } from './catalogo-select.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Catalogo } from '../../../core/models/shared/catalogos.model';

describe('CatalogoSelectComponent', () => {
  let component: CatalogoSelectComponent;
  let fixture: ComponentFixture<CatalogoSelectComponent>;

  const catalogoMock: Catalogo[] = [
    { id: 1, descripcion: 'Opción 1' },
    { id: 2, descripcion: 'Opción 2' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogoSelectComponent, ReactiveFormsModule],
      providers: [FormBuilder],
    }).compileComponents();

    fixture = TestBed.createComponent(CatalogoSelectComponent);
    component = fixture.componentInstance;
    component.catalogo = catalogoMock;
    component.id = 'test-select';
    component.label = 'Test Label';
    component.placeholder = 'Seleccione una opción';
    component.required = false;
    component.isDisabled = false;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize formSelect with default value', () => {
    expect(component.formSelect.get('selectControl')?.value).toBe(-1);
  });

  it('should set validators when required input changes', () => {
    component.required = true;
    component.ngOnChanges({
      required: {
        currentValue: true,
        previousValue: false,
        firstChange: false,
        isFirstChange: () => false,
      },
    });
    const validators = component.formSelect.get('selectControl')?.validator;
    expect(validators).toBeTruthy();
  });

  it('should clear validators when required is set to false', () => {
    component.required = false;
    component.ngOnChanges({
      required: {
        currentValue: false,
        previousValue: true,
        firstChange: false,
        isFirstChange: () => false,
      },
    });
    const validators = component.formSelect.get('selectControl')?.validator;
    expect(validators).toBeFalsy();
  });

  it('should disable control when isDisabled is true', () => {
    component.isDisabled = true;
    component.ngOnChanges({
      isDisabled: {
        currentValue: true,
        previousValue: false,
        firstChange: false,
        isFirstChange: () => false,
      },
    });
    expect(component.formSelect.get('selectControl')?.disabled).toBe(true);
  });

  it('should enable control when isDisabled is false', () => {
    component.isDisabled = false;
    component.ngOnChanges({
      isDisabled: {
        currentValue: false,
        previousValue: true,
        firstChange: false,
        isFirstChange: () => false,
      },
    });
    expect(component.formSelect.get('selectControl')?.enabled).toBe(true);
  });

  it('should emit selectionChange with correct Catalogo on handleChange', () => {
    jest.spyOn(component.selectionChange, 'emit');
    const event = { target: { value: '2' } } as unknown as Event;
    component.handleChange(event);
    expect(component.selectionChange.emit).toHaveBeenCalledWith(
      catalogoMock[1]
    );
  });

  it('should call registered onChange function with selected value on handleChange', () => {
    const onChangeSpy = jest.fn();
    component.registerOnChange(onChangeSpy);
    const event = { target: { value: '1' } } as unknown as Event;
    component.handleChange(event);
    expect(onChangeSpy).toHaveBeenCalledWith('1');
  });

  it('should reset form control when writeValue is called with null', () => {
    component.formSelect.get('selectControl')?.setValue('2');
    component.writeValue(null as any);
    expect(component.formSelect.get('selectControl')?.value).toBe('');
  });

  it('should set value in form control when writeValue is called with value', () => {
    component.writeValue('2');
    expect(component.formSelect.get('selectControl')?.value).toBe('2');
  });

  it('should return true from isInvalid if control is invalid and touched', () => {
    component.required = true;
    component.ngOnChanges({
      required: {
        currentValue: true,
        previousValue: false,
        firstChange: false,
        isFirstChange: () => false,
      },
    });
    const control = component.formSelect.get('selectControl');
    control?.markAsTouched();
    control?.setValue(-1);
    expect(component.isInvalid()).toBe(true);
  });

  it('should return null from isInvalid if control does not exist', () => {
    // Simulate missing control
    jest.spyOn(component.formSelect, 'get').mockReturnValue(null as any);
    expect(component.isInvalid()).toBeNull();
  });

  it('should register onChange and subscribe to valueChanges', () => {
    const fn = jest.fn();
    component.registerOnChange(fn);
    component.formSelect.get('selectControl')?.setValue('1');
    expect(fn).toHaveBeenCalledWith('1');
  });

  it('should register onTouched', () => {
    const fn = jest.fn();
    component.registerOnTouched(fn);
    // Call the registered onTouched function instead of the private method
    (component as any)._onTouched();
    expect(fn).toHaveBeenCalled();
  });

  it('should set isDisabled when setDisabledState is called', () => {
    component.setDisabledState?.(true);
    expect(component.isDisabled).toBe(true);
    component.setDisabledState?.(false);
    expect(component.isDisabled).toBe(false);
  });
});
