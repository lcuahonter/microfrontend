import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosGeneralesAnimalesComponent } from './datos-generales-animales.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Agregar220401Store } from '../../../../estados/tramites/agregar220401.store';
import { AgregarQuery } from '../../../../estados/queries/agregar.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of, Subject } from 'rxjs';

describe('DatosGeneralesAnimalesComponent', () => {
  let component: DatosGeneralesAnimalesComponent;
  let fixture: ComponentFixture<DatosGeneralesAnimalesComponent>;
  let agregar220401StoreMock: any;
  let agregarQueryMock: any;
  let consultaioQueryMock: any;

  beforeEach(async () => {
    agregar220401StoreMock = {
      setFraccionArancelaria: jest.fn(),
      setTratamiento: jest.fn(),
      setPresentacion: jest.fn(),
      setMarcaEmbarque: jest.fn(),
      setFechaCaducidad: jest.fn(),
      setAduana: jest.fn(),
      setCites: jest.fn(),
      setNombreIdentificacion: jest.fn(),
      setNumeroAutorizacionCITES: jest.fn(),
      setRaza: jest.fn(),
      setEdadAnimal: jest.fn(),
      setSexo: jest.fn(),
      setColor: jest.fn(),
    };

    agregarQueryMock = {
      selectSolicitud$: of({
        fraccionArancelaria: '12345678',
        fechaCaducidad: '2025-01-01',
        nombreIdentificacion: 'Animal',
        raza: 'Bovino',
        edadAnimal: '2',
        sexo: 'Macho',
        color: 'Negro',
        aduana: 'Aduana1'
      }),
    };

    consultaioQueryMock = {
      selectConsultaioState$: of({ readonly: false }),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule,DatosGeneralesAnimalesComponent],
      declarations: [],
      providers: [
        FormBuilder,
        { provide: Agregar220401Store, useValue: agregar220401StoreMock },
        { provide: AgregarQuery, useValue: agregarQueryMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosGeneralesAnimalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit debe llamar inicializarGeneralesFormulario', () => {
    const spy = jest.spyOn(component, 'inicializarGeneralesFormulario');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('inicializarGeneralesFormulario debe llamar guardarDatosFormulario si es solo lectura', () => {
    const spy = jest.spyOn(component, 'guardarDatosFormulario');
    component.esFormularioSoloLectura = true;
    component.inicializarGeneralesFormulario();
    expect(spy).toHaveBeenCalled();
  });

  it('inicializarGeneralesFormulario debe llamar inicializarFormulario si no es solo lectura', () => {
    const spy = jest.spyOn(component, 'inicializarFormulario');
    component.esFormularioSoloLectura = false;
    component.inicializarGeneralesFormulario();
    expect(spy).toHaveBeenCalled();
  });

  it('guardarDatosFormulario debe deshabilitar el formulario si es solo lectura', () => {
    component.esFormularioSoloLectura = true;
    component.inicializarFormulario();
    component.guardarDatosFormulario();
    expect(component.frmMercanciaAnimal.disabled).toBe(true);
  });

  it('guardarDatosFormulario debe habilitar el formulario si no es solo lectura', () => {
    component.esFormularioSoloLectura = false;
    component.inicializarFormulario();
    component.guardarDatosFormulario();
    expect(component.frmMercanciaAnimal.enabled).toBe(true);
  });

  it('inicializarFormulario debe crear el formulario con los valores del store', () => {
    component.inicializarFormulario();
    expect(component.frmMercanciaAnimal).toBeDefined();
    expect(component.frmMercanciaAnimal.get('fraccionArancelaria')?.value).toBe('12345678');
    expect(component.frmMercanciaAnimal.get('fechaCaducidad')?.value).toBe('2025-01-01');
    expect(component.frmMercanciaAnimal.get('nombreIdentificacion')?.value).toBe('Animal');
    expect(component.frmMercanciaAnimal.get('raza')?.value).toBe('Bovino');
    expect(component.frmMercanciaAnimal.get('edadAnimal')?.value).toBe('2');
    expect(component.frmMercanciaAnimal.get('sexo')?.value).toBe('Macho');
    expect(component.frmMercanciaAnimal.get('color')?.value).toBe('Negro');
    expect(component.frmMercanciaAnimal.get('aduana')?.value).toBe('Aduana1');
  });

  it('aduanaSeleccionOne debe actualizar selectedAduanaOne', () => {
    const aduana = { id: 2, descripcion: 'Aduana Test' };
    component.aduanaSeleccionOne(aduana);
    expect(component.selectedAduanaOne).toEqual(aduana);
  });

  it('obtenerDescripcionFraccion debe establecer la descripción de la fracción', () => {
    component.inicializarFormulario();
    component.frmMercanciaAnimal.addControl('descFraccionArancelaria', component['fb'].control(''));
    component.obtenerDescripcionFraccion();
    expect(component.frmMercanciaAnimal.get('descFraccionArancelaria')?.value).toBe('Descripción de la fracción');
  });

  it('limpiarDatosCapturaMercancia debe limpiar el formulario', () => {
    component.inicializarFormulario();
    component.frmMercanciaAnimal.get('fraccionArancelaria')?.setValue('valor');
    component.limpiarDatosCapturaMercancia();
    expect(component.frmMercanciaAnimal.get('fraccionArancelaria')?.value).toBeNull();
  });


  it('descripcionEspecialesValidator debe retornar error si el valor no es válido', () => {
    const control = { value: '  valor inválido' } as any;
    const result = DatosGeneralesAnimalesComponent.descripcionEspecialesValidator(control);
    expect(result).toEqual({ descripcionEspeciales: 'Ingresa datos válidos.' });
  });

  it('descripcionEspecialesValidator debe retornar null si el valor es válido', () => {
    const control = { value: 'DescripcionValida' } as any;
    // Simula que los regex permiten el valor
    jest.spyOn(global, 'RegExp').mockImplementation(() => ({ test: () => false }) as any);
    const result = DatosGeneralesAnimalesComponent.descripcionEspecialesValidator(control);
    expect(result).toBeNull();
  });

  it('descripcionValidator debe retornar null si el valor existe', () => {
    const control = { value: 'algo' } as any;
    const result = DatosGeneralesAnimalesComponent.descripcionValidator(control);
    expect(result).toBeNull();
  });

  it('descripcionValidator debe retornar error si el valor es vacío', () => {
    const control = { value: '' } as any;
    const result = DatosGeneralesAnimalesComponent.descripcionValidator(control);
    expect(result).toEqual({ descripcion: true });
  });

  it('valueRangeValidator debe retornar error si el valor está fuera de rango', () => {
    const validator = DatosGeneralesAnimalesComponent.valueRangeValidator(1, 10);
    const control = { value: '0' } as any;
    expect(validator(control)).toEqual({ valueRange: true });
  });

  it('valueRangeValidator debe retornar null si el valor está en rango', () => {
    const validator = DatosGeneralesAnimalesComponent.valueRangeValidator(1, 10);
    const control = { value: '5' } as any;
    expect(validator(control)).toBeNull();
  });

  it('ngOnDestroy debe limpiar el subject destroyNotifier$', () => {
    const spyNext = jest.spyOn((component as any).destroyNotifier$, 'next');
    const spyComplete = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });
});