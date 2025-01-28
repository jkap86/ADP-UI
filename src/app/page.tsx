"use client";

import { useState, useEffect } from "react";
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

export default function Home() {
  const [allplayers, setAllplayers] = useState<{
    [key: string]: Allplayer;
  }>({});
  const [startKey, setStartKey] = useState("start_time");
  const [startDate, setStartDate] = useState(
    new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 30)
      .toISOString()
      .split("T")[0]
  );
  const [endKey, setEndKey] = useState("last_picked");
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [minRounds, setMinRounds] = useState(15);
  const [maxRounds, setMaxRounds] = useState(50);
  const [minTeams, setMinTeams] = useState(10);
  const [maxTeams, setMaxTeams] = useState(14);
  const [draftTypes, setDraftTypes] = useState(["snake", "linear"]);

  const [leagueTypes, setLeagueTypes] = useState([2]);

  const [numQB, setNumQB] = useState<number | null>(null);
  const [numRB, setNumRB] = useState<number | null>(null);
  const [numWR, setNumWR] = useState<number | null>(null);
  const [numTE, setNumTE] = useState<number | null>(null);
  const [numFLEX, setNumFLEX] = useState<number | null>(null);
  const [numSUPER_FLEX, setNumSUPER_FLEX] = useState<number | null>(null);

  /*
  const [numWRRB_FLEX, setNumWRRB_FLEX] = useState<number | null>(null);
  const [numREC_FLEX, setNumREC_FLEX] = useState<number | null>(null);
  const [numK, setNumK] = useState<number | null>(null);
  const [numDEF, setNumDEF] = useState<number | null>(null);
  const [numDL, setNumDL] = useState<number | null>(null);
  const [numLB, setNumLB] = useState<number | null>(null);
  const [numDB, setNumDB] = useState<number | null>(null);
  const [numIDP_FLEX, setNumIDP_FLEX] = useState<number | null>(null);
  const [numSTARTER, setNumSTARTER] = useState<number | null>(null);
  const [numBN, setNumBN] = useState<number | null>(null);
  */

  const [pass_td, setPass_td] = useState<number | null>(null);
  const [bonus_rec_te, setBonus_rec_te] = useState<number | null>(null);

  const [result, setResult] = useState<{
    draft_count: number;
    adp: {
      player_id: string;
      adp: number;
      undrafted_percentage: number;
    }[];
    filters: Record<string, string | string[]>;
  }>({
    draft_count: 0,
    adp: [],
    filters: {},
  });

  const [undrafted_percentage, setUndrafted_percentage] = useState(10);

  useEffect(() => {
    const fetchAllplayers = async () => {
      const response = await axios.get("/api/allplayers");

      const allplayers = Object.fromEntries(
        response.data.map((player: Allplayer) => [player.player_id, player])
      );
      setAllplayers(allplayers);
    };
    fetchAllplayers();
  }, []);

  const handleSubmit = async () => {
    const response = await axios.get("/api/adp", {
      params: {
        startKey,
        startDate,
        endKey,
        endDate,
        minRounds,
        maxRounds,
        minTeams,
        maxTeams,
        draftTypes,
        leagueTypes,
        numQB,
        numRB,
        numWR,
        numTE,
        numFLEX,
        numSUPER_FLEX,
        pass_td,
        bonus_rec_te,
      },
    });

    console.log({
      response,
    });

    setResult(response.data);
  };

  return (
    <>
      <h1>ADP</h1>
      <table className="filters">
        <tbody>
          <tr>
            <td>Dates</td>
            <td>
              <div className="flex column">
                <select
                  value={startKey}
                  onChange={(e) => setStartKey(e.target.value)}
                >
                  <option value="start_time">Draft started after</option>
                  <option value="last_picked">Draft ended after</option>
                </select>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
            </td>
            <td>
              <div className="flex column">
                <select
                  value={endKey}
                  onChange={(e) => setEndKey(e.target.value)}
                >
                  <option value="start_time">Draft started before</option>
                  <option value="last_picked">Draft ended before</option>
                </select>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td>Rounds</td>
            <td>
              <div className="flex">
                <label>Min Rounds</label>
                <select
                  value={minRounds}
                  onChange={(e) => setMinRounds(Number(e.target.value))}
                >
                  {Array.from({ length: 50 }, (_, i) => (
                    <option key={i} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            </td>
            <td>
              <div className="flex">
                <label>Max Rounds</label>
                <select
                  value={maxRounds}
                  onChange={(e) => setMaxRounds(Number(e.target.value))}
                >
                  {Array.from({ length: 50 }, (_, i) => (
                    <option key={i} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            </td>
          </tr>
          <tr>
            <td>Teams</td>
            <td>
              <div className="flex">
                <label>Min Teams</label>
                <select
                  value={minTeams}
                  onChange={(e) => setMinTeams(Number(e.target.value))}
                >
                  {Array.from({ length: 32 }, (_, i) => (
                    <option key={i} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            </td>
            <td>
              <div className="flex">
                <label>Max Teams</label>
                <select
                  value={maxTeams}
                  onChange={(e) => setMaxTeams(Number(e.target.value))}
                >
                  {Array.from({ length: 32 }, (_, i) => (
                    <option key={i} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            </td>
          </tr>
          <tr>
            <td>Draft Type</td>
            <td colSpan={2}>
              <div className="flex">
                <div>
                  <label>Snake</label>
                  <input
                    type="checkbox"
                    checked={draftTypes.includes("snake")}
                    onChange={(e) =>
                      setDraftTypes(
                        e.target.checked
                          ? [
                              ...draftTypes.filter((t) => t !== "auction"),
                              "snake",
                            ]
                          : draftTypes.filter((t) => t !== "snake")
                      )
                    }
                  />
                </div>
                <div>
                  <label>Linear</label>
                  <input
                    type="checkbox"
                    checked={draftTypes.includes("linear")}
                    onChange={(e) =>
                      setDraftTypes(
                        e.target.checked
                          ? [
                              ...draftTypes.filter((t) => t !== "auction"),
                              "linear",
                            ]
                          : draftTypes.filter((t) => t !== "linear")
                      )
                    }
                  />
                </div>
                <div>
                  <label>Auction</label>
                  <input
                    type="checkbox"
                    checked={draftTypes.includes("auction")}
                    onChange={(e) =>
                      setDraftTypes(
                        e.target.checked
                          ? ["auction"]
                          : draftTypes.filter((t) => t !== "auction")
                      )
                    }
                  />
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td>League Type</td>
            <td colSpan={2}>
              <div className="flex">
                <div>
                  <label>Dynasty</label>
                  <input
                    type="checkbox"
                    checked={leagueTypes.includes(2)}
                    onChange={(e) =>
                      setLeagueTypes(
                        e.target.checked
                          ? [...leagueTypes, 2]
                          : leagueTypes.filter((t) => t !== 2)
                      )
                    }
                  />
                </div>
                <div>
                  <label>Keeper</label>
                  <input
                    type="checkbox"
                    checked={leagueTypes.includes(1)}
                    onChange={(e) =>
                      setLeagueTypes(
                        e.target.checked
                          ? [...leagueTypes, 1]
                          : leagueTypes.filter((t) => t !== 1)
                      )
                    }
                  />
                </div>
                <div>
                  <label>Redraft</label>
                  <input
                    type="checkbox"
                    checked={leagueTypes.includes(0)}
                    onChange={(e) =>
                      setLeagueTypes(
                        e.target.checked
                          ? [...leagueTypes, 0]
                          : leagueTypes.filter((t) => t !== 0)
                      )
                    }
                  />
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td># QB Slots</td>
            <td colSpan={2}>
              <div className="flex">
                <select
                  value={numQB !== null ? numQB : ""}
                  onChange={(e) =>
                    setNumQB(
                      e.target.value === "" ? null : Number(e.target.value)
                    )
                  }
                >
                  <option value="">ANY</option>
                  {Array.from({ length: 11 }, (_, i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>
            </td>
          </tr>
          <tr>
            <td># RB Slots</td>
            <td colSpan={2}>
              <div className="flex">
                <select
                  value={numRB !== null ? numRB : ""}
                  onChange={(e) =>
                    setNumRB(
                      e.target.value === "" ? null : Number(e.target.value)
                    )
                  }
                >
                  <option value="">ANY</option>
                  {Array.from({ length: 11 }, (_, i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>
            </td>
          </tr>
          <tr>
            <td># WR Slots</td>
            <td colSpan={2}>
              <div className="flex">
                <select
                  value={numWR !== null ? numWR : ""}
                  onChange={(e) =>
                    setNumWR(
                      e.target.value === "" ? null : Number(e.target.value)
                    )
                  }
                >
                  <option value="">ANY</option>
                  {Array.from({ length: 11 }, (_, i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>
            </td>
          </tr>
          <tr>
            <td># TE Slots</td>
            <td colSpan={2}>
              <div className="flex">
                <select
                  value={numTE !== null ? numTE : ""}
                  onChange={(e) =>
                    setNumTE(
                      e.target.value === "" ? null : Number(e.target.value)
                    )
                  }
                >
                  <option value="">ANY</option>
                  {Array.from({ length: 11 }, (_, i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>
            </td>
          </tr>
          <tr>
            <td># FLEX Slots</td>
            <td colSpan={2}>
              <div className="flex">
                <select
                  value={numFLEX !== null ? numFLEX : ""}
                  onChange={(e) =>
                    setNumFLEX(
                      e.target.value === "" ? null : Number(e.target.value)
                    )
                  }
                >
                  <option value="">ANY</option>
                  {Array.from({ length: 11 }, (_, i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>
            </td>
          </tr>
          <tr>
            <td># SF Slots</td>
            <td colSpan={2}>
              <div className="flex">
                <select
                  value={numSUPER_FLEX !== null ? numSUPER_FLEX : ""}
                  onChange={(e) =>
                    setNumSUPER_FLEX(
                      e.target.value === "" ? null : Number(e.target.value)
                    )
                  }
                >
                  <option value="">ANY</option>
                  {Array.from({ length: 11 }, (_, i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>
            </td>
          </tr>
          <tr>
            <td>Pass TD</td>
            <td colSpan={2}>
              <div className="flex">
                <div>
                  <label>Any</label>
                  <input
                    type="checkbox"
                    checked={pass_td === null}
                    onChange={(e) =>
                      e.target.checked ? setPass_td(null) : setPass_td(0)
                    }
                  />
                </div>
                <div>
                  <input
                    type="number"
                    value={pass_td || ""}
                    onChange={(e) => setPass_td(Number(e.target.value))}
                    disabled={pass_td === null}
                    placeholder="0"
                  />
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td>Bonus Rec TE</td>
            <td colSpan={2}>
              <div className="flex">
                <div>
                  <label>Any</label>
                  <input
                    type="checkbox"
                    checked={bonus_rec_te === null}
                    onChange={(e) =>
                      setBonus_rec_te(e.target.checked ? null : 0)
                    }
                  />
                </div>
                <div>
                  <input
                    type="number"
                    value={bonus_rec_te || ""}
                    onChange={(e) => setBonus_rec_te(Number(e.target.value))}
                    disabled={bonus_rec_te === null}
                    placeholder="0"
                  />
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="flex">
        <button onClick={handleSubmit}>Submit</button>
      </div>

      <h1>Number of drafts: {result.draft_count}</h1>
      <div className="filters">
        <h2>Filters</h2>
        <ul>
          {Object.entries(result.filters).map(([key, value]) => (
            <li key={key}>
              {key}: {Array.isArray(value) ? value.join(", ") : value}
            </li>
          ))}
        </ul>
      </div>
      <h2>
        Showing players undrafted in less than{" "}
        <span className="undrafted-percentage">
          {undrafted_percentage}%
          <select
            className="transparent"
            value={undrafted_percentage}
            onChange={(e) => setUndrafted_percentage(Number(e.target.value))}
          >
            {[1, 5, 10, 20, 30, 40, 50].map((value) => (
              <option key={value} value={value}>
                {value}%
              </option>
            ))}
          </select>
        </span>{" "}
        of drafts
      </h2>

      <table className="adp">
        <thead>
          <tr>
            <th>Player</th>
            <th>ADP</th>
            <th>Undrafted %</th>
          </tr>
        </thead>
        <tbody>
          {result.adp
            .filter((pick) => pick.undrafted_percentage < undrafted_percentage)
            .sort((a, b) => a.adp - b.adp)
            .map((pick) => (
              <tr key={pick.player_id}>
                <td>
                  {allplayers[pick.player_id]?.full_name || pick.player_id}
                </td>
                <td>
                  {Math.floor(pick.adp / 12) + 1}.
                  {(((Math.round(pick.adp) - 1) % 12) + 1)
                    .toString()
                    .padStart(2, "0")}
                </td>
                <td>{pick.undrafted_percentage}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
}
