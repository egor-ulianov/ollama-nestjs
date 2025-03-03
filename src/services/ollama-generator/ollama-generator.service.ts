import { Injectable, NotFoundException } from '@nestjs/common';
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
    
    //#region Public Methods

    /**
     * Creates a chat
     * @param chatModel  The chat model to create
     * @returns The created chat
     */
    public async createChat(chatModel: ChatModel): Promise<ChatModel>
    {
        let chatEntity = new ChatEntity();
        chatEntity.name = chatModel.title;
        chatEntity = await this.chatRepository.save(chatEntity);

        return ChatModel.fromChatResponse(chatEntity);
    }

    /**
     * Generates a chat message
     * @param requestMessage  The request message to generate a response for
     * @param modelId  The model to use to generate the response
     * @param chatId  The chat id to generate the response for
     * @returns The generated chat response
     */
    public async generateChatMessage(requestMessage: ChatMessage, modelId?: string, chatId?: number): Promise<ChatResponseModel>
    {
        const chatEntity = await this.obtainChat(chatId);
        const responseEntity = new ChatResponseEntity();
        responseEntity.chat = chatEntity;

        const requestEntity = ChatResponseEntity.fromChatMessage(requestMessage);
        requestEntity.created_at = new Date();
        requestEntity.chat = chatEntity;

        const responseId = await this.requestRepository.save(responseEntity).then(entity => entity.id);
        responseEntity.id = responseId;

        this.generateChatResponse(requestMessage, responseId, chatEntity, modelId);

        return ChatResponseModel.fromChatResponse(responseEntity);
    }

    /**
     * Gets a chat
     * @param chatId The chat id to get 
     * @param verbose Whether to include the chat messages
     * @returns chat
     */
    public async getChat(chatId: number, verbose: boolean = false): Promise<ChatModel>
    {
        const chatEntity = await this.chatRepository.findOne(
        {
            where: {id: chatId},
            relations: verbose ? ['chatResponses']: [],
        });

        if (!chatEntity)
        {
            throw new NotFoundException('Chat not found');
        }

        return ChatModel.fromChatResponse(chatEntity, verbose);
    }

    /**
     * Gets a chat message
     * @param id The id of the chat message to get
     * @returns The chat message
     * @throws NotFoundException
     */
    public async getChatMessage(id: number): Promise<ChatResponseModel>
    {
        const responseEntity = await this.requestRepository.findOne({where: {id}, relations: ['chat']});

        if (!responseEntity)
        {
            throw new NotFoundException('Chat message not found');
        }

        return ChatResponseModel.fromChatResponse(responseEntity);
    }

    /**
     * Gets the chat messages
     * @param chatId The chat id to get the messages for
     * @returns The chat messages
     */
    public async getChatMessages(chatId: number): Promise<ChatResponseModel[]>
    {
        return this.getAllChatResponsesPerChat(chatId);
    }

    //#endregion Public Methods
    
    //#region Private Methods

    private async obtainChat(chatId?: number): Promise<ChatEntity>
    {
        if (chatId)
        {
            return this.chatRepository.findOne({where: {id: chatId}});
        }
        else
        {
            return this.chatRepository.save(new ChatEntity());
        }
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

    //#endregion Private Methods
}
