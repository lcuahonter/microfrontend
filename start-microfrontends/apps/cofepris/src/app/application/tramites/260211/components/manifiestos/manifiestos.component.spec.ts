/* apps/cofepris/src/app/application/tramites/260211/components/manifiestos/manifiestos.component.spec.ts */

import { ComponentFixture, TestBed }   from '@angular/core/testing';
import { HttpClientTestingModule }     from '@angular/common/http/testing';

import { ManifiestosComponent }        from './manifiestos.component';
import { SanitarioService }            from '../../services/sanitario.service';

import { of } from 'rxjs';

describe('ManifiestosComponent', () => {
  let component: ManifiestosComponent;
  let fixture  : ComponentFixture<ManifiestosComponent>;

  /* ---- mock del servicio, AHORA con getPermisoData -------------------- */
  const sanitarioServiceStub = {
    getPermisoData: jest.fn().mockReturnValue(of([])),
    guardar       : jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ManifiestosComponent,            
      ],
      providers: [
        { provide: SanitarioService, useValue: sanitarioServiceStub },
      ],
    }).compileComponents();

    fixture   = TestBed.createComponent(ManifiestosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();                // dispara ngOnInit
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
    // Además verificamos que el método del servicio se haya llamado
    expect(sanitarioServiceStub.getPermisoData).toHaveBeenCalled();
  });
});
