import {Composition} from "remotion";
import type {AssetRegistration} from "../compositions/registry";
import {
  NEO_BRUTALISM_SERRATED_TICKET_DURATION,
  NEO_BRUTALISM_SERRATED_TICKET_FPS,
  NEO_BRUTALISM_SERRATED_TICKET_HEIGHT,
  NEO_BRUTALISM_SERRATED_TICKET_WIDTH,
  NeoBrutalismSerratedTicket,
} from "./NeoBrutalismSerratedTicket";

export const neoBrutalismSerratedTicketRegistration: AssetRegistration = {
  id: "NeoBrutalismSerratedTicket",
  render: () => (
    <Composition
      id="NeoBrutalismSerratedTicket"
      component={NeoBrutalismSerratedTicket}
      durationInFrames={NEO_BRUTALISM_SERRATED_TICKET_DURATION}
      fps={NEO_BRUTALISM_SERRATED_TICKET_FPS}
      width={NEO_BRUTALISM_SERRATED_TICKET_WIDTH}
      height={NEO_BRUTALISM_SERRATED_TICKET_HEIGHT}
    />
  ),
};
