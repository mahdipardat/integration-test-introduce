import { Injectable } from "@nestjs/common";
import { Database } from "../infra/Database";
import { IMessageBus } from "../infra/IMessageBus";


@Injectable()
export class UserService {
    constructor(
        private readonly _database: Database,
        private readonly _messageBus: IMessageBus
    ) { }

    public async changeEmail(userId: string, newEmail: string): Promise<string> {
        const user = await this._database.getUserById(userId);

        user.canChangeEmail();

        const company =await this._database.getCompany();

        user.changeEmail(newEmail, company);

        // save in db
        await this._database.saveUser(user);
        await this._database.saveCompany(company)

        for (const event of user.emailChangedEvents) {
            this._messageBus.sendEmailChangedMessage(event.userId, event.newEmail)
        }

        return "OK";
    }


}