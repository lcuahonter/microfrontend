import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InicioAereoComponent } from './inicio.component';

describe('ConsultasCaatAereoComponent', () => {
  let component: InicioAereoComponent;
  let fixture: ComponentFixture<InicioAereoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioAereoComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(InicioAereoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
