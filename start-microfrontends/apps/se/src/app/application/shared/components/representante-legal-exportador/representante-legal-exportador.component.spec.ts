import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RepresentanteLegalExportadorComponent } from './representante-legal-exportador.component';

describe('RepresentanteLegalExportadorComponent', () => {
  let component: RepresentanteLegalExportadorComponent;
  let fixture: ComponentFixture<RepresentanteLegalExportadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepresentanteLegalExportadorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RepresentanteLegalExportadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
