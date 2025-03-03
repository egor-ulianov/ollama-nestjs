import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ChatResponse } from 'ollama';
import { ChatMessage } from 'src/models/chat-message.model';
import { OllamaGeneratorService } from 'src/services/ollama-generator/ollama-generator.service';
import { ChatResponseModel } from '../../models/chat-response.model';
import { ChatModel } from 'src/models/chat.model';

@Controller('api/chat-messages')
export class ChatMessagesController 
{
    //#region Constructor

    public constructor(private readonly _ollamaGeneratorService: OllamaGeneratorService)
    {
    }

    //#endregion Constructor

    //#region Methods

    /**
     * Creates a chat
     * @param request  The chat model to create
     * @returns The created chat
     */
    @Post('chat')
    public async ceateChat(@Body() request: ChatModel): Promise<ChatModel>
    {
        const chatResponse: ChatModel = await this._ollamaGeneratorService.createChat(request);

        return chatResponse;
    }

    /**
     * Generates a chat message
     * @param chatId  The chat id to generate the response for
     * @param requestMessage  The request message to generate a response for
     * @param modelId  The model to use to generate the response
     * @returns The generated chat response
     */
    @Post('chat/:id/messages')
    public async postToChat(@Param('id') chatId: number, @Body() requestMessage: ChatMessage, @Query('modelId') modelId?: string): Promise<ChatResponseModel>
    {
        const generatedMessage: ChatResponseModel = await this._ollamaGeneratorService.generateChatMessage(requestMessage, modelId, Number(chatId));

        return generatedMessage;
    }

    /**
     * Gets the chat messages
     * @param id  The id of the chat to get the messages for
     * @returns The chat messages
     */
    @Get('chat/:id/messages')
    public async getChatMessages(@Param('id') id: number): Promise<ChatResponseModel[]>
    {
        const chatMessages: ChatResponseModel[] = await this._ollamaGeneratorService.getChatMessages(id);

        return chatMessages;
    }

    /**
     * Gets a chat message
     * @param id  The id of the chat message to get
     * @returns The chat message
     */
    @Get('message/:id')
    public async getChatMessage(@Param('id') id: number): Promise<ChatResponseModel>
    {
        const chatMessage: ChatResponseModel = await this._ollamaGeneratorService.getChatMessage(id);

        return chatMessage;
    }

    /**
     * Gets a chat
     * @param id  The id of the chat to get
     * @param verbose  Whether to include the chat messages
     * @returns The chat
     */
    @Get('chat/:id')
    public async getChat(@Param('id') id: number, @Query('verbose') verbose: string = 'false'): Promise<ChatModel>
    {
        const chat: ChatModel = await this._ollamaGeneratorService.getChat(id, (verbose == 'true'));

        return chat;
    }

    //#endregion Methods

}
