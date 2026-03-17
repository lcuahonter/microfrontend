
jest.mock('@libs/shared/theme/assets/json/221602/realizar.json', () => ({
  __esModule: true,
  default: {
    regimen: [
      { id: 1, descripcion: 'Temporal' },
      { id: 2, descripcion: 'Definitivo' }
    ],
    veterinario: [
      { id: 1, descripcion: 'Vet A' },
      { id: 2, descripcion: 'Vet B' }
    ],
    establecimiento: [
      { id: 1, descripcion: 'Est A' },
      { id: 2, descripcion: 'Est B' }
    ],
    mercancias: [
      { nombre: 'Producto A', cantidad: 10 },
      { nombre: 'Producto B', cantidad: 5 }
    ],
    formData: {
      aduana: 'QUERETARO, QRO.',
      oficina: 'Querétaro',
      punto: 'Querétaro Oficina de Inspección',
      capturaMercancia: 'Sí'
    }
  }
}), { virtual: true });
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { DatosDeLaSolicitudComponent } from './datos-de-la-solicitud.component';
import { Tramite221602Store } from '../../../../estados/tramites/tramite221602.store';
import { Tramite221602Query } from '../../../../estados/queries/tramite221602.query';
import { createInitialState, Solicitud221602State } from '../../../../estados/tramites/tramite221602.store';

describe('DatosDeLaSolicitudComponent', () => {
  let component: DatosDeLaSolicitudComponent;
  let fixture: ComponentFixture<DatosDeLaSolicitudComponent>;
  let tramite221602Store: Tramite221602Store;
  let tramite221602Query: Tramite221602Query;

  const mockSolicitudState: Solicitud221602State = createInitialState();

  const tramite221602StoreMock = {
    setJustificacion: jest.fn(),
    setAduana: jest.fn(),
    setOficina: jest.fn(),
    setPunto: jest.fn(),
    setGuia: jest.fn(),
    setRegimen: jest.fn(),
    setCarro: jest.fn(),
  };

  const tramite221602QueryMock = {
    selectSolicitud$: of(mockSolicitudState),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [ReactiveFormsModule, FormsModule,DatosDeLaSolicitudComponent],
      providers: [
        FormBuilder,
        { provide: Tramite221602Store, useValue: tramite221602StoreMock },
        { provide: Tramite221602Query, useValue: tramite221602QueryMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosDeLaSolicitudComponent);
    component = fixture.componentInstance;
    tramite221602Store = TestBed.inject(Tramite221602Store);
    tramite221602Query = TestBed.inject(Tramite221602Query);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with values from the store', () => {
    // Test initial form state based on the store
    expect(component.TramitesForm.controls['justificacion'].value).toBe('');
    expect(component.TramitesForm.controls['aduana'].value).toBe('QUERETARO, QRO.');
    expect(component.TramitesForm.controls['oficina'].value).toBe('Querétaro');
    expect(component.TramitesForm.controls['punto'].value).toBe('Querétaro Oficina de Inspección');
    expect(component.TramitesForm.controls['guia'].value).toBe('');
    expect(component.TramitesForm.controls['regimen'].value).toBe('');
    expect(component.TramitesForm.controls['carro'].value).toBe('');
  });

  it('should call the store method setJustificacion when updating the form', () => {
    // Update form and check if store method is called
    component.TramitesForm.controls['justificacion'].setValue('Updated Justification');
    component.setValoresStore(component.TramitesForm, 'justificacion', 'setJustificacion');
    expect(tramite221602Store.setJustificacion).toHaveBeenCalledWith('Updated Justification');
  });

  it('should call the store method setAduana when updating the form', () => {
    component.TramitesForm.controls['aduana'].setValue('Updated Aduana');
    component.setValoresStore(component.TramitesForm, 'aduana', 'setAduana');
    expect(tramite221602Store.setAduana).toHaveBeenCalledWith('Updated Aduana');
  });

  it('should initialize the store state correctly on ngOnInit', () => {
    component.ngOnInit();
    // Check if the store state is passed correctly to the form
    expect(component.TramitesForm.controls['justificacion'].value).toBe(mockSolicitudState.justificacion);
    expect(component.TramitesForm.controls['aduana'].value).toBe("QUERETARO, QRO.");
  });

  it('should call ngOnDestroy and cleanup resources correctly', () => {
    const destroyNotifierSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    component.ngOnDestroy();
    expect(destroyNotifierSpy).toHaveBeenCalled();
  });
});
