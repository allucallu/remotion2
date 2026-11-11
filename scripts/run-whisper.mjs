import { installWhisperCpp, downloadWhisperModel, transcribe } from '@remotion/install-whisper-cpp';
import path from 'path';
import fs from 'fs';

async function main() {
  const whisperPath = path.resolve('whisper.cpp');
  const modelFolder = path.resolve('whisper-models');
  const dataFolder = path.resolve('data');
  const inputPath = path.resolve('public', 'lagu-16k.wav');
  const version = '1.5.5';
  const model = 'medium';

  if (!fs.existsSync(dataFolder)) {
    fs.mkdirSync(dataFolder, { recursive: true });
  }
  if (!fs.existsSync(modelFolder)) {
    fs.mkdirSync(modelFolder, { recursive: true });
  }

  console.log('1. Installing Whisper.cpp (version', version, ')...');
  await installWhisperCpp({
    to: whisperPath,
    version,
    printOutput: true,
  });
  console.log('Whisper.cpp ready at:', whisperPath);

  console.log('2. Downloading Whisper model (' + model + ')...');
  await downloadWhisperModel({
    folder: modelFolder,
    model,
    printOutput: true,
    onProgress: (p) => {
      process.stdout.write(`Downloading model: ${(p * 100).toFixed(1)}%\r`);
    },
  });
  console.log('\nWhisper model ready at:', modelFolder);

  console.log('3. Transcribing audio (' + inputPath + ')...');
  const res = await transcribe({
    inputPath,
    whisperPath,
    whisperCppVersion: version,
    model,
    modelFolder,
    language: 'id',
    tokenLevelTimestamps: false,
    printOutput: true,
    onProgress: (p) => {
      process.stdout.write(`Transcribing: ${(p * 100).toFixed(1)}%\r`);
    },
  });

  const rawJsonPath = path.join(dataFolder, 'whisper-raw.json');
  fs.writeFileSync(rawJsonPath, JSON.stringify(res, null, 2), 'utf-8');
  console.log('\nTranskripsi selesai! Disimpan ke:', rawJsonPath);
}

main().catch((err) => {
  console.error('Error during whisper run:', err);
  process.exit(1);
});
