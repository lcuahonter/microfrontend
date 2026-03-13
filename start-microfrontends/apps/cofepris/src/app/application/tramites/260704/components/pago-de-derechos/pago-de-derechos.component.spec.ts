import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PagoDeDerechosComponent } from './pago-de-derechos.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PagoDeDerechosComponent', () => {
  let component: PagoDeDerechosComponent;
  let fixture: ComponentFixture<PagoDeDerechosComponent>;
  let mockConsulta: any;
  let mockStore: any;
  let mockQuery: any;
  let mockValidacionesService: any;
  let mockConsultaioQuery: any;

  beforeEach(async () => {
    mockConsulta = {
      obtenerDatosBanco: jest.fn().mockReturnValue(of([{ id: 1, descripcion: 'Banco 1' }])),
    };
    mockStore = {
      setFechaPago: jest.fn(),
    };
    mockQuery = {
      selectSolicitud$: of({
        claveDeReferencia: 'ref',
        cadenaDependecia: 'dep',
        fechaPago: '2024-01-01',
        banco: 'Banco 1',
        importeDePago: 100,
      }),
    };
    mockValidacionesService = {
      isValid: jest.fn().mockReturnValue(true),
    };
    mockConsultaioQuery = {
      selectConsultaioState$: of({ readonly: false }),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule,PagoDeDerechosComponent],
      declarations: [],
      providers: [
        { provide: FormBuilder, useValue: new FormBuilder() },
        { provide: 'consulta', useValue: mockConsulta },
        { provide: 'store', useValue: mockStore },
        { provide: 'query', useValue: mockQuery },
        { provide: 'validacionesService', useValue: mockValidacionesService },
        { provide: 'consultaioQuery', useValue: mockConsultaioQuery },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(PagoDeDerechosComponent, {
        set: {
          providers: [
            { provide: 'consulta', useValue: mockConsulta },
            { provide: 'store', useValue: mockStore },
            { provide: 'query', useValue: mockQuery },
            { provide: 'validacionesService', useValue: mockValidacionesService },
            { provide: 'consultaioQuery', useValue: mockConsultaioQuery },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(PagoDeDerechosComponent);
    component = fixture.componentInstance;

    // Inicializar el estado de la solicitud para los formularios
    component.solicitudState = {
      claveDeReferencia: 'ref',
      cadenaDependecia: 'dep',
      fechaPago: '2024-01-01',
      banco: 'Banco 1',
      importeDePago: 100,
    } as any;

    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario correctamente en donanteDomicilio', () => {
    component.soloLectura = false;
    component.donanteDomicilio();
    expect(component.pagoDeDerechosForm).toBeDefined();
    expect(component.pagoDeDerechosForm.get('claveDeReferencia')?.value).toBe('ref');
  });

  it('debería deshabilitar el formulario si soloLectura es true en guardarDatosFormulario', () => {
    component.soloLectura = true;
    component.donanteDomicilio();
    component.guardarDatosFormulario();
    expect(component.pagoDeDerechosForm.disabled).toBe(true);
  });

  it('debería habilitar el formulario si soloLectura es false en guardarDatosFormulario', () => {
    component.soloLectura = false;
    component.donanteDomicilio();
    component.guardarDatosFormulario();
    expect(component.pagoDeDerechosForm.enabled).toBe(true);
  });

  it('debería obtener datos de banco y asignar al catálogo', () => {
    component.obtenerDatosBanco();
    expect(component.bancoCatalogo.catalogos.length).toBeGreaterThan(0);
    expect(component.bancoCatalogo.catalogos[0].descripcion).toBe('Banco 1');
  });

  it('debería actualizar la fecha de pago y llamar al store', () => {
    component.donanteDomicilio();
    const spy = jest.spyOn(component, 'setValoresStore');
    component.cambioFechaPago('2024-02-02');
    expect(component.pagoDeDerechosForm.get('fechaPago')?.value).toBe('2024-02-02');
    expect(spy).toHaveBeenCalledWith(component.pagoDeDerechosForm, 'fechaPago', 'setFechaPago');
  });

  it('debería validar un campo usando el servicio', () => {
    component.donanteDomicilio();
    expect(component.isValid(component.pagoDeDerechosForm, 'banco')).toBe(true);
  });

  it('debería llamar al método del store en setValoresStore', () => {
    component.donanteDomicilio();
    component.pagoDeDerechosForm.get('fechaPago')?.setValue('2024-03-03');
    component.setValoresStore(component.pagoDeDerechosForm, 'fechaPago', 'setFechaPago');
    expect(mockStore.setFechaPago).toHaveBeenCalledWith('2024-03-03');
  });

  it('debería inicializar el formulario en inicializarEstadoFormulario según soloLectura', () => {
    const spyGuardar = jest.spyOn(component, 'guardarDatosFormulario');
    const spyDonante = jest.spyOn(component, 'donanteDomicilio');
    component.soloLectura = true;
    component.inicializarEstadoFormulario();
    expect(spyGuardar).toHaveBeenCalled();
    component.soloLectura = false;
    component.inicializarEstadoFormulario();
    expect(spyDonante).toHaveBeenCalled();
  });

  it('debería limpiar destroyed$ en ngOnDestroy', () => {
    const spyNext = jest.spyOn((component as any).destroyed$, 'next');
    const spyComplete = jest.spyOn((component as any).destroyed$, 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalledWith(true);
    expect(spyComplete).toHaveBeenCalled();
  });
});