import { Injectable } from "@nestjs/common";
import { IBus } from "./IBus";
import { IMessageBus } from "./IMessageBus";

@Injectable()
export class MessageBus implements IMessageBus {
    constructor(private readonly _bus: IBus) {}

    sendEmailChangedMessage(userId: string, newEmail: string): void {
        this._bus.send(`Subject: USER; Type: EMAIL CHANGED; Id: ${userId}; NewEmail: ${newEmail}`)
    }

}