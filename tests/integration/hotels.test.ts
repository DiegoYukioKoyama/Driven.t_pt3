import httpStatus from "http-status";
import supertest from "supertest";
import * as jwt from 'jsonwebtoken';
import { prisma } from "@/config";
import app, { init } from "@/app";
import { cleanDb, generateValidToken } from "../helpers";
import faker from "@faker-js/faker";
import { createEnrollmentWithAddress, createHotel, createUser } from "../factories";
import { Enrollment, User } from "@prisma/client";


beforeAll(async () => {
    await init();
  });

beforeEach(async () => {
    await cleanDb();
});

const server = supertest(app);

describe('GET /hotels', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/hotels');
  
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  
  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();
  
    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
  
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  
  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
  
    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
    describe('when token is valid', () => {

      let user: User;
      let token: string;
      let enrollment: Enrollment;

      beforeEach(async () => {
        user = await createUser();
        token = await generateValidToken(user);
        enrollment = await createEnrollmentWithAddress(user);
      })

      it('should respond with status 404 if no hotel cadastred', async () => {
        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.NOT_FOUND);
      });

      it('should respond with status 402 if payment required', async () => {
        const response = await server.get('/hotels').set('Autorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
      })
      it('should respond with status 200 and with existing hotels data', async () => {

        const hotel = await createHotel();

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual([
          {
            id: hotel.id,
            name: hotel.name,
            image: hotel.image,
            createdAt: hotel.createdAt.toISOString(),
            updatedAt: hotel.updatedAt.toISOString(),
          },
        ]);
      });
    });
});
