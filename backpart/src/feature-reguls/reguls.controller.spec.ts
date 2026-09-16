import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { RegulsController } from './reguls.controller';
import { RegulsService } from './reguls.service';

describe('RegulsController', () => {
  let controller: RegulsController;

  const regulsServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegulsController],
      providers: [
        {
          provide: RegulsService,
          useValue: regulsServiceMock,
        },
      ],
    }).compile();

    controller = module.get<RegulsController>(RegulsController);
  });

  describe('create', () => {
    it('should create and return a regul', async () => {
      const dto = {
        license: 'ABC123',
        amount: 500,
      };

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
      };

      regulsServiceMock.create.mockResolvedValue(regul);

      const result = await controller.create(dto);

      expect(regulsServiceMock.create).toHaveBeenCalledTimes(1);
      expect(regulsServiceMock.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(regul);
    });
  });

  describe('findAll', () => {
    it('should return all reguls', async () => {
      const reguls = [
        {
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
        },
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
        },
      ];

      regulsServiceMock.findAll.mockResolvedValue(reguls);

      const result = await controller.findAll();

      expect(regulsServiceMock.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(reguls);
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
      };

      regulsServiceMock.findOne.mockResolvedValue(regul);

      const result = await controller.findOne(1);

      expect(regulsServiceMock.findOne).toHaveBeenCalledTimes(1);
      expect(regulsServiceMock.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(regul);
    });

    it('should propagate NotFoundException', async () => {
      regulsServiceMock.findOne.mockRejectedValue(
        new NotFoundException('Regul with id 999 not found'),
      );

      await expect(controller.findOne(999)).rejects.toThrow(
        new NotFoundException('Regul with id 999 not found'),
      );

      expect(regulsServiceMock.findOne).toHaveBeenCalledWith(999);
    });
  });

  describe('update', () => {
    it('should update a regul with a new amount', async () => {
      const dto = {
        amount: 5,
      };

      const updatedRegul = {
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
            date: new Date('2026-09-11T11:00:00.000Z'),
            amount: 5,
          },
        ],
        total: 20,
      };

      regulsServiceMock.update.mockResolvedValue(updatedRegul);

      const result = await controller.update(1, dto);

      expect(regulsServiceMock.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(updatedRegul);
    });

    it('should propagate NotFoundException', async () => {
      const dto = {
        amount: 5,
      };

      regulsServiceMock.update.mockRejectedValue(
        new NotFoundException('Regul with id 999 not found'),
      );

      await expect(controller.update(999, dto)).rejects.toThrow(
        new NotFoundException('Regul with id 999 not found'),
      );

      expect(regulsServiceMock.update).toHaveBeenCalledWith(999, dto);
    });
  });
});
