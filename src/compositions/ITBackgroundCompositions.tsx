import {Composition} from 'remotion';
import {ITNetworkPacketFlow} from './ITNetworkPacketFlow';
import {ITLayeredDataBus} from './ITLayeredDataBus';
import {ITServerActivityGrid} from './ITServerActivityGrid';
import {ITTerminalProcessStream} from './ITTerminalProcessStream';
import {ITDistributedSystemMap} from './ITDistributedSystemMap';

export const ITBackgroundCompositions = () => (<>
  <Composition id="ITNetworkPacketFlow" component={ITNetworkPacketFlow} width={3840} height={2160} fps={30} durationInFrames={360} />
  <Composition id="ITLayeredDataBus" component={ITLayeredDataBus} width={3840} height={2160} fps={30} durationInFrames={360} />
  <Composition id="ITServerActivityGrid" component={ITServerActivityGrid} width={3840} height={2160} fps={30} durationInFrames={360} />
  <Composition id="ITTerminalProcessStream" component={ITTerminalProcessStream} width={3840} height={2160} fps={30} durationInFrames={360} />
  <Composition id="ITDistributedSystemMap" component={ITDistributedSystemMap} width={3840} height={2160} fps={30} durationInFrames={360} />
</>);
