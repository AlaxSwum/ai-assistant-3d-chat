import React, { useState, useEffect, useRef } from 'react';

const RobotModel = ({ isAnimating = false }) => {
  const canvasRef = useRef(null);
  const [mouthOpen, setMouthOpen] = useState(0);
  const [eyeBlink, setEyeBlink] = useState(false);
  const [audioAnalyzer, setAudioAnalyzer] = useState(null);
  const requestRef = useRef();
  const previousTimeRef = useRef();
  const blinkIntervalRef = useRef();
  
  // Enhanced lip sync animation
  useEffect(() => {
    if (!isAnimating) {
      setMouthOpen(0);
      return;
    }
    
    const animate = time => {
      if (previousTimeRef.current !== undefined) {
        // Complex mouth movement pattern to simulate more realistic speech
        const base = Math.sin(time * 0.01) * 0.3; // Base movement
        const fast = Math.sin(time * 0.03) * 0.2; // Fast movement
        const random = Math.sin(time * 0.005 + Math.cos(time * 0.002)) * 0.15; // Random variations
        
        // Calculate final mouth position with randomness
        const newMouthOpen = Math.max(0, Math.min(1, 0.4 + base + fast + random));
        setMouthOpen(newMouthOpen);
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };
    
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isAnimating]);
  
  // Eye blinking effect
  useEffect(() => {
    // Set up random blinking
    const blinkRandomly = () => {
      const randomDelay = Math.floor(Math.random() * 3000) + 2000; // 2-5 seconds
      
      blinkIntervalRef.current = setTimeout(() => {
        setEyeBlink(true);
        
        // Open eyes after 150ms
        setTimeout(() => {
          setEyeBlink(false);
          blinkRandomly();
        }, 150);
      }, randomDelay);
    };
    
    blinkRandomly();
    
    return () => {
      if (blinkIntervalRef.current) {
        clearTimeout(blinkIntervalRef.current);
      }
    };
  }, []);
  
  // Draw robot on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Create dark background with gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, '#121212');
    bgGradient.addColorStop(1, '#080808');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);
    
    // Create floating effect
    const time = Date.now() * 0.001;
    const floatOffset = Math.sin(time * 0.8) * 4;
    
    // Robot body base position
    const centerX = width / 2;
    const baseY = 150 + floatOffset;
    
    // Shadow with purple glow
    ctx.beginPath();
    ctx.ellipse(centerX, height - 50, 60, 15, 0, 0, Math.PI * 2);
    const shadowGlow = isAnimating ? 
      Math.abs(Math.sin(Date.now() * 0.003)) * 0.3 + 0.2 : 
      0.3;
    ctx.fillStyle = `rgba(120, 0, 180, ${shadowGlow})`;
    ctx.fill();
    
    // Add some ambiance elements - floating particles
    const drawParticles = () => {
      const particleCount = 15;
      for (let i = 0; i < particleCount; i++) {
        const x = Math.sin(time * (0.3 + i * 0.05)) * 80 + centerX;
        const y = Math.cos(time * (0.2 + i * 0.03)) * 60 + baseY;
        const size = Math.sin(time * (0.4 + i * 0.1)) * 1 + 2;
        
        const particleGradient = ctx.createRadialGradient(
          x, y, 0,
          x, y, size * 2
        );
        
        // Emo color scheme - purples and dark blues
        let alpha = 0.4 + Math.sin(time * (0.5 + i * 0.2)) * 0.2;
        particleGradient.addColorStop(0, `rgba(180, 50, 220, ${alpha})`);
        particleGradient.addColorStop(1, 'rgba(50, 0, 80, 0)');
        
        ctx.beginPath();
        ctx.arc(x, y, size * 2, 0, Math.PI * 2);
        ctx.fillStyle = particleGradient;
        ctx.fill();
      }
    };
    
    drawParticles();
    
    // Emo-style platform - dark with neon highlights
    const platformGradient = ctx.createRadialGradient(
      centerX, height - 50, 10,
      centerX, height - 50, 80
    );
    platformGradient.addColorStop(0, 'rgba(120, 0, 180, 0.3)');
    platformGradient.addColorStop(0.5, 'rgba(60, 0, 120, 0.2)');
    platformGradient.addColorStop(1, 'rgba(30, 0, 50, 0)');
    
    ctx.beginPath();
    ctx.ellipse(centerX, height - 50, 70, 20, 0, 0, Math.PI * 2);
    ctx.fillStyle = platformGradient;
    ctx.fill();
    
    // Body - angular and dark
    const bodyGradient = ctx.createLinearGradient(centerX - 70, baseY - 30, centerX + 70, baseY + 100);
    bodyGradient.addColorStop(0, '#121212');
    bodyGradient.addColorStop(0.4, '#222222');
    bodyGradient.addColorStop(1, '#181818');
    
    // Torso - more angular for emo style
    ctx.fillStyle = bodyGradient;
    ctx.beginPath();
    
    ctx.moveTo(centerX - 40, baseY);
    ctx.lineTo(centerX - 48, baseY + 60);
    ctx.lineTo(centerX - 30, baseY + 100);
    ctx.lineTo(centerX + 30, baseY + 100);
    ctx.lineTo(centerX + 48, baseY + 60);
    ctx.lineTo(centerX + 40, baseY);
    ctx.closePath();
    ctx.fill();
    
    // Chest details - angular patterns
    const chestGradient = ctx.createLinearGradient(centerX - 30, baseY + 10, centerX + 30, baseY + 50);
    chestGradient.addColorStop(0, '#282828');
    chestGradient.addColorStop(1, '#181818');
    
    ctx.fillStyle = chestGradient;
    ctx.beginPath();
    ctx.moveTo(centerX - 30, baseY + 10);
    ctx.lineTo(centerX - 25, baseY + 50);
    ctx.lineTo(centerX + 25, baseY + 50);
    ctx.lineTo(centerX + 30, baseY + 10);
    ctx.closePath();
    ctx.fill();
    
    // Energy core in chest - pulsing purple
    const coreGlowSize = isAnimating ? 
      Math.sin(Date.now() * 0.005) * 2 + 15 : 
      Math.sin(Date.now() * 0.002) * 1 + 14;
    
    const coreGradient = ctx.createRadialGradient(
      centerX, baseY + 30, 0,
      centerX, baseY + 30, coreGlowSize
    );
    coreGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    coreGradient.addColorStop(0.2, 'rgba(180, 50, 220, 0.8)');
    coreGradient.addColorStop(1, 'rgba(60, 0, 120, 0)');
    
    ctx.beginPath();
    ctx.arc(centerX, baseY + 30, coreGlowSize, 0, Math.PI * 2);
    ctx.fillStyle = coreGradient;
    ctx.fill();
    
    // Core inner detail
    ctx.beginPath();
    ctx.arc(centerX, baseY + 30, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    
    // Shoulders - angular design
    const drawShoulder = (xOffset) => {
      const shoulderGradient = ctx.createLinearGradient(
        centerX + xOffset - 10, baseY, 
        centerX + xOffset + 10, baseY + 20
      );
      shoulderGradient.addColorStop(0, '#222222');
      shoulderGradient.addColorStop(1, '#161616');
      
      ctx.fillStyle = shoulderGradient;
      ctx.beginPath();
      ctx.moveTo(centerX + xOffset - 10, baseY);
      ctx.lineTo(centerX + xOffset - 15, baseY + 5);
      ctx.lineTo(centerX + xOffset - 15, baseY + 20);
      ctx.lineTo(centerX + xOffset + 15, baseY + 20);
      ctx.lineTo(centerX + xOffset + 15, baseY + 5);
      ctx.lineTo(centerX + xOffset + 10, baseY);
      ctx.closePath();
      ctx.fill();
      
      // Shoulder accent - purple edge
      ctx.strokeStyle = 'rgba(140, 30, 180, 0.7)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(centerX + xOffset - 15, baseY + 5);
      ctx.lineTo(centerX + xOffset + 15, baseY + 5);
      ctx.stroke();
    };
    
    drawShoulder(-40);
    drawShoulder(40);
    
    // Arms
    const drawArm = (xOffset, angle) => {
      const armY = baseY + 20;
      const armLength = 70;
      const handRadius = 10;
      
      // Arm segment
      ctx.save();
      ctx.translate(centerX + xOffset, armY);
      ctx.rotate(angle);
      
      // Upper arm
      const armGradient = ctx.createLinearGradient(0, 0, 0, armLength * 0.6);
      armGradient.addColorStop(0, '#202020');
      armGradient.addColorStop(1, '#131313');
      
      ctx.fillStyle = armGradient;
      ctx.beginPath();
      ctx.moveTo(-8, 0);
      ctx.lineTo(-10, armLength * 0.6);
      ctx.lineTo(10, armLength * 0.6);
      ctx.lineTo(8, 0);
      ctx.closePath();
      ctx.fill();
      
      // Elbow joint
      ctx.beginPath();
      ctx.arc(0, armLength * 0.6, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#181818';
      ctx.fill();
      
      // Purple accent on elbow
      ctx.beginPath();
      ctx.arc(0, armLength * 0.6, 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(140, 30, 180, 0.7)';
      ctx.fill();
      
      // Forearm
      ctx.translate(0, armLength * 0.6);
      ctx.rotate(Math.sin(Date.now() * 0.002) * 0.2);
      
      const forearmGradient = ctx.createLinearGradient(0, 0, 0, armLength * 0.4);
      forearmGradient.addColorStop(0, '#181818');
      forearmGradient.addColorStop(1, '#0f0f0f');
      
      ctx.fillStyle = forearmGradient;
      ctx.beginPath();
      ctx.moveTo(-7, 0);
      ctx.lineTo(-9, armLength * 0.4);
      ctx.lineTo(9, armLength * 0.4);
      ctx.lineTo(7, 0);
      ctx.closePath();
      ctx.fill();
      
      // Hand
      ctx.translate(0, armLength * 0.4);
      
      ctx.beginPath();
      ctx.arc(0, 0, handRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#0f0f0f';
      ctx.fill();
      
      // Energy glow in hand - purple for emo style
      if (isAnimating) {
        const handGlowSize = Math.sin(Date.now() * 0.004) * 2 + 6;
        const handGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, handGlowSize);
        handGlow.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        handGlow.addColorStop(0.5, 'rgba(180, 50, 220, 0.7)');
        handGlow.addColorStop(1, 'rgba(60, 0, 120, 0)');
        
        ctx.beginPath();
        ctx.arc(0, 0, handGlowSize, 0, Math.PI * 2);
        ctx.fillStyle = handGlow;
        ctx.fill();
      }
      
      ctx.restore();
    };
    
    // Draw arms with gentle motion
    const leftArmAngle = Math.sin(Date.now() * 0.001) * 0.1 + 0.2;
    const rightArmAngle = Math.sin(Date.now() * 0.001 + 1) * 0.1 - 0.2;
    
    drawArm(-40, leftArmAngle);
    drawArm(40, rightArmAngle);
    
    // Head base - angular and dark
    const headGradient = ctx.createLinearGradient(centerX - 35, baseY - 90, centerX + 35, baseY - 20);
    headGradient.addColorStop(0, '#181818');
    headGradient.addColorStop(1, '#0a0a0a');
    
    ctx.fillStyle = headGradient;
    ctx.beginPath();
    
    // Angular head shape
    ctx.moveTo(centerX - 30, baseY - 80);
    ctx.lineTo(centerX - 35, baseY - 50);
    ctx.lineTo(centerX - 25, baseY - 20);
    ctx.lineTo(centerX + 25, baseY - 20);
    ctx.lineTo(centerX + 35, baseY - 50);
    ctx.lineTo(centerX + 30, baseY - 80);
    ctx.closePath();
    ctx.fill();
    
    // Neck - angular design
    const neckGradient = ctx.createLinearGradient(centerX - 15, baseY - 25, centerX + 15, baseY);
    neckGradient.addColorStop(0, '#151515');
    neckGradient.addColorStop(1, '#0a0a0a');
    
    ctx.fillStyle = neckGradient;
    ctx.beginPath();
    ctx.moveTo(centerX - 12, baseY - 25);
    ctx.lineTo(centerX - 14, baseY - 5);
    ctx.lineTo(centerX + 14, baseY - 5);
    ctx.lineTo(centerX + 12, baseY - 25);
    ctx.closePath();
    ctx.fill();
    
    // Face screen
    const faceGradient = ctx.createLinearGradient(centerX - 22, baseY - 72, centerX + 22, baseY - 40);
    faceGradient.addColorStop(0, '#0f0f0f');
    faceGradient.addColorStop(1, '#151515');
    
    ctx.fillStyle = faceGradient;
    ctx.beginPath();
    ctx.roundRect(centerX - 22, baseY - 72, 44, 35, 3);
    ctx.fill();
    
    // Emo "hair" partially covering one eye
    const hairGradient = ctx.createLinearGradient(centerX + 10, baseY - 90, centerX + 35, baseY - 55);
    hairGradient.addColorStop(0, '#000000');
    hairGradient.addColorStop(1, '#151515');
    
    ctx.fillStyle = hairGradient;
    ctx.beginPath();
    ctx.moveTo(centerX + 5, baseY - 80);
    ctx.lineTo(centerX + 35, baseY - 75);
    ctx.lineTo(centerX + 25, baseY - 45);
    ctx.lineTo(centerX + 15, baseY - 50);
    ctx.closePath();
    ctx.fill();
    
    // Hair highlights
    ctx.strokeStyle = 'rgba(100, 20, 140, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(centerX + 5, baseY - 80);
    ctx.lineTo(centerX + 35, baseY - 75);
    ctx.stroke();
    
    // Eyes - with glow and blink effect
    ctx.shadowColor = '#aa20ff';
    ctx.shadowBlur = isAnimating ? 15 : 10;
    
    const eyeHeight = eyeBlink ? 1 : 10;
    const eyeY = baseY - 60;
    
    // Left eye
    const leftEyeGradient = ctx.createLinearGradient(
      centerX - 15, eyeY - eyeHeight/2,
      centerX - 15, eyeY + eyeHeight/2
    );
    leftEyeGradient.addColorStop(0, '#c030ff');
    leftEyeGradient.addColorStop(1, '#7010aa');
    
    ctx.fillStyle = leftEyeGradient;
    ctx.beginPath();
    ctx.roundRect(centerX - 20, eyeY - eyeHeight/2, 10, eyeHeight, eyeHeight/2);
    ctx.fill();
    
    // Right eye (partially covered by hair)
    const rightEyeGradient = ctx.createLinearGradient(
      centerX + 15, eyeY - eyeHeight/2,
      centerX + 15, eyeY + eyeHeight/2
    );
    rightEyeGradient.addColorStop(0, '#c030ff');
    rightEyeGradient.addColorStop(1, '#7010aa');
    
    ctx.fillStyle = rightEyeGradient;
    ctx.beginPath();
    
    // Create a clipping path for the partially visible eye
    ctx.save();
    ctx.beginPath();
    ctx.rect(centerX + 10, eyeY - eyeHeight/2 - 1, 5, eyeHeight + 2);
    ctx.clip();
    
    // Draw the full eye (partially clipped)
    ctx.roundRect(centerX + 10, eyeY - eyeHeight/2, 10, eyeHeight, eyeHeight/2);
    ctx.fill();
    ctx.restore();
    
    // Reset shadow
    ctx.shadowBlur = 0;
    
    // Improved mouth - animated with more complex lip sync
    const mouthWidth = 30;
    const mouthHeight = mouthOpen * 15;
    
    // Mouth base - more angular for emo style
    ctx.fillStyle = '#080808';
    ctx.beginPath();
    ctx.moveTo(centerX - mouthWidth/2, baseY - 45);
    ctx.lineTo(centerX - mouthWidth/2 + 5, baseY - 45 + mouthHeight + 2);
    ctx.lineTo(centerX + mouthWidth/2 - 5, baseY - 45 + mouthHeight + 2);
    ctx.lineTo(centerX + mouthWidth/2, baseY - 45);
    ctx.closePath();
    ctx.fill();
    
    // Mouth glow - purple
    if (isAnimating && mouthHeight > 2) {
      const mouthGlow = ctx.createLinearGradient(
        centerX, baseY - 45,
        centerX, baseY - 45 + mouthHeight
      );
      mouthGlow.addColorStop(0, 'rgba(180, 50, 220, 0.9)');
      mouthGlow.addColorStop(1, 'rgba(60, 0, 120, 0.3)');
      
      ctx.fillStyle = mouthGlow;
      ctx.beginPath();
      ctx.moveTo(centerX - mouthWidth/2 + 3, baseY - 45 + 1);
      ctx.lineTo(centerX - mouthWidth/2 + 7, baseY - 45 + mouthHeight + 1);
      ctx.lineTo(centerX + mouthWidth/2 - 7, baseY - 45 + mouthHeight + 1);
      ctx.lineTo(centerX + mouthWidth/2 - 3, baseY - 45 + 1);
      ctx.closePath();
      ctx.fill();
      
      // Add sound wave visualization in mouth
      if (mouthHeight > 5) {
        ctx.strokeStyle = 'rgba(200, 100, 240, 0.7)';
        ctx.lineWidth = 1;
        
        const waveCount = Math.floor(mouthHeight / 3);
        const waveWidth = mouthWidth - 10;
        
        for (let i = 0; i < waveCount; i++) {
          const waveY = baseY - 45 + 3 + (i * 3);
          const waveAmplitude = (mouthHeight - (i * 2)) / 8;
          
          ctx.beginPath();
          ctx.moveTo(centerX - waveWidth/2, waveY);
          
          for (let x = 0; x <= waveWidth; x++) {
            const wx = centerX - waveWidth/2 + x;
            const wy = waveY + Math.sin((x / waveWidth) * Math.PI * 4 + time * (5 + i)) * waveAmplitude;
            ctx.lineTo(wx, wy);
          }
          
          ctx.stroke();
        }
      }
    }
    
    // Digital circuits on face - emo style
    ctx.strokeStyle = 'rgba(140, 30, 180, 0.5)';
    ctx.lineWidth = 1;
    
    // Circuit lines
    const drawCircuitLine = (startX, startY, endX, endY) => {
      const segments = Math.floor(Math.random() * 3) + 2;
      const dx = (endX - startX) / segments;
      const dy = (endY - startY) / segments;
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      
      for (let i = 1; i < segments; i++) {
        const x = startX + dx * i;
        const y = startY + dy * i;
        ctx.lineTo(x, y);
      }
      
      ctx.lineTo(endX, endY);
      ctx.stroke();
    };
    
    // Add circuit lines across face
    const circuitCount = 5;
    for (let i = 0; i < circuitCount; i++) {
      const seed = i * 10 + Math.floor(time) % 10;
      const startX = centerX - 20 + (seed % 10);
      const startY = baseY - 70 + (i * 7);
      const endX = centerX + 10 + ((seed * 3) % 10);
      const endY = startY + ((seed * 7) % 10) - 5;
      
      drawCircuitLine(startX, startY, endX, endY);
    }
    
    // Data points with pulsing effect
    const drawDataPoint = (x, y, size) => {
      const pulseSize = Math.sin(Date.now() * 0.003 + x * y) * 0.5 + 1;
      const dataGradient = ctx.createRadialGradient(
        x, y, 0,
        x, y, size * pulseSize
      );
      dataGradient.addColorStop(0, 'rgba(180, 50, 220, 0.9)');
      dataGradient.addColorStop(1, 'rgba(60, 0, 120, 0)');
      
      ctx.beginPath();
      ctx.arc(x, y, size * pulseSize, 0, Math.PI * 2);
      ctx.fillStyle = dataGradient;
      ctx.fill();
    };
    
    // Add data points across face
    for (let i = 0; i < 6; i++) {
      const x = centerX - 20 + Math.random() * 40;
      const y = baseY - 70 + Math.random() * 30;
      drawDataPoint(x, y, 1 + Math.random());
    }
    
    // Top head details - with purple accents
    ctx.fillStyle = '#0a0a0a';
    ctx.beginPath();
    ctx.moveTo(centerX - 20, baseY - 95);
    ctx.lineTo(centerX - 15, baseY - 80);
    ctx.lineTo(centerX + 15, baseY - 80);
    ctx.lineTo(centerX + 20, baseY - 95);
    ctx.closePath();
    ctx.fill();
    
    // Purple accent line
    ctx.strokeStyle = 'rgba(140, 30, 180, 0.7)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(centerX - 15, baseY - 85);
    ctx.lineTo(centerX + 15, baseY - 85);
    ctx.stroke();
    
    // Antenna with style
    const antennaBase = baseY - 95;
    const antennaHeight = 25;
    const antennaWobble = Math.sin(Date.now() * 0.003) * 3;
    
    // Multiple thin antennas for emo style
    const drawAntenna = (xOffset, height, wobbleMultiplier) => {
      const wobble = antennaWobble * wobbleMultiplier;
      
      ctx.strokeStyle = '#222';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX + xOffset, antennaBase);
      ctx.lineTo(centerX + xOffset + wobble, antennaBase - height);
      ctx.stroke();
      
      // Antenna tip
      const tipGlow = Math.sin(Date.now() * 0.01 + xOffset) * 2 + 3;
      const tipGradient = ctx.createRadialGradient(
        centerX + xOffset + wobble, antennaBase - height, 0,
        centerX + xOffset + wobble, antennaBase - height, tipGlow
      );
      tipGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      tipGradient.addColorStop(0.5, 'rgba(180, 50, 220, 0.7)');
      tipGradient.addColorStop(1, 'rgba(60, 0, 120, 0)');
      
      ctx.beginPath();
      ctx.arc(centerX + xOffset + wobble, antennaBase - height, tipGlow, 0, Math.PI * 2);
      ctx.fillStyle = tipGradient;
      ctx.fill();
    };
    
    drawAntenna(-10, antennaHeight, 1);
    drawAntenna(0, antennaHeight + 5, 0.8);
    drawAntenna(10, antennaHeight - 2, 1.2);
    
    // Add full body glow when speaking - purple
    if (isAnimating) {
      ctx.shadowColor = '#aa20ff';
      ctx.shadowBlur = 20;
      ctx.strokeStyle = 'rgba(140, 30, 180, 0.15)';
      ctx.lineWidth = 20;
      
      // Full body silhouette - angular
      ctx.beginPath();
      ctx.moveTo(centerX - 55, baseY - 95);
      ctx.lineTo(centerX - 60, baseY);
      ctx.lineTo(centerX - 50, baseY + 100);
      ctx.lineTo(centerX + 50, baseY + 100);
      ctx.lineTo(centerX + 60, baseY);
      ctx.lineTo(centerX + 55, baseY - 95);
      ctx.closePath();
      ctx.stroke();
      
      // Reset shadow
      ctx.shadowBlur = 0;
    }
    
  }, [mouthOpen, eyeBlink, isAnimating]);
  
  return (
    <div style={{ 
      width: '100%', 
      height: '300px', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      background: 'transparent'
    }}>
      <canvas 
        ref={canvasRef} 
        width={300} 
        height={300} 
        style={{ maxWidth: '100%', maxHeight: '100%' }}
      />
    </div>
  );
};

export default RobotModel; 