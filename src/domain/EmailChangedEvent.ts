
export class EmailChangedEvent {
    constructor(
        public readonly userId: string,
        public readonly newEmail: string
    ) {}
}