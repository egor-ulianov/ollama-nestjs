import { ChatEntity } from "src/entities/chat.entity";

export class ChatModel {
    //#region Properties
    
    /**
     * The primary key of the entity
     */
    public id: number;

    /**
     * The url of the chat
     */
    public url: string;

    /**
     * The name of the chat
     */
    public title: string;

    /**
     * The messages of the chat
     */
    public messages: string[] | null;

    //#endregion Properties

    //#region Static Methods

    /**
     * Converts a chat entity to a chat model
     * @param response The chat entity to convert
     * @param verbose Whether to include the chat messages
     */
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