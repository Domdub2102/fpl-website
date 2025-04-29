'use client'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import React from 'react'
import Hamburger from "./Hamburger"
import NavbarLink from "./NavbarLink"

export default function NavbarDropdown() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Hamburger />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black">
                <DropdownMenuItem>
                    <NavbarLink href="/squad">
                        Squad
                    </NavbarLink>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <NavbarLink href="/fixtures">
                        Fixtures
                    </NavbarLink>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <NavbarLink href="/">
                        Login
                    </NavbarLink>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
  