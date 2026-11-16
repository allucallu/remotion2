// Daftar file aset gambar yang tersedia di folder public/assets/
// Saat ini folder public/assets/ hanya berisi .gitkeep (0 file PNG).
export const AVAILABLE_ASSETS: string[] = [];

// Daftar seluruh aset yang didefinisikan di ASSET_PROMPTS.md dan dipakai di scene
export const ALL_EXPECTED_ASSETS = {
  characters_ray: [
    "ray_neutral_A.png",
    "ray_neutral_B.png",
    "ray_smile_A.png",
    "ray_smile_B.png",
    "ray_shy_A.png",
    "ray_shy_B.png",
    "ray_sad_A.png",
    "ray_sad_B.png",
    "ray_eyesclosed_A.png",
    "ray_eyesclosed_B.png",
    "ray_reachout_A.png",
    "ray_reachout_B.png",
    "ray_stepback_A.png",
    "ray_stepback_B.png",
    "ray_determined_A.png",
    "ray_determined_B.png",
    "ray_writing_A.png",
    "ray_writing_B.png",
  ],
  characters_sol: [
    "sol_neutral_A.png",
    "sol_neutral_B.png",
    "sol_smile_A.png",
    "sol_smile_B.png",
    "sol_wait_A.png",
    "sol_wait_B.png",
    "sol_curious_A.png",
    "sol_curious_B.png",
    "sol_eyesclosed_A.png",
    "sol_eyesclosed_B.png",
    "sol_reachout_A.png",
    "sol_reachout_B.png",
    "sol_laugh_A.png",
    "sol_laugh_B.png",
  ],
  duo_poses: [
    "duo_lying_up_A.png",
    "duo_lying_up_B.png",
    "duo_pull_close_A.png",
    "duo_pull_close_B.png",
    "duo_push_away_A.png",
    "duo_push_away_B.png",
    "duo_palms_A.png",
    "duo_palms_B.png",
    "duo_hold_hands_A.png",
    "duo_hold_hands_B.png",
    "duo_sitting_A.png",
    "duo_sitting_B.png",
  ],
  backgrounds: [
    "bg_ceiling_night.png",
    "bg_room_day.png",
    "bg_room_night.png",
    "bg_street_day.png",
    "bg_golden.png",
    "bg_paper_plain.png",
    "bg_dark_plain.png",
  ],
  props: [
    "prop_notebook.png",
    "prop_pencil.png",
    "prop_phone.png",
    "prop_lamp.png",
    "prop_cup_x2.png",
    "prop_heart_cracked.png",
    "prop_heart_patch.png",
    "prop_tile_empty.png",
    "prop_stars_set.png",
  ],
} as const;

export function isAssetAvailable(filename: string): boolean {
  const cleanName = filename.replace(/^\/?(assets\/)?/, "");
  return AVAILABLE_ASSETS.some((a) => a.endsWith(cleanName));
}

export function getMissingAssetsList(): string[] {
  const allExpected = [
    ...ALL_EXPECTED_ASSETS.characters_ray,
    ...ALL_EXPECTED_ASSETS.characters_sol,
    ...ALL_EXPECTED_ASSETS.duo_poses,
    ...ALL_EXPECTED_ASSETS.backgrounds,
    ...ALL_EXPECTED_ASSETS.props,
  ];
  return allExpected.filter((item) => !isAssetAvailable(item));
}
