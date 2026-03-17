import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExencionDeImpuestosComponent } from './exencionDeImpuestos.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { ExencionDeImpuestosService } from '../../services/exencion-de-impuestos.service';
import { Tramite10703Store } from '../../estados/tramite10703.store';
import { Tramite10703Query } from '../../estados/tramite10703.query';
import { CatalogoSelectComponent, ConsultaioQuery, InputCheckComponent, InputRadioComponent, NotificacionesComponent, TablaDinamicaComponent, TituloComponent } from '@ng-mf/data-access-user';
import { TablaSeleccion } from '@libs/shared/data-access-user/src';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

describe('ExencionDeImpuestosComponent', () => {
  let component: ExencionDeImpuestosComponent;
  let fixture: ComponentFixture<ExencionDeImpuestosComponent>;
  let exencionDeImpuestosServiceMock: any;
  let storeMock: any;
  let queryMock: any;
  let consultaioQueryMock: any;

  beforeEach(async () => {
    exencionDeImpuestosServiceMock = {
      getAduanaIngresara: jest.fn().mockReturnValue(of({ data: [{ id: 1 }] })),
      getusoEspecifico: jest.fn().mockReturnValue(of({ data: [{ id: 2 }] })),
      getPais: jest.fn().mockReturnValue(of({ data: [{ id: 3 }] })),
      getAno: jest.fn().mockReturnValue(of({ data: [{ id: 4 }] })),
      getUnidadMedida: jest.fn().mockReturnValue(of({ data: [{ id: 5 }] })),
      getCondicionMercancia: jest.fn().mockReturnValue(of({ data: [{ id: 6 }] })),
      getInicializarMercancias: jest.fn().mockReturnValue(of({ code: 200, data: [{ test: 'mercancia' }] })),
      getInicializarDatos: jest.fn().mockReturnValue(of({ test: 'datos' })),
      getMercanciaTbl: jest.fn().mockReturnValue(of([{ id: 1, nombre: 'Mercancia' }])),
    };

    storeMock = {
      updateFormState: jest.fn(),
      setAduana: jest.fn(),
    };

    queryMock = {
      selectSolicitud$: of({
        aduana: 1,
        manifesto: 'manifesto',
        personaFisica: true,
        organismoPublico: false,
        usoEspecifico: 'uso',
        opcion: 'opcion',
        correoElectronico: 'test@mail.com',
        telefono: '1234567890',
        numeroInterior: '1',
        numeroExterior: '2',
        calle: 'calle',
        nombre: 'nombre',
        estado: 'estado',
        pais: 'pais',
        codigoPostal: '12345',
        colonia: 'colonia',
        tipoDeMercancia: 'tipo',
        condicionMercancia: 'condicion',
        especificoMercancia: 'especifico',
        unidadMedida: 'unidad',
        ano: '2024',
        cantidad: 10,
        marca: 'marca',
        modelo: 'modelo',
        serie: 'serie',
        vehiculo: 'vehiculo',
      }),
    };

    consultaioQueryMock = {
      selectConsultaioState$: of({ readonly: false }),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule,
        ExencionDeImpuestosComponent,
        CommonModule,
            TituloComponent,
            CatalogoSelectComponent,
            InputCheckComponent,
            InputRadioComponent,
            TablaDinamicaComponent,
            NotificacionesComponent,

      ],
      declarations: [],
      providers: [
        FormBuilder,
        { provide: ExencionDeImpuestosService, useValue: exencionDeImpuestosServiceMock },
        { provide: Tramite10703Store, useValue: storeMock },
        { provide: Tramite10703Query, useValue: queryMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ExencionDeImpuestosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize catalogos on inicializaCatalogos', () => {
    component['inicializaCatalogos']();
    expect(exencionDeImpuestosServiceMock.getAduanaIngresara).toHaveBeenCalled();
    expect(exencionDeImpuestosServiceMock.getusoEspecifico).toHaveBeenCalled();
    expect(exencionDeImpuestosServiceMock.getPais).toHaveBeenCalled();
    expect(exencionDeImpuestosServiceMock.getAno).toHaveBeenCalled();
    expect(exencionDeImpuestosServiceMock.getUnidadMedida).toHaveBeenCalled();
    expect(exencionDeImpuestosServiceMock.getCondicionMercancia).toHaveBeenCalled();
  });

  it('should call store.setAduana on aduanaSeleccion', () => {
    component.tramiteForm = new FormBuilder().group({
      importadorExportador: new FormBuilder().group({
        aduana: 123,
      }),
    });
    component.aduanaSeleccion();
    expect(storeMock.setAduana).toHaveBeenCalledWith(123);
  });

  it('should set enableModficarBoton on manejarFilaSeleccionada', () => {
    const fila = [{ id: 1 }];
    component.manejarFilaSeleccionada(fila as any);
    expect(component.enableModficarBoton).toBe(fila);
  });  

  it('should set nuevaNotificacion if enableModficarBoton is empty in abrirDialogoMercancias', () => {
    component.enableModficarBoton = [];
    component.abrirDialogoMercancias();
    expect(component.nuevaNotificacion).toBeDefined();
    expect(component.nuevaNotificacion.mensaje).toBe('Seleccione un registro');
  });

  it('should call Modal.show if enableModficarBoton is not empty and modal exists', () => {
    component.enableModficarBoton = [{ id: 1 }] as any;
    const showMock = jest.fn();
    (window as any).bootstrap = { Modal: jest.fn().mockImplementation(() => ({ show: showMock })) };
    const modalElement = document.createElement('div');
    modalElement.id = 'modalAgregarMercancias';
    document.body.appendChild(modalElement);
    component.abrirDialogoMercancias();
    expect(showMock).toHaveBeenCalled();
    document.body.removeChild(modalElement);
  });

  it('should set mercanciaDatos in getMercanciaTbl', () => {
    component.getMercanciaTbl();
    expect(component.mercanciaDatos).toEqual([{ id: 1, nombre: 'Mercancia' }]);
  });

  it('should call store.updateFormState in inicializaMercancias if code is 200', () => {
    component['inicializaMercancias']();
    expect(storeMock.updateFormState).toHaveBeenCalledWith({ test: 'mercancia' });
  });

  it('should call store.updateFormState in inicializaExencionDelmpustos', () => {
    component['inicializaExencionDelmpustos']();
    expect(storeMock.updateFormState).toHaveBeenCalledWith({ test: 'datos' });
  });

  it('should complete destroy$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn((component as any).destroy$, 'next');
    const completeSpy = jest.spyOn((component as any).destroy$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should call guardarDatosFormulario if esFormularioSoloLectura is true in inicializarEstadoFormulario', () => {
    component.esFormularioSoloLectura = true;
    const spy = jest.spyOn(component, 'guardarDatosFormulario');
    component.inicializarEstadoFormulario();
    expect(spy).toHaveBeenCalled();
  });

  it('should call inicializarFormulario if esFormularioSoloLectura is false in inicializarEstadoFormulario', () => {
    component.esFormularioSoloLectura = false;
    const spy = jest.spyOn(component, 'inicializarFormulario');
    component.inicializarEstadoFormulario();
    expect(spy).toHaveBeenCalled();
  });
});