

export class Company {
    constructor(
        private _companyId: string,
        private _domainName: string,
        private _numberOfEmployees: number
    ) {}

    public get companyId(): string {
        return this._companyId;
    }

    public set companyId(companyId: string) {
        this._companyId = companyId;
    }

    public get domainName(): string {
        return this._domainName;
    }

    public get numberOfEmployees(): number {
        return this._numberOfEmployees;
    }

    public changeNumberOfEmployees(delta: number): void {
        this._numberOfEmployees += delta;
        console.log(delta, this._numberOfEmployees)
    }

    public isEmailCorporate(email: string): boolean {
        const emailDomain = email.split('@')[1];
        return emailDomain === this._domainName;
    }
}