import { Fragment } from "react";
import { assetRegistry } from "./compositions/registry";
import "./index.css";

export const RemotionRoot = () => (
  <>
    {assetRegistry.map((asset) => (
      <Fragment key={asset.id}>{asset.render()}</Fragment>
    ))}
  </>
);
