import React, { useState, useEffect, useRef } from 'react'
import { getStoryPointsForCharacter, getCurrentStoryData } from './storyConfig'
import { getThemeForCharacter } from './themes/colorThemes'

// Content types for story points (now imported from storyConfig.ts)
// type ContentType = 'music' | 'image' | 'video' // No longer needed as it's defined in storyConfig.ts

function App() {
  const [currentStoryPoint, setCurrentStoryPoint] = useState(0) // Current story point (0-indexed)
  const [audioProgress, setAudioProgress] = useState(0) // Audio progress percentage
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [totalAudioLength, setTotalAudioLength] = useState(0)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFading, setIsFading] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isFocusedMode, setIsFocusedMode] = useState(false)
  const [currentCharacter, setCurrentCharacter] = useState(0)
  
  const audioRef = useRef<HTMLAudioElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  
  // Character data
  const characters = [
    { id: 1, name: "Eren Yeager" },
    { id: 2, name: "Mikasa Ackerman" },
    { id: 3, name: "Armin Arlert" },
    { id: 4, name: "Levi Ackerman" },
    { id: 5, name: "Historia Reiss" }
  ]
  
  // Get current story point data based on selected character
  const currentCharacterName = characters[currentCharacter].name
  const currentStoryData = getCurrentStoryData(currentCharacterName, currentStoryPoint)
  const currentContent = currentStoryData?.content
  const currentTheme = getThemeForCharacter(currentCharacterName)

  // Safety check - if no story data, return early
  if (!currentStoryData || !currentContent) {
    return <div>Loading...</div>
  }
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleStoryPointClick = (index: number) => {
    if (isFading || index === currentStoryPoint) return
    
    // Start fade out
    setIsFading(true)
    
    // After fade out completes, change content and fade in
    setTimeout(() => {
      setCurrentStoryPoint(index)
      
      // Reset audio and video states when changing story points
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
      if (videoRef.current) {
        videoRef.current.pause()
        videoRef.current.currentTime = 0
      }
      setIsPlaying(false)
      setIsVideoPlaying(false)
      setAudioProgress(0)
      setCurrentTime(0)
      
      // Start fade in
      setTimeout(() => {
        setIsFading(false)
      }, 50) // Small delay to ensure content is rendered
    }, 300) // Half of total transition time
  }

  const handleAudioProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseInt(e.target.value)
    setAudioProgress(newProgress)
    
    if (audioRef.current) {
      const newTime = (newProgress / 100) * totalAudioLength
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const togglePlayPause = () => {
    // Only allow audio control for music content
    if (currentContent.type === 'music' && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleVideoClick = () => {
    if (currentContent.type === 'video' && videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause()
        setIsVideoPlaying(false)
      } else {
        videoRef.current.play()
        setIsVideoPlaying(true)
      }
    }
  }

  const handleInfoClick = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCloseModal()
    }
  }

  const handleContentDoubleClick = async () => {
    if (currentContent.type === 'image') {
      setIsFullscreen(!isFullscreen)
    } else if (currentContent.type === 'video') {
      // Use native fullscreen for videos
      if (videoRef.current) {
        try {
          if (!document.fullscreenElement) {
            await videoRef.current.requestFullscreen()
          } else {
            await document.exitFullscreen()
          }
        } catch (error) {
          console.log('Fullscreen not supported or failed:', error)
        }
      }
    } else if (currentContent.type === 'music') {
      // Toggle focused mode for music
      setIsFocusedMode(!isFocusedMode)
    }
  }

  const handleFullscreenBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsFullscreen(false)
    }
  }

  const handleCharacterClick = (index: number) => {
    setCurrentCharacter(index)
    setCurrentStoryPoint(0) // Reset to first story point when switching characters
  }

  // Handle escape key to exit fullscreen and focused mode
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false)
        }
        if (isFocusedMode) {
          setIsFocusedMode(false)
        }
      }
    }

    if (isFullscreen || isFocusedMode) {
      document.addEventListener('keydown', handleEscapeKey)
      return () => document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [isFullscreen, isFocusedMode])

  // Handle native fullscreen changes for videos
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && currentContent.type === 'video') {
        // Video exited fullscreen, ensure our state is in sync
        // No need to do anything special here as the video will handle its own state
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [currentContent.type])

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadedMetadata = () => {
      setTotalAudioLength(audio.duration)
    }

    const handleTimeUpdate = () => {
      const progress = (audio.currentTime / audio.duration) * 100
      setAudioProgress(progress)
      setCurrentTime(audio.currentTime)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setAudioProgress(0)
      setCurrentTime(0)
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
    }
  }, [])

  // Note: Removed auto-play functionality - music only plays when user clicks play button

  return (
    <>
      {/* Main Content with Blur Effect */}
      <div style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        background: currentTheme.part2.background,
        overflow: 'hidden',
        boxSizing: 'border-box',
        margin: 0,
        padding: 0,
        filter: isFocusedMode ? 'blur(8px)' : 'none',
        transition: 'filter 0.3s ease'
      }}>
      {/* Part 1: Top Section (10%) */}
      <div style={{
        height: '10%',
        display: 'flex',
        alignItems: 'center',
        padding: '0 15px',
        background: currentTheme.part1.background,
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(108, 117, 125, 0.15)',
        boxSizing: 'border-box',
        position: 'relative'
      }}>
        {/* Character Name and Dots */}
        <div style={{
          position: 'absolute',
          left: '15px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: currentTheme.part1.title,
            margin: 0,
            letterSpacing: '-0.5px'
          }}>
            {characters[currentCharacter].name}
          </h1>
          
          {/* Character Dots */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            {characters.map((character, index) => (
              <button
                key={character.id}
                onClick={() => handleCharacterClick(index)}
                style={{
                  width: index === currentCharacter ? '12px' : 
                         Math.abs(index - currentCharacter) === 1 ? '8px' : '6px',
                  height: index === currentCharacter ? '12px' : 
                          Math.abs(index - currentCharacter) === 1 ? '8px' : '6px',
                  borderRadius: '50%',
                  border: 'none',
                  background: index === currentCharacter ? '#495057' : 
                             Math.abs(index - currentCharacter) === 1 ? '#6c757d' : 'rgba(108, 117, 125, 0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  padding: 0
                }}
                onMouseEnter={(e) => {
                  if (index !== currentCharacter) {
                    e.currentTarget.style.background = '#6c757d'
                    e.currentTarget.style.transform = 'scale(1.1)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (index !== currentCharacter) {
                    e.currentTarget.style.background = Math.abs(index - currentCharacter) === 1 ? '#6c757d' : 'rgba(108, 117, 125, 0.3)'
                    e.currentTarget.style.transform = 'scale(1)'
                  }
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Story Title - Centered */}
        <h2 style={{
          fontSize: '18px',
          fontWeight: '500',
          color: currentTheme.part1.subtitle,
          margin: 0,
          textAlign: 'center',
          width: '100%'
        }}>
          {currentStoryData.title}
        </h2>
      </div>

      {/* Part 2: Main Content (60%) - Fixed Size Container */}
      <div style={{
        height: '60%',
        width: 'calc(100% - 20px)',
        margin: '5px 10px',
        background: currentTheme.part2.background,
        borderRadius: '15px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
        border: '1px solid rgba(108, 117, 125, 0.1)',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Content Type Indicator */}
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 10
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '8px 12px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <span style={{
              fontSize: '12px',
              fontWeight: '600',
              color: currentContent.type === 'music' ? '#007AFF' : 
                     currentContent.type === 'image' ? '#34C759' : '#FF3B30',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {currentContent.type}
            </span>
            <button
              onClick={handleInfoClick}
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '6px',
                border: 'none',
                background: '#007AFF',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: '600',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#0056CC'
                e.currentTarget.style.transform = 'scale(1.05)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#007AFF'
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              i
            </button>
          </div>
        </div>

        {/* Fixed Content Container - Always Same Size */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Content with Fade and Scale Animation */}
          <div style={{
            opacity: isFading ? 0 : 1,
            transform: isFading ? 'scale(0.95)' : 'scale(1)',
            transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: isFading ? 'none' : 'auto'
          }}>
            {currentContent.type === 'music' && (
              <img 
                src={currentContent.imagePath} 
                alt={currentStoryData.title}
                onDoubleClick={isFading ? undefined : handleContentDoubleClick}
                style={{
                  maxWidth: '80%',
                  maxHeight: '80%',
                  objectFit: 'contain',
                  borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                  cursor: isFading ? 'default' : 'pointer'
                }}
              />
            )}
            
            {currentContent.type === 'image' && (
              <img 
                src={currentContent.mediaPath} 
                alt={currentStoryData.title}
                onDoubleClick={isFading ? undefined : handleContentDoubleClick}
                style={{
                  maxWidth: '80%',
                  maxHeight: '80%',
                  objectFit: 'contain',
                  borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                  cursor: isFading ? 'default' : 'pointer'
                }}
              />
            )}
            
            {currentContent.type === 'video' && (
              <div style={{ 
                position: 'relative', 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                maxWidth: '80%',
                maxHeight: '80%',
                margin: '0 auto'
              }}>
                <video 
                  ref={videoRef}
                  src={currentContent.mediaPath}
                  onClick={isFading ? undefined : handleVideoClick}
                  onDoubleClick={isFading ? undefined : handleContentDoubleClick}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                    cursor: isFading ? 'default' : 'pointer',
                    display: 'block'
                  }}
                  poster=""
                />
                
                {/* Pause Indicator - Only show when video is paused */}
                {!isVideoPlaying && (
                  <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    background: 'rgba(0, 0, 0, 0.7)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                    zIndex: 10
                  }}>
                    <div style={{
                      width: '0',
                      height: '0',
                      borderLeft: '8px solid white',
                      borderTop: '6px solid transparent',
                      borderBottom: '6px solid transparent',
                      marginLeft: '2px'
                    }} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Part 3: Story Points Navigation (15%) */}
      <div style={{
        height: '15%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '5px 15px',
        background: currentTheme.part3.background,
        backdropFilter: 'blur(20px)',
        boxSizing: 'border-box'
      }}>
        {/* Story Points Dots */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '15px'
        }}>
          {getStoryPointsForCharacter(currentCharacterName).map((point, index) => (
            <button
              key={point.id}
              onClick={() => !isFading && handleStoryPointClick(index)}
              style={{
                width: index === currentStoryPoint ? '16px' : 
                       Math.abs(index - currentStoryPoint) === 1 ? '12px' : '8px',
                height: index === currentStoryPoint ? '16px' : 
                        Math.abs(index - currentStoryPoint) === 1 ? '12px' : '8px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: index === currentStoryPoint ? currentTheme.part3.dots.active : 
                               Math.abs(index - currentStoryPoint) === 1 ? currentTheme.part3.dots.adjacent : currentTheme.part3.dots.inactive,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                opacity: Math.abs(index - currentStoryPoint) > 1 ? 0.3 : 1
              }}
            />
          ))}
        </div>

        {/* Story Point Title and Subtitle */}
        <div style={{ textAlign: 'center' }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: currentTheme.part3.title,
            margin: '0 0 5px 0',
            letterSpacing: '-0.3px'
          }}>
            {currentStoryData.title}
          </h3>
          <p style={{
            fontSize: '14px',
            color: currentTheme.part3.subtitle,
            margin: 0,
            fontWeight: '400'
          }}>
            {currentStoryData.subtitle}
          </p>
        </div>
      </div>

      {/* Part 4: Audio Controls (15%) */}
      <div style={{
        height: '15%',
        display: 'flex',
        alignItems: 'center',
        padding: '0 15px',
        background: currentTheme.part4.background,
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(108, 117, 125, 0.15)',
        boxSizing: 'border-box',
        position: 'relative',
        opacity: currentContent.type === 'music' ? 1 : 0.6
      }}>
        {/* AudioDock Section - Positioned at 55%-90% */}
        <div style={{
          position: 'absolute',
          left: '55%',
          right: '10%',
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}>
          {/* AudioDock Text */}
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: currentTheme.part4.title,
            margin: 0,
            letterSpacing: '-0.5px',
            whiteSpace: 'nowrap'
          }}>
            AudioDock
          </h2>

          {/* Play/Pause Button */}
          <button
            onClick={togglePlayPause}
            disabled={currentContent.type !== 'music'}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: 'none',
              background: currentContent.type === 'music' ? currentTheme.part4.playButton.background : '#9ca3af',
              color: 'white',
              cursor: currentContent.type === 'music' ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              transition: 'all 0.15s ease',
              boxShadow: currentContent.type === 'music' 
                ? '0 2px 8px rgba(0, 122, 255, 0.25)' 
                : '0 2px 8px rgba(156, 163, 175, 0.25)',
              flexShrink: 0,
              opacity: currentContent.type === 'music' ? 1 : 0.6
            }}
            onMouseEnter={(e) => {
              if (currentContent.type === 'music') {
                e.currentTarget.style.background = '#0056CC'
                e.currentTarget.style.transform = 'scale(1.05)'
              }
            }}
            onMouseLeave={(e) => {
              if (currentContent.type === 'music') {
                e.currentTarget.style.background = '#007AFF'
                e.currentTarget.style.transform = 'scale(1)'
              }
            }}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>

          {/* Progress Bar with Time Display */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            flex: 1,
            minWidth: '300px',
            opacity: currentContent.type === 'music' ? 1 : 0.6
          }}>
            {/* Progress Bar */}
            <div style={{ width: '100%', position: 'relative', height: '20px', display: 'flex', alignItems: 'center' }}>
              <input
                type="range"
                min="0"
                max="100"
                value={audioProgress}
                onChange={handleAudioProgressChange}
                disabled={currentContent.type !== 'music'}
                style={{
                  width: '100%',
                  height: '4px',
                  borderRadius: '2px',
                  background: currentContent.type === 'music' 
                    ? `linear-gradient(to right, ${currentTheme.part4.progressBar.fill} 0%, ${currentTheme.part4.progressBar.fill} ${audioProgress}%, ${currentTheme.part4.progressBar.track} ${audioProgress}%, ${currentTheme.part4.progressBar.track} 100%)`
                    : `linear-gradient(to right, #9ca3af 0%, #9ca3af ${audioProgress}%, #d1d5db ${audioProgress}%, #d1d5db 100%)`,
                  outline: 'none',
                  cursor: currentContent.type === 'music' ? 'pointer' : 'not-allowed',
                  appearance: 'none',
                  position: 'relative',
                  zIndex: 1,
                  WebkitAppearance: 'none',
                  MozAppearance: 'none'
                }}
              />
              <style>
                {`
                  input[type="range"]::-webkit-slider-thumb {
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: ${currentContent.type === 'music' ? '#007AFF' : '#9ca3af'};
                    cursor: ${currentContent.type === 'music' ? 'pointer' : 'not-allowed'};
                    box-shadow: ${currentContent.type === 'music' 
                      ? '0 2px 6px rgba(0, 122, 255, 0.3), 0 0 0 2px rgba(255, 255, 255, 0.8)' 
                      : '0 2px 6px rgba(156, 163, 175, 0.3), 0 0 0 2px rgba(255, 255, 255, 0.8)'};
                    transition: all 0.15s ease;
                  }
                  input[type="range"]::-webkit-slider-thumb:hover {
                    transform: scale(1.2);
                    box-shadow: ${currentContent.type === 'music' 
                      ? '0 4px 12px rgba(0, 122, 255, 0.4), 0 0 0 2px rgba(255, 255, 255, 0.9)' 
                      : '0 2px 6px rgba(156, 163, 175, 0.3), 0 0 0 2px rgba(255, 255, 255, 0.8)'};
                  }
                  input[type="range"]::-moz-range-thumb {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: ${currentContent.type === 'music' ? '#007AFF' : '#9ca3af'};
                    cursor: ${currentContent.type === 'music' ? 'pointer' : 'not-allowed'};
                    border: none;
                    box-shadow: ${currentContent.type === 'music' 
                      ? '0 2px 6px rgba(0, 122, 255, 0.3), 0 0 0 2px rgba(255, 255, 255, 0.8)' 
                      : '0 2px 6px rgba(156, 163, 175, 0.3), 0 0 0 2px rgba(255, 255, 255, 0.8)'};
                    transition: all 0.15s ease;
                  }
                `}
              </style>
            </div>
            
            {/* Time Display */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              fontSize: '12px',
              color: currentTheme.part4.timeText,
              fontWeight: '500'
            }}>
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(totalAudioLength)}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Hidden Audio Element */}
      <audio 
        ref={audioRef}
        src={currentContent.type === 'music' ? currentContent.mediaPath : ''}
        preload="metadata"
      />

      {/* Info Modal */}
      {isModalOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={handleBackdropClick}
        >
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            position: 'relative'
          }}>
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                border: 'none',
                background: 'rgba(0, 0, 0, 0.1)',
                color: '#666',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                fontWeight: '600',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.2)'
                e.currentTarget.style.transform = 'scale(1.05)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.1)'
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              ×
            </button>

            {/* Modal Content */}
            <div style={{
              paddingRight: '40px' // Space for close button
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#1d1d1f',
                margin: '0 0 8px 0',
                letterSpacing: '-0.3px'
              }}>
                {currentStoryData.title}
              </h3>
              
              <p style={{
                fontSize: '14px',
                color: '#6c757d',
                margin: '0 0 16px 0',
                fontWeight: '400'
              }}>
                {currentStoryData.subtitle}
              </p>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '20px'
              }}>
                <span style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: currentContent.type === 'music' ? '#007AFF' : 
                         currentContent.type === 'image' ? '#34C759' : '#FF3B30',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  background: currentContent.type === 'music' ? 'rgba(0, 122, 255, 0.1)' : 
                             currentContent.type === 'image' ? 'rgba(52, 199, 89, 0.1)' : 'rgba(255, 59, 48, 0.1)',
                  padding: '4px 8px',
                  borderRadius: '6px'
                }}>
                  {currentContent.type}
                </span>
              </div>

              <p style={{
                fontSize: '16px',
                color: '#2c3e50',
                lineHeight: '1.6',
                margin: 0
              }}>
                {currentStoryData.content.info}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Overlay - Only for images and music */}
      {isFullscreen && (currentContent.type === 'image' || currentContent.type === 'music') && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            cursor: 'pointer'
          }}
          onClick={handleFullscreenBackdropClick}
        >
          {/* Fullscreen Content */}
          <div style={{
            maxWidth: '95vw',
            maxHeight: '95vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {currentContent.type === 'music' && (
              <img 
                src={currentContent.imagePath} 
                alt={currentStoryData.title}
                onDoubleClick={handleContentDoubleClick}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  borderRadius: '8px',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                  cursor: 'pointer'
                }}
              />
            )}
            
            {currentContent.type === 'image' && (
              <img 
                src={currentContent.mediaPath} 
                alt={currentStoryData.title}
                onDoubleClick={handleContentDoubleClick}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  borderRadius: '8px',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                  cursor: 'pointer'
                }}
              />
            )}
          </div>

          {/* Fullscreen Instructions */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '500',
            pointerEvents: 'none'
          }}>
            Double-click to exit fullscreen • Press ESC to exit
          </div>
        </div>
      )}
      </div>

      {/* Focused Mode Overlay - Only for music */}
      {isFocusedMode && currentContent.type === 'music' && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1500,
            cursor: 'pointer'
          }}
          onClick={() => setIsFocusedMode(false)}
        >
          {/* Enlarged AudioDock */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 242, 245, 0.98) 50%, rgba(248, 250, 252, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '40px 60px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            minWidth: '500px',
            maxWidth: '80vw',
            cursor: 'default'
          }} onClick={(e) => e.stopPropagation()}>
            {/* AudioDock Title */}
            <h2 style={{
              fontSize: '28px',
              fontWeight: '600',
              color: currentTheme.focusedMode.audioDock.title,
              margin: '0 0 30px 0',
              textAlign: 'center',
              letterSpacing: '-0.5px'
            }}>
              AudioDock
            </h2>

            {/* Enlarged Progress Bar Container */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '30px',
              marginBottom: '20px'
            }}>
              {/* Enlarged Play/Pause Button */}
              <button
                onClick={togglePlayPause}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  border: 'none',
                  background: isPlaying ? '#FF3B30' : currentTheme.focusedMode.audioDock.playButton.background,
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: '500',
                  boxShadow: '0 2px 8px rgba(0, 122, 255, 0.25)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isPlaying ? '#FF453A' : '#0056CC'
                  e.currentTarget.style.transform = 'scale(1.05)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isPlaying ? '#FF3B30' : '#007AFF'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                {isPlaying ? '⏸' : '▶'}
              </button>

              {/* Enlarged Progress Bar */}
              <div style={{
                flex: 1,
                minWidth: '400px'
              }}>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={audioProgress}
                  onChange={handleAudioProgressChange}
                  style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: '4px',
                    background: `linear-gradient(to right, ${currentTheme.part4.progressBar.fill} 0%, ${currentTheme.part4.progressBar.fill} ${audioProgress}%, ${currentTheme.part4.progressBar.track} ${audioProgress}%, ${currentTheme.part4.progressBar.track} 100%)`,
                    outline: 'none',
                    cursor: 'pointer',
                    WebkitAppearance: 'none',
                    appearance: 'none'
                  }}
                />
                <style>
                  {`
                    input[type="range"]::-webkit-slider-thumb {
                      appearance: none;
                      width: 20px;
                      height: 20px;
                      border-radius: 50%;
                      background: #007AFF;
                      cursor: pointer;
                      box-shadow: 0 2px 6px rgba(0, 122, 255, 0.3), 0 0 0 2px rgba(255, 255, 255, 0.8);
                      transition: all 0.2s ease;
                    }
                    input[type="range"]::-webkit-slider-thumb:hover {
                      transform: scale(1.1);
                      box-shadow: 0 4px 12px rgba(0, 122, 255, 0.4), 0 0 0 2px rgba(255, 255, 255, 0.9);
                    }
                    input[type="range"]::-moz-range-thumb {
                      width: 20px;
                      height: 20px;
                      border-radius: 50%;
                      background: #007AFF;
                      cursor: pointer;
                      border: none;
                      box-shadow: 0 2px 6px rgba(0, 122, 255, 0.3), 0 0 0 2px rgba(255, 255, 255, 0.8);
                      transition: all 0.2s ease;
                    }
                    input[type="range"]::-moz-range-thumb:hover {
                      transform: scale(1.1);
                      box-shadow: 0 4px 12px rgba(0, 122, 255, 0.4), 0 0 0 2px rgba(255, 255, 255, 0.9);
                    }
                  `}
                </style>
              </div>
            </div>

            {/* Enlarged Time Display */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              fontSize: '16px',
              color: currentTheme.focusedMode.audioDock.timeText,
              fontWeight: '500'
            }}>
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(totalAudioLength)}</span>
            </div>

            {/* Focused Mode Instructions */}
            <div style={{
              textAlign: 'center',
              marginTop: '20px',
              fontSize: '14px',
              color: '#8e8e93',
              fontWeight: '500'
            }}>
              Double-click to exit focus mode • Press ESC to exit
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default App
