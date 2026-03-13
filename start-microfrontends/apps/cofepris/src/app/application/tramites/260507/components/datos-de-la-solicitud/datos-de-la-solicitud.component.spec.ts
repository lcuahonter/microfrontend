import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatosDeLaComponent } from '../../../../shared/components/datos-solicitud/datos-solicitud.component';
import { DatosDeLaSolicitudComponent } from './datos-de-la-solicitud.component';
import { Tramite260507Store } from '../../../../estados/tramites/260507/tramite260507.store';
class MockTramite260507Store {
  setFormValidity = jest.fn();
}

describe('DatosSolicitudComponent (Jest)', () => {
  let component: DatosDeLaSolicitudComponent;
  let fixture: ComponentFixture<DatosDeLaSolicitudComponent>;
  let store: MockTramite260507Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, DatosDeLaSolicitudComponent, DatosDeLaComponent],
      providers: [
        { provide: Tramite260507Store, useClass: MockTramite260507Store },
      ],
    }).compileComponents();
    TestBed.overrideComponent(DatosDeLaSolicitudComponent, {
      set: { changeDetection: 0 }
    });
    fixture = TestBed.createComponent(DatosDeLaSolicitudComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Tramite260507Store) as unknown as MockTramite260507Store;
    fixture.detectChanges(); 
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default visibility flags and idProcedimiento', () => {
    expect(component.isAvisoLicenciaVisible).toBe(false);
    expect(component.isAduanasEntradaVisible).toBe(true);
    expect(component.idProcedimiento).toBe(260502);
  });

  it('should call store.setFormValidity for datosEstablecimiento', () => {
    component.datosEstabelicimientoFormValidityChange(true);
    expect(store.setFormValidity).toHaveBeenCalledWith(
      'datosEstablecimiento',
      true
    );
  });

  it('should call store.setFormValidity for domicilioEstablecimiento', () => {
    component.domicilioFormValidityChange(false);
    expect(store.setFormValidity).toHaveBeenCalledWith(
      'domicilioEstablecimiento',
      false
    );
  });

  it('should call store.setFormValidity for manifiestos', () => {
    component.manifiestosFormValidityChange(true);
    expect(store.setFormValidity).toHaveBeenCalledWith('manifiestos', true);
  });

  it('should call store.setFormValidity for representanteLegal', () => {
    component.representanteLegalFormValidityChange(false);
    expect(store.setFormValidity).toHaveBeenCalledWith(
      'representanteLegal',
      false
    );
  });

});
