import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import Hamburger from "./Hamburger"
import NavbarLink from "./NavbarLink"

export default function NavbarSidebar() {
    return (
        <Sheet>
            <SheetTrigger>
                <Hamburger />
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Navigation</SheetTitle>
                    <SheetDescription>
                        Click links to go to page
                    </SheetDescription>
                </SheetHeader>
                <NavbarLink href="/squad">
                    Squad
                </NavbarLink>
                <NavbarLink href="/fixtures">
                    Fixtures
                </NavbarLink>
                <NavbarLink href="/login">
                    Login
                </NavbarLink>
            </SheetContent>
        </Sheet>
    )
}
  