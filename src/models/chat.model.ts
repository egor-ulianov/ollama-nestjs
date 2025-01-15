import { ChatEntity } from "src/entities/chat.entity";

export class ChatModel {
    //#region Properties
    
    public id: number;

    public url: string;

    public title: string;

    public messages: string[] | null;

    //#endregion Properties

    //#region Static Methods

    public static fromChatResponse(response: ChatEntity, verbose: boolean = false): ChatModel
    {
        const model = new ChatModel();

        console.log(verbose, verbose == false);
        model.id = response.id;
        model.url = `/api/chat-messages/chat/${response.id}`;
        model.title = response.name;
        model.messages = verbose ? response.chatResponses?.map(chatResponse => chatResponse.message_content) : null;

        return model;
    }

    //#endregion Static Methods
}