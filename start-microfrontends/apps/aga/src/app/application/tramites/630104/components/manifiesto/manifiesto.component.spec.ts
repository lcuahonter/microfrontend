import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManifiestoComponent } from './manifiesto.component';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { TituloComponent, InputCheckComponent, ConsultaioQuery } from '@ng-mf/data-access-user';
import { Tramite630104Store } from '../../estados/tramites/tramite630104.store';
import { Tramite630104Query } from '../../estados/queries/tramite630104.query';

describe('ManifiestoComponent', () => {
  let component: ManifiestoComponent;
  let fixture: ComponentFixture<ManifiestoComponent>;

  const mockConsultaioQuery = {
    selectConsultaioState$: of({ readonly: true }),
  };

  const mockTramiteQuery = {
    selectSeccionState$: of({ declaracion: true }),
    selectTramite630104State$: of({ declaracion: true }),
  };

  const mockTramiteStore = {
    setTramite630104State: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, InputCheckComponent, TituloComponent, ManifiestoComponent],
      providers: [
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
        { provide: Tramite630104Query, useValue: mockTramiteQuery },
        { provide: Tramite630104Store, useValue: mockTramiteStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ManifiestoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with readonly disabled', () => {
    expect(component.manifiestoFormulario.get('declaracion')).toBeTruthy();
    expect(component.manifiestoFormulario.disabled).toBeFalsy();
  });

  it('should update store on setValorStore call', () => {
    component.manifiestoFormulario.get('declaracion')?.setValue(true);
    component.setValorStore(component.manifiestoFormulario, 'declaracion');
    expect(mockTramiteStore.setTramite630104State).toHaveBeenCalledWith('declaracion', true);
  });

  it('should call getValorStore and update estadoSeleccionado', () => {
    component.getValorStore();
    expect(component.estadoSeleccionado).toEqual({ declaracion: true });
  });

  it('should disable form in guardarDatosFormulario if readonly is true', () => {
    component.esFormularioSoloLectura = true;
    component.guardarDatosFormulario();
    expect(component.manifiestoFormulario.disabled).toBe(true);
  });
});
