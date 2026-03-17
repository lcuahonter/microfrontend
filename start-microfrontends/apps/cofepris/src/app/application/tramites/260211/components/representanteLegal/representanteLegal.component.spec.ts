/* apps/cofepris/src/app/application/tramites/260211/components/representanteLegal/representanteLegal.component.spec.ts */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';

import { RepresentanteLegalComponent } from './representanteLegal.component';
import { ValidacionesFormularioService } from '@libs/shared/data-access-user/src';

describe('RepresentanteLegalComponent', () => {
  let component: RepresentanteLegalComponent;
  let fixture  : ComponentFixture<RepresentanteLegalComponent>;

  const mockStore = {
    setRfc: jest.fn(),
    setNombre: jest.fn(),
    setApellidoPaterno: jest.fn(),
    setApellidoMaterno: jest.fn(),
  };
  const mockQuery = {
    selectSolicitud$: {
      pipe: jest.fn().mockReturnValue({
        subscribe: jest.fn((cb) => cb({
          rfc: 'RFC123',
          nombre: 'Nombre',
          apellidoPaterno: 'Paterno',
          apellidoMaterno: 'Materno'
        }))
      })
    }
  };
  const mockConsultaioQuery = {
    selectConsultaioState$: {
      pipe: jest.fn().mockReturnValue({
        subscribe: jest.fn()
      })
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        RepresentanteLegalComponent,
      ],
      providers: [
        FormBuilder,
        ValidacionesFormularioService,
        { provide: 'Tramite260211Store', useValue: mockStore },
        { provide: 'Tramite260211Query', useValue: mockQuery },
        { provide: 'ConsultaioQuery', useValue: mockConsultaioQuery }
      ],
    }).overrideComponent(RepresentanteLegalComponent, {
      set: {
        providers: [
          { provide: 'Tramite260211Store', useValue: mockStore },
          { provide: 'Tramite260211Query', useValue: mockQuery },
          { provide: 'ConsultaioQuery', useValue: mockConsultaioQuery }
        ]
      }
    }).compileComponents();

    fixture   = TestBed.createComponent(RepresentanteLegalComponent);
    component = fixture.componentInstance;
    // Inicializa el formulario manualmente para los tests
    component.solicitudState = {
      rfc: 'RFC123',
      nombre: 'Nombre',
      apellidoPaterno: 'Paterno',
      apellidoMaterno: 'Materno'
    } as any;
    component.inicializarFormulario();
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario con los valores por defecto', () => {
    const form = component.representante;
    expect(form).toBeDefined();
    expect(form.get('rfc')?.value).toBe('');
    expect(form.get('nombre')?.value).toBe('');
    expect(form.get('apellidoPaterno')?.value).toBe('');
    expect(form.get('apellidoMaterno')?.value).toBe('');
  });

  it('debe obtener valores y actualizar el formulario', () => {
    component.obtenerValor();
    expect(component.representante.get('rfc')?.value).toBe('XAXX010101000');
    expect(component.representante.get('nombre')?.value).toBe(47875);
    expect(component.representante.get('apellidoPaterno')?.value).toBe('Paterno');
    expect(component.representante.get('apellidoMaterno')?.value).toBe('Materno');
  });

  it('debe deshabilitar el formulario si esFormularioSoloLectura es true', () => {
    component.esFormularioSoloLectura = true;
    component.guardarDatosFormulario();
    expect(component.representante.disabled).toBe(true);
  });

  it('debe habilitar el formulario si esFormularioSoloLectura es false', () => {
    component.esFormularioSoloLectura = false;
    component.guardarDatosFormulario();
    expect(component.representante.enabled).toBe(true);
  });

  it('debe limpiar correctamente los observables en ngOnDestroy', () => {
    const spy1 = jest.spyOn((component as any).destroyNotifier$, 'next');
    const spy2 = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });
});
