import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TipoDeAvisoComponent } from './tipoDeAviso.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { AvisoUnicoService } from '../../services/aviso-unico.service';
import { UnicoStore } from '../../estados/renovacion.store';
import { UnicoQuery } from '../../estados/queries/unico.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

const mockStoreState = {
  modalidadCertificacion: 'TEST',
  foreignClientsSuppliers: true,
  nationalSuppliers: true,
  modificationsMembers: true,
  changesToLegalDocuments: true,
  mergerOrSplitNotice: true,
  additionFractions: true,
  additionmodificación: true,
  additionPresentación: true,
  acepto253: true,
};

describe('TipoDeAvisoComponent', () => {
  let component: TipoDeAvisoComponent;
  let fixture: ComponentFixture<TipoDeAvisoComponent>;

  const destroy$ = new Subject<void>();

  const mockUnicoQuery = {
    selectSolicitud$: of(mockStoreState),
  };

  const mockConsultaioQuery = {
    selectConsultaioState$: of({ readonly: true }),
  };

  const mockAvisoUnicoService = {
    getAvisoModify: jest.fn().mockReturnValue(of({ descripcion: 'MOD_DESC' })),
  };

  const mockUnicoStore = {
    setModalidadCertificacion: jest.fn(),
    setForeignClientsSuppliers: jest.fn(),
    setNationalSuppliers: jest.fn(),
    setModificationsMembers: jest.fn(),
    setChangesToLegalDocuments: jest.fn(),
    setMergerOrSplitNotice: jest.fn(),
    setAdditionFractions: jest.fn(),
    setAdditionmodificación: jest.fn(),
    setAdditionPresentación: jest.fn(),
    setAcepto253: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TipoDeAvisoComponent],
      providers: [
        FormBuilder,
        { provide: AvisoUnicoService, useValue: mockAvisoUnicoService },
        { provide: UnicoStore, useValue: mockUnicoStore },
        { provide: UnicoQuery, useValue: mockUnicoQuery },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TipoDeAvisoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form on init', () => {
    expect(component.miFormulario).toBeDefined();
    expect(component.miFormulario.get('modalidadCertificacion')?.value).toEqual('TEST');
  });

  it('should call setModalidadCertificacion on init', () => {
    expect(mockAvisoUnicoService.getAvisoModify).toHaveBeenCalled();
    expect(mockUnicoStore.setModalidadCertificacion).toHaveBeenCalledWith('MOD_DESC');
  });

  it('should emit form values on aiEnviar()', () => {
    jest.spyOn(component.tabEnabledData, 'emit');
    component.aiEnviar();
    expect(component.tabEnabledData.emit).toHaveBeenCalledWith(component.miFormulario.value);
  });

  it('should create form with disabled field', () => {
    component.crearFormMiFormulario();
    expect(component.miFormulario.get('modalidadCertificacion')?.disabled).toBe(true);
  });

  it('should disable form if esFormularioSoloLectura is true', () => {
    component.esFormularioSoloLectura = true;
    component.guardarDatosFormulario();
    expect(component.miFormulario.disabled).toBe(true);
  });

  it('should enable form if esFormularioSoloLectura is false', () => {
    component.esFormularioSoloLectura = false;
    component.guardarDatosFormulario();
    expect(component.miFormulario.enabled).toBe(true);
  });

  it('should create form on inicializarEstadoFormulario when not readonly', () => {
    component.esFormularioSoloLectura = false;
    component.inicializarEstadoFormulario();
    expect(component.miFormulario).toBeDefined();
  });

  it('should complete destroy$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component['destroy$'], 'next');
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
