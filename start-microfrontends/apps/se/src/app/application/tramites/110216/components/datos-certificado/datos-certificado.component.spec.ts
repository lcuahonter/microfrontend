import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { DatosCertificadoComponent } from './datos-certificado.component';
import { Tramite110216Store } from '../../../../estados/tramites/tramite110216.store';
import { Tramite110216Query } from '../../../../estados/queries/tramite110216.query';
import { CertificadosOrigenService } from '../../services/certificado-origen.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideToastr, ToastrService } from 'ngx-toastr';
import { Catalogo } from '../../models/certificado-origen.model';

class MockTramite110216Query {
  formDatosCertificado$ = of({});
  selectIdioma$ = of([{ id: 1, descripcion: 'Español' }]);
  selectEntidadFederativa$ = of([{ id: 1, descripcion: 'Entidad 1' }]);
  selectrepresentacionFederal$ = of([{ id: 1, descripcion: 'Representación 1' }]);
}

describe('DatosCertificadoComponent', () => {
  let component: DatosCertificadoComponent;
  let fixture: ComponentFixture<DatosCertificadoComponent>;
  let storeMock: any;
  let serviceMock: any;

  beforeEach(async () => {
    storeMock = {
      setFormValida: jest.fn(),
      setFormValidity: jest.fn(),
      setIdiomaSeleccion: jest.fn(),
      setRepresentacionFederalDatosSeleccion: jest.fn(),
      setFormDatosCertificado: jest.fn()
    };

    serviceMock = {
      obtenerIdioma: jest.fn().mockReturnValue(of({ datos: [] })),
      obtenerEntidadFederativa: jest.fn().mockReturnValue(of({ datos: [] })),
      obtenerRepresentacionFederal: jest.fn().mockReturnValue(of({ datos: [] }))
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule, DatosCertificadoComponent],
      providers: [
        FormBuilder,
        ToastrService,
        provideToastr({ positionClass: 'toast-top-right' }),
        { provide: CertificadosOrigenService, useValue: serviceMock },
        { provide: Tramite110216Store, useValue: storeMock },
        { provide: Tramite110216Query, useClass: MockTramite110216Query }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosCertificadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should return false if child component does not exist in isChildFormValid', () => {
    component.datosCertificadoDeRef = undefined as any;
    expect(component.isChildFormValid()).toBe(false);
  });

  it('should call store methods in setFormValida', () => {
    component.setFormValida(true);
    expect(storeMock.setFormValida).toHaveBeenCalledWith({ datos: true });
    expect(storeMock.setFormValidity).toHaveBeenCalledWith('datosCertificado', true);
  });

  it('should validate all and update store correctly when child form is valid', () => {
    component.datosCertificadoDeRef = { validarFormularios: jest.fn().mockReturnValue(true) } as any;
    const result = component.validateAll();
    expect(result).toBe(true);
    expect(storeMock.setFormValida).toHaveBeenCalledWith({ datos: true });
  });

  it('should validate all and update store correctly when child form is invalid', () => {
    component.datosCertificadoDeRef = { validarFormularios: jest.fn().mockReturnValue(false) } as any;
    const result = component.validateAll();
    expect(result).toBe(false);
    expect(storeMock.setFormValida).toHaveBeenCalledWith({ datos: false });
  });

  it('should return false if formDatosCertificado does not exist in validarFormulario', () => {
    component.formDatosCertificado = undefined as any;
    expect(component.validarFormulario()).toBe(false);
  });

  it('should call store.setIdiomaSeleccion in idiomaSeleccion', () => {
    const idioma: Catalogo = { id: 1, descripcion: 'Español' };
    component.idiomaSeleccion(idioma);
    expect(storeMock.setIdiomaSeleccion).toHaveBeenCalledWith(idioma);
  });

  it('should call store.setRepresentacionFederalDatosSeleccion in representacionFederalSeleccion', () => {
    const rep: Catalogo = { id: 1, descripcion: 'Representación 1' };
    component.representacionFederalSeleccion(rep);
    expect(storeMock.setRepresentacionFederalDatosSeleccion).toHaveBeenCalledWith(rep);
  });

  it('should call store.setFormDatosCertificado in setValoresStore', () => {
    const event = { formGroupName: '', campo: 'field', valor: undefined, storeStateName: '' };
    component.setValoresStore(event);
    expect(storeMock.setFormDatosCertificado).toHaveBeenCalledWith({ field: undefined });
  });
});
