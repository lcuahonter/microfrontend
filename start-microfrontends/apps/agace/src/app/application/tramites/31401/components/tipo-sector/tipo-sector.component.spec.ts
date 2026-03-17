import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TipoSectorComponent } from './tipo-sector.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CancelacionGarantiaService } from '../../services/cancelacion-garantia/cancelacion-garantia.service';
import { of, Subject } from 'rxjs';
import { ModeloDeFormaDinamica } from '@libs/shared/data-access-user/src';
import { TIPO_SECTOR } from '../../constantes/cancelacion-garantia.enum';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('TipoSectorComponent', () => {
  let component: TipoSectorComponent;
  let fixture: ComponentFixture<TipoSectorComponent>;
  const mockCancelacionGarantiaService = {
    getTipoSectorData: jest.fn().mockReturnValue(of([])),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoSectorComponent, HttpClientTestingModule, FormasDinamicasComponent, ReactiveFormsModule, CommonModule],
       providers: [
        { provide: CancelacionGarantiaService, useValue: mockCancelacionGarantiaService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TipoSectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a nested form group named ninoFormGroup', () => {
    const hasNinoFormGroup = component.forma.get('ninoFormGroup') instanceof FormGroup;
    expect(hasNinoFormGroup).toBe(true);
    expect(component.ninoFormGroup).toBeTruthy();
  });

  it('should call obtenerTipoSectorDatos on init', () => {
    const spy = jest.spyOn(component, 'obtenerTipoSectorDatos');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should complete destroy$ on destroy', () => {
    const nextSpy = jest.spyOn(component.destroy$, 'next');
    const completeSpy = jest.spyOn(component.destroy$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

});
