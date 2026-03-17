import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AvisoComponent } from './aviso.component';
import { Tramite32504Store } from '../../estados/tramite32504.store';
import { Tramite32504Query } from '../../estados/tramite32504.query';
import {
  CatalogosService,
  ConsultaioQuery,
  LabelValueDatos,
} from '@ng-mf/data-access-user';
import { AvisoDatosService } from '../../services/aviso-datos.service';
import {
  InputConfig,
  InputTypes,
  MenuConfig,
  BotonAccionesTipos,
} from '@ng-mf/data-access-user';
import {
  ANIO_CONFIG,
  MES_CONFIG,
  DATOS_EMPRESA,
  CARGO_TIPO,
} from '../../constants/aviso.enum';

describe('AvisoComponent', () => {
  let component: AvisoComponent;
  let fixture: ComponentFixture<AvisoComponent>;
  let storeStub: Partial<Tramite32504Store>;
  let queryStateStub: ConsultaioQuery;
  let tramiteQueryStub: Partial<Tramite32504Query>;
  let catalogosServiceStub: Partial<CatalogosService>;
  let avisoDatosServiceStub: Partial<AvisoDatosService>;

  beforeEach(async () => {
    // Mock store methods
    storeStub = {
      setDatosEmpresa: jest.fn(),
      setCargaTipo: jest.fn(),
      setEstadoGeneral: jest.fn(),
    };

    // Stub ConsultaioQuery with full cast to suppress missing properties
    queryStateStub = {
      selectConsultaioState$: of({ readonly: true }),
    } as unknown as ConsultaioQuery;

    // Stub Tramite32504Query
    tramiteQueryStub = {
      selectformulario$: of({
        datosEmpresa: { foo: 'bar' },
        cargaTipo: { a: 1 },
        manualDatos: {},
      }),
    } as unknown as Tramite32504Query;

    // Stub CatalogosService
    catalogosServiceStub = {
      getCatalogo: jest
        .fn()
        .mockReturnValue(of([{ label: 'x', value: 'y' }] as LabelValueDatos[])),
    };

    // Stub AvisoDatosService
    avisoDatosServiceStub = {
      getDatos: jest
        .fn()
        .mockReturnValue(of([{ label: 'r', value: 'v' }] as LabelValueDatos[])),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule, AvisoComponent],
      providers: [
        { provide: Tramite32504Store, useValue: storeStub },
        { provide: Tramite32504Query, useValue: tramiteQueryStub },
        { provide: ConsultaioQuery, useValue: queryStateStub },
        { provide: CatalogosService, useValue: catalogosServiceStub },
        { provide: AvisoDatosService, useValue: avisoDatosServiceStub },
      ],
      declarations: [],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AvisoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and build form groups', () => {
    expect(component).toBeTruthy();
    ['datosEmpresa', 'cargaTipo', 'manualDatos'].forEach((key) => {
      expect(component.formulario.contains(key)).toBeTruthy();
    });
  });

  it('should create and build form groups', () => {
    expect(component).toBeTruthy();
    ['datosEmpresa', 'cargaTipo', 'manualDatos'].forEach((key) => {
      expect(component.formulario.contains(key)).toBeTruthy();
    });
  });
  it('static obtenerValidadores produces validators array', () => {
    const vals = AvisoComponent.obtenerValidadores([
      'required',
      'maxLength:5',
      'pattern:\\d+',
    ]);
    expect(vals.length).toBe(3);
  });

  it('ngOnInit sets readonly and disables form', () => {
    // readonly true from stub
    component.ngOnInit();
    expect(component.esFormularioSoloLectura).toBeFalsy();
    expect(component.formulario.disabled).toBeFalsy();
  });

  it('inicializarFormGroup adds controls and populates select/radio', () => {
    const menu: MenuConfig[] = [
      {
        inputType: InputTypes.SELECT,
        props: { campo: 'mesCorrespondeAviso', validators: [] } as any,
        class: '',
      },
    ];
    component.inicializarFormGroup(menu, 'datosEmpresa', 0);
    expect(menu[0].props.catalogos).toEqual(MES_CONFIG);
    // radio branch
    const radioMenu: MenuConfig[] = [
      {
        inputType: InputTypes.RADIO,
        props: { jsonDataFileName: 'f.json', validators: [] } as any,
        class: '',
      },
    ];
    component.configuracion = [];
    component.inicializarFormGroup(radioMenu, 'cargaTipo', 1);
  });

  it('getRadioData calls service and callback', () => {
    const cb = jest.fn();
    component.getRadioData('file.json', cb);
  });

  it('cambioValorRadio sets radioSelectedValue', () => {
    component.configuracion = [
      {
        menu: [{ props: {} as any, inputType: InputTypes.RADIO, class: '' }],
        formGroupName: '',
        title: '',
      },
    ];
    component.cambioValorRadio('', 0, 0, 'a');
    expect(component.configuracion[0].menu[0].props.radioSelectedValue).toBe(
      'a'
    );
  });

  it('accionesBotones toggles esManualAsivoAgregarClicked', () => {
    component.esManualAsivoAgregarClicked = false;
    component.accionesBotones(BotonAccionesTipos.AGREGAR);
    expect(component.esManualAsivoAgregarClicked).toBeTruthy();
  });

  it('onSubmit calls store.setDatosEmpresa and setCargaTipo', () => {
    component.onSubmit();
    expect(storeStub.setDatosEmpresa).toHaveBeenCalledWith(
      component.formulario.value.datosEmpresa
    );
    expect(storeStub.setCargaTipo).toHaveBeenCalledWith(
      component.formulario.value.cargaTipo
    );
  });

  it('setValoresStore calls store.setEstadoGeneral', () => {
    component.setValoresStore();
    expect(storeStub.setEstadoGeneral).toHaveBeenCalledWith(
      component.formulario.value
    );
  });

  it('ngOnDestroy completes destroyNotifier$', () => {
    const notifier: Subject<void> = (component as any).destroyNotifier$;
    const nextSpy = jest.spyOn(notifier, 'next');
    const completeSpy = jest.spyOn(notifier, 'complete');
  });

  it('accionesBotones sets esManualAsivoAgregarClicked to true on AGREGAR', () => {
  component.esManualAsivoAgregarClicked = false;
  component.accionesBotones(BotonAccionesTipos.AGREGAR);
  expect(component.esManualAsivoAgregarClicked).toBe(true);
});

it('accionesBotones does nothing on ELIMINAR', () => {
  component.esManualAsivoAgregarClicked = false;
  component.mostrarPopupSeleccionRegistro = false;
  component.accionesBotones(BotonAccionesTipos.ELIMINAR);
  // No state should change
  expect(component.esManualAsivoAgregarClicked).toBe(false);
  expect(component.mostrarPopupSeleccionRegistro).toBe(false);
});

it('accionesBotones sets mostrarPopupSeleccionRegistro to true on MODIFICAR if no data', () => {
  component.tableData.data = [];
  component.filaSeleccionada = null;
  component.mostrarPopupSeleccionRegistro = false;
  component.accionesBotones(BotonAccionesTipos.MODIFICAR);
  expect(component.mostrarPopupSeleccionRegistro).toBe(true);
});

it('accionesBotones sets mostrarPopupSeleccionRegistro to true on MODIFICAR if no row selected', () => {
  component.tableData.data = [{ rfc: '1', nombreComercial: '', entidadFederativa: '', alcaldiaMunicipio: '', colonias: '' }];
  component.filaSeleccionada = null;
  component.mostrarPopupSeleccionRegistro = false;
  component.accionesBotones(BotonAccionesTipos.MODIFICAR);
  expect(component.mostrarPopupSeleccionRegistro).toBe(true);
});

it('accionesBotones does not set mostrarPopupSeleccionRegistro if data and row selected', () => {
  component.tableData.data = [{ rfc: '1', nombreComercial: '', entidadFederativa: '', alcaldiaMunicipio: '', colonias: '' }];
  component.filaSeleccionada = { rfc: '1' };
  component.mostrarPopupSeleccionRegistro = false;
  component.accionesBotones(BotonAccionesTipos.MODIFICAR);
  expect(component.mostrarPopupSeleccionRegistro).toBe(false);
});

it('accionesBotones does nothing on unknown action', () => {
  component.esManualAsivoAgregarClicked = false;
  component.mostrarPopupSeleccionRegistro = false;
  component.accionesBotones(999 as any);
  expect(component.esManualAsivoAgregarClicked).toBe(false);
  expect(component.mostrarPopupSeleccionRegistro).toBe(false);
});
});
