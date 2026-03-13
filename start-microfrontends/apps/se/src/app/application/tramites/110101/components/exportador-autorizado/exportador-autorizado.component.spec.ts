import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExportadorAutorizadoComponent } from './exportador-autorizado.component';

describe('ExportadorAutorizadoComponent', () => {
  let component: ExportadorAutorizadoComponent;
  let fixture: ComponentFixture<ExportadorAutorizadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportadorAutorizadoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExportadorAutorizadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
