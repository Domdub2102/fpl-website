import NavbarLink from "./NavbarLink";

export default function NavbarLinks() {
    return (
        <div className="mr-4">
            <NavbarLink href="/squad">
                Squad
            </NavbarLink>
            <NavbarLink href="/fixtures">
                Fixtures
            </NavbarLink>
            <NavbarLink href="/">
                Login
            </NavbarLink>
        </div>
    )
}