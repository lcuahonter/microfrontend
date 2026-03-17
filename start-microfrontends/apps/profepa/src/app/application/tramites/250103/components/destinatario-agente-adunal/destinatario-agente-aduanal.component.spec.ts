import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, of } from 'rxjs';
import { DestinatarioAgenteAduanalComponent } from './destinatario-agente-aduanal.component';
import { DistinatarioService } from '../../../250102/services/distinatario.service';
import { Tramite250103Store } from '../../estados/tramite250103.store';
import { Tramite250103Query } from '../../estados/tramite250103.query';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Adunal, Destinatarios } from '../../models/embalaje-de-madera.models';
import { HttpClient, HttpClientModule } from '@angular/common/http';

describe('DestinatarioAgenteAduanalComponent', () => {
  let component: DestinatarioAgenteAduanalComponent;
  let fixture: ComponentFixture<DestinatarioAgenteAduanalComponent>;
  let mockDistinatarioService: jest.Mocked<DistinatarioService>;
  let mockTramite250103Store: jest.Mocked<Tramite250103Store>;
  let mockTramite250103Query: jest.Mocked<Tramite250103Query>;
  let destroySubject: Subject<void>;

  beforeEach(async () => {
   
    mockDistinatarioService = {
      obtenerPaisData: jest.fn().mockReturnValue(of([{ id: 1, descripcion: 'México' }])),
      obtenerEstadoData: jest.fn().mockReturnValue(of([{ id: 1, descripcion: 'Jalisco' }])),
    } as any;

    mockTramite250103Store = {
      establecerDestinatario: jest.fn(),
      establecerAgenteAduanal: jest.fn(),
    } as any;

    mockTramite250103Query = {
      selectDestinatarioRowData$: of([]),
      selectAgenteAduanalRowData$: of([]),
    } as any;

    
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        DestinatarioAgenteAduanalComponent, 
        HttpClientModule
      ],
      providers: [
        FormBuilder,
        { provide: DistinatarioService, useValue: mockDistinatarioService },
        { provide: Tramite250103Store, useValue: mockTramite250103Store },
        { provide: Tramite250103Query, useValue: mockTramite250103Query },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DestinatarioAgenteAduanalComponent);
    component = fixture.componentInstance;
    destroySubject = component.destroy$ as Subject<void>;

    // Initialize forms
    component.establecerFormDestinatariosModal();
    component.establecerFormAgenteAduanal();
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('should disable forms when esFormularioSoloLectura is true', () => {
    component.esFormularioSoloLectura = true;
    component.guardarDatosFormulario();
  });

  it('should enable forms when esFormularioSoloLectura is false', () => {
    component.esFormularioSoloLectura = false;
    component.guardarDatosFormulario();
  });

  describe('establecerFormDestinatariosModal', () => {
    it('debería configurar el formulario de destinatarios con validaciones', () => {
      component.establecerFormDestinatariosModal();

      expect(component.formDestinatariosModal).toBeDefined();
      expect(component.formDestinatariosModal.get('destinatarioRadio')).toBeDefined();
      expect(component.formDestinatariosModal.get('destinatarioRazonSocial')).toBeDefined();
      expect(component.formDestinatariosModal.get('paisNacionalDestinatario')).toBeDefined();
      expect(component.formDestinatariosModal.get('entidadFederativaDestinatario')).toBeDefined();
      expect(component.formDestinatariosModal.get('ciudadNacionalDestinatario')).toBeDefined();
      expect(component.formDestinatariosModal.get('codigoPostalDestinatario')).toBeDefined();
      expect(component.formDestinatariosModal.get('domicilioDestinatario')).toBeDefined();
    });
  });

  describe('establecerFormAgenteAduanal', () => {
    it('debería configurar el formulario de agentes aduanales con validaciones', () => {
      component.establecerFormAgenteAduanal();

      expect(component.formAgenteAduanal).toBeDefined();
      expect(component.formAgenteAduanal.get('nombreAgenteAduanal')).toBeDefined();
      expect(component.formAgenteAduanal.get('primerApellidoAgenteAduanal')).toBeDefined();
      expect(component.formAgenteAduanal.get('segundoApellidoAgenteAduanal')).toBeDefined();
      expect(component.formAgenteAduanal.get('patenteAgenteAduanal')).toBeDefined();
    });
  });

  describe('enviarAgenteAduanalFormulario', () => {
    it('debería agregar datos de agente aduanal y actualizar el estado', () => {
      component.establecerFormAgenteAduanal();
      component.formAgenteAduanal.setValue({
        nombreAgenteAduanal: 'Juan',
        primerApellidoAgenteAduanal: 'Pérez',
        segundoApellidoAgenteAduanal: 'Gómez',
        patenteAgenteAduanal: '1234',
      });

      component.enviarAgenteAduanalFormulario();

      expect(component.tablaAgenteAduanaFilaDatos.length).toBe(1);
      expect(mockTramite250103Store.establecerAgenteAduanal).toHaveBeenCalledWith(component.tablaAgenteAduanaFilaDatos);
      expect(component.showTableDiv).toBe(false);
      expect(component.showAgenteModal).toBe(true);
      expect(component.formAgenteAduanal.pristine).toBe(true);
    });
  });

  describe('enviarDestinatarioFormulario', () => {
    it('debería agregar datos de destinatario y actualizar el estado', () => {
      component.establecerFormDestinatariosModal();
      component.paisData = [{ id: 1, descripcion: 'México' }];
      component.estadoData = [{ id: 1, descripcion: 'Jalisco' }];
      component.formDestinatariosModal.setValue({
        destinatarioRadio: '1',
        destinatarioRazonSocial: 'Empresa XYZ',
        paisNacionalDestinatario: 1, 
        entidadFederativaDestinatario: 1, 
        ciudadNacionalDestinatario: 'Guadalajara',
        codigoPostalDestinatario: '44100',
        domicilioDestinatario: 'Calle 123',
      });

      component.enviarDestinatarioFormulario();

      expect(component.tablaDestinatarioFilaDatos.length).toBe(1);
      expect(mockTramite250103Store.establecerDestinatario).toHaveBeenCalledWith(component.tablaDestinatarioFilaDatos);
      expect(component.showTableDiv).toBe(false);
      expect(component.formAgenteAduanal.pristine).toBe(true);
    });
  });

  describe('cambiarDestinatario', () => {
    it('debería alternar visibilidad del modal de destinatarios', () => {
      component.cambiarDestinatario();

      expect(component.showTableDiv).toBe(false);
      expect(component.showDestinatarioModal).toBe(true);

      component.cambiarDestinatario();

      expect(component.showTableDiv).toBe(true);
      expect(component.showDestinatarioModal).toBe(false);
    });
  });

  describe('cambiarAgenteAduanal', () => {
    it('debería alternar visibilidad del modal de agentes aduanales', () => {
      component.cambiarAgenteAduanal();

      expect(component.showTableDiv).toBe(false);
      expect(component.showAgenteModal).toBe(true);

      component.cambiarAgenteAduanal();

      expect(component.showTableDiv).toBe(true);
      expect(component.showAgenteModal).toBe(false);
    });
  });

  describe('openAceptarModal', () => {
    it('debería abrir el modal de confirmación', () => {
      component.openAceptarModal();

      expect(component.showDestinatarioModal).toBe(true);
      expect(component.showAceptarModal).toBe(true);
    });
  });

  describe('confirmAgregar', () => {
    it('debería confirmar la adición de un destinatario', () => {
      const SPYENVIAR = jest.spyOn(component, 'enviarDestinatarioFormulario');
      const SPYLIMPAE= jest.spyOn(component, 'limparDestinatario');

      component.confirmAgregar();

      expect(SPYENVIAR).toHaveBeenCalled();
      expect(component.showAceptarModal).toBe(false);
      expect(SPYLIMPAE).toHaveBeenCalled();
    });
  });

  describe('onSeleccionDestinatario', () => {
    it('debería actualizar las filas seleccionadas de destinatarios', () => {
      const FILAS: Destinatarios[] = [{ nombre: 'Test', pais: 'México', ciudad: 'Guadalajara', entidadfederativa: 'Jalisco', domicilio: 'Calle 123', codigopostal: '44100' }];
      component.onSeleccionDestinatario(FILAS);

      expect(component.selectedDestinatarioRows).toEqual(FILAS);
    });
  });

  describe('onSeleccionAgenteAduanal', () => {
    it('debería actualizar las filas seleccionadas de agentes aduanales', () => {
      const FILAS: Adunal[] = [{ nombre: 'Juan', primerapellido: 'Pérez', segundoapellido: 'Gómez', patente: '1234' }];
      component.onSeleccionAgenteAduanal(FILAS);

      expect(component.selectedAgenteAduanalRows).toEqual(FILAS);
    });
  });

  describe('eliminarUbicacionDetinatario', () => {
    it('debería eliminar destinatarios seleccionados', () => {
      component.agregarDestinatariosTablaDatos = [
        { nombre: 'Test', pais: 'México', ciudad: 'Guadalajara', entidadfederativa: 'Jalisco', domicilio: 'Calle 123', codigopostal: '44100' },
      ];
      component.selectedDestinatarioRows = component.agregarDestinatariosTablaDatos;

      component.eliminarUbicacionDetinatario();

      expect(component.agregarDestinatariosTablaDatos.length).toBe(0);
      expect(component.tablaDestinatarioFilaDatos.length).toBe(0);
      expect(mockTramite250103Store.establecerDestinatario).toHaveBeenCalledWith([]);
      expect(component.selectedDestinatarioRows.length).toBe(0);
    });

    it('no debería hacer nada si no hay filas seleccionadas', () => {
      component.agregarDestinatariosTablaDatos = [
        { nombre: 'Test', pais: 'México', ciudad: 'Guadalajara', entidadfederativa: 'Jalisco', domicilio: 'Calle 123', codigopostal: '44100' },
      ];
      component.selectedDestinatarioRows = [];

      component.eliminarUbicacionDetinatario();

      expect(component.agregarDestinatariosTablaDatos.length).toBe(1);
      expect(mockTramite250103Store.establecerDestinatario).not.toHaveBeenCalled();
    });
  });

  describe('eliminarAgenteAduanal', () => {
    it('debería eliminar agentes aduanales seleccionados', () => {
      component.agregarAgenteAduanalTablaDatos = [
        { nombre: 'Juan', primerapellido: 'Pérez', segundoapellido: 'Gómez', patente: '1234' },
      ];
      component.selectedAgenteAduanalRows = component.agregarAgenteAduanalTablaDatos;

      component.eliminarAgenteAduanal();

      expect(component.agregarAgenteAduanalTablaDatos.length).toBe(0);
      expect(component.tablaAgenteAduanaFilaDatos.length).toBe(0);
      expect(mockTramite250103Store.establecerAgenteAduanal).toHaveBeenCalledWith([]);
      expect(component.selectedAgenteAduanalRows.length).toBe(0);
    });

    it('no debería hacer nada si no hay filas seleccionadas', () => {
      component.agregarAgenteAduanalTablaDatos = [
        { nombre: 'Juan', primerapellido: 'Pérez', segundoapellido: 'Gómez', patente: '1234' },
      ];
      component.selectedAgenteAduanalRows = [];

      component.eliminarAgenteAduanal();

      expect(component.agregarAgenteAduanalTablaDatos.length).toBe(1);
      expect(mockTramite250103Store.establecerAgenteAduanal).not.toHaveBeenCalled();
    });
  });

  describe('limparDestinatario', () => {
    it('debería restablecer el formulario de destinatarios', () => {
      component.establecerFormDestinatariosModal();
      component.formDestinatariosModal.setValue({
        destinatarioRadio: '2',
        destinatarioRazonSocial: 'Test',
        paisNacionalDestinatario: 1,
        entidadFederativaDestinatario: 1,
        ciudadNacionalDestinatario: 'Guadalajara',
        codigoPostalDestinatario: '44100',
        domicilioDestinatario: 'Calle 123',
      });

      component.limparDestinatario();

      expect(component.formDestinatariosModal.pristine).toBe(true);
      expect(component.formDestinatariosModal.get('destinatarioRadio')?.value).toBe('1');
    });
  });

  describe('limparAgenteAduana', () => {
    it('debería restablecer el formulario de agentes aduanales', () => {
      component.establecerFormAgenteAduanal();
      component.formAgenteAduanal.setValue({
        nombreAgenteAduanal: 'Juan',
        primerApellidoAgenteAduanal: 'Pérez',
        segundoApellidoAgenteAduanal: 'Gómez',
        patenteAgenteAduanal: '1234',
      });

      component.limparAgenteAduana();

      expect(component.formAgenteAduanal.pristine).toBe(true);
    });
  });

  describe('ngOnDestroy', () => {
    it('debería limpiar suscripciones', () => {
      const SPY_NEXT = jest.spyOn(destroySubject, 'next');
      const SPY_COMPLETE = jest.spyOn(destroySubject, 'complete');

      component.ngOnDestroy();

      expect(SPY_NEXT).toHaveBeenCalled();
      expect(SPY_COMPLETE).toHaveBeenCalled();
    });
  });
});