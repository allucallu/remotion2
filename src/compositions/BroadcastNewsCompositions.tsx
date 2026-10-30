import {Composition} from 'remotion';
import {BNNavyAngleReport} from './BNNavyAngleReport';
import {BNRedSegmentNews} from './BNRedSegmentNews';
import {BNCobaltDoubleDeck} from './BNCobaltDoubleDeck';
import {BNBurgundyEditorialNews} from './BNBurgundyEditorialNews';
import {BNTealLiveDesk} from './BNTealLiveDesk';

export const BroadcastNewsCompositions = () => (
  <>
    <Composition id="BNNavyAngleReport" component={BNNavyAngleReport} width={3840} height={2160} fps={30} durationInFrames={360} />
    <Composition id="BNRedSegmentNews" component={BNRedSegmentNews} width={3840} height={2160} fps={30} durationInFrames={360} />
    <Composition id="BNCobaltDoubleDeck" component={BNCobaltDoubleDeck} width={3840} height={2160} fps={30} durationInFrames={360} />
    <Composition id="BNBurgundyEditorialNews" component={BNBurgundyEditorialNews} width={3840} height={2160} fps={30} durationInFrames={360} />
    <Composition id="BNTealLiveDesk" component={BNTealLiveDesk} width={3840} height={2160} fps={30} durationInFrames={360} />
  </>
);
