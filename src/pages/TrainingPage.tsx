// src/pages/TrainingPage.tsx

import React, { useState, useMemo } from 'react';
import type { FC } from 'react';
import { useCourses, useCourse, useUpdateVideoProgress } from '../hooks/useTraining';
import type { VideoCourse, Video } from '../hooks/useTraining';
import { FaPlayCircle, FaChevronLeft, FaClock, FaGraduationCap, FaCheckCircle } from 'react-icons/fa';
import CloudinaryPlayer from '../components/CloudinaryPlayer';
import ProgressCircle from '../components/ProgressCircle';

// --- Reusable Loader Component ---
const Loader: FC = () => (
    <div className="flex justify-center items-center p-8">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[#f97316]"></div>
    </div>
);

// --- Video Player and Playlist Component ---
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

    const completedVideos = useMemo(() =>
        new Set(course.videos.filter(v => v.progress[0]?.completed).map(v => v.id)),
        [course.videos]
    );

    if (!currentVideo) {
        return <p className="text-neutral-400 text-center p-8">Ce cours ne contient aucune vidéo pour le moment.</p>;
    }

    return (
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            <div className="lg:col-span-2">
                <div className="aspect-video w-full bg-black rounded-lg overflow-hidden shadow-2xl shadow-black/30">
                    <CloudinaryPlayer
                        key={currentVideo.id}
                        src={currentVideo.videoUrl}
                        onEnded={handleVideoEnded}
                    />
                </div>
                <div className="mt-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-white">{currentVideo.title}</h2>
                    <p className="text-neutral-400 mt-2">{currentVideo.description}</p>
                </div>
            </div>
            <div className="lg:col-span-1 mt-8 lg:mt-0">
                <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#374151]">
                    <h3 className="text-lg font-bold text-white mb-4 px-2">
                        Leçons ({completedVideos.size} / {course.videos.length} complétées)
                    </h3>
                    <ul className="space-y-2 max-h-[60vh] overflow-y-auto">
                        {course.videos.map((video) => {
                            const isCompleted = completedVideos.has(video.id);
                            return (
                                <li key={video.id}>
                                    <button
                                        onClick={() => setCurrentVideo(video)}
                                        className={`w-full text-left p-3 rounded-md transition-colors flex items-center gap-4 ${currentVideo.id === video.id
                                            ? 'bg-[#f97316] text-white'
                                            : 'hover:bg-neutral-700/50'
                                            }`}
                                    >
                                        <div className="flex-shrink-0">
                                            {isCompleted ? <FaCheckCircle className="w-6 h-6 text-green-500" /> : <FaPlayCircle className={`w-6 h-6 ${currentVideo.id === video.id ? 'text-white' : 'text-[#f97316]'}`} />}
                                        </div>
                                        <div>
                                            <p className={`font-semibold leading-tight ${isCompleted ? 'line-through text-neutral-400' : 'text-white'}`}>{video.title}</p>
                                            {video.duration && (
                                                <p className={`text-xs mt-1 flex items-center gap-1.5 ${currentVideo.id === video.id ? 'text-white/80' : 'text-neutral-400'}`}>
                                                    <FaClock /> {video.duration} minutes
                                                </p>
                                            )}
                                        </div>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
};

// --- Course Detail View ---
const CourseDetailView: FC<{ courseId: string; onBack: () => void }> = ({ courseId, onBack }) => {
    const { data: course, isLoading, isError } = useCourse(courseId);

    return (
        <div>
            <button onClick={onBack} className="flex items-center gap-2 text-[#f97316] font-semibold mb-6 hover:opacity-80 transition-opacity">
                <FaChevronLeft />
                Retour à tous les cours
            </button>
            {isLoading && <Loader />}
            {isError && <p className="text-red-500 text-center">Erreur lors du chargement du cours.</p>}
            {course && <CourseDisplay course={course} />}
        </div>
    );
};

// --- Main Training Page Component ---
export const TrainingPage: FC = () => {
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
    const { data: courses, isLoading, isError } = useCourses();

    if (selectedCourseId) {
        return (
            <main className="flex-1 overflow-y-auto p-4 md:p-8">
                <CourseDetailView courseId={selectedCourseId} onBack={() => setSelectedCourseId(null)} />
            </main>
        );
    }

    return (
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Formation Vidéo</h1>
            <p className="mt-2 text-neutral-400 max-w-2xl">
                Suivez vos progrès et devenez un expert du e-commerce, une leçon à la fois.
            </p>

            <div className="mt-10">
                {isLoading && <Loader />}
                {isError && <p className="text-red-500 text-center">Erreur lors du chargement des formations.</p>}
                {courses && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.map((course) => {
                            const progress = (course.totalVideos && course.completedVideos && course.totalVideos > 0)
                                ? (course.completedVideos / course.totalVideos) * 100
                                : 0;

                            return (
                                <div
                                    key={course.id}
                                    onClick={() => setSelectedCourseId(course.id)}
                                    className="group relative bg-gradient-to-br from-neutral-800/60 to-neutral-700/40 p-6 rounded-2xl border border-neutral-600/30 backdrop-blur-xl hover:border-[#f97316]/40 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 flex flex-col"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-grow pr-4">
                                            <div className="bg-gradient-to-br from-[#f97316] to-[#ea580c] p-3 rounded-xl inline-flex shadow-lg shadow-[#f97316]/25 mb-4">
                                                <FaGraduationCap className="h-6 w-6 text-white" />
                                            </div>
                                            <h3 className="text-lg font-bold text-white font-montserrat line-clamp-2">{course.title}</h3>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <ProgressCircle progress={progress} />
                                        </div>
                                    </div>
                                    
                                    <div className="flex-grow mt-4">
                                        <p className="text-neutral-400 text-sm leading-relaxed line-clamp-3">{course.description}</p>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-neutral-700/50">
                                        <p className="text-sm font-semibold text-neutral-300">
                                            {course.completedVideos} / {course.totalVideos} leçons complétées
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
};