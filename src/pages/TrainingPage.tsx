// src/pages/TrainingPage.tsx

import React, { useState, useMemo } from 'react';
import type { FC } from 'react';
import { useCourses, useCourse, useUpdateVideoProgress } from '../hooks/useTraining';
import type { VideoCourse, Video } from '../hooks/useTraining';
import { 
    FaPlayCircle, FaChevronLeft, FaClock, FaStar, FaVideo, FaSearch, FaFilter, FaUsers, FaBookOpen, FaChevronRight, FaCheckCircle 
} from 'react-icons/fa';
import VimeoPlayer from '../components/VimeoPlayer';

// --- Reusable Glass Card Component ---
const GlassCard: FC<{ children: React.ReactNode; className?: string; padding?: string }> = ({ children, className = '', padding = 'p-6' }) => (
    <div className={`relative overflow-hidden border border-neutral-800 rounded-3xl transition-all duration-300 hover:border-neutral-700 hover:-translate-y-1 ${className}`} style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
        <div className={`relative ${padding}`} style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0) 50%, rgba(255, 255, 255, 0.05) 100%)' }}>
            {children}
        </div>
    </div>
);

// --- Course Card (List View) ---
const CourseCard: FC<{ course: VideoCourse; onClick: () => void }> = ({ course, onClick }) => {
    const mockData = { rating: 4.9, duration: "4h 30m", lessons: course.totalVideos || 32, instructor: "Sophie Martin", price: 99, difficulty: "Débutant", image: `/images/course-default.png` };
    return (
        <GlassCard className="flex flex-col cursor-pointer" padding="p-0">
            <div onClick={onClick}>
                <div className="relative w-full h-48 bg-[#1C1E22] rounded-t-3xl overflow-hidden"><img src={mockData.image} alt={course.title} className="w-full h-full object-cover"/><span className="absolute top-3 left-3 text-xs px-3 py-1 rounded-full bg-black/40 text-white backdrop-blur-sm">{mockData.difficulty}</span></div>
                <div className="p-5 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2"><h3 className="font-bold text-white text-lg pr-2">{course.title}</h3><div className="flex items-center gap-1 text-yellow-400 flex-shrink-0"><FaStar/> {mockData.rating}</div></div>
                    <p className="text-neutral-400 text-sm mb-4 flex-grow">{course.description || "Guide complet pour créer votre première boutique Shopify de A à Z."}</p>
                    <hr className="border-neutral-800 my-3" />
                    <div className="flex justify-between items-center text-sm text-neutral-400 mb-4"><span className="flex items-center gap-1.5"><FaClock/> {mockData.duration}</span><span className="flex items-center gap-1.5"><FaBookOpen/> {mockData.lessons} leçons</span></div>
                    <p className="text-sm text-neutral-500">par {mockData.instructor}</p>
                    <div className="flex justify-between items-center mt-4"><p className="text-2xl font-bold text-white">{mockData.price}€</p><button className="group flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-gray-200 text-black font-semibold transition-colors hover:bg-gray-300">Acheter <FaChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-1" /></button></div>
                </div>
            </div>
        </GlassCard>
    );
};

// --- Video Player & Playlist Component (Detail View) ---
const CourseDisplay: FC<{ course: VideoCourse }> = ({ course }) => {
    const [currentVideo, setCurrentVideo] = useState<Video | null>(course.videos?.[0] || null);
    const { mutate: updateProgress, isPending } = useUpdateVideoProgress();

    const handleVideoEnded = () => {
        if (currentVideo && !isPending) {
            updateProgress({ videoId: currentVideo.id, completed: true });
            const currentIndex = course.videos.findIndex(v => v.id === currentVideo.id);
            if (currentIndex < course.videos.length - 1) {
                setCurrentVideo(course.videos[currentIndex + 1]);
            }
        }
    };

    const completedVideos = useMemo(() => new Set(course.videos.filter(v => v.progress[0]?.completed).map(v => v.id)), [course.videos]);

    if (!currentVideo) {
        return <p className="text-neutral-400 text-center p-8">Ce cours ne contient aucune vidéo pour le moment.</p>;
    }

    return (
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            <div className="lg:col-span-2">
                <div className="aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-2xl shadow-black/30 mb-6">
                    <VimeoPlayer key={currentVideo.id} vimeoId={currentVideo.vimeoId} onEnded={handleVideoEnded} />
                </div>
                <GlassCard>
                    <h2 className="text-2xl font-bold text-white">{currentVideo.title}</h2>
                    <p className="text-neutral-400 mt-2">{currentVideo.description}</p>
                </GlassCard>
            </div>
            <div className="lg:col-span-1 mt-8 lg:mt-0">
                <GlassCard className="h-full" padding="p-5">
                    <h3 className="text-lg font-bold text-white mb-4 px-2">Leçons ({completedVideos.size} / {course.videos.length})</h3>
                    <ul className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                        {course.videos.map((video) => {
                            const isCompleted = completedVideos.has(video.id);
                            const isActive = currentVideo.id === video.id;
                            return (
                                <li key={video.id}>
                                    <button onClick={() => setCurrentVideo(video)}
                                        className={`w-full text-left p-3 rounded-lg transition-colors flex items-center gap-4 ${isActive ? 'bg-neutral-800' : 'hover:bg-neutral-800/50'}`}
                                    >
                                        <div className="flex-shrink-0 text-xl">
                                            {isCompleted ? <FaCheckCircle className="text-green-500" /> : <FaPlayCircle className={isActive ? 'text-white' : 'text-neutral-500'} />}
                                        </div>
                                        <div>
                                            <p className={`font-semibold leading-tight ${isCompleted ? 'line-through text-neutral-500' : 'text-white'}`}>{video.title}</p>
                                            {video.duration && <p className={`text-xs mt-1 flex items-center gap-1.5 ${isActive ? 'text-white/80' : 'text-neutral-400'}`}><FaClock size={10} /> {video.duration} minutes</p>}
                                        </div>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </GlassCard>
            </div>
        </div>
    );
};


// --- Course Detail View Container ---
const CourseDetailView: FC<{ courseId: string; onBack: () => void }> = ({ courseId, onBack }) => {
    const { data: course, isLoading, isError } = useCourse(courseId);

    return (
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
            <button onClick={onBack} className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
                <FaChevronLeft />
                <span>Retour à tous les cours</span>
            </button>
            {isLoading && <p className="text-center text-neutral-400">Chargement du cours...</p>}
            {isError && <p className="text-center text-red-500">Erreur lors du chargement du cours.</p>}
            {course && (
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">{course.title}</h1>
                    <p className="text-neutral-400 mt-1 mb-8">{course.description}</p>
                    <CourseDisplay course={course} />
                </div>
            )}
        </main>
    );
};

// --- Main Training Page Component (Controller) ---
export const TrainingPage: FC = () => {
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
    const { data: courses, isLoading, isError } = useCourses();

    const statCards = [
        { icon: <FaVideo/>, value: "52", label: "Cours Totaux", color: "text-blue-400", bgColor: "bg-blue-900/20" },
        { icon: <FaClock/>, value: "180+", label: "Heures Totales", color: "text-red-400", bgColor: "bg-red-900/20" },
        { icon: <FaUsers/>, value: "45K+", label: "Étudiants", color: "text-green-400", bgColor: "bg-green-900/20" },
        { icon: <FaStar/>, value: "4.8", label: "Note Moyenne", color: "text-yellow-400", bgColor: "bg-yellow-900/20" }
    ];

    // RENDER DETAIL VIEW IF A COURSE IS SELECTED
    if (selectedCourseId) {
        return <CourseDetailView courseId={selectedCourseId} onBack={() => setSelectedCourseId(null)} />;
    }

    // RENDER COURSE LIST VIEW
    return (
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-10">
            <div>
                <h1 className="text-4xl font-bold text-white">Formation Vidéo Shopify</h1>
                <p className="text-neutral-400 mt-1">Maîtrisez la création de boutique Shopify avec nos formations vidéo expertes</p>
            </div>
            <GlassCard padding="p-5">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative w-full flex-grow"><FaSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-neutral-500"/><input type="text" placeholder="Rechercher des cours..." className="w-full bg-[#111317] border border-neutral-700 rounded-lg h-12 pl-11 pr-4 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-gray-400"/></div>
                    <div className="flex gap-2 w-full md:w-auto"><button className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2 h-12 text-sm rounded-lg bg-[#1C1E22] border border-neutral-700 text-white font-semibold transition-colors hover:bg-neutral-800 whitespace-nowrap"><FaFilter/> Plus de filtres</button><button className="flex-1 md:flex-initial px-4 py-2 h-12 text-sm rounded-lg bg-[#1C1E22] border border-neutral-700 text-white font-semibold transition-colors hover:bg-neutral-800">Débutant</button><button className="flex-1 md:flex-initial px-4 py-2 h-12 text-sm rounded-lg bg-[#1C1E22] border border-neutral-700 text-white font-semibold transition-colors hover:bg-neutral-800">Intermédiaire</button><button className="flex-1 md:flex-initial px-4 py-2 h-12 text-sm rounded-lg bg-[#1C1E22] border border-neutral-700 text-white font-semibold transition-colors hover:bg-neutral-800">Avancé</button></div>
                </div>
            </GlassCard>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
                    <GlassCard key={i} padding="p-5">
                         <div className={`w-10 h-10 flex items-center justify-center rounded-xl border border-neutral-700 ${stat.bgColor} ${stat.color} mb-4`}>{stat.icon}</div>
                         <p className="text-neutral-400 text-sm">{stat.label}</p>
                         <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                    </GlassCard>
                ))}
            </div>
            <section>
                <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold text-white">Tous les Cours</h2><button className="px-4 py-2 text-sm rounded-lg bg-[#1C1E22] border border-neutral-700 text-white font-semibold transition-colors hover:bg-neutral-800">Tout voir</button></div>
                {isLoading && <p className="text-center text-neutral-400">Chargement des cours...</p>}
                {isError && <p className="text-center text-red-500">Erreur lors du chargement des cours.</p>}
                {courses && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <CourseCard key={course.id} course={course} onClick={() => setSelectedCourseId(course.id)} />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
};