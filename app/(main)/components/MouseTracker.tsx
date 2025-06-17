// File: app/(main)/components/MouseTracker.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import { MouseEvent } from '@/lib/types';

interface MouseTrackerProps {
  sessionId: string;
}

const MouseTracker: React.FC<MouseTrackerProps> = ({ sessionId }) => {
  const lastPosition = useRef<{ x: number; y: number; timestamp: number } | null>(null);
  const dataBuffer = useRef<MouseEvent[]>([]);
  const lastSendTime = useRef<number>(0);
  
  // Mouse movement tracking
  useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      const now = Date.now();
      const position = { x: e.clientX, y: e.clientY };
      
      // Calculate movement metrics
      let distance = 0;
      let velocity = 0;
      
      if (lastPosition.current) {
        distance = Math.sqrt(
          Math.pow(position.x - lastPosition.current.x, 2) +
          Math.pow(position.y - lastPosition.current.y, 2)
        );
        
        velocity = distance / (now - lastPosition.current.timestamp);
      }
      
      // Create data point
      const dataPoint: MouseEvent = {
        timestamp: now,
        x: position.x,
        y: position.y,
        distance,
        velocity,
        eventType: 'move'
      };
      
      // Add to buffer
      dataBuffer.current.push(dataPoint);
      lastPosition.current = { ...position, timestamp: now };
      
      // Send data periodically
      if (now - lastSendTime.current > 2000 && dataBuffer.current.length > 0) {
        sendMouseData();
        lastSendTime.current = now;
      }
    };
    
    // Mouse click tracking
    const handleMouseClick = (e: globalThis.MouseEvent) => {
      dataBuffer.current.push({
        timestamp: Date.now(),
        eventType: 'click',
        button: e.button,
        x: e.clientX,
        y: e.clientY
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseClick);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseClick);
      sendMouseData(); // Send any remaining data
    };
  }, [sessionId]);
  
  const sendMouseData = async () => {
    if (dataBuffer.current.length === 0 || !sessionId) return;
    
    try {
      await fetch('/api/log-mouse', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'session-id': sessionId
        },
        body: JSON.stringify(dataBuffer.current)
      });
      dataBuffer.current = [];
    } catch (error) {
      console.error('Error sending mouse data:', error);
    }
  };
  
  return null;
};

export default MouseTracker;