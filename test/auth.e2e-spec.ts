import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { UsersService } from '../src/users/users.service';

describe('Authentication System (e2e)', () => {
  let app: INestApplication;
  let usersService: UsersService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api'); // Ensure the global prefix is set
    await app.init();

    usersService = moduleFixture.get<UsersService>(UsersService);
  });

  it('should authenticate user, return JWT token, and access protected route', async () => {
    const uniqueEmail = `test-${Date.now()}@example.com`;

    // Register a new user
    const registerResponse = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email: uniqueEmail,
        password: 'testpassword',
      })
      .expect(201);

    console.log('User registered successfully:', registerResponse.body);
    const registeredUser = await usersService.findOne(uniqueEmail);
    console.log('Registered user from DB:', {
      id: registeredUser.id,
      email: registeredUser.email,
      password: registeredUser.password.substring(0, 10) + '...', // Log only part of the hashed password
    });

    // Wait for 1 second
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Authenticate the user
    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: uniqueEmail,
        password: 'testpassword',
      })
      .expect(200)
      .catch(error => {
        console.error('Login failed:', error.message);
        console.error('Response body:', error.response?.body);
        console.error('Response status:', error.response?.status);
        throw error;
      });

    console.log('Login response:', loginResponse.body);

    expect(loginResponse.body.access_token).toBeDefined();

    // Access protected route
    const profileResponse = await request(app.getHttpServer())
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${loginResponse.body.access_token}`)
      .expect(200)
      .catch(error => {
        console.error('Profile access failed:', error.response.body);
        throw error;
      });

    console.log('Profile response:', profileResponse.body);

    expect(profileResponse.body.email).toBe(uniqueEmail);
  });

  afterAll(async () => {
    await app.close();
  });
});


