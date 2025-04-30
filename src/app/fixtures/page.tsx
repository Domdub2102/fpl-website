import { fetchTeamsXG } from "@/lib/fetchers/teamsXG"
import FixtureTable from "@/components/Fixtures/FixtureTable"


export default async function FixturePage() {
    const teams = await fetchTeamsXG()

    return (
        <div className="bg-[#c0fcf7] flex items-center text-left p-2 lg:px-[100px] lg:pb-[100px]">
            <FixtureTable teams={teams}/>
        </div>
    )
}