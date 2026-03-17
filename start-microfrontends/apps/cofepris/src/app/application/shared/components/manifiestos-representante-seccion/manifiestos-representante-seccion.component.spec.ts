import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of, Subject } from 'rxjs';

import { ManifiestosRepresentanteSeccionComponent } from './manifiestos-representante-seccion.component';
import { DatosDelSolicituteSeccionQuery } from '../../estados/queries/datos-del-solicitute-seccion.query';
import { DatosDelSolicituteSeccionStateStore } from '../../estados/stores/datos-del-solicitute-seccion.store';
import { MANIFIESTOS_DECLARACION } from '../../constantes/aviso-de-funcionamiento.enum';
import radioJson from 'libs/shared/theme/assets/json/260401/radioSiNo.json';

describe('ManifiestosRepresentanteSeccionComponent', () => {
  let component: ManifiestosRepresentanteSeccionComponent;
  let fixture: ComponentFixture<ManifiestosRepresentanteSeccionComponent>;
  let mockQuery: jest.Mocked<DatosDelSolicituteSeccionQuery>;
  let mockStore: jest.Mocked<DatosDelSolicituteSeccionStateStore>;

  beforeEach(async () => {
    mockQuery = {
      select: jest.fn(),
    } as unknown as jest.Mocked<DatosDelSolicituteSeccionQuery>;

    mockStore = {
      update: jest.fn(),
    } as unknown as jest.Mocked<DatosDelSolicituteSeccionStateStore>;

    await TestBed.configureTestingModule({
     
      imports: [CommonModule, ReactiveFormsModule, FormsModule,ManifiestosRepresentanteSeccionComponent],
      providers: [
        { provide: DatosDelSolicituteSeccionQuery, useValue: mockQuery },
        { provide: DatosDelSolicituteSeccionStateStore, useValue: mockStore },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManifiestosRepresentanteSeccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on ngOnInit', () => {
    const mockState = {
      representanteRfc: '',
      manifests: '',
      informacionConfidencialRadio: '',
      representanteNombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      establecimientoDenominacionRazonSocial: '',
      establecimientoCorreoElectronico: '',
      establecimientoDomicilioCodigoPostal: '',
      establecimientoDomicilioEstado: '',
      establecimientoMunicipioYAlcaldia: '',
      establecimientoDomicilioLocalidad: '',
      establecimientoDomicilioColonia: '',
      establecimientoDomicilioCalle: '',
      establecimientoDomicilioLada: '',
      establecimientoDomicilioTelefono: '',
      rfcDelProfesionalResponsable: '',
      nombreDelProfesionalResponsable: '',
      propietarioData: [],
      establecimientoData: null, // Added missing property
    };
  
    mockQuery.select.mockReturnValue(of(mockState));
    component.ngOnInit();

    expect(component.manifiestosRepresentanteForm).toBeDefined();
    expect(component.manifiestosRepresentanteForm.get('representanteRfc')?.value).toBe('RFC123456');
    expect(component.manifiestosRepresentanteForm.get('manifests')?.value).toBe('Manifest Test');
    expect(component.manifiestosRepresentanteForm.get('informacionConfidencialRadio')?.value).toBe('Yes');
  });

  it('should update the store when form value changes', () => {
    component.ngOnInit();
    component.manifiestosRepresentanteForm.patchValue({
      representanteRfc: 'RFC123456',
      manifests: 'Manifest Test',
      informacionConfidencialRadio: 'Yes',
      representanteNombre: 'John',
      apellidoPaterno: 'Doe',
      apellidoMaterno: 'Smith',
    });

    expect(mockStore.update).toHaveBeenCalledWith({
      representanteRfc: 'RFC123456',
      manifests: 'Manifest Test',
      informacionConfidencialRadio: 'Yes',
      representanteNombre: 'John',
      apellidoPaterno: 'Doe',
      apellidoMaterno: 'Smith',
    });
  });

  it('should set manifiestosText on ngOnInit', () => {
    component.ngOnInit();
    expect(component.manifiestosText).toBe(MANIFIESTOS_DECLARACION.MANIFIESTOS);
  });

  it('should fetch and patch representante data when buscarRepresentanteRfc is called', () => {
    component.manifiestosRepresentanteForm.patchValue({
      representanteRfc: 'RFC123456',
    });

    component.buscarRepresentanteRfc();

    expect(component.manifiestosRepresentanteForm.get('representanteNombre')?.value).toBe('EUROFOODS DE MEXICO');
    expect(component.manifiestosRepresentanteForm.get('apellidoPaterno')?.value).toBe('GONZALEZ');
    expect(component.manifiestosRepresentanteForm.get('apellidoMaterno')?.value).toBe('PINAL');
  });

  it('should not fetch representante data if RFC is empty', () => {
    component.manifiestosRepresentanteForm.patchValue({
      representanteRfc: '',
    });

    component.buscarRepresentanteRfc();

    expect(component.manifiestosRepresentanteForm.get('representanteNombre')?.value).toBe('');
    expect(component.manifiestosRepresentanteForm.get('apellidoPaterno')?.value).toBe('');
    expect(component.manifiestosRepresentanteForm.get('apellidoMaterno')?.value).toBe('');
  });

  it('should clean up subscriptions on ngOnDestroy', () => {
    const destroySpy = jest.spyOn(component['destroy$'], 'next');
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});