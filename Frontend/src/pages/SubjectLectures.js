import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/simplebutton";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "../components/ui/sidebar";
import { Play, Clock, Eye, Download, ArrowLeft, CheckCircle, X, Maximize2, Globe, Gamepad2, Brain } from "lucide-react";
import StudentSidebar from "../components/StudentSidebar";
import { useState, useEffect } from "react";

// Import thumbnail images
import sci1 from "../assets/sci1.png";
import sci2 from "../assets/sci2.png";
import sci3 from "../assets/sci3.png";
import sci4 from "../assets/sci4.png";
import sci5 from "../assets/sci5.png";
import sci6 from "../assets/sci6.png";
import circuitGameImage from "../assets/circuit-game-image.png";

const SubjectLectures = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Student";
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [isGridView, setIsGridView] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('video'); // 'video' or language codes
  const [videoRef, setVideoRef] = useState(null);
  const [showAudioMenu, setShowAudioMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("userName");
    navigate("/");
  };

  // Close grid view on escape key and handle outside clicks
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (showAudioMenu) {
          setShowAudioMenu(false);
        } else if (isGridView) {
          closeGridView();
        }
      }
    };

    const handleClickOutside = (event) => {
      if (showAudioMenu && !event.target.closest('.audio-menu')) {
        setShowAudioMenu(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isGridView, showAudioMenu]);


  const subjectData = {
    math: {
      title: "Mathematics",
      description: "Advanced algebra, calculus, and problem-solving techniques",
      icon: "🧮",
      color: "from-blue-500 to-blue-700",
      teacher: "Dr. Sarah Wilson",
      teacherAvatar: "/placeholder.svg"
    },
    science: {
      title: "Science",
      description: "Biology, chemistry fundamentals and laboratory experiments",
      icon: "🔬",
      color: "from-green-500 to-green-700",
      teacher: "Prof. Michael Chen",
      teacherAvatar: "/placeholder.svg"
    },
    physics: {
      title: "Physics",
      description: "Mechanics, thermodynamics, and quantum physics concepts",
      icon: "⚛️",
      color: "from-purple-500 to-purple-700",
      teacher: "Dr. Emily Rodriguez",
      teacherAvatar: "/placeholder.svg"
    },
    history: {
      title: "History",
      description: "World civilizations, historical analysis, and timeline studies",
      icon: "🌍",
      color: "from-orange-500 to-orange-700",
      teacher: "Dr. James Thompson",
      teacherAvatar: "/placeholder.svg"
    }
  };

  const subject = subjectData[subjectId];

  // Audio track options (YouTube-like)
  const audioTracks = [
    { code: 'video', name: 'Original', flag: '🎬', description: 'Original video audio' },
    { code: 'english', name: 'English', flag: '🇺🇸', description: 'English audio track' },
    { code: 'hindi', name: 'Hindi', flag: '🇮🇳', description: 'Hindi audio track' },
    { code: 'telugu', name: 'Telugu', flag: '🇮🇳', description: 'Telugu audio track' },
    { code: 'gujarati', name: 'Gujarati', flag: '🇮🇳', description: 'Gujarati audio track' },
    { code: 'kannada', name: 'Kannada', flag: '🇮🇳', description: 'Kannada audio track' }
  ];

  if (!subject) {
    return <div>Subject not found</div>;
  }

  const lectures = [
    {
      id: 1,
      title: `Introduction to ${subject.title}`,
      description: `Fundamentals and basic concepts of ${subject.title.toLowerCase()}`,
      duration: "45 minutes",
      views: 234,
      uploadDate: "2024-01-15",
      isCompleted: true,
      videoUrl: "/videos/science/lecture1.mp4",
      thumbnail: sci1,
      hasMultiLanguageAudio: true,
      audioTracks: {
        english: "/videos/science/audio/lecture1/english/english.mp3",
        hindi: "/videos/science/audio/lecture1/hindi/hindi.mp3",
        telugu: "/videos/science/audio/lecture1/telugu/telgu.mp3",
        gujarati: "/videos/science/audio/lecture1/gujarati/gujrati.mp3",
        kannada: "/videos/science/audio/lecture1/kannada/kannada.mp3"
      }
    },
    {
      id: 2,
      title: `${subject.title} Basics - Part 1`,
      description: `Core principles and foundational knowledge in ${subject.title.toLowerCase()}`,
      duration: "52 minutes",
      views: 198,
      uploadDate: "2024-01-18",
      isCompleted: true,
      videoUrl: "https://example.com/video2",
      thumbnail: sci2
    },
    {
      id: 3,
      title: `${subject.title} Basics - Part 2`,
      description: `Advanced concepts and practical applications`,
      duration: "38 minutes",
      views: 156,
      uploadDate: "2024-01-22",
      isCompleted: false,
      videoUrl: "https://example.com/video3",
      thumbnail: sci3
    },
    {
      id: 4,
      title: `Problem Solving in ${subject.title}`,
      description: `Step-by-step approach to solving complex problems`,
      duration: "41 minutes",
      views: 143,
      uploadDate: "2024-01-25",
      isCompleted: false,
      videoUrl: "https://example.com/video4",
      thumbnail: sci4
    },
    {
      id: 5,
      title: `Advanced ${subject.title} Concepts`,
      description: `Deep dive into advanced topics and theories`,
      duration: "55 minutes",
      views: 89,
      uploadDate: "2024-01-28",
      isCompleted: false,
      videoUrl: "https://example.com/video5",
      thumbnail: sci5
    },
    {
      id: 6,
      title: `${subject.title} Case Studies`,
      description: `Real-world applications and case study analysis`,
      duration: "48 minutes",
      views: 67,
      uploadDate: "2024-02-01",
      isCompleted: false,
      videoUrl: "https://example.com/video6",
      thumbnail: sci6
    }
  ];

  const handleVideoClick = (lecture) => {
    setSelectedLecture(lecture);
    setIsGridView(true);
  };

  const closeGridView = () => {
    // Clean up audio when closing
    if (videoRef?.syncedAudio) {
      videoRef.syncedAudio.pause();
      videoRef.syncedAudio.remove();
      videoRef.syncedAudio = null;
    }

    if (videoRef?.audioSyncListeners) {
      videoRef.audioSyncListeners.forEach(({ event, handler }) => {
        videoRef.removeEventListener(event, handler);
      });
      videoRef.audioSyncListeners = [];
    }

    setIsGridView(false);
    setSelectedLecture(null);
    setShowAudioMenu(false);
    setSelectedLanguage('video');
  };

  // YouTube-like audio track switching - simplified approach
  const switchAudioTrack = (trackType) => {
    if (!videoRef || !selectedLecture?.hasMultiLanguageAudio) return;

    console.log('Switching to audio track:', trackType);
    const currentTime = videoRef.currentTime;
    const wasPlaying = !videoRef.paused;

    // Clean up existing audio track
    if (videoRef.syncedAudio) {
      videoRef.syncedAudio.pause();
      videoRef.syncedAudio.remove();
      videoRef.syncedAudio = null;
    }

    // Remove existing event listeners
    if (videoRef.audioSyncListeners) {
      videoRef.audioSyncListeners.forEach(({ event, handler }) => {
        videoRef.removeEventListener(event, handler);
      });
      videoRef.audioSyncListeners = [];
    }

    if (trackType === 'video') {
      // Use original video audio
      videoRef.muted = false;
      setSelectedLanguage(trackType);
      setShowAudioMenu(false);
      return;
    }

    // Create synced audio for language track
    videoRef.muted = true;
    const audio = document.createElement('audio');
    audio.src = selectedLecture.audioTracks[trackType];
    audio.preload = 'auto';
    audio.currentTime = currentTime;

    // Store reference
    videoRef.syncedAudio = audio;

    // Perfect sync functions
    const syncAudio = () => {
      if (Math.abs(videoRef.currentTime - audio.currentTime) > 0.2) {
        audio.currentTime = videoRef.currentTime;
      }
    };

    const playAudio = () => audio.play().catch(console.error);
    const pauseAudio = () => audio.pause();
    const seekAudio = () => { audio.currentTime = videoRef.currentTime; };

    // Add event listeners for perfect sync
    const listeners = [
      { event: 'play', handler: playAudio },
      { event: 'pause', handler: pauseAudio },
      { event: 'seeked', handler: seekAudio },
      { event: 'timeupdate', handler: syncAudio }
    ];

    listeners.forEach(({ event, handler }) => {
      videoRef.addEventListener(event, handler);
    });

    videoRef.audioSyncListeners = listeners;

    // Resume playback state
    if (wasPlaying) {
      audio.addEventListener('canplay', () => {
        videoRef.play();
        audio.play();
      }, { once: true });
    }

    setSelectedLanguage(trackType);
    setShowAudioMenu(false);
  };

  const getRelatedVideo = (currentLecture) => {
    const currentIndex = lectures.findIndex(l => l.id === currentLecture.id);
    const nextIndex = (currentIndex + 1) % lectures.length;
    return lectures[nextIndex];
  };

  const completedLectures = lectures.filter(l => l.isCompleted).length;
  const progressPercentage = Math.round((completedLectures / lectures.length) * 100);

  return (
    <SidebarProvider>
      <StudentSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-[#F8FAFC]">
          {/* Header */}
          <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="md:hidden" />
                <Button variant="ghost" size="sm" onClick={() => navigate('/lectures')}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Lectures
                </Button>
                <div className="w-8 h-8 rounded-full bg-[#1D4ED8] flex items-center justify-center">
                  <span className="text-lg">{subject.icon}</span>
                </div>
                <h1 className="text-xl font-bold text-[#1E293B] font-jakarta">
                  {subject.title} Lectures
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{userName}</span>
                </div>
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>
          </header>

          <div className="container mx-auto px-4 py-8">
            {/* Subject Info */}
            <div className="mb-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="text-4xl">{subject.icon}</div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2">{subject.title}</h2>
                  <p className="text-muted-foreground mb-4">{subject.description}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={subject.teacherAvatar} />
                        <AvatarFallback className="text-xs bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                          {subject.teacher.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{subject.teacher}</p>
                        <p className="text-xs text-muted-foreground">Instructor</p>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {completedLectures}/{lectures.length} Completed
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Course Progress</span>
                    <span className="font-medium">{progressPercentage}% Complete</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`bg-gradient-to-r ${subject.color} h-3 rounded-full transition-all`}
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* YouTube-like Grid View Modal */}
            {isGridView && selectedLecture && (
              <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
                <div className="w-full max-w-7xl h-full max-h-[90vh] bg-background rounded-lg overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-2">
                      <div className="text-2xl">{subject.icon}</div>
                      <h2 className="text-xl font-semibold">{selectedLecture.title}</h2>
                    </div>
                    <Button variant="ghost" size="sm" onClick={closeGridView}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* 50-50 Video Grid */}
                  <div className="grid grid-cols-2 gap-1 h-[calc(100%-80px)]">
                    {/* Main Video (Left 50%) */}
                    <div className="relative bg-gray-900 flex flex-col">
                      <div className="relative flex-1 bg-gradient-to-br from-gray-800 to-gray-900">
                        {selectedLecture.videoUrl.includes('.mp4') ? (
                          <div className="relative w-full h-full">
                            {/* YouTube-like Audio Track Menu */}
                            {selectedLecture.hasMultiLanguageAudio && (
                              <div className="absolute top-4 right-4 z-20 audio-menu">
                                <div className="relative">
                                  {/* Audio Track Button */}
                                  <button
                                    onClick={() => setShowAudioMenu(!showAudioMenu)}
                                    className="bg-black/80 hover:bg-black/90 text-white px-3 py-2 rounded-lg flex items-center gap-2 transition-colors"
                                  >
                                    <Globe className="w-4 h-4" />
                                    <span className="text-sm">
                                      {audioTracks.find(t => t.code === selectedLanguage)?.flag}{' '}
                                      {audioTracks.find(t => t.code === selectedLanguage)?.name}
                                    </span>
                                    <span className="ml-1">{showAudioMenu ? '▲' : '▼'}</span>
                                  </button>

                                  {/* Dropdown Menu */}
                                  {showAudioMenu && (
                                    <div className="absolute top-full right-0 mt-2 bg-black/95 rounded-lg shadow-xl border border-gray-600 overflow-hidden min-w-[240px] max-h-80 overflow-y-auto">
                                      <div className="p-3 border-b border-gray-600 bg-gray-800/50">
                                        <span className="text-white text-sm font-medium">🎵 Audio Track</span>
                                      </div>
                                      {audioTracks.map((track) => (
                                        <button
                                          key={track.code}
                                          onClick={() => switchAudioTrack(track.code)}
                                          className={`w-full text-left px-4 py-3 hover:bg-gray-700/50 transition-all duration-200 flex items-center gap-3 ${selectedLanguage === track.code ? 'bg-blue-600/80' : ''
                                            }`}
                                        >
                                          <span className="text-xl">{track.flag}</span>
                                          <div className="flex-1">
                                            <div className="text-white text-sm font-medium">{track.name}</div>
                                            <div className="text-gray-400 text-xs">{track.description}</div>
                                          </div>
                                          {selectedLanguage === track.code && (
                                            <span className="text-blue-300 font-bold">✓</span>
                                          )}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Video Player */}
                            <video
                              ref={(ref) => {
                                setVideoRef(ref);
                                // Clean up any existing audio sync on unmount
                                if (ref) {
                                  ref.addEventListener('beforeunload', () => {
                                    if (ref.cleanupAudio) {
                                      ref.cleanupAudio();
                                    }
                                  });
                                }
                              }}
                              className="w-full h-full object-contain"
                              controls
                              poster={selectedLecture.thumbnail}
                              onLoadedData={() => {
                                console.log('Video loaded');
                              }}
                              onClick={() => setShowAudioMenu(false)} // Close menu when clicking video
                            >
                              <source src={selectedLecture.videoUrl} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center text-white">
                              <Play className="w-16 h-16 mx-auto mb-4 opacity-80" />
                              <h3 className="text-lg font-semibold mb-2">{selectedLecture.title}</h3>
                              <p className="text-sm opacity-80 mb-4">{selectedLecture.description}</p>
                              <div className="flex items-center justify-center gap-4 text-sm opacity-60">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {selectedLecture.duration}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Eye className="w-4 h-4" />
                                  {selectedLecture.views} views
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                        <Button
                          className="absolute top-4 right-4"
                          size="sm"
                          onClick={() => {
                            if (selectedLecture.videoUrl.includes('.mp4')) {
                              if (videoRef && videoRef.requestFullscreen) {
                                videoRef.requestFullscreen();
                              }
                            } else {
                              window.open(selectedLecture.videoUrl, '_blank');
                            }
                          }}
                        >
                          <Maximize2 className="w-4 h-4 mr-1" />
                          Full Screen
                        </Button>
                      </div>

                      {/* Video Info Panel */}
                      <div className="p-4 bg-gray-900 text-white">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-medium mb-1">{selectedLecture.title}</h4>
                            <p className="text-sm opacity-80 mb-2">{selectedLecture.description}</p>
                          </div>
                          <Badge variant="secondary" className="ml-2">
                            {selectedLecture.isCompleted ? "Completed" : "New"}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-xs opacity-70 mb-3">
                          <span>{selectedLecture.duration}</span>
                          <span>•</span>
                          <span>{selectedLecture.views} views</span>
                          <span>•</span>
                          <span>{new Date(selectedLecture.uploadDate).toLocaleDateString()}</span>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                              if (selectedLecture.videoUrl.includes('.mp4')) {
                                if (videoRef) {
                                  videoRef.play();
                                }
                              } else {
                                window.open(selectedLecture.videoUrl, '_blank');
                              }
                            }}
                          >
                            <Play className="w-4 h-4 mr-1" />
                            Watch Now
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (selectedLecture.videoUrl.includes('.mp4')) {
                                const link = document.createElement('a');
                                link.href = selectedLecture.videoUrl;
                                link.download = `${selectedLecture.title}.mp4`;
                                link.click();
                              }
                            }}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Circuit Content (Right 50%) - Only for Mathematics */}
                    <div className="relative bg-gray-800 flex flex-col p-4 gap-4">
                      {subjectId === 'math' ? (
                        <>
                          {/* Circuit Builder Game Card */}
                          <div className="flex-1 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-lg p-4 hover:from-blue-600/30 hover:to-purple-600/30 transition-all duration-300">
                            <div className="flex items-center gap-3 mb-3">
                              <img
                                src={circuitGameImage}
                                alt="Circuit Builder Game"
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                              <div className="flex-1">
                                <h4 className="text-base font-medium text-white mb-1">Circuit Builder Game</h4>
                                <p className="text-sm text-white/70">Build and test electrical circuits interactively</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 text-xs text-white/60 mb-3">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                15-20 min
                              </span>
                              <span className="flex items-center gap-1">
                                <Brain className="w-3 h-3" />
                                Interactive
                              </span>
                            </div>

                            <Button
                              size="sm"
                              className="w-full"
                              variant="secondary"
                              onClick={() => {
                                console.log('Navigating to games...');
                                navigate('/games');
                              }}
                            >
                              <Gamepad2 className="w-3 h-3 mr-1" />
                              Play Game
                            </Button>
                          </div>

                          {/* Circuit Quiz Card */}
                          <div className="flex-1 bg-gradient-to-br from-green-600/20 to-teal-600/20 rounded-lg p-4 hover:from-green-600/30 hover:to-teal-600/30 transition-all duration-300">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
                                <Brain className="w-6 h-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-base font-medium text-white mb-1">Circuit Knowledge Quiz</h4>
                                <p className="text-sm text-white/70">Test your understanding of electrical circuits and components</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 text-xs text-white/60 mb-3">
                              <span>10 questions</span>
                              <span>•</span>
                              <span>5-10 min</span>
                            </div>

                            <Button
                              size="sm"
                              className="w-full"
                              variant="secondary"
                              onClick={() => {
                                console.log('Navigating to circuit quiz...');
                                navigate('/quiz/14/attempt/1');
                              }}
                            >
                              <Brain className="w-3 h-3 mr-1" />
                              Take Quiz
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Default Related Video for other subjects */}
                          {(() => {
                            const relatedVideo = getRelatedVideo(selectedLecture);
                            return (
                              <>
                                <div className="relative flex-1 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                                  <div className="text-center text-white">
                                    <Play className="w-12 h-12 mx-auto mb-3 opacity-70" />
                                    <h4 className="text-base font-medium mb-2">{relatedVideo.title}</h4>
                                    <p className="text-sm opacity-70 mb-3">{relatedVideo.description}</p>
                                    <div className="flex items-center justify-center gap-3 text-xs opacity-60">
                                      <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {relatedVideo.duration}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Eye className="w-3 h-3" />
                                        {relatedVideo.views} views
                                      </span>
                                    </div>
                                  </div>
                                  <Button
                                    className="absolute top-3 right-3"
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => {
                                      setSelectedLecture(relatedVideo);
                                    }}
                                  >
                                    <Play className="w-3 h-3 mr-1" />
                                    Switch
                                  </Button>
                                </div>

                                {/* Related Video Info Panel */}
                                <div className="p-4 bg-gray-800 text-white">
                                  <div className="mb-2">
                                    <h5 className="font-medium text-sm mb-1">Next: {relatedVideo.title}</h5>
                                    <p className="text-xs opacity-70 mb-2 line-clamp-2">{relatedVideo.description}</p>
                                  </div>

                                  <div className="flex items-center gap-3 text-xs opacity-60 mb-3">
                                    <span>{relatedVideo.duration}</span>
                                    <span>•</span>
                                    <span>{relatedVideo.views} views</span>
                                  </div>

                                  <Button
                                    size="sm"
                                    className="w-full"
                                    variant="secondary"
                                    onClick={() => setSelectedLecture(relatedVideo)}
                                  >
                                    <Play className="w-3 h-3 mr-1" />
                                    Watch Next
                                  </Button>
                                </div>
                              </>
                            );
                          })()}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* YouTube-style Video Grid */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-4">📹 Video Lectures</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lectures.map((lecture, index) => (
                  <Card
                    key={lecture.id}
                    className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group hover:scale-[1.02]"
                    onClick={() => handleVideoClick(lecture)}
                  >
                    <div className="relative">
                      {/* YouTube-style Thumbnail */}
                      <div className="w-full aspect-video rounded-t-lg overflow-hidden relative group">
                        <img
                          src={lecture.thumbnail}
                          alt={lecture.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {/* Dark overlay on hover */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>

                        {/* Play button overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-16 h-16 bg-black/60 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <Play className="w-8 h-8 text-white ml-1" />
                          </div>
                        </div>

                        {/* Duration overlay */}
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                          {lecture.duration}
                        </div>
                        {/* Multi-language badge */}
                        {lecture.hasMultiLanguageAudio && (
                          <div className="absolute top-2 left-2">
                            <div className="bg-blue-600/90 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                              <Globe className="w-3 h-3" />
                              Multi-Lang
                            </div>
                          </div>
                        )}
                        {/* Completion badge */}
                        {lecture.isCompleted && (
                          <div className="absolute top-2 right-2">
                            <CheckCircle className="w-5 h-5 text-green-500 bg-white rounded-full shadow-sm" />
                          </div>
                        )}
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-base group-hover:text-primary transition-colors line-clamp-2">
                          {lecture.title}
                        </h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {lecture.description}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{lecture.views} views</span>
                          <span>•</span>
                          <span>{new Date(lecture.uploadDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default SubjectLectures;