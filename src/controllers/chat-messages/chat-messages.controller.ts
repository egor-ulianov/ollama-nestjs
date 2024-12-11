import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ChatResponse } from 'ollama';
import { ChatMessage } from 'src/models/chat-message.model';
import { OllamaGeneratorService } from 'src/services/ollama-generator/ollama-generator.service';
import { ChatResponseModel } from './chat-response.model';

@Controller('api/chat-messages')
export class ChatMessagesController 
{
    //#region Constructor

    public constructor(private readonly _ollamaGeneratorService: OllamaGeneratorService)
    {
    }

    //#endregion Constructor

    //#region Methods

    @Post('message')
    public async postToChat(@Body() requestMessage: ChatMessage, @Query('modelId') modelId?: string): Promise<ChatResponseModel>
    {
        const generatedMessage: ChatResponseModel = await this._ollamaGeneratorService.generateChatMessage(requestMessage, modelId);

        return generatedMessage;
    }

    @Get('message/:id')
    public async getChatMessage(@Param('id') id: number): Promise<ChatResponseModel>
    {
        const chatMessage: ChatResponseModel = await this._ollamaGeneratorService.getChatMessage(id);

        return chatMessage;
    }

    //#endregion Methods

}
