import { TestBed, ComponentFixture } from '@angular/core/testing';
import { DatosSolicitudComponent } from './datos-solicitud.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatosDeLaComponent } from '../../../../shared/components/datos-solicitud/datos-solicitud.component';
import { Tramite260505Store } from '../../../../estados/tramites/260505/tramite260505.store';
class MockTramite260505Store {
  setFormValidity = jest.fn();
}

describe('DatosSolicitudComponent (Jest)', () => {
  let component: DatosSolicitudComponent;
  let fixture: ComponentFixture<DatosSolicitudComponent>;
  let store: MockTramite260505Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, DatosSolicitudComponent, DatosDeLaComponent],
      providers: [
        { provide: Tramite260505Store, useClass: MockTramite260505Store },
      ],
    }).compileComponents();
    TestBed.overrideComponent(DatosSolicitudComponent, {
      set: { changeDetection: 0 }
    });
    fixture = TestBed.createComponent(DatosSolicitudComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Tramite260505Store) as unknown as MockTramite260505Store;
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
