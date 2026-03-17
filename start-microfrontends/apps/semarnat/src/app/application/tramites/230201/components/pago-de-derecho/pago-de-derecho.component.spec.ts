import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { of } from 'rxjs';
import { PagoDeDerechoComponent } from './pago-de-derecho.component';
import { Tramite230201Query } from '../../estados/tramite230201.query';
import { Tramite230201Store } from '../../estados/tramite230201.store';
import { ValidacionesFormularioService } from '@ng-mf/data-access-user';
import { MediodetransporteService } from '../../services/medio-de-transporte.service';
import { provideHttpClient } from '@angular/common/http';

describe('PagoDeDerechoComponent', () => {
  let component: PagoDeDerechoComponent;
  let fixture: ComponentFixture<PagoDeDerechoComponent>;
  let mockMedioDeTransporteService: any;
  let mockSolicitudQuery: any;
  let mockSolicitudStore: any;
  let mockValidacionesService: any;

  beforeEach(() => {
    mockMedioDeTransporteService = {
      getMedioDeTransporte: jest.fn().mockReturnValue(of({ data: [{ id: 1, descripcion: 'Banco 1' }] })),
    };

    mockSolicitudQuery = {
      selectSolicitud$: of({
        claveDeReferencia: 'REF123',
        cadenaPagoDependencia: 'DEPENDENCIA',
        banco: 'BANCO',
        llaveDePago: 'LLAVE',
        fecPago: '2025-03-20',
        impPago: 1000,
      }),
    };

    mockSolicitudStore = {
      setClaveDeReferencia: jest.fn(),
      setCadenaPagoDependencia: jest.fn(),
      setBanco: jest.fn(),
      setllaveDePago: jest.fn(),
      setFecPago: jest.fn(),
      setImpPago: jest.fn(),
    };

    mockValidacionesService = {
      isValid: jest.fn(() => true),
    };

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule,PagoDeDerechoComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        { provide: MediodetransporteService, useValue: mockMedioDeTransporteService },
        { provide: Tramite230201Query, useValue: mockSolicitudQuery },
        { provide: Tramite230201Store, useValue: mockSolicitudStore },
        { provide: ValidacionesFormularioService, useValue: mockValidacionesService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PagoDeDerechoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch banco data on initialization', () => {
    component.fetchBancoData();
    expect(mockMedioDeTransporteService.getMedioDeTransporte).toHaveBeenCalled();
    expect(component.bancoCatalogo.catalogos).toEqual([{ id: 1, descripcion: 'Banco 1' }]);
  });

  it('should initialize FormSolicitud on ngOnInit', () => {
    component.ngOnInit();

    expect(component.FormSolicitud.get('pagodeDerechos.claveDeReferencia')?.value).toBe('REF123');
    expect(component.FormSolicitud.get('pagodeDerechos.cadenaPagoDependencia')?.value).toBe('DEPENDENCIA');
    expect(component.FormSolicitud.get('pagodeDerechos.banco')?.value).toBe('BANCO');
    expect(component.FormSolicitud.get('pagodeDerechos.llaveDePago')?.value).toBe('LLAVE');
    expect(component.FormSolicitud.get('pagodeDerechos.fecPago')?.value).toBe('2025-03-20');
    expect(component.FormSolicitud.get('pagodeDerechos.impPago')?.value).toBe(1000);
  });

  it('should validate form fields correctly', () => {
    const form = new FormGroup({
      claveDeReferencia: new FormControl(''),
    });

    const result = component.isValid(form, 'claveDeReferencia');
    expect(mockValidacionesService.isValid).toHaveBeenCalledWith(form, 'claveDeReferencia');
    expect(result).toBe(true);
  });

  it('should set values in the store using setValoresStore', () => {
    const form = new FormGroup({
      claveDeReferencia: new FormControl('REF123'),
    });

    component.setValoresStore(form, 'claveDeReferencia', 'setClaveDeReferencia');
    expect(mockSolicitudStore.setClaveDeReferencia).toHaveBeenCalledWith('REF123');
  });

  it('should clean up observables on ngOnDestroy', () => {
    const destroyNotifierNextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const destroyNotifierCompleteSpy = jest.spyOn(component['destroyNotifier$'], 'complete');

    component.ngOnDestroy();

    expect(destroyNotifierNextSpy).toHaveBeenCalled();
    expect(destroyNotifierCompleteSpy).toHaveBeenCalled();
  });

  it('should return pagodeDerechos form group', () => {
    const result = component.pagodeDerechos;
    expect(result).toBe(component.FormSolicitud.get('pagodeDerechos'));
  });
});
