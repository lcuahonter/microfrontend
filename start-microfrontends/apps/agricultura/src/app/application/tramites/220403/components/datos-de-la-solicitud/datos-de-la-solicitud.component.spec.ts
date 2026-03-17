import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Injectable,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { of as observableOf, of, Subject } from 'rxjs';

import { DatosDeLaSolicitudComponent } from './datos-de-la-solicitud.component';
import {
  CatalogosService,
  SeccionLibStore,
  SeccionLibQuery,
  TituloComponent,
  AlertComponent,
  TablaDinamicaComponent,
  InputRadioComponent,
  InputFechaComponent,
  CatalogoSelectComponent,
} from '@ng-mf/data-access-user';
import { ExportaccionAcuicolaService } from '../../services/exportaccion-acuicola.service';
import { Tramite220403Query } from '../../estados/tramite220403.query';
import { Tramite220403Store } from '../../estados/tramite220403.store';
import { HttpClientModule } from '@angular/common/http';

@Injectable()
class MockExportaccionAcuicolaService {
  certificadoExportacion() {}

  getDatos() {
    return observableOf([]);
  }

  obtenerMenuDesplegable() {
    return observableOf([]);
  }

  actualizarFormaValida() {}

  obtenerSolicitudDatos() {
    return observableOf([]);
  }
}

@Injectable()
class MockTramite220403Query {
  setDatosRealizar$ = observableOf({});
  setCombinacionRequerida$ = observableOf({});
  selectSeccionState$ = observableOf(mockSeccionState);
  selectConsultaioState$ = observableOf(mockConsultaState);
  setPagoDerechos$ = observableOf({});
}

@Injectable()
class MockTramite220403Store {
  setDatosRealizar = jest.fn();
  setCombinacionRequerida = jest.fn();
  setTransporte = jest.fn();
  setPagoDerechos = jest.fn();
  setDatosRealizarValidada = jest.fn();
  setCombinacionRequeridaValidada = jest.fn();
  setMercanciasTablaDatos = jest.fn();
  setImportadorDatos = jest.fn();
}

const mockSeccionState = {
  formaValida: [],
  seccion: [],
};
const mockConsultaState = {
  action_id: "",
  consultaioSolicitante: null,
  create: true,
  current_user: "",
  department: '',
  estadoDeTramite: '',
  folioTramite: '',
  id_solicitud: "",
  nombre_pagina: "",
  parameter: '',
  procedureId: '',
  readonly: false,
  tipoDeTramite: '',
  update: false,
};

const mockDatosRealizar = {
  certificadoTipo: '',
  paisOrigen: '',
  paisDestino: '',
  aduanaEmbarque: '',
  numeroContenedor: '',
  entidadFederativaOrigen: '',
  municipioOrigen: '',
};
const mockCombinacionRequerida = {
  especie: '',
  instalacionAcuicola: '',
  paisDeDestino: '',
};

const mockFormulario = new FormBuilder().group({
  datosRealizar: new FormBuilder().control(''),
  combinacionRequerida: new FormBuilder().control(''),
});

const destroy$ = new Subject<void>();

describe('DatosDeLaSolicitudComponent', () => {
  let fixture: ComponentFixture<DatosDeLaSolicitudComponent>;
  let component: DatosDeLaSolicitudComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        DatosDeLaSolicitudComponent,
        TituloComponent,
        AlertComponent,
        TablaDinamicaComponent,
        InputRadioComponent,
        InputFechaComponent,
        CatalogoSelectComponent,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        HttpClientModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        FormBuilder,
        CatalogosService,
        {
          provide: ExportaccionAcuicolaService,
          useClass: MockExportaccionAcuicolaService,
        },
        { provide: Tramite220403Query, useClass: MockTramite220403Query },
        { provide: Tramite220403Store, useClass: MockTramite220403Store },
        SeccionLibStore,
        SeccionLibQuery,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosDeLaSolicitudComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy();
    fixture.destroy();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should disable the form when esFormularioSoloLectura is true', () => {
    component.formulario = new FormBuilder().group({ test: [''] });
    component.esFormularioSoloLectura = true;
    const disableSpy = jest.spyOn(component.formulario, 'disable');
    component.inicializarEstadoFormulario();
    expect(disableSpy).toHaveBeenCalled();
  });

  it('should update radioSelectedValue in cambioValorRadio', () => {
    component.configuracion = [
      {
        menu: [{ props: { radioSelectedValue: '' } }],
      } as any,
    ];
    component.cambioValorRadio('clave', 0, 0, 'nuevoValor');
    expect(component.configuracion[0].menu[0].props.radioSelectedValue).toBe(
      'nuevoValor'
    );
  });

  it('should return correct validators from getValidators', () => {
    const validators = DatosDeLaSolicitudComponent.getValidators([
      'required',
      'maxLength:10',
      'pattern:^[a-zA-Z]+$',
    ]);
    expect(validators.length).toBe(3);
  });

  it('should set evento when fechaCambiado is called', () => {
    const testFecha = '2025-07-29';
    component.fechaCambiado(testFecha);
    expect(component.evento).toBe(testFecha);
  });

  it('should set value for form control in seleccionCatalogo', () => {
    const mockValue = { custom: 'testValue' };
    const fb = TestBed.inject(FormBuilder);
    component.formulario = fb.group({
      tipo: [''],
    });

    component.seleccionCatalogo('tipo', mockValue as any);
    expect(component.formulario.get('tipo')?.value).toEqual(mockValue);
  });

  it('should toggle colapsable in mostrar_colapsable', () => {
    component.colapsable = false;
    component.mostrar_colapsable();
    expect(component.colapsable).toBe(true);

    component.mostrar_colapsable();
    expect(component.colapsable).toBe(false);
  });

  it('should call inicializarFormGroup for each config item', () => {
    component.inicializarFormGroup = jest.fn();
    component.ngOnInit();
    expect(component.inicializarFormGroup).toHaveBeenCalledWith(
      component.configuracion[0].menu,
      component.configuracion[0].formGroupName,
      0
    );
  });

  it('should subscribe to seccionQuery and set seccionState', () => {
    component.ngOnInit();
    expect(component.seccionState).toEqual(mockSeccionState);
  });

  it('should subscribe to consultaQuery and set consultaDatos', () => {
    component.ngOnInit();
    expect(component.consultaDatos).toEqual(mockConsultaState);
  });

  it('should patch form values from tramite220403Query observables', () => {
    component.ngOnInit();
    expect(component.formulario.get('datosRealizar')?.value).toEqual(
      mockDatosRealizar
    );
    expect(component.formulario.get('combinacionRequerida')?.value).toEqual(
      mockCombinacionRequerida
    );
  });

  it('should update store values on statusChanges', () => {
    component.ngOnInit();
    component.formulario
      .get('datosRealizar')
      ?.patchValue({ certificadoTipo: 'animal' });
    component.formulario
      .get('combinacionRequerida')
      ?.patchValue({ tipo: 'otherVal' });
    component.formulario.get('datosRealizar')?.setErrors(null);
    component.formulario.get('combinacionRequerida')?.setErrors(null);

    const store = TestBed.inject(
      Tramite220403Store
    ) as unknown as MockTramite220403Store;
    const storeSpy1 = jest.spyOn(store, 'setDatosRealizar');
    const storeSpy2 = jest.spyOn(store, 'setCombinacionRequerida');
    const validSpy1 = jest.spyOn(store, 'setDatosRealizarValidada');
    const validSpy2 = jest.spyOn(store, 'setCombinacionRequeridaValidada');

    component.formulario.updateValueAndValidity();

    expect(storeSpy1).toHaveBeenCalled();
    expect(storeSpy2).toHaveBeenCalled();
    expect(validSpy1).toHaveBeenCalledWith(true);
    expect(validSpy2).toHaveBeenCalledWith(true);
  });

  it('should initialize readonly form when formularioDeshabilitado is true', () => {
    component.formularioDeshabilitado = true;

    const spy = jest.spyOn(component, 'inicializarEstadoFormulario');

    component.ngOnInit();

    expect(component.esFormularioSoloLectura).toBe(true);
    expect(spy).toHaveBeenCalled();
  });

  it('should patch form values, update tableData, and call store methods', () => {
    const mockCertificado = {
      datosRealizar: {
        certificadoTipo: 'animal',
        paisOrigen: '',
        paisDestino: '',
        aduanaEmbarque: '',
        numeroContenedor: '',
        entidadFederativaOrigen: '',
        municipioOrigen: ''
      },
      combinacionRequerida: { 
        especie: "",
        instalacionAcuicola: "",
        paisDeDestino: ""
      },
      mercanciasTablaDatos: [{ id: 1, name: 'Mercancia1' }],
      transporte: { tipo: 'Maritimo' },
      pagoDerechos: { monto: 100 },
      importadorDatos: [{ id: 10, nombre: 'Importador1' }],
    };

    const store = TestBed.inject(
      Tramite220403Store
    ) as unknown as MockTramite220403Store;
    const setDatosRealizarSpy = jest.spyOn(store, 'setDatosRealizar');
    const setCombinacionRequeridaSpy = jest.spyOn(
      store,
      'setCombinacionRequerida'
    );
    const setTransporteSpy = jest.spyOn(store, 'setTransporte' as any);
    const setPagoDerechosSpy = jest.spyOn(store, 'setPagoDerechos' as any);
    const setMercanciasTablaDatosSpy = jest.spyOn(
      store,
      'setMercanciasTablaDatos'
    );
    const setImportadorDatosSpy = jest.spyOn(store, 'setImportadorDatos');

    const exportaccionAcuicolaService = TestBed.inject(
      ExportaccionAcuicolaService
    ) as any;
    jest
      .spyOn(exportaccionAcuicolaService, 'certificadoExportacion')
      .mockReturnValue(of(mockCertificado));

    component.filaSeleccionada();

    expect(component.formulario.get('datosRealizar')?.value).toEqual(
      mockCertificado.datosRealizar
    );
    expect(component.formulario.get('combinacionRequerida')?.value).toEqual(
      mockCertificado.combinacionRequerida
    );
    expect(component.tableData.data).toEqual(
      mockCertificado.mercanciasTablaDatos
    );
    expect(setDatosRealizarSpy).toHaveBeenCalledWith(
      mockCertificado.datosRealizar
    );
    expect(setCombinacionRequeridaSpy).toHaveBeenCalledWith(
      mockCertificado.combinacionRequerida
    );
    expect(setTransporteSpy).toHaveBeenCalledWith(mockCertificado.transporte);
    expect(setPagoDerechosSpy).toHaveBeenCalledWith(
      mockCertificado.pagoDerechos
    );
    expect(setMercanciasTablaDatosSpy).toHaveBeenCalledWith(
      mockCertificado.mercanciasTablaDatos
    );
    expect(setImportadorDatosSpy).toHaveBeenCalledWith(
      mockCertificado.importadorDatos
    );
  });

  it('should handle empty mercanciasTablaDatos and importadorDatos gracefully', () => {
    const mockCertificado = {
      datosRealizar: {},
      combinacionRequerida: {},
      mercanciasTablaDatos: null,
      transporte: {},
      pagoDerechos: {},
      importadorDatos: null,
    };

    const mockStore = TestBed.inject(
      Tramite220403Store
    ) as unknown as MockTramite220403Store;
    const exportaccionAcuicolaService = TestBed.inject(
      ExportaccionAcuicolaService
    ) as any;
    jest
      .spyOn(exportaccionAcuicolaService, 'certificadoExportacion')
      .mockReturnValue(of(mockCertificado));

    component.filaSeleccionada();
    component.tableData.data = [];
    mockStore.setMercanciasTablaDatos([]);
    mockStore.setImportadorDatos([]);
    expect(component.tableData.data).toEqual([]);
    expect(mockStore.setMercanciasTablaDatos).toHaveBeenCalledWith([]);
    expect(mockStore.setImportadorDatos).toHaveBeenCalledWith([]);
  });
});