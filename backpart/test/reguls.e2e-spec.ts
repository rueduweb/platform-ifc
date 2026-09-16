import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('RegulsController (e2e)', () => {
  let app: INestApplication;

  const prismaMock = {
    regul: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule =
      await Test.createTestingModule({
        imports: [AppModule],
      })
        .overrideProvider(PrismaService)
        .useValue(prismaMock)
        .compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('POST /reguls', () => {
    it('should create a regul', async () => {
      const createdRegul = {
        id: 1,
        license: 'ABC123',
        items: [
          {
            id: 1,
            date: new Date('2026-09-11T12:00:00.000Z'),
            amount: 500,
          },
        ],
        total: 500,
        createdAt: new Date('2026-09-11T12:00:00.000Z'),
        updatedAt: new Date('2026-09-11T12:00:00.000Z'),
      };

      prismaMock.regul.create.mockResolvedValue(createdRegul);

      const response = await request(app.getHttpServer())
        .post('/reguls')
        .send({
          license: 'ABC123',
          amount: 500,
        })
        .expect(201);

      expect(response.body).toEqual({
        id: 1,
        license: 'ABC123',
        items: [
          {
            id: 1,
            date: '2026-09-11T12:00:00.000Z',
            amount: 500,
          },
        ],
        total: 500,
      });

      expect(prismaMock.regul.create).toHaveBeenCalledTimes(1);

      expect(prismaMock.regul.create).toHaveBeenCalledWith({
        data: {
          license: 'ABC123',
          items: [
            expect.objectContaining({
              id: 1,
              date: expect.any(Date),
              amount: 500,
            }),
          ],
          total: 500,
        },
      });
    });
    it('should reject an empty license', async () => {
    await request(app.getHttpServer())
        .post('/reguls')
        .send({
        license: '',
        amount: 500,
        })
        .expect(400);

    expect(prismaMock.regul.create).not.toHaveBeenCalled();
    });

    it('should reject an amount lower than 1', async () => {
    await request(app.getHttpServer())
        .post('/reguls')
        .send({
        license: 'ABC123',
        amount: 0,
        })
        .expect(400);

    expect(prismaMock.regul.create).not.toHaveBeenCalled();
    });

    it('should reject a non-integer amount', async () => {
    await request(app.getHttpServer())
        .post('/reguls')
        .send({
        license: 'ABC123',
        amount: 500.5,
        })
        .expect(400);

    expect(prismaMock.regul.create).not.toHaveBeenCalled();
    });

    it('should create a regul without an amount', async () => {
        const createdRegul = {
            id: 1,
            license: 'ABC123',
            items: [],
            total: 0,
            createdAt: new Date('2026-09-11T12:00:00.000Z'),
            updatedAt: new Date('2026-09-11T12:00:00.000Z'),
        };

        prismaMock.regul.create.mockResolvedValue(createdRegul);

        const response = await request(app.getHttpServer())
            .post('/reguls')
            .send({
            license: 'ABC123',
            })
            .expect(201);

        expect(response.body).toEqual({
            id: 1,
            license: 'ABC123',
            items: [],
            total: 0,
        });

        expect(prismaMock.regul.create).toHaveBeenCalledWith({
            data: {
            license: 'ABC123',
            items: [],
            total: 0,
            },
        });
    });
  });

  describe('GET /reguls', () => {
  it('should return all reguls', async () => {
    const reguls = [
      {
        id: 2,
        license: 'XYZ789',
        items: [
          {
            id: 1,
            date: new Date('2026-09-11T13:00:00.000Z'),
            amount: 300,
          },
        ],
        total: 300,
        createdAt: new Date('2026-09-11T13:00:00.000Z'),
        updatedAt: new Date('2026-09-11T13:00:00.000Z'),
      },
      {
        id: 1,
        license: 'ABC123',
        items: [
          {
            id: 1,
            date: new Date('2026-09-10T12:00:00.000Z'),
            amount: 500,
          },
        ],
        total: 500,
        createdAt: new Date('2026-09-10T12:00:00.000Z'),
        updatedAt: new Date('2026-09-10T12:00:00.000Z'),
      },
    ];

    prismaMock.regul.findMany.mockResolvedValue(reguls);

    const response = await request(app.getHttpServer())
      .get('/reguls')
      .expect(200);

    expect(response.body).toEqual([
      {
        id: 2,
        license: 'XYZ789',
        items: [
          {
            id: 1,
            date: '2026-09-11T13:00:00.000Z',
            amount: 300,
          },
        ],
        total: 300,
      },
      {
        id: 1,
        license: 'ABC123',
        items: [
          {
            id: 1,
            date: '2026-09-10T12:00:00.000Z',
            amount: 500,
          },
        ],
        total: 500,
      },
    ]);

    expect(prismaMock.regul.findMany).toHaveBeenCalledTimes(1);

    expect(prismaMock.regul.findMany).toHaveBeenCalledWith({
      orderBy: {
        createdAt: 'desc',
      },
    });
  });

  it('should return an empty array when there are no reguls', async () => {
    prismaMock.regul.findMany.mockResolvedValue([]);

    const response = await request(app.getHttpServer())
      .get('/reguls')
      .expect(200);

    expect(response.body).toEqual([]);

    expect(prismaMock.regul.findMany).toHaveBeenCalledWith({
      orderBy: {
        createdAt: 'desc',
      },
    });
  });
  });

  describe('GET /reguls/:id', () => {
    it('should return a regul by id', async () => {
        const regul = {
        id: 1,
        license: 'ABC123',
        items: [
            {
            id: 1,
            date: new Date('2026-09-11T12:00:00.000Z'),
            amount: 500,
            },
        ],
        total: 500,
        createdAt: new Date('2026-09-11T12:00:00.000Z'),
        updatedAt: new Date('2026-09-11T12:00:00.000Z'),
        };

        prismaMock.regul.findUnique.mockResolvedValue(regul);

        const response = await request(app.getHttpServer())
        .get('/reguls/1')
        .expect(200);

        expect(response.body).toEqual({
        id: 1,
        license: 'ABC123',
        items: [
            {
            id: 1,
            date: '2026-09-11T12:00:00.000Z',
            amount: 500,
            },
        ],
        total: 500,
        });

        expect(prismaMock.regul.findUnique).toHaveBeenCalledTimes(1);

        expect(prismaMock.regul.findUnique).toHaveBeenCalledWith({
        where: {
            id: 1,
        },
      });
    });

    it('should return 404 when the regul does not exist', async () => {
        prismaMock.regul.findUnique.mockResolvedValue(null);

        const response = await request(app.getHttpServer())
        .get('/reguls/999')
        .expect(404);

        expect(response.body).toEqual({
        statusCode: 404,
        message: 'Regul with id 999 not found',
        error: 'Not Found',
        });

        expect(prismaMock.regul.findUnique).toHaveBeenCalledTimes(1);

        expect(prismaMock.regul.findUnique).toHaveBeenCalledWith({
        where: {
            id: 999,
        },
      });
    });
    it('should return 400 when the id is not an integer', async () => {
      const response = await request(app.getHttpServer())
      .get('/reguls/abc')
      .expect(400);

      expect(response.body.statusCode).toBe(400);

      expect(prismaMock.regul.findUnique).not.toHaveBeenCalled();
    });
  });

  describe('PATCH /reguls/:id', () => {
    it('should add an amount to an existing regul', async () => {
      const existingRegul = {
        id: 1,
        license: '20265301',
        items: [
          {
            id: 1,
            date: new Date('2026-09-11T10:00:00.000Z'),
            amount: 15,
          },
        ],
        total: 15,
        createdAt: new Date('2026-09-11T09:00:00.000Z'),
        updatedAt: new Date('2026-09-11T10:00:00.000Z'),
      };

      const updatedRegul = {
        ...existingRegul,
        items: [
          ...existingRegul.items,
          {
            id: 2,
            date: new Date('2026-09-11T11:00:00.000Z'),
            amount: 5,
          },
        ],
        total: 20,
      };

      prismaMock.regul.findUnique.mockResolvedValue(existingRegul);
      prismaMock.regul.update.mockResolvedValue(updatedRegul);

      const response = await request(app.getHttpServer())
        .patch('/reguls/1')
        .send({
          amount: 5,
        })
        .expect(200);

      expect(response.body).toEqual({
        id: 1,
        license: '20265301',
        items: [
          {
            id: 1,
            date: '2026-09-11T10:00:00.000Z',
            amount: 15,
          },
          {
            id: 2,
            date: expect.any(String),
            amount: 5,
          },
        ],
        total: 20,
      });

      expect(prismaMock.regul.findUnique).toHaveBeenCalledWith({
       where: {
         id: 1,
       },
      });

        expect(prismaMock.regul.update).toHaveBeenCalledWith({
        where: {
            id: 1,
        },
        data: {
          items: expect.arrayContaining([
            expect.objectContaining({
                id: 1,
                amount: 15,
            }),
            expect.objectContaining({
                id: 2,
                amount: 5,
            }),
          ]),
          total: 20,
        },
        });
    });

    it('should return 404 when the regul does not exist', async () => {
      prismaMock.regul.findUnique.mockResolvedValue(null);

      const response = await request(app.getHttpServer())
        .patch('/reguls/999')
        .send({
          amount: 5,
        })
        .expect(404);

      expect(response.body.statusCode).toBe(404);

      expect(prismaMock.regul.update).not.toHaveBeenCalled();
    });

    it('should return 400 when adding a fifth amount', async () => {
        const existingRegul = {
            id: 1,
            license: '20265301',
            items: [
                { id: 1, date: new Date(), amount: 10 },
                { id: 2, date: new Date(), amount: 10 },
                { id: 3, date: new Date(), amount: 10 },
                { id: 4, date: new Date(), amount: 10 },
            ],
            total: 40,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

    prismaMock.regul.findUnique.mockResolvedValue(existingRegul);

      const response = await request(app.getHttpServer())
        .patch('/reguls/1')
        .send({
          amount: 5,
        })
        .expect(400);

      expect(response.body.statusCode).toBe(400);

      expect(prismaMock.regul.update).not.toHaveBeenCalled();
    });

    it('should return 400 when the total would exceed 45', async () => {
      const existingRegul = {
        id: 1,
        license: '20265301',
        items: [
          { id: 1, date: new Date(), amount: 20 },
          { id: 2, date: new Date(), amount: 20 },
        ],
        total: 40,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.regul.findUnique.mockResolvedValue(existingRegul);

      const response = await request(app.getHttpServer())
        .patch('/reguls/1')
        .send({
          amount: 6,
        })
        .expect(400);

      expect(response.body.statusCode).toBe(400);

      expect(prismaMock.regul.update).not.toHaveBeenCalled();
    });
  });
});
