import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefinanceTableViewComponent } from './refinance-table-view.component';

describe('RefinanceTableViewComponent', () => {
  let component: RefinanceTableViewComponent;
  let fixture: ComponentFixture<RefinanceTableViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefinanceTableViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RefinanceTableViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
