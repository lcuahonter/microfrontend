import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InicioAgentesComponent } from './inicio.component';

describe('ConsultasCaatAgentesComponent', () => {
  let component: InicioAgentesComponent;
  let fixture: ComponentFixture<InicioAgentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioAgentesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InicioAgentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
