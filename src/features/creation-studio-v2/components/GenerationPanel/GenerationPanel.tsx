'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CreationTask } from '../../types';
import { THINKING_STEPS, CONTENT_TYPE_CONFIGS } from '../../utils/constants';
import { generateContent } from '../../services/contentGenerator';
import styles from './GenerationPanel.module.css';

interface GenerationPanelProps {
  currentTask: CreationTask | null;
  onComplete: (task: CreationTask) => void;
}

export default function GenerationPanel({ currentTask, onComplete }: GenerationPanelProps) {
  const [phase, setPhase] = useState<'idle' | 'thinking' | 'generating' | 'done'>('idle');
  const [thinkingStep, setThinkingStep] = useState(-1);
  const [generatedText, setGeneratedText] = useState('');
  const [progress, setProgress] = useState(0);
  const outputRef = useRef<HTMLDivElement>(null);
  const isGeneratingRef = useRef(false);

  // 当有新任务时开始生成
  useEffect(() => {
    if (!currentTask || isGeneratingRef.current) return;
    
    isGeneratingRef.current = true;
    setPhase('thinking');
    setThinkingStep(-1);
    setGeneratedText('');
    setProgress(0);
    
    // 开始生成
    generateContent(currentTask, (progressData) => {
      if (progressData.phase === 'thinking') {
        setPhase('thinking');
        setThinkingStep(progressData.step || 0);
      } else if (progressData.phase === 'generating') {
        setPhase('generating');
        setGeneratedText(progressData.text || '');
        setProgress(progressData.progress || 0);
      } else if (progressData.phase === 'done') {
        setPhase('done');
        setGeneratedText(progressData.text || '');
        setProgress(100);
        
        // 完成后等待一下再通知
        setTimeout(() => {
          const completedTask: CreationTask = {
            ...currentTask,
            status: 'completed',
            output: progressData.text,
            completedAt: new Date(),
            metadata: {
              wordCount: progressData.text?.length || 0,
              duration: Math.floor((Date.now() - currentTask.startedAt!.getTime()) / 1000),
              model: 'Mock Generator v1.0',
            },
          };
          onComplete(completedTask);
          isGeneratingRef.current = false;
        }, 2000);
      }
    }).catch(error => {
      console.error('[GenerationPanel] Generation error:', error);
      isGeneratingRef.current = false;
    });
  }, [currentTask, onComplete]);

  // 自动滚动到底部
  useEffect(() => {
    if (outputRef.current && phase === 'generating') {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [generatedText, phase]);

  // 重置状态
  useEffect(() => {
    if (!currentTask) {
      setPhase('idle');
      setThinkingStep(-1);
      setGeneratedText('');
      setProgress(0);
    }
  }, [currentTask]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>✦ 实时生成区</h2>
        {currentTask && (
          <span className={`${styles.badge} ${styles[phase]}`}>
            {phase === 'thinking' && '深度思考中'}
            {phase === 'generating' && '流式输出'}
            {phase === 'done' && '生成完成'}
          </span>
        )}
      </div>

      <div className={styles.content}>
        {!currentTask ? (
          <div className={styles.idle}>
            <div className={styles.idleIcon}>◌</div>
            <div className={styles.idleText}>等待任务...</div>
            <div className={styles.idleHint}>从任务队列选择或创建新任务</div>
          </div>
        ) : (
          <div className={styles.generating}>
            {/* 任务信息 */}
            <div className={styles.taskInfo}>
              <div className={styles.taskHeader}>
                <div className={styles.taskTitle}>{currentTask.title}</div>
                <div className={styles.taskBadges}>
                  <span
                    className={styles.taskType}
                    style={{ 
                      backgroundColor: `${CONTENT_TYPE_CONFIGS[currentTask.type].color}20`,
                      color: CONTENT_TYPE_CONFIGS[currentTask.type].color,
                    }}
                  >
                    {CONTENT_TYPE_CONFIGS[currentTask.type].icon} {CONTENT_TYPE_CONFIGS[currentTask.type].label}
                  </span>
                  <span className={styles.taskPriority}>P{currentTask.priority}</span>
                </div>
              </div>
            </div>

            {/* 思考步骤 */}
            {phase === 'thinking' && (
              <motion.div
                className={styles.thinkingSteps}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {THINKING_STEPS.map((step, index) => {
                  const isActive = index === thinkingStep - 1;
                  const isDone = index < thinkingStep - 1;
                  
                  return (
                    <motion.div
                      key={step.id}
                      className={`${styles.thinkStep} ${isDone ? styles.done : ''} ${isActive ? styles.active : ''}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <span className={styles.thinkIcon}>{step.icon}</span>
                      <span className={styles.thinkLabel}>{step.label}</span>
                      {isActive && <span className={styles.thinkPulse} />}
                      {isDone && <span className={styles.thinkCheck}>✓</span>}
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {/* 输出区域 */}
            {(phase === 'generating' || phase === 'done') && (
              <motion.div
                className={styles.outputWrapper}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className={styles.outputHeader}>
                  <span className={styles.outputLabel}>生成内容</span>
                  <span className={styles.outputProgress}>{progress}%</span>
                </div>
                <div ref={outputRef} className={styles.output}>
                  <pre className={styles.outputText}>
                    {generatedText}
                    {phase === 'generating' && <span className={styles.cursor}>▊</span>}
                  </pre>
                </div>
                {phase === 'done' && (
                  <motion.div
                    className={styles.doneIndicator}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <span className={styles.doneIcon}>✓</span>
                    <span className={styles.doneText}>生成完成</span>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
