import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RevisionDocumentalComponent } from './revision-documental.component';

describe('RevisionDocumentalComponent', () => {
  let component: RevisionDocumentalComponent;
  let fixture: ComponentFixture<RevisionDocumentalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RevisionDocumentalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RevisionDocumentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
