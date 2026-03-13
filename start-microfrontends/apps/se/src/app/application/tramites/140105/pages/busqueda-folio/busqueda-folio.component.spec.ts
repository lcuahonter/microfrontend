import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BusquedaFolioComponent } from './busqueda-folio.component';
import { ServicioDeMensajesService } from '../../services/servicio-de-mensajes.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of, Subject } from 'rxjs';
import type { ConsultaioState } from '@ng-mf/data-access-user';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

const mockFormData = {
  folioTramite: '123',
  tipoDeSolicitud: 'A',
  regimen: 'B',
  condicionDeLaMercancia: 'C',
  umt: 'D',
  cantidad: '1',
  cdr: 'E',
  usd: '2',
  fraccionArancelaria: 'F',
  descripcionDeLaMercancia: 'desc',
  procedencia: 'G',
  mercancia: 'H',
  beneficioQueSeObtiene: 'I',
  observaciones: 'J',
};

describe('BusquedaFolioComponent', () => {
  let component: BusquedaFolioComponent;
  let fixture: ComponentFixture<BusquedaFolioComponent>;
  let mockServicioDeMensajesService: jest.Mocked<ServicioDeMensajesService>;
  let mockConsultaioQuery: Partial<ConsultaioQuery>;

  beforeEach(async () => {
    mockServicioDeMensajesService = {
          enviarMensaje: jest.fn(),
          establecerDatosDePermiso: jest.fn(),
          devolverFacturasMensaje$: of(false),
          mensaje$: of(false),
          obtenerDatos: jest.fn().mockReturnValue(of({ datos: [] })) // Empty array to avoid auto-setting detalleDelPermiso
        } as any;
    mockConsultaioQuery = {
          selectConsultaioState$: of({
            procedureId: '',
            parameter: '',
            department: '',
            folioTramite: '',
            readonly: false,
            tramite: '',
            tramiteData: null,
            tramiteId: '',
            tramiteType: '',
            tipoDeTramite: '',
            estadoDeTramite: '',
            create: null,
            update: null,
            consultaioSolicitante: null
          } as unknown as ConsultaioState)
        };

    await TestBed.configureTestingModule({
      declarations: [BusquedaFolioComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: ServicioDeMensajesService, useValue: mockServicioDeMensajesService },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(BusquedaFolioComponent);
    component = fixture.componentInstance;
    
    // Initialize the component properly
    component.estableDetalleDelPermisoForm();
    component.inicializarEstadoFormulario();
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component properly', () => {
    expect(component).toBeTruthy();
    expect(component.detalleDelPermiso).toBe(false);
  });

  it('should set detalleDelPermiso to true on buscar', () => {
    component.buscar();
    expect(component.detalleDelPermiso).toBe(true);
  });

  it('should set detalleDelPermiso to true on buscar', () => {
    component.buscar();
    expect(component.detalleDelPermiso).toBe(true);
  });

  it('should call enviarMensaje and establecerDatosDePermiso on agregar', () => {
    component.agregar(new Event('click'));
    expect(mockServicioDeMensajesService.enviarMensaje).toHaveBeenCalledWith(false);
    expect(mockServicioDeMensajesService.establecerDatosDePermiso).toHaveBeenCalledWith(true);
  });

  it('should emit cerrarClicado on detalleCancelar', () => {
    const spy = jest.spyOn(component.cerrarClicado, 'emit');
    component.detalleCancelar();
    expect(spy).toHaveBeenCalled();
  });

  it('should call enviarMensaje on cancelar', () => {
    component.cancelar(new Event('click'));
    expect(mockServicioDeMensajesService.enviarMensaje).toHaveBeenCalledWith(false);
  });

  it('should initialize detalleDelPermisoForm with all controls disabled', () => {
    Object.keys(component.detalleDelPermisoForm.controls).forEach(key => {
      expect(component.detalleDelPermisoForm.get(key)?.disabled).toBe(true);
    });
  });

  it('should patch detalleDelPermisoForm when establecerFormularioDeDetallesDe is called with data', () => {
    const patchValueSpy = jest.spyOn(component.detalleDelPermisoForm, 'patchValue');
    const testData = { folioTramite: '123' };
    component.establecerFormularioDeDetallesDe(testData);
    expect(patchValueSpy).toHaveBeenCalledWith(testData);
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should set esFormularioSoloLectura from consultaQuery observable', () => {
    // Simulate readonly true
    const consultaQuery2 = TestBed.inject(ConsultaioQuery);
    (consultaQuery2.selectConsultaioState$ as any) = of({ readonly: true });
    const comp2 = new BusquedaFolioComponent(mockServicioDeMensajesService, new FormBuilder(), consultaQuery2);
    expect(comp2.esFormularioSoloLectura).toBe(true);
  });

  it('should call estableDetalleDelPermisoForm in inicializarEstadoFormulario if detalleDelPermisoForm is not set', () => {
    component.detalleDelPermisoForm = undefined as any;
    const spy = jest.spyOn(component, 'estableDetalleDelPermisoForm');
    component.inicializarEstadoFormulario();
    expect(spy).toHaveBeenCalled();
  });
});