import { NextResponse } from "next/server";
import pool from "@/lib/pool";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const startKey = searchParams.get("startKey");
  const startDate = searchParams.get("startDate");
  const endKey = searchParams.get("endKey");
  const endDate = searchParams.get("endDate");
  const minRounds = searchParams.get("minRounds");
  const maxRounds = searchParams.get("maxRounds");
  const minTeams = searchParams.get("minTeams");
  const maxTeams = searchParams.get("maxTeams");
  const draftTypes = searchParams.getAll("draftTypes[]");
  const leagueTypes = searchParams.getAll("leagueTypes[]").map(Number);
  const numQB = searchParams.get("numQB");
  const numRB = searchParams.get("numRB");
  const numWR = searchParams.get("numWR");
  const numTE = searchParams.get("numTE");
  const numFLEX = searchParams.get("numFLEX");
  const numSUPER_FLEX = searchParams.get("numSUPER_FLEX");
  const pass_td = searchParams.get("pass_td");
  const bonus_rec_te = searchParams.get("bonus_rec_te");

  const query = `
    WITH recent_drafts AS (
        SELECT d.* 
        FROM adp__drafts d
        JOIN adp__leagues l ON l.league_id = d.league_id
        WHERE d.status = 'complete' 
            AND d.${startKey} > $1 AND d.${endKey} < $2
            AND (d.settings->>'rounds')::INT >= $3 
            AND (d.settings->>'rounds')::INT <= $4
            AND (d.settings->>'teams')::INT >= $5   
            AND (d.settings->>'teams')::INT <= $6
            AND d.type = ANY($7)
            AND l.settings->>'type' = ANY($8)
            ${
              numQB !== null && numQB !== undefined
                ? `AND (
                        COALESCE(d.settings->>'slots_qb', '0')::INT
                    ) = ${numQB}`
                : ""
            }
            ${
              numRB !== null && numRB !== undefined
                ? `AND (
                        COALESCE(d.settings->>'slots_rb', '0')::INT
                    ) = ${numRB}`
                : ""
            }
            ${
              numWR !== null && numWR !== undefined
                ? `AND (
                        COALESCE(d.settings->>'slots_wr', '0')::INT
                    ) = ${numWR}`
                : ""
            }
            ${
              numTE !== null && numTE !== undefined
                ? `AND (
                        COALESCE(d.settings->>'slots_te', '0')::INT
                    ) = ${numTE}`
                : ""
            }
            ${
              numFLEX !== null && numFLEX !== undefined
                ? `AND (
                        COALESCE(d.settings->>'slots_flex', '0')::INT
                    ) = ${numFLEX}`
                : ""
            }
            ${
              numSUPER_FLEX !== null && numSUPER_FLEX !== undefined
                ? `AND (
                        COALESCE(d.settings->>'slots_super_flex', '0')::INT
                    ) = ${numSUPER_FLEX}`
                : ""
            }
            ${
              pass_td !== null && pass_td !== undefined
                ? `AND (
                        COALESCE(l.scoring_settings->>'pass_td', '0')::FLOAT
                    ) = ${pass_td}`
                : ""
            }
            ${
              bonus_rec_te !== null && bonus_rec_te !== undefined
                ? `AND (
                        COALESCE(l.scoring_settings->>'bonus_rec_te', '0')::FLOAT
                    ) = ${bonus_rec_te}`
                : ""
            }
    ),
    draft_count AS (
        SELECT COUNT(*) AS draft_count
        FROM recent_drafts
    ),
    all_players AS (
        SELECT DISTINCT key_value.key AS player_id
        FROM recent_drafts
        CROSS JOIN LATERAL jsonb_each(picks) AS key_value
    ),
    all_picks AS (
        SELECT
            a.player_id,
            COALESCE(SUM(rp.pick_number), 0) AS pick_sum,
            COUNT(rp.pick_number) AS pick_count
        FROM all_players a
        LEFT JOIN (
            SELECT
                key_value.key AS player_id,
                key_value.value::NUMERIC AS pick_number
            FROM recent_drafts
            CROSS JOIN LATERAL jsonb_each(picks) AS key_value
        ) rp ON a.player_id = rp.player_id
        GROUP BY a.player_id
    )
    SELECT jsonb_build_object(
        'draft_count', (SELECT draft_count FROM draft_count),
        'adp', jsonb_agg(
            jsonb_build_object(
                'player_id', a.player_id,
                'adp', ROUND(
                    (a.pick_sum)::NUMERIC
                    / NULLIF(a.pick_count, 0), 2
                ),
                'undrafted_percentage', ROUND(
                    (dc.draft_count - a.pick_count)::NUMERIC
                    / NULLIF(dc.draft_count, 0), 3
                ) * 100
            )
        )
    ) AS result
    FROM all_picks a
    CROSS JOIN (SELECT draft_count FROM draft_count) dc;
  `;

  const result = await pool.query(query, [
    new Date(startDate as string),
    new Date(endDate as string),
    minRounds,
    maxRounds,
    minTeams,
    maxTeams,
    draftTypes,
    leagueTypes,
  ]);

  const paramsObject: Record<string, string | string[]> = {};
  searchParams.forEach((value, key) => {
    // If the key already exists, convert to an array (or append to the existing array)
    if (paramsObject[key]) {
      paramsObject[key] = Array.isArray(paramsObject[key])
        ? [...(paramsObject[key] as string[]), value]
        : [paramsObject[key] as string, value];
    } else {
      paramsObject[key] = value;
    }
  });

  return NextResponse.json({
    ...result.rows[0].result,
    filters: paramsObject,
  });
}
