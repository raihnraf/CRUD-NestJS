import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
    private usersService: UsersService,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const user = await this.usersService.findById(createBookDto.userId);
    if (!user) {
      throw new NotFoundException(`User with ID "${createBookDto.userId}" not found`);
    }
    const book = this.booksRepository.create({
      ...createBookDto,
      user,
    });
    return await this.booksRepository.save(book);
  }

  async findAll(): Promise<Book[]> {
    return await this.booksRepository.find();
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.booksRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException(`Book with ID "${id}" not found`);
    }
    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.findOne(id);
    Object.assign(book, updateBookDto);
    return await this.booksRepository.save(book);
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.booksRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Book with ID "${id}" not found`);
    }
    return { message: `Book with ID "${id}" has been successfully deleted` };
  }
}