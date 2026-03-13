import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { PagoDeDerechosComponent } from './pago-de-derechos.component';
import { RevisionService } from '../../services/revision.service';
import { Solicitud220501Store } from '../../estados/tramites220501.store';
import { Solicitud220501Query } from '../../estados/tramites220501.query';

describe('PagoDeDerechosComponent', () => {
  let component: PagoDeDerechosComponent;
  let fixture: ComponentFixture<PagoDeDerechosComponent>;
  let mockRevisionService: jest.Mocked<RevisionService>;
  let mockSolicitudStore: jest.Mocked<Solicitud220501Store>;
  let mockSolicitudQuery: jest.Mocked<Solicitud220501Query>;

  beforeEach(async () => {
    mockRevisionService = {
      getJustificacion: jest.fn().mockReturnValue(of({ code: 200, data: [{ id: 1, descripcion: 'Justificación 1' }] })),
      getBanco: jest.fn().mockReturnValue(of({ code: 200, data: [{ id: 1, descripcion: 'Banco 1' }] })),
      getPagoDeDerechos: jest.fn().mockReturnValue(of({
        justificacion: 'Justificación 1',
        claveReferencia: '12345',
        cadenaDependencia: 'Dependencia 1',
        banco: 1,
        llavePago: 'Llave 1',
        importePago: '1000',
        fetchapago: '2025-04-22',
      })),
    } as unknown as jest.Mocked<RevisionService>;

    mockSolicitudStore = {
      setJustificacion: jest.fn(),
      setClaveReferencia: jest.fn(),
      setCadenaDependencia: jest.fn(),
      setBanco: jest.fn(),
      setIlavePago: jest.fn(),
      setImportePago: jest.fn(),
      setFetchaPago: jest.fn(),
      setExentoPagoNo: jest.fn(),
    } as unknown as jest.Mocked<Solicitud220501Store>;

    mockSolicitudQuery = {
      selectSolicitud$: of({
        justificacion: 'Justificación 1',
        claveReferencia: '12345',
        cadenaDependencia: 'Dependencia 1',
        banco: 1,
        llavePago: 'Llave 1',
        importePago: '1000',
        fetchapago: '2025-04-22',
      }),
    } as jest.Mocked<Solicitud220501Query>;

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [ReactiveFormsModule,PagoDeDerechosComponent],
      providers: [
        FormBuilder,
        { provide: RevisionService, useValue: mockRevisionService },
        { provide: Solicitud220501Store, useValue: mockSolicitudStore },
        { provide: Solicitud220501Query, useValue: mockSolicitudQuery },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PagoDeDerechosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on ngOnInit', () => {
    component.inicializarFormulario();
    expect(component.pagoForm.get('banco')).toBeTruthy();
    expect(component.pagoForm.get('justificacion')).toBeTruthy();
    expect(mockRevisionService.getJustificacion).toHaveBeenCalled();
    expect(mockRevisionService.getBanco).toHaveBeenCalled();
    expect(mockRevisionService.getPagoDeDerechos).toHaveBeenCalled();
  });

  it('should get justificación and update the catalog', () => {
    component.getJustificacion();
    expect(mockRevisionService.getJustificacion).toHaveBeenCalled();
    expect(component.justificacion.catalogos).toEqual([{ id: 1, descripcion: 'Justificación 1' }]);
  });

  it('should get banco and update the catalog', () => {
    component.getBanco();
    expect(mockRevisionService.getBanco).toHaveBeenCalled();
    expect(component.banco.catalogos).toEqual([{ id: 1, descripcion: 'Banco 1' }]);
  });

  it('should get pago de derechos and update the store', () => {
    component.getPagoDeDerechos();
    expect(mockRevisionService.getPagoDeDerechos).toHaveBeenCalled();
    expect(mockSolicitudStore.setJustificacion).toHaveBeenCalledWith('Justificación 1');
    expect(mockSolicitudStore.setClaveReferencia).toHaveBeenCalledWith('12345');
    expect(mockSolicitudStore.setCadenaDependencia).toHaveBeenCalledWith('Dependencia 1');
    expect(mockSolicitudStore.setBanco).toHaveBeenCalledWith(1);
    expect(mockSolicitudStore.setIlavePago).toHaveBeenCalledWith('Llave 1');
    expect(mockSolicitudStore.setImportePago).toHaveBeenCalledWith('1000');
    expect(mockSolicitudStore.setFetchaPago).toHaveBeenCalledWith('2025-04-22');
  });

  it('should set clave referencia', () => {
    const event = { target: { value: 'Clave 123' } } as any;
    component.setClaveReferencia(event);
    expect(mockSolicitudStore.setClaveReferencia).toHaveBeenCalledWith('Clave 123');
  });

  it('should set cadena dependencia', () => {
    const event = { target: { value: 'Dependencia 123' } } as any;
    component.setCadenaDependencia(event);
    expect(mockSolicitudStore.setCadenaDependencia).toHaveBeenCalledWith('Dependencia 123');
  });

  it('should set exento pago no', () => {
    component.setExentoPagoNo('Exento 123');
    expect(mockSolicitudStore.setExentoPagoNo).toHaveBeenCalledWith('Exento 123');
  });

  it('should set llave de pago', () => {
    const event = { target: { value: 'Llave 123' } } as any;
    component.setIlavePago(event);
    expect(mockSolicitudStore.setIlavePago).toHaveBeenCalledWith('Llave 123');
  });

  it('should set fecha de pago', () => {
    const event = { target: { value: '2025-04-22' } } as any;
    component.setFetchaPago(event);
    expect(mockSolicitudStore.setFetchaPago).toHaveBeenCalledWith('2025-04-22');
  });

  it('should set importe de pago', () => {
    const event = { target: { value: '1000' } } as any;
    component.setImportePago(event);
    expect(mockSolicitudStore.setImportePago).toHaveBeenCalledWith('1000');
  });

  it('should select justificación catalogo', () => {
    const catalogo = { id: 1 } as any;
    component.selectJustificacionCatalogo(catalogo);
    expect(mockSolicitudStore.setJustificacion).toHaveBeenCalledWith(1);
  });

  it('should select banco catalogo', () => {
    const catalogo = { id: 1 } as any;
    component.selectBancoCatalogo(catalogo);
    expect(mockSolicitudStore.setBanco).toHaveBeenCalledWith(1);
  });

  it('should unsubscribe on ngOnDestroy', () => {
    const destroyedSpy = jest.spyOn(component['destroyed$'], 'next');
    const completeSpy = jest.spyOn(component['destroyed$'], 'complete');

    component.ngOnDestroy();

    expect(destroyedSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});