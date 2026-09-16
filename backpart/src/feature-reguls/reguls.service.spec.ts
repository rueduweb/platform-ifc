import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../prisma/prisma.service';
import { RegulsService } from './reguls.service';

describe('RegulsService', () => {
  let service: RegulsService;

  const prismaMock = {
    regul: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegulsService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<RegulsService>(RegulsService);
  });

  describe('create', () => {
    it('should create a regul without an amount', async () => {
      const dto = {
        license: '20265301',
      };

      prismaMock.regul.create.mockResolvedValue({
        id: 1,
        license: '20265301',
        items: [],
        total: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.create(dto);

      expect(result).toEqual({
        id: 1,
        license: '20265301',
        items: [],
        total: 0,
      });

      expect(prismaMock.regul.create).toHaveBeenCalledWith({
        data: {
          license: '20265301',
          items: [],
          total: 0,
        },
      });
    });

    it('should create a regul with an initial amount', async () => {
      const dto = {
        license: 'ABC123',
        amount: 15,
      };

      const createdRegul = {
        id: 1,
        license: 'ABC123',
        items: [
          {
            id: 1,
            date: new Date('2026-09-11T12:00:00.000Z'),
            amount: 15,
          },
        ],
        total: 15,
        createdAt: new Date('2026-09-11T12:00:00.000Z'),
        updatedAt: new Date('2026-09-11T12:00:00.000Z'),
      };

      prismaMock.regul.create.mockResolvedValue(createdRegul);

      const result = await service.create(dto);

      expect(result).toEqual({
        id: 1,
        license: 'ABC123',
        items: [
          {
            id: 1,
            date: new Date('2026-09-11T12:00:00.000Z'),
            amount: 15,
          },
        ],
        total: 15,
      });

      expect(prismaMock.regul.create).toHaveBeenCalledWith({
        data: {
          license: 'ABC123',
          items: [
            expect.objectContaining({
              id: 1,
              date: expect.any(Date),
              amount: 15,
            }),
          ],
          total: 15,
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return all reguls ordered by creation date', async () => {
      const reguls = [
        {
          id: 2,
          license: 'XYZ789',
          items: [
            {
              id: 1,
              date: new Date('2026-09-11T12:00:00.000Z'),
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

      const result = await service.findAll();

      expect(prismaMock.regul.findMany).toHaveBeenCalledWith({
        orderBy: {
          createdAt: 'desc',
        },
      });

      expect(result).toEqual([
        {
          id: 2,
          license: 'XYZ789',
          items: [
            {
              id: 1,
              date: new Date('2026-09-11T12:00:00.000Z'),
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
              date: new Date('2026-09-10T12:00:00.000Z'),
              amount: 500,
            },
          ],
          total: 500,
        },
      ]);
    });

    it('should return an empty array when there are no reguls', async () => {
      prismaMock.regul.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
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

      const result = await service.findOne(1);

      expect(prismaMock.regul.findUnique).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
      });

      expect(result).toEqual({
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
      });
    });

    it('should throw NotFoundException when the regul does not exist', async () => {
      prismaMock.regul.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException('Regul with id 999 not found'),
      );

      expect(prismaMock.regul.findUnique).toHaveBeenCalledWith({
        where: {
          id: 999,
        },
      });
    });
  });

  describe('update', () => {
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

      const result = await service.update(1, {
        amount: 5,
      });

      expect(result).toEqual({
        id: 1,
        license: '20265301',
        items: [
          {
            id: 1,
            date: new Date('2026-09-11T10:00:00.000Z'),
            amount: 15,
          },
          {
            id: 2,
            date: expect.any(Date),
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

    it('should throw NotFoundException when the regul does not exist', async () => {
      prismaMock.regul.findUnique.mockResolvedValue(null);

      await expect(
        service.update(999, {
          amount: 5,
        }),
      ).rejects.toThrow(NotFoundException);

      expect(prismaMock.regul.update).not.toHaveBeenCalled();
    });

    it('should reject adding a fifth amount', async () => {
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

      await expect(
        service.update(1, {
          amount: 5,
        }),
      ).rejects.toThrow();

      expect(prismaMock.regul.update).not.toHaveBeenCalled();
    });

    it('should reject an amount that would make the total exceed 45', async () => {
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

      await expect(
        service.update(1, {
          amount: 6,
        }),
      ).rejects.toThrow();

      expect(prismaMock.regul.update).not.toHaveBeenCalled();
    });
  });
});
