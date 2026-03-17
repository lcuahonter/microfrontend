import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrosslistComponent } from './crosslist.component';

describe('CrosslistComponent', () => {
  let component: CrosslistComponent;
  let fixture: ComponentFixture<CrosslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrosslistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrosslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
