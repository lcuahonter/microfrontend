import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DestinatarioDeCertificadoComponent } from './destinatario-de-certificado.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Tramite110223Store } from '../../estados/Tramite110223.store';
import { Tramite110223Query } from '../../query/tramite110223.query';
import { SeccionLibStore, SeccionLibQuery } from '@libs/shared/data-access-user/src';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of } from 'rxjs';

// Mock classes for dependencies
class MockTramite110223Store {
  setFormDatosDelDestinatario = jest.fn();
  setFormValida = jest.fn();
}

class MockTramite110223Query {
  selectFormDestinatario$ = of({});
  selectPexim$ = of({});
}

class MockSeccionLibStore {}

class MockSeccionLibQuery {
  selectSeccionState$ = of({});
}

class MockConsultaioQuery {
  selectConsultaioState$ = of({ readonly: false });
}

describe('DestinatarioDeCertificadoComponent', () => {
  let component: DestinatarioDeCertificadoComponent;
  let fixture: ComponentFixture<DestinatarioDeCertificadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DestinatarioDeCertificadoComponent, ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        FormBuilder,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Tramite110223Store, useClass: MockTramite110223Store },
        { provide: Tramite110223Query, useClass: MockTramite110223Query },
        { provide: SeccionLibStore, useClass: MockSeccionLibStore },
        { provide: SeccionLibQuery, useClass: MockSeccionLibQuery },
        { provide: ConsultaioQuery, useClass: MockConsultaioQuery }
      ],
    }).compileComponents();    fixture = TestBed.createComponent(DestinatarioDeCertificadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call store.setFormDatosDelDestinatario with correct value in datosDelDestinatarioFunc', () => {
    const mockData = { key: 'value' };
    const store = TestBed.inject(Tramite110223Store);
    jest.spyOn(store, 'setFormDatosDelDestinatario');

    component.datosDelDestinatarioFunc(mockData);

    expect(store.setFormDatosDelDestinatario).toHaveBeenCalledWith(mockData);
  });
  it('should call store.setFormValida with correct value in setFormValida', () => {
    const store = TestBed.inject(Tramite110223Store);
    jest.spyOn(store, 'setFormValida');

    component.setFormValida(true);

    expect(store.setFormValida).toHaveBeenCalledWith({ destinatrio: true });
  });

  it('should call store.setFormValida with correct value in setFormValidaDestinatario', () => {
    const store = TestBed.inject(Tramite110223Store);
    jest.spyOn(store, 'setFormValida');

    component.setFormValidaDestinatario(false);

    expect(store.setFormValida).toHaveBeenCalledWith({ datosDestinatario: false });
  });
  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const spy = jest.spyOn(component['destroyNotifier$'], 'next');
    const spyComplete = jest.spyOn(component['destroyNotifier$'], 'complete');

    component.ngOnDestroy();

    expect(spy).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });
});