import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { UpdateBookDto } from './dto/update-book.dto';

describe('BooksService', () => {
  let service: BooksService;
  let bookRepository: Repository<Book>;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getRepositoryToken(Book),
          useClass: Repository,
        },
        {
          provide: UsersService,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    bookRepository = module.get<Repository<Book>>(getRepositoryToken(Book));
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a book', async () => {
      const createBookDto = { title: 'Test Book', author: 'Test Author', userId: 1 };
      const user: User = { id: 1, email: 'test@example.com', password: 'password', books: [] };
      const book: Book = { id: 1, title: createBookDto.title, author: createBookDto.author, user };

      jest.spyOn(usersService, 'findById').mockResolvedValue(user);
      jest.spyOn(bookRepository, 'create').mockReturnValue(book);
      jest.spyOn(bookRepository, 'save').mockResolvedValue(book);

      const result = await service.create(createBookDto);
      expect(result).toEqual(book);
    });

    it('should throw NotFoundException if user not found', async () => {
      const createBookDto = { title: 'Test Book', author: 'Test Author', userId: 1 };

      jest.spyOn(usersService, 'findById').mockResolvedValue(null);

      await expect(service.create(createBookDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      const books: Book[] = [
        { id: 1, title: 'Book 1', author: 'Author 1', user: null },
        { id: 2, title: 'Book 2', author: 'Author 2', user: null },
      ];
      jest.spyOn(bookRepository, 'find').mockResolvedValue(books);

      const result = await service.findAll();
      expect(result).toEqual(books);
    });
  });

  describe('findOne', () => {
    it('should return a book by id', async () => {
      const book: Book = { id: 1, title: 'Test Book', author: 'Test Author', user: null };
      jest.spyOn(bookRepository, 'findOne').mockResolvedValue(book);

      const result = await service.findOne(1);
      expect(result).toEqual(book);
    });

    it('should throw NotFoundException if book not found', async () => {
      jest.spyOn(bookRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a book', async () => {
      const updateBookDto: UpdateBookDto = { title: 'Updated Book' };
      const existingBook: Book = { id: 1, title: 'Old Title', author: 'Test Author', user: null };
      const updatedBook: Book = { ...existingBook, ...updateBookDto };

      jest.spyOn(service, 'findOne').mockResolvedValue(existingBook);
      jest.spyOn(bookRepository, 'save').mockResolvedValue(updatedBook);

      const result = await service.update(1, updateBookDto);
      expect(result).toEqual(updatedBook);
    });
  });

  describe('remove', () => {
    it('should remove a book', async () => {
      jest.spyOn(bookRepository, 'delete').mockResolvedValue({ affected: 1, raw: [] });

      const result = await service.remove(1);
      expect(result).toEqual({ message: 'Book with ID "1" has been successfully deleted' });
    });

    it('should throw NotFoundException if book not found', async () => {
      jest.spyOn(bookRepository, 'delete').mockResolvedValue({ affected: 0, raw: [] });

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
