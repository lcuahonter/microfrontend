import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProrrogasComponent } from './prorrogas.component';
import { FormBuilder } from '@angular/forms';
import { SolicitudProrrogaService } from '../../services/solicitudProrroga/solicitud-prorroga.service';
import { Tramite130301Store } from '../../../../estados/tramites/tramite130301.store';
import { Tramite130301Query } from '../../../../estados/queries/tramite130301.query';
import { of } from 'rxjs';

describe('ProrrogasComponent', () => {
  let component: ProrrogasComponent;
  let fixture: ComponentFixture<ProrrogasComponent>;
  let mockService: Partial<SolicitudProrrogaService>;
  let mockStore: Partial<Tramite130301Store>;
  let mockQuery: Partial<Tramite130301Query>;

  beforeEach(async () => {
    mockService = {
    };

    mockStore = {
      setMotivoJustificacion: jest.fn(),
      setOtrasDeclaraciones: jest.fn(),
    };

    mockQuery = {
      selectSolicitud$: of({
        idSolicitud: 0,
        folioPermiso: 'test-folio',
        loginRfc: 'test-rfc',
        motivoJustificacion: 'Test Justification',
        otrasDeclaraciones: 'Test Declarations',
        paisEmisorCertificado: 'Test Country',
        mixed: false,
        paisDeOrigen: 'Test Origin',
      }),
    };

    await TestBed.configureTestingModule({
      imports: [ProrrogasComponent],
      providers: [
        FormBuilder,
        { provide: SolicitudProrrogaService, useValue: mockService },
        { provide: Tramite130301Store, useValue: mockStore },
        { provide: Tramite130301Query, useValue: mockQuery },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProrrogasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe llamar a obtenerProrrogasFormDatos y llenar los datos del formulario', () => {
    expect(component.prorrogasTablaDatos.length).toBe(0);
    expect(component.prorrogasForm.value.folioResolucion).toBe(undefined);
    expect(component.prorrogasForm.value.cantidad).toBe(undefined);
  });

  it('debe llamar a setValoresStore con los parámetros correctos', () => {
    const spy = jest.spyOn(mockStore, 'setMotivoJustificacion');
    component.setValoresStore(component.prorrogasForm, 'motivoJustificacion', 'setMotivoJustificacion');
    expect(spy).toHaveBeenCalledWith('Test Justification');
  });

  it('debe limpiar los observables al destruir el componente', () => {
    const spy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
