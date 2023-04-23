
import { Test, TestingModule } from "@nestjs/testing"
import { Company } from "../domain/Company";
import { User } from "../domain/User";
import { UserType } from "../domain/UserType.enum";
import { Database } from "../infra/Database";
import { IBus } from "../infra/IBus";
import { IMessageBus } from "../infra/IMessageBus";
import { MessageBus } from "../infra/MessageBus";
import { UserService } from "./UserService";

class BusSpy implements IBus {
    private _messages: Array<string> = [];

    send(message: string): void {
        // mock logic
        this._messages.push(message)
    }

    public shouldRaisedMessages(): BusSpy {
        expect(this._messages.length).toEqual(1);
        return this;
    }

    public shouldBeOk(): BusSpy {
        // testing assertion

        return this;
    }

}


describe('UserService', () => {
    let module: TestingModule;
    let sut: UserService;
    let database: Database;
    let bus: BusSpy;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [],
            providers: [
                Database,
                {
                    provide: IBus,
                    useClass: BusSpy
                },
                {
                    provide: IMessageBus,
                    useClass: MessageBus
                },
                UserService
            ]
        }).compile();

        sut = module.get(UserService);
        database = module.get(Database);
        bus = module.get(IBus)
    });

    beforeEach(async () => {
        await database.removeUsers();
        await database.removeCompanies();
    })

    async function createUser(email: string, type: UserType): Promise<User> {
        const user = new User(null, email, type, false);
        await database.saveUser(user);
        return user;
    }

    async function createCompany(domainName: string, numberOfEmployees: number): Promise<Company> {
        const company = new Company(null, domainName, numberOfEmployees);
        await database.saveCompany(company);
        return company;
    }


    it('should changing email from corporate to non corporate', async () => {
        // Arrange
        const user = await createUser("m.pardat@bluteam.ir", UserType.Employee);
        await createCompany("bluteam.ir", 1);

        // Act
        const result = await sut.changeEmail(user.userId, "new@gmail.com");

        // Assert
        expect(result).toEqual("OK")

        const userFromDb = await database.getUserById(user.userId);
        expect(userFromDb.email).toEqual("new@gmail.com");
        expect(userFromDb.type).toEqual(UserType.Customer);

        const companyFromDb = await database.getCompany();
        expect(companyFromDb.numberOfEmployees).toEqual(0);

        bus.shouldBeOk().shouldRaisedMessages()
    })
})