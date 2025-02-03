import { NextResponse } from "next/server";
import fs from "fs";
import axios from "axios";

type Allplayer = {
  player_id: string;
  position: string;
  team: string;
  full_name: string;
  age: string;
  fantasy_positions: string[];
  years_exp: number;
};

export async function GET() {
  const allplayers_file = fs.readFileSync(
    "./src/app/api/allplayers/allplayers.json",
    "utf8"
  );

  const allplayers = JSON.parse(allplayers_file);

  if (allplayers.updated_at > new Date().getTime() - 1000 * 60 * 60 * 24) {
    return NextResponse.json(allplayers.data);
  } else {
    const response: { data: { [key: string]: Allplayer } } = await axios.get(
      "https://api.sleeper.app/v1/players/nfl"
    );

    const allplayers_updated = Object.values(response.data).map((player) => {
      return {
        player_id: player.player_id,
        position: player.position,
        team: player.team || "FA",
        full_name: player.full_name,
        age: player.age,
        years_exp: player.years_exp || 0,
      };
    });

    fs.writeFileSync(
      "./src/app/api/allplayers/allplayers.json",
      JSON.stringify({
        data: allplayers_updated,
        updated_at: new Date().getTime(),
      })
    );

    return NextResponse.json(allplayers_updated);
  }
}
