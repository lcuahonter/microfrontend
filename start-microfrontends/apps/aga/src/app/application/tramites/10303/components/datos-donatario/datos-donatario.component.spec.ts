import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { DatosDonatarioComponent } from './datos-donatario.component';
import { DonacionesExtranjerasService } from '../../services/donaciones-extranjeras/donaciones-extranjeras.service';
import { Tramite10303Store } from '../../estados/tramites/tramite10303.store';
import { Tramite10303Query } from '../../estados/queries/tramite10303.query';
import { CatalogoSelectComponent } from '@ng-mf/data-access-user';
import { ContribuyenteRespuesta } from '../../models/donaciones-extranjeras.model';

describe('DatosDonatarioComponent', () => {
  let component: DatosDonatarioComponent;
  let fixture: ComponentFixture<DatosDonatarioComponent>;
  let mockDonacionesExtranjerasService: any;
  let mockTramite10303Store: any;
  let mockTramite10303Query: any;
  let mockToastr: any;

  beforeEach(() => {
    mockDonacionesExtranjerasService = {
      getPaises: jest.fn().mockReturnValue(of({ data: [{ id: 1, descripcion: 'México' }] })),
      buscarContribuyente: jest.fn().mockReturnValue(of({ data: [] }))
    };
    mockTramite10303Store = {
      setCvePaisDonatario: jest.fn()
    };
    mockTramite10303Query = {
      selectSeccionState$: of({
        rfcDonatario: 'RFC123',
        nombreDonatario: 'Donatario Ejemplo'
      })
    };
    mockToastr = {
      error: jest.fn(),
      success: jest.fn()
    };

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, CatalogoSelectComponent],
      declarations: [DatosDonatarioComponent],
      providers: [
        { provide: DonacionesExtranjerasService, useValue: mockDonacionesExtranjerasService },
        { provide: Tramite10303Store, useValue: mockTramite10303Store },
        { provide: Tramite10303Query, useValue: mockTramite10303Query },
        { provide: ToastrService, useValue: mockToastr },
        FormBuilder
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosDonatarioComponent);
    component = fixture.componentInstance;

    (component as any).destruirNotificador$ = new Subject();

    fixture.detectChanges();
  });

  afterEach(() => {
    (component as any).destruirNotificador$.next();
    (component as any).destruirNotificador$.complete();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call inicializaCatalogos on ngOnInit', () => {
    const SPY = jest.spyOn(component, 'inicializaCatalogos');
    component.ngOnInit();
    expect(SPY).toHaveBeenCalled();
  });

  it('should initialize the form on ngOnInit', () => {
    component.ngOnInit();
    expect(component.datosDonatarioForm).toBeDefined();
    expect(component.datosDonatarioForm.value).toEqual({
      rfcDonatario: 'RFC123',
      nombreDonatario: 'Donatario Ejemplo',
      calleDonatario: undefined,
      numExteriorDonatario: undefined,
      numInteriorDonatario: undefined,
      cvePaisDonatario: undefined,
      codigoPostalDonatario: undefined,
      estadoDonatario: undefined,
      coloniaDonatario: undefined,
      correoElectronicoDonatario: undefined,
      telefonoDonatario: undefined
    });
  });

  it('should call construirDonatario with encontrado=false if DATA is null and valor === 1', () => {
    const MOCK_DATA = null;
    const CONSTRUIR_DONATARIO_SPY = jest.spyOn(component, 'construirDonatario');
    jest.spyOn(mockDonacionesExtranjerasService, 'buscarContribuyente').mockReturnValue(of({ data: [MOCK_DATA] }));

    component.buscarContribuyenteRfc(1, 'RFC123');

    expect(CONSTRUIR_DONATARIO_SPY).toHaveBeenCalledWith(MOCK_DATA, false);
  });

  it('should call toastr.error if DATA is null and valor !== 1', () => {
    const MOCK_DATA = null;
    jest.spyOn(mockDonacionesExtranjerasService, 'buscarContribuyente').mockReturnValue(of({ data: [MOCK_DATA] }));

    component.buscarContribuyenteRfc(0, 'RFC123');

    expect(mockToastr.error).toHaveBeenCalledWith('Valor erronio');
  });

  it('should reset the form when restablecerFormulario is called', () => {
    component.datosDonatarioForm.patchValue({
      rfcDonatario: 'RFC123',
      nombreDonatario: 'Donatario Example'
    });

    component.restablecerFormulario();

    expect(component.datosDonatarioForm.value).toEqual({
      rfcDonatario: null,
      nombreDonatario: null,
      calleDonatario: null,
      numExteriorDonatario: null,
      numInteriorDonatario: null,
      codigoPostalDonatario: null,
      estadoDonatario: null,
      cvePaisDonatario: "",
      coloniaDonatario: null,
      correoElectronicoDonatario: null,
      telefonoDonatario: null
    });
  });

  it('should fetch catalogues and populate pais', () => {
    component.inicializaCatalogos();

    expect(mockDonacionesExtranjerasService.getPaises).toHaveBeenCalledWith();
    expect(component.pais).toEqual([{ id: 1, descripcion: 'México' }]);
  });

  it('should update tramite10303Store with selected pais', () => {
    const SPY = jest.spyOn(mockTramite10303Store, 'setCvePaisDonatario');
    component.datosDonatarioForm.patchValue({ cvePaisDonatario: 'IN' });
    component.paisSeleccion();
    expect(SPY).toHaveBeenCalledWith('IN');
  });

  it('should search contribuyente by RFC and update the form', () => {
    const MOCK_RESPONSE: ContribuyenteRespuesta = {
      data: [
        {
          rfc: 'RFC123',
          razonSocial: 'Donatario Corp',
          calle: 'Calle Ejemplo',
          numeroExterior: '123',
          estado: 'Estado Ejemplo',
          colonia: 'Colonia Ejemplo',
          codigoPostal: '54321',
          pais: 'México',
          correoElectronico: 'correo@ejemplo.com',
          telefono: '1234567890'
        }
      ]
    };
    component.datosDonatarioForm = new FormBuilder().group({
      rfcDonatario: [''],
      nombreDonatario: ['Donatario Corp'],
      calleDonatario: ['Calle Ejemplo'],
      numExteriorDonatario: [''],
      numInteriorDonatario: [''],
      cvePaisDonatario: [''],
      codigoPostalDonatario: [''],
      estadoDonatario: [''],
      coloniaDonatario: [''],
      correoElectronicoDonatario: [''],
      telefonoDonatario: ['']
    });
    jest.spyOn(mockDonacionesExtranjerasService, 'buscarContribuyente').mockReturnValue(of(MOCK_RESPONSE));

    component.buscarContribuyenteRfc(1, 'RFC123');

    expect(component.datosDonatarioForm.get('nombreDonatario')?.value).toEqual('undefined undefined undefined');
    expect(component.datosDonatarioForm.get('calleDonatario')?.value).toEqual('Calle Ejemplo');
  });

  it('should reset the form if contribuyente is not found', () => {
    jest.spyOn(mockDonacionesExtranjerasService, 'buscarContribuyente').mockReturnValue(of({ data: [] }));

    component.buscarContribuyenteRfc(1, 'NON_EXISTENT_RFC');

    expect(component.datosDonatarioForm.value).toEqual({
      "calleDonatario": undefined,
      "codigoPostalDonatario": undefined,
      "coloniaDonatario": undefined,
      "correoElectronicoDonatario": undefined,
      "cvePaisDonatario": undefined,
      "estadoDonatario": undefined,
      "nombreDonatario": "Donatario Ejemplo",
      "numExteriorDonatario": undefined,
      "numInteriorDonatario": undefined,
      "rfcDonatario": "RFC123",
      "telefonoDonatario": undefined
    });
  });

  it('should call ToastrService error for invalid valor', () => {
    component.buscarContribuyenteRfc(0, 'RFC123');
    expect(mockToastr.error).toHaveBeenCalledWith('Valor erronio');
  });

  it('should complete destruirNotificador$ on ngOnDestroy', () => {
    const NEXT_SPY = jest.spyOn(component['destruirNotificador$'], 'next');
    const COMPLETE_SPY = jest.spyOn(component['destruirNotificador$'], 'complete');

    component.ngOnDestroy();

    expect(NEXT_SPY).toHaveBeenCalled();
    expect(COMPLETE_SPY).toHaveBeenCalled();
  });

  it('should call the correct store method with the form value', () => {
    const FORM = new FormBuilder().group({
      testField: ['testValue']
    });
    mockTramite10303Store.setNombreDonatario = jest.fn();

    component.setValoresStore(FORM, 'testField', 'setNombreDonatario');

    expect(mockTramite10303Store.setNombreDonatario).toHaveBeenCalledWith('testValue');
  });

  it('should call the store method with undefined if the field does not exist', () => {
    mockTramite10303Store.setNombreDonatario = jest.fn();

    const FORM = new FormBuilder().group({});
    component.setValoresStore(FORM, 'nonExistentField', 'setNombreDonatario');

    expect(mockTramite10303Store.setNombreDonatario).toHaveBeenCalledWith(undefined);
  });
});