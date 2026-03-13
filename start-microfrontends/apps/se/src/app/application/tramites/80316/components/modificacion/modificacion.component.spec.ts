import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, provideToastr } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of as observableOf, Subject } from 'rxjs';
import { ModificacionComponent } from './modificacion.component';
import { SolicitudService } from '../../services/solicitud.service';
import { Tramite80316Store } from '../../estados/tramite80316.store';
import { Tramite80316Query } from '../../estados/tramite80316.query';

describe('ModificacionComponent', () => {
  let fixture!: ComponentFixture<ModificacionComponent>;
  let component!: ModificacionComponent;
  let solicitudService: jest.Mocked<SolicitudService>;
  let tramite80316Store: jest.Mocked<Tramite80316Store>;
  let tramite80316Query: jest.Mocked<Tramite80316Query>;

  beforeEach(() => {
    solicitudService = {
      getDatosModificacion: jest.fn().mockReturnValue(observableOf({})),
      getActividadProductiva: jest.fn().mockReturnValue(observableOf({ data: [] })),
    } as unknown as jest.Mocked<SolicitudService>;

    tramite80316Store = {
      setDatosModificacion: jest.fn(),
      setActividadProductiva: jest.fn(),
    } as unknown as jest.Mocked<Tramite80316Store>;

    tramite80316Query = {
      selectSolicitud$: observableOf({}),
    } as unknown as jest.Mocked<Tramite80316Query>;

    TestBed.configureTestingModule({
      imports: [ModificacionComponent, FormsModule, ReactiveFormsModule, ToastrModule.forRoot(), HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: SolicitudService, useValue: solicitudService },
        { provide: Tramite80316Store, useValue: tramite80316Store },
        { provide: Tramite80316Query, useValue: tramite80316Query },
        provideToastr({ positionClass: 'toast-top-right' }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on ngOnInit', () => {
    component.ngOnInit();
    expect(component.modificacionForm).toBeDefined();
  });

  it('should call loadDatosModificacion on ngOnInit', () => {
    const loadDatosModificacionSpy = jest.spyOn(component, 'loadDatosModificacion');
    component.ngOnInit();
    expect(loadDatosModificacionSpy).toHaveBeenCalled();
  });

  it('should call inicializaCatalogos on ngOnInit', () => {
    const inicializaCatalogosSpy = jest.spyOn(component, 'inicializaCatalogos');
    component.ngOnInit();
    expect(inicializaCatalogosSpy).toHaveBeenCalled();
  });

  it('should call setDatosModificacion in store when loadDatosModificacion is called', () => {
    component.loadDatosModificacion();
    expect(tramite80316Store.setDatosModificacion).toHaveBeenCalled();
  });

  it('should initialize actividadProductiva when inicializaCatalogos is called', () => {
    component.inicializaCatalogos();
    expect(solicitudService.getActividadProductiva).toHaveBeenCalled();
  });

  it('should disable the form when esFormularioSoloLectura is true', () => {
    component.modificacionForm = component['fb'].group({
      campo: ['valor']
    });
    component.esFormularioSoloLectura = true;
    const disableSpy = jest.spyOn(component.modificacionForm, 'disable');
    component.inicializarEstadoFormulario();
    expect(disableSpy).toHaveBeenCalled();
  });

  it('should enable the form when esFormularioSoloLectura is false', () => {
    component.modificacionForm = component['fb'].group({
      campo: ['valor']
    });
    component.esFormularioSoloLectura = false;
    const enableSpy = jest.spyOn(component.modificacionForm, 'enable');
    component.inicializarEstadoFormulario();
    expect(enableSpy).toHaveBeenCalled();
  });

  it('should patch form values when loadDatosModificacion receives data', () => {
    const datos = {
      rfc: 'RFC123',
      federal: 'FED',
      tipo: 'TIPO',
      programa: 'PROG',
      actividadActual: 'ACT',
    } as any;
    component.modificacionForm = component['fb'].group({
      rfc: [''],
      federal: [''],
      tipo: [''],
      programa: [''],
      actividadActual: [''],
      actividadProductiva: ['']
    });
    (solicitudService.getDatosModificacion as jest.Mock).mockReturnValue(observableOf(datos));
    const patchSpy = jest.spyOn(component.modificacionForm, 'patchValue');
    component.loadDatosModificacion();
    expect(patchSpy).toHaveBeenCalledWith({
      rfc: 'RFC123',
      federal: 'FED',
      tipo: 'TIPO',
      programa: 'PROG',
      actividadActual: 'ACT',
    });
  });

  it('should set actividadProductiva from service data in inicializaCatalogos', () => {
    const actividadData = { datos: [{ id: 1, nombre: 'Actividad' }] };
    (solicitudService.getActividadProductiva as jest.Mock).mockReturnValue(observableOf(actividadData));
    component.inicializaCatalogos();
    expect(component.actividadProductiva).toEqual(actividadData.datos);
  });

  it('should emit validityChange on form status change', () => {
    component.modificacionForm = component['fb'].group({
      campo: ['valor']
    });
    const emitSpy = jest.spyOn(component.validityChange, 'emit');
    component.ngOnInit();
    component.modificacionForm.setValue({ campo: 'nuevoValor' });
    expect(emitSpy).toHaveBeenCalledWith(component.modificacionForm.valid);
  });

  it('should unsubscribe destroyNotifier$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const unsubscribeSpy = jest.spyOn(component.destroyNotifier$, 'unsubscribe');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  it('should update solicitudState from tramite80316Query.selectSolicitud$', () => {
    const solicitudMock = { rfc: 'RFCX' } as any;
    tramite80316Query.selectSolicitud$ = observableOf(solicitudMock);
    component.ngOnInit();
    expect(component.solicitudState).toEqual(solicitudMock);
  });

  it('should call consultaioQuery.selectConsultaioState$ and set esFormularioSoloLectura', () => {
    const consultaioQuery: any = {
      selectConsultaioState$: observableOf({ readonly: true })
    };
    // @ts-ignore
    component.consultaioQuery = consultaioQuery;
    component.ngOnInit();
    expect(component.esFormularioSoloLectura).toBe(true);
  });
});

