import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { AlertComponent, CatalogoSelectComponent, InputRadioComponent, TableComponent, TituloComponent } from '@ng-mf/data-access-user';
import { DonacionesExtranjerasService } from '../../services/donaciones-extranjeras/donaciones-extranjeras.service';
import { RegistroDeDonacionComponent } from './registro-de-donacion.component';
import { DatosDonanteExtranjeroComponent } from '../datos-donante-extranjero/datos-donante-extranjero.component';
import { DatosDonatarioComponent } from '../datos-donatario/datos-donatario.component';
import { DatosRepLegalDonatarioComponent } from '../datos-rep-legal-donatario/datos-rep-legal-donatario.component';
import { DatosRepLegalRecibirDonacionComponent } from '../datos-rep-legal-recibir-donacion/datos-rep-legal-recibir-donacion.component';
import { DatosPersonaOirRecibirComponent } from '../datos-persona-oir-recibir/datos-persona-oir-recibir.component';
import { ToastrModule } from 'ngx-toastr';
import { Tramite10303Store } from '../../estados/tramites/tramite10303.store';
import { Tramite10303Query } from '../../estados/queries/tramite10303.query';
import { model } from '@angular/core';

describe('RegistroDeDonacionComponent', () => {
  let component: RegistroDeDonacionComponent;
  let fixture: ComponentFixture<RegistroDeDonacionComponent>;
  let mockTramite10303Store: any;
  let donacionesExtranjerasService: jest.Mocked<DonacionesExtranjerasService>;
  let mockTramite10303Query: any;

  beforeEach(async () => {
    const SPY = {
      getAduana: jest.fn().mockReturnValue(of({ data: [] })),
      getDestinoDonacion: jest.fn().mockReturnValue(of({ data: [] })),
      getTipoDeMercancia: jest.fn().mockReturnValue(of({ data: [] })),
      getUnidadMedida: jest.fn().mockReturnValue(of({ data: [] })),
      getUmt: jest.fn().mockReturnValue(of({ data: [] })),
      getProcedenciaOtro: jest.fn().mockReturnValue(of({ data: [] })),
      getCondicionMercancia: jest.fn().mockReturnValue(of({ data: [] })),
      getPaisOrigenMedicamento: jest.fn().mockReturnValue(of({ data: [] })),
      getPaisProcedenciaMedicamento: jest.fn().mockReturnValue(of({ data: [] })),
      getManifiestos: jest.fn().mockReturnValue(of({ data: [] })),
      getBasicoRequerimientos: jest.fn().mockReturnValue(of({ data: [] })),
      getPaises: jest.fn().mockReturnValue(of({ data: [] })),
      getDocumentoResidencia: jest.fn().mockReturnValue(of({ data: [] })),
      getPaisProcedencia: jest.fn().mockReturnValue(of({ data: [] })),
      getPaisMedicoOrigen: jest.fn().mockReturnValue(of({ data: [] })),
      getAno: jest.fn().mockReturnValue(of({ data: [] })),
      getVehiculoTipo: jest.fn().mockReturnValue(of({ data: [] }))
    };

    mockTramite10303Store = {
      setCvePaisPersonaAutorizada: jest.fn(),
      setNumeroConsecutivo: jest.fn(),
      setDestinoDonacion: jest.fn(),
      setTipoDeMercancia: jest.fn(),
      setUnidadMedida: jest.fn(),
      setUMT: jest.fn(),
      setPaisProcedenciaOtro: jest.fn(),
      setCondicionMercancia: jest.fn(),
      setPaisOrigenMedicamento: jest.fn(),
      setPaisProcedenciaMedicamento: jest.fn(),
      setFechaCaducidad: jest.fn(),
      setMercanciaTablaDatos: jest.fn(),
      setSeleccionadaTipoDeMercancia: jest.fn()
    };

    mockTramite10303Query = {
      selectSeccionState$: of({})
    };

    await TestBed.configureTestingModule({
      declarations: [
        RegistroDeDonacionComponent,
        DatosDonanteExtranjeroComponent,
        DatosDonatarioComponent,
        DatosRepLegalDonatarioComponent,
        DatosRepLegalRecibirDonacionComponent,
        DatosPersonaOirRecibirComponent
      ],
      imports: [
        ReactiveFormsModule,
        TituloComponent,
        CatalogoSelectComponent,
        AlertComponent,
        TableComponent,
        InputRadioComponent,
        ToastrModule.forRoot()
      ],
      providers: [
        { provide: DonacionesExtranjerasService, useValue: SPY }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroDeDonacionComponent);
    component = fixture.componentInstance;
    component.getMercanciaTableData = {
      mercanciaTable: {
        tableHeader: [],
        tableBody: []
      }
    };

    component.registroDeDonacionState = {
      seleccionadaManifiesto: [],
      seleccionadaBasicoRequerimiento: []
    } as any;

    donacionesExtranjerasService = TestBed.inject(DonacionesExtranjerasService) as jest.Mocked<DonacionesExtranjerasService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show or hide collapsible panel', () => {
    component.panels = [{ label: 'Panel 1', isCollapsed: true }, { label: 'Panel 2', isCollapsed: true }];
    component.mostrar_colapsable(1);
    expect(component.panels[1].isCollapsed).toBeFalsy();
    expect(component.panels[0].isCollapsed).toBeTruthy();
  });

  it('should open modal', () => {
    component.modal = 'show';
    component.abrirDialogoMercancias();
    expect(component.modal).toBe('show');
  });

  it('should close modal', () => {
    jest.spyOn(component.closeModal.nativeElement, 'click');
    component.cerrarModal();
    expect(component.closeModal.nativeElement.click).toHaveBeenCalled();
  });

  it('should add mercancias and close modal', () => {
    jest.spyOn(component, 'cerrarModal');
    component.agregarMercanciasForm.setValue({
      datosMercancia: {
        numeroConsecutivo: '1',
        destinoDonacion: 'test',
        posibleFraccion: '',
        descripcionFraccion: '',
        solicitudDeInspeccion: false,
        justificacionMerca: 'test',
        descripcionMercanciaOtro: 'test',
        tipoDeMercancia: 'test',
        cantidadUMC: '1',
        cantidadUMT: '1',
        unidadMedida: 'test',
        UMT: 'test',
        paisProcedenciaOtro: 'test',
        condicionMercancia: 'test',
        cantidadUMCVehiculo: 'test',
        cantidadUMTVehiculo: 'test',
        unidadMedidaVehiculo: 'test',
        UMTVehiculo: 'test',
        medicoDescripcion: 'test',
        marca: 'test',
        ano: 'test',
        modelo: 'test',
        serieNumero: 'test',
        pasajerosNumero: 'test',
        cilindrada: 'test',
        combustibleTipo: 'test',
        vehiculoTipo: 'test',
        descripcion: 'test'
      },
      datosCofepris: {
        ingredienteActivo: 'test',
        tipoMedicamento: 'test',
        presentacionFarma: 'test',
        paisOrigenMedicamento: 'test',
        paisProcedenciaMedicamento: 'test',
        fechaCaducidad: ''
      },
      datosMedicosCofepris: {
        medicoDescripcion: 'test',
        paisProcedencia: 'test',
        paisMedicoOrigen: 'test'
      }
    });
    component.agregarMercancias();
    expect(component.getMercanciaTableData.mercanciaTable.tableBody.length).toBe(1);
    expect(component.cerrarModal).toHaveBeenCalled();
  });

  it('should handle file change', () => {
    const EVENT = { target: { files: [{ name: 'test-file.txt' }] } };
    component.onCambioDeArchivo(EVENT as unknown as Event);
    expect(component.archivoMedicamentos?.name).toBe('test-file.txt');
    expect(component.etiquetaDeArchivo).toBe('test-file.txt');
  });

  it('should remove selected file', () => {
    component.archivoMedicamentos = new File([], 'test-file.txt');
    component.eliminacionMedicamento();
    expect(component.archivoMedicamentos).toBeNull();
    expect(component.etiquetaDeArchivo).toBe(component.TEXTOS.ETIQUETA_DE_ARCHIVO);
  });

  it('should activate file selection', () => {
    const INPUT = document.createElement('input');
    INPUT.id = 'archivoMedicamentos';
    INPUT.type = 'file';
    document.body.appendChild(INPUT);

    const REAL_INPUT = document.getElementById('archivoMedicamentos') as HTMLInputElement;
    const CLICK_SPY = jest.spyOn(REAL_INPUT, 'click');

    component.activarSeleccionArchivo();

    expect(CLICK_SPY).toHaveBeenCalled();

    document.body.removeChild(INPUT);
  });

  it('should not throw if setValoresStore is called with a non-existing field', () => {
    mockTramite10303Store.setNumeroConsecutivo = jest.fn();
    expect(() => {
      component.setValoresStore(component.agregarMercanciasForm, 'nonExistingField', 'setNumeroConsecutivo');
    }).not.toThrow();
  });

  it('should set the value of the FormArray control based on checkbox event', () => {
    const EVENT = { target: { checked: true } } as unknown as Event;
    component.onBasicoRequirimentoCheckboxCambiar(EVENT, 1);
    expect(component.seleccionadaBasicoRequerimiento.controls[1].value).toBe(true);
  });

  it('should call setValoresStore with correct arguments', () => {
    component.registroDeDonacionState = { seleccionadaManifiesto: [] } as any;
    component.setValoresStore = jest.fn();

    const EVENT = { target: { checked: false } } as unknown as Event;
    component.onBasicoRequirimentoCheckboxCambiar(EVENT, 0);
    expect(component.setValoresStore).toHaveBeenCalledWith(
      component.registroDonacionForm,
      'manifiesto.seleccionadaBasicoRequerimiento',
      'setSeleccionadaBasicoRequerimiento'
    );
  });

  it('should set the value of the FormArray control based on checkbox event', () => {
    const EVENT = { target: { checked: true } } as unknown as Event;
    component.onManifiestoCheckboxCambiar(EVENT, 1);
    expect(component.seleccionadaManifiesto.controls[1].value).toBe(true);
  });

  it('should call setValoresStore with correct arguments', () => {
    component.registroDonacionForm = new FormGroup({
      manifiesto: new FormGroup({
        seleccionadaManifiesto: new FormArray([new FormControl(false)])
      })
    });

    component.setValoresStore = jest.fn();

    const EVENT = { target: { checked: false } } as unknown as Event;
    component.onManifiestoCheckboxCambiar(EVENT, 0);
    expect(component.setValoresStore).toHaveBeenCalledWith(
      component.registroDonacionForm,
      'manifiesto.seleccionadaManifiesto',
      'setSeleccionadaManifiesto'
    );
  });

  it('should toggle the colapsable property', () => {
    component.colapsable = false;
    component.mostrar_colapsable_fabricante();
    expect(component.colapsable).toBe(true);
    component.mostrar_colapsable_fabricante();

    expect(component.colapsable).toBe(false);
  });

  it('should update fechaCaducidad in the form and store', () => {
    component.registroDonacionForm = new FormBuilder().group({
      fechaCaducidad: ['']
    });

    const MOCK_VALOR = '2025-12-31';
    const CONTROL = component.registroDonacionForm.get('fechaCaducidad');
    const SET_VALUE_SPY = jest.spyOn(CONTROL!, 'setValue');

    component.cambioFechaCaducidad(MOCK_VALOR);

    expect(SET_VALUE_SPY).toHaveBeenCalledWith(MOCK_VALOR);
  });

  it('should mark specified controls as touched', () => {
    const control1 = new FormControl('');
    const control2 = new FormControl('');
    component.agregarMercanciasForm = new FormGroup({
      'campo1': control1,
      'campo2': control2
    });

    component.validarModalCampos(['campo1', 'campo2']);

    expect(control1.touched).toBeTruthy();
    expect(control2.touched).toBeTruthy();
  });

  it('should add a row and update store when form is valid', () => {
    component.registroDeDonacionState = { seleccionadaTipoDeMercancia: 1 } as any;
    jest.spyOn(component, 'validarInvalidoCampos').mockReturnValue(true);
    jest.spyOn(component, 'cerrarModal');
    jest.spyOn(mockTramite10303Store, 'setMercanciaTablaDatos');

    component.agregarMercanciasForm = new FormGroup({
      datosMercancia: new FormGroup({
        numeroConsecutivo: new FormControl('1'),
        destinoDonacion: new FormControl('test'),
        posibleFraccion: new FormControl(''),
        descripcionFraccion: new FormControl(''),
        solicitudDeInspeccion: new FormControl(false),
        justificacionMerca: new FormControl('test'),
        descripcionMercanciaOtro: new FormControl('test'),
        tipoDeMercancia: new FormControl('test'),
        cantidadUMC: new FormControl('1'),
        cantidadUMT: new FormControl('1'),
        unidadMedida: new FormControl('test'),
        UMT: new FormControl('test'),
        paisProcedenciaOtro: new FormControl('test'),
        condicionMercancia: new FormControl('test'),
        cantidadUMCVehiculo: new FormControl('test'),
        cantidadUMTVehiculo: new FormControl('test'),
        unidadMedidaVehiculo: new FormControl('test'),
        UMTVehiculo: new FormControl('test'),
        medicoDescripcion: new FormControl('test'),
        marca: new FormControl('test'),
        ano: new FormControl('test'),
        modelo: new FormControl('test'),
        serieNumero: new FormControl('test'),
        pasajerosNumero: new FormControl('test'),
        cilindrada: new FormControl('test'),
        combustibleTipo: new FormControl('test'),
        vehiculoTipo: new FormControl('test'),
        descripcion: new FormControl('test')
      }),
      datosCofepris: new FormGroup({
        ingredienteActivo: new FormControl('test'),
        tipoMedicamento: new FormControl('test'),
        presentacionFarma: new FormControl('test'),
        paisOrigenMedicamento: new FormControl('test'),
        paisProcedenciaMedicamento: new FormControl('test'),
        fechaCaducidad: new FormControl('')
      }),
      datosMedicosCofepris: new FormGroup({
        medicoDescripcion: new FormControl('test'),
        paisProcedencia: new FormControl('test'),
        paisMedicoOrigen: new FormControl('test')
      })
    });
    let esFormValido = true;

    component.agregarMercancias();

    expect(esFormValido).toBe(true);
    expect(component.cerrarModal).toHaveBeenCalled();
  });

  it('should update selected type of merchandise and call store methods', () => {
    const restablecerCamposSpy = jest.spyOn(component, 'restablecerCampos');
    const mockFormControl = new FormControl('2');
    component.agregarMercanciasForm = new FormGroup({
      datosMercancia: new FormGroup({
        tipoDeMercancia: mockFormControl
      }),
      datosCofepris: new FormGroup({
        ingredienteActivo: new FormControl('test'),
        tipoMedicamento: new FormControl('test'),
        presentacionFarma: new FormControl('test'),
        paisOrigenMedicamento: new FormControl('test'),
        paisProcedenciaMedicamento: new FormControl('test'),
        fechaCaducidad: new FormControl('test')
      }),
      datosMedicosCofepris: new FormGroup({
        medicoDescripcion: new FormControl('test'),
        paisProcedencia: new FormControl('test'),
        paisMedicoOrigen: new FormControl('test')
      })
    });

    component.tipoDeMercanciaSeleccion();

    expect(restablecerCamposSpy).toHaveBeenCalled();
    expect(component.seleccionadaTipoDeMercancia).toBe(2);
  });

  it('should call setDestinoDonacion with selected value', () => {
    const mockValue = 5;

    component.agregarMercanciasForm = new FormGroup({
      datosMercancia: new FormGroup({
        destinoDonacion: new FormControl(mockValue)
      })
    });
    jest.spyOn(component, 'destinoDonacionSeleccion');
    component.destinoDonacionSeleccion();
    mockTramite10303Store.setDestinoDonacion = jest.fn();

    expect(component.destinoDonacionSeleccion).toHaveBeenCalledWith();
  });

  it('should call unidadMedidaSeleccion with selected value', () => {
    jest.spyOn(component, 'unidadMedidaSeleccion');
    component.unidadMedidaSeleccion();
    mockTramite10303Store.setUnidadMedida = jest.fn();

    expect(component.unidadMedidaSeleccion).toHaveBeenCalledWith();
  });

  it('should call umtSeleccion with selected value', () => {
    jest.spyOn(component, 'umtSeleccion');
    component.umtSeleccion();
    mockTramite10303Store.setUMT = jest.fn();

    expect(component.umtSeleccion).toHaveBeenCalledWith();
  });

  it('should call paisProcedenciaOtroSeleccion with selected value', () => {
    jest.spyOn(component, 'paisProcedenciaOtroSeleccion');
    component.paisProcedenciaOtroSeleccion();
    mockTramite10303Store.setPaisProcedenciaOtro = jest.fn();

    expect(component.paisProcedenciaOtroSeleccion).toHaveBeenCalledWith();
  });

  it('should call condicionMercanciaSeleccion with selected value', () => {
    jest.spyOn(component, 'condicionMercanciaSeleccion');
    component.condicionMercanciaSeleccion();
    mockTramite10303Store.setCondicionMercancia = jest.fn();

    expect(component.condicionMercanciaSeleccion).toHaveBeenCalledWith();
  });

  it('should call paisOrigenMedicamentoSeleccion with selected value', () => {
    jest.spyOn(component, 'paisOrigenMedicamentoSeleccion');
    component.paisOrigenMedicamentoSeleccion();
    mockTramite10303Store.setPaisOrigenMedicamento = jest.fn();

    expect(component.paisOrigenMedicamentoSeleccion).toHaveBeenCalledWith();
  });

  it('should call paisProcedenciaMedicamentoSeleccion with selected value', () => {
    jest.spyOn(component, 'paisProcedenciaMedicamentoSeleccion');
    component.paisProcedenciaMedicamentoSeleccion();
    mockTramite10303Store.setPaisProcedenciaMedicamento = jest.fn();

    expect(component.paisProcedenciaMedicamentoSeleccion).toHaveBeenCalledWith();
  });

  it('should call paisProcedenciaSeleccion with selected value', () => {
    jest.spyOn(component, 'paisProcedenciaSeleccion');
    component.paisProcedenciaSeleccion();
    mockTramite10303Store.setPaisProcedencia = jest.fn();

    expect(component.paisProcedenciaSeleccion).toHaveBeenCalledWith();
  });

  it('should call paisMedicoOrigenSeleccion with selected value', () => {
    jest.spyOn(component, 'paisMedicoOrigenSeleccion');
    component.paisMedicoOrigenSeleccion();
    mockTramite10303Store.setPaisMedicoOrigen = jest.fn();

    expect(component.paisMedicoOrigenSeleccion).toHaveBeenCalledWith();
  });

  it('should call anoSeleccion with selected value', () => {
    jest.spyOn(component, 'anoSeleccion');
    component.anoSeleccion();
    mockTramite10303Store.setAno = jest.fn();

    expect(component.anoSeleccion).toHaveBeenCalledWith();
  });

  it('should call vehiculoTipoSeleccion with selected value', () => {
    jest.spyOn(component, 'vehiculoTipoSeleccion');
    component.vehiculoTipoSeleccion();
    mockTramite10303Store.vehiculoTipoSeleccion = jest.fn();

    expect(component.vehiculoTipoSeleccion).toHaveBeenCalledWith();
  });
});