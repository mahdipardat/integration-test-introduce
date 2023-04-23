import { Company } from "./Company";
import { EmailChangedEvent } from "./EmailChangedEvent";
import { UserType } from "./UserType.enum";

export class User {
    private _emailChangedEvents: Array<EmailChangedEvent> = [];
    constructor(
        private _userId: string,
        private _email: string,
        private _type: UserType,
        private _isEmailConfirmed: boolean

    ) { }

    public get emailChangedEvents(): Array<EmailChangedEvent> {
        return this._emailChangedEvents;
    }

    public set userId(userId: string) {
        this._userId = userId;
    }

    public get userId(): string {
        return this._userId;
    }

    public get email(): string {
        return this._email;
    }

    public get type(): UserType {
        return this._type;
    }

    public get isEmailConfirmed(): boolean {
        return this._isEmailConfirmed;
    }

    // behaviors
    public canChangeEmail(): string {
        if (this._isEmailConfirmed)
            return "Can't change email after it's confirmed";

        return null;
    }

    public changeEmail(newEmail: string, company: Company): void {
        const validate = this.canChangeEmail();
        if (validate) {
            throw new Error(validate)
        }

        if (this._email === newEmail) return;

        const userType: UserType = company.isEmailCorporate(newEmail) ? UserType.Employee : UserType.Customer;

        if (this._type !== userType) {
            const delta = userType == UserType.Employee ? 1 : -1;
            company.changeNumberOfEmployees(delta);
        }

        this._email = newEmail;
        this._type = userType;
        this._emailChangedEvents.push(new EmailChangedEvent(this.userId, newEmail));
    }
}