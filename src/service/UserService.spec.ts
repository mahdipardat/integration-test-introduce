import { createMock, DeepMocked } from "@golevelup/ts-jest";
import { Test, TestingModule } from "@nestjs/testing"
import { Company } from "../domain/Company";
import { User } from "../domain/User";
import { UserType } from "../domain/UserType.enum";
import { Bus } from "../infra/bus";
import { Database } from "../infra/Database";
import { IBus } from "../infra/IBus";
import { IMessageBus } from "../infra/IMessageBus";
import { MessageBus } from "../infra/MessageBus";
import { UserService } from "./UserService";


describe('UserService', () => {
    let module: TestingModule;
    let sut: UserService;
    let database: Database;
    let messageBus: DeepMocked<IMessageBus>;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [],
            providers: [
                Database,
                {
                    provide: IBus,
                    useClass: Bus
                },
                {
                    provide: IMessageBus,
                    useValue: createMock<MessageBus>()
                },
                UserService
            ]
        }).compile();

        sut = module.get(UserService);
        database = module.get(Database);
        messageBus = module.get(IMessageBus)
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

        expect(messageBus.sendEmailChangedMessage).toBeCalledTimes(1)
    })
})