import { ChatResponseEntity } from "src/entities/chat-response.entity";
import { ChatResponse } from 'ollama';

export class ChatResponseModel implements ChatResponse
{
    //#region Properties

    /**
     * The primary key of the entity
     */
    public id: number;

    /**
     * The chat the response belongs to
     */
    public chat_id: number;

    /**
     * The url of the response
     */
    public url: string;

    /**
     * The model used to generate the response
     */
    public model: string;

    /**
     * The date and time the response was created
     */
    public created_at: Date;

    /**
     * The role of the message author
     */
    public message: {role: string, content: string};

    /**
     * The reason the response was marked as done
     */
    public done_reason: string;

    /**
     * Whether the response was marked as done
     */
    public done: boolean;

    /**
     * The total duration of the response being generated
     */
    public total_duration: number;

    /**
     * The duration of the response loading
     */
    public load_duration: number;

    /**
     * The number of prompt evaluations
     */
    public prompt_eval_count: number;

    /**
     * The duration of prompt evaluations
     */
    public prompt_eval_duration: number;

    /**
     * The number of evaluations
     */
    public eval_count: number;

    /**
     * The duration of evaluations
     */
    public eval_duration: number;

    //#endregion Properties

    //#region Static Methods

    /**
     * Converts a chat response entity to a chat response model
     * @param response The chat response entity to convert
     */
    public static fromChatResponse(response: ChatResponseEntity): ChatResponseModel
    {
        const model = new ChatResponseModel();

        model.id = response.id;
        model.chat_id = response.chat?.id;
        model.url = `/api/chat-messages/message/${response.id}`;
        model.model = response.model;
        model.created_at = response.created_at;
        model.message = {role: response.message_role, content: response.message_content};
        model.done_reason = response.done_reason;
        model.done = response.done;
        model.total_duration = response.total_duration;
        model.load_duration = response.load_duration;
        model.prompt_eval_count = response.prompt_eval_count;
        model.prompt_eval_duration = response.prompt_eval_duration;
        model.eval_count = response.eval_count;
        model.eval_duration = response.eval_duration;

        return model;
    }

    //#endregion Static Methods

}