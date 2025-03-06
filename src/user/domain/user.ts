import { Entity } from "src/common/Domain/domain-object/entity.interface"





export class User extends Entity<string>{
    private name: string
    private email: string
    private password: string
    private image?: string
    private phone?: string

    private constructor (id: string, name: string, email: string, password: string, image?: string, phone?: string) {
        super(id)
        this.name = name
        this.email = email
        this.password = password
        this.image = image
        this.phone = phone
    }
    
    get Name (): string {
        return this.name
    }

    get Email (): string {
        return this.email
    }

    get Password (): string {
        return this.password
    }

    get Image (): string | undefined {
        return this.image
    }

    get Phone (): string | undefined {
        return this.phone
    }
    
    static create (id: string, name: string, email: string, password: string, image?: string, phone?: string): User {
        return new User(id, name, email, password, image, phone)
    }
}