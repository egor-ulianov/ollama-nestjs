import { ChatResponse } from "ollama";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ChatResponseEntity } from "./chat-response.entity";

@Entity('chat')
export class ChatEntity 
{
    //#region Properties

    /*
    * The primary key of the entity
    */
    @PrimaryGeneratedColumn()
    public id: number;

    /*
    * The name of the chat
    */
    @Column({ nullable: true })
    public name: string;

    //#endregion Properties

    //#region Relationships

    @OneToMany(() => ChatResponseEntity, (chatResponse) => chatResponse.chat, { cascade: true, nullable: true })
    public chatResponses: ChatResponseEntity[];

    //#endregion Relationships

}