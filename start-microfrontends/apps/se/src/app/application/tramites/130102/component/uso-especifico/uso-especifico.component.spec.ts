import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsoEspicificoComponent } from './uso-especifico.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { TableComponent } from 'libs/shared/data-access-user/src/tramites/components/table/table.component';
import { TituloComponent } from "libs/shared/data-access-user/src/tramites/components/titulo/titulo.component";
import { CommonModule } from '@angular/common';
import { FormularioRegistroService } from '../../services/octava-temporal.service';
import { Tramite130102Store } from '../../../../estados/tramites/tramite130102.store';
import { Tramite130102Query } from '../../../../estados/queries/tramite130102.query';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { of, Subject } from 'rxjs';

describe('UsoEspicificoComponent', () => {
  let component: UsoEspicificoComponent;
  let fixture: ComponentFixture<UsoEspicificoComponent>;

  const mockFormRegistroService = {
    registrarFormulario: jest.fn(),
    getFraccionesUsoEspecifico: jest.fn().mockReturnValue(of([]))
  };

  const mockStore = {
    setFraccionArancelariaProsec: jest.fn(),
    setDescripcion: jest.fn(),
    setDynamicFieldValue: jest.fn(),
    getValue: jest.fn(() => ({ 
      uso_especifico_tabla: [
      {
        fraccionArancelariaProsec: '01039101',
        descripción: 'Cerdo vivo de raza pura'
      }
    ]
     }))
  };

  const solicitudMockState = {
    fraccionArancelariaProsec: '01039101'
  };

  const consultaioSubject = new Subject<any>();
  const tramiteQuerySubject = new Subject<any>();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UsoEspicificoComponent,
        ReactiveFormsModule,
        CatalogoSelectComponent,
        TableComponent,
        TituloComponent,
        CommonModule
      ],
      providers: [
        FormBuilder,
        { provide: Tramite130102Store, useValue: mockStore },
        {
          provide: Tramite130102Query,
          useValue: {
            selectSolicitud$: tramiteQuerySubject.asObservable()
          }
        },
        {
          provide: ConsultaioQuery,
          useValue: {
            selectConsultaioState$: consultaioSubject.asObservable()
          }
        },
        { provide: FormularioRegistroService, useValue: mockFormRegistroService }
      ]
    }).compileComponents();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe crear el componente', () => {
    fixture = TestBed.createComponent(UsoEspicificoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('debería llamar a setValoresStore y almacenar el valor', () => {
    consultaioSubject.next({ readonly: false });
    tramiteQuerySubject.next(solicitudMockState);

    fixture = TestBed.createComponent(UsoEspicificoComponent);
    component = fixture.componentInstance;
    component.ngOnInit();

    component.usoEspicificoForm.get('fraccionArancelariaProsec')?.setValue('01039101');
    component.setValoresStore(component.usoEspicificoForm, 'fraccionArancelariaProsec', 'setFraccionArancelariaProsec');
    expect(mockStore.setFraccionArancelariaProsec).toHaveBeenCalledWith('01039101');
  });


  it('No debe validarse ningún espacio inicial', () => {
    const controlWithSpace = { value: '  Leading' } as any;
    const controlValid = { value: 'Valid' } as any;

    expect(UsoEspicificoComponent['noLeadingSpacesValidator'](controlWithSpace)).toEqual({ leadingSpaces: true });
    expect(UsoEspicificoComponent['noLeadingSpacesValidator'](controlValid)).toBeNull();
  });

  it('debería desuscribirse en destroy', () => {
    fixture = TestBed.createComponent(UsoEspicificoComponent);
    component = fixture.componentInstance;
    const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
 
  });

  it('debería agregar un elemento a datosSocios y restablecer el formulario en agregar()', () => {
    fixture = TestBed.createComponent(UsoEspicificoComponent);
    component = fixture.componentInstance;
    component.catalogos = [
      { id: 1, descripcion: 'Producto 1' },
      { id: 2, descripcion: 'Producto 2' },
    ];
    component.usoEspicificoForm = new FormBuilder().group({
      fraccionArancelariaProsec: [2],
      descripción: ['Test descripción']
    });
    const resetSpy = jest.spyOn(component.usoEspicificoForm, 'reset');
    component.agregar();
    expect(component.datosSocios.length).toBe(1);
    expect(component.datosSocios[0].fraccionArancelariaProsec).toBe('Producto 2');
    expect(component.datosSocios[0].descripción).toBe('Test descripción');
    expect(resetSpy).toHaveBeenCalled();
  });

  it('debería actualizar el campo descripción con texto predefinido', () => {
    consultaioSubject.next({ readonly: false });
    tramiteQuerySubject.next(solicitudMockState);
    fixture = TestBed.createComponent(UsoEspicificoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.obtenerRequisitosFraccionArancelariaEsquema();
    expect(component.usoEspicificoForm.get('descripción')?.value).toContain('Descripción fraccion PROSEC');
  });

  it('debería retornar la descripción correcta del catálogo', () => {
    fixture = TestBed.createComponent(UsoEspicificoComponent);
    component = fixture.componentInstance;
    component.catalogos = [{ id: 1, descripcion: 'Test Desc' }] as any;
    component.usoEspicificoForm = new FormBuilder().group({
      fraccionArancelariaProsec: 1,
      descripción: ''
    });
    const result = component.obtenerFraccionArancelariaProsec();
    expect(result).toBe('Test Desc');
  });

  it('debería inicializar el formulario con los controles', () => {
    fixture = TestBed.createComponent(UsoEspicificoComponent);
    component = fixture.componentInstance;
    component.inicializarFormulario();
    expect(component.usoEspicificoForm.contains('fraccionArancelariaProsec')).toBe(true);
    expect(component.usoEspicificoForm.contains('descripción')).toBe(true);
  });

  it('debería aplicar validadores requeridos', () => {
    fixture = TestBed.createComponent(UsoEspicificoComponent);
    component = fixture.componentInstance;
    component.inicializarFormulario();
    const fraccion = component.usoEspicificoForm.get('fraccionArancelariaProsec');
    const descripcion = component.usoEspicificoForm.get('descripción');
    fraccion?.setValue(null);
    descripcion?.setValue('');
    expect(fraccion?.valid).toBe(false);
    expect(descripcion?.valid).toBe(false);
  });

  it('debería agregar un elemento válido a datosSocios y restablecer el formulario', () => {
    fixture = TestBed.createComponent(UsoEspicificoComponent);
    component = fixture.componentInstance;
    component.catalogos = [{ id: 1, descripcion: 'Fracción A' }];
    component.inicializarFormulario();
    component.usoEspicificoForm.setValue({
      fraccionArancelariaProsec: 1,
      descripción: 'Descripción válida',
    });
    const initialLength = component.datosSocios.length;
    component.agregar();
    expect(component.datosSocios.length).toBe(initialLength + 1);
    expect(component.usoEspicificoForm.value.fraccionArancelariaProsec).toBeNull();
  });


  it('No se deben agregar entradas duplicadas de fraccionArancelariaProsec', () => {
    fixture = TestBed.createComponent(UsoEspicificoComponent);
    component = fixture.componentInstance;
    component.datosSocios = [{
      fraccionArancelariaProsec: '01039101',
      descripción: 'Cerdo vivo'
    }];
    component.catalogos = [{ id: 1, descripcion: 'Cerdo vivo' }];
    component.usoEspicificoForm.patchValue({
      fraccionArancelariaProsec: 1
    });
    fixture.detectChanges();
    component.agregar();
    expect(component.datosSocios.length).toBe(1);
  });

  it('debería establecer el valor de descripción cuando se llama a obtenerRequisitosFraccionArancelariaEsquema', () => {
    fixture = TestBed.createComponent(UsoEspicificoComponent);
    component = fixture.componentInstance;
    component.inicializarFormulario();
    const descripcionControl = component.usoEspicificoForm.get('descripción');
    expect(descripcionControl?.value).toBe('');
    component.obtenerRequisitosFraccionArancelariaEsquema();
    expect(descripcionControl?.value).toBe(
      'Descripción fraccion PROSEC (Especificar el nombre comercial o técnico del producto en el que se utilizará la mercancía a importar)'
    );
  });

  it('debería retornar la descripción correcta de la fracción arancelaria', () => {
    fixture = TestBed.createComponent(UsoEspicificoComponent);
    component = fixture.componentInstance;
    component.catalogos = [
      { id: 1, descripcion: 'Fracción 1' },
      { id: 2, descripcion: 'Fracción 2' }
    ];
    component.inicializarFormulario();
    component.usoEspicificoForm.get('fraccionArancelariaProsec')?.setValue(2);
    const result = component.obtenerFraccionArancelariaProsec();
    expect(result).toBe('Fracción 2');
  });

it('debería deshabilitar el formulario si readonly es true en guardarDatosFormulario', () => {
  fixture = TestBed.createComponent(UsoEspicificoComponent);
  component = fixture.componentInstance;
  component.consultaState = { readonly: true } as any;

  component.inicializarFormulario();
  component.guardarDatosFormulario();

  expect(component.usoEspicificoForm.disabled).toBe(true);
});

it('debería habilitar el formulario si readonly es false en guardarDatosFormulario', () => {
  fixture = TestBed.createComponent(UsoEspicificoComponent);
  component = fixture.componentInstance;
  component.consultaState = { readonly: false } as any;

  component.inicializarFormulario();
  component.guardarDatosFormulario();

  expect(component.usoEspicificoForm.enabled).toBe(true);
});


});