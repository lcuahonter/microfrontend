// @ts-nocheck
import { TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ImmexRegistroSolicitudModalityComponent } from './immex-registro-solicitud-modality.component';
import { RegistroSolicitudService } from '@ng-mf/data-access-user';
import { ImmexRegistroQuery } from '../../estados/queries/tramite80203.query';
import { ImmexRegistroStore } from '../../estados/tramites/tramite80203.store';
import { ToastrService } from 'ngx-toastr';

@Directive({ selector: '[myCustom]' })
class MyCustomDirective {
  @Input() myCustom;
}

@Pipe({ name: 'translate' })
class TranslatePipe implements PipeTransform {
  transform(value) { return value; }
}

@Pipe({ name: 'phoneNumber' })
class PhoneNumberPipe implements PipeTransform {
  transform(value) { return value; }
}

@Pipe({ name: 'safeHtml' })
class SafeHtmlPipe implements PipeTransform {
  transform(value) { return value; }
}

describe('ImmexRegistroSolicitudModalityComponent', () => {
  let fixture;
  let component;
  let mockRegistroSolicitudService;
  let mockImmexRegistroQuery;
  let mockImmexRegistroStore;
  let mockToastrService;
  let mockStateData;

  beforeEach(() => {
    // Crear datos de estado mock
    mockStateData = {
      datosGenerales: {},
      empresas: [],
      plantas: [],
      fraccionTablaDatos: [
        {
          id: 1,
          fraccionArancelaria: {
            activo: true,
            capitulo: '61',
            cveFraccion: '61032301',
            cveUsuario: 'TEST123',
            descripcion: 'Test product description',
            descripcionUsuario: 'Test user description',
            fechaCaptura: '2025-01-01',
            fechaInicioVigencia: '2025-01-01',
            fraccionPadre: null,
            idProductoPadre: '123',
            nicoDtos: [],
            partida: '6103',
            subPartida: '610323',
            testado: true,
            umt: 'KG',
            unidadMedida: 'Kilogramo'
          }
        }
      ],
      immexTableDatos: [
        {
          consecutivo: 1,
          idProducto: 'PROD001',
          numeroPrograma: 'PROG001',
          descripcion: 'Test program description',
          umt: 'KG',
          cantidadAutorizada: 1000,
          fechaInicio: '2025-01-01',
          fechaFin: '2025-12-31',
          idMercanciaSub: 'MERC001',
          testado: true,
          claveUsuario: 'USER001'
        }
      ],
      nicoTablaDatosImportacion: [],
      candiadAnual: '100000',
      capacidadPeriodo: '8333',
      candidadPorPeriodo: '100000'
    };

    // Crear mocks para todas las dependencias
    mockRegistroSolicitudService = {
      postGuardarDatos: jest.fn()
    };

    mockImmexRegistroQuery = {
      selectImmexRegistro$: of(mockStateData)
    };

    mockImmexRegistroStore = {
      setIdSolicitud: jest.fn()
    };

    mockToastrService = {
      success: jest.fn(),
      error: jest.fn()
    };

    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      declarations: [
        ImmexRegistroSolicitudModalityComponent,
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: RegistroSolicitudService, useValue: mockRegistroSolicitudService },
        { provide: ImmexRegistroQuery, useValue: mockImmexRegistroQuery },
        { provide: ImmexRegistroStore, useValue: mockImmexRegistroStore },
        { provide: ToastrService, useValue: mockToastrService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ImmexRegistroSolicitudModalityComponent);
    component = fixture.debugElement.componentInstance;
    
    // Establecer la propiedad storeData directamente ya que ngOnInit necesita ser llamado para la suscripción
    component.storeData = mockStateData;
  });

  afterEach(() => {
    if (component) {
      component.ngOnDestroy = () => {};
    }
    if (fixture) {
      fixture.destroy();
    }
  });

  it('debería ejecutar el constructor correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería llamar wizardComponent.siguiente cuando la acción es "cont" y el servicio retorna éxito', () => {
    // Mock de respuesta exitosa del servicio
    mockRegistroSolicitudService.postGuardarDatos.mockReturnValue(of({
      codigo: '00',
      mensaje: 'Éxito',
      datos: { id_solicitud: 123 }
    }));

    // Mock del wizardComponent
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
      indiceActual: 1
    };

    component.getValorIndice({
      valor: 2,
      accion: 'cont'
    });

    expect(mockRegistroSolicitudService.postGuardarDatos).toHaveBeenCalledWith('80203', expect.any(Object));
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
    expect(mockToastrService.success).toHaveBeenCalledWith('Éxito');
    expect(mockImmexRegistroStore.setIdSolicitud).toHaveBeenCalledWith(123);
  });

  it('debería llamar wizardComponent.atras cuando la acción es "atras" y el servicio retorna éxito', () => {
    // Mock de respuesta exitosa del servicio
    mockRegistroSolicitudService.postGuardarDatos.mockReturnValue(of({
      codigo: '00',
      mensaje: 'Éxito',
      datos: { id_solicitud: 456 }
    }));

    // Mock del wizardComponent
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
      indiceActual: 2
    };

    component.getValorIndice({
      valor: 1,
      accion: 'atras'
    });

    expect(mockRegistroSolicitudService.postGuardarDatos).toHaveBeenCalledWith('80203', expect.any(Object));
    expect(component.wizardComponent.atras).toHaveBeenCalled();
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(mockToastrService.success).toHaveBeenCalledWith('Éxito');
    expect(mockImmexRegistroStore.setIdSolicitud).toHaveBeenCalledWith(456);
  });

  it('debería manejar respuesta de error del servicio', () => {
    // Mock de respuesta de error del servicio
    mockRegistroSolicitudService.postGuardarDatos.mockReturnValue(of({
      codigo: '01',
      mensaje: 'Ocurrió un error',
      error: 'Falló la validación'
    }));

    // Mock del wizardComponent
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
      indiceActual: 1
    };

    component.getValorIndice({
      valor: 2,
      accion: 'cont'
    });

    expect(component.esFormaValido).toBe(false);
    expect(component.indice).toBe(1);
    expect(component.wizardComponent.indiceActual).toBe(1);
    expect(component.formErrorAlert).toContain('Falló la validación');
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });

  it('no debería navegar si el valor está fuera de rango', () => {
    // Mock de respuesta exitosa del servicio
    mockRegistroSolicitudService.postGuardarDatos.mockReturnValue(of({
      codigo: '00',
      mensaje: 'Éxito'
    }));

    // Mock del wizardComponent
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn()
    };

    component.getValorIndice({
      valor: 0, // Fuera de rango
      accion: 'cont'
    });

    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });

  it('debería generar alerta de error correctamente', () => {
    const mensajeError = 'Mensaje de error de prueba';
    const alertaHtml = ImmexRegistroSolicitudModalityComponent.generarAlertaDeError(mensajeError);
    
    expect(alertaHtml).toContain('Corrija los siguientes errores:');
    expect(alertaHtml).toContain(mensajeError);
    expect(alertaHtml).toContain('border-danger');
  });
});