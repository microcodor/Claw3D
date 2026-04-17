'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { MOCK_MESSAGES } from '../data/mockMessages';
import styles from '../styles/creation-studio.module.css';

// Typing animation hook
function useTypingEffect(text: string, speed = 25, active = false) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  
  useEffect(() => {
    if (!active) {
      setDisplayed('');
      setDone(false);
      return;
    }
    
    setDisplayed('');
    setDone(false);
    let i = 0;
    const t = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(t);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(t);
  }, [text, active, speed]);
  
  return { displayed, done };
}

// Generation states
const STATES = { IDLE: 'idle', THINKING: 'thinking', GENERATING: 'generating', DONE: 'done' } as const;
type State = typeof STATES[keyof typeof STATES];

const THINKING_STEPS = [
  { icon: '⟳', label: '解析用户意图', dur: 1200 },
  { icon: '◈', label: '检索知识库与热点', dur: 1400 },
  { icon: '⬡', label: '构建内容框架', dur: 1300 },
  { icon: '✦', label: '润色与格式化输出', dur: 1100 },
];

// Particle effect component
function Particles({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | undefined>(undefined);
  const particles = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    decay: number;
    size: number;
    color: string;
  }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function resize() {
      if (canvas) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      }
    }
    resize();
    window.addEventListener('resize', resize);

    function spawn() {
      if (!canvas) return;
      const w = canvas.width;
      const h = canvas.height;
      for (let i = 0; i < 3; i++) {
        particles.current.push({
          x: Math.random() * w,
          y: h + 10,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -(Math.random() * 2 + 0.5),
          life: 1,
          decay: Math.random() * 0.008 + 0.004,
          size: Math.random() * 3 + 1,
          color: Math.random() > 0.5 ? '0, 212, 255' : '0, 255, 136',
        });
      }
    }

    let frame = 0;
    function draw() {
      if (!active || !canvas || !ctx) {
        particles.current = [];
        if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }
      animRef.current = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (frame++ % 2 === 0) spawn();
      particles.current = particles.current.filter(p => p.life > 0);
      particles.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;
        ctx.globalAlpha = p.life;
        ctx.fillStyle = `rgba(${p.color}, 1)`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgba(${p.color}, 0.8)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    }
    if (active) draw();
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [active]);

  return <canvas ref={canvasRef} className={styles.particles} />;
}

// Thinking steps animation
function ThinkingSteps({ step }: { step: number }) {
  return (
    <div className={styles.thinkingSteps}>
      {THINKING_STEPS.map((s, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <div
            key={i}
            className={`${styles.thinkStep} ${done ? styles.done : ''} ${active ? styles.active : ''}`}
          >
            <span className={styles.thinkIcon}>{s.icon}</span>
            <span className={styles.thinkLabel}>{s.label}</span>
            {active && <span className={styles.thinkPulse} />}
            {done && <span className={`${styles.glowGreen} ${styles.thinkCheck}`}>✓</span>}
          </div>
        );
      })}
    </div>
  );
}

// Output display
function OutputDisplay({
  content,
  active,
  done,
  showComplete,
}: {
  content: string;
  active: boolean;
  done: boolean;
  showComplete: boolean;
}) {
  const { displayed, done: typeDone } = useTypingEffect(content, 23.4, active);
  const outputRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (outputRef.current && active) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [displayed, active]);
  
  const displayContent = active ? displayed : content;
  
  return (
    <div ref={outputRef} className={`${styles.outputDisplay} ${showComplete ? styles.complete : ''}`}>
      <pre className={styles.outputText}>
        {displayContent}
        {active && !typeDone && <span className={styles.typingCursor} />}
      </pre>
      {showComplete && (
        <div className={styles.videoGenerating}>
          <div className={styles.videoIconWrapper}>
            <div className={styles.videoIcon}>▶</div>
            <div className={styles.videoSpinner}></div>
          </div>
          <div className={styles.videoText}>
            <span className={styles.glowPurple}>◈</span> 视频任务生成中...
          </div>
        </div>
      )}
    </div>
  );
}

// Main component
export default function CreationStudioScreen() {
  const [phase, setPhase] = useState<State>(STATES.IDLE);
  const [prompt, setPrompt] = useState('');
  const [thinkStep, setThinkStep] = useState(-1);
  const [content, setContent] = useState<{ title: string; output: string } | null>(null);
  const [taskCount, setTaskCount] = useState(0);
  const [connected] = useState(true); // Mock mode always connected
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  const triggerGeneration = useCallback((promptText: string, outputContent: string) => {
    if (phaseRef.current !== STATES.IDLE) return;
    setPrompt(promptText);
    setPhase(STATES.THINKING);
    setTaskCount(n => n + 1);
    
    setContent(null);
    setThinkStep(-1);

    // Walk through thinking steps
    let step = 0;
    const walkSteps = () => {
      setThinkStep(step);
      step++;
      if (step < THINKING_STEPS.length) {
        setTimeout(walkSteps, THINKING_STEPS[step - 1].dur);
      } else {
        setTimeout(() => {
          setPhase(STATES.GENERATING);
          setContent({
            title: promptText,
            output: outputContent,
          });
        }, 600);
      }
    };
    setTimeout(walkSteps, 300);
  }, []);

  // Mock mode: auto-play messages
  useEffect(() => {
    let messageIndex = 0;
    let timeout: NodeJS.Timeout;
    let interval: NodeJS.Timeout;
    
    const playNextMessage = () => {
      if (phaseRef.current !== STATES.IDLE) return;
      
      const msg = MOCK_MESSAGES[messageIndex];
      console.log('[SCR-03] Playing mock message:', messageIndex + 1);
      triggerGeneration(msg.user, msg.assistant);
      
      messageIndex = (messageIndex + 1) % MOCK_MESSAGES.length;
    };
    
    // Start after 3 seconds
    timeout = setTimeout(() => {
      playNextMessage();
      // Continue every 20 seconds
      interval = setInterval(() => {
        if (phaseRef.current === STATES.IDLE) {
          playNextMessage();
        }
      }, 20000);
    }, 3000);
    
    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [triggerGeneration]);

  // After generation starts, switch to done after typing completes
  useEffect(() => {
    if (phase === STATES.GENERATING && content) {
      const textLen = content.output.length;
      const dur = textLen * 24.7 + 2000;
      const t = setTimeout(() => setPhase(STATES.DONE), dur);
      return () => clearTimeout(t);
    }
  }, [phase, content]);

  // Reset to idle
  useEffect(() => {
    if (phase === STATES.DONE) {
      const t = setTimeout(() => setPhase(STATES.IDLE), 5000);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const isGenerating = phase === STATES.GENERATING;
  const isDone = phase === STATES.DONE;
  const isThinking = phase === STATES.THINKING;

  return (
    <div className={styles.container}>
      <Particles active={isThinking || isGenerating} />

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.title}>✦ 创作工作室</div>
          <div className={`${styles.badge} ${styles.badgeCyan}`}>
            任务 #{String(taskCount).padStart(4, '0')}
          </div>
          <div className={`${styles.badge} ${connected ? styles.badgeGreen : styles.badgeOrange}`}>
            {connected ? '● 实时' : '○ 离线'}
          </div>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.phaseIndicator}>
            <span
              className={`${styles.statusDot} ${
                isThinking || isGenerating ? styles.active : isDone ? styles.idle : styles.offline
              }`}
            />
            <span>
              {{
                idle: '等待消息',
                thinking: '深度思考中',
                generating: '流式输出',
                done: '生成完成',
              }[phase]}
            </span>
          </div>
        </div>
      </div>

      {/* Main 2-column layout: Left (Input + Output) | Right (Process) */}
      <div className={styles.body}>
        {/* Left column: Input + Output */}
        <div className={styles.leftColumn}>
          {/* Zone 1: Input */}
          <div className={`${styles.zone} ${styles.zoneInput} ${phase !== STATES.IDLE ? styles.hasContent : ''}`}>
            <div className={styles.zoneLabel}>INPUT · 智能选题</div>
            <div className={styles.promptBox}>
              {prompt ? (
                <>
                  <div className={styles.promptIcon}>◈</div>
                  <div className={styles.promptText}>{prompt}</div>
                </>
              ) : (
                <div className={styles.promptIdle}>
                  <div className={styles.idleIcon}>◌</div>
                  <div>等待用户消息...</div>
                  <div style={{ fontSize: 'clamp(9px, 0.7vw, 11px)', color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>
                    {connected ? 'Mock 模式演示中' : '未连接'}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Zone 3: Output */}
          <div className={`${styles.zone} ${styles.zoneOutput} ${isDone || (phase === STATES.IDLE && content) ? styles.glowComplete : ''}`}>
            <div className={styles.zoneLabel}>OUTPUT · AI 生成内容</div>
            {content ? (
              <OutputDisplay
                content={content.output}
                active={isGenerating}
                done={isDone || phase === STATES.IDLE}
                showComplete={isDone || phase === STATES.IDLE}
              />
            ) : (
              <div className={styles.outputIdle}>
                <div className={styles.waveform}>
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className={styles.waveBar} style={{ animationDelay: `${i * 0.08}s` }} />
                  ))}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 'clamp(10px,0.8vw,12px)', marginTop: 10 }}>
                  输出区域待命
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column: Process */}
        <div className={styles.rightColumn}>
          <div className={`${styles.zone} ${styles.zoneProcess} ${isThinking ? styles.active : ''}`}>
            <div className={styles.zoneLabel}>PROCESS · 推理过程</div>
            <div>
              {isThinking ? (
                <ThinkingSteps step={thinkStep} />
              ) : content ? (
                <ThinkingSteps step={THINKING_STEPS.length} />
              ) : (
                <div className={styles.processIdle}>
                  <div className={styles.hexagonGrid}>
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className={styles.hex} style={{ animationDelay: `${i * 0.15}s` }}>
                        ⬡
                      </div>
                    ))}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 'clamp(10px,0.8vw,12px)', marginTop: 8 }}>
                    推理引擎待机
                  </div>
                </div>
              )}
            </div>
            {content && (
              <div className={styles.modelInfo}>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 'clamp(9px,0.7vw,11px)', fontFamily: 'Courier New, monospace' }}>
                  ✦ {content.title}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom stats bar */}
      <div className={styles.footer}>
        {[
          `连接: ${connected ? 'LIVE' : 'OFFLINE'}`,
          `任务: ${taskCount}`,
          `状态: ${phase.toUpperCase()}`,
          'OpenClaw Bridge v2.4',
        ].map((s, i) => (
          <div key={i} className={styles.footerStat}>
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}
