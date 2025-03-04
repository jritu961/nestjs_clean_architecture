import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '1234',
  database: 'nest-assign',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true, // Auto-sync schema (disable in prod)
};
