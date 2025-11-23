import { PenBoxIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const Lecture = ({ lecture, courseId, index }) => {
  const navigate = useNavigate();

  const goToUpdateLecture = () => {
    navigate(`${lecture._id}`);
  };

  return (
    <div className="flex flex-wrap items-center justify-between 
      bg-white dark:bg-gray-700 px-4 py-3 rounded-md my-2">

      <h1 className="font-semibold text-gray-800 dark:text-gray-100 break-words">
        Lecture {index + 1}: {lecture.lectureTitle}
      </h1>

      <PenBoxIcon
        onClick={goToUpdateLecture}
        size={22}
        className="cursor-pointer text-gray-600 dark:text-gray-300 
        hover:text-blue-600 dark:hover:text-blue-400 transition"
      />
    </div>
  );
};

export default Lecture;
