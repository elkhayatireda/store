import React, { useState } from 'react';

const StarRating = ({ rating, onRatingChange }) => {
  const [hoveredIndex, setHoveredIndex] = useState(-1); // Track the hovered star index

  const handleMouseEnter = (index) => {
    setHoveredIndex(index); // Set the index of the hovered star
  };

  const handleMouseLeave = () => {
    setHoveredIndex(-1); // Reset hovered index when mouse leaves
  };

  const handleMouseDown = (index) => {
    onRatingChange(index + 1); // Set the rating to index + 1 (1-5)
  };

  return (
    <div
      className="border-2 border-gray-200 rounded p-2 w-full flex items-center gap-3"
      onMouseLeave={handleMouseLeave} // Reset hover on mouse leave
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="w-7"
          onMouseEnter={() => handleMouseEnter(index)} // Update hovered star on hover
          onMouseDown={() => handleMouseDown(index)} // Set stars on click
        >
          <img
            src={
              index < (hoveredIndex >= 0 ? hoveredIndex + 1 : rating)
                ? "/assets/star.svg"
                : "/assets/unstar.svg"
            }
            alt={index < (hoveredIndex >= 0 ? hoveredIndex + 1 : rating) ? "star" : "unstar"}
            className="w-7 cursor-pointer"
          />
        </div>
      ))}
    </div>
  );
};

export default StarRating;
