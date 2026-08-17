/**
 * Audio manager — backsound (ambient loop) + songs_pesta (one-shot celebration)
 */

let audioCtx = null;
let mainGain = null;

let backsoundBuffer = null;
let backsoundSource = null;

let partyAudioEl = null;
let partyPlayPending = false;

let isMuted = false;
let backsoundPlaying = false;
let partyPlaying = false;
let isBacksoundLoaded = false;
let isPartyLoaded = false;

function getContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    mainGain = audioCtx.createGain();
    mainGain.gain.value = 0;
    mainGain.connect(audioCtx.destination);
  }
  return { ctx: audioCtx, mainGain };
}

async function fetchAndDecode(url) {
  const { ctx } = getContext();
  const response = await fetch(url);
  if (!response.ok) throw new Error('Audio file not found');
  const arrayBuffer = await response.arrayBuffer();
  return ctx.decodeAudioData(arrayBuffer);
}

function fadeGain(gainNode, target, duration) {
  const { ctx } = getContext();
  gainNode.gain.setValueAtTime(gainNode.gain.value, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(target, ctx.currentTime + duration);
}

function startLoopSource(buffer, gainNode) {
  const { ctx } = getContext();
  if (ctx.state === 'suspended') ctx.resume();
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  source.connect(gainNode);
  source.start(0);
  return source;
}

export async function loadAudio(url = '/audio/backsound.mp3') {
  try {
    backsoundBuffer = await fetchAndDecode(url);
    isBacksoundLoaded = true;
    return true;
  } catch (e) {
    console.warn('Audio not loaded:', e.message);
    return false;
  }
}

export async function loadPartyAudio(url = '/audio/songs_pesta.mp3') {
  try {
    partyAudioEl = new Audio(url);
    partyAudioEl.preload = 'auto';
    partyAudioEl.loop = false;

    await new Promise((resolve, reject) => {
      const onReady = () => resolve();
      const onError = () => reject(new Error('Party audio file not found'));
      partyAudioEl.addEventListener('canplaythrough', onReady, { once: true });
      partyAudioEl.addEventListener('error', onError, { once: true });
      partyAudioEl.load();
    });

    partyAudioEl.onended = () => {
      partyPlaying = false;
    };

    isPartyLoaded = true;

    if (partyPlayPending) {
      partyPlayPending = false;
      playPartyAudio();
    }

    return true;
  } catch (e) {
    console.warn('Party audio not loaded:', e.message);
    return false;
  }
}

export function playAudio(fadeInDuration = 2.0) {
  if (!isBacksoundLoaded || backsoundPlaying) return;
  const { mainGain } = getContext();
  backsoundSource = startLoopSource(backsoundBuffer, mainGain);
  backsoundPlaying = true;
  fadeGain(mainGain, isMuted ? 0 : 0.7, fadeInDuration);
}

export function playPartyAudio() {
  if (partyPlaying) return;

  if (!isPartyLoaded || !partyAudioEl) {
    partyPlayPending = true;
    return;
  }

  const { ctx } = getContext();
  if (ctx.state === 'suspended') ctx.resume();

  partyPlaying = true;
  partyAudioEl.volume = isMuted ? 0 : 0.9;
  partyAudioEl.currentTime = 0;

  const playPromise = partyAudioEl.play();
  if (playPromise) {
    playPromise.catch((e) => {
      console.warn('Party play failed:', e.message);
      partyPlaying = false;
    });
  }
}

/** Play party song once — backsound keeps looping underneath. */
export function crossfadeToParty() {
  playPartyAudio();
}

export function pauseAudio(fadeOutDuration = 1.0) {
  if (backsoundPlaying && backsoundSource) {
    fadeGain(mainGain, 0, fadeOutDuration);
    setTimeout(() => {
      try { backsoundSource.stop(); } catch (_) {}
      backsoundPlaying = false;
    }, fadeOutDuration * 1000);
  }

  if (partyPlaying && partyAudioEl) {
    partyAudioEl.pause();
    partyPlaying = false;
  }
}

export function toggleMute() {
  const { ctx, mainGain } = getContext();
  isMuted = !isMuted;

  if (backsoundPlaying) {
    mainGain.gain.setValueAtTime(mainGain.gain.value, ctx.currentTime);
    mainGain.gain.linearRampToValueAtTime(isMuted ? 0 : 0.7, ctx.currentTime + 0.3);
  }

  if (partyPlaying && partyAudioEl) {
    partyAudioEl.volume = isMuted ? 0 : 0.9;
  }

  return isMuted;
}

export function getMuteState() {
  return isMuted;
}

export function isAudioPlaying() {
  return backsoundPlaying || partyPlaying;
}

export function isAudioLoaded() {
  return isBacksoundLoaded || isPartyLoaded;
}
