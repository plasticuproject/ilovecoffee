import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { CoffeesModule } from '../../src/coffees/coffees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { HttpExceptionFilter } from '../../src/common/filters/http-exception.filter';
import { CreateCoffeeDto } from '../../src/coffees/dto/create-coffee.dto';
import { UpdateCoffeeDto } from '../../src/coffees/dto/update-coffee.dto';

describe('[Feature] Coffees - /coffees', () => {
  const coffee = {
    name: 'Shipwreck Roast',
    brand: 'Buddy Brew',
    flavors: ['chocolate', 'vanilla'],
  };

  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        CoffeesModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5433,
          username: 'postgres',
          password: 'pass123',
          autoLoadEntities: true,
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
  });

  it('Create [POST /]', () => {
    return request(app.getHttpServer())
      .post('/coffees')
      .send(coffee as CreateCoffeeDto)
      .expect(HttpStatus.CREATED);
  });

  it('Get All [GET /]', () => {
    return request(app.getHttpServer())
      .get('/coffees')
      .then(({ body }) => {
        expect(body.length).toBeGreaterThan(0);
      });
  });

  it('Get One [GET /:id]', () => {
    return request(app.getHttpServer()).get('/coffees/1').expect(HttpStatus.OK);
  });

  it('Update One [PATCH /:id]', () => {
    const updatedCoffeeDto: UpdateCoffeeDto = {
      ...coffee,
      name: 'New and Improved Shipwreck Roast',
    };

    return request(app.getHttpServer())
      .patch('/coffees/1')
      .send(updatedCoffeeDto)
      .then(({ body }) => {
        expect(body.name).toEqual(updatedCoffeeDto.name);

        return request(app.getHttpServer())
          .get('/coffees/1')
          .then(({ body }) => {
            expect(body.name).toEqual(updatedCoffeeDto.name);
          });
      });
  });

  it('Delete One [DELETE /:id]', () => {
    return request(app.getHttpServer())
      .delete('/coffees/1')
      .expect(HttpStatus.OK)
      .then(() => {
        return request(app.getHttpServer())
          .get('/coffees/1')
          .expect(HttpStatus.NOT_FOUND);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
