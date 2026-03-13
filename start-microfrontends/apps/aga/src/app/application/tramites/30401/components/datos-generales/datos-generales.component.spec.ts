import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosGeneralesComponent } from './datos-generales.component';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { Tramite30401Store } from '../../estados/tramites30401.store';
import { CommonModule } from '@angular/common';
import { CatalogoSelectComponent, TituloComponent } from '@libs/shared/data-access-user/src';

describe('DatosGeneralesComponent', () => {
  let component: DatosGeneralesComponent;
  let fixture: ComponentFixture<DatosGeneralesComponent>;
  let mockFormGroupDirective: FormGroupDirective;
  let mockStore: Tramite30401Store;

  beforeEach(async () => {
    const formBuilder = new FormBuilder();
    const rootFormGroup = formBuilder.group({
      datos: formBuilder.group({
        tipoTransito: new FormControl(''),
        descripcion: new FormControl(''),
        cveFolioCaat: new FormControl('') 
      })
    });

    mockFormGroupDirective = {
      control: rootFormGroup
    } as FormGroupDirective;

    mockStore = {
      establecerDatos: jest.fn()
    } as unknown as Tramite30401Store;

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        DatosGeneralesComponent, TituloComponent, CatalogoSelectComponent
      ],
      providers: [
        { provide: FormGroupDirective, useValue: mockFormGroupDirective },
        { provide: Tramite30401Store, useValue: mockStore }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosGeneralesComponent);
    component = fixture.componentInstance;
    component.grupoDeFormulario = 'datos';
    component.tipoTransitoList$ = of([]);
    component.cveFolioCaat$ = of('CAAT123');
    component.titulo = 'Título de Prueba';
    fixture.detectChanges(); 
  });

  it('debería crear', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el grupo de formularios en ngOnInit', () => {
    expect(component.inicializarFormulario).toBeTruthy();
    expect(component.inicializarFormulario.contains('tipoTransito')).toBe(true);
  });

  it('Debe devolver verdadero si el control no es válido y está tocado o sucio', () => {
    const control = component.inicializarFormulario.get('tipoTransito');
    control?.markAsTouched();
    control?.setErrors({ required: true });

    expect(component.esInvalido('tipoTransito')).toBe(true);
  });

  it('Debe devolver falso si el control es válido', () => {
    const control = component.inicializarFormulario.get('tipoTransito');
    control?.setValue('valid');
    control?.markAsTouched();

    expect(component.esInvalido('tipoTransito')).toBe(false);
  });

  it('Debería llamar a store.establecerDatos con el valor correcto', () => {
    component.inicializarFormulario.get('descripcion')?.setValue('Trámite de prueba');
    component.setValoresStore(component.inicializarFormulario, 'descripcion');

    expect(mockStore.establecerDatos).toHaveBeenCalledWith({ descripcion: 'Trámite de prueba' });
  });

  it('Debe devolver verdadero si un control no es válido, está tocado o sucio en esInvalido', () => {
    const mockControl = {
      invalid: true,
      touched: true,
      dirty: false,
    };

    jest.spyOn(component.inicializarFormulario, 'get').mockReturnValue(mockControl as any);

    const result = component.esInvalido('tipoTransito');
    expect(result).toBe(true);
  });

  it('Debe devolver falso si un control es válido en esInvalido', () => {
    const mockControl = {
      invalid: false,
      touched: true,
      dirty: false,
    };

    jest.spyOn(component.inicializarFormulario, 'get').mockReturnValue(mockControl as any);

    const result = component.esInvalido('tipoTransito');
    expect(result).toBe(false);
  });
});
