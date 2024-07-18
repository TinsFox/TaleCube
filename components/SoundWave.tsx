import React from 'react'
import { motion } from 'framer-motion'
interface SoundWaveProps {
  isAnimating?: boolean
}
export const SoundWave: React.FC<SoundWaveProps> = ({
  isAnimating = false
}) => {
  const numWaves = 10

  const waveVariants = (i: number) => {
    return {
      animate: {
        scaleY: [0.5, 1.25, 0.5],
        transition: {
          duration: 2 + i * 1,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'loop' as const
        }
      }
    }
  }

  return (
    <div className="flex h-20 items-end justify-center">
      {new Array(numWaves).fill(0).map((_, index) => (
        <motion.div
          key={index}
          className="mx-1 h-10 w-1 rounded bg-primary"
          style={{ originY: 1 }}
          variants={waveVariants(index)}
          animate={isAnimating ? 'animate' : 'stop'}
          initial={{ scaleY: 1 }}
          transition={{ delay: index * 0.1 }}
        />
      ))}
    </div>
  )
}
