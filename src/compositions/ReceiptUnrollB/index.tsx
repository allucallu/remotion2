import { Composition } from "remotion";
import type { AssetRegistration } from "../registry";
import { ReceiptUnrollB } from "./ReceiptUnrollB";

export const receiptUnrollBRegistration: AssetRegistration = {
  id: "ReceiptUnrollB",
  render: () => (
    <Composition
      id="ReceiptUnrollB"
      component={ReceiptUnrollB}
      width={3840}
      height={2160}
      fps={30}
      durationInFrames={300}
    />
  ),
};
