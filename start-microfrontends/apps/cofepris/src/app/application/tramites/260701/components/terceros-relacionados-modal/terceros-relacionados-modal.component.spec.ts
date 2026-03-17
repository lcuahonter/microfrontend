import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Solicitud260701State, Tramite260701Store } from '../../estados/tramites/tramite260701.store';
import { Tramite260701Query } from '../../estados/queries/tramite260701.query';
import { TercerosRelacionadosModalComponent } from './terceros-relacionados-modal.component';
import { of } from 'rxjs';

describe('TercerosRelacionadosModalComponent', () => {
  let component: TercerosRelacionadosModalComponent;
  let fixture: ComponentFixture<TercerosRelacionadosModalComponent>;
  let tramite260701StoreMock: Partial<Tramite260701Store>;
  let tramite260701QueryMock: Partial<Tramite260701Query>;

  beforeEach(async () => {
    tramite260701StoreMock = {
      setTipoPersona: jest.fn(),
    };

    tramite260701QueryMock = {
      selectSolicitud$: of({
        denominacionSocial: '',
        terceroNombre: '',
        primerApellido: '',
        nacional: '',
        extranjero: '',
        tipoPersona: '',
        tercerosRelacionadosRfc: '',
        curp: '',
        razonSocial: '',
        pais: '',
        tercerosRelacionadosEstado: '',
        tercerosRelacionadosMunicipio: '',
        tercerosRelacionadosLocalidad: '',
        tercerosRelacionadosCodigoPostal: '',
        tercerosRelacionadosColonia: '',
        tercerosRelacionadosCalle: '',
        numeroExterior: '',
        numeroInterior: '',
        tercerosRelacionadosLada: '',
        tercerosRelacionadosTelefono: '',
        tercerosRelacionadosCorreoElectronico: '',
      } as Solicitud260701State),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TercerosRelacionadosModalComponent],
      providers: [
        { provide: BsModalRef, useValue: {} },
        { provide: Tramite260701Store, useValue: tramite260701StoreMock },
        { provide: Tramite260701Query, useValue: tramite260701QueryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TercerosRelacionadosModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on init', () => {
    expect(component.tercerosRelacionadosForm).toBeDefined();
    expect(component.tercerosRelacionadosForm.get('denominacionSocial')).toBeTruthy();
  });

  it('should update radioObjeto on onChangeTipoPersona', () => {
    component.tercerosRelacionadosForm.get('tipoPersona')?.setValue('fisica');
    component.onChangeTipoPersona();
    expect(component.radioObjeto.fisica).toBe(true);
    expect(component.radioObjeto.moral).toBe(false);

    component.tercerosRelacionadosForm.get('tipoPersona')?.setValue('moral');
    component.onChangeTipoPersona();
    expect(component.radioObjeto.fisica).toBe(false);
    expect(component.radioObjeto.moral).toBe(true);
  });

  it('should call setValoresStore when onChangeTipoPersona is triggered', () => {
    const setValoresStoreSpy = jest.spyOn(component, 'setValoresStore');
    component.tercerosRelacionadosForm.get('tipoPersona')?.setValue('fisica');
    component.onChangeTipoPersona();
    expect(setValoresStoreSpy).toHaveBeenCalledWith(
      component.tercerosRelacionadosForm,
      'tipoPersona',
      'setTipoPersona'
    );
  });

  it('should call tramite260701Store.setTipoPersona when setValoresStore is called', () => {
    component.setValoresStore(component.tercerosRelacionadosForm, 'tipoPersona', 'setTipoPersona');
    expect(tramite260701StoreMock.setTipoPersona).toHaveBeenCalled();
  });

  it('should unsubscribe from observables on destroy', () => {
    const destroyNotifierSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const destroyNotifierCompleteSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(destroyNotifierSpy).toHaveBeenCalled();
    expect(destroyNotifierCompleteSpy).toHaveBeenCalled();
  });
});
