import type { ReactNode } from "react";
import { cartRushARegistration } from "./CartRushA";
import { cartRushBRegistration } from "./CartRushB";
import { closingHourglassRegistration } from "./ClosingHourglass";
import { didYouKnowBadgeRegistration } from "./DidYouKnowBadge";
import { quickTipBadgeRegistration } from "./QuickTipBadge";
import { factCheckBadgeRegistration } from "./FactCheckBadge";
import { mythBustedBadgeRegistration } from "./MythBustedBadge";
import { keyTakeawayBadgeRegistration } from "./KeyTakeawayBadge";
import { lockedBlackFridaySignRegistration } from "./LockedBlackFridaySign";
import { blackFridayRailSliderRegistration } from "./BlackFridayRailSlider";
import { limitedStockRackRegistration } from "./LimitedStockRack";
import { lastChanceDeadlineDialRegistration } from "./LastChanceDeadlineDial";
import { shutterRevealFlashSaleRegistration } from "./ShutterRevealFlashSale";
import { travelingDotGridRegistration } from "./TravelingDotGrid";
import { staggeredBarWaveRegistration } from "./StaggeredBarWave";
import { counterRotatingArcsRegistration } from "./CounterRotatingArcs";
import { offsetOutlineSquaresRegistration } from "./OffsetOutlineSquares";
import { alternatingChevronDriftRegistration } from "./AlternatingChevronDrift";
import { blackFridayImpactRegistration } from "./BlackFridayImpact";
import { fanPetalBloomRegistration } from "./FanPetalBloom";
import { flashSaleAlarmRegistration } from "./FlashSaleAlarm";
import { lastChanceCalendarRegistration } from "./LastChanceCalendar";
import { limitedStockStackRegistration } from "./LimitedStockStack";
import { receiptUnrollARegistration } from "./ReceiptUnrollA";
import { receiptUnrollBRegistration } from "./ReceiptUnrollB";
import { shoppingBagConveyorARegistration } from "./ShoppingBagConveyorA";
import { stackingPurchasesBRegistration } from "./StackingPurchasesB";
import { starterCompositionRegistration } from "./StarterComposition";

export interface AssetRegistration {
  /** Must match the Composition id rendered by render(). */
  id: string;
  /** Return one Remotion <Composition /> registration. */
  render: () => ReactNode;
}

/**
 * Single source of truth for assets shown in Remotion Studio.
 * Add new composition registrations here; Root.tsx does not need to be edited.
 */
export const assetRegistry: readonly AssetRegistration[] = [
  starterCompositionRegistration,
  closingHourglassRegistration,
  didYouKnowBadgeRegistration,
  quickTipBadgeRegistration,
  factCheckBadgeRegistration,
  mythBustedBadgeRegistration,
  keyTakeawayBadgeRegistration,
  lockedBlackFridaySignRegistration,
  blackFridayRailSliderRegistration,
  limitedStockRackRegistration,
  lastChanceDeadlineDialRegistration,
  shutterRevealFlashSaleRegistration,
  travelingDotGridRegistration,
  staggeredBarWaveRegistration,
  counterRotatingArcsRegistration,
  offsetOutlineSquaresRegistration,
  alternatingChevronDriftRegistration,
  blackFridayImpactRegistration,
  fanPetalBloomRegistration,
  flashSaleAlarmRegistration,
  lastChanceCalendarRegistration,
  limitedStockStackRegistration,
  shoppingBagConveyorARegistration,
  cartRushARegistration,
  cartRushBRegistration,
  stackingPurchasesBRegistration,
  receiptUnrollARegistration,
  receiptUnrollBRegistration,
];
