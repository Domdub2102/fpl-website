// returns all fixtures from the FPL API

import { NextResponse } from "next/server";

export async function GET() {
    const url = "https://fantasy.premierleague.com/api/fixtures/"
    const res = await fetch(url)

    if (!res.ok) {
        throw new Error("Failed to fetch fixtures")
    }

    const fixtures = await res.json()

    return NextResponse.json(fixtures)
}