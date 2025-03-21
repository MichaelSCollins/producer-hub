import { ReactNode } from 'react'

interface GridProps {
    children: ReactNode
    className?: string
}

export function Grid({ children, className = '' }: GridProps) {
    return (
        <div
            className={`
        grid grid-cols-1 
        sm:grid-cols-2 
        lg:grid-cols-3 
        xl:grid-cols-4 
        2xl:grid-cols-5 
        gap-4 
        p-4
        ${className}
      `}
        >
            {children}
        </div>
    )
}

export function GridItem({ children, className = '' }: GridProps) {
    return (
        <div className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-md transition-shadow ${className}`}>
            {children}
        </div>
    )
} 