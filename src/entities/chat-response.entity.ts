import { ChatResponse } from "ollama";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ChatEntity } from "./chat.entity";
import { ChatMessage } from "src/models/chat-message.model";

@Entity('chat_response')
export class ChatResponseEntity 
{
    //#region Properties

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ nullable: true })
    public model: string;

    @Column({ nullable: true })
    public created_at: Date;

    @Column({ nullable: true })
    public message_role: string;

    @Column({ type: 'text', nullable: true })
    public message_content: string;

    @Column({ nullable: true })
    public done_reason: string;

    @Column({ nullable: true })
    public done: boolean;

    @Column({ nullable: true })
    public total_duration: number;

    @Column({ nullable: true })
    public load_duration: number;

    @Column({ nullable: true })
    public prompt_eval_count: number;

    @Column({ nullable: true })
    public prompt_eval_duration: number;

    @Column({ nullable: true })
    public eval_count: number;

    @Column({ nullable: true })
    public eval_duration: number;

    //#endregion Properties

    //#region Relationships

    @ManyToOne(() => ChatEntity, (chat) => chat.chatResponses, { onDelete: 'CASCADE' })
    public chat: ChatEntity;
    
    //#endregion Relationships

    //#region Static Methods

    public static fromChatResponse(response: ChatResponse): ChatResponseEntity
    {
        const entity = new ChatResponseEntity();

        entity.model = response.model;
        entity.created_at = new Date(response.created_at);
        entity.message_role = response.message.role;
        entity.message_content = response.message.content;
        entity.done_reason = response.done_reason;
        entity.done = response.done;
        entity.total_duration = response.total_duration;
        entity.load_duration = response.load_duration;
        entity.prompt_eval_count = response.prompt_eval_count;
        entity.prompt_eval_duration = response.prompt_eval_duration;
        entity.eval_count = response.eval_count;
        entity.eval_duration = response.eval_duration;

        return entity;
    }

    public static fromChatMessage(message: ChatMessage): ChatResponseEntity
    {
        const entity = new ChatResponseEntity();

        entity.message_role = message.role;
        entity.message_content = message.content;

        return entity;
    }

    //#endregion Static Methods
}