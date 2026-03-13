import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitarDocumentosEvaluacionComponent } from './solicitar-documentos-evaluacion.component';

describe('SolicitarDocumentosEvaluacionComponent', () => {
  let component: SolicitarDocumentosEvaluacionComponent;
  let fixture: ComponentFixture<SolicitarDocumentosEvaluacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitarDocumentosEvaluacionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitarDocumentosEvaluacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
