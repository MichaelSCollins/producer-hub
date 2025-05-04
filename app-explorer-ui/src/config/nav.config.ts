interface NavContent {
    title: string;
    items: Array<NavbarItem>;
}

interface NavbarItem {
    label: string;
    Icon: string;
    href: string;
}

const navContent: NavContent = {
    "title": "Producerhub",
    "items": [
        {
            "label": "My Audio",
            "Icon": "fa-solid fa-music",
            "href": "/audio-storage"
        },
        {
            "label": "Subscription",
            "Icon": "fa-solid fa-user",
            "href": "/subscriptions"
        },
        {
            "label": "Login",
            "Icon": "fa-solid fa-user",
            "href": "/login"
        },
        {
            "label": "Register",
            "Icon": "fa-solid fa-user",
            "href": "/register"
        }
    ]
}

export default navContent;