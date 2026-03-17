import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PantallasComponent } from './pantallas.component';
import { WizardComponent,BtnContinuarComponent,SolicitanteComponent } from '@libs/shared/data-access-user/src';
import { DatosComponent } from '../datos/datos.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PantallasComponent', () => {
  let component: PantallasComponent;
  let fixture: ComponentFixture<PantallasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WizardComponent,BtnContinuarComponent,SolicitanteComponent,HttpClientTestingModule],
      declarations: [PantallasComponent,DatosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PantallasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
