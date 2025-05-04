
import Link from "next/link";
import config from "../../config/nav.config"

interface NavbarItem {
    href: string;
    label: string;
}

const NavItems = () => <ul className="flex space-x-4">
    {config.items.map((link: NavbarItem, index: number) => (
        <li key={index}>
            <Link href={link.href}>
                <span className="hover:underline">{link.label}</span>
            </Link>
        </li>
    ))}
</ul>

export default NavItems;