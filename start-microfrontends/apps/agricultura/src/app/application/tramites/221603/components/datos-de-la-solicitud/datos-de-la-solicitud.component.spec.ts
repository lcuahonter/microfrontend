import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { DatosDeLaSolicitudComponent } from './datos-de-la-solicitud.component';
import {
  createInitialState,
  Solicitud221603State,
  Tramite221603Store,
} from '../../estados/tramite221603.store';
import { Tramite221603Query } from '../../estados/tramite221603.query';
import {
  HttpClientTestingModule,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import {
  AlertComponent,
  CatalogoSelectComponent,
  ConsultaioQuery,
  TablaDinamicaComponent,
  TituloComponent,
} from '@libs/shared/data-access-user/src';

describe('DatosDeLaSolicitudComponent', () => {
  let component: DatosDeLaSolicitudComponent;
  let fixture: ComponentFixture<DatosDeLaSolicitudComponent>;
  let tramite221603Store: Tramite221603Store;
  let tramite221603Query: Tramite221603Query;

  const mockSolicitudState: Solicitud221603State = {
    ...createInitialState(),
    justificacion: 'Test Justification',
    aduana: 'QUERETARO, QRO.',
    oficina: 'Querétaro',
    punto: 'Querétaro Oficina de Inspección',
    guia: 'Test Guia',
    regimen: 'Test Regimen',
    carro: 'Test Carro',
  };

  const mockFormularioDatos = {
    aduana: 'Mock Aduana',
    oficina: 'Mock Oficina',
    punto: 'Mock Punto',
    transporte: 'MAR23423',
    empresa: 'Mar y Tierra',
    clave: '454000554',
    dependencia: '0001840646CAIM',
    importe: '1281',
  };

  const tramite221603StoreMock = {
    setJustificacion: jest.fn(),
    setAduana: jest.fn(),
    setOficina: jest.fn(),
    setPunto: jest.fn(),
    setGuia: jest.fn(),
    setRegimen: jest.fn(),
    setCarro: jest.fn(),
  };

  const tramite221603QueryMock = {
    selectSolicitud$: of(mockSolicitudState),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatosDeLaSolicitudComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        TituloComponent,
        TablaDinamicaComponent,
        AlertComponent,
        CatalogoSelectComponent,
        HttpClientTestingModule,
      ],
      providers: [
        FormBuilder,
        { provide: Tramite221603Store, useValue: tramite221603StoreMock },
        { provide: Tramite221603Query, useValue: tramite221603QueryMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosDeLaSolicitudComponent);
    component = fixture.componentInstance;
    tramite221603Store = TestBed.inject(Tramite221603Store);
    tramite221603Query = TestBed.inject(Tramite221603Query);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with values from the store and formularioDatos', () => {
    component.formularioDatos = mockFormularioDatos;
    component.ngOnInit();

    expect(component.datosSolicitudForm.controls['justificacion'].value).toBe(
      mockSolicitudState.justificacion
    );
    expect(component.datosSolicitudForm.controls['aduana'].value).toBe(
      mockFormularioDatos.aduana
    );
    expect(component.datosSolicitudForm.controls['oficina'].value).toBe(
      mockFormularioDatos.oficina
    );
    expect(component.datosSolicitudForm.controls['punto'].value).toBe(
      mockFormularioDatos.punto
    );
    expect(component.datosSolicitudForm.controls['guia'].value).toBe(
      mockSolicitudState.guia
    );
    expect(component.datosSolicitudForm.controls['regimen'].value).toBe(
      mockSolicitudState.regimen
    );
    expect(component.datosSolicitudForm.controls['carro'].value).toBe(
      mockSolicitudState.carro
    );
  });

  it('should toggle mostrarContenido when toggleContent is called', () => {
    expect(component.mostrarContenido).toBe(true);
    component.toggleContent();
    expect(component.mostrarContenido).toBe(false);
    component.toggleContent();
    expect(component.mostrarContenido).toBe(true);
  });

  it('should call the correct store method with the correct value in setValoresStore', () => {
    component.datosSolicitudForm.controls['justificacion'].setValue(
      'Updated Justification'
    );
    component.setValoresStore('justificacion', 'setJustificacion');
    expect(tramite221603Store.setJustificacion).toHaveBeenCalledWith(
      'Updated Justification'
    );

    component.datosSolicitudForm.controls['aduana'].setValue('Updated Aduana');
    component.setValoresStore('aduana', 'setAduana');
    expect(tramite221603Store.setAduana).toHaveBeenCalledWith('Updated Aduana');
  });

  it('should call ngOnDestroy and cleanup resources correctly', () => {
    const destroyNotifierSpy = jest.spyOn(
      component['destroyNotifier$'],
      'next'
    );
    const destroyNotifierCompleteSpy = jest.spyOn(
      component['destroyNotifier$'],
      'complete'
    );
    component.ngOnDestroy();
    expect(destroyNotifierSpy).toHaveBeenCalled();
    expect(destroyNotifierCompleteSpy).toHaveBeenCalled();
  });

  it('should set esFormularioSoloLectura and call inicializarEstadoFormulario when consultaQuery emits', () => {
    const consultaQuery = TestBed.inject(ConsultaioQuery);
    const inicializarEstadoFormularioSpy = jest.spyOn(
      component,
      'inicializarEstadoFormulario'
    );
    (consultaQuery.selectConsultaioState$ as any).next({ readonly: true });
    expect(component.esFormularioSoloLectura).toBe(true);
    expect(inicializarEstadoFormularioSpy).toHaveBeenCalled();
  });

  it('should disable guia and justificacionDescription when esFormularioSoloLectura is true', () => {
    component.datosSolicitudForm = component['formBuilder'].group({
      guia: ['test'],
      justificacionDescription: ['test'],
    });
    component.esFormularioSoloLectura = true;
    component.inicializarEstadoFormulario();
    expect(component.datosSolicitudForm.get('guia')?.disabled).toBe(true);
    expect(
      component.datosSolicitudForm.get('justificacionDescription')?.disabled
    ).toBe(true);
  });

  it('should enable guia and justificacionDescription when esFormularioSoloLectura is false', () => {
    component.datosSolicitudForm = component['formBuilder'].group({
      guia: ['test'],
      justificacionDescription: ['test'],
    });
    component.esFormularioSoloLectura = false;
    component.inicializarEstadoFormulario();
    expect(component.datosSolicitudForm.get('guia')?.enabled).toBe(true);
    expect(
      component.datosSolicitudForm.get('justificacionDescription')?.enabled
    ).toBe(true);
  });

  it('should set and disable punto, aduana, and oficina in rellenarValoresPredeterminados', () => {
    component.datosSolicitudForm = component['formBuilder'].group({
      punto: [''],
      aduana: [''],
      oficina: [''],
    });
    component.formularioDatos = {
      punto: 'Punto Test',
      aduana: 'Aduana Test',
      oficina: 'Oficina Test',
    } as any;
    component.rellenarValoresPredeterminados();
    expect(component.datosSolicitudForm.get('punto')?.value).toBe('Punto Test');
    expect(component.datosSolicitudForm.get('punto')?.disabled).toBe(true);
    expect(component.datosSolicitudForm.get('aduana')?.value).toBe(
      'Aduana Test'
    );
    expect(component.datosSolicitudForm.get('aduana')?.disabled).toBe(true);
    expect(component.datosSolicitudForm.get('oficina')?.value).toBe(
      'Oficina Test'
    );
    expect(component.datosSolicitudForm.get('oficina')?.disabled).toBe(true);
  });
});
