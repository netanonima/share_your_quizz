import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmAccountComponent } from './confirm-account.component';

describe('ConfirmAccountComponent', () => {
  let component: ConfirmAccountComponent;
  let fixture: ComponentFixture<ConfirmAccountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmAccountComponent]
    });
    fixture = TestBed.createComponent(ConfirmAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
