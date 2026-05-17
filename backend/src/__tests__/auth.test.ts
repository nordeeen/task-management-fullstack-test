import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';

jest.mock('../config/database', () => jest.fn());
jest.mock('../services/authService', () => ({
  loginUser: jest.fn(),
  registerUser: jest.fn(),
}));

import { loginUser, registerUser } from '../services/authService';

const mockLoginUser = loginUser as jest.MockedFunction<typeof loginUser>;
const mockRegisterUser = registerUser as jest.MockedFunction<typeof registerUser>;

afterAll(async () => {
  await mongoose.disconnect();
});

// POST /api/auth/login
describe('POST /api/auth/login', () => {
  it('should return 200 and set cookie on valid credentials', async () => {
    mockLoginUser.mockResolvedValueOnce({
      user: { _id: 'user123', name: 'John', email: 'john@test.com' } as any,
      token: 'mock.jwt.token',
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'john@test.com', password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('user');
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('should return 401 when email is not registered', async () => {
    mockLoginUser.mockRejectedValueOnce(new Error('Email tidak terdaftar'));

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'notfound@test.com', password: 'password123' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Email tidak terdaftar');
  });

  it('should return 401 when password is wrong', async () => {
    mockLoginUser.mockRejectedValueOnce(new Error('Password Salah'));

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'john@test.com', password: 'wrongpass' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Password Salah');
  });

  it('should return 400 when email format is invalid', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'not-an-email', password: 'password123' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 when password is missing', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'john@test.com' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

// POST /api/auth/register
describe('POST /api/auth/register', () => {
  it('should return 201 on successful registration', async () => {
    mockRegisterUser.mockResolvedValueOnce({
      user: { _id: 'user456', name: 'Jane', email: 'jane@test.com' } as any,
      token: 'mock.jwt.token',
    });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Jane', email: 'jane@test.com', password: 'password123' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('user');
  });

  it('should return 400 when name is missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'jane@test.com', password: 'password123' });

    expect(res.status).toBe(400);
  });
});
