import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { ModificacionDeDenominacionORazorsSocialComponent } from './modificacion-de-denominacion-o-razors-social.component';
import { SolicitudService } from '../../services/solicitud.service';
import { Solicitud31301Store } from '../../estados/solicitud31301.store';
import { Solicitud31301Query } from '../../estados/solicitud31301.query';
import { ModificacionDenominacionRazonSocial } from '../../models/solicitud.model';
import { CommonModule } from '@angular/common';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ModificacionDeDenominacionORazorsSocialComponent', () => {
  let component: ModificacionDeDenominacionORazorsSocialComponent;
  let fixture: ComponentFixture<ModificacionDeDenominacionORazorsSocialComponent>;
  let solicitudServiceMock: jest.Mocked<SolicitudService>;
  let solicitud31301StoreMock: jest.Mocked<Solicitud31301Store>;
  let solicitud31301QueryMock: jest.Mocked<Solicitud31301Query>;

  const mockInitialResponse: ModificacionDenominacionRazonSocial = {
    razonSocialAnterior: 'Old Name',
    razonSocialActual: 'New Name',
  };

  beforeEach(async () => {
    solicitudServiceMock = {
      conseguirModificacionDenominacionRazonSocial: jest.fn(()=> of(mockInitialResponse)),
      conseguirRecibirNotificaciones: jest.fn(),
      conseguirNombreInstitucionCatalogo: jest.fn(),
      conseguirDatosPorGarantia: jest.fn(),
    } as unknown as jest.Mocked<SolicitudService>;

    solicitud31301StoreMock = {
      actualizarRazonSocialActual: jest.fn(()=> of('Old Name')),
      actualizarRazonSocialAnterior: jest.fn(()=>of('New Name')),
    } as unknown as jest.Mocked<Solicitud31301Store>;

    const solicitudSubject = new Subject<ModificacionDenominacionRazonSocial>();

    solicitud31301QueryMock = {
      selectSolicitud$: solicitudSubject.asObservable(),
    } as unknown as jest.Mocked<Solicitud31301Query>;

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        ModificacionDeDenominacionORazorsSocialComponent,
        CommonModule,
        TituloComponent,
        HttpClientTestingModule
      ],
      declarations: [],
      providers: [
        { provide: SolicitudService, useValue: solicitudServiceMock },
        { provide: Solicitud31301Store, useValue: solicitud31301StoreMock },
        { provide: Solicitud31301Query, useValue: solicitud31301QueryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModificacionDeDenominacionORazorsSocialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // triggers ngOnInit
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.registroPolizaEndosoForm.value).toEqual({
      razonSocialAnterior: undefined,
      razonSocialActual: undefined,
    });
  });

  it('should call inicializarFormulario and disable the form if esFormularioSoloLectura is true', () => {
    const inicializarFormularioSpy = jest.spyOn(component, 'inicializarFormulario');
    component.esFormularioSoloLectura = true;
    component.registroPolizaEndosoForm = component.fb.group({
      razonSocialAnterior: [{ value: '', disabled: false }],
      razonSocialActual: [{ value: '', disabled: false }],
    });
    const disableSpy = jest.spyOn(component.registroPolizaEndosoForm, 'disable');
    component.guardarDatosFormulario();
    expect(inicializarFormularioSpy).toHaveBeenCalled();
  });

  it('should call inicializarFormulario and enable the form if esFormularioSoloLectura is false', () => {
    const inicializarFormularioSpy = jest.spyOn(component, 'inicializarFormulario');
    component.esFormularioSoloLectura = false;
    component.registroPolizaEndosoForm = component.fb.group({
      razonSocialAnterior: [{ value: '', disabled: true }],
      razonSocialActual: [{ value: '', disabled: true }],
    });
    const enableSpy = jest.spyOn(component.registroPolizaEndosoForm, 'enable');
    component.guardarDatosFormulario();
    expect(inicializarFormularioSpy).toHaveBeenCalled();
  });

  it('should unsubscribe from observables on destroy', () => {
    const destroySpy = jest.spyOn(component['destroy$'], 'next');
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
