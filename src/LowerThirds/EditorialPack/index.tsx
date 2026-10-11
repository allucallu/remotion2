import type { ComponentType } from "react";
import { Composition } from "remotion";
import {
  DURATION_IN_FRAMES,
  EditorialLowerThird,
  editorialLowerThirdSchema,
  FPS,
  defaultAccent,
  type EditorialLowerThirdProps,
  type EditorialVariant,
} from "./EditorialLowerThird";

const makeVariant =
  (variant: EditorialVariant): ComponentType<EditorialLowerThirdProps> =>
  (props) => <EditorialLowerThird {...props} variant={variant} />;

const definitions = [
  ["LT-VioletFrame", "violet"],
  ["LT-LimeVector", "lime"],
  ["LT-CopperBracket", "copper"],
  ["LT-CobaltRail", "cobalt"],
  ["LT-CyanNotch", "cyan"],
  ["LT-CoralBracket", "coral"],
  ["LT-GoldSlash", "gold"],
  ["LT-SageWing", "sage"],
  ["LT-SkyDock", "sky"],
  ["LT-AzureTerminal", "azure"],
] as const;

export const editorialPackRegistrations = definitions.map(([id, variant]) => {
  const Component = makeVariant(variant);
  return {
    id,
    render: () => (
      <Composition
        id={id}
        component={Component}
        schema={editorialLowerThirdSchema}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{
          accentColor: defaultAccent[variant],
          scale: 1,
          position: { x: 96, y: 690 },
        }}
      />
    ),
  };
});
