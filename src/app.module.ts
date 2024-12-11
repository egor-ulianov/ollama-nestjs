import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatMessagesController } from './controllers/chat-messages/chat-messages.controller';
import { OllamaGeneratorService } from './services/ollama-generator/ollama-generator.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatResponseEntity } from './entities/chat-response.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [ChatResponseEntity],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([ChatResponseEntity]),
    ConfigModule.forRoot()
  ],
  controllers: [AppController, ChatMessagesController],
  providers: [AppService, OllamaGeneratorService],
})
export class AppModule {}
