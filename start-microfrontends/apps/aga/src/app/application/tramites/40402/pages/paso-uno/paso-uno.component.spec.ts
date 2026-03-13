import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { of as observableOf } from 'rxjs';

import { PasoUnoComponent } from './paso-uno.component';
import { DatosTramiteService } from '../../services/datos-tramite.service';
import { TransportacionMaritimaService } from '../../services/transportacion-maritima/transportacion-maritima.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Tramite40402Store } from '../../estados/tramite40402.store';

@Injectable()
class MockDatosTramiteService {
  validarFormulario = jest.fn().mockReturnValue(true);
}

@Injectable()
class MockTransportacionMaritimaService {
  getDatosConsulta = jest.fn().mockReturnValue(observableOf({ success: true, datos: {} }));
}

@Injectable()
class MockTramite40402Store {
  setSeguroNumero = jest.fn();
  setNombrePFE = jest.fn();
  setApellidoPaternoPFE = jest.fn();
  setApellidoMaternoPFE = jest.fn();
  setCorreoPFE = jest.fn();
  setPaisPFE = jest.fn();
  setCodigoPostalPFE = jest.fn();
  setCiudadPFE = jest.fn();
  setEstadoPFE = jest.fn();
  setCallePFE = jest.fn();
  setNumeroExteriorPFE = jest.fn();
  setNumeroInteriorPFE = jest.fn();
  setPersonaFisicaExtranjeraTabla = jest.fn();
  setPersonaMoralExtranjeraTabla = jest.fn();
  setDenominacionPME = jest.fn();
  setCorreoPME = jest.fn();
  setPaisPME = jest.fn();
  setCodigoPostalPME = jest.fn();
  setCiudadPME = jest.fn();
  setEstadoPME = jest.fn();
  setCallePME = jest.fn();
  setNumeroExteriorPME = jest.fn();
  setNumeroInteriorPME = jest.fn();
  setNombreDG = jest.fn();
  setApellidoPaternoDG = jest.fn();
  setApellidoMaternoDG = jest.fn();
  setTipoDeCaatAerea = jest.fn();
  setIdeCodTransportacionAerea = jest.fn();
  setCodIataIcao = jest.fn();
}

@Directive({ selector: '[myCustom]' })
class MyCustomDirective {
  @Input() myCustom: any;
}

@Pipe({ name: 'translate' })
class TranslatePipe implements PipeTransform {
  transform(value: any) { return value; }
}

@Pipe({ name: 'phoneNumber' })
class PhoneNumberPipe implements PipeTransform {
  transform(value: any) { return value; }
}

@Pipe({ name: 'safeHtml' })
class SafeHtmlPipe implements PipeTransform {
  transform(value: any) { return value; }
}

describe('PasoUnoComponent', () => {
  let fixture: ComponentFixture<PasoUnoComponent>;
  let component: PasoUnoComponent;
  let datosTramiteService: MockDatosTramiteService;
  let service: MockTransportacionMaritimaService;
  let store: MockTramite40402Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [
        PasoUnoComponent,
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: DatosTramiteService, useClass: MockDatosTramiteService },
        { provide: TransportacionMaritimaService, useClass: MockTransportacionMaritimaService },
        ConsultaioQuery,
        { provide: Tramite40402Store, useClass: MockTramite40402Store }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    datosTramiteService = TestBed.inject(DatosTramiteService) as any;
    service = TestBed.inject(TransportacionMaritimaService) as any;
    store = TestBed.inject(Tramite40402Store) as any;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería ejecutar continuar()', () => {
    datosTramiteService.validarFormulario = jest.fn().mockReturnValue(true);
    component.continuar();
    expect(datosTramiteService.validarFormulario).toHaveBeenCalled();
    expect(component.mostrarErrorDatosTramite).toBe(false);
  });

  it('debería ejecutar validarFormulariosPasoUno()', () => {
    datosTramiteService.validarFormulario = jest.fn().mockReturnValue(true);
    expect(component.validarFormulariosPasoUno()).toBe(true);
  });

  it('debería ejecutar validarFormularios()', () => {
    datosTramiteService.validarFormulario = jest.fn().mockReturnValue(false);
    expect(component.validarFormularios()).toBe(false);
  });

  it('debería ejecutar validarFormGroup()', () => {
    const fg = new FormGroup({
      test: new FormControl('', Validators.required),
    });
    expect(PasoUnoComponent['validarFormGroup'](fg)).toBe(false);
    fg.get('test')?.setValue('value');
    expect(PasoUnoComponent['validarFormGroup'](fg)).toBe(true);
    expect(PasoUnoComponent['validarFormGroup'](undefined)).toBe(true);
  });

  it('debería ejecutar validarCompForm()', () => {
    const comp: any = {
      form: new FormGroup({ test: new FormControl('', Validators.required) }),
      showError: jest.fn(),
    };
    expect(PasoUnoComponent['validarCompForm'](comp, 'form', 'showError')).toBe(false);
    comp.form.get('test')?.setValue('value');
    expect(PasoUnoComponent['validarCompForm'](comp, 'form', 'showError')).toBe(true);
    expect(PasoUnoComponent['validarCompForm']({}, 'form', 'showError')).toBe(true);
  });

  it('debería ejecutar validarTodosLosFormularios()', () => {
    component.DatosTramite = { formulario: new FormGroup({ test: new FormControl('value') }) } as any;
    component.Solicitante = { solicitudForm: new FormGroup({ test: new FormControl('value') }) } as any;
    component.AsignarPersona = { formulario: new FormGroup({ test: new FormControl('value') }) } as any;

    const result = component.validarTodosLosFormularios();
    expect(result.formularioUnoValido).toBe(true);
    expect(result.formularioDosValido).toBe(true);
  });

  it('debería ejecutar ngOnInit con actualización', () => {
    component.consultaioQuery = { selectConsultaioState$: observableOf({ update: true }) } as any;
    component.fetchGetDatosConsulta = jest.fn();
    component.ngOnInit();
    expect(component.fetchGetDatosConsulta).toHaveBeenCalled();
  });

  it('debería ejecutar ngOnInit sin actualización', () => {
    component.consultaioQuery = { selectConsultaioState$: observableOf({}) } as any;
    component.ngOnInit();
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('debería ejecutar ngAfterViewInit()', () => {
    component.ngAfterViewInit();
    expect(component.persona).toBeDefined();
    expect(component.domicilioFiscal).toBeDefined();
  });

  it('debería ejecutar seleccionaTab()', () => {
    component.seleccionaTab(5);
    expect(component.indice).toBe(5);
  });

  it('debería ejecutar fetchGetDatosConsulta()', () => {
    service.getDatosConsulta = jest.fn().mockReturnValue(observableOf({ success: true, datos: {} }));
    component.fetchGetDatosConsulta();
    expect(service.getDatosConsulta).toHaveBeenCalled();
    expect(store.setSeguroNumero).toHaveBeenCalled();
  });

  it('debería ejecutar ngOnDestroy()', () => {
    const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
