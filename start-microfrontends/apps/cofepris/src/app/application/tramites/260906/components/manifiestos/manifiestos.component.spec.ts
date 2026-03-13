import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ManifiestosComponent } from './manifiestos.component';
import { Tramite260906Store } from '../../../../estados/tramites/tramite260906.store';
import { Tramite260906Query } from '../../../../estados/queries/tramite260906.query';
import { Subject, of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { Solicitud260906State } from '../../../../estados/tramites/tramite260906.store';

describe('ManifiestosComponent', () => {
  let component: ManifiestosComponent;
  let fixture: ComponentFixture<ManifiestosComponent>;
  let mockTramite260906Store: Partial<Tramite260906Store>;
  let mockTramite260906Query: Partial<Tramite260906Query>;

  const mockSelectSolicitud: Solicitud260906State = {
    manifesto: false,
    informacionConfidencial: 0
  } as Solicitud260906State;

  beforeEach(async () => {
    mockTramite260906Store = {
      setManifesto: jest.fn(),
      setInformacionConfidencial: jest.fn(),
    };

    mockTramite260906Query = {
      selectSolicitud$: of(mockSelectSolicitud),
    };

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [ReactiveFormsModule, ManifiestosComponent],
      providers: [ provideHttpClient(),
        { provide: Tramite260906Store, useValue: mockTramite260906Store },
        { provide: Tramite260906Query, useValue: mockTramite260906Query },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ManifiestosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.manifiestos.value).toEqual({
      manifesto: false,
      informacionConfidencial: 0,
    });
  });

  it('should disable the form if soloLectura is true', () => {
    component.soloLectura = true;
    component.ngOnInit();
    expect(component.manifiestos.disabled).toBe(true);
  });

  it('should enable the form if soloLectura is false', () => {
    component.soloLectura = false;
    component.ngOnInit();
    expect(component.manifiestos.enabled).toBe(true);
  });

  it('should call setManifesto in the store when setManifesto is triggered', () => {
    const mockEvent = { target: { checked: true } } as unknown as Event;
    component.setManifesto(mockEvent);
    expect(mockTramite260906Store.setManifesto).toHaveBeenCalledWith(true);
  });

  it('should call setInformacionConfidencial in the store when setInformacionConfidencial is triggered', () => {
    const mockValue = 'public';
    component.setInformacionConfidencial(mockValue);
    expect(mockTramite260906Store.setInformacionConfidencial).toHaveBeenCalledWith(mockValue);
  });

  it('should clean up subscriptions on destroy', () => {
    const destroySpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});