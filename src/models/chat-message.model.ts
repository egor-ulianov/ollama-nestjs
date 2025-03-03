export class ChatMessage
{
    //#region Properties

    /**
     * The unique identifier of the message
     */
    public id: string;

    /**
     * The role of the message author
     */
    public role: string;

    /**
     * The content of the message
     */
    public content: string;

    /**
     * The images associated with the message
     */
    public images: Uint8Array[] | string[];

    /**
     * The format of the message
     */
    public format: Object | null;

    //#endregion Properties

    //#region Constructor

    public constructor(id: string, role: string, content: string)
    {
        this.id = id;
        this.role = role;
        this.content = content;
    }

    //#endregion Constructor
}