import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftSideInteractionsComponent } from './left-side-interactions.component';

describe('LeftSideInteractionsComponent', () => {
  let component: LeftSideInteractionsComponent;
  let fixture: ComponentFixture<LeftSideInteractionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftSideInteractionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftSideInteractionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
