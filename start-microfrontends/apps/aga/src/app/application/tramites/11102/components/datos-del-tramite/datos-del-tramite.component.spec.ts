import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosDelTramiteComponent } from './datos-del-tramite.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { of, Subject } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  AlertComponent,
  CatalogoSelectComponent,
  ConsultaioQuery,
  InputCheckComponent,
  TableComponent,
  TituloComponent,
  ValidacionesFormularioService,
} from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { Tramite11102Query } from '../../estados/tramite11102.query';
import { Tramite11102Store } from '../../estados/tramite11102.store';
import { ModificacionDonacionesImmexService } from '../../services/modificacion-donaciones-immex.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DatosDelMercancia } from '../../models/modificacion-donaciones-immex.model';

describe('DatosDelTramiteComponent', () => {
  let component: DatosDelTramiteComponent;
  let fixture: ComponentFixture<DatosDelTramiteComponent>;
  let MockConsultaioQuery: Partial<ConsultaioQuery>;
  let MockModificacionDonacionesImmexService: Partial<ModificacionDonacionesImmexService>;
  let MockTramite11102Store: Partial<Tramite11102Store>;
  let MockTramite11102Query: Partial<Tramite11102Query>;
  let MockValidacionesFormularioService: Partial<ValidacionesFormularioService>;

  beforeEach(async () => {
    MockConsultaioQuery = {
      selectConsultaioState$: of({ readonly: false }),
    } as unknown as jest.Mocked<ConsultaioQuery>;
    MockModificacionDonacionesImmexService = {
      getAduana: jest
        .fn()
        .mockReturnValue(of({ data: [{ id: 1, nombre: 'Aduana1' }] })),
      getTipoDeMercancia: jest
        .fn()
        .mockReturnValue(of({ data: [{ id: 1, nombre: 'Tipo1' }] })),
      getCondicionMercancia: jest
        .fn()
        .mockReturnValue(of({ data: [{ id: 1, nombre: 'Condicion1' }] })),
      getUnidadMedida: jest
        .fn()
        .mockReturnValue(of({ data: [{ id: 1, nombre: 'Unidad1' }] })),
      getAno: jest.fn().mockReturnValue(of({ data: [{ id: 2024 }] })),
      getPais: jest
        .fn()
        .mockReturnValue(of({ data: [{ id: 1, nombre: 'México' }] })),
      obtenerMercanciaDatos: jest.fn().mockReturnValue(of({}))
    };
    MockTramite11102Store = {
      setAduana: jest.fn(() => of()),
      setTipoDeMercancia: jest.fn(() => of()),
      setCondicionMercancia: jest.fn(() => of()),
      setUnidadMedida: jest.fn(() => of()),
      setAno: jest.fn(() => of()),
      setPais: jest.fn(() => of()),
      setOrganismoPublico: jest.fn(() => of()),
      setDelMercancia: jest.fn(() => of()),
    };
    MockTramite11102Query = {
      selectSolicitud$: of({
        organismoPublico: false,
        aduana: '',
        usoEspecifico: '',
        showTabla: true,
        tipoDeMercancia: '',
        unidadMedida: '',
        condicionMercancia: '',
        ano: '',
        cantidad: '',
        marca: '',
        modelo: '',
        serie: '',
        pais: '',
        calle: '',
        numeroExterior: '',
        numeroInterior: '',
        telefono: '',
        correoElectronico: '',
        correoElectronicoOpcional: '',
        telefonoOpcional: '',
        rfc: '',
        numeroProgramaImmex: '',
        razonSocial: '',
        codigoPostal: '',
        estado: '',
        colonia: '',
        datosDelMercancia: [],
        folioOriginal: '',
      }),
    };
    MockValidacionesFormularioService = {
      isValid: jest.fn().mockReturnValue(true)
    };

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        TableComponent,
        TituloComponent,
        CatalogoSelectComponent,
        FormsModule,
        ReactiveFormsModule,
        AlertComponent,
        InputCheckComponent,
        HttpClientTestingModule,
        DatosDelTramiteComponent,
      ],
      declarations: [],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: FormBuilder, useClass: FormBuilder },
        { provide: ConsultaioQuery, useValue: MockConsultaioQuery },
        {
          provide: ModificacionDonacionesImmexService,
          useValue: MockModificacionDonacionesImmexService,
        },
        { provide: Tramite11102Store, useValue: MockTramite11102Store },
        { provide: Tramite11102Query, useValue: MockTramite11102Query },
        {
          provide: ValidacionesFormularioService,
          useValue: MockValidacionesFormularioService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosDelTramiteComponent);
    component = fixture.componentInstance;
    component.solicitudState = {
      aduana: 1,
      organismoPublico: true,
      usoEspecifico: 'Uso',
      pais: 1,
      rfc: 'RFC123',
      numeroProgramaImmex: '1234',
      razonSocial: 'Empresa',
      correoElectronicoOpcional: 'test@mail.com',
      telefonoOpcional: '1234567890',
      calle: 'Calle',
      numeroExterior: '10',
      numeroInterior: '2',
      telefono: '1234567890',
      correoElectronico: 'test@mail.com',
      codigoPostal: '12345',
      estado: 'Estado',
      colonia: 'Colonia',
      tipoDeMercancia: 1,
      condicionMercancia: 1,
      unidadMedida: 1,
      ano: 2024,
    } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize tramiteForm and agregarMercanciasForm in donanteDomicilio', () => {
    component.donanteDomicilio();
    expect(component.tramiteForm).toBeDefined();
    expect(component.agregarMercanciasForm).toBeDefined();
    expect(
      component.tramiteForm.get('modificacionDonacionesImmex.aduana')?.value
    ).toBe("");
  });

  it('should call setAduana on aduanaSeleccion', () => {
    component.donanteDomicilio();
    component.tramiteForm
      .get('modificacionDonacionesImmex.aduana')
      ?.setValue(2);
    component.aduanaSeleccion();
    expect(MockTramite11102Store.setAduana).toHaveBeenCalledWith(2);
  });

  it('should call setTipoDeMercancia on tipoDeMercanciaSeleccion', () => {
    component.donanteDomicilio();
    component.agregarMercanciasForm
      .get('datosMercancia.tipoDeMercancia')
      ?.setValue(3);
    component.tipoDeMercanciaSeleccion();
    expect(MockTramite11102Store.setTipoDeMercancia).toHaveBeenCalledWith(3);
  });

  it('should call setCondicionMercancia on condicionMercanciaSeleccion', () => {
    component.donanteDomicilio();
    component.agregarMercanciasForm
      .get('datosMercancia.condicionMercancia')
      ?.setValue(4);
    component.condicionMercanciaSeleccion();
    expect(MockTramite11102Store.setCondicionMercancia).toHaveBeenCalledWith(4);
  });

  it('should call setUnidadMedida on unidadMedidaSeleccion', () => {
    component.donanteDomicilio();
    component.agregarMercanciasForm
      .get('datosMercancia.unidadMedida')
      ?.setValue(5);
    component.unidadMedidaSeleccion();
    expect(MockTramite11102Store.setUnidadMedida).toHaveBeenCalledWith(5);
  });

  it('should call setAno on anoSeleccion', () => {
    component.donanteDomicilio();
    component.agregarMercanciasForm.get('datosMercancia.ano')?.setValue(2025);
    component.anoSeleccion();
    expect(MockTramite11102Store.setAno).toHaveBeenCalledWith(2025);
  });

  it('should call setPais on paisSeleccion', () => {
    component.donanteDomicilio();
    component.tramiteForm.get('modificacionDonacionesImmex.pais')?.setValue(6);
    component.paisSeleccion();
    expect(MockTramite11102Store.setPais).toHaveBeenCalledWith(6);
  });

  it('should call setOrganismoPublico on organismoPublico', () => {
    component.donanteDomicilio();
    component.tramiteForm
      .get('modificacionDonacionesImmex.organismoPublico')
      ?.setValue(true);
    component.organismoPublico();
    expect(MockTramite11102Store.setOrganismoPublico).toHaveBeenCalledWith(
      true
    );
  });

  it('should mark all as touched if tramiteForm is invalid in validarDestinatarioFormulario', () => {
    component.donanteDomicilio();
    jest.spyOn(component.tramiteForm, 'markAllAsTouched');
    component.tramiteForm
      .get('modificacionDonacionesImmex.aduana')
      ?.setValue(null);
    component.validarDestinatarioFormulario();
    expect(component.tramiteForm.markAllAsTouched).toHaveBeenCalled();
  });

  it('should call guardarDatosDelFormulario if esFormularioSoloLectura is true in inicializarEstadoFormulario', () => {
    component.esFormularioSoloLectura = true;
    const guardarSpy = jest.spyOn(component, 'guardarDatosDelFormulario');
    const avisoSpy = jest.spyOn(component, 'datosDeAvisoForm');
    component.inicializarEstadoFormulario();
    expect(guardarSpy).toHaveBeenCalled();
    expect(avisoSpy).not.toHaveBeenCalled();
  });

  it('should call datosDeAvisoForm if esFormularioSoloLectura is false in inicializarEstadoFormulario', () => {
    component.esFormularioSoloLectura = false;
    const guardarSpy = jest.spyOn(component, 'guardarDatosDelFormulario');
    const avisoSpy = jest.spyOn(component, 'datosDeAvisoForm');
    component.inicializarEstadoFormulario();
    expect(avisoSpy).toHaveBeenCalled();
    expect(guardarSpy).not.toHaveBeenCalled();
  });

  it('should call the correct store method in setValoresStore', () => {
    component.donanteDomicilio();
    component.tramiteForm
      .get('modificacionDonacionesImmex.aduana')
      ?.setValue(7);
    component.setValoresStore(
      component.tramiteForm.get('modificacionDonacionesImmex') as any,
      'aduana',
      'setAduana'
    );
    expect(MockTramite11102Store.setAduana).toHaveBeenCalledWith(7);
  });

  it('should disable the form if esFormularioSoloLectura is true in guardarDatosFormulario', () => {
    component.donanteDomicilio();
    component.tramiteForm = new FormBuilder().group({ test: [''] });
    const disableSpy = jest.spyOn(component.tramiteForm, 'disable');
    component.esFormularioSoloLectura = true;
    component.guardarDatosDelFormulario();
    expect(disableSpy).toHaveBeenCalled();
  });

  it('should enable the form if esFormularioSoloLectura is false in guardarDatosFormulario', () => {
    component.donanteDomicilio();
    component.tramiteForm = new FormBuilder().group({ test: [''] });
    const enableSpy = jest.spyOn(component.tramiteForm, 'enable');
    component.esFormularioSoloLectura = false;
    component.guardarDatosDelFormulario();
    expect(enableSpy).toHaveBeenCalled();
  });

  it('should set mercanciaHeaderData and mercanciaBodyData in obtenerMercancia', () => {
    component.obtenerMercancia();
    expect(component.mercanciaHeaderData).toEqual([]);
    expect(component.mercanciaBodyData).toEqual([]);
  });


  it('should disable all relevant controls in tramiteForm and agregarMercanciasForm when esFormularioSoloLectura is true in datosDeAvisoForm', () => {
    component.tramiteForm = new FormBuilder().group({
      modificacionDonacionesImmex: new FormBuilder().group({
        aduana: [''],
        pais: [''],
        rfc: [''],
        pnumeroProgramaImmex: [''],
        correoElectronicoOpcional: [''],
        telefonoOpcional: [''],
        calle: [''],
        numeroExterior: [''],
        numeroInterior: [''],
        correoElectronico: [''],
        telefono: [''],
        estado: [''],
        codigoPostal: [''],
        colonia: [''],
      }),
    });
    component.agregarMercanciasForm = new FormBuilder().group({
      'modificacionDonacionesImmex': new FormBuilder().group({
        datosMercancia: new FormBuilder().group({
          tipoDeMercancia: [''],
          cantidad: [''],
          unidadMedida: [''],
          ano: [''],
          modelo: [''],
          marca: [''],
          serie: [''],
          condicionMercancia: [''],
        }),
      }),
    });
    component.esFormularioSoloLectura = true;
    const tramiteControls = [
      'aduana', 'pais', 'rfc', 'pnumeroProgramaImmex', 'correoElectronicoOpcional',
      'telefonoOpcional', 'calle', 'numeroExterior', 'numeroInterior',
      'correoElectronico', 'telefono', 'estado', 'codigoPostal', 'colonia'
    ];
    tramiteControls.forEach(ctrl => {
      const control = component.tramiteForm.get(`modificacionDonacionesImmex.${ctrl}`);
      if (control) jest.spyOn(control, 'disable');
    });

    const mercanciaControls = [
      'tipoDeMercancia', 'cantidad', 'unidadMedida', 'ano',
      'modelo', 'marca', 'serie', 'condicionMercancia'
    ];
    mercanciaControls.forEach(ctrl => {
      const control = component.agregarMercanciasForm.get(`modificacionDonacionesImmex.datosMercancia.${ctrl}`);
      if (control) jest.spyOn(control, 'disable');
    });
    component.datosDeAvisoForm();
    tramiteControls.forEach(ctrl => {
      const control = component.tramiteForm.get(`modificacionDonacionesImmex.${ctrl}`);
      if (control && (control.disable as jest.Mock).mock) {
        expect(control.disable).toHaveBeenCalled();
      }
    });
    mercanciaControls.forEach(ctrl => {
      const control = component.agregarMercanciasForm.get(`modificacionDonacionesImmex.datosMercancia.${ctrl}`);
      if (control && (control.disable as jest.Mock).mock) {
        expect(control.disable).toHaveBeenCalled();
      }
    });
  });

  it('should not disable controls if esFormularioSoloLectura is false in datosDeAvisoForm', () => {
    component.tramiteForm = new FormBuilder().group({
      modificacionDonacionesImmex: new FormBuilder().group({
        aduana: [''],
      }),
    });
    component.agregarMercanciasForm = new FormBuilder().group({
      'modificacionDonacionesImmex': new FormBuilder().group({
        datosMercancia: new FormBuilder().group({
          tipoDeMercancia: [''],
        }),
      }),
    });
    component.esFormularioSoloLectura = false;
    const aduanaControl = component.tramiteForm.get('modificacionDonacionesImmex.aduana');
    const tipoDeMercanciaControl = component.agregarMercanciasForm.get('modificacionDonacionesImmex.datosMercancia.tipoDeMercancia');
    if (aduanaControl) jest.spyOn(aduanaControl, 'disable');
    if (tipoDeMercanciaControl) jest.spyOn(tipoDeMercanciaControl, 'disable');

    component.datosDeAvisoForm();

    if (aduanaControl && (aduanaControl.disable as jest.Mock).mock) {
      expect(aduanaControl.disable).not.toHaveBeenCalled();
    }
    if (tipoDeMercanciaControl && (tipoDeMercanciaControl.disable as jest.Mock).mock) {
      expect(tipoDeMercanciaControl.disable).not.toHaveBeenCalled();
    }
  });

  it('should not throw if tramiteForm or agregarMercanciasForm are undefined in datosDeAvisoForm', () => {
    component.tramiteForm = undefined as any;
    component.agregarMercanciasForm = undefined as any;
    component.esFormularioSoloLectura = true;
    expect(() => component.datosDeAvisoForm()).not.toThrow();
  });

  it('should clean up destroyNotifier$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn((component as any).destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(
      (component as any).destroyNotifier$,
      'complete'
    );
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should assign the provided mercancia array to mercanciaSeleccionados', () => {
      const mockMercancia: DatosDelMercancia[] = [
        {
          id: 1,
          tipoDeMercancia: 'Vehiculo',
          cantidad: '10',
          unidadMedida: 'kg',
          ano: '2023',
          modelo: 'ModelX',
          marca: 'MarcaX',
          serie: '12345',
          condicionMercancia: 'Nueva',
          datosDelMercancia: []
        }
      ];

      component.seleccionarMercancias(mockMercancia);

      expect(component.mercanciaSeleccionados).toEqual(mockMercancia);
    });

    it('should handle empty array correctly', () => {
      component.seleccionarMercancias([]);

      expect(component.mercanciaSeleccionados).toEqual([]);
    });

    it('should call click on closeModal.nativeElement when closeModal exists', () => {
    const mockClick = jest.fn();
    component.closeModal = {
      nativeElement: { click: mockClick }
    } as any;

    component.cerrarModal();

    expect(mockClick).toHaveBeenCalled();
  });

  it('should not throw error when closeModal does not exist', () => {
    component.closeModal = null as any;

    expect(() => component.cerrarModal()).not.toThrow();
  });

  it('should update the selected mercancia with descriptions and call store', () => {    
    component.mercanciaBodyData = [
      {
        id: 1,
        tipoDeMercancia: '1',
        cantidad: '221',
        unidadMedida: '1',
        ano: '2023',
        modelo: 'model21',
        marca: 'marco21',
        serie: '12456781',
        condicionMercancia: '1',
        datosDelMercancia: []
      }
    ];
    component.mercanciaSeleccionados = [
      {
        id: 1,
        tipoDeMercancia: '1',
        cantidad: '221',
        unidadMedida: '1',
        ano: '2023',
        modelo: 'model21',
        marca: 'marco21',
        serie: '12456781',
        condicionMercancia: '1',
        datosDelMercancia: []
      }
    ];
    
    component.tipoDeMercancia = [
      { id: 1, descripcion: 'muebels1' }
    ];
    component.unidadMedida = [
      { id: 1, descripcion: 'Kilogramos' }
    ];
    component.condicionMercancia = [
      { id: 1, descripcion: 'Nueva' }
    ];

    const mockClick = jest.fn();
    component.closeModal = { nativeElement: { click: mockClick } } as any;

    component.modificarConfirmarModal();

    expect(component.mercanciaBodyData[0]).toMatchObject({
      tipoDeMercancia: '',
      cantidad: '',
      unidadMedida: '',
      ano: '',
      modelo: '',
      marca: '',
      serie: '',
      condicionMercancia: ''
    });

    expect(MockTramite11102Store.setDelMercancia).toHaveBeenCalledWith(component.mercanciaBodyData);
    expect(component.closeModal.nativeElement.click).toHaveBeenCalled();
  });

  it('should not update if item is not found', () => {
    component.mercanciaSeleccionados = [
      { ...component.mercanciaSeleccionados[0], tipoDeMercancia: 'no-match' }
    ];

    component.modificarConfirmarModal();

    expect(MockTramite11102Store.setDelMercancia).not.toHaveBeenCalled();
  });
});
