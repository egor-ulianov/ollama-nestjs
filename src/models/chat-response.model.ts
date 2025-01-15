import { ChatResponseEntity } from "src/entities/chat-response.entity";
import { ChatResponse } from 'ollama';

export class ChatResponseModel implements ChatResponse
{
    //#region Properties

    public id: number;

    public chat_id: number;

    public url: string;

    public model: string;

    public created_at: Date;

    public message: {role: string, content: string};

    public done_reason: string;

    public done: boolean;

    public total_duration: number;

    public load_duration: number;

    public prompt_eval_count: number;

    public prompt_eval_duration: number;

    public eval_count: number;

    public eval_duration: number;

    //#endregion Properties

    //#region Static Methods

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