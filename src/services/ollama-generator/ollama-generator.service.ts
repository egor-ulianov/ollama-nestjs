import { Injectable } from '@nestjs/common';
import { ChatResponse } from 'ollama';
import { ChatMessage } from 'src/models/chat-message.model';
import ollama from 'ollama';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatResponseEntity } from 'src/entities/chat-response.entity';
import { Repository } from 'typeorm';
import { ChatResponseModel } from 'src/controllers/chat-messages/chat-response.model';

@Injectable()
export class OllamaGeneratorService 
{
    //#region Constructor

    constructor(    
        @InjectRepository(ChatResponseEntity)
    private requestRepository: Repository<ChatResponseEntity>)
    {
    }

    //#endregion Constructor
    
    //#region Methods

    public async generateChatMessage(requestMessage: ChatMessage, modelId?: string): Promise<ChatResponseModel>
    {
        const responseEntity = new ChatResponseEntity();
        const responseId = await this.requestRepository.save(responseEntity).then(entity => entity.id);
        responseEntity.id = responseId;

        this.generateChatResponse(requestMessage, responseId, modelId);

        return ChatResponseModel.fromChatResponse(responseEntity);
    }

    public async getChatMessage(id: number): Promise<ChatResponseModel>
    {
        const responseEntity = await this.requestRepository.findOne({where: {id}});

        return ChatResponseModel.fromChatResponse(responseEntity);
    }

    private async generateChatResponse(requestMessage: ChatMessage, responseId: number, modelId?: string): Promise<ChatResponse>
    {
        const response = await ollama.chat({
            model: modelId ?? process.env.DEFAULT_MODEL,
            messages: [requestMessage],
          });

        
        const entity = ChatResponseEntity.fromChatResponse(response);
        entity.id = responseId;

        await this.requestRepository.save(entity);

        return response;
    }

    //#endregion Methods
}
