import { Injectable } from "@nestjs/common";
import { Db, MongoClient, ObjectId } from "mongodb";
import { Company } from "../domain/Company";
import { User } from "../domain/User";

@Injectable()
export class Database {
    private readonly _connectionString = "mongodb://localhost:27017";
    private readonly _db: Db;
    constructor() {
        const client = new MongoClient(this._connectionString);
        this._db = client.db("crm-test");
    }

    public async removeUsers() {
        await this._db.collection('users').deleteMany({});
    }

    public async removeCompanies() {
        await this._db.collection('company').deleteMany({});
    }

    public async saveUser(user: User): Promise<void> {
        const result = await this._db.collection('users').updateOne({ _id: new ObjectId(user.userId) }, {
            $set: {
                email: user.email,
                type: user.type,
                isEmailConfirmed: user.isEmailConfirmed
            }
        }, { upsert: true });
        
        
        user.userId = result.upsertedId ? result.upsertedId.toString() : user.userId;
    }

    public async getUserById(userId: string): Promise<User> {
        const result = await this._db.collection('users').findOne({_id: new ObjectId(userId)});
        return new User(result._id.toString(), result.email, result.type, result.isEmailConfirmed)
    }

    public async saveCompany(company: Company): Promise<void> {
        const result = await this._db.collection('company').updateOne({_id: new ObjectId(company.companyId)}, {
            $set: {
                domainName: company.domainName,
                numberOfEmployees: company.numberOfEmployees
            },
        }, { upsert: true });

        company.companyId = result.upsertedId ? result.upsertedId.toString(): company.companyId;
    }

    public async getCompany(): Promise<Company> {
        const result = await this._db.collection('company').findOne();

        return new Company(result._id.toString(), result.domainName, result.numberOfEmployees)
    }
}