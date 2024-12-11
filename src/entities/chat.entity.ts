import { ChatResponse } from "ollama";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ChatResponseEntity } from "./chat-response.entity";

@Entity('chat')
export class ChatEntity 
{
    //#region Properties

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ nullable: true })
    public name: string;

    //#endregion Properties

    //#region Relationships

    @OneToMany(() => ChatResponseEntity, (chatResponse) => chatResponse.chat, { cascade: true })
    public chatResponses: ChatResponseEntity[];

    //#endregion Relationships

}