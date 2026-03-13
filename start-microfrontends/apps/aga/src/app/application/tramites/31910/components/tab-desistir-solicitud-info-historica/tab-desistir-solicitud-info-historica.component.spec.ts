import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TabDesistirSolicitudInfoHistoricaComponent } from './tab-desistir-solicitud-info-historica.component';
import { Tramite31910Store } from '../../../../estados/tramites/tramite31910.store';
import { Tramite31910Query } from '../../../../estados/queries/tramite31910.query';
import { of, Subject } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

describe('TabDesistirSolicitudInfoHistoricaComponent', () => {
  let component: TabDesistirSolicitudInfoHistoricaComponent;
  let tramite31910StoreMock: Partial<Tramite31910Store>;
  let tramite31910QueryMock: Partial<Tramite31910Query>;

  beforeEach(() => {
    tramite31910StoreMock = {
      actualizarEstado: jest.fn(),
    };

    tramite31910QueryMock = {
      selectSolicitud$: of({ observaciones: 'Test Observación', justificacion: '' }),
    };

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule,TabDesistirSolicitudInfoHistoricaComponent,HttpClientModule],
      declarations: [],
      providers: [
        { provide: Tramite31910Store, useValue: tramite31910StoreMock },
        { provide: Tramite31910Query, useValue: tramite31910QueryMock },
      ],
    }).compileComponents();

    const FIXTURE = TestBed.createComponent(TabDesistirSolicitudInfoHistoricaComponent);
    component = FIXTURE.componentInstance;
    FIXTURE.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

 

  it('Debería darse de baja de los observables al destruirlos.', () => {
    const DESTROY_SPY = jest.spyOn(component['destroy$'], 'next');
    const COMPLETE_SPY = jest.spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(DESTROY_SPY).toHaveBeenCalled();
    expect(COMPLETE_SPY).toHaveBeenCalled();
  });
});