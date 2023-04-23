import { Injectable } from "@nestjs/common";
import { IBus } from "./IBus";

@Injectable()
export class Bus implements IBus {
    send(message: string): void {
        console.log(message)
    }
}