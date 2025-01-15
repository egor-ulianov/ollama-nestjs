import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatMessagesController } from './controllers/chat-messages/chat-messages.controller';
import { OllamaGeneratorService } from './services/ollama-generator/ollama-generator.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatResponseEntity } from './entities/chat-response.entity';
import { ConfigModule } from '@nestjs/config';
import { ChatEntity } from './entities/chat.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [ChatResponseEntity, ChatEntity],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([ChatResponseEntity, ChatEntity]),
    ConfigModule.forRoot()
  ],
  controllers: [AppController, ChatMessagesController],
  providers: [AppService, OllamaGeneratorService],
})
export class AppModule {}
