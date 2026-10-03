import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { TeamsApi } from './teams-api';

describe('TeamsApi', () => {

  let service: TeamsApi;
  let httpTesting: HttpTestingController;

  const API_URL = 'http://localhost:3000/api/teams';

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        TeamsApi,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(TeamsApi);
    httpTesting = TestBed.inject(HttpTestingController);

  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should GET teams', () => {

    const response = [
      {
        id: 1,
        name: 'Team A',
        rank: 1,
        pts: 10,
        nbW: 3,
        nbD: 1,
        nbL: 0,
        nbGoal: 8,
        nbConce: 2,
        avg: 2.5,
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
    ];

    service.getTeams().subscribe(teams => {

      expect(teams).toEqual([
        {
          id: 1,
          name: 'Team A',
          nbW: 3,
          nbD: 1,
          nbL: 0,
          nbGoal: 8,
          nbConce: 2,
        },
      ]);

    });

    const request = httpTesting.expectOne(API_URL);

    expect(request.request.method).toBe('GET');

    request.flush(response);

  });

  it('should return an empty array when API returns no teams', () => {

    service.getTeams().subscribe(teams => {

      expect(teams).toEqual([]);

    });

    const request = httpTesting.expectOne(API_URL);

    request.flush([]);

  });

  it('should propagate HTTP errors', () => {

    service.getTeams().subscribe({
      error: error => {

        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Internal Server Error');

      },
    });

    const request = httpTesting.expectOne(API_URL);

    request.flush(
      {
        message: 'Server error',
      },
      {
        status: 500,
        statusText: 'Internal Server Error',
      },
    );

  });

});
