import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManifiestosDeclaracionesComponent } from './manifiestosDeclaraciones.component';
import { Tramite261702Store } from '../../../../estados/tramites/tramite261702.store';
import { Tramite261702Query } from '../../../../estados/queries/tramite261702.query';
import { of, Subject, Subscription } from 'rxjs';

describe('ManifiestosDeclaracionesComponent', () => {
  let component: ManifiestosDeclaracionesComponent;
  let fixture: ComponentFixture<ManifiestosDeclaracionesComponent>;
  let mockTramite261702Store: jest.Mocked<Tramite261702Store>;
  let mockTramite261702Query: jest.Mocked<Tramite261702Query>;

  beforeEach(async () => {
    mockTramite261702Store = {
      setDynamicFieldValue: jest.fn(),
    } as unknown as jest.Mocked<Tramite261702Store>;

    mockTramite261702Query = {
      selectRetiros$: of({
        manifiestos: true,
      }),
    } as unknown as jest.Mocked<Tramite261702Query>;

    await TestBed.configureTestingModule({
      imports: [ManifiestosDeclaracionesComponent],
      providers: [
        { provide: Tramite261702Query, useValue: mockTramite261702Query },
        { provide: Tramite261702Store, useValue: mockTramite261702Store },
      ],
    }).compileComponents();
    
    fixture = TestBed.createComponent(ManifiestosDeclaracionesComponent);
    component = fixture.componentInstance;
    component.destroyNotifier$ = new Subject<void>();
    component.consultaState = { readonly: false } as any;
    fixture.detectChanges();
  });

  it('debe crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debe suscribirse a selectRetiros$ en ngOnInit', () => {
    const spy = jest.spyOn(mockTramite261702Query.selectRetiros$, 'subscribe');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
    expect(component.retirosCofeprisState).toEqual({ manifiestos: true });
  });


  it('debe establecer el valor del checkbox en establecerValor', () => {
    document.body.innerHTML = `<input id="manifiestos" type="checkbox" />`;
    component.retirosCofeprisState = { manifiestos: true };
    component.establecerValor();
    const checkbox = document.getElementById('manifiestos') as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  it('debe limpiar las suscripciones y completar destroyNotifier$ en ngOnDestroy', () => {
    const notifierNextSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const notifierCompleteSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(notifierNextSpy).toHaveBeenCalled();
    expect(notifierCompleteSpy).toHaveBeenCalled();
  });
});
