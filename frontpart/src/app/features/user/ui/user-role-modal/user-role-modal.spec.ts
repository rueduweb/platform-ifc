import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRoleModal } from './user-role-modal';

describe('UserRoleModal', () => {
  let component: UserRoleModal;
  let fixture: ComponentFixture<UserRoleModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserRoleModal],
    }).compileComponents();

    fixture = TestBed.createComponent(UserRoleModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
