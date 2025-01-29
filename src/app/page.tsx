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

  const [numRounds, setNumRounds] = useState<{
    any: boolean;
    min: number;
    max: number;
  }>({ any: false, min: 15, max: 50 });
  const [numTeams, setNumTeams] = useState<{
    any: boolean;
    min: number;
    max: number;
  }>({ any: false, min: 10, max: 14 });
  const [draftTypes, setDraftTypes] = useState(["snake", "linear"]);
  const [playerType, setPlayerType] = useState<number | null>(null);

  const [leagueTypes, setLeagueTypes] = useState([2]);

  const [numQB, setNumQB] = useState<{
    any: boolean;
    min: number;
    max: number;
  }>({ any: true, min: 0, max: 2 });
  const [numRB, setNumRB] = useState<{
    any: boolean;
    min: number;
    max: number;
  }>({ any: true, min: 0, max: 2 });
  const [numWR, setNumWR] = useState<{
    any: boolean;
    min: number;
    max: number;
  }>({ any: true, min: 0, max: 2 });
  const [numTE, setNumTE] = useState<{
    any: boolean;
    min: number;
    max: number;
  }>({ any: true, min: 0, max: 2 });
  const [numFLEX, setNumFLEX] = useState<{
    any: boolean;
    min: number;
    max: number;
  }>({ any: true, min: 0, max: 2 });
  const [numSUPER_FLEX, setNumSUPER_FLEX] = useState<{
    any: boolean;
    min: number;
    max: number;
  }>({ any: true, min: 0, max: 2 });
  const [numQB_SF, setNumQB_SF] = useState<{
    any: boolean;
    min: number;
    max: number;
  }>({ any: true, min: 0, max: 2 });
  const [numK, setNumK] = useState<{
    any: boolean;
    min: number;
    max: number;
  }>({ any: true, min: 0, max: 2 });
  const [numWRRB_FLEX, setNumWRRB_FLEX] = useState<{
    any: boolean;
    min: number;
    max: number;
  }>({ any: true, min: 0, max: 2 });
  const [numREC_FLEX, setNumREC_FLEX] = useState<{
    any: boolean;
    min: number;
    max: number;
  }>({ any: true, min: 0, max: 2 });
  const [numDEF, setNumDEF] = useState<{
    any: boolean;
    min: number;
    max: number;
  }>({ any: true, min: 0, max: 2 });
  const [numIDP_TOTAL, setNumIDP_TOTAL] = useState<{
    any: boolean;
    min: number;
    max: number;
  }>({ any: true, min: 0, max: 10 });

  const [pass_td, setPass_td] = useState<{
    any: boolean;
    min: number;
    max: number;
  }>({ any: true, min: 4, max: 6 });
  const [bonus_rec_te, setBonus_rec_te] = useState<{
    any: boolean;
    min: number;
    max: number;
  }>({ any: true, min: 0, max: 1 });

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
        ...(numRounds.any ? {} : { minRounds: numRounds.min }),
        ...(numRounds.any ? {} : { maxRounds: numRounds.max }),
        ...(numTeams.any ? {} : { minTeams: numTeams.min }),
        ...(numTeams.any ? {} : { maxTeams: numTeams.max }),
        draftTypes,
        leagueTypes,
        playerType,
        ...(numQB.any ? {} : { minQB: numQB.min }),
        ...(numQB.any ? {} : { maxQB: numQB.max }),
        ...(numRB.any ? {} : { minRB: numRB.min }),
        ...(numRB.any ? {} : { maxRB: numRB.max }),
        ...(numWR.any ? {} : { minWR: numWR.min }),
        ...(numWR.any ? {} : { maxWR: numWR.max }),
        ...(numTE.any ? {} : { minTE: numTE.min }),
        ...(numTE.any ? {} : { maxTE: numTE.max }),
        ...(numFLEX.any ? {} : { minFLEX: numFLEX.min }),
        ...(numFLEX.any ? {} : { maxFLEX: numFLEX.max }),
        ...(numSUPER_FLEX.any ? {} : { minSUPER_FLEX: numSUPER_FLEX.min }),
        ...(numSUPER_FLEX.any ? {} : { maxSUPER_FLEX: numSUPER_FLEX.max }),
        ...(numQB_SF.any ? {} : { minQB_SF: numQB_SF.min }),
        ...(numQB_SF.any ? {} : { maxQB_SF: numQB_SF.max }),
        ...(numK.any ? {} : { minK: numK.min }),
        ...(numK.any ? {} : { maxK: numK.max }),
        ...(numWRRB_FLEX.any ? {} : { minWRRB_FLEX: numWRRB_FLEX.min }),
        ...(numWRRB_FLEX.any ? {} : { maxWRRB_FLEX: numWRRB_FLEX.max }),
        ...(numREC_FLEX.any ? {} : { minREC_FLEX: numREC_FLEX.min }),
        ...(numREC_FLEX.any ? {} : { maxREC_FLEX: numREC_FLEX.max }),
        ...(numDEF.any ? {} : { minDEF: numDEF.min }),
        ...(numDEF.any ? {} : { maxDEF: numDEF.max }),
        ...(numIDP_TOTAL.any ? {} : { minIDP_TOTAL: numIDP_TOTAL.min }),
        ...(numIDP_TOTAL.any ? {} : { maxIDP_TOTAL: numIDP_TOTAL.max }),
        ...(pass_td.any ? {} : { pass_td__min: pass_td.min }),
        ...(pass_td.any ? {} : { pass_td__max: pass_td.max }),
        ...(bonus_rec_te.any ? {} : { bonus_rec_te__min: bonus_rec_te.min }),
        ...(bonus_rec_te.any ? {} : { bonus_rec_te__max: bonus_rec_te.max }),
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
        <thead>
          <tr>
            <th colSpan={4}>Date Range</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={2}>
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

            <td colSpan={2}>
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
        </tbody>

        <thead>
          <tr>
            <th colSpan={4}>Filters</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Rounds</td>
            <td>
              <div className="flex column">
                <label>Any</label>
                <input
                  type="checkbox"
                  checked={numRounds.any}
                  onChange={(e) =>
                    setNumRounds({ ...numRounds, any: e.target.checked })
                  }
                />
              </div>
            </td>
            <td>
              <div className="flex column">
                <label>Min Rounds</label>
                <select
                  value={numRounds.min}
                  onChange={(e) =>
                    setNumRounds({
                      ...numRounds,
                      min: Number(e.target.value),
                    })
                  }
                  disabled={numRounds.any}
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
              <div className="flex column">
                <label>Max Rounds</label>
                <select
                  value={numRounds.max}
                  onChange={(e) =>
                    setNumRounds({
                      ...numRounds,
                      max: Number(e.target.value),
                    })
                  }
                  disabled={numRounds.any}
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
              <div className="flex column">
                <label>Any</label>
                <input
                  type="checkbox"
                  checked={numTeams.any}
                  onChange={(e) =>
                    setNumTeams({ ...numTeams, any: e.target.checked })
                  }
                />
              </div>
            </td>
            <td>
              <div className="flex column">
                <label>Min Teams</label>
                <select
                  value={numTeams.min}
                  onChange={(e) =>
                    setNumTeams({
                      ...numTeams,
                      min: Number(e.target.value),
                    })
                  }
                  disabled={numTeams.any}
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
              <div className="flex column">
                <label>Max Teams</label>
                <select
                  value={numTeams.max}
                  onChange={(e) =>
                    setNumTeams({
                      ...numTeams,
                      max: Number(e.target.value),
                    })
                  }
                  disabled={numTeams.any}
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
            <td>
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
              </div>
            </td>
            <td>
              <div className="flex">
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
              </div>
            </td>
            <td>
              <div className="flex">
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
            <td>Player Type</td>
            <td>
              <div className="flex column">
                <label>Rookies Only</label>
                <input
                  type="checkbox"
                  checked={playerType === 1}
                  onChange={(e) => setPlayerType(e.target.checked ? 1 : null)}
                />
              </div>
            </td>
            <td>
              <div className="flex column">
                <label>Vets Only</label>
                <input
                  type="checkbox"
                  checked={playerType === 2}
                  onChange={(e) => setPlayerType(e.target.checked ? 2 : null)}
                />
              </div>
            </td>
            <td>
              <div className="flex column">
                <label>Vets & Rookies</label>
                <input
                  type="checkbox"
                  checked={playerType === 0}
                  onChange={(e) => setPlayerType(e.target.checked ? 0 : null)}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td>League Type</td>
            <td>
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
              </div>
            </td>
            <td>
              <div className="flex">
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
              </div>
            </td>
            <td>
              <div className="flex">
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
        </tbody>

        <thead>
          <tr>
            <th colSpan={4}>Player Slots</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td># QB Slots</td>
            <td>
              <div className="flex column">
                <label>Any</label>
                <input
                  type="checkbox"
                  checked={numQB.any}
                  onChange={(e) =>
                    setNumQB({ ...numQB, any: e.target.checked })
                  }
                />
              </div>
            </td>
            <td>
              <div className="flex column">
                <label>Min</label>
                <input
                  type="number"
                  value={numQB.min}
                  onChange={(e) =>
                    setNumQB({ ...numQB, min: Number(e.target.value) })
                  }
                  disabled={numQB.any}
                />
              </div>
            </td>
            <td>
              <div className="flex column">
                <label>Max</label>
                <input
                  type="number"
                  value={numQB.max}
                  onChange={(e) =>
                    setNumQB({ ...numQB, max: Number(e.target.value) })
                  }
                  disabled={numQB.any}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td># RB Slots</td>
            <td>
              <div className="flex column">
                <label>Any</label>
                <input
                  type="checkbox"
                  checked={numRB.any}
                  onChange={(e) =>
                    setNumRB({ ...numRB, any: e.target.checked })
                  }
                />
              </div>
            </td>
            <td>
              <div className="flex column">
                <label>Min</label>
                <input
                  type="number"
                  value={numRB.min}
                  onChange={(e) =>
                    setNumRB({ ...numRB, min: Number(e.target.value) })
                  }
                  disabled={numRB.any}
                />
              </div>
            </td>
            <td>
              <div className="flex column">
                <label>Max</label>
                <input
                  type="number"
                  value={numRB.max}
                  onChange={(e) =>
                    setNumRB({ ...numRB, max: Number(e.target.value) })
                  }
                  disabled={numRB.any}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td># WR Slots</td>
            <td>
              <div className="flex column">
                <label>Any</label>
                <input
                  type="checkbox"
                  checked={numWR.any}
                  onChange={(e) =>
                    setNumWR({ ...numWR, any: e.target.checked })
                  }
                />
              </div>
            </td>
            <td>
              <div className="flex column">
                <label>Min</label>
                <input
                  type="number"
                  value={numWR.min}
                  onChange={(e) =>
                    setNumWR({ ...numWR, min: Number(e.target.value) })
                  }
                  disabled={numWR.any}
                />
              </div>
            </td>
            <td>
              <div className="flex column">
                <label>Max</label>
                <input
                  type="number"
                  value={numWR.max}
                  onChange={(e) =>
                    setNumWR({ ...numWR, max: Number(e.target.value) })
                  }
                  disabled={numWR.any}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td># TE Slots</td>
            <td>
              <div className="flex column">
                <label>Any</label>
                <input
                  type="checkbox"
                  checked={numTE.any}
                  onChange={(e) =>
                    setNumTE({ ...numTE, any: e.target.checked })
                  }
                />
              </div>
            </td>
            <td>
              <div className="flex column">
                <label>Min</label>
                <input
                  type="number"
                  value={numTE.min}
                  onChange={(e) =>
                    setNumTE({ ...numTE, min: Number(e.target.value) })
                  }
                  disabled={numTE.any}
                />
              </div>
            </td>
            <td>
              <div className="flex column">
                <label>Max</label>
                <input
                  type="number"
                  value={numTE.max}
                  onChange={(e) =>
                    setNumTE({ ...numTE, max: Number(e.target.value) })
                  }
                  disabled={numTE.any}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td># FLEX Slots</td>
            <td>
              <div className="flex column">
                <label>Any</label>
                <input
                  type="checkbox"
                  checked={numFLEX.any}
                  onChange={(e) =>
                    setNumFLEX({ ...numFLEX, any: e.target.checked })
                  }
                />
              </div>
            </td>
            <td>
              <div className="flex column">
                <label>Min</label>
                <input
                  type="number"
                  value={numFLEX.min}
                  onChange={(e) =>
                    setNumFLEX({ ...numFLEX, min: Number(e.target.value) })
                  }
                  disabled={numFLEX.any}
                />
              </div>
            </td>
            <td>
              <div className="flex column">
                <label>Max</label>
                <input
                  type="number"
                  value={numFLEX.max}
                  onChange={(e) =>
                    setNumFLEX({ ...numFLEX, max: Number(e.target.value) })
                  }
                  disabled={numFLEX.any}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td># SF Slots</td>
            <td>
              <div className="flex column">
                <label>Any</label>
                <input
                  type="checkbox"
                  checked={numSUPER_FLEX.any}
                  onChange={(e) =>
                    setNumSUPER_FLEX({
                      ...numSUPER_FLEX,
                      any: e.target.checked,
                    })
                  }
                />
              </div>
            </td>
            <td>
              <div className="flex column">
                <label>Min</label>
                <input
                  type="number"
                  value={numSUPER_FLEX.min}
                  onChange={(e) =>
                    setNumSUPER_FLEX({
                      ...numSUPER_FLEX,
                      min: Number(e.target.value),
                    })
                  }
                  disabled={numSUPER_FLEX.any}
                />
              </div>
            </td>
            <td>
              <div className="flex column">
                <label>Max</label>
                <input
                  type="number"
                  value={numSUPER_FLEX.max}
                  onChange={(e) =>
                    setNumSUPER_FLEX({
                      ...numSUPER_FLEX,
                      max: Number(e.target.value),
                    })
                  }
                  disabled={numSUPER_FLEX.any}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td># QB + SF Slots</td>
            <td>
              <div className="flex column">
                <label>Any</label>
                <input
                  type="checkbox"
                  checked={numQB_SF.any}
                  onChange={(e) =>
                    setNumQB_SF({ ...numQB_SF, any: e.target.checked })
                  }
                />
              </div>
            </td>
            <td>
              <div className="flex column">
                <label>Min</label>
                <input
                  type="number"
                  value={numQB_SF.min}
                  onChange={(e) =>
                    setNumQB_SF({ ...numQB_SF, min: Number(e.target.value) })
                  }
                  disabled={numQB_SF.any}
                />
              </div>
            </td>
            <td>
              <div className="flex column">
                <label>Max</label>
                <input
                  type="number"
                  value={numQB_SF.max}
                  onChange={(e) =>
                    setNumQB_SF({ ...numQB_SF, max: Number(e.target.value) })
                  }
                  disabled={numQB_SF.any}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td># K Slots</td>
            <td>
              <div className="flex column">
                <label>Any</label>
                <input
                  type="checkbox"
                  checked={numK.any}
                  onChange={(e) => setNumK({ ...numK, any: e.target.checked })}
                />
              </div>
            </td>
            <td>
              <div className="flex column">
                <label>Min</label>
                <input
                  type="number"
                  value={numK.min}
                  onChange={(e) =>
                    setNumK({ ...numK, min: Number(e.target.value) })
                  }
                  disabled={numK.any}
                />
              </div>
            </td>
            <td>
              <div className="flex column">
                <label>Max</label>
                <input
                  type="number"
                  value={numK.max}
                  onChange={(e) =>
                    setNumK({ ...numK, max: Number(e.target.value) })
                  }
                  disabled={numK.any}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td># WR/RB Slots</td>
            <td>
              <div className="flex column">
                <label>Any</label>
                <input
                  type="checkbox"
                  checked={numWRRB_FLEX.any}
                  onChange={(e) =>
                    setNumWRRB_FLEX({ ...numWRRB_FLEX, any: e.target.checked })
                  }
                />
              </div>
            </td>
            <td>
              <div className="flex column">
                <label>Min</label>
                <input
                  type="number"
                  value={numWRRB_FLEX.min}
                  onChange={(e) =>
                    setNumWRRB_FLEX({
                      ...numWRRB_FLEX,
                      min: Number(e.target.value),
                    })
                  }
                  disabled={numWRRB_FLEX.any}
                />
              </div>
            </td>
            <td>
              <div className="flex column">
                <label>Max</label>
                <input
                  type="number"
                  value={numWRRB_FLEX.max}
                  onChange={(e) =>
                    setNumWRRB_FLEX({
                      ...numWRRB_FLEX,
                      max: Number(e.target.value),
                    })
                  }
                  disabled={numWRRB_FLEX.any}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td># WR/TE Slots</td>
            <td>
              <div className="flex column">
                <label>Any</label>
                <input
                  type="checkbox"
                  checked={numREC_FLEX.any}
                  onChange={(e) =>
                    setNumREC_FLEX({ ...numREC_FLEX, any: e.target.checked })
                  }
                />
              </div>
            </td>
            <td>
              <div className="flex column">
                <label>Min</label>
                <input
                  type="number"
                  value={numREC_FLEX.min}
                  onChange={(e) =>
                    setNumREC_FLEX({
                      ...numREC_FLEX,
                      min: Number(e.target.value),
                    })
                  }
                  disabled={numREC_FLEX.any}
                />
              </div>
            </td>
            <td>
              <div className="flex column">
                <label>Max</label>
                <input
                  type="number"
                  value={numREC_FLEX.max}
                  onChange={(e) =>
                    setNumREC_FLEX({
                      ...numREC_FLEX,
                      max: Number(e.target.value),
                    })
                  }
                  disabled={numREC_FLEX.any}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td># DEF Slots</td>
            <td>
              <div className="flex column">
                <label>Any</label>
                <input
                  type="checkbox"
                  checked={numDEF.any}
                  onChange={(e) =>
                    setNumDEF({ ...numDEF, any: e.target.checked })
                  }
                />
              </div>
            </td>
            <td>
              <div className="flex column">
                <label>Min</label>
                <input
                  type="number"
                  value={numDEF.min}
                  onChange={(e) =>
                    setNumDEF({ ...numDEF, min: Number(e.target.value) })
                  }
                  disabled={numDEF.any}
                />
              </div>
            </td>
            <td>
              <div className="flex column">
                <label>Max</label>
                <input
                  type="number"
                  value={numDEF.max}
                  onChange={(e) =>
                    setNumDEF({ ...numDEF, max: Number(e.target.value) })
                  }
                  disabled={numDEF.any}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td># DL + LB + DB + IDP FLEX Slots</td>
            <td>
              <div className="flex column">
                <label>Any</label>
                <input
                  type="checkbox"
                  checked={numIDP_TOTAL.any}
                  onChange={(e) =>
                    setNumIDP_TOTAL({ ...numIDP_TOTAL, any: e.target.checked })
                  }
                />
              </div>
            </td>
            <td>
              <div className="flex column">
                <label>Min</label>
                <input
                  type="number"
                  value={numIDP_TOTAL.min}
                  onChange={(e) =>
                    setNumIDP_TOTAL({
                      ...numIDP_TOTAL,
                      min: Number(e.target.value),
                    })
                  }
                  disabled={numIDP_TOTAL.any}
                />
              </div>
            </td>
            <td>
              <div className="flex column">
                <label>Max</label>
                <input
                  type="number"
                  value={numIDP_TOTAL.max}
                  onChange={(e) =>
                    setNumIDP_TOTAL({
                      ...numIDP_TOTAL,
                      max: Number(e.target.value),
                    })
                  }
                  disabled={numIDP_TOTAL.any}
                />
              </div>
            </td>
          </tr>
        </tbody>

        <thead>
          <tr>
            <th colSpan={4}>Scoring Settings</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Pass TD</td>
            <td>
              <div className="flex column">
                <label>Any</label>
                <input
                  type="checkbox"
                  checked={pass_td.any}
                  onChange={(e) =>
                    setPass_td({ ...pass_td, any: e.target.checked })
                  }
                />
              </div>
            </td>
            <td>
              <div className="flex column">
                <label>Min</label>
                <input
                  type="number"
                  value={pass_td.min}
                  onChange={(e) =>
                    setPass_td({ ...pass_td, min: Number(e.target.value) })
                  }
                  disabled={pass_td.any}
                  placeholder="0"
                />
              </div>
            </td>
            <td>
              <div className="flex column">
                <label>Max</label>
                <input
                  type="number"
                  value={pass_td.max}
                  onChange={(e) =>
                    setPass_td({ ...pass_td, max: Number(e.target.value) })
                  }
                  disabled={pass_td.any}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td>Bonus Rec TE</td>
            <td>
              <div className="flex column">
                <label>Any</label>
                <input
                  type="checkbox"
                  checked={bonus_rec_te.any}
                  onChange={(e) =>
                    setBonus_rec_te({
                      ...bonus_rec_te,
                      any: e.target.checked,
                    })
                  }
                />
              </div>
            </td>
            <td>
              <div className="flex column">
                <label>Min</label>
                <input
                  type="number"
                  value={bonus_rec_te.min}
                  onChange={(e) =>
                    setBonus_rec_te({
                      ...bonus_rec_te,
                      min: Number(e.target.value),
                    })
                  }
                  disabled={bonus_rec_te.any}
                  placeholder="0"
                />
              </div>
            </td>
            <td>
              <div className="flex column">
                <label>Max</label>
                <input
                  type="number"
                  value={bonus_rec_te.max}
                  onChange={(e) =>
                    setBonus_rec_te({
                      ...bonus_rec_te,
                      max: Number(e.target.value),
                    })
                  }
                  disabled={bonus_rec_te.any}
                />
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
            <th>
              {result.filters["draftTypes[]"] === "auction"
                ? "budget %"
                : "ADP"}
            </th>
            <th>Undrafted %</th>
          </tr>
        </thead>
        <tbody>
          {(result.adp || [])
            .filter((pick) => pick.undrafted_percentage < undrafted_percentage)
            .sort((a, b) => {
              if (result.filters["draftTypes[]"] === "auction") {
                return b.adp - a.adp;
              } else {
                return a.adp - b.adp;
              }
            })
            .map((pick) => (
              <tr key={pick.player_id}>
                <td>
                  {allplayers[pick.player_id]?.full_name || pick.player_id}
                </td>
                <td>
                  {result.filters["draftTypes[]"] === "auction"
                    ? Math.round(pick.adp) + "%"
                    : Math.ceil(Math.round(pick.adp) / 12) +
                      "." +
                      (Math.round(pick.adp) % 12 || 12).toLocaleString(
                        "en-US",
                        {
                          minimumIntegerDigits: 2,
                        }
                      )}
                </td>
                <td>{pick.undrafted_percentage}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
}
