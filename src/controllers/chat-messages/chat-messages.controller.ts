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

    @Post('chat')
    public async ceateChat(@Body() request: ChatModel): Promise<ChatModel>
    {
        const chatResponse: ChatModel = await this._ollamaGeneratorService.createChat(request);

        return chatResponse;
    }

    @Post('chat/:id/message')
    public async postToChat(@Param('id') chatId: number, @Body() requestMessage: ChatMessage, @Query('modelId') modelId?: string): Promise<ChatResponseModel>
    {
        const generatedMessage: ChatResponseModel = await this._ollamaGeneratorService.generateChatMessage(requestMessage, modelId, Number(chatId));

        return generatedMessage;
    }

    @Get('chat/:id/messages')
    public async getChatMessages(@Param('id') id: number): Promise<ChatResponseModel[]>
    {
        const chatMessages: ChatResponseModel[] = await this._ollamaGeneratorService.getChatMessages(id);

        return chatMessages;
    }

    @Get('message/:id')
    public async getChatMessage(@Param('id') id: number): Promise<ChatResponseModel>
    {
        const chatMessage: ChatResponseModel = await this._ollamaGeneratorService.getChatMessage(id);

        return chatMessage;
    }

    @Get('chat/:id')
    public async getChat(@Param('id') id: number, @Query('verbose') verbose: string = 'false'): Promise<ChatModel>
    {
        const chat: ChatModel = await this._ollamaGeneratorService.getChat(id, (verbose == 'true'));

        return chat;
    }

    //#endregion Methods

}
