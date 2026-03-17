import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BusquedaFolioComponent } from './busqueda-folio.component';
import { ServicioDeMensajesService } from '../../services/servicio-de-mensajes.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
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
  let destroyNotifier$: Subject<void>;

  beforeEach(async () => {
    mockServicioDeMensajesService = {
          enviarMensaje: jest.fn(),
          establecerDatosDePermiso: jest.fn(),
          devolverFacturasMensaje$: of(false),
          mensaje$: of(false)
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize busquedaForm with required and pattern validators', () => {
    const tramiteControl = component.busquedaForm.get('tramite');
    tramiteControl?.setValue('');
    expect(tramiteControl?.valid).toBeFalsy();
    tramiteControl?.setValue('abc');
    expect(tramiteControl?.valid).toBeFalsy();
    tramiteControl?.setValue('123');
    expect(tramiteControl?.valid).toBeTruthy();
  });

  it('should mark all fields as touched if busquedaForm is invalid on buscar', () => {
    const markAllAsTouchedSpy = jest.spyOn(component.busquedaForm, 'markAllAsTouched');
    component.busquedaForm.get('tramite')?.setValue('');
    component.buscar(new Event('submit'));
    expect(markAllAsTouchedSpy).toHaveBeenCalled();
    expect(component.detalleDelPermiso).toBe(false);
  });

  it('should set detalleDelPermiso to true and call establecerFormularioDeDetallesDe if busquedaForm is valid', () => {
    const patchValueSpy = jest.spyOn(component.detalleDelPermisoForm, 'patchValue');
    component.busquedaForm.get('tramite')?.setValue('123');
    component.buscar(new Event('submit'));
    expect(component.detalleDelPermiso).toBe(true);
    expect(patchValueSpy).toHaveBeenCalledWith({
      folioTramite: '0201300101820252540000071',
      tipoDeSolicitud: 'Inicial',
      regimen: 'Definitivos',
      condicionDeLaMercancia: 'Nuevo',
      umt: 'Kilogramo',
      cantidad: '1000000',
      cdr: 'De importacion',
      usd: '100000',
      fraccionArancelaria: '72069099-LAS demas.',
      descripcionDeLaMercancia: '',
      procedencia: '',
      mercancia: '',
      beneficioQueSeObtiene: '',
      observaciones: 'QA',
      motivoCancelacion: 'Error en la solicitud original',
    });
  });

  it('should call enviarMensaje and establecerDatosDePermiso on agregar', () => {
    component.agregar(new Event('click'));
    expect(mockServicioDeMensajesService.enviarMensaje).toHaveBeenCalledWith(false);
    expect(mockServicioDeMensajesService.establecerDatosDePermiso).toHaveBeenCalledWith(true);
  });

  it('should set detalleDelPermiso to false on detalleCancelar', () => {
    component.detalleDelPermiso = true;
    component.detalleCancelar(new Event('click'));
    expect(component.detalleDelPermiso).toBe(false);
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

  it('should patch detalleDelPermisoForm with formData on establecerFormularioDeDetallesDe', () => {
    const patchValueSpy = jest.spyOn(component.detalleDelPermisoForm, 'patchValue');
    component.establecerFormularioDeDetallesDe();
    // Use the actual data passed to patchValue for the expectation
    expect(patchValueSpy).toHaveBeenCalledWith({
      folioTramite: '0201300101820252540000071',
      tipoDeSolicitud: 'Inicial',
      regimen: 'Definitivos',
      condicionDeLaMercancia: 'Nuevo',
      umt: 'Kilogramo',
      cantidad: '1000000',
      cdr: 'De importacion',
      usd: '100000',
      fraccionArancelaria: '72069099-LAS demas.',
      descripcionDeLaMercancia: '',
      procedencia: '',
      mercancia: '',
      beneficioQueSeObtiene: '',
      observaciones: 'QA',
      motivoCancelacion: 'Error en la solicitud original',
    });
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