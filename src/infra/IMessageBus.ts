export abstract class IMessageBus {
    abstract sendEmailChangedMessage(userId: string, newEmail: string): void;
}