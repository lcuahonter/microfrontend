import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, FormsModule } from '@angular/forms';
import { PagoDeDerechoComponent } from './pago-de-derecho.component';
import { MediodetransporteService } from '../../services/medio-de-transporte.service';
import { Solicitud220402Store } from '../../estados/tramites/tramites220402.store';
import { Solicitud220402Query } from '../../estados/queries/tramites220402.query';
import { of } from 'rxjs';
import { CatalogoSelectComponent, InputRadioComponent, TituloComponent, ValidacionesFormularioService, Catalogo } from '@ng-mf/data-access-user';

describe('PagoDeDerechoComponent', () => {
  let component: PagoDeDerechoComponent;
  let fixture: ComponentFixture<PagoDeDerechoComponent>;
  let mediodetransporteServiceMock: any;
  let solicitud220402StoreMock: any;
  let solicitud220402QueryMock: any;
  let validacionesServiceMock: any;

  beforeEach(async () => {
    mediodetransporteServiceMock = {
      getMedioDeTransporte: jest.fn().mockReturnValue(of([{ id: 1, descripcion: 'Banco 1' }])),
    };

    solicitud220402StoreMock = {
      setExentoDePago: jest.fn(),
      setJustificacion: jest.fn(),
      setClaveDeReferencia: jest.fn(),
      setCadenaDependencia: jest.fn(),
      setBanco: jest.fn(),
      setllaveDePago: jest.fn(),
      setFechaPago: jest.fn(),
      setImportePago: jest.fn(),
    };

    solicitud220402QueryMock = {
      selectSolicitud$: of({
        exentoDePago: 'No',
        nombreImportExport: 'Importador',
        justificacion: 'Justificación',
        claveDeReferencia: '12345',
        cadenaDependencia: 'Dependencia',
        banco: 'Banco 1',
        llaveDePago: 'Llave123',
        fechaPago: '2023-01-01',
        importePago: '1000',
      }),
    };

    validacionesServiceMock = {
      isValid: jest.fn().mockReturnValue(false),
    };

    await TestBed.configureTestingModule({
      declarations: [PagoDeDerechoComponent],
      imports: [ReactiveFormsModule, FormsModule, TituloComponent, CatalogoSelectComponent, InputRadioComponent],
      providers: [
        FormBuilder,
        { provide: MediodetransporteService, useValue: mediodetransporteServiceMock },
        { provide: Solicitud220402Store, useValue: solicitud220402StoreMock },
        { provide: Solicitud220402Query, useValue: solicitud220402QueryMock },
        { provide: ValidacionesFormularioService, useValue: validacionesServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PagoDeDerechoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on ngOnInit', () => {
    component.ngOnInit();
    expect(component.FormSolicitud).toBeDefined();
    expect(component.FormSolicitud.get('datosImportadorExportador')).toBeDefined();
  });

  it('should fetch bank data on fetchBancoData', () => {
    component.fetchBancoData();
    expect(mediodetransporteServiceMock.getMedioDeTransporte).toHaveBeenCalled();
    expect(component.bancoCatalogo.catalogos.length).toBe(1);
    expect(component.bancoCatalogo.catalogos[0].descripcion).toBe('Banco 1');
  });

  it('should update form fields based on exentoDePago value', () => {
    component.FormSolicitud.get('datosImportadorExportador.exentoDePago')?.setValue('No');
    component.actualizarCamposDeFormularioBasadosEnExentoDePago();
    expect(component.FormSolicitud.get('datosImportadorExportador.claveDeReferencia')?.disabled).toBe(true);
    expect(component.FormSolicitud.get('datosImportadorExportador.justificacion')?.disabled).toBe(true);
  });

  it('should validate the form field using isValid method', () => {
    const isValid = component.isValid(component.FormSolicitud, 'datosImportadorExportador.justificacion');
    expect(validacionesServiceMock.isValid).toHaveBeenCalled();
    expect(isValid).toBe(false);
  });

  it('should call setValoresStore when updating a field', () => {
    const form = component.FormSolicitud;
    component.setValoresStore(form, 'datosImportadorExportador.justificacion', 'setJustificacion');
    expect(solicitud220402StoreMock.setJustificacion).toHaveBeenCalled();
  });
  
  it('should disable the form when soloLectura is true', () => {
    component.soloLectura = true;
    component.inicializarEstadoFormulario();
    expect(component.FormSolicitud.disabled).toBe(true);
  });

  it('should enable the form and update fields when soloLectura is false', () => {
    component.soloLectura = false;
    component.inicializarEstadoFormulario();
    expect(component.FormSolicitud.enabled).toBe(true);
    expect(component.FormSolicitud.get('datosImportadorExportador.justificacion')?.disabled).toBe(true);
  });

  it('should call actualizarCamposDeFormularioBasadosEnExentoDePago when exentoDePagoChange is called', () => {
    const spy = jest.spyOn(component, 'actualizarCamposDeFormularioBasadosEnExentoDePago');
    component.exentoDePagoChange();
    expect(spy).toHaveBeenCalled();
  });

  it('should update bancoSeleccionado when actualizarBanco is called', () => {
    const mockBanco: Catalogo = { id: 1, descripcion: 'Banco 1' };
    component.actualizarBanco(mockBanco);
    expect(component.bancoSeleccionado).toEqual(mockBanco);
  });

  it('should update form fields based on exentoDePago value', () => {
    component.FormSolicitud.get('datosImportadorExportador.exentoDePago')?.setValue('No');
    component.actualizarCamposDeFormularioBasadosEnExentoDePago();
    expect(component.FormSolicitud.get('datosImportadorExportador.claveDeReferencia')?.disabled).toBe(true);
    expect(component.FormSolicitud.get('datosImportadorExportador.importePago')?.disabled).toBe(true);

    component.FormSolicitud.get('datosImportadorExportador.exentoDePago')?.setValue('Yes');
    component.actualizarCamposDeFormularioBasadosEnExentoDePago();
    expect(component.FormSolicitud.get('datosImportadorExportador.justificacion')?.enabled).toBe(true);
  });

  it('should validate that the date is not in the future using fechaLimValidator', () => {
    const control = { value: '2099-12-31' } as any;
    const result = PagoDeDerechoComponent.fechaLimValidator()(control);
    expect(result).toEqual({ fechaLim: true });

    control.value = '2023-01-01';
    const validResult = PagoDeDerechoComponent.fechaLimValidator()(control);
    expect(validResult).toBeNull();
  });
});