import { Injectable } from '@nestjs/common';
import { ChatResponse } from 'ollama';
import { ChatMessage } from 'src/models/chat-message.model';
import ollama from 'ollama';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatResponseEntity } from 'src/entities/chat-response.entity';
import { Repository } from 'typeorm';
import { ChatResponseModel } from 'src/models/chat-response.model';
import { ChatEntity } from 'src/entities/chat.entity';
import { ChatModel } from 'src/models/chat.model';

@Injectable()
export class OllamaGeneratorService 
{
    //#region Constructor

    constructor(    
        @InjectRepository(ChatResponseEntity)
        private requestRepository: Repository<ChatResponseEntity>,
        @InjectRepository(ChatEntity)
        private chatRepository: Repository<ChatEntity>
    )
    {
    }

    //#endregion Constructor
    
    //#region Methods

    public async createChat(chatModel: ChatModel): Promise<ChatModel>
    {
        let chatEntity = new ChatEntity();
        chatEntity.name = chatModel.title;
        chatEntity = await this.chatRepository.save(chatEntity);

        return ChatModel.fromChatResponse(chatEntity);
    }

    public async generateChatMessage(requestMessage: ChatMessage, modelId?: string, chatId?: number): Promise<ChatResponseModel>
    {
        const chatEntity = await this.obtainChat(chatId);
        const responseEntity = new ChatResponseEntity();
        responseEntity.chat = chatEntity;

        const requestEntity = ChatResponseEntity.fromChatMessage(requestMessage);
        requestEntity.created_at = new Date();
        requestEntity.chat = chatEntity

        const requestId = await this.requestRepository.save(requestEntity).then(entity => entity.id);
        const responseId = await this.requestRepository.save(responseEntity).then(entity => entity.id);
        responseEntity.id = responseId;

        this.generateChatResponse(requestMessage, responseId, chatEntity, modelId);

        return ChatResponseModel.fromChatResponse(responseEntity);
    }

    public async getChat(chatId: number, verbose: boolean = false): Promise<ChatModel>
    {
        const chatEntity = await this.chatRepository.findOne(
        {
            where: {id: chatId},
            relations: verbose ? ['chatResponses']: [],
        });

        return ChatModel.fromChatResponse(chatEntity, verbose);
    }

    private async obtainChat(chatId?: number): Promise<ChatEntity>
    {
        if (chatId)
        {
            return this.chatRepository.findOne({where: {id: chatId}});
        }
        else
        {
            return this.requestRepository.save(new ChatEntity());
        }
    }

    public async getChatMessage(id: number): Promise<ChatResponseModel>
    {
        const responseEntity = await this.requestRepository.findOne({where: {id}, relations: ['chat']});

        return ChatResponseModel.fromChatResponse(responseEntity);
    }

    public async getChatMessages(chatId: number): Promise<ChatResponseModel[]>
    {
        return this.getAllChatResponsesPerChat(chatId);
    }

    private async generateChatResponse(requestMessage: ChatMessage, responseId: number, chat: ChatEntity, modelId?: string): Promise<ChatResponse>
    {
        const chatResponses = await this.getAllChatResponsesPerChat(chat.id);
        const chatMessages = chatResponses.map(response => response.message);

        const response = await ollama.chat({
            model: modelId ?? process.env.DEFAULT_MODEL ?? 'llama3.2',
            messages: [requestMessage],
            format: requestMessage.format,
          });

        
        const entity = ChatResponseEntity.fromChatResponse(response);
        entity.id = responseId;
        entity.chat = chat;

        await this.requestRepository.save(entity);

        return response;
    }

    private getAllChatResponsesPerChat(chatId: number): Promise<ChatResponseModel[]>
    {
        return this.requestRepository.find({
            where: { chat: { id: chatId } },
            relations: ['chat'],
            order: { created_at: 'ASC', id: 'ASC' },
        }).then(entities => entities.map(entity => ChatResponseModel.fromChatResponse(entity)));
    }
    

    //#endregion Methods
}
