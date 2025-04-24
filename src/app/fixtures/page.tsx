import { fetchTeamsXG } from "@/lib/fetchers/teamsXG"
import FixtureTable from "@/components/Fixtures/FixtureTable"


export default async function FixturePage() {
    const teams = await fetchTeamsXG()

    console.log(teams.slice(0,1))
    /**
     * Can use table-fixed or table-auto -> play with both
     * Idea:
     * - use table-fixed dynamically, making each column a fraction of the total width, up to a mximum
     * - if above the maximum, then use the overflow property
     */
    return (
        <div className="bg-[#c0fcf7] flex flex-col items-center text-left pb-10">
            <h1 className="text-2xl font-bold m-10">Fixture Difficulty Page (currently under development)</h1>
            <FixtureTable teams={teams}/>
        </div>
    )
}