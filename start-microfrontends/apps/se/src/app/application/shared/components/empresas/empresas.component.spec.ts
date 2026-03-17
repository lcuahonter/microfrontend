import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmpresasComponent } from './empresas.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { Tramite80104Store } from '../../../estados/tramites/tramite80104.store';
import { Tramite80104Query } from '../../../estados/queries/tramite80104.query';
import { DisponsibleFiscal } from '../../models/empresas.model';


describe('EmpresasComponent', () => {
  let component: EmpresasComponent;
  let fixture: ComponentFixture<EmpresasComponent>;

  const mockSolicitudState = {
    rfc: 'ABC123456T78',
    estado: 1,
  };

  const mockStore = {
    setDisponibles: jest.fn(),
    setSeleccionadas: jest.fn(),
    setRfc: jest.fn(),
    setEstado: jest.fn(),
  };

  const mockQuery = {
    selectSolicitud$: of(mockSolicitudState),
    getValue: () => ({
      disponibles: [],
      seleccionadas: []
    })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpresasComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: Tramite80104Store, useValue: mockStore },
        { provide: Tramite80104Query, useValue: mockQuery }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmpresasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with values from store', () => {
    expect(component.empresasForm).toBeDefined();
    expect(component.empresasForm.get('rfc')?.value).toBe(mockSolicitudState.rfc);
    expect(component.empresasForm.get('estado')?.value).toBe(mockSolicitudState.estado);
  });

  it('should call setValoresStore when setValoresStore is triggered', () => {
    const form = component.empresasForm;
    form.get('rfc')?.setValue('NEWVAL');
    component.setValoresStore(form, 'rfc', 'setRfc');
    expect(mockStore.setRfc).toHaveBeenCalledWith('NEWVAL');
  });

  it('should populate disponibles and update store on buscarControladoras call if form is valid', () => {
    component.estadosCatalogo = [{ id: 1, descripcion: 'Querétaro' }];
    component.empresasForm.setValue({ rfc: 'TEST123', estado: 1 });

    component.buscarControladoras();

    expect(component.disponibles.length).toBe(1);
    expect(mockStore.setDisponibles).toHaveBeenCalledWith(expect.any(Array));
  });

  it('should move disponibles to seleccionadas on agregarPlantas call', () => {
    const mockData: DisponsibleFiscal[] = [{
      calle: 'Test Calle',
      numeroExterior: '123',
      numeroInterior: '',
      codigoPostal: '11111',
      colonia: 'Test Colonia',
      municipioDelegacion: 'Test Municipio',
      entidadFederativa: 'Querétaro',
      pais: 'México',
      registroFederalContribuyentes: 'RFC123',
      domicilioFiscalSolicitante: 'Test Address',
      razonSocial: 'Empresa S.A.'
    }];
    component.disponibles = mockData;

    component.agregarPlantas();

    expect(component.seleccionadas).toEqual(mockData);
    expect(component.disponibles).toEqual([]);
    expect(mockStore.setDisponibles).toHaveBeenCalledWith([]);
    expect(mockStore.setSeleccionadas).toHaveBeenCalledWith(mockData);
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn((component as any).destroyNotifier$, 'next');
    const completeSpy = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
