/**
 * SCR-03 创作工作室 V2 - 内容生成服务
 */

import type { CreationTask } from '../types';
import { getMockContentByType, countWords } from '../data/mockContent';
import { THINKING_STEPS } from '../utils/constants';

// 生成进度回调
export type GenerationProgressCallback = (progress: {
  phase: 'thinking' | 'generating' | 'done';
  step?: number;
  text?: string;
  progress?: number;
}) => void;

// 生成内容
export async function generateContent(
  task: CreationTask,
  onProgress?: GenerationProgressCallback
): Promise<{
  output: string;
  wordCount: number;
  duration: number;
}> {
  const startTime = Date.now();
  
  // Phase 1: 思考阶段
  if (onProgress) {
    onProgress({ phase: 'thinking', step: 0 });
  }
  
  // 模拟思考步骤
  for (let i = 0; i < THINKING_STEPS.length; i++) {
    await sleep(THINKING_STEPS[i].duration);
    if (onProgress) {
      onProgress({ phase: 'thinking', step: i + 1 });
    }
  }
  
  // 等待一下再开始生成
  await sleep(600);
  
  // Phase 2: 生成阶段
  const fullContent = task.metadata?.mockOutput || getMockContentByType(task.type);
  const wordCount = countWords(fullContent);
  
  if (onProgress) {
    onProgress({ phase: 'generating', text: '', progress: 0 });
  }
  
  // 模拟流式输出
  const chars = fullContent.split('');
  let currentText = '';
  const chunkSize = 3; // 每次输出3个字符
  const delayPerChunk = 50; // 每次延迟50ms (2x slower for better readability)
  
  for (let i = 0; i < chars.length; i += chunkSize) {
    const chunk = chars.slice(i, i + chunkSize).join('');
    currentText += chunk;
    
    if (onProgress) {
      onProgress({
        phase: 'generating',
        text: currentText,
        progress: Math.floor((i / chars.length) * 100),
      });
    }
    
    await sleep(delayPerChunk);
  }
  
  // Phase 3: 完成
  const duration = Math.floor((Date.now() - startTime) / 1000);
  
  if (onProgress) {
    onProgress({ phase: 'done', text: fullContent, progress: 100 });
  }
  
  return {
    output: fullContent,
    wordCount,
    duration,
  };
}

// 延迟函数
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 取消生成（预留接口）
export function cancelGeneration(taskId: string): void {
  console.log('[ContentGenerator] Canceling generation for task:', taskId);
  // TODO: 实现取消逻辑
}
