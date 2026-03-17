import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { DestinatarioAgenteAduanalComponent } from './destinatario-agente-aduanal.component';
import { DestinatarioService } from '../../services/destinatario.service';
import { Tramite250101Store } from '../../estados/tramite250101.store';
import { Tramite250101Query } from '../../estados/tramite250101.query';

class Tramite250101QueryMock {
  destinatarioDenominacion$ = of([]);
  destinatarioPais$ = of([]);
  destinatarioEstado$ = of([]);
  destinatarioCodigoPostal$ = of([]);
  destinatarioDomicilio$ = of([]);
  selectSolicitud$ = of({});
}

describe('DestinatarioAgenteAduanalComponent', () => {
  let component: DestinatarioAgenteAduanalComponent;
  let fixture: ComponentFixture<DestinatarioAgenteAduanalComponent>;
  let destinatarioServiceMock: any;
  let tramite250101StoreMock: any;

  beforeEach(async () => {
    destinatarioServiceMock = {
      getDestinatarioEncabezadoDeTabla: jest.fn().mockReturnValue(of({ columns: ['Column1', 'Column2'] })),
      getAduanalEncabezadoDeTabla: jest.fn().mockReturnValue(of({ columns: ['ColumnA', 'ColumnB'] })),
      getPaisData: jest.fn().mockReturnValue(of([{ id: 1, descripcion: 'Pais1' }])),
      getEstadoData: jest.fn().mockReturnValue(of([{ id: 2, descripcion: 'Estado1' }])),
    };

    tramite250101StoreMock = {
      establecerDestinatario: jest.fn(),
      establecerAgenteAduanal: jest.fn(),
      establecerDestinatarioDenominacion: jest.fn(),
      establecerDestinatarioCodigoPostal: jest.fn(),
      establecerDestinatarioDomicilio: jest.fn(),
      establecerDestinatarioPais: jest.fn(),
      establecerDestinatarioEstado: jest.fn(),
      establecerAgenteAduanalNombre: jest.fn(),
      establecerAgenteAduanalPrimerApellido: jest.fn(),
      establecerAgenteAduanalSegundoApellido: jest.fn(),
      establecerAgenteAduanalPatente: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule,DestinatarioAgenteAduanalComponent],
      declarations: [],
      providers: [
        { provide: DestinatarioService, useValue: destinatarioServiceMock },
        { provide: Tramite250101Store, useValue: tramite250101StoreMock },
        { provide: Tramite250101Query, useClass: Tramite250101QueryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DestinatarioAgenteAduanalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario y obtener datos en ngOnInit', () => {
    expect(component.formDestinatariosModal).toBeDefined();
    expect(component.formAgenteAduanal).toBeDefined();
    expect(destinatarioServiceMock.getDestinatarioEncabezadoDeTabla).toHaveBeenCalled();
    expect(destinatarioServiceMock.getAduanalEncabezadoDeTabla).toHaveBeenCalled();
    expect(destinatarioServiceMock.getPaisData).toHaveBeenCalled();
    expect(destinatarioServiceMock.getEstadoData).toHaveBeenCalled();
    expect(component.tablaDestinatarioData).toEqual(['Column1', 'Column2']);
    expect(component.tablaAgenteAduanalData).toEqual(['ColumnA', 'ColumnB']);
    expect(component.paisData).toEqual([{ id: 1, descripcion: 'Pais1' }]);
    expect(component.estadoData).toEqual([{ id: 2, descripcion: 'Estado1' }]);
  });

  it('debería alternar showTableDiv y showDestinatarioModal cuando se llama cambiarDestinatario', () => {
    component.cambiarDestinatario();
    expect(component.showTableDiv).toBe(false);
    expect(component.showDestinatarioModal).toBe(true);
  });

  it('debería alternar showTableDiv y showAgenteModal cuando se llama cambiarAgenteAduanal', () => {
    component.cambiarAgenteAduanal();
    expect(component.showTableDiv).toBe(false);
    expect(component.showAgenteModal).toBe(true);
  });

  it('debería llamar a establecerDestinatario cuando se llama enviarDestinatarioFormulario', () => {
    component.formDestinatariosModal.patchValue({
      destinatarioRazonSocial: 'Test Razon Social',
      paisNacionalDestinatario: 1,
      estadoNacionalDestinatario: 2,
      codigoPostalDestinatario: '12345',
      domicilioDestinatario: 'Test Domicilio',
    });

    component.showTableDiv = true;
    component.showDestinatarioModal = true;
    component.formDestinatariosModal.markAsDirty();
    component.enviarDestinatarioFormulario();

    expect(tramite250101StoreMock.establecerDestinatario).toHaveBeenCalled();
    expect(component.showTableDiv).toBe(false);
  });

  it('debería llamar a establecerAgenteAduanal cuando se llama enviarAgenteAduanalFormulario', () => {
    component.formAgenteAduanal.patchValue({
      nombreAgenteAduanal: 'Test Nombre',
      primerApellidoAgenteAduanal: 'Test Apellido1',
      segundoApellidoAgenteAduanal: 'Test Apellido2',
      patenteAgenteAduanal: '1234',
    });

    component.showTableDiv = true;
    component.showAgenteModal = true;

    component.enviarAgenteAduanalFormulario();

    expect(tramite250101StoreMock.establecerAgenteAduanal).toHaveBeenCalled();
    expect(component.showTableDiv).toBe(false);
    expect(component.showAgenteModal).toBe(false);
  });

  it('debería establecer showAceptarModal en true cuando se llama openAceptarModal', () => {
    component.showAceptarModal = false; 
    component.openAceptarModal();
    expect(component.showAceptarModal).toBe(true);
  });
  
  it('debería llamar a enviarDestinatarioFormulario y establecer showAceptarModal en false cuando se llama confirmAgregar', () => {
    const enviarDestinatarioFormularioSpy = jest.spyOn(component, 'enviarDestinatarioFormulario');
    component.showAceptarModal = true;
  
    component.confirmAgregar();
  
    expect(enviarDestinatarioFormularioSpy).toHaveBeenCalled(); 
    expect(component.showAceptarModal).toBe(false); 
  });

  it('debería actualizar el store cuando se llama actualizarCodigoPostal', () => {
    component.formDestinatariosModal.patchValue({ codigoPostalDestinatario: '12345' });
    component.actualizarCodigoPostal();
    expect(tramite250101StoreMock.establecerDestinatarioCodigoPostal).toHaveBeenCalledWith('12345');
  });
  
  it('debería actualizar el store cuando se llama actualizarDomicilio', () => {
    component.formDestinatariosModal.patchValue({ domicilioDestinatario: 'Test Domicilio' });
    component.actualizarDomicilio();
    expect(tramite250101StoreMock.establecerDestinatarioDomicilio).toHaveBeenCalledWith('Test Domicilio');
  });

  it('debería actualizar el store cuando se llama actualizarDenominacion', () => {
    component.formDestinatariosModal.patchValue({ destinatarioRazonSocial: 'Test Denominacion' });
    component.actualizarDenominacion();
    expect(tramite250101StoreMock.establecerDestinatarioDenominacion).toHaveBeenCalledWith('Test Denominacion');
  });

  it('debería limpiar las suscripciones en ngOnDestroy', () => {
    const destroySpy = jest.spyOn(component['destroy$'], 'next');
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

    it('debería deshabilitar el formulario si esFormularioSoloLectura es true', () => {
      component.esFormularioSoloLectura = true;
      component.formDestinatariosModal.enable();
      component.inicializarEstadoFormulario();
      expect(component.formDestinatariosModal.disabled).toBe(true);
    });
  
    it('debería habilitar el formulario si esFormularioSoloLectura es false', () => {
      component.esFormularioSoloLectura = false;
      component.formDestinatariosModal.disable(); 
      component.inicializarEstadoFormulario();
      expect(component.formDestinatariosModal.enabled).toBe(true);
    });

    
    it('debería deshabilitar el formulario si esFormularioSoloLectura es true', () => {
      component.esFormularioSoloLectura = true;
      component.formAgenteAduanal.enable(); 
      component.inicializarEstadoFormulario();
      expect(component.formAgenteAduanal.disabled).toBe(true);
    });
  
    it('debería habilitar el formulario si esFormularioSoloLectura es false', () => {
      component.esFormularioSoloLectura = false;
      component.formAgenteAduanal.disable();
      component.inicializarEstadoFormulario();
      expect(component.formAgenteAduanal.enabled).toBe(true);
    });
});
