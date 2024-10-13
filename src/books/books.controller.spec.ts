import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { User } from '../users/entities/user.entity';

describe('BooksController', () => {
  let controller: BooksController;
  let booksService: BooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);
    booksService = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a book', async () => {
      const createBookDto: CreateBookDto = { title: 'Test Book', author: 'Test Author', userId: 1 };
      const user: User = { id: 1, email: 'test@example.com', password: 'password', books: [] };
      const createdBook: Book = { id: 1, title: createBookDto.title, author: createBookDto.author, user };

      jest.spyOn(booksService, 'create').mockResolvedValue(createdBook);

      const result = await controller.create(createBookDto);
      expect(result).toEqual(createdBook);
      expect(booksService.create).toHaveBeenCalledWith(createBookDto);
    });
  });

  // Add more test cases for other methods (findAll, findOne, update, remove)
});
