import { users } from '@/database/schemas'
import { count, eq } from 'drizzle-orm'

import { AutoSaveFunction, DrizzleDB, Theme, User, UserViewModel, UserViewModelWithoutTheme } from '@/types'

interface CreateUserParams {
    name: string
}

export class UserDatabaseManager {
    #db: DrizzleDB
    #autoSave: AutoSaveFunction

    constructor(db: DrizzleDB, autoSaveFunction: AutoSaveFunction) {
        this.#db = db
        this.#autoSave = autoSaveFunction
    }

    async create(data: CreateUserParams): Promise<User> {
        return this.#autoSave(async () => {
            const result = await this.#db
                .insert(users)
                .values({
                    id: crypto.randomUUID(),
                    name: data.name,
                    theme: 'SYSTEM'
                })
                .returning()

            return result[0]
        })
    }

    async getById(id: string): Promise<UserViewModel | null> {
        const result = await this.#db.select().from(users).where(eq(users.id, id)).limit(1)

        return result[0] || null
    }

    async getAll(): Promise<UserViewModelWithoutTheme[]> {
        return await this.#db
            .select({
                id: users.id,
                name: users.name
            })
            .from(users)
    }

    async updateTheme(id: string, theme: Theme): Promise<User> {
        return this.#autoSave(async () => {
            const result = await this.#db
                .update(users)
                .set({ theme })
                .where(eq(users.id, id))
                .returning()

            return result[0]
        })
    }

    async createDefaultUserIfNoneExist(): Promise<User | null> {
        const userCount = await this.getUserCount()
        if (userCount === 0) {
            return this.#autoSave(async () => {
                const user = await this.create({ name: 'Default' })
                return user
            })
        }
        return null
    }

    async update(id: string, data: Partial<CreateUserParams & { theme: Theme }>): Promise<User> {
        return this.#autoSave(async () => {
            const result = await this.#db
                .update(users)
                .set(data)
                .where(eq(users.id, id))
                .returning()

            return result[0]
        })
    }

    async delete(id: string): Promise<User> {
        return this.#autoSave(async () => {
            const result = await this.#db.delete(users).where(eq(users.id, id)).returning()

            return result[0]
        })
    }

    async getUserCount(): Promise<number> {
        const result = await this.#db.select({ count: count() }).from(users)

        return result[0].count
    }
}
