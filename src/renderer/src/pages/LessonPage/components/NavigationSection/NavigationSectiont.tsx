import styles from './NavigationSection.module.scss'
import { PAGE_PATH } from '@renderer/constants'
import { useLessonStore } from '@renderer/store'
import { ArrowBigLeft, ArrowBigRight, Badge, BadgeCheck } from 'lucide-react'
import { FC } from 'react'
import { Link } from 'react-router-dom'

import { ProgressLessonViewModel } from '@/types'

export const NavigationSection: FC = () => {
    const course = useLessonStore((state) => state.course)
    const chapter = useLessonStore((state) => state.chapter)
    const lesson = useLessonStore((state) => state.lesson)
    const adjacentLessons = useLessonStore((state) => state.adjacentLessons)

    if (!course || !chapter || !lesson) {
        console.error('Navigation: Missing course, chapter, or lesson data')
        return null
    }

    return (
        <section>
            <nav className={styles.navigation}>
                <Link to={`${PAGE_PATH.COURSES}/${course.id}`}>{course.name}</Link>
                <span>{'>'}</span>
                <Link to={`${PAGE_PATH.COURSES}/${course.id}?chapterId=${chapter.id}`}>
                    {`${chapter.position}. ${chapter.name}`}
                </Link>
                <span>{'>'}</span>
                <Link to={`${PAGE_PATH.COURSES}/${course.id}?chapterId=${chapter.id}`}>
                    {`${lesson.position}. ${lesson.name}`}
                </Link>
            </nav>
            <div className={styles.separator}></div>
            <div className={styles['adjacent-lessons']}>
                {adjacentLessons?.previous && (
                    <Link
                        className={styles['adjacent-lessons__link']}
                        to={`${PAGE_PATH.COURSES}/${course.id}/${adjacentLessons.previous.chapterId}/${adjacentLessons.previous.id}`}
                    >
                        <ArrowBigLeft />
                        {`${adjacentLessons.previous.position}. ${adjacentLessons.previous.name}`}
                    </Link>
                )}
                <LessonProgressIcon progress={lesson.lessonProgress} />
                {adjacentLessons?.next && (
                    <Link
                        className={styles['adjacent-lessons__link']}
                        to={`${PAGE_PATH.COURSES}/${course.id}/${adjacentLessons.next.chapterId}/${adjacentLessons.next.id}`}
                    >
                        {`${adjacentLessons.next.position}. ${adjacentLessons.next.name}`}
                        <ArrowBigRight />
                    </Link>
                )}
            </div>
            <div className={styles.separator}></div>
        </section>
    )
}

interface LessonProgressIconProps {
    progress: ProgressLessonViewModel[]
}

const LessonProgressIcon: FC<LessonProgressIconProps> = () => {
    const status = useLessonStore((state) => state.lesson?.lessonProgress[0].status)
    if (!status) {
        return <Badge className={styles['progress-icon__base']} />
    } else if (status === 'IN_PROGRESS') {
        return <Badge className={styles['progress-icon__info']} />
    } else if (status === 'COMPLETED') {
        return <BadgeCheck className={styles['progress-icon__check']} />
    } else {
        return <Badge className={styles['progress-icon__base']} />
    }
}
