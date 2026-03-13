import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AutoTransportistaComponent } from './auto-transportista.component';
import { ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SolicitudService } from '../../services/solicitud.service';
import { Solicitud32611Store } from '../../estados/solicitud32611.store';
import { Solicitud32611Query } from '../../estados/solicitud32611.query';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { FECHA_DE_INICIO, FECHA_DE_PAGO } from '../../constants/solicitud.enum';

jest.mock('bootstrap', () => ({ Modal: jest.fn().mockImplementation(() => ({ show: jest.fn(), hide: jest.fn() })) }));

const mockSolicitudService = {
  conseguirOpcionDeRadio: jest.fn(() => of({
    requisitos: { radioOptions: [], isRequired: true },
    reconocimientoMutuo: { radioOptions: [], isRequired: true },
    clasificacionInformacion: { radioOptions: [], isRequired: true },
  })),
  obtenerDatosBanco: jest.fn(() => of([])),
};

const mockSolicitudStore = {
  establecerDatos: jest.fn(),
};

const mockSolicitudQuery = {
  selectSolicitud$: of({}),
};

const mockConsultaioQuery = {
  selectConsultaioState$: of({ readonly: false }),
};

describe('AutoTransportistaComponent', () => {
  let component: AutoTransportistaComponent;
  let fixture: ComponentFixture<AutoTransportistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, AutoTransportistaComponent, HttpClientTestingModule],
      providers: [
        { provide: SolicitudService, useValue: mockSolicitudService },
        { provide: Solicitud32611Store, useValue: mockSolicitudStore },
        { provide: Solicitud32611Query, useValue: mockSolicitudQuery },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AutoTransportistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario correctamente', () => {
    component.inicializarFormulario();
    expect(component.autoTransportistaForm).toBeDefined();
  });

  it('debería deshabilitar el formulario si es solo lectura', () => {
    component.esFormularioSoloLectura = true;
    component.guardarDatosFormulario();
    expect(component.autoTransportistaForm.disabled).toBe(true);
  });


  it('debería mostrar el modal de confirmación', () => {
    component.confirmInstance = { show: jest.fn() } as any;
    component.openConfirmModal();
    expect(component.confirmInstance.show).toHaveBeenCalled();
  });

  it('debería cerrar el modal de confirmación', () => {
    component.confirmInstance = { hide: jest.fn() } as any;
    component.closeConfirmModal();
    expect(component.confirmInstance.hide).toHaveBeenCalled();
  });

  it('debería aceptar solo números válidos en soloNumeros()', () => {
    const evento = { key: '5' } as KeyboardEvent;
    expect(component.soloNumeros(evento)).toBe(true);
  });

  it('debería rechazar caracteres no numéricos en soloNumeros()', () => {
    const evento = { key: 'a' } as KeyboardEvent;
    expect(component.soloNumeros(evento)).toBe(false);
  });

  it('debería mostrar error si hay menos de 2 teléfonos válidos', () => {
    component.autoTransportistaForm = component['fb'].group({
      telefonoContacto: [1],
      lada1: [''], telefono1: [''],
      lada2: [''], telefono2: [''],
      lada3: [''], telefono3: ['']
    });
    expect(component.debeMostrarErrorTelefonos()).toBe(true);
  });

  it('debería contar correctamente los teléfonos válidos', () => {
    component.autoTransportistaForm = component['fb'].group({
      lada1: ['55'], telefono1: ['1111'],
      lada2: [''], telefono2: [''],
      lada3: ['55'], telefono3: ['1234']
    });
    expect(component.cantidadTelefonosValidos).toBe(2);
  });

  it('debería destruir correctamente las suscripciones', () => {
    const destroySpy = jest.spyOn(component['destroy$'], 'next');
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
