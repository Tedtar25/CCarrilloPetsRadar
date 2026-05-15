import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class PostgisBootstrapService implements OnModuleInit {
  private readonly logger = new Logger(PostgisBootstrapService.name);

  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit(): Promise<void> {
    await this.dataSource.query('CREATE EXTENSION IF NOT EXISTS postgis');
    this.logger.log('Extensión PostGIS verificada');
  }
}
