export class ChatMessage
{
    //#region Properties

    public id: string;

    public role: string;

    public content: string;

    public images: Uint8Array[] | string[];

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