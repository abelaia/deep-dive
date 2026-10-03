import { gsap } from '../lib/gsap'
import { dive } from '../lib/dive'
import { rand } from '../lib/layout'
import { SOUND } from '../constants/config'

const chain = (...nodes: AudioNode[]) => nodes.reduce((from, to) => from.connect(to))

class SoundEngine {
  private ctx: AudioContext | null = null
  private master!: GainNode
  private noiseBuffer!: AudioBuffer
  private waves!: GainNode
  private under!: GainNode
  private pad!: GainNode
  private murk!: BiquadFilterNode
  private echo!: DelayNode
  private enabled = false
  private nextSonar = 0

  async enable() {
    const ctx = (this.ctx ??= this.build())
    await ctx.resume()
    this.setMaster(SOUND.master)
    if (!this.enabled) gsap.ticker.add(this.tick)
    this.enabled = true
  }

  disable() {
    if (!this.ctx || !this.enabled) return
    this.enabled = false
    gsap.ticker.remove(this.tick)
    this.setMaster(0)
    setTimeout(() => !this.enabled && this.ctx?.suspend(), SOUND.fade * 3000)
  }

  private get now() {
    return this.ctx!.currentTime
  }

  private setMaster(value: number) {
    this.master.gain.setTargetAtTime(value, this.now, SOUND.fade)
  }

  private gain(value = 0) {
    return new GainNode(this.ctx!, { gain: value })
  }

  private filter(type: BiquadFilterType, frequency: number, Q = 1) {
    return new BiquadFilterNode(this.ctx!, { type, frequency, Q })
  }

  private lfo(frequency: number, depth: number, param: AudioParam) {
    const osc = new OscillatorNode(this.ctx!, { frequency })
    chain(osc, this.gain(depth)).connect(param)
    osc.start()
  }

  private loop(...nodes: AudioNode[]) {
    const src = new AudioBufferSourceNode(this.ctx!, { buffer: this.noiseBuffer, loop: true })
    chain(src, ...nodes)
    src.start(0, rand(0, 2))
  }

  private envelope(peak: number, attack: number, release: number) {
    const env = this.gain()
    env.gain.setValueAtTime(0, this.now)
    env.gain.linearRampToValueAtTime(peak, this.now + attack)
    env.gain.exponentialRampToValueAtTime(0.0001, this.now + attack + release)
    return env
  }

  private build() {
    const ctx = new AudioContext()
    this.ctx = ctx
    this.master = this.gain()
    this.master.connect(ctx.destination)
    this.noiseBuffer = new AudioBuffer({ length: ctx.sampleRate * 2, sampleRate: ctx.sampleRate })
    this.noiseBuffer.getChannelData(0).forEach((_, i, data) => (data[i] = rand(-1, 1)))
    ;[this.waves, this.under, this.pad] = [this.gain(), this.gain(), this.gain()]
    ;[this.waves, this.under, this.pad].forEach((layer) => layer.connect(this.master))

    const swell = this.gain(0.5)
    this.lfo(0.12, 0.45, swell.gain)
    this.loop(this.filter('lowpass', 700), swell, this.waves)

    this.murk = this.filter('lowpass', SOUND.cutoff.max)
    this.loop(this.murk, this.under)

    const padFilter = this.filter('lowpass', 380)
    ;[55, 82.4, 110.3].forEach((frequency, i) => {
      const osc = new OscillatorNode(ctx, { frequency, type: i ? 'sine' : 'triangle' })
      this.lfo(0.07 + i * 0.03, 6, osc.detune)
      chain(osc, padFilter)
      osc.start()
    })
    padFilter.connect(this.pad)

    this.echo = new DelayNode(ctx, { delayTime: 0.38 })
    chain(this.echo, this.gain(0.38), this.echo)
    chain(this.echo, this.filter('lowpass', 2400), this.master)

    document.addEventListener('visibilitychange', () => this.enabled && this.setMaster(document.hidden ? 0 : SOUND.master))
    return ctx
  }

  private tick = () => {
    const { levels, cutoff, smoothing } = SOUND
    this.waves.gain.setTargetAtTime(dive.waves * levels.waves, this.now, smoothing)
    this.under.gain.setTargetAtTime(dive.under * levels.under, this.now, smoothing)
    this.pad.gain.setTargetAtTime(dive.visual * levels.pad, this.now, smoothing)
    this.murk.frequency.setTargetAtTime(cutoff.max - (cutoff.max - cutoff.min) * dive.visual, this.now, smoothing)
    if (Math.random() < dive.whale * SOUND.whaleRate) this.whaleCall()
    if (Math.random() < dive.bubbles * SOUND.bubbleRate) this.bubble()
    if (dive.sonar > 0.5 && this.now > this.nextSonar) {
      this.nextSonar = this.now + SOUND.sonarEvery
      this.ping()
    }
  }

  private whaleCall() {
    const osc = new OscillatorNode(this.ctx!, { frequency: rand(160, 220) })
    osc.frequency.exponentialRampToValueAtTime(rand(70, 95), this.now + 2.6)
    this.lfo(5, 6, osc.frequency)
    chain(osc, this.filter('lowpass', 700), this.envelope(SOUND.levels.whale, 0.8, 2.2), this.master)
    osc.start()
    osc.stop(this.now + 3.2)
  }

  private ping() {
    const osc = new OscillatorNode(this.ctx!, { frequency: 1380 })
    const env = this.envelope(SOUND.levels.sonar, 0.01, 1.2)
    chain(osc, env, this.master)
    env.connect(this.echo)
    osc.start()
    osc.stop(this.now + 1.4)
  }

  private bubble() {
    const start = rand(320, 720)
    const osc = new OscillatorNode(this.ctx!, { frequency: start })
    osc.frequency.exponentialRampToValueAtTime(start * 2.4, this.now + rand(0.05, 0.12))
    chain(osc, this.envelope(SOUND.levels.bubble * rand(0.3, 1), 0.005, 0.1), this.master)
    osc.start()
    osc.stop(this.now + 0.2)
  }
}

export const soundEngine = new SoundEngine()
