import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCatalogosComponent } from './select-catalogos.component';

describe('SelectCatalogosComponent', () => {
  let component: SelectCatalogosComponent;
  let fixture: ComponentFixture<SelectCatalogosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectCatalogosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectCatalogosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
