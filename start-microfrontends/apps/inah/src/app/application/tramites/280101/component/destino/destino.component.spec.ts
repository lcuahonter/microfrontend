import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DestinoComponent } from './destino.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Tramite280101Store } from '../../../../estados/tramite/tramite280101.store';
import { Tramite280101Query } from '../../../../estados/queries//tramite280101.query';
import { of } from 'rxjs';

describe('DestinoComponent', () => {
  let component: DestinoComponent;
  let fixture: ComponentFixture<DestinoComponent>;
  let storeMock: any;
  let queryMock: any;

  beforeEach(async () => {
    storeMock = {
      setPais: jest.fn(),
      setCodigoPostal: jest.fn(),
      setEstado: jest.fn(),
      setMunicipioOAlcadia: jest.fn(),
      setLocalidad: jest.fn(),
      setColonia: jest.fn(),
      setNumeroExterior: jest.fn(),
      setNumeroInterior: jest.fn(),
      setCalle: jest.fn(),
    };
    queryMock = {
      selectSolicitud$: of({
        pais: 'MX',
        codigoPostal: '12345',
        estado: 'CDMX',
        municipioOAlcadia: 'Alcaldia',
        localidad: 'Centro',
        colonia: 'Roma',
        numeroExterior: '10',
        numeroInterior: '20',
        calle: 'Insurgentes',
      }),
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule, DestinoComponent],
      providers: [
        FormBuilder,
        { provide: Tramite280101Store, useValue: storeMock },
        { provide: Tramite280101Query, useValue: queryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DestinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize destinoForm with correct values on ngOnInit', () => {
    expect(component.destinoForm).toBeDefined();
    expect(component.destinoForm.get('pais')?.value).toBe('MX');
    expect(component.destinoForm.get('calle')?.value).toBe('Insurgentes');
  });

  it('should disable the form if soloLectura is true', () => {
    component.soloLectura = true;
    component.establecerValoresFormulario();
    expect(component.destinoForm.disabled).toBe(true);
  });

  it('should call the correct store method in setValoresStore', () => {
    const form = component.destinoForm;
    form.patchValue({ pais: 'US' });
    storeMock.setPais = jest.fn();
    component.setValoresStore(form, 'pais', 'setPais');
    expect(storeMock.setPais).toHaveBeenCalledWith('US');
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
