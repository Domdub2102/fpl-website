import { fetchTeamsXG } from "@/lib/fetchers/teamsXG"
import FixtureTable from "@/components/Fixtures/FixtureTable"


export default async function FixturePage() {
    const teams = await fetchTeamsXG()

    return (
        <div className="bg-[#c0fcf7] flex flex-col items-center text-left pb-10">
            <h1 className="text-2xl font-bold m-10">Fixture Difficulty Page (currently under development)</h1>
            <FixtureTable teams={teams}/>
        </div>
    )
}