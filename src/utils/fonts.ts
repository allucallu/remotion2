import { continueRender, delayRender } from "remotion";
import { loadFont as loadPatrickHand } from "@remotion/google-fonts/PatrickHand";
import { loadFont as loadGaegu } from "@remotion/google-fonts/Gaegu";
import { loadFont as loadIndieFlower } from "@remotion/google-fonts/IndieFlower";

const patrickHand = loadPatrickHand();
const gaegu = loadGaegu();
const indieFlower = loadIndieFlower();

export const mvFonts = {
  patrickHand: patrickHand.fontFamily,
  gaegu: gaegu.fontFamily,
  indieFlower: indieFlower.fontFamily,
};

let fontsReadyPromise: Promise<void> | null = null;

/**
 * Memastikan seluruh Google Fonts tulisan tangan selesai dimuat
 * dengan delayRender sebelum Remotion merender frame mana pun.
 */
export function ensureFontsLoaded(): Promise<void> {
  if (!fontsReadyPromise) {
    const handle = delayRender("Memuat font tulisan tangan (Patrick Hand, Gaegu, Indie Flower)");
    fontsReadyPromise = Promise.all([
      patrickHand.waitUntilDone(),
      gaegu.waitUntilDone(),
      indieFlower.waitUntilDone(),
    ])
      .then(() => {
        continueRender(handle);
      })
      .catch(() => {
        continueRender(handle);
      });
  }
  return fontsReadyPromise;
}

