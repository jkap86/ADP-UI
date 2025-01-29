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
  const playerType = searchParams.get("playerType");
  const leagueTypes = searchParams.getAll("leagueTypes[]").map(Number);
  const minQB = searchParams.get("minQB");
  const maxQB = searchParams.get("maxQB");
  const minRB = searchParams.get("minRB");
  const maxRB = searchParams.get("maxRB");
  const minWR = searchParams.get("minWR");
  const maxWR = searchParams.get("maxWR");
  const minTE = searchParams.get("minTE");
  const maxTE = searchParams.get("maxTE");
  const minFLEX = searchParams.get("minFLEX");
  const maxFLEX = searchParams.get("maxFLEX");
  const minSUPER_FLEX = searchParams.get("minSUPER_FLEX");
  const maxSUPER_FLEX = searchParams.get("maxSUPER_FLEX");
  const minQB_SF = searchParams.get("minQB_SF");
  const maxQB_SF = searchParams.get("maxQB_SF");
  const minK = searchParams.get("minK");
  const maxK = searchParams.get("maxK");
  const minWRRB_FLEX = searchParams.get("minWRRB_FLEX");
  const maxWRRB_FLEX = searchParams.get("maxWRRB_FLEX");
  const minREC_FLEX = searchParams.get("minREC_FLEX");
  const maxREC_FLEX = searchParams.get("maxREC_FLEX");
  const minDEF = searchParams.get("minDEF");
  const maxDEF = searchParams.get("maxDEF");
  const minIDP_TOTAL = searchParams.get("minIDP_TOTAL");
  const maxIDP_TOTAL = searchParams.get("maxIDP_TOTAL");
  const pass_td__min = searchParams.get("pass_td__min");
  const pass_td__max = searchParams.get("pass_td__max");
  const bonus_rec_te__min = searchParams.get("bonus_rec_te__min");
  const bonus_rec_te__max = searchParams.get("bonus_rec_te__max");

  const slotQueries = [
    {
      min: minQB,
      max: maxQB,
      keys: ["slots_qb"],
    },
    {
      min: minRB,
      max: maxRB,
      keys: ["slots_rb"],
    },
    {
      min: minWR,
      max: maxWR,
      keys: ["slots_wr"],
    },
    {
      min: minTE,
      max: maxTE,
      keys: ["slots_te"],
    },
    {
      min: minFLEX,
      max: maxFLEX,
      keys: ["slots_flex"],
    },
    {
      min: minSUPER_FLEX,
      max: maxSUPER_FLEX,
      keys: ["slots_super_flex"],
    },
    {
      min: minK,
      max: maxK,
      keys: ["slots_k"],
    },
    {
      min: minWRRB_FLEX,
      max: maxWRRB_FLEX,
      keys: ["slots_wrrb_flex"],
    },
    {
      min: minREC_FLEX,
      max: maxREC_FLEX,
      keys: ["slots_rec_flex"],
    },
    {
      min: minDEF,
      max: maxDEF,
      keys: ["slots_def"],
    },
    {
      min: minIDP_TOTAL,
      max: maxIDP_TOTAL,
      keys: ["slots_dl", "slots_lb", "slots_db", "slots_idp_flex"],
    },
  ]
    .map(({ min, max, keys }) => {
      if (min && max) {
        const sum = keys
          .map((key) => `COALESCE(d.settings->>'${key}', '0')::INT`)
          .join(" + ");
        return `AND (${sum}) >= ${min} AND (${sum}) <= ${max}`;
      }
      return "";
    })
    .join(" ");

  const scoringSettingsQueries = [
    {
      min: pass_td__min,
      max: pass_td__max,
      key: "pass_td",
    },
    {
      min: bonus_rec_te__min,
      max: bonus_rec_te__max,
      key: "bonus_rec_te",
    },
  ]
    .map(({ min, max, key }) => {
      if (min && max) {
        return `
          AND (COALESCE(l.scoring_settings->>'${key}', '0')::FLOAT) >= ${min} 
          AND (COALESCE(l.scoring_settings->>'${key}', '0')::FLOAT) <= ${max}
        `;
      }
      return "";
    })
    .join(" ");

  const query = `
    WITH recent_drafts AS (
        SELECT d.* 
        FROM adp__drafts d
        JOIN adp__leagues l ON l.league_id = d.league_id
        WHERE d.status = 'complete' 
            AND d.${startKey} > $1 AND d.${endKey} < $2
            ${
              minRounds !== null && minRounds !== undefined
                ? `AND (d.settings->>'rounds')::INT >= ${minRounds}`
                : ""
            }
            ${
              maxRounds !== null && maxRounds !== undefined
                ? `AND (d.settings->>'rounds')::INT <= ${maxRounds}`
                : ""
            }
            ${
              minTeams !== null && minTeams !== undefined
                ? `AND (d.settings->>'teams')::INT >= ${minTeams}`
                : ""
            }
            ${
              maxTeams !== null && maxTeams !== undefined
                ? `AND (d.settings->>'teams')::INT <= ${maxTeams}`
                : ""
            }
            AND d.type = ANY($3)
            AND l.settings->>'type' = ANY($4)
            ${
              playerType !== null && playerType !== undefined
                ? `AND (
                        COALESCE(d.settings->>'player_type', '-1')::INT
                    ) = ${playerType}`
                : ""
            }

            ${slotQueries}
            
            ${scoringSettingsQueries}
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
