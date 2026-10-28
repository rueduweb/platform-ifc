import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCardComponent } from './user-card';
import { UserModel } from '../../data/models/user.model';

describe('UserCard', () => {
  let component: UserCardComponent;
  let fixture: ComponentFixture<UserCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserCardComponent);
    fixture.componentRef.setInput('user', { id: 1, username: 'test' } as unknown as UserModel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
