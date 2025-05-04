const NavWrapper = ({ children }: {
    children: React.ReactNode;
}) => <nav className="bg-gray-800 text-white">
        <div className="container mx-auto flex justify-between items-center p-4">
            {children}
        </div>
    </nav>
export default NavWrapper;