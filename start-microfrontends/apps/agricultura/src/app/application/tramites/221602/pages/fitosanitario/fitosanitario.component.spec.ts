import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FitosanitarioComponent } from './fitosanitario.component';
import { WizardComponent,BtnContinuarComponent,AlertComponent,SolicitanteComponent } from '@ng-mf/data-access-user';
import { DatosComponent } from '../datos/datos.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FitosanitarioComponent', () => {
  let component: FitosanitarioComponent;
  let fixture: ComponentFixture<FitosanitarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WizardComponent,BtnContinuarComponent,AlertComponent,HttpClientTestingModule,SolicitanteComponent],
      declarations: [FitosanitarioComponent,DatosComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FitosanitarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
