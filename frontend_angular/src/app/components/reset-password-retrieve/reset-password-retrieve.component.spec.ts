import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordRetrieveComponent } from './reset-password-retrieve.component';

describe('ResetPasswordRetrieveComponent', () => {
  let component: ResetPasswordRetrieveComponent;
  let fixture: ComponentFixture<ResetPasswordRetrieveComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResetPasswordRetrieveComponent]
    });
    fixture = TestBed.createComponent(ResetPasswordRetrieveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
