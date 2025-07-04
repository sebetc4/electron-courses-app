import styles from './UserMenu.module.scss'
import { ThemeSelector, UserSelector } from './components'
import { PAGE_PATH } from '@/renderer/src/constants'
import { FolderPlus, User } from 'lucide-react'
import { DropdownMenu } from 'radix-ui'
import { useState } from 'react'
import { Link } from 'react-router-dom'

export const UserMenu = () => {
    const [open, setOpen] = useState(false)

    return (
        <DropdownMenu.Root
            open={open}
            onOpenChange={setOpen}
        >
            <DropdownMenu.Trigger asChild>
                <button
                    className={styles.trigger}
                    aria-label="Customise options"
                >
                    <User />
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    className={styles.content}
                    sideOffset={5}
                >
                    <DropdownMenu.Item
                        className={styles.item}
                        onClick={() => setOpen(false)}
                    >
                        <Link
                            to={PAGE_PATH.COURSE_MANAGER}
                            className={styles.link}
                        >
                            <FolderPlus />
                            Course Manager
                        </Link>
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator className={styles.separator} />
                    <UserSelector />
                    <ThemeSelector />
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    )
}
