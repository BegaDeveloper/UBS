import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppActionComponent } from './app-action.component';

describe('AppActionComponent', () => {
  let component: AppActionComponent;
  let fixture: ComponentFixture<AppActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
