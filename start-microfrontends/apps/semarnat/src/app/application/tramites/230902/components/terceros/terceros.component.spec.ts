import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { TercerosComponent } from './terceros.component';
import { PermisoCitesService } from '../../services/permiso-cites.service';
import { Tramite230902Store } from '../../estados/tramite230902.store';
import { Tramite230902Query } from '../../estados/tramite230902.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DESTINARIO_TABLE_ENTRY, TereceorsConfiguracionItem } from '../../enum/tereceors.enum';


describe('TercerosComponent', () => {
  let component: TercerosComponent;
  let fixture: ComponentFixture<TercerosComponent>;
  let permisoCitesService: jest.Mocked<PermisoCitesService>;
  let tramite230902Store: jest.Mocked<Tramite230902Store>;
  let tramite230902Query: jest.Mocked<Tramite230902Query>;

  beforeEach(async () => {
    const permisoCitesServiceMock = {
      inicializaTercerosDatosCatalogos: jest.fn(),
      inicializaUbicacionDatosCatalogos: jest.fn(),
      entidadFederativa: [],
    };
    const tramite230902StoreMock = {
      setIsPopupOpen: jest.fn(),
      setIsPopupClose: jest.fn(),
      setEntidadFederativa: jest.fn(),
      establecerDatos: jest.fn(),
      setTercerosTablaDatos: jest.fn(),
    };
    const tramite230902QueryMock = {
      selectSolicitud$: of({ entidadFederativa: 'Test' }),
      getValue: jest.fn().mockReturnValue({ 
        entidadFederativa: 'Test', 
        tercerosTablaDatos: [] 
      }),
    };
    const consultaioQueryMock = {
      selectConsultaioState$: of({ readonly: false }),
    };

    await TestBed.configureTestingModule({
      declarations: [TercerosComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: PermisoCitesService, useValue: permisoCitesServiceMock },
        { provide: Tramite230902Store, useValue: tramite230902StoreMock },
        { provide: Tramite230902Query, useValue: tramite230902QueryMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock },
      ],
    })
    .overrideTemplate(TercerosComponent, '<div></div>') // Use a simple template to avoid template-related issues
    .compileComponents();

    fixture = TestBed.createComponent(TercerosComponent);
    component = fixture.componentInstance;
    permisoCitesService = TestBed.inject(PermisoCitesService) as jest.Mocked<PermisoCitesService>;
    tramite230902Store = TestBed.inject(Tramite230902Store) as jest.Mocked<Tramite230902Store>;
    tramite230902Query = TestBed.inject(Tramite230902Query) as jest.Mocked<Tramite230902Query>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should handle row selection', () => {
    const filaSeleccionada: TereceorsConfiguracionItem[] = [{ ...DESTINARIO_TABLE_ENTRY }];
    component.onFilaSeleccionada(filaSeleccionada);
    expect(component.isModificarEnabled).toBeTruthy();

    component.onFilaSeleccionada([]);
    expect(component.isModificarEnabled).toBeFalsy();
  });

  it('should clean up subscriptions on destroy', () => {
    const destroyedSpy = jest.spyOn(component['destroyed$'], 'next');
    const completeSpy = jest.spyOn(component['destroyed$'], 'complete');

    component.ngOnDestroy();
    expect(destroyedSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  // Nuevos tests en español

  it('debería inicializar el formulario con la entidad federativa del estado', () => {
    expect(component.destinatarioForm.get('entidadFederativa')?.value).toBe('Test');
  });

  it('debería deshabilitar el formulario si es solo lectura', () => {
    component.esFormularioSoloLectura = true;
    component.destinatarioForm.enable();
    component.guardarDatosFormulario();
    expect(component.destinatarioForm.disabled).toBe(true);
  });

  it('debería habilitar el formulario si no es solo lectura', () => {
    component.esFormularioSoloLectura = false;
    component.destinatarioForm.disable();
    component.guardarDatosFormulario();
    expect(component.destinatarioForm.enabled).toBe(true);
  });

  it('debería abrir el popup solo si isModificarEnabled es true', () => {
    component.isModificarEnabled = true;
    component.openPopup();
    expect(component.popupAbierto).toBe(true);
    expect(component.nuevaNotificacion).toBeDefined();
    expect(tramite230902Store.setIsPopupOpen).toHaveBeenCalledWith(true);
  });

  it('no debería abrir el popup si isModificarEnabled es false', () => {
    component.isModificarEnabled = false;
    component.openPopup();
    expect(component.popupAbierto).toBe(false);
  });

  it('debería cerrar el popup y actualizar el estado', () => {
    component.popupAbierto = true;
    component.closePopup();
    expect(component.popupAbierto).toBe(false);
    expect(tramite230902Store.setIsPopupOpen).toHaveBeenCalledWith(false);
    expect(tramite230902Store.setIsPopupClose).toHaveBeenCalledWith(component.popupCerrado);
  });

  it('debería agregar DESTINARIO_TABLE_ENTRY a la tabla si cambia la entidad federativa', () => {
    component.tablaDatos = [];
    component.destinatarioForm.get('entidadFederativa')?.setValue('NuevaEntidad');
    component.onEntidadFederativaChange();
    expect(component.tablaDatos.length).toBe(1);
    expect(component.tablaDatos[0]).toEqual(DESTINARIO_TABLE_ENTRY);
    expect(tramite230902Store.establecerDatos).toHaveBeenCalledWith({ entidadFederativa: 'NuevaEntidad' });
    expect(tramite230902Store.setTercerosTablaDatos).toHaveBeenCalledWith(component.tablaDatos);
  });

  it('no debería agregar a la tabla si ya hay datos', () => {
    component.tablaDatos = [DESTINARIO_TABLE_ENTRY];
    component.destinatarioForm.get('entidadFederativa')?.setValue('OtraEntidad');
    component.onEntidadFederativaChange();
    expect(component.tablaDatos.length).toBe(1);
  });

  it('debería llamar a inicializarEstadoFormulario en el constructor', () => {
    const spy = jest.spyOn(TercerosComponent.prototype as any, 'inicializarEstadoFormulario');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      declarations: [TercerosComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: PermisoCitesService, useValue: { inicializaTercerosDatosCatalogos: jest.fn(), entidadFederativa: [] } },
        { provide: Tramite230902Store, useValue: { setIsPopupOpen: jest.fn(), setIsPopupClose: jest.fn(), setEntidadFederativa: jest.fn(), establecerDatos: jest.fn(), setTercerosTablaDatos: jest.fn() } },
        { provide: Tramite230902Query, useValue: { selectSolicitud$: of({ entidadFederativa: 'Test' }), getValue: jest.fn().mockReturnValue({ entidadFederativa: 'Test', tercerosTablaDatos: [] }) } },
        { provide: ConsultaioQuery, useValue: { selectConsultaioState$: of({ readonly: false }) } },
      ],
    })
    .overrideTemplate(TercerosComponent, '<div></div>');
    TestBed.createComponent(TercerosComponent);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});