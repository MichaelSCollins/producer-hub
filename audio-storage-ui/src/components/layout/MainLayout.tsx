// import Link from 'next/link';

interface MainLayoutProps {
    children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="bg-gray-700">
            {/* </div>//     <nav className="bg-white shadow">
        //         <div className="container mx-auto px-4">
        //             <div className="flex justify-between h-16">
        //                 <div className="flex">
        //                     <Link
        //                         href="/"
        //                         className="flex items-center text-xl font-bold text-blue-400"
        //                     >
        //                         Audio Viewer
        //                     </Link>
        //                 </div>
        //             </div>
        //         </div>
        //     </nav> */}
            <div className="mx-auto p-4">
                {children}
            </div>
            <footer className="shadow absolute bottom-0 z-50 right-0">
                <div className="container mx-auto px-4 py-6">
                    <p className="text-center text-gray-600">
                        © {new Date().getFullYear()} Audio Viewer. All rights reserved.
                    </p>
                </div>
            </footer>
        </div >
    );
} 