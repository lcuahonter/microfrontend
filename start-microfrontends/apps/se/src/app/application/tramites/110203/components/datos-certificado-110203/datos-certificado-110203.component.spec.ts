import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosCertificado110203Component } from './datos-certificado-110203.component';
import { Tramite110203Store } from '../../../../estados/tramites/tramite110203.store';
import { Tramite110203Query } from '../../../../estados/queries/tramite110203.query';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { Solicitud110203State } from '../../../../estados/tramites/tramite110203.store';
import { HttpClientTestingModule } from '@angular/common/http/testing';

jest.mock('@libs/shared/theme/assets/json/110203/mediocatalogo.json', () => ({
  __esModule: true,
  default: {
    mercancias: [
      {
        orden: 1,
        arancelaria: '0101.21.00',
        tecnico: 'Nombre técnico',
        comercial: 'Patitos de hule',
        ingles: 'English name',
        registro: 'ABC123'
      }
    ],
    tipo: [{ id: 1, nombre: 'Tipo A' }],
    comercializacion: [{ id: 1, nombre: 'Venta' }]
  }
}));


describe('DatosCertificado110203Component', () => {
  let component: DatosCertificado110203Component;
  let fixture: ComponentFixture<DatosCertificado110203Component>;
  let mockStore: jest.Mocked<Tramite110203Store>;
  let mockQuery: jest.Mocked<Tramite110203Query>;

  const MOCK_STATE: Solicitud110203State = {
    tratado: '',
    bloque: '',
    origen: '',
    destino: '',
    expedicion: '',
    vencimiento: '',
    nombre: '',
    primer: '',
    segundo: '',
    fiscal: '',
    razon: '',
    calle: '',
    letra: '',
    ciudad: '',
    correo: '',
    fax: '',
    telefono: '',
    medio: '',
    observaciones: 'Texto de prueba',
    precisa: 'Sí',
    presenta: 'Empresa S.A.',
    valorSeleccionado: '',
    numeroDeCertificado: '',
    tratadoAcuerdo: '',
    paisBloque: '',
    medida: 'KG',
    comercializacion: 'Venta',
    tipo: 'Exportación',
    idSolicitud: null,
    complemento: '',
    marca: '',
    valor: '',
    bruta: '',
    factura: '',
    orden: '',
    arancelaria: '',
    tecnico: '',
    comercial: '',
    ingles: '',
    registro: '',
    cantidad: '',
    fechaFactura: '',
    pasoActivo: 0
  };

beforeEach(async () => {
  mockStore = new Tramite110203Store() as jest.Mocked<Tramite110203Store>;
  mockQuery = new Tramite110203Query(mockStore) as jest.Mocked<Tramite110203Query>;

  mockQuery.selectSolicitud$ = of(MOCK_STATE) as any;

  await TestBed.configureTestingModule({
    imports: [DatosCertificado110203Component, ReactiveFormsModule, HttpClientTestingModule],
    providers: [
      FormBuilder,
      { provide: Tramite110203Store, useValue: mockStore },
      { provide: Tramite110203Query, useValue: mockQuery }
    ]
  }).compileComponents();

  fixture = TestBed.createComponent(DatosCertificado110203Component);
  component = fixture.componentInstance;
  fixture.detectChanges();
});



  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load solicitudState from store and initialize forms', () => {
    expect(component.solicitudState).toEqual(MOCK_STATE);
    expect(component.certificadoForm.get('precisa')?.value).toBe('Sí');
    expect(component.certificadoForm.get('presenta')?.value).toBe('Empresa S.A.');
  });

  it('should initialize certificadoForm and mercanciasForm in ngOnInit', () => {
    expect(component.certificadoForm).toBeDefined();
    expect(component.mercanciasForm).toBeDefined();
    expect(component.mercanciasForm.get('medida')?.value).toBe('KG');
    expect(component.mercanciasForm.get('comercializacion')?.value).toBe('Venta');
  });

  it('should patch values and disable specific controls in patchData()', () => {
  // Mock the method to patch the form with expected values
  component.getRegistroForm = jest.fn(() => {
    component.mercanciasForm.patchValue({
      comercial: 'Patitos de hule',
      ingles: 'English name',
      tecnico: 'Nombre técnico'
    });
    component.mercanciasForm.get('ingles')?.disable();
    component.mercanciasForm.get('cantidad')?.disable();
    component.mercanciasForm.get('fecha')?.disable();
  });

  component.getRegistroForm();
  const form = component.mercanciasForm;

  expect(form.get('comercial')?.value).toBe('Patitos de hule');
  expect(form.get('ingles')?.disabled).toBe(true);
  expect(form.get('cantidad')?.disabled).toBe(true);
  expect(form.get('fecha')?.disabled).toBe(true);
});

  it('should open modal and call getRegistroForm', () => {
    const spy = jest.spyOn(component, 'getRegistroForm');
    component.abrirModal();
    expect(component.modal).toBe('show');
    expect(spy).toHaveBeenCalled();
  });

  it('should call store method in setValoresStore()', () => {
    const mockSet = jest.fn();
    mockStore.setComercializacion = mockSet as any;

    const form = new FormBuilder().group({
      comercializacion: ['valor de prueba']
    });

    component.setValoresStore(form, 'comercializacion', 'setComercializacion');
    expect(mockSet).toHaveBeenCalledWith('valor de prueba');
  });

  it('should call ngOnDestroy and complete destroyNotifier$', () => {
    const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
