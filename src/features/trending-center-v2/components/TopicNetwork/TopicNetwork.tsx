'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { TopicNetwork as TopicNetworkType } from '../../types';
import styles from './TopicNetwork.module.css';

interface TopicNetworkProps {
  data: TopicNetworkType;
}

export default function TopicNetwork({ data }: TopicNetworkProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 添加调试日志
  console.log('[TopicNetwork] Received data:', {
    nodes: data.nodes.length,
    edges: data.edges.length,
    centerNode: data.centerNode,
  });

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) {
      console.log('[TopicNetwork] Refs not ready');
      return;
    }

    if (!data.nodes || data.nodes.length === 0) {
      console.log('[TopicNetwork] No nodes to display');
      return;
    }

    console.log('[TopicNetwork] Starting to render network...');

    // 清空之前的内容
    d3.select(svgRef.current).selectAll('*').remove();

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // 创建力导向图
    const simulation = d3.forceSimulation(data.nodes as any)
      .force('link', d3.forceLink(data.edges)
        .id((d: any) => d.id)
        .distance(d => 100 / (d.weight + 0.1))
      )
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(d => (d as any).value / 2 + 10));

    // 创建连线
    const link = svg.append('g')
      .selectAll('line')
      .data(data.edges)
      .join('line')
      .attr('stroke', 'rgba(255, 149, 0, 0.3)')
      .attr('stroke-width', d => d.weight * 3);

    // 创建节点组
    const node = svg.append('g')
      .selectAll('g')
      .data(data.nodes)
      .join('g')
      .call(d3.drag<any, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
      );

    // 添加圆形节点
    node.append('circle')
      .attr('r', (d: any) => Math.sqrt(d.value) * 2 + 5)
      .attr('fill', (d: any) => {
        if (d.level === 0) return '#ff9500';
        if (d.level === 1) return '#3b82f6';
        return '#8b5cf6';
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer');

    // 添加文本标签
    node.append('text')
      .text((d: any) => d.label.length > 8 ? d.label.slice(0, 8) + '...' : d.label)
      .attr('x', 0)
      .attr('y', 0)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', '#fff')
      .attr('font-size', (d: any) => d.level === 0 ? '12px' : '10px')
      .attr('font-weight', (d: any) => d.level === 0 ? 'bold' : 'normal')
      .style('pointer-events', 'none')
      .style('user-select', 'none');

    // 添加 tooltip
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', styles.tooltip)
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background', 'rgba(14, 10, 4, 0.95)')
      .style('border', '1px solid rgba(255, 149, 0, 0.5)')
      .style('border-radius', '8px')
      .style('padding', '8px 12px')
      .style('color', '#fff')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('z-index', '1000');

    node
      .on('mouseover', function(event, d: any) {
        tooltip.transition().duration(200).style('opacity', 1);
        tooltip.html(`
          <div><strong>${d.label}</strong></div>
          <div>类别: ${d.category}</div>
          <div>热度: ${d.value}</div>
          <div>层级: ${d.level === 0 ? '核心' : d.level === 1 ? '衍生' : '次级'}</div>
        `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
        
        d3.select(this).select('circle')
          .transition()
          .duration(200)
          .attr('r', (d: any) => Math.sqrt(d.value) * 2 + 8);
      })
      .on('mouseout', function() {
        tooltip.transition().duration(200).style('opacity', 0);
        
        d3.select(this).select('circle')
          .transition()
          .duration(200)
          .attr('r', (d: any) => Math.sqrt(d.value) * 2 + 5);
      });

    // 更新位置
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    // 拖拽函数
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    // 清理
    return () => {
      simulation.stop();
      tooltip.remove();
    };
  }, [data]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>话题关联网络</h2>
        <span className={styles.badge}>交互</span>
      </div>
      <div ref={containerRef} className={styles.chartContainer}>
        {data.nodes.length === 0 ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '12px',
          }}>
            加载中...
          </div>
        ) : (
          <svg ref={svgRef} />
        )}
      </div>
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={styles.legendDot} style={{ backgroundColor: '#ff9500' }} />
          <span className={styles.legendLabel}>核心话题</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendDot} style={{ backgroundColor: '#3b82f6' }} />
          <span className={styles.legendLabel}>衍生话题</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendDot} style={{ backgroundColor: '#8b5cf6' }} />
          <span className={styles.legendLabel}>次级话题</span>
        </div>
      </div>
    </div>
  );
}
