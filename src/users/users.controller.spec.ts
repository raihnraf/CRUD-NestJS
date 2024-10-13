import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: Partial<UsersService>;

    beforeEach(async () => {
      usersService = {
        create: jest.fn().mockImplementation((dto) => Promise.resolve({ id: 'some-id', ...dto })),
        findAll: jest.fn().mockResolvedValue([]),
        findOne: jest.fn().mockImplementation((email) => Promise.resolve({ id: 'some-id', email })),
        remove: jest.fn().mockResolvedValue({ message: 'User deleted successfully' }),
        update: jest.fn().mockImplementation((id, dto) => Promise.resolve({ id, ...dto })),
      };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: usersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
