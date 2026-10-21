import { Composition } from "remotion";
import type { AssetRegistration } from "../registry";
import { ReceiptUnrollA } from "./ReceiptUnrollA";

export const receiptUnrollARegistration: AssetRegistration = {
  id: "ReceiptUnrollA",
  render: () => (
    <Composition
      id="ReceiptUnrollA"
      component={ReceiptUnrollA}
      width={3840}
      height={2160}
      fps={30}
      durationInFrames={300}
    />
  ),
};
